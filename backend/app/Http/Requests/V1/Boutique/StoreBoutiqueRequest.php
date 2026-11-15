<?php

namespace App\Http\Requests\V1\Boutique;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBoutiqueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand_id' => 'nullable|integer|exists:brands,id',
            'name' => 'required|string|max:255',

            // ✅ AJOUT — image
            'image' => 'nullable|string|max:2048',

            'address' => 'nullable|string|max:1000',
            'country_id' => 'nullable|integer|exists:countries,id',
            'city_id' => 'nullable|integer|exists:cities,id',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'type' => 'nullable|string|max:50',
            'website_url' => 'nullable|url|max:2048',
            'opening_hours' => 'nullable|array',
            'status' => ['nullable', Rule::in(['draft', 'published', 'archived'])],
            'source_ids' => 'nullable|array',
            'source_ids.*' => 'integer|exists:sources,id',
        ];
    }
}