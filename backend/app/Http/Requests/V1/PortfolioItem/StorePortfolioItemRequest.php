<?php
// StorePortfolioItemRequest.php

namespace App\Http\Requests\V1\PortfolioItem;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePortfolioItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'creator_id' => 'required|integer|exists:creators,id',
            'collection_id' => 'nullable|integer|exists:collections,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:2048',
            'alt_text' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'display_order' => 'nullable|integer|min:0',
            'status' => [
                'nullable',
                Rule::in(['draft', 'published', 'archived']),
            ],
        ];
    }
}