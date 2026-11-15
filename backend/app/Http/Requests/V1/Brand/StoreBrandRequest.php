<?php

namespace App\Http\Requests\V1\Brand;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:brands,slug',

            // ✅ AJOUT — SEO
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',

            'logo' => 'nullable|string|max:2048',
            'cover_image' => 'nullable|string|max:2048',
            'description' => 'nullable|string',
            'founded_year' => ['nullable', 'integer', 'min:1000', 'max:' . date('Y')],
            'country_id' => 'nullable|integer|exists:countries,id',
            'city_id' => 'nullable|integer|exists:cities,id',
            'website_url' => 'nullable|url|max:2048',
            'status' => ['nullable', Rule::in(['draft', 'published', 'archived'])],
            'creators' => 'nullable|array',
            'creators.*.id' => 'required|integer|exists:creators,id',
            'creators.*.role' => 'nullable|string|max:100',
            'source_ids' => 'nullable|array',
            'source_ids.*' => 'integer|exists:sources,id',
        ];
    }
}