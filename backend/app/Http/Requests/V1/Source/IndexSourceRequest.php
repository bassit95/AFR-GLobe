<?php
// IndexSourceRequest.php

namespace App\Http\Requests\V1\Source;

use Illuminate\Foundation\Http\FormRequest;

class IndexSourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'source_type' => 'nullable|string|max:100',
            'publisher' => 'nullable|string|max:255',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}