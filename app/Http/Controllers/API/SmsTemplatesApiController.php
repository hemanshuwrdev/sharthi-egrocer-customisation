<?php

namespace App\Http\Controllers\API;
use App\Helpers\CommonHelper;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\SmsTemplate;
use Illuminate\Support\Facades\Validator;

class SmsTemplatesApiController extends BaseController
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10); // Default items per page
        $offset = (($request->input('offset', 0))-1)*$limit; // Default page
        $filter = $request->input('filter', ''); // Filter query
    
        // Fetch paginated data
        $sms_templates = SmsTemplate::orderBy('id', 'ASC');
        if ($filter) {
            $sms_templates = $sms_templates->where(function($query) use ($filter) {
                $query->where('name', 'like', "%{$filter}%");
            });
        }

        $total = $sms_templates->count();
        if (isset($limit) && !is_null($limit)) {
            $sms_templates = $sms_templates->skip($offset)->take($limit)->get();
        } else {
            $sms_templates = $sms_templates->get();
        }
        $sms_templates = $sms_templates->map(function (SmsTemplate $st) {
            $row = $st->toArray();
            $rawUpdatedAt = $st->getAttributes()['updated_at'] ?? null;
            if ($rawUpdatedAt !== null && $rawUpdatedAt !== '') {
                $row['updated_at'] = CommonHelper::formatDate($rawUpdatedAt);
            }
            return $row;
        });
        
        return CommonHelper::responseWithData($sms_templates, $total);
    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'message' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if (isset($request->id)) {

            $sms_templates = SmsTemplate::find($request->id);
            $sms_templates->title = $request->title;
            $sms_templates->message = $request->message;

            $sms_templates->save();

        }

        return CommonHelper::responseSuccess('sms_template_updated_successfully');
    }
 
}