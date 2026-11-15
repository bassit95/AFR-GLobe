<?php

namespace Tests\Feature\Api\V1;

use App\Models\Brand;
use App\Models\Collection;

class CollectionTest extends ApiV1TestCase
{
    public function test_it_has_seeded_collections(): void
    {
        $this->assertGreaterThan(0, Collection::count());
    }

    public function test_it_returns_published_collections(): void
    {
        $response = $this->getJson('/api/v1/collections')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));

        foreach ($response->json('data') as $item) {
            $this->assertSame('published', $item['status']);
        }
    }

    public function test_it_returns_one_collection_with_relations(): void
    {
        $collection = Collection::query()->firstOrFail();

        $this->getJson("/api/v1/collections/{$collection->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'name', 'slug', 'description',
                    'year', 'season', 'cover_image', 'status',
                    'brand', 'products', 'portfolio_items',
                ],
            ]);
    }

    public function test_it_returns_products_of_a_collection(): void
    {
        $collection = Collection::query()->has('products')->firstOrFail();

        $this->getJson(
            "/api/v1/collections/{$collection->id}/products"
        )
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/collections', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'brand_id' => Brand::query()->firstOrFail()->id,
            'name' => 'Collection Test API',
            'slug' => 'collection-test-api',
            'description' => 'Collection créée pour les tests.',
            'year' => 2025,
            'season' => 'Summer',
            'status' => 'published',
        ];
    }

    public function test_regular_user_cannot_create_collection(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/collections', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_collection(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/collections',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $id = $response->json('data.id');

        $this->assertDatabaseHas('collections', [
            'id' => $id,
            'slug' => 'collection-test-api',
        ]);
    }

    public function test_collection_creation_validates_input(): void
    {
       $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/collections', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'brand_id',
                'name',
                'slug',
            ]);
    }

    public function test_collection_slug_must_be_unique(): void
    {
        $this->actingAsAdminWithToken();
        $collection = Collection::query()->firstOrFail();

        $this->postJson('/api/v1/collections', [
            'brand_id' => $collection->brand_id,
            'name' => 'Duplicate Collection',
            'slug' => $collection->slug,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_regular_user_cannot_update_collection(): void
    {
        $this->actingAsRegularUser();
        $collection = Collection::query()->firstOrFail();

        $this->putJson("/api/v1/collections/{$collection->id}", [
            'name' => 'Unauthorized Collection',
        ])->assertForbidden();
    }

    public function test_admin_can_update_collection(): void
    {
        $this->actingAsAdminWithToken();
        $collection = Collection::query()->firstOrFail();

        $this->putJson("/api/v1/collections/{$collection->id}", [
            'name' => 'Updated Collection',
        ])->assertOk();

        $this->assertDatabaseHas('collections', [
            'id' => $collection->id,
            'name' => 'Updated Collection',
        ]);
    }

    public function test_regular_user_cannot_delete_collection(): void
    {
        $this->actingAsRegularUser();
        $collection = Collection::query()->firstOrFail();

        $this->deleteJson("/api/v1/collections/{$collection->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_collection(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/collections', $this->validPayload())
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/collections/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('collections', ['id' => $id]);
        $this->getJson("/api/v1/collections/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_collections_by_name(): void
    {
        $collection = Collection::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/collections?search=' . urlencode($collection->name)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_collections_by_brand(): void
    {
        $collection = Collection::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/collections?brand_id={$collection->brand_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($collection->brand_id, $item['brand']['id']);
        }
    }

    public function test_it_filters_collections_by_year(): void
    {
        $collection = Collection::query()
            ->where('status', 'published')
            ->whereNotNull('year')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/collections?year={$collection->year}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($collection->year, $item['year']);
        }
    }

    public function test_it_filters_collections_by_season(): void
    {
        $collection = Collection::query()
            ->where('status', 'published')
            ->whereNotNull('season')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/collections?season=' . urlencode($collection->season)
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($collection->season, $item['season']);
        }
    }
}
