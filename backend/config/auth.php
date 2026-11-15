<?php

use App\Models\User;

return [

    /*
    |--------------------------------------------------------------------------
    | DÉFAUTS D'AUTHENTIFICATION
    |--------------------------------------------------------------------------
    | guard par défaut = 'web' (session) → ✅ correct pour SPA
    | password broker = 'users' (pour future fonctionnalité "mot de passe oublié")
    */
    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | GUARDS D'AUTHENTIFICATION
    |--------------------------------------------------------------------------
    | 'web' utilise le driver 'session' → lit le cookie laravel_session
    | et résout l'utilisateur via $provider ('users' → Eloquent User::class)
    |
    | ⚠️ Il n'y a PAS de guard 'api' ici → c'est normal, Sanctum gère
    |    l'authentification API via son propre middleware auth:sanctum
    */
    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | PROVIDERS UTILISATEURS
    |--------------------------------------------------------------------------
    | Comment récupérer un utilisateur depuis la DB.
    | 'eloquent' = utilise le Model App\Models\User (✅)
    */
    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', User::class),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | RÉINITIALISATION MOT DE PASSE
    |--------------------------------------------------------------------------
    | Non utilisé pour l'instant, mais prêt si tu ajoutes /forgot-password
    | expire 60 min, throttle 60 secondes entre 2 demandes
    */
    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | TIMEOUT DE CONFIRMATION DE MOT DE PASSE
    |--------------------------------------------------------------------------
    | Durée pendant laquelle un utilisateur n'a pas à re-taper son mot de passe
    | (3h par défaut) pour accéder aux zones sensibles
    */
    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];