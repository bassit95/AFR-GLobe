<?php

namespace Tests\Feature\Api\V1;

use App\Models\Article;
use App\Models\Source;

class ArticleTest extends ApiV1TestCase
{
    public function test_it_has_seeded_articles(): void
    {
        $this->assertGreaterThan(0, Article::count());
    }

    public function test_it_returns_published_articles(): void
    {
        $response = $this->getJson('/api/v1/articles')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));

        foreach ($response->json('data') as $item) {
            $this->assertSame('published', $item['status']);
        }
    }

    public function test_it_returns_one_article_with_relations(): void
    {
        $article = Article::query()->firstOrFail();

        $this->getJson("/api/v1/articles/{$article->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'title', 'slug', 'excerpt', 'content',
                    'cover_image', 'published_at', 'status',
                    'author', 'sources',
                ],
            ]);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/articles', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'title' => 'Article Test API',
            'slug' => 'article-test-api',
            'excerpt' => 'Résumé de test.',
            'content' => 'Contenu complet de test.',
            'cover_image' => 'articles/test.jpg',
            'published_at' => now()->toDateTimeString(),
            'status' => 'published',
            'source_ids' => [Source::query()->firstOrFail()->id],
        ];
    }

    public function test_regular_user_cannot_create_article(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/articles', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_article_and_sets_authenticated_author(): void
    {
        $this->actingAsAdminWithToken();

        $adminId = $this->adminUser()->id;

        $response = $this->postJson(
            '/api/v1/articles',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $id = $response->json('data.id');

        $this->assertDatabaseHas('articles', [
            'id' => $id,
            'title' => 'Article Test API',
            'author_id' => $adminId,
        ]);

        $this->assertDatabaseHas('article_sources', [
            'article_id' => $id,
            'source_id' => Source::query()->firstOrFail()->id,
        ]);
    }

    public function test_article_creation_validates_input(): void
    {
        $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/articles', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'slug', 'content']);
    }

    public function test_article_slug_must_be_unique(): void
    {
        $this->actingAsAdminWithToken();
        $article = Article::query()->firstOrFail();
        $payload = $this->validPayload();
        $payload['slug'] = $article->slug;

        $this->postJson('/api/v1/articles', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_regular_user_cannot_update_article(): void
    {
        $this->actingAsRegularUser();
        $article = Article::query()->firstOrFail();

        $this->putJson("/api/v1/articles/{$article->id}", [
            'title' => 'Unauthorized Article',
        ])->assertForbidden();
    }

    public function test_admin_can_update_article(): void
    {
        $this->actingAsAdminWithToken();
        $article = Article::query()->firstOrFail();

        $this->putJson("/api/v1/articles/{$article->id}", [
            'title' => 'Updated Article',
        ])->assertOk();

        $this->assertDatabaseHas('articles', [
            'id' => $article->id,
            'title' => 'Updated Article',
        ]);
    }
    
    public function test_draft_article_is_not_visible_to_public(): void
{
    // Créer un article en draft
    $admin = $this->adminUser();
    $this->actingAsAdminWithToken();

    $response = $this->postJson('/api/v1/articles', [
        'title' => 'Draft Article',
        'slug' => 'draft-article-test',
        'content' => 'Contenu',
        'status' => 'draft',
    ])->assertCreated();

    $id = $response->json('data.id');

       $this->app['auth']->forgetGuards();
        $this->flushHeaders();   // ← AJOUTÉ

        // Un anonyme ne doit PAS voir le draft
        $this->getJson("/api/v1/articles/{$id}")
            ->assertForbidden();
}
    public function test_admin_can_update_article_sources(): void
    {
        $this->actingAsAdminWithToken();
        $article = Article::query()->firstOrFail();
        $source = Source::query()->firstOrFail();

        $this->putJson("/api/v1/articles/{$article->id}", [
            'source_ids' => [$source->id],
        ])->assertOk();

        $this->assertDatabaseHas('article_sources', [
            'article_id' => $article->id,
            'source_id' => $source->id,
        ]);
    }

    public function test_regular_user_cannot_delete_article(): void
    {
        $this->actingAsRegularUser();
        $article = Article::query()->firstOrFail();

        $this->deleteJson("/api/v1/articles/{$article->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_article(): void
    {
       $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/articles', $this->validPayload())
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/articles/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('articles', ['id' => $id]);
        $this->getJson("/api/v1/articles/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_articles_by_title(): void
    {
        $article = Article::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/articles?search=' . urlencode($article->title)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_articles_by_author(): void
    {
        $article = Article::query()
            ->where('status', 'published')
            ->whereNotNull('author_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/articles?author_id={$article->author_id}"
        )->assertOk();

        foreach ($response->json('data') as $row) {
            $this->assertSame($article->author_id, $row['author']['id']);
        }
    }
}
