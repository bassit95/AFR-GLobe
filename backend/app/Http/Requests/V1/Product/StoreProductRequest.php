<?php

namespace App\Http\Requests\V1\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand_id' => 'required|integer|exists:brands,id',

         'collection_id' => [
                  'nullable',
                   'integer',
                   Rule::exists('collections', 'id')
                 ->where('brand_id', $this->input('brand_id'))
                  ->whereNull('deleted_at'),
           ],

            'name' => 'required|string|max:255',

            'slug' => 'required|string|max:255|unique:products,slug',

            'description' => 'nullable|string',

            'image' => 'nullable|string|max:2048',

            'price' => 'nullable|numeric|min:0',

            'currency' => 'required|string|size:3',

            'gender' => 'nullable|string|max:50',

            'product_url' => 'nullable|url|max:2048',

            'availability' => 'nullable|string|max:50',

            'status' => [
                'nullable',
                Rule::in(['draft', 'published', 'archived']),
            ],

            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',

            'style_ids' => 'nullable|array',
            'style_ids.*' => 'integer|exists:styles,id',
        ];
    }
}