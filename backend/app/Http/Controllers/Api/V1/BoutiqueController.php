<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Boutique\IndexBoutiqueRequest;
use App\Http\Requests\V1\Boutique\StoreBoutiqueRequest;
use App\Http\Requests\V1\Boutique\UpdateBoutiqueRequest;
use App\Http\Resources\V1\Boutique\BoutiqueResource;
use App\Models\Boutique;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class BoutiqueController extends Controller
{
public function index(IndexBoutiqueRequest $request): JsonResponse
{
    $this->authorize('viewAny', Boutique::class);   // ✅ AJOUT authorize

    $validated = $request->validated();

    $query = Boutique::query()->with([
        'brand',
        'country',
        'city',
    ]);

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
                ->orWhere('address', 'like', "%{$search}%");
        });
    }

    // 🎯 Filtres
    foreach (['brand_id', 'country_id', 'city_id', 'type'] as $filter) {
        if (!empty($validated[$filter])) {
            $query->where($filter, $validated[$filter]);
        }
    }

    $boutiques = $query
        ->orderBy('name')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Boutiques récupérées avec succès.',
        'data' => BoutiqueResource::collection($boutiques->items()),
        'meta' => [
            'current_page' => $boutiques->currentPage(),
            'last_page' => $boutiques->lastPage(),
            'per_page' => $boutiques->perPage(),
            'total' => $boutiques->total(),
        ],
    ]);
}

public function indexByBrand(IndexBoutiqueRequest $request, Brand $brand): JsonResponse
{
    $this->authorize('viewAny', Boutique::class);

    $validated = $request->validated();

    $query = $brand->boutiques()->with(['brand', 'country', 'city']);

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

    $boutiques = $query
        ->orderBy('name')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Boutiques de la marque récupérées avec succès.',
        'data' => BoutiqueResource::collection($boutiques->items()),
        'meta' => [
            'current_page' => $boutiques->currentPage(),
            'last_page'    => $boutiques->lastPage(),
            'per_page'     => $boutiques->perPage(),
            'total'        => $boutiques->total(),
        ],
    ]);
}

    public function store(StoreBoutiqueRequest $request): JsonResponse
    {
        $this->authorize('create', Boutique::class);

        $validated = $request->validated();

        $sourceIds = $validated['source_ids'] ?? [];

        unset($validated['source_ids']);

        $boutique = DB::transaction(function () use (
            $validated,
            $sourceIds
        ) {
            $boutique = Boutique::create($validated);

            if ($sourceIds) {
                $boutique->sources()->sync($sourceIds);
            }

            return $boutique;
        });

        $boutique->load([
            'brand',
            'country',
            'city',
            'sources',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Boutique créée avec succès.',
            'data' => new BoutiqueResource($boutique),
        ], 201);
    }

    public function show(Boutique $boutique): JsonResponse
    {
        $boutique->load([
            'brand',
            'country',
            'city',
            'sources',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Boutique récupérée avec succès.',
            'data' => new BoutiqueResource($boutique),
        ]);
    }

    public function update(
        UpdateBoutiqueRequest $request,
        Boutique $boutique
    ): JsonResponse {
        $this->authorize('update', $boutique);

        $validated = $request->validated();

        $sourceIds = $validated['source_ids'] ?? null;

        unset($validated['source_ids']);

        DB::transaction(function () use (
            $boutique,
            $validated,
            $sourceIds
        ) {
            $boutique->update($validated);

            if ($sourceIds !== null) {
                $boutique->sources()->sync($sourceIds);
            }
        });

        $boutique->load([
            'brand',
            'country',
            'city',
            'sources',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Boutique mise à jour avec succès.',
            'data' => new BoutiqueResource($boutique),
        ]);
    }

    public function destroy(Boutique $boutique): JsonResponse
    {
        $this->authorize('delete', $boutique);

        $boutique->delete();

        return response()->json([
            'success' => true,
            'message' => 'Boutique supprimée avec succès.',
            'data' => null,
        ]);
    }

     
}