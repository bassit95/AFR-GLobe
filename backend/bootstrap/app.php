<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Http\Middleware\IsAdmin;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

return Application::configure(basePath: dirname(__DIR__))
    /*
    |--------------------------------------------------------------------------
    | ROUTING
    |--------------------------------------------------------------------------
    | - web    : routes/web.php (webhook, redirections, etc.)
    | - api    : routes/api.php (toutes nos routes /api/v1/*)
    | - console: routes/console.php (commandes Artisan)
    | - health : /up (endpoint de healthcheck pour load balancer / Kubernetes)
    */
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    /*
    |--------------------------------------------------------------------------
    | MIDDLEWARE
    |--------------------------------------------------------------------------
    */
    ->withMiddleware(function (Middleware $middleware): void {

        // 🎯 ACTIVE LE MODE SPA STATEFUL DE SANCTUM
        // → Permet l'authentification par cookies de session (pas tokens Bearer)
        // → Requis pour que /login + /me + /logout fonctionnent avec Auth::login()
        // → Utilise la config 'stateful' de config/sanctum.php
        $middleware->statefulApi();

        // 🎯 ALIAS DE MIDDLEWARES CUSTOM
        // - admin    : vérifie $user->role === 'admin' → bloque les non-admins (403)
        // - abilities: Sanctum "must have ALL these abilities" (via CheckAbilities)
        // - ability  : Sanctum "must have ANY of these abilities" (via CheckForAnyAbility)
        $middleware->alias([
            'admin'     => IsAdmin::class,
            'abilities' => CheckAbilities::class,
            'ability'   => CheckForAnyAbility::class,
        ]);

    })

    /*
    |--------------------------------------------------------------------------
    | GESTION DES EXCEPTIONS
    |--------------------------------------------------------------------------
    | 🎯 CRUCIAL POUR LE FRONTEND
    | - Force les erreurs (401/403/404/422/500) à être renvoyées en JSON
    |   quand la requête est API ou demande du JSON
    | - Sans ça, Laravel renvoie du HTML → le frontend crash sur JSON.parse()
    */
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })

    ->create();