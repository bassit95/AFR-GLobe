<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Creator\IndexCreatorRequest;
use App\Http\Requests\V1\Creator\StoreCreatorRequest;
use App\Http\Requests\V1\Creator\UpdateCreatorRequest;
use App\Http\Resources\V1\Creator\CreatorResource;
use App\Models\Creator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CreatorController extends Controller
{
    /**
     * =========================================================
     * LISTE DES CRÉATEURS
     * GET /api/v1/creators
     * =========================================================
     */
   public function index(IndexCreatorRequest $request): JsonResponse
{
    $this->authorize('viewAny', Creator::class);

    $filters = $request->validated();

    $query = Creator::query()->with([
        'originCountry',
        'residenceCountry',
        'residenceCity',
        'categories',
        'styles',
        'brands',
    ]);

    // ✅ CORRIGÉ — statut selon rôle
    $isAdmin = $request->user()?->role === 'admin';
    $requestedStatus = $filters['status'] ?? null;

    if ($isAdmin && $requestedStatus) {
        if ($requestedStatus !== 'all') {
            $query->where('status', $requestedStatus);
        }
    } else {
        $query->where('status', 'published');
    }

   // Dans CreatorController::index()
if (!empty($filters['search'])) {
    $search = $filters['search'];
    // MySQL/MariaDB — utiliser la collation insensible aux accents
    $query->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($search) . '%']);
}

    // 🎯 Filtres
    if (!empty($filters['country_origin'])) {
        $query->where('country_of_origin_id', $filters['country_origin']);
    }
    if (!empty($filters['country_residence'])) {
        $query->where('country_of_residence_id', $filters['country_residence']);
    }
    if (!empty($filters['city'])) {
        $query->where('city_of_residence_id', $filters['city']);
    }
    if (!empty($filters['gender'])) {
        $query->where('gender', $filters['gender']);
    }
    // ✅ APRÈS — Support multi-select (category_ids) + rétrocompat (category)
$categoryIds = [];

if (!empty($filters['category_ids']) && is_array($filters['category_ids'])) {
    $categoryIds = $filters['category_ids'];
} elseif (!empty($filters['category'])) {
    $categoryIds = [$filters['category']];
}

if (!empty($categoryIds)) {
    $query->whereHas('categories', function ($q) use ($categoryIds) {
        $q->whereIn('categories.id', $categoryIds);
    });
}
    if (!empty($filters['style'])) {
        $query->whereHas('styles', function ($q) use ($filters) {
            $q->where('styles.id', $filters['style']);
        });
    }
    if (!empty($filters['letter'])) {
        $query->where('name', 'like', $filters['letter'] . '%');
    }

    $query->orderBy('name', 'asc');

    $creators = $query->paginate($filters['per_page'] ?? 20);

    return response()->json([
        'success' => true,
        'message' => 'Créateurs récupérés avec succès.',
        'data' => CreatorResource::collection($creators->items()),
        'meta' => [
            'current_page' => $creators->currentPage(),
            'last_page' => $creators->lastPage(),
            'per_page' => $creators->perPage(),
            'total' => $creators->total(),
        ],
    ], 200);
}

    /**
     * =========================================================
     * CRÉER UN CRÉATEUR
     * POST /api/v1/creators
     * =========================================================
     */
    public function store(
        StoreCreatorRequest $request
    ): JsonResponse {
        $this->authorize('create', Creator::class);

        $data = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | RÉCUPÉRATION DES RELATIONS
        |--------------------------------------------------------------------------
        */

        $categoryIds = $data['category_ids'] ?? [];
        $styleIds = $data['style_ids'] ?? [];
        $brandIds = $data['brand_ids'] ?? [];
        $sourceIds = $data['source_ids'] ?? [];

        unset(
            $data['category_ids'],
            $data['style_ids'],
            $data['brand_ids'],
            $data['source_ids']
        );

        /*
        |--------------------------------------------------------------------------
        | CRÉATION DU CRÉATEUR + RELATIONS (TRANSACTION)
        |--------------------------------------------------------------------------
        */

        $creator = DB::transaction(function () use (
            $data,
            $categoryIds,
            $styleIds,
            $brandIds,
            $sourceIds
        ) {
            $creator = Creator::create($data);

            if (!empty($categoryIds)) {
                $creator->categories()->sync($categoryIds);
            }

            if (!empty($styleIds)) {
                $creator->styles()->sync($styleIds);
            }

            if (!empty($brandIds)) {
                $creator->brands()->sync($brandIds);
            }

            if (!empty($sourceIds)) {
                $creator->sources()->sync($sourceIds);
            }

            return $creator;
        });

        /*
        |--------------------------------------------------------------------------
        | RECHARGEMENT DES RELATIONS
        |--------------------------------------------------------------------------
        */

        $creator->load([
            'originCountry',
            'residenceCountry',
            'residenceCity',
            'categories',
            'styles',
            'brands',
            'sources',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Créateur créé avec succès.',
            'data' => new CreatorResource($creator),
        ], 201);
    }

    /**
     * =========================================================
     * AFFICHER UN CRÉATEUR
     * GET /api/v1/creators/{creator}
     * =========================================================
     */
    public function show(Creator $creator): JsonResponse
    {
        $this->authorize('view', $creator);

        /*
        |--------------------------------------------------------------------------
        | CHARGEMENT DES RELATIONS
        |--------------------------------------------------------------------------
        */

        $creator->load([
            'originCountry',
            'residenceCountry',
            'residenceCity',
            'categories',
            'styles',
            'brands',
            'portfolioItems.collection', // 🎯 AJOUT ICI : on charge la collection de chaque image
            'sources',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Créateur récupéré avec succès.',
            'data' => new CreatorResource($creator),
        ], 200);
    }

    /**
     * =========================================================
     * MODIFIER UN CRÉATEUR
     * PUT/PATCH /api/v1/creators/{creator}
     * =========================================================
     */
    public function update(
        UpdateCreatorRequest $request,
        Creator $creator
    ): JsonResponse {
        $this->authorize('update', $creator);

        $data = $request->validated();

        /*
        |--------------------------------------------------------------------------
        | RÉCUPÉRATION DES RELATIONS
        |--------------------------------------------------------------------------
        */

        $categoryIds = $data['category_ids'] ?? null;
        $styleIds = $data['style_ids'] ?? null;
        $brandIds = $data['brand_ids'] ?? null;
        $sourceIds = $data['source_ids'] ?? null;

        unset(
            $data['category_ids'],
            $data['style_ids'],
            $data['brand_ids'],
            $data['source_ids']
        );

        /*
        |--------------------------------------------------------------------------
        | MODIFICATION + RELATIONS (TRANSACTION)
        |--------------------------------------------------------------------------
        */

        DB::transaction(function () use (
            $creator,
            $data,
            $categoryIds,
            $styleIds,
            $brandIds,
            $sourceIds
        ) {
            $creator->update($data);

            if ($categoryIds !== null) {
                $creator->categories()->sync($categoryIds);
            }

            if ($styleIds !== null) {
                $creator->styles()->sync($styleIds);
            }

            if ($brandIds !== null) {
                $creator->brands()->sync($brandIds);
            }

            if ($sourceIds !== null) {
                $creator->sources()->sync($sourceIds);
            }
        });

        /*
        |--------------------------------------------------------------------------
        | RECHARGEMENT
        |--------------------------------------------------------------------------
        */

        $creator->load([
            'originCountry',
            'residenceCountry',
            'residenceCity',
            'categories',
            'styles',
            'brands',
            'portfolioItems',
            'sources',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Créateur modifié avec succès.',
            'data' => new CreatorResource($creator),
        ], 200);
    }

    /**
     * =========================================================
     * SUPPRIMER UN CRÉATEUR
     * DELETE /api/v1/creators/{creator}
     * =========================================================
     */
    public function destroy(Creator $creator): JsonResponse
    {
        $this->authorize('delete', $creator);

        $creator->delete();

        return response()->json([
            'success' => true,
            'message' => 'Créateur supprimé avec succès.',
        ], 200);
    }
}