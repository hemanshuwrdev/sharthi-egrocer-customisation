<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\OrderStatusList;
use App\Models\ReturnRequest;
use App\Models\ReturnStatusList;
use App\Services\LanguageService;
use Illuminate\Http\Request;

class OrderStatusApiController extends Controller
{
    private const RETURN_STATUS_KEYS = [
        1 => 'pending',                    // rPending
        2 => 'approved',                  // rApproved
        3 => 'rejected',                  // rRejected
        4 => 'delivery_boy_assigned',     // rDeliveryBoyAssigned
        5 => 'out_for_pickup',            // rOutForPickup
        6 => 'received_from_customer',   // rReceivedFromCustomer
        7 => 'cancelled',                 // rCancelled
        8 => 'return_to_seller',          // rReturnToSeller
    ];

    public function getOrderStatus(Request $request = null)
    {
        if (!$request) {
            $request = new Request();
        }
        $excludeIds = [
            OrderStatusList::$selfPickupPending,
            OrderStatusList::$selfPickupReady,
            OrderStatusList::$selfPickupPicked
        ];
        // When is_till_cancelable=1, exclude delivered, returned, cancelled from data
        if ($request->input('is_till_cancelable') == 1) {
            $excludeIds = array_merge($excludeIds, [
                OrderStatusList::$delivered,
                OrderStatusList::$returned,
                OrderStatusList::$cancelled,
            ]);
        }
        $orderStatuses = OrderStatusList::whereNotIn('id', $excludeIds)->orderBy('id', 'ASC')->get();

        $returnStatuses = [];
        $isDeliveryBoyRoute = false;
        $isSellerRoute = false;

        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
        if (isset($backtrace[1]['class'])) {
            $callerClass = $backtrace[1]['class'];
            $isDeliveryBoyRoute = $callerClass === 'App\\Http\\Controllers\\DeliveryBoyController';
            $isSellerRoute = $callerClass === 'App\\Http\\Controllers\\SellerController';
        }

        if ($isDeliveryBoyRoute) {
            $returnStatuses = [
                ['id' => ReturnStatusList::$rOutForPickup, 'status' => ReturnStatusList::$outForPickup],
                ['id' => ReturnStatusList::$rReceivedFromCustomer, 'status' => ReturnStatusList::$receivedFromCustomer],
                ['id' => ReturnStatusList::$rCancelled, 'status' => ReturnStatusList::$cancelled],
                ['id' => ReturnStatusList::$rReturnToSeller, 'status' => ReturnStatusList::$returnToSeller],
            ];
        } elseif ($isSellerRoute) {
            $returnStatuses = [
                ['id' => ReturnStatusList::$rPending, 'status' => ReturnStatusList::$requestPending],
                ['id' => ReturnStatusList::$rDeliveryBoyAssigned, 'status' => ReturnStatusList::$deliveryBoyAssigned],
                ['id' => ReturnStatusList::$rApproved, 'status' => ReturnStatusList::$requestApproved],
                ['id' => ReturnStatusList::$rRejected, 'status' => ReturnStatusList::$requestRejected],
            ];
        } else {
            $returnStatuses = [
                ['id' => ReturnStatusList::$rPending, 'status' => ReturnStatusList::$requestPending],
                ['id' => ReturnStatusList::$rApproved, 'status' => ReturnStatusList::$requestApproved],
                ['id' => ReturnStatusList::$rRejected, 'status' => ReturnStatusList::$requestRejected],
                ['id' => ReturnStatusList::$rDeliveryBoyAssigned, 'status' => ReturnStatusList::$deliveryBoyAssigned],
                ['id' => ReturnStatusList::$rOutForPickup, 'status' => ReturnStatusList::$outForPickup],
                ['id' => ReturnStatusList::$rReceivedFromCustomer, 'status' => ReturnStatusList::$receivedFromCustomer],
                ['id' => ReturnStatusList::$rCancelled, 'status' => ReturnStatusList::$cancelled],
                ['id' => ReturnStatusList::$rReturnToSeller, 'status' => ReturnStatusList::$returnToSeller],
            ];
        }

        if ($orderStatuses->isEmpty()) {
            return CommonHelper::responseError('status_not_found');
        }

        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';
        $languageService = app(LanguageService::class);
        $previousLocale = app()->getLocale();

        // When Content-Language is present, set app locale so __() and getTranslatedName() return that language
        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        // Order statuses: add status_name (single lang or all langs)
        $data = $orderStatuses->map(function ($row) use ($useContentLanguage, $languageService) {
            $item = ['id' => $row->id, 'status' => $row->status];
            if ($useContentLanguage) {
                $item['status_name'] = OrderStatusList::getTranslatedName($row->id);
            } else {
                $key = OrderStatusList::getTranslationKey($row->id);
                $statusNames = (object) [];
                foreach ($languageService->getActiveLanguages() as $lang) {
                    $code = $lang->code ?? '';
                    if ($code !== '' && $key !== '') {
                        app()->setLocale($code);
                        $statusNames->{$code} = __($key);
                    }
                }
                $item['status_name'] = $statusNames;
            }
            return $item;
        })->values();

        // Determine disabled statuses based on return_request_id
        $disabledReturnStatusIds = [];
        $returnRequestId = $request->input('return_request_id');
        if ($returnRequestId) {
            $returnRequest = ReturnRequest::find($returnRequestId);
            if ($returnRequest) {
                $currentStatus = (int) $returnRequest->status;
                $allReturnIds = [1, 2, 3, 4, 5, 6, 7, 8];
                switch ($currentStatus) {
                    case ReturnStatusList::$rPending: // 1 - all enabled
                        $disabledReturnStatusIds = [];
                        break;
                    case ReturnStatusList::$rApproved:    // 2
                    case ReturnStatusList::$rRejected:    // 3
                    case ReturnStatusList::$rCancelled:   // 7
                        $disabledReturnStatusIds = array_values(array_diff($allReturnIds, [$currentStatus]));
                        break;
                    case ReturnStatusList::$rDeliveryBoyAssigned: // 4 - 1 disabled
                        $disabledReturnStatusIds = [1];
                        break;
                    case ReturnStatusList::$rOutForPickup: // 5 - 1,4 disabled
                        $disabledReturnStatusIds = [1, 4];
                        break;
                    case ReturnStatusList::$rReceivedFromCustomer: // 6 - 1,4,5 disabled
                        $disabledReturnStatusIds = [1, 4, 5];
                        break;
                    case ReturnStatusList::$rReturnToSeller: // 8 - all disabled
                        $disabledReturnStatusIds = [2, 3];
                        break;
                    default:
                        $disabledReturnStatusIds = [];
                        break;
                }
            }
        }

        // Return statuses: add status_name (single lang or all langs)
        $returnStatusesTranslated = array_map(function ($rs) use ($useContentLanguage, $languageService, $returnRequestId, $disabledReturnStatusIds) {
            $item = ['id' => $rs['id'], 'status' => $rs['status']];
            if ($returnRequestId) {
                $item['is_disabled'] = in_array($rs['id'], $disabledReturnStatusIds) ? 1 : 0;
            }
            $key = self::RETURN_STATUS_KEYS[$rs['id']] ?? '';
            if ($key === '') {
                $item['status_name'] = $useContentLanguage ? $rs['status'] : (object) ['en' => $rs['status']];
                return $item;
            }
            if ($useContentLanguage) {
                $item['status_name'] = __($key);
            } else {
                $statusNames = (object) [];
                foreach ($languageService->getActiveLanguages() as $lang) {
                    $code = $lang->code ?? '';
                    if ($code !== '') {
                        app()->setLocale($code);
                        $statusNames->{$code} = __($key);
                    }
                }
                $item['status_name'] = $statusNames;
            }
            return $item;
        }, $returnStatuses);

        app()->setLocale($previousLocale);

        return response()->json([
            'status' => 1,
            'message' => 'success',
            'data' => $data,
            'return_statuses' => $returnStatusesTranslated,
        ]);
    }

    public function getSelfPickupOrderStatus(Request $request = null)
    {
        if (!$request) {
            $request = request();
        }
        $selfPickupStatuses = [
            ['id' => OrderStatusList::$paymentPending, 'status' => OrderStatusList::$orderPaymentPending],
            ['id' => OrderStatusList::$selfPickupPending, 'status' => OrderStatusList::$orderSelfPickupPending],
            ['id' => OrderStatusList::$selfPickupReady, 'status' => OrderStatusList::$orderSelfPickupReady],
            ['id' => OrderStatusList::$selfPickupPicked, 'status' => OrderStatusList::$orderSelfPickupPicked],
            ['id' => OrderStatusList::$cancelled, 'status' => OrderStatusList::$orderCancelled],
            ['id' => OrderStatusList::$returned, 'status' => OrderStatusList::$orderReturned],
        ];

        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';
        $languageService = app(LanguageService::class);
        $previousLocale = app()->getLocale();

        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        $data = array_map(function ($row) use ($useContentLanguage, $languageService) {
            $item = ['id' => $row['id'], 'status' => $row['status']];
            if ($useContentLanguage) {
                $item['status_name'] = OrderStatusList::getTranslatedName($row['id']);
            } else {
                $key = OrderStatusList::getTranslationKey($row['id']);
                $statusNames = (object) [];
                foreach ($languageService->getActiveLanguages() as $lang) {
                    $code = $lang->code ?? '';
                    if ($code !== '' && $key !== '') {
                        app()->setLocale($code);
                        $statusNames->{$code} = __($key);
                    }
                }
                $item['status_name'] = $statusNames;
            }
            return $item;
        }, $selfPickupStatuses);

        app()->setLocale($previousLocale);

        return response()->json([
            'status' => 1,
            'message' => 'success',
            'data' => $data,
        ]);
    }
}
