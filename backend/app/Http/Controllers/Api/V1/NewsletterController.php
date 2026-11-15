<?php
// app/Http/Controllers/Api/V1/NewsletterController.php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Newsletter\SubscribeNewsletterRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{// Dans NewsletterController::store() — version idempotente
public function store(SubscribeNewsletterRequest $request): JsonResponse
{
    $existing = NewsletterSubscriber::where('email', $request->validated('email'))->first();

    if ($existing) {
        return response()->json([
            'success' => true,
            'message' => 'Vous êtes déjà inscrit à notre newsletter.',
        ], 200);
    }

    NewsletterSubscriber::create([
        'email' => $request->validated('email'),
        'token' => Str::random(32),
        'ip_address' => $request->ip(),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Merci ! Vous êtes bien inscrit à notre newsletter.',
    ], 201);
}
}