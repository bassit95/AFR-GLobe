<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Style\IndexStyleRequest;
use App\Http\Requests\V1\Style\StoreStyleRequest;
use App\Http\Requests\V1\Style\UpdateStyleRequest;
use App\Http\Resources\V1\Style\StyleResource;
use App\Models\Style;
use Illuminate\Http\JsonResponse;

class StyleController extends Controller
{
    public function index(IndexStyleRequest $request): JsonResponse
    {  
        $this->authorize('viewAny', Style::class);   // ✅ AJOUTÉ

        $validated = $request->validated();

        $query = Style::query()
            ->with('parent');

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (array_key_exists('parent_id', $validated)) {
            $query->where(
                'parent_id',
                $validated['parent_id']
            );
        }

        $styles = $query
            ->orderBy('name')
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Styles récupérés avec succès.',
            'data' => StyleResource::collection(
                $styles->items()
            ),
            'meta' => [
                'current_page' => $styles->currentPage(),
                'last_page' => $styles->lastPage(),
                'per_page' => $styles->perPage(),
                'total' => $styles->total(),
            ],
        ]);
    }

    public function store(
        StoreStyleRequest $request
    ): JsonResponse {
        $this->authorize('create', Style::class);

        $style = Style::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Style créé avec succès.',
            'data' => new StyleResource($style),
        ], 201);
    }

    public function show(Style $style): JsonResponse
    {

    $this->authorize('view', $style);   // ✅ AJOUTÉ
    
        $style->load([
            'parent',
            'children',
            'creators',
            'products',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Style récupéré avec succès.',
            'data' => new StyleResource($style),
        ]);
    }

    public function update(
        UpdateStyleRequest $request,
        Style $style
    ): JsonResponse {
        $this->authorize('update', $style);

        $style->update(
            $request->validated()
        );

        $style->load([
            'parent',
            'children',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Style mis à jour avec succès.',
            'data' => new StyleResource($style),
        ]);
    }

    public function destroy(Style $style): JsonResponse
    {
        $this->authorize('delete', $style);

        $style->delete();

        return response()->json([
            'success' => true,
            'message' => 'Style supprimé avec succès.',
            'data' => null,
        ]);
    }
}