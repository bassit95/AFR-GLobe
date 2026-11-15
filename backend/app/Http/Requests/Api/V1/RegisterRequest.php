<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à effectuer cette requête.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation appliquées à la requête d'inscription.
     */
  public function rules(): array
{
    return [
        'name' => [
            'required',
            'string',
            'max:255',
        ],
        'email' => [
            'required',
            'string',
            'email',
            'max:255',
            'unique:users,email',
        ],
        'password' => [
         'required',
           'string',
    // 'confirmed',
       Password::min(8)
        ->max(255)
        ->letters()
        ->numbers(),
     ],
    ];
}

public function messages(): array
{
    return [
        'email.unique' => 'Cette adresse email est déjà utilisée.',
        'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
    ];
}
}