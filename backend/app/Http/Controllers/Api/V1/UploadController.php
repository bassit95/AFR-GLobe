<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\UploadImage\UploadImageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(UploadImageRequest $request): JsonResponse
    {
        $path = $request->file('image')->store('uploads', 'public');

        return response()->json([
            'success' => true,
            'message' => 'Image uploadée avec succès.',
            'data' => [
                'url' => Storage::url($path),   // ✅ CORRIGÉ — enveloppé dans data
                'path' => $path,
            ],
        ]);
    }
}