<?php

namespace App\Jobs;

use App\Helpers\CommonHelper;
use App\Models\UserProductRequest;
use App\Models\UserToken;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendProductRequestNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $productRequest;
    protected $type;

    public function __construct(UserProductRequest $productRequest, $type = 'status_update')
    {
        $this->productRequest = $productRequest;
        $this->type = $type;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $this->sendPushNotification();
            $this->sendEmailNotification();

        } catch (\Exception $e) {
            Log::error('Error in SendProductRequestNotificationJob: ' . $e->getMessage());
        }
    }

    /**
     * Send push notification to customer
     */
    private function sendPushNotification()
    {
        try {
            $customer = $this->productRequest->customer;
            $status = $this->productRequest->status;
            $product = $this->productRequest->product;
            $productName = $product ? $product->name : 'N/A';
            $productSlug = $product ? $product->slug : '';

            // Use notification templates: product_request_accepted, product_request_rejected
            $templateType = ($status === 'accepted') ? 'product_request_accepted' : 'product_request_rejected';
            $placeholders = ($status === 'accepted') ? ['product_name' => $productName] : [];

            $userTokens = UserToken::where('user_id', $customer->id)
                ->where('type', 'customer')
                ->get();

            if ($userTokens->isNotEmpty()) {
                CommonHelper::sendNotificationByTemplate(
                    $userTokens,
                    $templateType,
                    $placeholders,
                    '',
                    0,
                    '',
                    null,
                    null,
                    'product_request',
                    $this->productRequest->product_id,
                    $productSlug
                );
            }

        } catch (\Exception $e) {
            Log::error('Error sending push notification: ' . $e->getMessage());
        }
    }

    /**
     * Send email notification to customer
     */
    private function sendEmailNotification()
    {
        try {
            $customer = $this->productRequest->customer;
            $status = $this->productRequest->status;
            $appName = Setting::get_value('app_name');

            $subject = 'Product Request ' . ucfirst($status);
            
            $data = [
                'customer' => $customer,
                'productRequest' => $this->productRequest,
                'status' => $status,
                'app_name' => $appName,
                'subject' => $subject,
                'type' => 'product_request_status',
                'name' => $customer->name
            ];

            CommonHelper::sendMail($customer->email, $subject, $data);

        } catch (\Exception $e) {
            Log::error('Error sending email notification: ' . $e->getMessage());
        }
    }
}
