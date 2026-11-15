<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortfolioItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'creator_id',
        'collection_id',
        'title',
        'description',
        'image',
        'alt_text',
        'year',
        'display_order',
        'status',
    ];

    protected $casts = [
        'year' => 'integer',
        'display_order' => 'integer',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }
}