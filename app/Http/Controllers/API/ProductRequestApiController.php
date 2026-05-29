<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\UserProductRequest;
use App\Jobs\SendProductRequestNotificationJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProductRequestApiController extends Controller
{
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'nullable|string|max:250',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if (empty($request->description) && !$request->hasFile('image')) {
            return CommonHelper::responseError('either_description_or_image_must_be_provided');
        }

        try {
            $productRequest = new UserProductRequest();
            $productRequest->customer_id = auth()->user()->id;
            $productRequest->description = $request->description;
            $productRequest->status = UserProductRequest::STATUS_PENDING;

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $imagePath = Storage::disk('public')->putFileAs('user_product_requests', $file, $fileName);
                $productRequest->image = $imagePath;
            }

            $productRequest->save();

            return CommonHelper::responseSuccessWithData('product_request_submitted_successfully', $productRequest);
        } catch (\Exception $e) {
            Log::error('Error creating product request: ' . $e->getMessage());
            return CommonHelper::responseError('Something went wrong while creating the request.');
        }
    }

    public function getAuthUserRequests(Request $request)
    {
        try {
            $customerId = auth()->user()->id;
            $status = $request->get('status');
            $limit = $request->get('limit', 10);
            $offset = $request->get('offset', 0);

            $query = UserProductRequest::with(['product.seller'])
                ->byCustomer($customerId)
                ->orderBy('created_at', 'desc');

            if ($status && in_array($status, ['pending', 'accepted', 'rejected'])) {
                $query->where('status', $status);
            }

            $requests = $query->skip($offset)->take($limit)->get();

            // Transform the data to include only product name and seller name
            $transformedRequests = $requests->map(function ($request) {
                $data = $request->toArray();

                // format dates
                $data['created_at'] = CommonHelper::formatDateTime($request->created_at);
                $data['updated_at'] = CommonHelper::formatDateTime($request->updated_at);

                if ($request->product) {
                    $data['product'] = [
                        'id' => $request->product->id,
                        'name' => $request->product->name,
                        'seller_name' => $request->product->seller ? $request->product->seller->name : null
                    ];
                } else {
                    $data['product'] = null;
                }

                return $data;
            });

            $total = UserProductRequest::where('customer_id', $customerId)->count();

            return CommonHelper::responseWithData($transformedRequests, $total);
        } catch (\Exception $e) {
            return CommonHelper::responseError('something_went_wrong');
        }
    }

    public function getAllRequests(Request $request)
    {
        try {
            $status = $request->get('status');

            $query = UserProductRequest::with(['customer', 'product'])
                ->orderBy('created_at', 'desc');

            if ($status && in_array($status, ['pending', 'accepted', 'rejected'])) {
                $query->where('status', $status);
            }

            $requests = $query->paginate(15);

            $requests->getCollection()->transform(function (UserProductRequest $item) {
                $row = $item->toArray();
                $rawCreated = $item->getAttributes()['created_at'] ?? null;
                if ($rawCreated !== null && $rawCreated !== '') {
                    $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
                }
                return $row;
            });

            return CommonHelper::responseWithData($requests);
        } catch (\Exception $e) {
            return CommonHelper::responseError('something_went_wrong');
        }
    }

    public function updateStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:user_product_requests,id',
            'status' => 'required|in:accepted,rejected',
            'product_id' => 'required_if:status,accepted|exists:products,id',
            'admin_notes' => 'required_if:status,rejected|string|max:1000',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $productRequest = UserProductRequest::findOrFail($request->id);


            if ($request->status === 'rejected') {
                $productRequest->admin_notes = $request->admin_notes;
            }

            $productRequest->status = $request->status;

            if ($request->status === 'accepted' && $request->product_id) {
                $productRequest->product_id = $request->product_id;
            }

            $productRequest->save();

            try {
                dispatch(new SendProductRequestNotificationJob($productRequest, 'status_update'))->afterResponse();
            } catch (\Exception $e) {
                Log::error("Product request notification error: " . $e->getMessage());
            }

            return CommonHelper::responseSuccess('product_request_status_updated_successfully', $productRequest->load(['customer', 'product']));
        } catch (\Exception $e) {
            return CommonHelper::responseError('something_went_wrong');
        }
    }


    public function getRequestDetails($id)
    {
        try {
            $request = UserProductRequest::with(['customer', 'product'])
                ->findOrFail($id);

            return CommonHelper::responseWithData($request);
        } catch (\Exception $e) {
            return CommonHelper::responseError('request_not_found');
        }
    }

    public function delete($id)
    {
        try {
            $productRequest = UserProductRequest::findOrFail($id);

            if ($productRequest->image && Storage::disk('public')->exists($productRequest->image)) {
                Storage::disk('public')->delete($productRequest->image);
            }

            $productRequest->delete();

            return CommonHelper::responseSuccess('product_request_deleted_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError('something_went_wrong');
        }
    }
}
