<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\DeliveryBoy;
use App\Models\FundTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class FundTransfersApiController extends Controller
{
    public function index(){
        // Load delivery boys with all translations for language-wise display
        $deliveryBoys = DeliveryBoy::withAllTranslations()
            ->orderBy('id', 'DESC')
            ->get();

        $deliveryBoysForResponse = $deliveryBoys->map(function (DeliveryBoy $db) {
            $row = $db->toArray();
            $rawCreated = $db->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            return $row;
        });
        
        // Load fund transfers with delivery boy data
        $fundTransfers = FundTransfer::select('delivery_boys.name','delivery_boys.mobile','delivery_boys.address', 'fund_transfers.*')
            ->leftJoin('delivery_boys', 'fund_transfers.delivery_boy_id', '=', 'delivery_boys.id')
            ->orderBy('fund_transfers.id','DESC')
            ->get();
        
        // Load translations for delivery boys in fund transfers and attach them
        $deliveryBoyIds = $fundTransfers->pluck('delivery_boy_id')->unique()->filter();
        if ($deliveryBoyIds->isNotEmpty()) {
            $deliveryBoysWithTranslations = DeliveryBoy::withAllTranslations()
                ->whereIn('id', $deliveryBoyIds)
                ->get()
                ->keyBy('id');
            
            // Attach translations to each fund transfer (convert to array for proper serialization)
            foreach ($fundTransfers as $transfer) {
                if (isset($deliveryBoysWithTranslations[$transfer->delivery_boy_id])) {
                    $deliveryBoy = $deliveryBoysWithTranslations[$transfer->delivery_boy_id];
                    
                    // Get translations from the relationship (eager loaded via withAllTranslations)
                    // Check if relation is loaded first
                    if ($deliveryBoy->relationLoaded('translations')) {
                        $translations = $deliveryBoy->getRelation('translations');
                        // Convert collection to array if it's a collection
                        $transfer->translations = ($translations instanceof \Illuminate\Database\Eloquent\Collection) 
                            ? $translations->toArray() 
                            : (is_array($translations) ? $translations : []);
                    } else {
                        // If not loaded, load it and convert to array
                        $translations = $deliveryBoy->translations;
                        $transfer->translations = ($translations instanceof \Illuminate\Database\Eloquent\Collection) 
                            ? $translations->toArray() 
                            : (is_array($translations) ? $translations : []);
                    }
                }
            }
        }

        $fundTransfersForResponse = $fundTransfers->map(function (FundTransfer $transfer) {
            $row = $transfer->toArray();
            if (isset($transfer->translations)) {
                $row['translations'] = $transfer->translations;
            }
            $rawCreated = $transfer->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            return $row;
        });

        $data = [
            'deliveryBoys' => $deliveryBoysForResponse,
            'fundTransfers' => $fundTransfersForResponse,
        ];
        return CommonHelper::responseWithData($data);
    }
    public function save(Request $request){
        $validator = Validator::make($request->all(),[
            'deliveryBoy' => 'required',
            'amount' => 'required',

        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        $deliveryBoyData = json_decode($request->deliveryBoy);
        CommonHelper::addFundTransfers($deliveryBoyData->id, $request->amount, FundTransfer::$typeDebit, $request->message);
        return CommonHelper::responseSuccess('fund_transfer_saved_successfully');
    }
}
