<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentCompany extends Model
{
    use HasFactory;

    protected $table = 'parent_companies';

    protected $fillable = [
        'name',
        'status',
    ];

    public function masterProducts()
    {
        return $this->hasMany(MasterProduct::class, 'parent_company_id');
    }
}
