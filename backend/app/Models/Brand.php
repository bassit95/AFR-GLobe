<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HasFactory,SoftDeletes;

        protected $fillable = [
        'name', 
        'slug', 
        'meta_title',        // 🎯 Ajouté
        'meta_description',  // 🎯 Ajouté
        'logo', 
        'cover_image', 
        'description',
        'founded_year', 
        'country_id', 
        'city_id', 
        'website_url', 
        'status',
    ];

    protected $casts = [
        'founded_year' => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';           // ← AJOUT
    }

    /*
    |--------------------------------------------------------------------------
    | Relations
    |--------------------------------------------------------------------------
    */

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function creators(): BelongsToMany
    {
        return $this->belongsToMany(
            Creator::class,
            'creator_brand'
        )->withPivot('role')->withTimestamps();
    }

    public function boutiques(): HasMany
    {
        return $this->hasMany(Boutique::class);
    }

    public function collections(): HasMany
    {
        return $this->hasMany(Collection::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function sources(): BelongsToMany
    {
        return $this->belongsToMany(
            Source::class,
            'brand_sources'
        )->withTimestamps();
    }
}
