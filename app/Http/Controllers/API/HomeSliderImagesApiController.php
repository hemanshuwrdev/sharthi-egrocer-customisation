<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class HomeSliderImagesApiController extends Controller
{
    public function index(){

        $sliders = Slider::with('category.translations', 'product.translations')
            ->orderBy('id','DESC')
            ->get()
            ->map(function ($slider) {
                // Convert slider to array to ensure all data is included
                $sliderArray = $slider->toArray();
                
                // Ensure translations are included as arrays (not accessors)
                if ($slider->category) {
                    // Get category as array
                    $categoryArray = $slider->category->toArray();
                    // Hide the translations accessor that returns only current language
                    $slider->category->makeHidden(['translations']);
                    // Add full translations array from relation
                    if ($slider->category->relationLoaded('translations')) {
                        $categoryArray['translations'] = $slider->category->getRelation('translations')->toArray();
                    } else {
                        $categoryArray['translations'] = [];
                    }
                    // Update the category in slider array
                    $sliderArray['category'] = $categoryArray;
                }
                
                if ($slider->product) {
                    // Get product as array
                    $productArray = $slider->product->toArray();
                    // Hide the translations accessor that returns only current language
                    $slider->product->makeHidden(['translations']);
                    // Add full translations array from relation
                    if ($slider->product->relationLoaded('translations')) {
                        $productArray['translations'] = $slider->product->getRelation('translations')->toArray();
                    } else {
                        $productArray['translations'] = [];
                    }
                    // Update the product in slider array
                    $sliderArray['product'] = $productArray;
                }
                
                return $sliderArray;
            })
            ->toArray();

        return CommonHelper::responseWithData($sliders);
    }

    public function save(Request $request){
        $validator = Validator::make($request->all(),[
            'type' => 'required',
            'type_id' => 'required_if:type,category,product',
            'slider_url' => 'required_if:type,==,slider_url',
            'image' => 'required|mimes:jpeg,jpg,png,gif'
        ],[
            'type_id.required_if' => 'The '.$request->type.' field is required when type is '.$request->type.'.',
            'slider_url.required_if' => 'The link field is required when type is Slider Url.',
            'slider_url.url' => 'The link must be a valid URL.',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $slider = new Slider();
        $slider->type = $request->type;
        $slider->type_id = ($request->type_id)?$request->type_id:0;
        $image = '';
        if($request->hasFile('image')){
            $file = $request->file('image');
            $fileName = time().'_'.rand(1111,99999).'.'.$file->getClientOriginalExtension();
            $image = Storage::disk('public')->putFileAs('sliders', $file, $fileName);
        }
       $slider->image = $image;
       $slider->slider_url = $request->slider_url;
       $slider->save();
       return CommonHelper::responseSuccess('home_slider_images_saved_successfully');
    }

    public function update(Request $request){
        $validator = Validator::make($request->all(),[
            'type' => 'required',
            'type_id' => 'required_if:type,category,product',
            'slider_url' => 'required_if:type,==,slider_url',
            'image' => $request->hasFile('image') ? 'mimes:jpeg,jpg,png,gif' : ''
        ],[
            'type_id.required_if' => 'The '.$request->type.' field is required when type is '.$request->type.'.',
            'slider_url.required_if' => 'The link field is required when type is Slider Url.',
            'slider_url.url' => 'The link must be a valid URL.',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if(isset($request->id)){

            $slider = Slider::find($request->id);
            $slider->type = $request->type;
            $slider->type_id = $request->type_id;
            $slider->status = $request->status;
            if($request->hasFile('image')){
                @Storage::disk('public')->delete($slider->image);
                $file = $request->file('image');
                $fileName = time().'_'.rand(1111,99999).'.'.$file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('sliders', $file, $fileName);
                $slider->image = $image;
            }
            $slider->slider_url = $request->slider_url;
            $slider->save();
        }


        return CommonHelper::responseSuccess('slider_updated_successfully');
    }

    public function delete(Request $request){

        if(isset($request->id)){

            $slider = Slider::find($request->id);
            if($slider){
                @Storage::disk('public')->delete($slider->image);
                $slider->delete();
                return CommonHelper::responseSuccess('slider_deleted_successfully');
            }else{
                return CommonHelper::responseSuccess('slider_already_deleted');
            }
        }
    }


}
