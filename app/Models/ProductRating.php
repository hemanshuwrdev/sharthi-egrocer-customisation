<?php

namespace App\Models;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class ProductRating extends Model
{
    use HasFactory, LogsActivity;
    protected $hidden = ['created_at','deleted_at'];

   
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->select(['id', 'name', 'profile']);
    } 
    public function images(){

        return $this->hasMany(RatingImages::class,'product_rating_id','id');
    }

    public function getImageUrlAttribute(){

        if($this->image){
            $image_url = asset('storage/'.$this->image);
        }else{
            $image_url = '';
        }
        return $image_url;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('ProductRating');
    }
}
