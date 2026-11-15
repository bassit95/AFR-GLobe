<?php
// UpdateCountryRequest.php

namespace App\Http\Requests\V1\Country;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCountryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $country = $this->route('country');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('countries', 'name')
                    ->ignore($country?->id),
            ],

            'code' => [
                'sometimes',
                'required',
                'string',
                'size:2',
                Rule::unique('countries', 'code')
                    ->ignore($country?->id),
            ],

            'continent' => 'sometimes|nullable|string|max:100',
        ];
    }
}