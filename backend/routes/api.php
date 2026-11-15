<?php

use Illuminate\Support\Facades\Route;

// 🎯 Import des contrôleurs publics
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\BoutiqueController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CityController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\CountryController;
use App\Http\Controllers\Api\V1\CreatorController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\PortfolioItemController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\ResourceController;
use App\Http\Controllers\Api\V1\SourceController;
use App\Http\Controllers\Api\V1\StyleController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\ContactController;

// 🎯 Import des contrôleurs Admin
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use App\Http\Controllers\Api\V1\UploadController;

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | 1. ROUTES PUBLIQUES
    |--------------------------------------------------------------------------
    */
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact');        // ✅ AJOUTÉ

    Route::post('/newsletter', [NewsletterController::class, 'store'])
    ->middleware('throttle:newsletter');     // ✅ AJOUTÉ

    // Lecture publique
    Route::apiResource('countries', CountryController::class)->only(['index', 'show']);
    Route::apiResource('cities', CityController::class)->only(['index', 'show']);
    Route::apiResource('creators', CreatorController::class)->only(['index', 'show']);
    Route::apiResource('brands', BrandController::class)->only(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
    Route::apiResource('styles', StyleController::class)->only(['index', 'show']);
    Route::apiResource('boutiques', BoutiqueController::class)->only(['index', 'show']);
    Route::apiResource('collections', CollectionController::class)->only(['index', 'show']);
    Route::apiResource('products', ProductController::class)->only(['index', 'show']);
    Route::apiResource('portfolio-items', PortfolioItemController::class)->only(['index', 'show']);
    Route::apiResource('resources', ResourceController::class)->only(['index', 'show']);
    Route::apiResource('sources', SourceController::class)->only(['index', 'show']);

    Route::get('articles', [ArticleController::class, 'index']);
    Route::get('articles/{article:slug}', [ArticleController::class, 'show']);
    
    Route::get('creators/{creator}/portfolio', [PortfolioItemController::class, 'indexByCreator']);
    Route::get('brands/{brand}/collections', [CollectionController::class, 'indexByBrand']);
    Route::get('brands/{brand}/boutiques', [BoutiqueController::class, 'indexByBrand']);
    Route::get('collections/{collection}/products', [ProductController::class, 'indexByCollection']);
    Route::get('search', [SearchController::class, 'index']);


    /*
    |--------------------------------------------------------------------------
    | 2. ROUTES PROTÉGÉES (Auth Sanctum)
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth:sanctum'])->group(function () {
        
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        /*
        |--------------------------------------------------------------------------
        | 3. ZONE ADMINISTRATEUR
        |--------------------------------------------------------------------------
        */
        Route::middleware(['admin', 'abilities:*'])->group(function () {
            
            // --- DASHBOARD & UPLOAD ---
            Route::get('/admin/stats', [DashboardController::class, 'stats']);
            Route::post('/admin/upload', [UploadController::class, 'store']); // 🎯 C'est bien /admin/upload ici

            // --- UTILISATEURS ---
            Route::apiResource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);

            // --- CRUD POUR TOUTES LES ENTITÉS ---
            Route::apiResource('countries', CountryController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('cities', CityController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('creators', CreatorController::class)->only(['store', 'update', 'destroy']); // 🎯 LIGNE AJOUTÉE
            Route::apiResource('brands', BrandController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('styles', StyleController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('boutiques', BoutiqueController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('collections', CollectionController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('products', ProductController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('portfolio-items', PortfolioItemController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('articles', ArticleController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('resources', ResourceController::class)->only(['store', 'update', 'destroy']);
            Route::apiResource('sources', SourceController::class)->only(['store', 'update', 'destroy']);
        });

    });
});