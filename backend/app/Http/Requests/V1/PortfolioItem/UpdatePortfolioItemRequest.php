<?php
// UpdatePortfolioItemRequest.php

namespace App\Http\Requests\V1\PortfolioItem;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePortfolioItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'creator_id' => 'sometimes|required|integer|exists:creators,id',
            'collection_id' => 'sometimes|nullable|integer|exists:collections,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'image' => 'sometimes|nullable|string|max:2048',
            'alt_text' => 'sometimes|nullable|string|max:255',
            'year' => 'sometimes|nullable|integer|min:1000|max:' . date('Y'),
            'display_order' => 'sometimes|nullable|integer|min:0',
            'status' => [
                'sometimes',
                'nullable',
                Rule::in(['draft', 'published', 'archived']),
            ],
        ];
    }
}