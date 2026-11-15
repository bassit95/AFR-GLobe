<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Source extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'source_type',
        'url',
        'publisher',
        'published_at',
        'checked_at',
    ];

    protected $casts = [
        'published_at' => 'date',
        'checked_at' => 'datetime',
    ];

    public function creators(): BelongsToMany
    {
        return $this->belongsToMany(
            Creator::class,
            'creator_sources'
        );
    }

    public function brands(): BelongsToMany
    {
        return $this->belongsToMany(
            Brand::class,
            'brand_sources'
        );
    }

    public function boutiques(): BelongsToMany
    {
        return $this->belongsToMany(
            Boutique::class,
            'boutique_sources'
        );
    }

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(
            Article::class,
            'article_sources'
        );
    }
}