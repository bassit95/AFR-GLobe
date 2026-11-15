<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\City\IndexCityRequest;
use App\Http\Requests\V1\City\StoreCityRequest;
use App\Http\Requests\V1\City\UpdateCityRequest;
use App\Http\Resources\V1\City\CityResource;
use App\Models\City;
use Illuminate\Http\JsonResponse;

class CityController extends Controller
{
    /**
     * Afficher la liste des villes.
     */
    public function index(IndexCityRequest $request): JsonResponse
    {
        $this->authorize('viewAny', City::class);

        $filters = $request->validated();

        $query = City::query()->with('country');

        if (!empty($filters['search'])) {
            $query->where(
                'name',
                'like',
                '%' . $filters['search'] . '%'
            );
        }

        if (!empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        $perPage = $filters['per_page'] ?? 15;

        $cities = $query
            ->orderBy('name')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Liste des villes récupérée avec succès.',
            'data' => CityResource::collection(
                $cities->items()
            ),
            'meta' => [
                'current_page' => $cities->currentPage(),
                'last_page'    => $cities->lastPage(),
                'per_page'     => $cities->perPage(),
                'total'        => $cities->total(),
            ],
        ]);
    }

    /**
     * Enregistrer une nouvelle ville.
     */
    public function store(StoreCityRequest $request): JsonResponse
    {
        $this->authorize('create', City::class);

        $city = City::create($request->validated());

        $city->load('country');

        return response()->json([
            'success' => true,
            'message' => 'Ville créée avec succès.',
            'data' => new CityResource($city),
        ], 201);
    }

    /**
     * Afficher une ville précise.
     */
    public function show(City $city): JsonResponse
    {
        $this->authorize('view', $city);

        $city->load('country');

        return response()->json([
            'success' => true,
            'message' => 'Ville récupérée avec succès.',
            'data' => new CityResource($city),
        ]);
    }

    /**
     * Modifier une ville.
     */
    public function update(
        UpdateCityRequest $request,
        City $city
    ): JsonResponse {
        $this->authorize('update', $city);

        $city->update($request->validated());

        $city->load('country');

        return response()->json([
            'success' => true,
            'message' => 'Ville mise à jour avec succès.',
            'data' => new CityResource($city),
        ]);
    }

    /**
     * Supprimer une ville logiquement.
     */
    public function destroy(City $city): JsonResponse
    {
        $this->authorize('delete', $city);

        $city->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ville supprimée avec succès.',
            'data' => null,
        ]);
    }
}