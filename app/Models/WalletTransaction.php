<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory, LogsActivity;
    public static $statusSuccess = "success";
    public static $statusFailed = "failed";

    public static $paymentTypeCod = "COD";

    public static $paymentTypeStripe = "Stripe";
    public static $paymentTypeRazorpay = "Razorpay";
    public static $paymentTypePaystack = "Paystack";
    public static $paymentTypePaytm = "Paytm";
    public static $paymentTypePaypal = "Paypal";

    protected $fillable = [
        'user_id', 
        'txn_id',
        'payment_type',
        'transaction_date',
        'status',
        'type',
        'amount',
        'message'
    ];

     protected $casts = [
        'amount' => 'decimal:2',
    ];

    // Force output as float
    public function getAmountAttribute($value)
    {
        return (float) $value;
    }


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('WalletTransaction');
    }
}
