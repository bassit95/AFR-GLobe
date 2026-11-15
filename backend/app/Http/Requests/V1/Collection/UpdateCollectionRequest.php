<?php

namespace App\Http\Requests\V1\Collection;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCollectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $collection = $this->route('collection');

        return [
            'brand_id' => 'sometimes|required|integer|exists:brands,id',

            'name' => 'sometimes|required|string|max:255',

            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('collections', 'slug')
                    ->ignore($collection?->id),
            ],

            'description' => 'sometimes|nullable|string',

            'year' => 'sometimes|nullable|integer|min:1000|max:' . date('Y'),

            'season' => 'sometimes|nullable|string|max:100',

            'cover_image' => 'sometimes|nullable|string|max:2048',

            'status' => [
                'sometimes',
                'nullable',
                Rule::in(['draft', 'published', 'archived']),
            ],
        ];
    }
}