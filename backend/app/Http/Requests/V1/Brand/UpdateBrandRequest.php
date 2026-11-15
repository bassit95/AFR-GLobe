<?php

namespace App\Http\Requests\V1\Brand;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $brand = $this->route('brand');

        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('brands', 'slug')->ignore($brand?->id),
            ],

            // ✅ AJOUT — SEO
            'meta_title' => 'sometimes|nullable|string|max:255',
            'meta_description' => 'sometimes|nullable|string|max:500',

            'logo' => 'sometimes|nullable|string|max:2048',
            'cover_image' => 'sometimes|nullable|string|max:2048',
            'description' => 'sometimes|nullable|string',
            'founded_year' => ['sometimes', 'nullable', 'integer', 'min:1000', 'max:' . date('Y')],
            'country_id' => 'sometimes|nullable|integer|exists:countries,id',
            'city_id' => 'sometimes|nullable|integer|exists:cities,id',
            'website_url' => 'sometimes|nullable|url|max:2048',
            'status' => ['sometimes', 'nullable', Rule::in(['draft', 'published', 'archived'])],
            'creators' => 'sometimes|nullable|array',
            'creators.*.id' => 'required|integer|exists:creators,id',
            'creators.*.role' => 'nullable|string|max:100',
            'source_ids' => 'sometimes|nullable|array',
            'source_ids.*' => 'integer|exists:sources,id',
        ];
    }
}