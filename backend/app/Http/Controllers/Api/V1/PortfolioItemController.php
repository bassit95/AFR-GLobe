<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\PortfolioItem\IndexPortfolioItemRequest;
use App\Http\Requests\V1\PortfolioItem\StorePortfolioItemRequest;
use App\Http\Requests\V1\PortfolioItem\UpdatePortfolioItemRequest;
use App\Http\Resources\V1\PortfolioItem\PortfolioItemResource;
use App\Models\Creator;
use App\Models\PortfolioItem;
use Illuminate\Http\JsonResponse;

class PortfolioItemController extends Controller
{
    /**
     * Liste des portfolio items publiés.
     */
   public function index(IndexPortfolioItemRequest $request): JsonResponse
{
    $this->authorize('viewAny', PortfolioItem::class);

    $validated = $request->validated();

    $query = PortfolioItem::query()->with(['creator', 'collection']);

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

    // 🎯 Filtres
    foreach (['creator_id', 'collection_id', 'year'] as $filter) {
        if (!empty($validated[$filter])) {
            $query->where($filter, $validated[$filter]);
        }
    }

    $items = $query
        ->orderBy('display_order')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Portfolio récupéré avec succès.',
        'data' => PortfolioItemResource::collection($items->items()),
        'meta' => [
            'current_page' => $items->currentPage(),
            'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(),
            'total' => $items->total(),
        ],
    ]);
}

public function indexByCreator(IndexPortfolioItemRequest $request, Creator $creator): JsonResponse
{
    $this->authorize('viewAny', PortfolioItem::class);

    $validated = $request->validated();

    $query = $creator->portfolioItems()->with(['creator', 'collection']);

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

    $items = $query
        ->orderBy('display_order')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Portfolio du créateur récupéré avec succès.',
        'data' => PortfolioItemResource::collection($items->items()),
        'meta' => [
            'current_page' => $items->currentPage(),
            'last_page' => $items->lastPage(),
            'per_page' => $items->perPage(),
            'total' => $items->total(),
        ],
    ]);
}
    /**
     * Créer un portfolio item.
     */
    public function store(
        StorePortfolioItemRequest $request
    ): JsonResponse {
        $this->authorize('create', PortfolioItem::class);

        $item = PortfolioItem::create(
            $request->validated()
        );

        $item->load([
            'creator',
            'collection',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio item créé avec succès.',
            'data' => new PortfolioItemResource($item),
        ], 201);
    }

    /**
     * Afficher un portfolio item.
     */
    public function show(PortfolioItem $portfolioItem): JsonResponse
    {
        $this->authorize('view', $portfolioItem);

        $portfolioItem->load([
            'creator',
            'collection',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio item récupéré avec succès.',
            'data' => new PortfolioItemResource($portfolioItem),
        ]);
    }

    /**
     * Modifier un portfolio item.
     */
    public function update(
        UpdatePortfolioItemRequest $request,
        PortfolioItem $portfolioItem
    ): JsonResponse {
        $this->authorize('update', $portfolioItem);

        $portfolioItem->update(
            $request->validated()
        );

        $portfolioItem->load([
            'creator',
            'collection',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio item mis à jour avec succès.',
            'data' => new PortfolioItemResource($portfolioItem),
        ]);
    }

    /**
     * Supprimer un portfolio item.
     */
    public function destroy(
        PortfolioItem $portfolioItem
    ): JsonResponse {
        $this->authorize('delete', $portfolioItem);

        $portfolioItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Portfolio item supprimé avec succès.',
            'data' => null,
        ]);
    }

    /**
     * Portfolio d'un créateur.
     *
     * GET /api/v1/creators/{creator}/portfolio
     */
   
}