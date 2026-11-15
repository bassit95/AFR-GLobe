<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Brand\IndexBrandRequest;
use App\Http\Requests\V1\Brand\StoreBrandRequest;
use App\Http\Requests\V1\Brand\UpdateBrandRequest;
use App\Http\Resources\V1\Brand\BrandResource;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class BrandController extends Controller
{
    /**
     * Display a listing of published brands.
     */
    public function index(IndexBrandRequest $request): JsonResponse
{
    $this->authorize('viewAny', Brand::class);

    $validated = $request->validated();

    $query = Brand::query()->with([
        'country',
        'city',
        'creators',
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
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // 🎯 Filtres
    if (!empty($validated['country_id'])) {
        $query->where('country_id', $validated['country_id']);
    }

    if (!empty($validated['city_id'])) {
        $query->where('city_id', $validated['city_id']);
    }

    if (!empty($validated['creator_id'])) {
        $query->whereHas('creators', function ($q) use ($validated) {
            $q->where('creators.id', $validated['creator_id']);
        });
    }

    $brands = $query
        ->orderBy('name')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Brands récupérés avec succès.',
        'data' => BrandResource::collection($brands->items()),
        'meta' => [
            'current_page' => $brands->currentPage(),
            'last_page' => $brands->lastPage(),
            'per_page' => $brands->perPage(),
            'total' => $brands->total(),
        ],
    ]);
}

    /**
     * Store a newly created brand.
     */
    public function store(StoreBrandRequest $request): JsonResponse
    {
    $this->authorize('create', Brand::class);

    $validated = $request->validated();

    $creators = $validated['creators'] ?? [];
    $sourceIds = $validated['source_ids'] ?? [];

    unset(
        $validated['creators'],
        $validated['source_ids']
    );

    $creatorData = [];

    foreach ($creators as $creator) {
        $creatorData[$creator['id']] = [
            'role' => $creator['role'] ?? null,
        ];
    }

    $brand = DB::transaction(function () use (
        $validated,
        $creatorData,
        $sourceIds
    ) {
        $brand = Brand::create($validated);

        if (!empty($creatorData)) {
            $brand->creators()->sync($creatorData);
        }

        if (!empty($sourceIds)) {
            $brand->sources()->sync($sourceIds);
        }

        return $brand;
    });

    $brand->load([
        'country',
        'city',
        'creators',
        'sources',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Brand créé avec succès.',
        'data' => new BrandResource($brand),
    ], 201);
    }

    /**
     * Display the specified brand.
     */
    public function show(Brand $brand): JsonResponse
    {

    $this->authorize('view', $brand);

        $brand->load([
            'country',
            'city',
            'creators',
            'boutiques.city',
            'boutiques.country',
            'collections',
            'products',
            'sources',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Brand récupéré avec succès.',
            'data' => new BrandResource($brand),
        ]);
    }

    /**
     * Update the specified brand.
     */
   public function update(
    UpdateBrandRequest $request,
    Brand $brand
): JsonResponse {
    $this->authorize('update', $brand);

    $validated = $request->validated();

    $creators = $validated['creators'] ?? null;
    $sourceIds = $validated['source_ids'] ?? null;

    unset(
        $validated['creators'],
        $validated['source_ids']
    );

    $creatorData = null;

    if ($creators !== null) {
        $creatorData = [];

        foreach ($creators as $creator) {
            $creatorData[$creator['id']] = [
                'role' => $creator['role'] ?? null,
            ];
        }
    }

    DB::transaction(function () use (
        $brand,
        $validated,
        $creatorData,
        $sourceIds
    ) {
        $brand->update($validated);

        if ($creatorData !== null) {
            $brand->creators()->sync($creatorData);
        }

        if ($sourceIds !== null) {
            $brand->sources()->sync($sourceIds);
        }
    });

    $brand->load([
        'country',
        'city',
        'creators',
        'boutiques.city',
        'boutiques.country',
        'collections',
        'products',
        'sources',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Brand mis à jour avec succès.',
        'data' => new BrandResource($brand),
    ]);
}

    /**
     * Remove the specified brand.
     */
    public function destroy(Brand $brand): JsonResponse
    {
        $this->authorize('delete', $brand);

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Brand supprimé avec succès.',
            'data' => null,
        ]);
    }

    /**
     * Display collections belonging to a brand.
     */
       /**
     * Afficher les collections d'une marque.
     *
     * (Méthode conservée pour usage interne — la route publique
     *  passe par CollectionController::indexByBrand.)
     */
    
}