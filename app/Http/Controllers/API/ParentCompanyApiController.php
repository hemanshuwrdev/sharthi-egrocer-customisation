<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\ParentCompany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ParentCompanyApiController extends Controller
{
    public function list(Request $request)
    {
        if ($request->filled('id')) {
            $row = ParentCompany::find($request->id);
            return CommonHelper::responseWithData($row);
        }

        $limit = $request->input('per_page', 10);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $filter = $request->input('filter', '');

        $query = ParentCompany::orderBy('id', 'DESC');

        if ($filter) {
            $query->where('name', 'like', "%{$filter}%");
        }

        $total = $query->count();
        $rows = $query->skip($offset)->take($limit)->get();

        return CommonHelper::responseWithData($rows, $total);
    }

    public function search(Request $request)
    {
        $q = trim((string) $request->input('q', ''));
        $query = ParentCompany::where('status', 1)->orderBy('name', 'ASC');
        if ($q !== '') {
            $query->where('name', 'like', "%{$q}%");
        }
        return CommonHelper::responseWithData($query->limit(20)->get());
    }

    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:parent_companies,name',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $row = ParentCompany::create([
            'name' => $request->name,
            'status' => 1,
        ]);

        return CommonHelper::responseWithData([
            'id' => $row->id,
            'name' => $row->name,
            'message' => __('parent_company_saved_successfully'),
        ]);
    }

    /**
     * Inline create-on-the-fly used by master product form.
     * If a row with this name exists, return it; otherwise create + return.
     */
    public function findOrCreate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $name = trim($request->name);
        $row = ParentCompany::whereRaw('LOWER(name) = ?', [strtolower($name)])->first();
        if (!$row) {
            $row = ParentCompany::create([
                'name' => $name,
                'status' => 1,
            ]);
        }

        return CommonHelper::responseWithData([
            'id' => $row->id,
            'name' => $row->name,
        ]);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:parent_companies,id',
            'name' => 'required|string|max:255|unique:parent_companies,name,' . $request->id,
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $row = ParentCompany::find($request->id);
        $row->name = $request->name;
        if ($request->has('status')) {
            $row->status = $request->status;
        }
        $row->save();

        return CommonHelper::responseSuccess('parent_company_updated_successfully');
    }

    public function delete(Request $request)
    {
        $row = ParentCompany::find($request->id);
        if (!$row) {
            return CommonHelper::responseError('parent_company_not_found');
        }
        $row->delete();
        return CommonHelper::responseSuccess('parent_company_deleted_successfully');
    }
}
