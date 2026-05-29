<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaApiController extends Controller
{
    public function index()
    {
        $media = Media::select("media.*", "sellers.name as seller_name")
            ->leftJoin('sellers', 'media.seller_id', '=', 'sellers.id')
            ->orderBy('id', 'DESC')->get();
        return CommonHelper::responseWithData($media);
    }
    public function save(Request $request)
    {
        if ($request->hasFile('files')) {
            $files = $request->file('files');
            foreach ($files as $key => $file) {
                $fileName = str_replace(' ', '-', strtolower($file->getClientOriginalName()));
                $extension = $file->getClientOriginalExtension();
                $type = $file->getClientMimeType();
                $size = $file->getSize();
                $precision = 2;
                $base = log($size, 1024);
                $suffixes = array('', 'KB', 'MB', 'GB', 'TB');
                $covertedSize = round(pow(1024, $base - floor($base)), $precision) . ' ' . $suffixes[floor($base)];
                $sub_directory = 'products/media/';
                $uploaedFileName = time() . '_' . $fileName;
                Storage::disk('public')->putFileAs($sub_directory, $file, $uploaedFileName);
                $media = new Media();
                $media->name = $uploaedFileName;
                $media->extension = $extension;
                $media->type = $type;
                $media->sub_directory = $sub_directory;
                $media->size = $covertedSize;
                $media->seller_id = optional(auth()->user()->seller)->id ?? 0;
                $media->save();
            }
            return CommonHelper::responseSuccess('media_image_uploaded_successfully');
        }
    }
    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $media = Media::find($request->id);
            if ($media) {
                @Storage::disk('public')->delete($media->sub_directory . $media->name);
                $media->delete();
                return CommonHelper::responseSuccess('media_file_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess('media_file_already_deleted');
            }
        }
    }

    public function multipleDelete(Request $request)
    {
        if (isset($request->ids)) {
            $ids = explode(',', $request->ids);

            $mediaFiles = Media::whereIn('id', $ids)->get();
            foreach ($mediaFiles as $media) {
                @Storage::disk('public')->delete($media->sub_directory . $media->name);
                $media->delete();
            }

            return CommonHelper::responseSuccess('selected_all_media_files_deleted_successfully');
        }
    }

    public function editorUpload(Request $request)
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = str_replace(' ', '-', strtolower($file->getClientOriginalName()));
            $uploaedFileName = time() . '_' . $fileName;
            $sub_directory = 'products/media/';
            Storage::disk('public')->putFileAs($sub_directory, $file, $uploaedFileName);

            return response()->json([
                'location' => asset('storage/' . $sub_directory . $uploaedFileName)
            ]);
        }
        return response()->json(['error' => 'No file uploaded'], 400);
    }
}
