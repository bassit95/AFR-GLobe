<?php
// IndexCityRequest.php

namespace App\Http\Requests\V1\City;

use Illuminate\Foundation\Http\FormRequest;

class IndexCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'country_id' => 'nullable|integer|exists:countries,id',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}