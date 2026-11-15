<?php

namespace App\Http\Requests\V1\Collection;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCollectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand_id' => 'required|integer|exists:brands,id',

            'name' => 'required|string|max:255',

            'slug' => 'required|string|max:255|unique:collections,slug',

            'description' => 'nullable|string',

            'year' => 'nullable|integer|min:1000|max:' . date('Y'),

            'season' => 'nullable|string|max:100',

            'cover_image' => 'nullable|string|max:2048',

            'status' => [
                'nullable',
                Rule::in(['draft', 'published', 'archived']),
            ],
        ];
    }
}