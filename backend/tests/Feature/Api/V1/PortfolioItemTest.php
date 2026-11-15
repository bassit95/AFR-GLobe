<?php

namespace Tests\Feature\Api\V1;

use App\Models\Collection;
use App\Models\Creator;
use App\Models\PortfolioItem;

class PortfolioItemTest extends ApiV1TestCase
{
    public function test_it_has_seeded_portfolio_items(): void
    {
        $this->assertGreaterThan(0, PortfolioItem::count());
    }

    public function test_it_returns_published_portfolio_items(): void
    {
        $response = $this->getJson('/api/v1/portfolio-items')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));

        foreach ($response->json('data') as $item) {
            $this->assertSame('published', $item['status']);
        }
    }

    public function test_it_returns_one_portfolio_item_with_relations(): void
    {
        $item = PortfolioItem::query()->firstOrFail();

        $this->getJson("/api/v1/portfolio-items/{$item->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'title', 'description', 'image', 'alt_text',
                    'year', 'display_order', 'status', 'creator', 'collection',
                ],
            ]);
    }

    public function test_it_returns_a_creator_portfolio(): void
    {
        $creator = Creator::query()->has('portfolioItems')->firstOrFail();

        $this->getJson(
            "/api/v1/creators/{$creator->id}/portfolio"
        )
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/portfolio-items', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'creator_id' => Creator::query()->firstOrFail()->id,
            'collection_id' => Collection::query()->firstOrFail()->id,
            'title' => 'Portfolio Test API',
            'description' => 'Portfolio créé pour les tests.',
            'image' => 'portfolio/test.jpg',
            'alt_text' => 'Portfolio test',
            'year' => 2025,
            'display_order' => 1,
            'status' => 'published',
        ];
    }

    public function test_regular_user_cannot_create_portfolio_item(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/portfolio-items', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_portfolio_item(): void
    {
       $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/portfolio-items',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('portfolio_items', [
            'id' => $response->json('data.id'),
            'title' => 'Portfolio Test API',
        ]);
    }

    public function test_portfolio_item_creation_validates_input(): void
    {
        $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/portfolio-items', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['creator_id', 'title']);
    }

    public function test_regular_user_cannot_update_portfolio_item(): void
    {
        $this->actingAsRegularUser();
        $item = PortfolioItem::query()->firstOrFail();

        $this->putJson("/api/v1/portfolio-items/{$item->id}", [
            'title' => 'Unauthorized Portfolio',
        ])->assertForbidden();
    }

    public function test_admin_can_update_portfolio_item(): void
    {
        $this->actingAsAdminWithToken();
        $item = PortfolioItem::query()->firstOrFail();

        $this->putJson("/api/v1/portfolio-items/{$item->id}", [
            'title' => 'Updated Portfolio',
        ])->assertOk();

        $this->assertDatabaseHas('portfolio_items', [
            'id' => $item->id,
            'title' => 'Updated Portfolio',
        ]);
    }

    public function test_regular_user_cannot_delete_portfolio_item(): void
    {
        $this->actingAsRegularUser();
        $item = PortfolioItem::query()->firstOrFail();

        $this->deleteJson("/api/v1/portfolio-items/{$item->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_portfolio_item(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/portfolio-items',
            $this->validPayload()
        )->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/portfolio-items/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('portfolio_items', ['id' => $id]);
        $this->getJson("/api/v1/portfolio-items/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_portfolio_items_by_title(): void
    {
        $item = PortfolioItem::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/portfolio-items?search=' . urlencode($item->title)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_portfolio_items_by_creator(): void
    {
        $item = PortfolioItem::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/portfolio-items?creator_id={$item->creator_id}"
        )->assertOk();

        foreach ($response->json('data') as $row) {
            $this->assertSame($item->creator_id, $row['creator']['id']);
        }
    }

    public function test_it_filters_portfolio_items_by_collection(): void
    {
        $item = PortfolioItem::query()
            ->where('status', 'published')
            ->whereNotNull('collection_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/portfolio-items?collection_id={$item->collection_id}"
        )->assertOk();

        foreach ($response->json('data') as $row) {
            $this->assertSame($item->collection_id, $row['collection']['id']);
        }
    }

    public function test_it_filters_portfolio_items_by_year(): void
    {
        $item = PortfolioItem::query()
            ->where('status', 'published')
            ->whereNotNull('year')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/portfolio-items?year={$item->year}"
        )->assertOk();

        foreach ($response->json('data') as $row) {
            $this->assertSame($item->year, $row['year']);
        }
    }
}
