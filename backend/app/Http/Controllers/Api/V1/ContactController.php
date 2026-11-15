<?php
// app/Http/Controllers/Api/V1/ContactController.php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Contact\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        // Création du message avec les données validées
        ContactMessage::create([
            ...$request->validated(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre message a bien été envoyé. Nous vous répondrons sous 48h.',
        ], 201);
    }
}
