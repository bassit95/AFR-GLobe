<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Category\IndexCategoryRequest;
use App\Http\Requests\V1\Category\StoreCategoryRequest;
use App\Http\Requests\V1\Category\UpdateCategoryRequest;
use App\Http\Resources\V1\Category\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(IndexCategoryRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Category::class);
        $validated = $request->validated();

        $query = Category::query();

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query
            ->orderBy('name')
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Catégories récupérées avec succès.',
            'data' => CategoryResource::collection(
                $categories->items()
            ),
            'meta' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ],
        ]);
    }

    public function store(
        StoreCategoryRequest $request
    ): JsonResponse {
        $this->authorize('create', Category::class);

        $category = Category::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Catégorie créée avec succès.',
            'data' => new CategoryResource($category),
        ], 201);
    }

    public function show(Category $category): JsonResponse
{
    $this->authorize('view', $category);

    $category->load([
        'creators',
        'products',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Catégorie récupérée avec succès.',
        'data' => new CategoryResource($category),
    ]);
}
    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ): JsonResponse {
        $this->authorize('update', $category);

        $category->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Catégorie mise à jour avec succès.',
            'data' => new CategoryResource($category),
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $this->authorize('delete', $category);

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès.',
            'data' => null,
        ]);
    }
}