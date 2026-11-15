<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resource extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'resource_type',
        'url',
        'cover_image',
        'status',
    ];
    public function getRouteKeyName(): string
    {
        return 'slug';           // ← AJOUT
    }

}

