<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Product\IndexProductRequest;
use App\Http\Requests\V1\Product\StoreProductRequest;
use App\Http\Requests\V1\Product\UpdateProductRequest;
use App\Http\Resources\V1\Product\ProductResource;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
  public function index(IndexProductRequest $request): JsonResponse
{
    $this->authorize('viewAny', Product::class);   // ✅ AJOUT authorize

    $validated = $request->validated();

    $query = Product::query()->with([
        'brand',
        'collection',
        'categories',
        'styles',
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
    foreach (['brand_id', 'collection_id', 'gender', 'availability'] as $filter) {
        if (!empty($validated[$filter])) {
            $query->where($filter, $validated[$filter]);
        }
    }

    if (!empty($validated['category_id'])) {
        $query->whereHas('categories', function ($q) use ($validated) {
            $q->where('categories.id', $validated['category_id']);
        });
    }

    if (!empty($validated['style_id'])) {
        $query->whereHas('styles', function ($q) use ($validated) {
            $q->where('styles.id', $validated['style_id']);
        });
    }

    $products = $query
        ->orderBy('name')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Produits récupérés avec succès.',
        'data' => ProductResource::collection($products->items()),
        'meta' => [
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
        ],
    ]);
}

public function indexByCollection(IndexProductRequest $request, Collection $collection): JsonResponse
{
    $this->authorize('viewAny', Product::class);   // ✅ AJOUT authorize

    $validated = $request->validated();

    $query = $collection->products()->with([
        'brand',
        'collection',
        'categories',
        'styles',
    ]);

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

    $products = $query
        ->orderBy('name')
        ->paginate($validated['per_page'] ?? 15);

    return response()->json([
        'success' => true,
        'message' => 'Produits de la collection récupérés avec succès.',
        'data' => ProductResource::collection($products->items()),
        'meta' => [
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
        ],
    ]);
}

    public function store(StoreProductRequest $request): JsonResponse
    {
        $this->authorize('create', Product::class);

        $validated = $request->validated();

        $categoryIds = $validated['category_ids'] ?? [];
        $styleIds = $validated['style_ids'] ?? [];

        unset(
            $validated['category_ids'],
            $validated['style_ids']
        );

        $product = DB::transaction(function () use (
            $validated,
            $categoryIds,
            $styleIds
        ) {
            $product = Product::create($validated);

            $product->categories()->sync($categoryIds);
            $product->styles()->sync($styleIds);

            return $product;
        });

        $product->load([
            'brand',
            'collection',
            'categories',
            'styles',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produit créé avec succès.',
            'data' => new ProductResource($product),
        ], 201);
    }

    public function show(Product $product): JsonResponse
{
    $this->authorize('view', $product);

    $product->load([
        'brand',
        'collection',
        'categories',
        'styles',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Produit récupéré avec succès.',
        'data' => new ProductResource($product),
    ]);
}

    public function update(
        UpdateProductRequest $request,
        Product $product
    ): JsonResponse {
        $this->authorize('update', $product);

        $validated = $request->validated();

        $categoryIds = $validated['category_ids'] ?? null;
        $styleIds = $validated['style_ids'] ?? null;

        unset(
            $validated['category_ids'],
            $validated['style_ids']
        );

        DB::transaction(function () use (
            $product,
            $validated,
            $categoryIds,
            $styleIds
        ) {
            $product->update($validated);

            if ($categoryIds !== null) {
                $product->categories()->sync($categoryIds);
            }

            if ($styleIds !== null) {
                $product->styles()->sync($styleIds);
            }
        });

        $product->load([
            'brand',
            'collection',
            'categories',
            'styles',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produit mis à jour avec succès.',
            'data' => new ProductResource($product),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès.',
            'data' => null,
        ]);
    }

    
}