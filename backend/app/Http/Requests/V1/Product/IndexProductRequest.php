<?php

namespace App\Http\Requests\V1\Product;

use Illuminate\Foundation\Http\FormRequest;

class IndexProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'brand_id' => 'nullable|integer|exists:brands,id',
            'collection_id' => 'nullable|integer|exists:collections,id',
            'category_id' => 'nullable|integer|exists:categories,id',
            'style_id' => 'nullable|integer|exists:styles,id',
            'gender' => 'nullable|string|max:50',
            'availability' => 'nullable|string|max:50',

            // ✅ AJOUT
            'status' => 'nullable|string|in:draft,published,archived,all',

            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}