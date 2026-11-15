<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Http\Resources\V1\User\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->validated('name'),
            'email'    => $request->validated('email'),
            'password' => Hash::make($request->validated('password')),
            'role'     => 'user',
        ]);

        Auth::login($user);
        $request->session()->regenerate();   // ✅ CORRIGÉ (Bug #2 : session fixation)

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie.',
            'user' => new UserResource($user),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Identifiants incorrects.',
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'user' => new UserResource(Auth::user()),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Profil récupéré avec succès.',
            'user' => new UserResource($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // ✅ CORRIGÉ (Bug #3) : révoque le token Sanctum s'il existe
        $request->user()?->currentAccessToken()?->delete();

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie.',
        ]);
    }
}