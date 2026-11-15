<?php
// StoreResourceRequest.php

namespace App\Http\Requests\V1\Resource;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:resources,slug',
            'description' => 'nullable|string',
            'resource_type' => 'required|string|max:100',
            'url' => 'required|url|max:2048',
            'cover_image' => 'nullable|string|max:2048',
            'status' => [
                'nullable',
                Rule::in(['draft', 'published', 'archived']),
            ],
        ];
    }
}