<?php

namespace App\Http\Requests\V1\City;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $city = $this->route('city');

        return [
            'country_id' => 'sometimes|required|integer|exists:countries,id',

            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('cities', 'name')
                    ->where(
                        fn ($query) => $query->where(
                            'country_id',
                            $this->country_id ?? $city?->country_id
                        )
                    )
                    ->ignore($city?->id),
            ],
        ];
    }
}