<?php

namespace App\Http\Requests\Api\V1\Newsletter;

use Illuminate\Foundation\Http\FormRequest;

class SubscribeNewsletterRequest extends FormRequest
{
    /*
    |--------------------------------------------------------------------------
    | AUTORISATION
    |--------------------------------------------------------------------------
    | Route publique → tout le monde peut s'inscrire (pas d'auth requise)
    | ⚠️ La protection anti-spam se fait via throttle:newsletter (5/min)
    |    configurée dans AppServiceProvider
    */
    public function authorize(): bool
    {
        return true;
    }

    /*
    |--------------------------------------------------------------------------
    | RÈGLES DE VALIDATION
    |--------------------------------------------------------------------------
    | - email         : requis, format email valide
    | - email.unique  : ⚠️ NE PEUT PAS s'inscrire 2 fois avec le même email
    |                   → retourne 422 avec message "Cette adresse email
    |                     est déjà inscrite à notre newsletter."
    |                   → Design choice : tu peux préférer un succès silencieux
    |                     (idempotent) au lieu d'une erreur
    | - website       : honeypot anti-spam → si rempli, c'est un bot
    */
    public function rules(): array
    {
        return [
            'email' => 'required|email|max:255|unique:newsletter_subscribers,email',

            // 🎯 Honeypot : ce champ doit rester VIDE côté frontend
            // → Si rempli → 422 (bots remplissent souvent tous les champs)
            'website' => 'prohibited',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | MESSAGES PERSONNALISÉS
    |--------------------------------------------------------------------------
    */
    public function messages(): array
    {
        return [
            'email.unique' => 'Cette adresse email est déjà inscrite à notre newsletter.',
        ];
    }
}