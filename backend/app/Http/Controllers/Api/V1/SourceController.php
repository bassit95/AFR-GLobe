<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Source\IndexSourceRequest;
use App\Http\Requests\V1\Source\StoreSourceRequest;
use App\Http\Requests\V1\Source\UpdateSourceRequest;
use App\Http\Resources\V1\Source\SourceResource;
use App\Models\Source;
use Illuminate\Http\JsonResponse;

class SourceController extends Controller
{
    /**
     * Liste des sources.
     */
    public function index(IndexSourceRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Source::class);

        $validated = $request->validated();

        $query = Source::query();

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('publisher', 'like', "%{$search}%");
            });
        }

        if (!empty($validated['source_type'])) {
            $query->where(
                'source_type',
                $validated['source_type']
            );
        }

        if (!empty($validated['publisher'])) {
            $query->where(
                'publisher',
                'like',
                '%' . $validated['publisher'] . '%'
            );
        }

        $sources = $query
            ->orderBy('title')
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Sources récupérées avec succès.',
            'data' => SourceResource::collection(
                $sources->items()
            ),
            'meta' => [
                'current_page' => $sources->currentPage(),
                'last_page' => $sources->lastPage(),
                'per_page' => $sources->perPage(),
                'total' => $sources->total(),
            ],
        ]);
    }

    /**
     * Créer une source.
     */
    public function store(StoreSourceRequest $request): JsonResponse
    {
        $this->authorize('create', Source::class);

        $source = Source::create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Source créée avec succès.',
            'data' => new SourceResource($source),
        ], 201);
    }

    /**
     * Afficher une source.
     */
    public function show(Source $source): JsonResponse
    {
        $this->authorize('view', $source);

        return response()->json([
            'success' => true,
            'message' => 'Source récupérée avec succès.',
            'data' => new SourceResource($source),
        ]);
    }

    /**
     * Modifier une source.
     */
    public function update(
        UpdateSourceRequest $request,
        Source $source
    ): JsonResponse {
        $this->authorize('update', $source);

        $source->update(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Source mise à jour avec succès.',
            'data' => new SourceResource($source),
        ]);
    }

    /**
     * Supprimer une source.
     */
    public function destroy(Source $source): JsonResponse
    {
        $this->authorize('delete', $source);

        $source->delete();

        return response()->json([
            'success' => true,
            'message' => 'Source supprimée avec succès.',
            'data' => null,
        ]);
    }
}