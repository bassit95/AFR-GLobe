<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Collection\IndexCollectionRequest;
use App\Http\Requests\V1\Collection\StoreCollectionRequest;
use App\Http\Requests\V1\Collection\UpdateCollectionRequest;
use App\Http\Resources\V1\Collection\CollectionResource;
use App\Models\Brand;
use App\Models\Collection;
use Illuminate\Http\JsonResponse;

class CollectionController extends Controller
{
    /**
     * Liste des collections publiées.
     */
   public function index(IndexCollectionRequest $request): JsonResponse
{
    $this->authorize('viewAny', Collection::class);

    $validated = $request->validated();

    $query = Collection::query()->with('brand');

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
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // 🎯 Filtres
    if (!empty($validated['brand_id'])) {
        $query->where('brand_id', $validated['brand_id']);
    }
    if (!empty($validated['year'])) {
        $query->where('year', $validated['year']);
    }
    if (!empty($validated['season'])) {
        $query->where('season', $validated['season']);
    }

    $collections = $query
        ->orderByDesc('year')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Collections récupérées avec succès.',
        'data' => CollectionResource::collection($collections->items()),
        'meta' => [
            'current_page' => $collections->currentPage(),
            'last_page' => $collections->lastPage(),
            'per_page' => $collections->perPage(),
            'total' => $collections->total(),
        ],
    ]);
}

public function indexByBrand(IndexCollectionRequest $request, Brand $brand): JsonResponse
{
    $this->authorize('viewAny', Collection::class);

    $validated = $request->validated();

    $query = $brand->collections();

    // ✅ MÊME LOGIQUE
    $isAdmin = $request->user()?->role === 'admin';
    $requestedStatus = $validated['status'] ?? null;

    if ($isAdmin && $requestedStatus) {
        if ($requestedStatus !== 'all') {
            $query->where('status', $requestedStatus);
        }
    } else {
        $query->where('status', 'published');
    }

    $collections = $query
        ->orderByDesc('year')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Collections de la marque récupérées avec succès.',
        'data' => CollectionResource::collection($collections->items()),
        'meta' => [
            'current_page' => $collections->currentPage(),
            'last_page' => $collections->lastPage(),
            'per_page' => $collections->perPage(),
            'total' => $collections->total(),
        ],
    ]);
}

    /**
     * Créer une collection.
     */
    public function store(StoreCollectionRequest $request): JsonResponse
    {
        $this->authorize('create', Collection::class);

        $collection = Collection::create(
            $request->validated()
        );

        $collection->load('brand');

        return response()->json([
            'success' => true,
            'message' => 'Collection créée avec succès.',
            'data' => new CollectionResource($collection),
        ], 201);
    }

    /**
     * Afficher une collection.
     */
    public function show(Collection $collection): JsonResponse
    {
        $this->authorize('view', $collection);

        $collection->load([
            'brand',
            'products',
            'portfolioItems',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Collection récupérée avec succès.',
            'data' => new CollectionResource($collection),
        ]);
    }

    /**
     * Modifier une collection.
     */
    public function update(
        UpdateCollectionRequest $request,
        Collection $collection
    ): JsonResponse {
        $this->authorize('update', $collection);

        $collection->update(
            $request->validated()
        );

        $collection->load([
            'brand',
            'products',
            'portfolioItems',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Collection mise à jour avec succès.',
            'data' => new CollectionResource($collection),
        ]);
    }

    /**
     * Supprimer une collection.
     */
    public function destroy(Collection $collection): JsonResponse
    {
        $this->authorize('delete', $collection);

        $collection->delete();

        return response()->json([
            'success' => true,
            'message' => 'Collection supprimée avec succès.',
            'data' => null,
        ]);
    }

    /**
     * Lister les collections d'une marque.
     *
     * GET /api/v1/brands/{brand}/collections
     */
}