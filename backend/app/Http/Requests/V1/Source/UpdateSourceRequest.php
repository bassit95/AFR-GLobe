<?php
// UpdateSourceRequest.php

namespace App\Http\Requests\V1\Source;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'source_type' => 'sometimes|required|string|max:100',
            'url' => 'sometimes|required|url|max:2048',
            'publisher' => 'sometimes|nullable|string|max:255',
            'published_at' => 'sometimes|nullable|date',
            'checked_at' => 'sometimes|nullable|date',
        ];
    }
}