<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\AdditionalCharge;
use App\Models\AdditionalChargeTranslation;
use App\Models\Language;
use Illuminate\Http\Request;

class AdditionalChargesApiController extends Controller
{
    public function index()
    {
        $charges = AdditionalCharge::withAllTranslations()
            ->orderBy('sort_order')
            ->get();

        $result = $charges->map(function ($charge) {
            $translations = collect($charge->getAllActiveLanguageTranslations());

            $title = [];
            foreach ($translations as $t) {
                $title[$t['language_code']] = $t['title'] ?? '';
            }

            return [
                'id'            => $charge->id,
                'title'         => $title,
                'amount'        => $charge->amount,
                'charge_type'   => $charge->charge_type,
                'is_refundable' => $charge->is_refundable,
                'is_active'     => $charge->is_active,
                'applicable_on' => $charge->applicable_on ?? ['order', 'self_pickup'],
            ];
        });

        return response()->json([
            'status' => true,
            'data'   => $result,
        ]);
    }

    public function save(Request $request)
    {
        $chargesData = $request->additional_charges;

        if (is_string($chargesData)) {
            $chargesData = json_decode($chargesData, true);
        }

        if (!is_array($chargesData)) {
            return CommonHelper::responseError('Invalid data.');
        }

        $languages = Language::leftJoin('supported_languages', 'supported_languages.id', 'languages.supported_language_id')
            ->where('languages.system_type', 4)
            ->where('languages.status', 1)
            ->get([
                'languages.id',
                'languages.is_default',
                'supported_languages.code',
            ])
            ->keyBy('code');

        // Collect incoming IDs to determine which to delete
        $incomingIds = collect($chargesData)->pluck('id')->filter()->toArray();

        // Delete charges that are no longer in the list
        AdditionalCharge::whereNotIn('id', $incomingIds)->delete();

        foreach ($chargesData as $index => $data) {
            $applicableOn = $data['applicable_on'] ?? ['order', 'self_pickup'];
            if (is_array($applicableOn)) {
                $applicableOn = array_values(array_intersect($applicableOn, ['order', 'self_pickup']));
            }

            $chargeType = isset($data['charge_type']) && in_array($data['charge_type'], ['amount', 'percentage'])
                ? $data['charge_type']
                : 'amount';

            // Get default language title for the base table
            $defaultTitle = '';
            if (isset($data['title']) && is_array($data['title'])) {
                foreach ($languages as $code => $lang) {
                    if ($lang->is_default && !empty($data['title'][$code])) {
                        $defaultTitle = trim($data['title'][$code]);
                        break;
                    }
                }
                if (empty($defaultTitle)) {
                    $defaultTitle = trim(reset($data['title']) ?: '');
                }
            }

            $chargeFields = [
                'title'         => $defaultTitle,
                'amount'        => (float)($data['amount'] ?? 0),
                'charge_type'   => $chargeType,
                'is_refundable' => !empty($data['is_refundable']),
                'is_active'     => !isset($data['is_active']) || !empty($data['is_active']),
                'applicable_on' => $applicableOn,
                'sort_order'    => $index,
            ];

            if (!empty($data['id'])) {
                $charge = AdditionalCharge::find($data['id']);
                if ($charge) {
                    $charge->update($chargeFields);
                } else {
                    $charge = AdditionalCharge::create($chargeFields);
                }
            } else {
                $charge = AdditionalCharge::create($chargeFields);
            }

            // Save translations
            if (isset($data['title']) && is_array($data['title'])) {
                foreach ($data['title'] as $langCode => $titleValue) {
                    $language = $languages->get($langCode);
                    if (!$language) continue;

                    $titleValue = preg_replace('/\r\n|\r|\n/', ' ', $titleValue ?? '');
                    $titleValue = preg_replace('/\s+/', ' ', $titleValue);
                    $titleValue = trim($titleValue);

                    AdditionalChargeTranslation::updateOrCreate(
                        [
                            'additional_charge_id' => $charge->id,
                            'language_id'          => $language->id,
                        ],
                        [
                            'title' => $titleValue,
                        ]
                    );
                }
            }
        }

        // Sync to settings table for backward compatibility
        //$this->syncToSettings();

        return CommonHelper::responseSuccess('additional_charges_saved_successfully');
    }

    public function delete(Request $request)
    {
        $charge = AdditionalCharge::find($request->id);
        if (!$charge) {
            return CommonHelper::responseError('not_found');
        }

        $charge->delete();

        $this->syncToSettings();

        return CommonHelper::responseSuccess('deleted_successfully');
    }

}
