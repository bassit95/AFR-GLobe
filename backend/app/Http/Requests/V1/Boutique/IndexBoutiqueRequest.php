<?php

namespace App\Http\Requests\V1\Boutique;

use Illuminate\Foundation\Http\FormRequest;

class IndexBoutiqueRequest extends FormRequest
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
            'country_id' => 'nullable|integer|exists:countries,id',
            'city_id' => 'nullable|integer|exists:cities,id',
            'type' => 'nullable|string|max:50',

            // ✅ AJOUT
            'status' => 'nullable|string|in:draft,published,archived,all',

            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}