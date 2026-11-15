<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'continent',
    ];

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }

    public function creatorsOrigin(): HasMany
    {
        return $this->hasMany(
            Creator::class,
            'country_of_origin_id'
        );
    }

    public function creatorsResidence(): HasMany
    {
        return $this->hasMany(
            Creator::class,
            'country_of_residence_id'
        );
    }

    public function brands(): HasMany
    {
        return $this->hasMany(Brand::class);
    }

    public function boutiques(): HasMany
    {
        return $this->hasMany(Boutique::class);
    }
}