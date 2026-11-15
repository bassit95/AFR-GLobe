<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Collection extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'brand_id',
        'name',
        'slug',
        'description',
        'year',
        'season',
        'cover_image',
        'status',
    ];

    protected $casts = [
        'year' => 'integer',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';           // ← AJOUT
    }


    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function portfolioItems(): HasMany
    {
        return $this->hasMany(PortfolioItem::class);
    }
}