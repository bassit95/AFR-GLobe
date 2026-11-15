<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


use App\Http\Controllers\Api\V1\CountryController;
use App\Http\Controllers\Api\V1\CityController;
use App\Http\Controllers\Api\V1\CreatorController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\StyleController;
use App\Http\Controllers\Api\V1\BoutiqueController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\PortfolioItemController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\ResourceController;
use App\Http\Controllers\Api\V1\SourceController;
use App\Http\Controllers\Api\V1\SearchController;

Route::prefix('v1')->group(function () {

    // =========================
    // PUBLIC READ API
    // =========================

    Route::apiResource('countries', CountryController::class)
        ->only(['index', 'show']);

    Route::apiResource('cities', CityController::class)
        ->only(['index', 'show']);

    Route::apiResource('creators', CreatorController::class)
        ->only(['index', 'show']);

    Route::apiResource('brands', BrandController::class)
        ->only(['index', 'show']);

    Route::apiResource('categories', CategoryController::class)
        ->only(['index', 'show']);

    Route::apiResource('styles', StyleController::class)
        ->only(['index', 'show']);

    Route::apiResource('boutiques', BoutiqueController::class)
        ->only(['index', 'show']);

    Route::apiResource('collections', CollectionController::class)
        ->only(['index', 'show']);

    Route::apiResource('products', ProductController::class)
        ->only(['index', 'show']);

    Route::apiResource('portfolio-items', PortfolioItemController::class)
        ->only(['index', 'show']);

    Route::apiResource('articles', ArticleController::class)
        ->only(['index', 'show']);

    Route::apiResource('resources', ResourceController::class)
        ->only(['index', 'show']);

    Route::apiResource('sources', SourceController::class)
        ->only(['index', 'show']);

    // =========================
    // RELATIONS
    // =========================

    Route::get(
        'creators/{creator}/portfolio',
        [PortfolioItemController::class, 'indexByCreator']
    );

    Route::get(
        'brands/{brand}/collections',
        [CollectionController::class, 'indexByBrand']
    );

    Route::get(
        'collections/{collection}/products',
        [ProductController::class, 'indexByCollection']
    );

    // =========================
    // SEARCH
    // =========================

    Route::get(
        'search',
        [SearchController::class, 'index']
    );


    // =========================
    // ADMIN / AUTHENTICATED
    // =========================

    Route::middleware('auth:sanctum')->group(function () {

        Route::apiResource('countries', CountryController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('cities', CityController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('creators', CreatorController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('brands', BrandController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('categories', CategoryController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('styles', StyleController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('boutiques', BoutiqueController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('collections', CollectionController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('products', ProductController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('portfolio-items', PortfolioItemController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('articles', ArticleController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('resources', ResourceController::class)
            ->only(['store', 'update', 'destroy']);

        Route::apiResource('sources', SourceController::class)
            ->only(['store', 'update', 'destroy']);
    });
});