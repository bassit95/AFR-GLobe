<?php

namespace App\Http\Requests\V1\Creator;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCreatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $creator = $this->route('creator');

        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('creators', 'slug')->ignore($creator?->id),
            ],

            // ✅ AJOUT — SEO
            'meta_title' => 'sometimes|nullable|string|max:255',
            'meta_description' => 'sometimes|nullable|string|max:500',

            'profile_image' => 'sometimes|nullable|string|max:2048',
            'cover_image' => 'sometimes|nullable|string|max:2048',
            'country_of_origin_id' => ['sometimes', 'required', 'integer', 'exists:countries,id'],
            'country_of_residence_id' => ['sometimes', 'required', 'integer', 'exists:countries,id'],
            'city_of_residence_id' => ['sometimes', 'nullable', 'integer', 'exists:cities,id'],
            'gender' => 'sometimes|nullable|string|max:50',
            'short_bio' => 'sometimes|nullable|string|max:1000',
            'biography' => 'sometimes|nullable|string',
            'social_links' => 'sometimes|nullable|array',
            'website_url' => 'sometimes|nullable|url|max:2048',

            // ✅ AJOUT — awards
            'awards' => 'sometimes|nullable|array',
            'awards.*.title' => 'required_with:awards|string|max:255',
            'awards.*.org' => 'nullable|string|max:255',
            'awards.*.year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'awards.*.kind' => 'nullable|string|max:50',
            'awards.*.url' => 'nullable|url|max:2048',
            'awards.*.image' => 'nullable|string|max:2048',

            'status' => ['sometimes', 'nullable', Rule::in(['draft', 'published', 'archived'])],
            'verification_status' => ['sometimes', 'nullable', Rule::in(['unverified', 'verified', 'rejected'])],
            'category_ids' => 'sometimes|nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'style_ids' => 'sometimes|nullable|array',
            'style_ids.*' => 'integer|exists:styles,id',
            'brand_ids' => 'sometimes|nullable|array',
            'brand_ids.*' => 'integer|exists:brands,id',
            'source_ids' => 'sometimes|nullable|array',
            'source_ids.*' => 'integer|exists:sources,id',
        ];
    }
}