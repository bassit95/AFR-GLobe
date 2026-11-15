<?php

namespace App\Http\Requests\V1\Collection;

use Illuminate\Foundation\Http\FormRequest;

class IndexCollectionRequest extends FormRequest
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
            'year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'season' => 'nullable|string|max:100',

            // ✅ AJOUT
            'status' => 'nullable|string|in:draft,published,archived,all',

            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}