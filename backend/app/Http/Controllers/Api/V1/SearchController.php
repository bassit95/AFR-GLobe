<?php
// app/Http/Controllers/Api/V1/SearchController.php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Search\SearchRequest;
use App\Http\Resources\V1\Brand\BrandResource;
use App\Http\Resources\V1\Creator\CreatorResource;
use App\Http\Resources\V1\Product\ProductResource;
use App\Models\Brand;
use App\Models\Collection;
use App\Models\Creator;
use App\Models\Article;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    private const PER_CATEGORY = 5; // Nombre max par catégorie

    public function index(SearchRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $search = $validated['q'];

        // 1. Créateurs (Nom ou Bio)
        $creators = Creator::query()
            ->where('status', 'published')
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_bio', 'like', "%{$search}%");
            })
            ->with(['originCountry'])
            ->limit(self::PER_CATEGORY)
            ->get();

        // 2. Marques (Nom ou Description)
        $brands = Brand::query()
            ->where('status', 'published')
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            })
            ->limit(self::PER_CATEGORY)
            ->get();

        // 3. Articles (Titre ou Excerpt)
        $articles = Article::query()
            ->where('status', 'published')
            ->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            })
            ->limit(self::PER_CATEGORY)
            ->get();

        // 4. Collections (Nom ou Description)
        $collections = Collection::query()
            ->where('status', 'published')
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            })
            ->with(['brand']) // Pour afficher le nom de la marque
            ->limit(self::PER_CATEGORY)
            ->get();

        // 5. Produits (Nom)
        $products = Product::query()
            ->where('status', 'published')
            ->where('name', 'like', "%{$search}%")
            ->limit(self::PER_CATEGORY)
            ->get();
            
  return response()->json([
    'success' => true,
    'message' => 'Recherche effectuée avec succès.',   // ✅ AJOUTÉ
    'data' => [
        'creators'    => CreatorResource::collection($creators),
        'brands'      => BrandResource::collection($brands),
        'articles'    => \App\Http\Resources\V1\Article\ArticleResource::collection($articles),
        'collections' => \App\Http\Resources\V1\Collection\CollectionResource::collection($collections),
        'products'    => ProductResource::collection($products),
    ],
    'meta' => [                                        // ✅ AJOUTÉ
        'query' => $search,
        'per_category' => self::PER_CATEGORY,
    ],
  ]);

    }
}