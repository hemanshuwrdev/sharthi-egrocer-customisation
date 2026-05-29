<?php

namespace App\Models;

use App\Traits\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    use HasFactory, HasTranslations;

    protected $appends = ['image_url','is_applicable','validity'];    
    protected $translatable = ['message'];
    protected $translationForeignKey = 'promo_code_id';

    public function getImageUrlAttribute(){

        $image_url = '';
        if($this->image){
            $image_url = asset('storage/'.$this->image);
        }
        return $image_url;
    }

    public function getIsApplicableAttribute()
    {
        $start_date = $this->start_date;
        $end_date = $this->end_date;
        $current_date = now(); // Use Laravel's now() helper for consistent timezone

        // Convert dates to Carbon instances for proper comparison
        $start = \Carbon\Carbon::parse($start_date);
        $end = \Carbon\Carbon::parse($end_date);

        // Check if current date is within the valid range
        if ($current_date->lt($start)) {
            // Current date is before start date
            return 0;
        }

        if ($current_date->gt($end)) {
            // Current date is after end date
            return 0;
        }

        // Current date is within the valid range (inclusive of start and end dates)
        return 1;
    }

    public function getValidityAttribute(){
        return ($this->is_applicable == 1) ? __('acceptable') : __('expired') ;
    }



}
