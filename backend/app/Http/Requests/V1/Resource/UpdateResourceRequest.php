<?php
// UpdateResourceRequest.php

namespace App\Http\Requests\V1\Resource;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $resource = $this->route('resource');

        return [
            'title' => 'sometimes|required|string|max:255',

            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('resources', 'slug')
                    ->ignore($resource?->id),
            ],

            'description' => 'sometimes|nullable|string',

            'resource_type' => 'sometimes|required|string|max:100',

            'url' => 'sometimes|required|url|max:2048',

            'cover_image' => 'sometimes|nullable|string|max:2048',

            'status' => [
                'sometimes',
                'nullable',
                Rule::in(['draft', 'published', 'archived']),
            ],
        ];
    }
}