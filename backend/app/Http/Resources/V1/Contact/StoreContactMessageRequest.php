<?php
// app/Http/Requests/Api/V1/Contact/StoreContactMessageRequest.php

namespace App\Http\Requests\Api\V1\Contact;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|min:10|max:5000',
            // 🎯 Honeypot anti-spam (doit être vide)
            'website' => 'prohibited', 
        ];
    }
}