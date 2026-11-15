<?php
// UpdateStyleRequest.php

namespace App\Http\Requests\V1\Style;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStyleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $style = $this->route('style');

        return [
            'parent_id' => 'sometimes|nullable|integer|exists:styles,id',

            'name' => 'sometimes|required|string|max:255',

            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('styles', 'slug')
                    ->ignore($style?->id),
            ],

            'description' => 'sometimes|nullable|string',
        ];
    }
}