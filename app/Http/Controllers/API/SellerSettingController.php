<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
}
