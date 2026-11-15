<?php

namespace App\Http\Requests\V1\PortfolioItem;

use Illuminate\Foundation\Http\FormRequest;

class IndexPortfolioItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'creator_id' => 'nullable|integer|exists:creators,id',
            'collection_id' => 'nullable|integer|exists:collections,id',
            'year' => 'nullable|integer|min:1000|max:' . date('Y'),

            // ✅ AJOUT
            'status' => 'nullable|string|in:draft,published,archived,all',

            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}