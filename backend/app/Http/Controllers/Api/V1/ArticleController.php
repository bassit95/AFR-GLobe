<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Article\IndexArticleRequest;
use App\Http\Requests\V1\Article\StoreArticleRequest;
use App\Http\Requests\V1\Article\UpdateArticleRequest;
use App\Http\Resources\V1\Article\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    public function index(IndexArticleRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Article::class);

        $validated = $request->validated();

        $query = Article::query()->with(['author', 'sources']);

        // ✅ CORRIGÉ — Gestion du statut selon le rôle
        $isAdmin = $request->user()?->role === 'admin';
        $requestedStatus = $validated['status'] ?? null; // 'all' | 'draft' | 'published' | 'archived'

        if ($isAdmin && $requestedStatus) {
            // Admin a explicitement demandé un statut
            if ($requestedStatus !== 'all') {
                $query->where('status', $requestedStatus);
            }
            // si 'all' → aucun filtre (tous les statuts)
        } else {
            // Public (non connecté) OU user simple OU admin sans filtre → published uniquement
            $query->where('status', 'published');
        }

        // 🔍 Recherche full-text simple
        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // 🎯 Filtre article_type
        if (!empty($validated['article_type'])) {
            $query->where('article_type', $validated['article_type']);
        }

        // 👤 Filtre auteur
        if (!empty($validated['author_id'])) {
            $query->where('author_id', $validated['author_id']);
        }

        $articles = $query
            ->orderByDesc('published_at')
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'success' => true,
            'message' => 'Articles récupérés avec succès.',
            'data' => ArticleResource::collection($articles->items()),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'last_page' => $articles->lastPage(),
                'per_page' => $articles->perPage(),
                'total' => $articles->total(),
            ],
        ]);
    }

    // ... store(), show(), update(), destroy() inchangés


    public function store(StoreArticleRequest $request): JsonResponse
    {
        $this->authorize('create', Article::class);

        $validated = $request->validated();
        $sourceIds = $validated['source_ids'] ?? [];
        unset($validated['source_ids']);

        if (empty($validated['author_id'])) {
            $validated['author_id'] = $request->user()->id;
        }

        $article = DB::transaction(function () use ($validated, $sourceIds) {
            $article = Article::create($validated);
            if ($sourceIds) {
                $article->sources()->sync($sourceIds);
            }
            return $article;
        });

        $article->load(['author', 'sources']);

        return response()->json([
            'success' => true,
            'message' => 'Article créé avec succès.',
            'data' => new ArticleResource($article),
        ], 201);
    }

    public function show(Article $article): JsonResponse
    {
        $this->authorize('view', $article);

        $article->load(['author', 'sources']);

        return response()->json([
            'success' => true,
            'message' => 'Article récupéré avec succès.',
            'data' => new ArticleResource($article),
        ]);
    }

    public function update(UpdateArticleRequest $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $validated = $request->validated();
        $sourceIds = $validated['source_ids'] ?? null;
        unset($validated['source_ids']);

        DB::transaction(function () use ($article, $validated, $sourceIds) {
            $article->update($validated);
            if ($sourceIds !== null) {
                $article->sources()->sync($sourceIds);
            }
        });

        $article->load(['author', 'sources']);

        return response()->json([
            'success' => true,
            'message' => 'Article mis à jour avec succès.',
            'data' => new ArticleResource($article),
        ]);
    }

    public function destroy(Article $article): JsonResponse
    {
        $this->authorize('delete', $article);

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article supprimé avec succès.',
            'data' => null,
        ]);
    }
}
