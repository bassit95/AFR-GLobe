<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Rate limiter pour /login (5 tentatives par minute par IP)
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // 2. Désactive le wrapping automatique des JsonResource
        //    → CreatorResource::collection() retourne [{...}]
        //    au lieu de { data: [{...}] }
        JsonResource::withoutWrapping();

        RateLimiter::for('contact', function ($request) {
        return Limit::perMinute(3)->by($request->ip());
    });

        RateLimiter::for('newsletter', function ($request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}