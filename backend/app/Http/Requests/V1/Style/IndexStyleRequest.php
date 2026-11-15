<?php
// IndexStyleRequest.php

namespace App\Http\Requests\V1\Style;

use Illuminate\Foundation\Http\FormRequest;

class IndexStyleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'parent_id' => 'nullable|integer|exists:styles,id',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}