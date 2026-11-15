<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService
    ) {}

    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Statistiques récupérées avec succès.',
            'data' => $this->dashboardService->getStats(),   // ✅ CORRIGÉ
        ]);
    }
}