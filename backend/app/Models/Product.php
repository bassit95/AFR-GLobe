<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'brand_id',
        'collection_id',
        'name',
        'slug',
        'description',
        'image',
        'price',
        'currency',
        'gender',
        'product_url',
        'availability',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';           // ← AJOUT
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            Category::class,
            'product_category'
        );
    }

    public function styles(): BelongsToMany
    {
        return $this->belongsToMany(
            Style::class,
            'product_style'
        );
    }
}