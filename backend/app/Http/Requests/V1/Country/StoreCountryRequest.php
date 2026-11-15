<?php
// StoreCountryRequest.php

namespace App\Http\Requests\V1\Country;

use Illuminate\Foundation\Http\FormRequest;

class StoreCountryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:countries,name',
            'code' => 'required|string|size:2|unique:countries,code',
            'continent' => 'nullable|string|max:100',
        ];
    }
}