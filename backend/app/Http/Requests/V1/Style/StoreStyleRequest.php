<?php
// StoreStyleRequest.php

namespace App\Http\Requests\V1\Style;

use Illuminate\Foundation\Http\FormRequest;

class StoreStyleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent_id' => 'nullable|integer|exists:styles,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:styles,slug',
            'description' => 'nullable|string',
        ];
    }
}