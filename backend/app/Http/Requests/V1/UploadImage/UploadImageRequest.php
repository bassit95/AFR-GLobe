<?php

namespace App\Http\Requests\V1\UploadImage;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
{
    /*
    |--------------------------------------------------------------------------
    | AUTORISATION
    |--------------------------------------------------------------------------
    | ⚠️ Retourne TRUE toujours → l'autorisation est gérée par le middleware
    | 'admin' qui protège la route /admin/upload
    |
    | Si tu veux tester en isolation (sans le middleware), tu peux faire :
    |   return $this->user()?->role === 'admin';
    */
    public function authorize(): bool
    {
        return true;
    }

    /*
    |--------------------------------------------------------------------------
    | RÈGLES DE VALIDATION
    |--------------------------------------------------------------------------
    | - image : fichier requis, doit être une image valide
    | - mimes : extensions autorisées (jpeg, png, jpg, gif, webp)
    | - max   : 5120 Ko = 5 Mo (5 * 1024)
    |
    | ⚠️ MANQUE : validation des dimensions max
    | → Un PNG de 10000x10000 compressé à 50 Ko pourrait passer
    | → Ajouter `dimensions:max_width=...,max_height=...` si tu veux limiter
    */
    public function rules(): array
    {
        return [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | SUGGESTION D'AMÉLIORATION (optionnelle)
    |--------------------------------------------------------------------------
    | Si tu veux limiter les dimensions (évite les DoS) :
    |
    | 'image' => [
    |     'required',
    |     'image',
    |     'mimes:jpeg,png,jpg,gif,webp',
    |     'max:5120',
    |     'dimensions:max_width=4000,max_height=4000',
    | ],
    */
}