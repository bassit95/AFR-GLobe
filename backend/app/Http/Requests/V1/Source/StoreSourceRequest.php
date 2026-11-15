<?php
// StoreSourceRequest.php

namespace App\Http\Requests\V1\Source;

use Illuminate\Foundation\Http\FormRequest;

class StoreSourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'source_type' => 'required|string|max:100',
            'url' => 'required|url|max:2048',
            'publisher' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'checked_at' => 'nullable|date',
        ];
    }
}