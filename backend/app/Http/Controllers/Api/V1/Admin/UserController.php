<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\User\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::orderBy('name')->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users->items()),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    // app/Http/Controllers/Api/V1/Admin/UserController.php

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'editor', 'user'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès.',
            'data' => new UserResource($user),
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['admin', 'editor', 'user'])],
        ]);

        // Empêcher un admin de se retirer ses propres droits
        if ($request->user()->id === $user->id && $validated['role'] !== 'admin') {
            return response()->json(['message' => 'Vous ne pouvez pas changer votre propre rôle.'], 403);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Rôle mis à jour.',
            'data' => new UserResource($user),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous supprimer vous-même.'], 403);
        }

        $user->delete();
        return response()->json(['success' => true, 'message' => 'Utilisateur supprimé.']);
    }
}