<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Resource\IndexResourceRequest;
use App\Http\Requests\V1\Resource\StoreResourceRequest;
use App\Http\Requests\V1\Resource\UpdateResourceRequest;
use App\Http\Resources\V1\Resource\ResourceResource;
use App\Models\Resource as ResourceModel;
use Illuminate\Http\JsonResponse;

class ResourceController extends Controller
{
    /**
     * Liste des ressources publiées.
     */
public function index(IndexResourceRequest $request): JsonResponse
{
    $this->authorize('viewAny', ResourceModel::class);

    $validated = $request->validated();

    $query = ResourceModel::query();

    // ✅ CORRIGÉ — statut selon rôle
    $isAdmin = $request->user()?->role === 'admin';
    $requestedStatus = $validated['status'] ?? null;

    if ($isAdmin && $requestedStatus) {
        if ($requestedStatus !== 'all') {
            $query->where('status', $requestedStatus);
        }
    } else {
        $query->where('status', 'published');
    }

    // 🔍 Search
    if (!empty($validated['search'])) {
        $search = $validated['search'];
        $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // 🎯 Filtre
    if (!empty($validated['resource_type'])) {
        $query->where('resource_type', $validated['resource_type']);
    }

    $resources = $query
        ->orderBy('title')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Resources récupérées avec succès.',
        'data' => ResourceResource::collection($resources->items()),
        'meta' => [
            'current_page' => $resources->currentPage(),
            'last_page' => $resources->lastPage(),
            'per_page' => $resources->perPage(),
            'total' => $resources->total(),
        ],
    ]);
}

    /**
     * Créer une ressource.
     */
    public function store(StoreResourceRequest $request): JsonResponse
    {
        $this->authorize('create', ResourceModel::class);

        $resource = ResourceModel::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Resource créée avec succès.',
            'data' => new ResourceResource($resource),
        ], 201);
    }

    /**
     * Afficher une ressource.
     */
    public function show(ResourceModel $resource): JsonResponse
    {
        $this->authorize('view', $resource);

        return response()->json([
            'success' => true,
            'message' => 'Resource récupérée avec succès.',
            'data' => new ResourceResource($resource),
        ]);
    }

    /**
     * Modifier une ressource.
     */
    public function update(
        UpdateResourceRequest $request,
        ResourceModel $resource
    ): JsonResponse {
        $this->authorize('update', $resource);

        $resource->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Resource mise à jour avec succès.',
            'data' => new ResourceResource($resource),
        ]);
    }

    /**
     * Supprimer une ressource.
     */
    public function destroy(ResourceModel $resource): JsonResponse
    {
        $this->authorize('delete', $resource);

        $resource->delete();

        return response()->json([
            'success' => true,
            'message' => 'Resource supprimée avec succès.',
            'data' => null,
        ]);
    }
}