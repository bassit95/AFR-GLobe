<?php

namespace Tests\Feature\Api\V1;

use App\Models\Brand;
use App\Models\Boutique;
use App\Models\City;
use App\Models\Country;
use App\Models\Source;

class BoutiqueTest extends ApiV1TestCase
{
    public function test_it_has_seeded_boutiques(): void
    {
        $this->assertGreaterThan(0, Boutique::count());
    }

    public function test_it_returns_published_boutiques(): void
    {
        $response = $this->getJson('/api/v1/boutiques')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));

        foreach ($response->json('data') as $item) {
            $this->assertSame('published', $item['status']);
        }
    }

    public function test_it_returns_one_boutique_with_relations(): void
    {
        $boutique = Boutique::query()->firstOrFail();

        $this->getJson("/api/v1/boutiques/{$boutique->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'name', 'address', 'latitude', 'longitude',
                    'phone', 'email', 'type', 'website_url',
                    'opening_hours', 'status', 'brand', 'country',
                    'city', 'sources',
                ],
            ]);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/boutiques', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'brand_id' => Brand::query()->firstOrFail()->id,
            'name' => 'Boutique Test API',
            'address' => '1 Avenue Test',
            'country_id' => Country::query()->firstOrFail()->id,
            'city_id' => City::query()->firstOrFail()->id,
            'latitude' => 5.3364,
            'longitude' => -4.0267,
            'phone' => '+2250000000000',
            'email' => 'boutique-test@example.com',
            'type' => 'physical',
            'website_url' => 'https://example.com',
            'opening_hours' => ['monday' => '09:00-18:00'],
            'status' => 'published',
            'source_ids' => [Source::query()->firstOrFail()->id],
        ];
    }

    public function test_regular_user_cannot_create_boutique(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/boutiques', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_boutique(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/boutiques',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $boutiqueId = $response->json('data.id');

        $this->assertDatabaseHas('boutiques', [
            'id' => $boutiqueId,
            'name' => 'Boutique Test API',
        ]);
    }

    public function test_boutique_creation_validates_input(): void
    {
       $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/boutiques', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_regular_user_cannot_update_boutique(): void
    {
        $this->actingAsRegularUser();
        $boutique = Boutique::query()->firstOrFail();

        $this->putJson("/api/v1/boutiques/{$boutique->id}", [
            'name' => 'Unauthorized Boutique',
        ])->assertForbidden();
    }

    public function test_admin_can_update_boutique(): void
    {
       $this->actingAsAdminWithToken();
        $boutique = Boutique::query()->firstOrFail();

        $this->putJson("/api/v1/boutiques/{$boutique->id}", [
            'name' => 'Updated Boutique',
        ])->assertOk();

        $this->assertDatabaseHas('boutiques', [
            'id' => $boutique->id,
            'name' => 'Updated Boutique',
        ]);
    }

    public function test_admin_can_update_boutique_sources(): void
    {
        $this->actingAsAdminWithToken();
        $boutique = Boutique::query()->firstOrFail();
        $source = Source::query()->firstOrFail();

        $this->putJson("/api/v1/boutiques/{$boutique->id}", [
            'source_ids' => [$source->id],
        ])->assertOk();

        $this->assertDatabaseHas('boutique_sources', [
            'boutique_id' => $boutique->id,
            'source_id' => $source->id,
        ]);
    }

    public function test_regular_user_cannot_delete_boutique(): void
    {
        $this->actingAsRegularUser();
        $boutique = Boutique::query()->firstOrFail();

        $this->deleteJson("/api/v1/boutiques/{$boutique->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_boutique(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/boutiques', [
            'name' => 'Boutique Delete Test',
            'status' => 'published',
        ])->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/boutiques/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('boutiques', ['id' => $id]);
        $this->getJson("/api/v1/boutiques/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_boutiques_by_name(): void
    {
        $boutique = Boutique::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/boutiques?search=' . urlencode($boutique->name)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_boutiques_by_brand(): void
    {
        $boutique = Boutique::query()
            ->where('status', 'published')
            ->whereNotNull('brand_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/boutiques?brand_id={$boutique->brand_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($boutique->brand_id, $item['brand']['id']);
        }
    }

    public function test_it_filters_boutiques_by_country(): void
    {
        $boutique = Boutique::query()
            ->where('status', 'published')
            ->whereNotNull('country_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/boutiques?country_id={$boutique->country_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($boutique->country_id, $item['country']['id']);
        }
    }

    public function test_it_filters_boutiques_by_city(): void
    {
        $boutique = Boutique::query()
            ->where('status', 'published')
            ->whereNotNull('city_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/boutiques?city_id={$boutique->city_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($boutique->city_id, $item['city']['id']);
        }
    }

        public function test_it_returns_boutiques_of_a_brand(): void
    {
        $brand = \App\Models\Brand::query()
            ->has('boutiques')
            ->firstOrFail();

        $response = $this->getJson("/api/v1/brands/{$brand->id}/boutiques")
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));

        foreach ($response->json('data') as $item) {
            $this->assertSame($brand->id, $item['brand']['id']);
        }
    }

    public function test_brand_boutiques_returns_404_for_unknown_brand(): void
    {
        $this->getJson('/api/v1/brands/999999/boutiques')
            ->assertNotFound();
    }

    public function test_it_filters_boutiques_by_type(): void
    {
        $boutique = Boutique::query()
            ->where('status', 'published')
            ->whereNotNull('type')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/boutiques?type=' . urlencode($boutique->type)
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($boutique->type, $item['type']);
        }
    }
}
