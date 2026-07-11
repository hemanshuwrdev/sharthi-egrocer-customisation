<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\ReturnRequest;
use App\Models\ReturnStatusList;
use App\Models\Role;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusList;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ReturnRequestsApiController extends Controller
{
    public function index()
    {
        $search = request()->get('search');
        $query = ReturnRequest::select(
            'return_requests.*',
            'users.name as customer_name',
            'users.name',
            'order_items.product_variant_id',
            'order_items.quantity',
            'order_items.price',
            'order_items.sub_total',
            'order_items.discounted_price',
            'order_items.product_name',
            'order_items.variant_name',
            'products.id as product_id',
            'product_variants.measurement',
            'product_variants.stock_unit_id'
        )
            ->leftJoin('users', 'return_requests.user_id', '=', 'users.id')
            ->leftJoin('order_items', 'return_requests.order_item_id', '=', 'order_items.id')
            ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->when($search, function ($q) use ($search) {
                if (is_numeric($search)) {
                    $q->where(function ($sub) use ($search) {
                        $sub->where('return_requests.id', $search)
                            ->orWhere('return_requests.user_id', $search)
                            ->orWhere('order_items.quantity', $search)
                            ->orWhere('order_items.sub_total', $search);
                    });
                } else {
                    $timestamp = strtotime($search);
                    if ($timestamp !== false) {
                        // Check if the search string looks like a date/time (contains separators or month names)
                        if (preg_match('/[\/\-\.\s]/', $search) || preg_match('/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i', $search)) {
                            $q->whereDate('return_requests.created_at', date('Y-m-d', $timestamp));
                            return;
                        }
                    }

                    $statusValue = null;
                    $searchLower = strtolower($search);
                    if ($searchLower == 'pending')
                        $statusValue = ReturnStatusList::$rPending;
                    elseif ($searchLower == 'approved')
                        $statusValue = ReturnStatusList::$rApproved;
                    elseif ($searchLower == 'rejected')
                        $statusValue = ReturnStatusList::$rRejected;
                    elseif (str_contains($searchLower, 'delivery boy'))
                        $statusValue = ReturnStatusList::$rDeliveryBoyAssigned;
                    elseif (str_contains($searchLower, 'pickup'))
                        $statusValue = ReturnStatusList::$rOutForPickup;
                    elseif (str_contains($searchLower, 'received'))
                        $statusValue = ReturnStatusList::$rReceivedFromCustomer;
                    elseif ($searchLower == 'cancelled')
                        $statusValue = ReturnStatusList::$rCancelled;
                    elseif (str_contains($searchLower, 'to seller'))
                        $statusValue = ReturnStatusList::$rReturnToSeller;

                    $q->where(function ($sub) use ($search, $statusValue) {
                        $sub->where('order_items.product_name', 'like', "%{$search}%")
                            ->orWhere('order_items.variant_name', 'like', "%{$search}%")
                            ->orWhere('return_requests.reason', 'like', "%{$search}%")
                            ->orWhere('users.name', 'like', "%{$search}%");
                        if ($statusValue !== null) {
                            $sub->orWhere('return_requests.status', $statusValue);
                        }
                    });
                }
            })
            ->orderBy('return_requests.id', 'DESC');

        $returnRequests = $query->get()->map(function (ReturnRequest $rr) {
            $row = $rr->toArray();
            $rawCreated = $rr->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            return $row;
        });

        return CommonHelper::responseWithData($returnRequests);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        if ($user->role_id == Role::$roleDeliveryBoy) {
            // Delivery Boys (role_id: 4) can only update to these specific statuses: Out for Pickup, Received from Customer, Return to Seller, Cancelled
            $allowedStatuses = [
                ReturnStatusList::$rOutForPickup,
                ReturnStatusList::$rReceivedFromCustomer,
                ReturnStatusList::$rCancelled,
                ReturnStatusList::$rReturnToSeller
            ];

            if (!in_array($request->status, $allowedStatuses)) {
                return CommonHelper::responseError('you_dont_have_permission_to_update_to_this_status');
            }

            $returnRequest = ReturnRequest::where('id', $request->id)
                ->where('delivery_boy_id', $user->deliveryBoy->id)
                ->first();

            if (!$returnRequest) {
                return CommonHelper::responseError('return_request_not_found_or_not_assigned_to_you');
            }
        } elseif ($user->role_id == Role::$roleSeller) {
            // Sellers (role_id: 3) can only update to these specific statuses: Pending, Delivery Boy Assigned, Approve, Reject
            $allowedStatuses = [
                ReturnStatusList::$rPending,
                ReturnStatusList::$rDeliveryBoyAssigned,
                ReturnStatusList::$rApproved,
                ReturnStatusList::$rRejected
            ];

            if (!in_array($request->status, $allowedStatuses)) {
                return CommonHelper::responseError('you_dont_have_permission_to_update_to_this_status');
            }

            $returnRequest = ReturnRequest::select('return_requests.*')
                ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
                ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
                ->where('return_requests.id', $request->id)
                ->where('products.seller_id', $user->seller->id)
                ->first();

            if (!$returnRequest) {
                return CommonHelper::responseError('return_request_not_found_or_you_dont_have_permission_to_update_this_request');
            }
        } else {
            // All other roles (not 3 and not 4) - Admin, Super Admin, etc. can access all return requests and all statuses
            $returnRequest = ReturnRequest::find($request->id);
            if (!$returnRequest) {
                return CommonHelper::responseError('return_request_not_found');
            }
        }

        // Validate status update
        $validationError = $this->validateStatusUpdate($returnRequest, $request->status);
        if ($validationError) {
            return CommonHelper::responseError($validationError);
        }

        return $this->processUpdate($request, $returnRequest, $user);
    }

    public function delete(Request $request)
    {
        $user = auth()->user();

        if (isset($request->id)) {
            $returnRequest = ReturnRequest::find($request->id);
            if ($returnRequest) {
                $returnRequest->delete();
                return CommonHelper::responseSuccess('return_request_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess('return_request_already_deleted');
            }
        }
    }

    public function deliveryBoyReturnRequests(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'delivery_boy_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $returnRequests = ReturnRequest::select(
            'return_requests.*',
            'users.name as customer_name',
            'users.name',
            'order_items.product_variant_id',
            'order_items.quantity',
            'order_items.price',
            'order_items.sub_total',
            'order_items.discounted_price',
            'order_items.product_name',
            'order_items.variant_name',
            'products.id as product_id',
            'product_variants.measurement',
            'product_variants.stock_unit_id'
        )
            ->leftJoin('users', 'return_requests.user_id', '=', 'users.id')
            ->leftJoin('order_items', 'return_requests.order_item_id', '=', 'order_items.id')
            ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->where('return_requests.delivery_boy_id', $request->delivery_boy_id)
            ->orderBy('return_requests.id', 'DESC')
            ->get();

        return CommonHelper::responseWithData($returnRequests);
    }

    public function sellerIndex(Request $request)
    {
        $offset = $request->get('offset', 0);
        $limit = $request->get('limit', 10);
        $startDate = $request->get('startDate');
        $endDate = $request->get('endDate');
        $search = $request->get('search', '');

        if ($offset < 0)
            $offset = 0;
        if ($limit < 1 || $limit > 100)
            $limit = 10;
        try {

            $query = ReturnRequest::select(
                'return_requests.*',
                'users.name as customer_name',
                'users.mobile as customer_mobile',
                'order_items.product_variant_id',
                'order_items.quantity',
                'order_items.price',
                'order_items.sub_total',
                'order_items.discounted_price',
                'order_items.product_name',
                'order_items.variant_name',
                DB::raw('COALESCE((SELECT op.method FROM order_payments op WHERE op.order_id = orders.id ORDER BY op.id DESC LIMIT 1), orders.payment_method) as payment_method'),
                'orders.final_total',
                'orders.id as order_number',
                'cities.id as city_id',
                'cities.name as city_name',
                'delivery_boys.name as delivery_boy_name',
                'delivery_boys.mobile as delivery_boy_mobile',
                'products.id as product_id',
                'product_variants.measurement',
                'product_variants.stock_unit_id'
            )
                ->leftJoin('users', 'return_requests.user_id', '=', 'users.id')
                ->leftJoin('order_items', 'return_requests.order_item_id', '=', 'order_items.id')
                ->leftJoin('orders', 'return_requests.order_id', '=', 'orders.id')
                ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
                ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
                ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
                ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
                ->leftJoin('delivery_boys', 'return_requests.delivery_boy_id', '=', 'delivery_boys.id');

            // Apply is_completed filter
            if ($request->has('is_completed') && $request->is_completed != "") {
                $completedStatuses = [
                    ReturnStatusList::$rApproved,
                    ReturnStatusList::$rRejected,
                    ReturnStatusList::$rCancelled,
                ];

                if ($request->is_completed == 1) {
                    $query->whereIn('return_requests.status', $completedStatuses);
                } else if ($request->is_completed == 0) {
                    $query->whereNotIn('return_requests.status', $completedStatuses);
                }
            }

            if (auth()->user()->role_id == Role::$roleSeller) {
                $seller_id = auth()->user()->seller->id;
                $query->where('order_items.seller_id', $seller_id);
            }

            // Apply date filters
            if (!empty($startDate)) {
                $query->whereDate('return_requests.created_at', '>=', $startDate);
            }

            if (!empty($endDate)) {
                $query->whereDate('return_requests.created_at', '<=', $endDate);
            }

            // Apply search filter
            if (!empty($search) && trim($search) !== '') {
                $searchTerm = trim($search);
                $query->where(function ($q) use ($searchTerm) {
                    if (is_numeric($searchTerm)) {
                        $q->where('return_requests.id', $searchTerm)
                            ->orWhere('return_requests.user_id', $searchTerm)
                            ->orWhere('order_items.quantity', $searchTerm)
                            ->orWhere('order_items.sub_total', $searchTerm);
                    } else {
                        $timestamp = strtotime($searchTerm);
                        if ($timestamp !== false) {
                            if (preg_match('/[\/\-\.\s]/', $searchTerm) || preg_match('/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i', $searchTerm)) {
                                $q->whereDate('return_requests.created_at', date('Y-m-d', $timestamp));
                                return;
                            }
                        }

                        $statusValue = null;
                        $searchLower = strtolower($searchTerm);
                        if ($searchLower == 'pending')
                            $statusValue = ReturnStatusList::$rPending;
                        elseif ($searchLower == 'approved')
                            $statusValue = ReturnStatusList::$rApproved;
                        elseif ($searchLower == 'rejected')
                            $statusValue = ReturnStatusList::$rRejected;
                        elseif (str_contains($searchLower, 'delivery boy'))
                            $statusValue = ReturnStatusList::$rDeliveryBoyAssigned;
                        elseif (str_contains($searchLower, 'pickup'))
                            $statusValue = ReturnStatusList::$rOutForPickup;
                        elseif (str_contains($searchLower, 'received'))
                            $statusValue = ReturnStatusList::$rReceivedFromCustomer;
                        elseif ($searchLower == 'cancelled')
                            $statusValue = ReturnStatusList::$rCancelled;
                        elseif (str_contains($searchLower, 'to seller'))
                            $statusValue = ReturnStatusList::$rReturnToSeller;

                        $q->where('return_requests.id', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('users.name', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('users.mobile', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('order_items.product_name', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('order_items.variant_name', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('return_requests.reason', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('orders.payment_method', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('delivery_boys.name', 'LIKE', '%' . $searchTerm . '%')
                            ->orWhere('cities.name', 'LIKE', '%' . $searchTerm . '%');

                        if ($statusValue !== null) {
                            $q->orWhere('return_requests.status', $statusValue);
                        }
                    }
                });
            }

            $totalCount = $query->count();

            $returnRequests = $query->orderBy('return_requests.id', 'DESC')
                ->offset($offset)
                ->limit($limit)
                ->get();

            // Attach translated return status name
            $useContentLanguage = $request->header('Content-Language') !== null
                && trim((string) $request->header('Content-Language')) !== '';
            $previousLocale = app()->getLocale();
            if ($useContentLanguage) {
                $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
                app()->setLocale($langCode);
            }
            foreach ($returnRequests as $row) {
                $row->order_status_name = ReturnStatusList::getTranslatedName((int) ($row->status ?? 0));
            }
            app()->setLocale($previousLocale);

            $returnRequests = $returnRequests->map(function (ReturnRequest $rr) {
                $row = $rr->toArray();
                $rawCreated = $rr->getAttributes()['created_at'] ?? null;
                if ($rawCreated !== null && $rawCreated !== '') {
                    $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
                }
                return $row;
            });

            return CommonHelper::responseWithData(
                $returnRequests,
                $totalCount
            );
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function returnRequestById(Request $request)
    {
        $user = auth()->user();

        if (!in_array($user->role_id, [Role::$roleSeller, Role::$roleDeliveryBoy])) {
            return CommonHelper::responseError('unauthorized_access_seller_or_delivery_boy_role_required');
        }

        $validator = Validator::make($request->all(), [
            'return_request_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Build return_request row with same fields as sellerIndex
        $baseQuery = ReturnRequest::select(
            'return_requests.*',
            'users.name as customer_name',
            'users.mobile as customer_mobile',
            'order_items.product_variant_id',
            'order_items.quantity',
            'order_items.price',
            'order_items.sub_total',
            'order_items.discounted_price',
            'order_items.product_name',
            'order_items.variant_name',
            DB::raw('COALESCE((SELECT op.method FROM order_payments op WHERE op.order_id = orders.id ORDER BY op.id DESC LIMIT 1), orders.payment_method) as payment_method'),
            'orders.final_total',
            'orders.id as order_number',
            'cities.id as city_id',
            'cities.name as city_name',
            'delivery_boys.name as delivery_boy_name',
            'delivery_boys.mobile as delivery_boy_mobile',
            'products.id as product_id',
            'product_variants.measurement',
            'product_variants.stock_unit_id'
        )
            ->leftJoin('users', 'return_requests.user_id', '=', 'users.id')
            ->leftJoin('order_items', 'return_requests.order_item_id', '=', 'order_items.id')
            ->leftJoin('orders', 'return_requests.order_id', '=', 'orders.id')
            ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
            ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
            ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('delivery_boys', 'return_requests.delivery_boy_id', '=', 'delivery_boys.id');

        if ($user->role_id == Role::$roleSeller) {
            $baseQuery->where('order_items.seller_id', $user->seller->id);
        } elseif ($user->role_id == Role::$roleDeliveryBoy) {
            $baseQuery->where('return_requests.delivery_boy_id', $user->deliveryBoy->id);
        }

        $baseQuery->where('return_requests.id', $request->return_request_id);
        $returnRequest = $baseQuery->first();
        if (!$returnRequest) {
            return CommonHelper::responseError('return_request_not_found_or_you_dont_have_permission_to_view_this_request');
        }
        $returnRequest->created_at = CommonHelper::formatDateTime($returnRequest->created_at);
        $returnRequest->updated_at = CommonHelper::formatDateTime($returnRequest->updated_at);

        // Translated return status name
        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';
        $previousLocale = app()->getLocale();
        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }
        $returnRequest->order_status_name = ReturnStatusList::getTranslatedName((int) ($returnRequest->status ?? 0));
        app()->setLocale($previousLocale);

        // Build return_item (same shape as order_items in CommonHelper::getOrderDetails)
        $returnItem = Order::select(
            'order_items.*',
            'orders.mobile',
            'orders.total',
            'orders.delivery_charge',
            'orders.discount',
            'orders.promo_code',
            'orders.promo_discount',
            'orders.wallet_balance',
            'orders.final_total',
            DB::raw('COALESCE((SELECT op.method FROM order_payments op WHERE op.order_id = orders.id ORDER BY op.id DESC LIMIT 1), orders.payment_method) as payment_method'),
            'orders.address',
            'orders.delivery_time',
            'users.name as user_name',
            'order_items.status as order_status',
            'sellers.name as seller_name',
            'products.id as product_id',
            'products.return_status',
            'products.return_days',
            DB::raw('CONCAT("' . asset('storage/') . '", "/", products.image) as image'),
            'os.id as active_status',
            'os.status as status_name'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->leftJoin('order_status_lists as os', 'order_items.active_status', '=', 'os.id')
            ->where('orders.id', $returnRequest->order_id)
            ->where('order_items.id', $returnRequest->order_item_id)
            ->first();

        // Add tax_amount to price and discounted_price, and calculate amount_to_refund
        if ($returnItem) {
            $returnItem->delivery_time = !empty($returnItem->delivery_time) && $returnItem->delivery_time != '01-01-1970'
                ? CommonHelper::formatDate($returnItem->delivery_time)
                : '';
            $returnItem->created_at = CommonHelper::formatDateTime($returnItem->created_at);
            $returnItem->updated_at = CommonHelper::formatDateTime($returnItem->updated_at);
            $tax_amount = (float) ($returnItem->tax_amount ?? 0);
            $returnItem->price = (float) CommonHelper::doubleNumber($returnItem->price + $tax_amount);
            $returnItem->discounted_price = (float) CommonHelper::doubleNumber(
                ($returnItem->discounted_price != 0 ? $returnItem->discounted_price + $tax_amount : 0)
            );

            $order = Order::find($returnRequest->order_id);
            $returnItem->amount_to_refund = CommonHelper::calculateRefundAmountForOrderItem($order, $returnItem);
        }

        // Flatten: return_request fields at root, nested return_item
        $data = $returnRequest->toArray();
        // ✅ Apply formatting HERE (array level)
        $data['created_at'] = CommonHelper::formatDateTime($returnRequest->created_at);
        $data['updated_at'] = CommonHelper::formatDateTime($returnRequest->updated_at);
        $data['return_item'] = $returnItem ? $returnItem->toArray() : null;

        if ($data['return_item']) {
            $data['return_item']['created_at'] = CommonHelper::formatDateTime($returnItem->created_at);
            $data['return_item']['updated_at'] = CommonHelper::formatDateTime($returnItem->updated_at);
        }

        return CommonHelper::responseWithData($data);
    }

    public function sellerUpdate(Request $request)
    {
        $user = auth()->user();
        if ($user->role_id != Role::$roleSeller) {
            return CommonHelper::responseError('unauthorized_access_seller_role_required');
        }

        $allowedStatuses = [
            ReturnStatusList::$rPending,
            ReturnStatusList::$rDeliveryBoyAssigned,
            ReturnStatusList::$rApproved,
            ReturnStatusList::$rRejected
        ];

        if (!in_array($request->status, $allowedStatuses)) {
            return CommonHelper::responseError('you_dont_have_permission_to_update_to_this_status');
        }

        $returnRequest = ReturnRequest::select('return_requests.*')
            ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->where('return_requests.id', $request->id)
            ->where('products.seller_id', $user->seller->id)
            ->first();

        if (!$returnRequest) {
            return CommonHelper::responseError('return_request_not_found_or_you_dont_have_permission_to_update_this_request');
        }

        // Validate status update
        $validationError = $this->validateStatusUpdate($returnRequest, $request->status);
        if ($validationError) {
            return CommonHelper::responseError($validationError);
        }

        return $this->processUpdate($request, $returnRequest, $user);
    }

    public function returnRequestDelete(Request $request)
    {
        $user = auth()->user();

        if ($user->role_id != Role::$roleSeller) {
            return CommonHelper::responseError('unauthorized_access_seller_role_required');
        }

        $returnRequest = ReturnRequest::select('return_requests.*')
            ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->where('return_requests.id', $request->id)
            ->where('products.seller_id', $user->seller->id)
            ->first();

        if (!$returnRequest) {
            return CommonHelper::responseError('return_request_not_found_or_you_dont_have_permission_to_delete_this_request');
        }

        if (isset($request->id)) {
            $returnRequest->delete();
            return CommonHelper::responseSuccess('return_request_deleted_successfully');
        }
    }

    public function deliveryBoyIndex(Request $request)
    {
        $offset = $request->get('offset', 0);
        $limit = $request->get('limit', 10);
        $search = $request->get('search', '');

        if ($offset < 0) $offset = 0;
        if ($limit < 1 || $limit > 100) $limit = 10;

        $delivery_boy_id = auth()->user()->deliveryBoy->id;

        $query = ReturnRequest::select(
            'return_requests.*',
            'users.name',
            'users.mobile as customer_mobile',
            'order_items.product_variant_id',
            'order_items.quantity',
            'order_items.price',
            'order_items.sub_total',
            'order_items.discounted_price',
            'order_items.product_name',
            'order_items.variant_name',
            'orders.address as delivery_address',
            'orders.mobile as delivery_mobile',
            DB::raw('COALESCE((SELECT op.method FROM order_payments op WHERE op.order_id = orders.id ORDER BY op.id DESC LIMIT 1), orders.payment_method) as payment_method'),
            'orders.final_total',
            'cities.id as city_id'
        )
            ->leftJoin('users', 'return_requests.user_id', '=', 'users.id')
            ->leftJoin('order_items', 'return_requests.order_item_id', '=', 'order_items.id')
            ->leftJoin('orders', 'return_requests.order_id', '=', 'orders.id')
            ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
            ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
            ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
            ->where('return_requests.delivery_boy_id', $delivery_boy_id);

        // Apply is_completed filter
        if ($request->has('is_completed') && $request->is_completed != "") {
            $completedStatuses = [
                ReturnStatusList::$rApproved,
                ReturnStatusList::$rRejected,
                ReturnStatusList::$rCancelled,
            ];

            if ($request->is_completed == 1) {
                $query->whereIn('return_requests.status', $completedStatuses);
            } else if ($request->is_completed == 0) {
                $query->whereNotIn('return_requests.status', $completedStatuses);
            }
        }

        // Apply search filter
        if (!empty($search) && trim($search) !== '') {
            $searchTerm = trim($search);
            $query->where(function ($q) use ($searchTerm) {
                if (is_numeric($searchTerm)) {
                    $q->where('return_requests.id', $searchTerm)
                        ->orWhere('return_requests.user_id', $searchTerm)
                        ->orWhere('order_items.quantity', $searchTerm)
                        ->orWhere('order_items.sub_total', $searchTerm);
                } else {
                    $timestamp = strtotime($searchTerm);
                    if ($timestamp !== false) {
                        if (preg_match('/[\/\-\.\s]/', $searchTerm) || preg_match('/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i', $searchTerm)) {
                            $q->whereDate('return_requests.created_at', date('Y-m-d', $timestamp));
                            return;
                        }
                    }

                    $statusValue = null;
                    $searchLower = strtolower($searchTerm);
                    if ($searchLower == 'pending')
                        $statusValue = ReturnStatusList::$rPending;
                    elseif ($searchLower == 'approved')
                        $statusValue = ReturnStatusList::$rApproved;
                    elseif ($searchLower == 'rejected')
                        $statusValue = ReturnStatusList::$rRejected;
                    elseif (str_contains($searchLower, 'delivery boy'))
                        $statusValue = ReturnStatusList::$rDeliveryBoyAssigned;
                    elseif (str_contains($searchLower, 'pickup'))
                        $statusValue = ReturnStatusList::$rOutForPickup;
                    elseif (str_contains($searchLower, 'received'))
                        $statusValue = ReturnStatusList::$rReceivedFromCustomer;
                    elseif ($searchLower == 'cancelled')
                        $statusValue = ReturnStatusList::$rCancelled;
                    elseif (str_contains($searchLower, 'to seller'))
                        $statusValue = ReturnStatusList::$rReturnToSeller;

                    $q->where('return_requests.id', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('users.name', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('users.mobile', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('order_items.product_name', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('order_items.variant_name', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('return_requests.reason', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('orders.payment_method', 'LIKE', '%' . $searchTerm . '%');

                    if ($statusValue !== null) {
                        $q->orWhere('return_requests.status', $statusValue);
                    }
                }
            });
        }

        $totalCount = $query->count();

        $returnRequests = $query->orderBy('return_requests.id', 'DESC')
            ->offset($offset)
            ->limit($limit)
            ->get();

        // Attach translated return status name
        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';
        $previousLocale = app()->getLocale();
        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }
        foreach ($returnRequests as $row) {
            $row->order_status_name = ReturnStatusList::getTranslatedName((int) ($row->status ?? 0));
        }
        app()->setLocale($previousLocale);

        $returnRequests = $returnRequests->map(function (ReturnRequest $rr) {
            $row = $rr->toArray();
            $rawCreated = $rr->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            return $row;
        });

        return CommonHelper::responseWithData(
            $returnRequests,
            $totalCount
        );
    }

    public function deliveryBoyUpdate(Request $request)
    {
        $user = auth()->user();

        if ($user->role_id != Role::$roleDeliveryBoy) {
            return CommonHelper::responseError('unauthorized_access_delivery_boy_role_required');
        }

        $returnRequest = ReturnRequest::where('id', $request->id)
            ->where('delivery_boy_id', $user->deliveryBoy->id)
            ->first();

        if (!$returnRequest) {
            return CommonHelper::responseError('return_request_not_found_or_not_assigned_to_you');
        }

        // Validate status update
        $validationError = $this->validateStatusUpdate($returnRequest, $request->status);
        if ($validationError) {
            return CommonHelper::responseError($validationError);
        }

        $allowedStatuses = [
            ReturnStatusList::$rOutForPickup,
            ReturnStatusList::$rReceivedFromCustomer,
            ReturnStatusList::$rCancelled,
            ReturnStatusList::$rReturnToSeller
        ];

        if (!in_array($request->status, $allowedStatuses)) {
            return CommonHelper::responseError('you_dont_have_permission_to_update_to_this_status');
        }

        return $this->processUpdate($request, $returnRequest, $user);
    }

    private function validateStatusUpdate($returnRequest, $requestStatus)
    {
        if ($returnRequest->status == ReturnStatusList::$rApproved || $returnRequest->status == ReturnStatusList::$rRejected) {
            $statusName = ReturnStatusList::getTranslatedName((int) $returnRequest->status);
            return __('cannot_update_return_request_status_is_already') . $statusName . '.';
        }

        if ($returnRequest->status == $requestStatus) {
            $statusName = ReturnStatusList::getTranslatedName((int) $returnRequest->status);
            return __('this_return_request_is_already') . $statusName . '.';
        }

        $currentStatus = $returnRequest->status;
        $newStatus = $requestStatus;

        $statusHierarchy = [
            ReturnStatusList::$rPending => 1,
            ReturnStatusList::$rDeliveryBoyAssigned => 2,
            ReturnStatusList::$rOutForPickup => 3,
            ReturnStatusList::$rReceivedFromCustomer => 4,
            ReturnStatusList::$rReturnToSeller => 5,
            ReturnStatusList::$rApproved => 6,
            ReturnStatusList::$rRejected => 6,
            ReturnStatusList::$rCancelled => 7
        ];

        $specialStatuses = [
            ReturnStatusList::$rCancelled,
            ReturnStatusList::$rApproved,
            ReturnStatusList::$rRejected
        ];

        if (!isset($statusHierarchy[$currentStatus]) || !isset($statusHierarchy[$newStatus])) {
            return __('invalid_status_for_return_request');
        }

        if ($statusHierarchy[$newStatus] < $statusHierarchy[$currentStatus]) {
            $currentName = ReturnStatusList::getTranslatedName((int) $currentStatus);
            $newName = ReturnStatusList::getTranslatedName((int) $newStatus);
            return __('cannot_update_status_from_to') . $currentName . __('to_status_to_status_to') . $newName . "'";
        }

        if ($statusHierarchy[$newStatus] == $statusHierarchy[$currentStatus]) {
            $statusName = ReturnStatusList::getTranslatedName((int) $currentStatus);
            return __('this_return_request_is_already') . $statusName . '.';
        }

        return null;
    }

    private function processUpdate(Request $request, $returnRequest, $user)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:return_requests,id',
            'status' => 'required',
            'delivery_boy_id' => [
                'required_if:status,' . ReturnStatusList::$rDeliveryBoyAssigned,
                'integer',
                function ($attribute, $value, $fail) use ($request) {
                    $existingRequest = ReturnRequest::where('id', $request->id)
                        ->where('status', ReturnStatusList::$rApproved)
                        ->first();

                    if ($existingRequest) {
                        $fail('This return request has already been approved.');
                    }

                    if ($request->status == ReturnStatusList::$rDeliveryBoyAssigned && $value <= 0) {
                        $fail('Please assign a delivery boy when the return request is assigned.');
                    }
                },
            ],
            'cancellation_reason' => [
                'required_if:status,' . ReturnStatusList::$rCancelled,
                'string',
                'max:500'
            ],
        ], [
            'id.required' => 'Return request ID is required.',
            'id.integer' => 'Return request ID must be a valid integer.',
            'id.exists' => 'Return request not found.',
            'delivery_boy_id.required_if' => 'Please assign a delivery boy when the return request is assigned.',
            'cancellation_reason.required_if' => 'Cancellation reason is required when status is cancelled.',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if ($user->role_id == Role::$roleSeller) {
            if ($request->status == ReturnStatusList::$rDeliveryBoyAssigned && ($request->delivery_boy_id == 0 || empty($request->delivery_boy_id))) {
                return CommonHelper::responseError('please_assign_a_delivery_boy_when_the_status_is_delivery_boy_assigned');
            }

            if ($request->status == ReturnStatusList::$rApproved && $returnRequest->delivery_boy_id == 0) {
                return CommonHelper::responseError('cannot_approve_return_request_please_assign_a_delivery_boy_first');
            }
        } else {
            $statusesRequiringDeliveryBoy = [
                ReturnStatusList::$rOutForPickup,
                ReturnStatusList::$rReceivedFromCustomer,
                ReturnStatusList::$rReturnToSeller,
                ReturnStatusList::$rCancelled
            ];

            $allowedStatusesWithoutDeliveryBoy = [
                ReturnStatusList::$rPending,
                ReturnStatusList::$rRejected
            ];

            if (in_array($request->status, $statusesRequiringDeliveryBoy) && $returnRequest->delivery_boy_id == 0) {
                return CommonHelper::responseError('cannot_update_to_this_status_please_assign_a_delivery_boy_first');
            }

            if (in_array($request->status, $allowedStatusesWithoutDeliveryBoy) && $returnRequest->delivery_boy_id == 0) {
                return CommonHelper::responseError('cannot_update_status_please_assign_a_delivery_boy_first');
            }

            if ($request->status == ReturnStatusList::$rApproved && $returnRequest->delivery_boy_id == 0) {
                return CommonHelper::responseError('cannot_approve_return_request_please_assign_a_delivery_boy_first');
            }
        }

        $returnRequest->remarks = $request->remark;
        $returnRequest->status = $request->status;

        if ($user->role_id == Role::$roleDeliveryBoy) {
        } elseif ($user->role_id == Role::$roleSeller) {
            if ($request->status == ReturnStatusList::$rDeliveryBoyAssigned) {
                $returnRequest->delivery_boy_id = $request->delivery_boy_id ?? 0;
            } elseif ($request->status == ReturnStatusList::$rPending) {
                $returnRequest->delivery_boy_id = 0;
            }
        } else {
            $returnRequest->delivery_boy_id = $request->delivery_boy_id ?? 0;
        }

        if ($request->status == ReturnStatusList::$rCancelled) {
            $returnRequest->cancellation_reason = $request->cancellation_reason;
        }
        if ($request->status == ReturnStatusList::$rPending) {
            $returnRequest->delivery_boy_id = 0;
        } elseif ($request->status == ReturnStatusList::$rApproved) {
            $orderItem = OrderItem::find($returnRequest->order_item_id);

            $order = Order::select("*")->where("id", $orderItem->order_id)->first();
            $user = User::find($returnRequest->user_id);
            $currentBalance = $user->balance;

            $walletCreditAmount = CommonHelper::calculateRefundAmountForOrderItem($order, $orderItem);

            $orderItem->refund_amount = $walletCreditAmount;
            $orderItem->save();

            $new_balance = $currentBalance + $walletCreditAmount;
            $itemNum = OrderItem::where("order_id", $order->id)->count();
            $lastItemNum = 0;
            if ($itemNum > 1) {
                $lastItemNum = OrderItem::where("order_id", $order->id)->where('status', '!=', OrderStatusList::$cancelled)->count();
            }
            if ($itemNum == 1 || $lastItemNum == 1) {
                // Calculate additional charges for single product (ensure array: may be JSON string from DB)
                $additional_charges = $order->additional_charges ?? [];
                if (is_string($additional_charges)) {
                    $additional_charges = json_decode($additional_charges, true) ?? [];
                }
                $additional_charges = is_array($additional_charges) ? $additional_charges : [];
                $additional_charges_total = array_sum(array_column($additional_charges, 'amount'));

                if ($order->wallet_balance == 0) {
                    // Refund the wallet credit amount (considering promo discount)
                    $new_balance = $currentBalance + $walletCreditAmount;
                    CommonHelper::updateUserWalletBalance($new_balance, $returnRequest->user_id);
                    CommonHelper::addWalletTransaction($orderItem->order_id, $orderItem->id, $returnRequest->user_id, 'credit', $walletCreditAmount, 'wallet_order_item_returned');
                } else {
                    // Calculate refund amount excluding additional charges and delivery charge
                    $refundable_amount = $order->final_total - $additional_charges_total - floatval($order->delivery_charge);
                    $new_balance = $currentBalance + $order->wallet_balance + $refundable_amount;
                    CommonHelper::updateUserWalletBalance($new_balance, $returnRequest->user_id);
                    CommonHelper::addWalletTransaction($orderItem->order_id, $orderItem->id, $returnRequest->user_id, 'credit', $order->wallet_balance + $refundable_amount, 'wallet_order_item_returned');
                }

                $order->active_status = OrderStatusList::$returned;
                $order->remaining_total = 0;
                // Set both final_total and remaining_final to additional charges + delivery charge
                $order->final_total = $additional_charges_total + floatval($order->delivery_charge);
                $order->remaining_final = $additional_charges_total + floatval($order->delivery_charge);
                $order->save();
            } else {
                if ($order->wallet_balance == 0) {
                    $new_balance = $currentBalance + $walletCreditAmount;
                    CommonHelper::updateUserWalletBalance($new_balance, $returnRequest->user_id);
                    CommonHelper::addWalletTransaction($orderItem->order_id, $orderItem->id, $returnRequest->user_id, 'credit', $walletCreditAmount, 'wallet_order_item_returned');
                } else {
                    $new_balance = $currentBalance + $walletCreditAmount;
                    CommonHelper::updateUserWalletBalance($new_balance, $returnRequest->user_id);
                    CommonHelper::addWalletTransaction($orderItem->order_id, $orderItem->id, $returnRequest->user_id, 'credit', $walletCreditAmount, 'wallet_order_item_returned');
                }

                // Calculate additional charges (ensure array: may be JSON string from DB)
                $additional_charges = $order->additional_charges ?? [];
                if (is_string($additional_charges)) {
                    $additional_charges = json_decode($additional_charges, true) ?? [];
                }
                $additional_charges = is_array($additional_charges) ? $additional_charges : [];
                $additional_charges_total = array_sum(array_column($additional_charges, 'amount'));

                // Update remaining totals for partial returns
                $order->remaining_total = floatval($order->remaining_total) - floatval($walletCreditAmount);
                $order->remaining_final = floatval($order->remaining_total) + $additional_charges_total + floatval($order->delivery_charge);

                // Set final_total to match remaining_final
                $order->final_total = $order->remaining_final;

                $order->save();
            }
            if ($orderItem) {
                $orderItem->active_status = OrderStatusList::$returned;
                $orderItem->save();
            }
            $product_variant_id = $orderItem->product_variant_id;
            $product_variant = ProductVariant::where('id', $product_variant_id)->first();

            if ($product_variant) {
                $new_stock_value = $product_variant->stock + $orderItem->quantity;
                $product_variant->stock = $new_stock_value;
                $product_variant->save();
            }
            if ($order->wallet_balance == 0) {
            } else {
                $order->wallet_balance = floatval($order->wallet_balance) - floatval($order->wallet_balance);
                $order->save();
            }
        } elseif ($request->status == ReturnStatusList::$rRejected) {
            $returnRequest->delivery_boy_id = 0;
        }
        $returnRequest->save();

        dispatch(function () use ($returnRequest) {
            try {
                CommonHelper::sendReturnRequestNotification($returnRequest);
            } catch (\Exception $e) {
                Log::error("Return request notification error: " . $e->getMessage());
            }
        })->afterResponse();

        return CommonHelper::responseSuccess('return_request_status_updated_successfully');
    }
}
