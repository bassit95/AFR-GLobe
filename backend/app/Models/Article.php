<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'meta_title',        // 🎯 Ajouté
        'meta_description',  // 🎯 Ajouté
        'excerpt',
        'content',
        'cover_image',
        'article_type',
        'author_id',
        'published_at',
        'status',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function sources(): BelongsToMany
    {
        return $this->belongsToMany(Source::class, 'article_sources')->withTimestamps();
    }
}