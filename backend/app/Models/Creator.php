<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Creator extends Model
{
    use HasFactory;
    use SoftDeletes;

        protected $fillable = [
        'name',
        'slug',
        'meta_title',        // 🎯 Ajouté
        'meta_description',  // 🎯 Ajouté
        'profile_image',
        'cover_image',
        'country_of_origin_id',
        'country_of_residence_id',
        'city_of_residence_id',
        'gender',
        'short_bio',
        'biography',
        'social_links',
        'website_url',
        'status',
        'verification_status',
    ];

    protected $casts = [
        'social_links' => 'array',
        'awards' => 'array',
    ];

    public function originCountry(): BelongsTo
    {
        return $this->belongsTo(
            Country::class,
            'country_of_origin_id'
        );
    }

    public function residenceCountry(): BelongsTo
    {
        return $this->belongsTo(
            Country::class,
            'country_of_residence_id'
        );
    }

    public function residenceCity(): BelongsTo
    {
        return $this->belongsTo(
            City::class,
            'city_of_residence_id'
        );
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            Category::class, 'creator_category'
        );
    }

    public function styles(): BelongsToMany
    {
        return $this->belongsToMany(
            Style::class , 'creator_style'
        );
    }

    public function brands(): BelongsToMany
    {
        return $this->belongsToMany(
            Brand::class, 'creator_brand'
        )->withPivot('role')->withTimestamps();
    }

    public function portfolioItems(): HasMany
    {
        return $this->hasMany(
            PortfolioItem::class
        );
    }

    public function sources(): BelongsToMany
    {
        return $this->belongsToMany(
            Source::class,
            'creator_sources'
        )->withTimestamps();
    }

 public function getRouteKeyName(): string
{
    return 'slug';
}    
}

 