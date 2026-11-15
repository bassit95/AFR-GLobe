<?php

namespace App\Http\Requests\V1\Creator;

use Illuminate\Foundation\Http\FormRequest;

class IndexCreatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'country_origin' => 'nullable|integer|exists:countries,id',
            'country_residence' => 'nullable|integer|exists:countries,id',
            'city' => 'nullable|integer|exists:cities,id',
            'gender' => 'nullable|string|max:50',

            // ⚠️ ANCIEN — conservé pour compatibilité
            'category' => 'nullable|integer|exists:categories,id',

            // ✅ NOUVEAU — multi-select
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',

            'style' => 'nullable|integer|exists:styles,id',
            'letter' => 'nullable|string|size:1|alpha',

            // ✅ AJOUT — status (admin)
            'status' => 'nullable|string|in:draft,published,archived,all',

            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}