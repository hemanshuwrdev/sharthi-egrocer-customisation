<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SellerSettingController extends Controller
{

    public function getThermalSettings()
    {
        $seller = auth()->user()->seller;

        return CommonHelper::responseWithData([
            'invoice_logo' => $seller->invoice_logo,
            'thermal_paper_width' => $seller->thermal_paper_width
        ]);
    }

    public function saveThermalSettings(Request $request)
    {
        try {
            $seller = auth()->user()->seller;

            if ($request->hasFile('invoice_logo')) {
                $path = $request->file('invoice_logo')->store('thermal_logo', 'public');

                $seller->invoice_logo = $path;
            }

            if ($request->has('thermal_paper_width')) {
                $seller->thermal_paper_width = $request->thermal_paper_width;
            }

            $seller->save();

            return CommonHelper::responseSuccess('thermal_print_settings_saved_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError('something_went_wrong');
        }
    }

    public function getOrderSettings()
    {
        $seller = auth()->user()->seller;
        return CommonHelper::responseWithData([
            'order_cutoff_time' => $seller->order_cutoff_time,
        ]);
    }

    public function saveOrderSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_cutoff_time' => ['nullable', 'regex:/^\d{1,2}:\d{2}$/'],
        ], [
            'order_cutoff_time.regex' => 'Cutoff time must be in HH:MM 24-hour format.',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $seller = auth()->user()->seller;
            $seller->order_cutoff_time = $request->order_cutoff_time ?: null;
            $seller->save();
            return CommonHelper::responseSuccess('order_settings_saved_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }
}
