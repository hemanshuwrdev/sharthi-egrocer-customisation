<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LowStockMail extends Mailable
{
    use Queueable, SerializesModels;

    public $product;
    public $seller;

    public function __construct($product, $seller)
    {
        $this->product = $product;
        $this->seller  = $seller;
    }

    public function build()
    {
        return $this->subject('⚠ Low Stock Alert')
            ->view('mail.low_stock');
    }
}
