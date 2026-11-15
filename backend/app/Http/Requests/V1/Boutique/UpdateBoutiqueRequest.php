<?php

namespace App\Http\Requests\V1\Boutique;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBoutiqueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand_id' => 'sometimes|nullable|integer|exists:brands,id',
            'name' => 'sometimes|required|string|max:255',

            // ✅ AJOUT — image
            'image' => 'sometimes|nullable|string|max:2048',

            'address' => 'sometimes|nullable|string|max:1000',
            'country_id' => 'sometimes|nullable|integer|exists:countries,id',
            'city_id' => 'sometimes|nullable|integer|exists:cities,id',
            'latitude' => 'sometimes|nullable|numeric|between:-90,90',
            'longitude' => 'sometimes|nullable|numeric|between:-180,180',
            'phone' => 'sometimes|nullable|string|max:50',
            'email' => 'sometimes|nullable|email|max:255',
            'type' => 'sometimes|nullable|string|max:50',
            'website_url' => 'sometimes|nullable|url|max:2048',
            'opening_hours' => 'sometimes|nullable|array',
            'status' => ['sometimes', 'nullable', Rule::in(['draft', 'published', 'archived'])],
            'source_ids' => 'sometimes|nullable|array',
            'source_ids.*' => 'integer|exists:sources,id',
        ];
    }
}