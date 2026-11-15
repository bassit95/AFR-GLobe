<?php

namespace App\Http\Requests\V1\Brand;

use Illuminate\Foundation\Http\FormRequest;

class IndexBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'country_id' => 'nullable|integer|exists:countries,id',
            'city_id' => 'nullable|integer|exists:cities,id',
            'creator_id' => 'nullable|integer|exists:creators,id',

            // ✅ AJOUT
            'status' => 'nullable|string|in:draft,published,archived,all',

            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}