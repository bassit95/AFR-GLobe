<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Traite la requête entrante.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifie si l'utilisateur est connecté et possède le rôle 'admin'
        if (! $request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès interdit. Privilèges d\'administrateur requis.'
            ], Response::HTTP_FORBIDDEN); // Code 403
        }

        return $next($request);
    }
}