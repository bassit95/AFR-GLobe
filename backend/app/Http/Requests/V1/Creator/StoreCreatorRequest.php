<?php

namespace App\Http\Requests\V1\Creator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCreatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:creators,slug',

            // ✅ AJOUT — SEO
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',

            'profile_image' => 'nullable|string|max:2048',
            'cover_image' => 'nullable|string|max:2048',
            'country_of_origin_id' => ['required', 'integer', 'exists:countries,id'],
            'country_of_residence_id' => ['required', 'integer', 'exists:countries,id'],
            'city_of_residence_id' => ['nullable', 'integer', 'exists:cities,id'],
            'gender' => 'nullable|string|max:50',
            'short_bio' => 'nullable|string|max:1000',
            'biography' => 'nullable|string',
            'social_links' => 'nullable|array',
            'website_url' => 'nullable|url|max:2048',

            // ✅ AJOUT — awards
            'awards' => 'nullable|array',
            'awards.*.title' => 'required_with:awards|string|max:255',
            'awards.*.org' => 'nullable|string|max:255',
            'awards.*.year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'awards.*.kind' => 'nullable|string|max:50',
            'awards.*.url' => 'nullable|url|max:2048',
            'awards.*.image' => 'nullable|string|max:2048',

            'status' => ['nullable', Rule::in(['draft', 'published', 'archived'])],
            'verification_status' => ['nullable', Rule::in(['unverified', 'verified', 'rejected'])],
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'style_ids' => 'nullable|array',
            'style_ids.*' => 'integer|exists:styles,id',
            'brand_ids' => 'nullable|array',
            'brand_ids.*' => 'integer|exists:brands,id',
            'source_ids' => 'nullable|array',
            'source_ids.*' => 'integer|exists:sources,id',
        ];
    }
}