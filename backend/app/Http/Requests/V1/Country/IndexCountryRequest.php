<?php
// IndexCountryRequest.php

namespace App\Http\Requests\V1\Country;

use Illuminate\Foundation\Http\FormRequest;

class IndexCountryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'code' => 'nullable|string|size:2',
            'continent' => 'nullable|string|max:100',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}