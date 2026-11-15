<?php

namespace App\Http\Requests\V1\City;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'country_id' => 'required|integer|exists:countries,id',

            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cities', 'name')
                    ->where(
                        fn ($query) => $query->where(
                            'country_id',
                            $this->country_id
                        )
                    ),
            ],
        ];
    }
}