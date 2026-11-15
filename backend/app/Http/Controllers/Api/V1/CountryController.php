<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Country\IndexCountryRequest;
use App\Http\Requests\V1\Country\StoreCountryRequest;
use App\Http\Requests\V1\Country\UpdateCountryRequest;
use App\Http\Resources\V1\Country\CountryResource;
use App\Models\Country;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    /**
     * Afficher la liste des pays.
     */
    public function index(IndexCountryRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Country::class);

        $filters = $request->validated();

        $query = Country::query()
            ->when(
                !empty($filters['search']),
                fn ($query) => $query->where(
                    'name',
                    'like',
                    '%' . $filters['search'] . '%'
                )
            )
            ->when(
                !empty($filters['code']),
                fn ($query) => $query->where(
                    'code',
                    $filters['code']
                )
            )
            ->when(
                !empty($filters['continent']),
                fn ($query) => $query->where(
                    'continent',
                    $filters['continent']
                )
            );

        $perPage = $filters['per_page'] ?? 15;

        $countries = $query
            ->orderBy('name')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Liste des pays récupérée avec succès.',
            'data' => CountryResource::collection(
                $countries->items()
            ),
            'meta' => [
                'current_page' => $countries->currentPage(),
                'last_page'    => $countries->lastPage(),
                'per_page'     => $countries->perPage(),
                'total'        => $countries->total(),
            ],
        ]);
    }

    /**
     * Enregistrer un nouveau pays.
     */
    public function store(StoreCountryRequest $request): JsonResponse
    {
        $this->authorize('create', Country::class);

        $country = Country::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pays créé avec succès.',
            'data' => new CountryResource($country),
        ], 201);
    }

    /**
     * Afficher un pays précis.
     */
    public function show(Country $country): JsonResponse
    {
        $this->authorize('view', $country);

         $country->load('cities'); 

        return response()->json([
            'success' => true,
            'message' => 'Pays récupéré avec succès.',
            'data' => new CountryResource($country),
        ]);
    }

    /**
     * Modifier un pays.
     */
    public function update(
        UpdateCountryRequest $request,
        Country $country
    ): JsonResponse {
        $this->authorize('update', $country);

        $country->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pays mis à jour avec succès.',
            'data' => new CountryResource($country),
        ]);
    }

    /**
     * Supprimer logiquement un pays.
     */
    public function destroy(Country $country): JsonResponse
    {
        $this->authorize('delete', $country);

        $country->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pays supprimé avec succès.',
            'data' => null,
        ]);
    }
}