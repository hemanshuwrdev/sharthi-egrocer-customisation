<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\SellerWalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SellerWalletTransactionsApiController extends Controller
{
    public function getSellerWalletTransactions(Request $request)
    {
        $limit = ($request->limit) ?? 10;
        $offset = ($request->offset) ?? 0;
        $search = $request->search ?? null;

        $query = SellerWalletTransaction::select('sellers.name', 'seller_wallet_transactions.*', 'order_items.product_name', 'order_items.variant_name')
            ->leftJoin('sellers', 'seller_wallet_transactions.seller_id', '=', 'sellers.id')
            ->leftJoin('order_items', 'seller_wallet_transactions.order_item_id', '=', 'order_items.id');

        // Filter by Seller if logged in as seller
        if (isset(auth()->user()->seller->id) && auth()->user()->seller->id != null) {
            $query->where('sellers.id', auth()->user()->seller->id);
        }

        // Unified Search Filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                // Text search
                $q->where('order_items.product_name', 'like', '%' . $search . '%')
                    ->orWhere('order_items.variant_name', 'like', '%' . $search . '%')
                    ->orWhere('seller_wallet_transactions.message', 'like', '%' . $search . '%')
                    ->orWhere('seller_wallet_transactions.amount', 'like', '%' . $search . '%');

                // Numeric Search (IDs)
                if (is_numeric($search)) {
                    $q->orWhere('seller_wallet_transactions.id', $search)
                        ->orWhere('seller_wallet_transactions.order_id', $search)
                        ->orWhere('seller_wallet_transactions.order_item_id', $search);
                }

                // Date Search (Supports YYYY-MM-DD, YYYY-MM, etc)
                if (preg_match('/^[0-9\-\/]+$/', $search) && strlen($search) >= 4) {
                    try {
                        $date = \Carbon\Carbon::parse($search)->format('Y-m-d');
                        $q->orWhereDate('seller_wallet_transactions.created_at', $date);
                    } catch (\Exception $e) {
                        $q->orWhere('seller_wallet_transactions.created_at', 'like', '%' . $search . '%');
                    }
                }

                // Keyword Search (Type and Status)
                $searchLower = strtolower($search);
                $keywordMappings = [
                    'credit' => ['column' => 'type', 'value' => 'credit'],
                    'debit' => ['column' => 'type', 'value' => 'debit'],
                    'active' => ['column' => 'status', 'value' => 1],
                    'deactive' => ['column' => 'status', 'value' => 0],
                ];
                foreach ($keywordMappings as $keyword => $map) {
                    if (str_contains($keyword, $searchLower)) {
                        $q->orWhere('seller_wallet_transactions.' . $map['column'], $map['value']);
                    }
                }
            });
        }

        $total = $query->count();
        $walletTransactions = $query->orderBy('seller_wallet_transactions.id', 'DESC')
            ->skip($offset)->limit($limit)->get();

        $sellers = null;
        if (!isset(auth()->user()->seller->id)) {
            $sellers = Seller::withAllTranslations()->orderBy('id', 'DESC')->get();

            $sellerIds = $walletTransactions->pluck('seller_id')->unique()->filter();
            if ($sellerIds->isNotEmpty()) {
                $sellersWithTranslations = Seller::withAllTranslations()
                    ->whereIn('id', $sellerIds)
                    ->get()
                    ->keyBy('id');

                foreach ($walletTransactions as $transaction) {
                    if (isset($sellersWithTranslations[$transaction->seller_id])) {
                        $translations = $sellersWithTranslations[$transaction->seller_id]->translations;
                        $transaction->translations = is_array($translations) ? $translations : $translations->toArray();
                    }
                }
            }
        }

        foreach ($walletTransactions as $wt) {
            $wt->message = CommonHelper::translateTransactionMessage($wt->message);
        }

        $walletTransactionsForResponse = $walletTransactions->map(function (SellerWalletTransaction $wt) {
            $row = $wt->toArray();
            $rawCreated = $wt->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            return $row;
        });

        if (!isset(auth()->user()->seller->id)) {
            return CommonHelper::responseWithData([
                'sellers' => $sellers,
                'walletTransactions' => $walletTransactionsForResponse,
            ], $total);
        }

        return CommonHelper::responseWithData($walletTransactionsForResponse, $total);
    }
    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seller' => 'required|json',
            'type' => 'required',
            'amount' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $sellerData = json_decode($request->seller);

        // Check for JSON decoding errors
        if (json_last_error() !== JSON_ERROR_NONE || $sellerData === null) {
            return CommonHelper::responseError(__('please_select_seller'));
        }

        $sellerWalletTransactions = new SellerWalletTransaction();
        $sellerWalletTransactions->seller_id = $sellerData->id;
        $sellerWalletTransactions->type = $request->type;
        $sellerWalletTransactions->amount = $request->amount;
        $sellerWalletTransactions->message = $request->message;
        $sellerWalletTransactions->status = 1;
        $sellerWalletTransactions->save();
        $seller = Seller::find($sellerData->id);

        // Check if the seller is found
        if ($seller !== null) {
            $seller->balance = ($request->type == 'debit') ? ($seller->balance - $request->amount) : ($seller->balance + $request->amount);
            $seller->save();
            return CommonHelper::responseSuccess(__('seller_wallet_transaction_saved_successfully'));
        } else {
            return CommonHelper::responseError(__('seller_not_found'));
        }
    }
}
