<?php

namespace Tests\Feature\Api\V1;

use App\Models\Brand;
use App\Models\City;
use App\Models\Country;
use App\Models\Creator;
use App\Models\Source;

class BrandTest extends ApiV1TestCase
{
    public function test_it_has_seeded_brands(): void
    {
        $this->assertGreaterThan(0, Brand::count());
    }

    public function test_it_returns_published_brands(): void
    {
        $response = $this->getJson('/api/v1/brands');

        $response
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $data = $response->json('data');

        $this->assertNotEmpty($data);

        foreach ($data as $brand) {
            $this->assertSame('published', $brand['status']);
        }
    }

    public function test_it_returns_one_brand_with_relations(): void
    {
        $brand = Brand::query()->firstOrFail();

        $response = $this->getJson("/api/v1/brands/{$brand->id}");

        $response
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'name', 'slug', 'logo', 'cover_image',
                    'description', 'founded_year', 'website_url', 'status',
                    'country', 'city', 'creators', 'boutiques',
                    'collections', 'sources',
                ],
            ]);
    }

    public function test_it_returns_brand_collections(): void
    {
        $brand = Brand::query()->has('collections')->firstOrFail();

        $response = $this->getJson(
            "/api/v1/brands/{$brand->id}/collections"
        );

        $response
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $response = $this->postJson('/api/v1/brands', []);

        $response->assertUnauthorized();
    }

    public function test_regular_user_cannot_create_brand(): void
    {
        $this->actingAsRegularUser();

        $country = Country::query()->firstOrFail();

        $response = $this->postJson('/api/v1/brands', [
            'name' => 'Policy Brand Test',
            'slug' => 'policy-brand-test',
            'country_id' => $country->id,
            'status' => 'published',
        ]);

        $response->assertForbidden();
    }

    public function test_admin_can_create_brand(): void
    {
        $this->actingAsAdminWithToken();

        $this->getJson('/api/v1/me')
      ->dump();



        $country = Country::query()->firstOrFail();
        $city = City::query()->firstOrFail();
        $creator = Creator::query()->firstOrFail();
        $source = Source::query()->firstOrFail();

        $response = $this->postJson('/api/v1/brands', [
            'name' => 'Brand Test API',
            'slug' => 'brand-test-api',
            'description' => 'Brand créé pour les tests.',
            'founded_year' => 2020,
            'country_id' => $country->id,
            'city_id' => $city->id,
            'website_url' => 'https://example.com',
            'status' => 'published',
            'creators' => [[
                'id' => $creator->id,
                'role' => 'founder',
            ]],
            'source_ids' => [$source->id],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('success', true);

        $brandId = $response->json('data.id');

        $this->assertDatabaseHas('brands', [
            'id' => $brandId,
            'slug' => 'brand-test-api',
        ]);

        $this->assertDatabaseHas('creator_brand', [
            'brand_id' => $brandId,
            'creator_id' => $creator->id,
            'role' => 'founder',
        ]);

        $this->assertDatabaseHas('brand_sources', [
            'brand_id' => $brandId,
            'source_id' => $source->id,
        ]);
    }

    public function test_brand_creation_validates_input(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/brands', []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'slug']);
    }

    public function test_brand_slug_must_be_unique(): void
    {
       $this->actingAsAdminWithToken();

        $brand = Brand::query()->firstOrFail();

        $response = $this->postJson('/api/v1/brands', [
            'name' => 'Duplicate Brand',
            'slug' => $brand->slug,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_regular_user_cannot_update_brand(): void
    {
        $this->actingAsRegularUser();
        $brand = Brand::query()->firstOrFail();

        $this->putJson("/api/v1/brands/{$brand->id}", [
            'name' => 'Unauthorized Brand Update',
        ])->assertForbidden();
    }

    public function test_admin_can_update_brand(): void
    {
        $this->actingAsAdminWithToken();
        $brand = Brand::query()->firstOrFail();

        $this->putJson("/api/v1/brands/{$brand->id}", [
            'name' => 'Updated Brand Name',
        ])
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('brands', [
            'id' => $brand->id,
            'name' => 'Updated Brand Name',
        ]);
    }

    public function test_admin_can_update_brand_relationships(): void
    {
       $this->actingAsAdminWithToken();

        $brand = Brand::query()->firstOrFail();
        $creator = Creator::query()->firstOrFail();
        $source = Source::query()->firstOrFail();

        $this->putJson("/api/v1/brands/{$brand->id}", [
            'creators' => [[
                'id' => $creator->id,
                'role' => 'designer',
            ]],
            'source_ids' => [$source->id],
        ])->assertOk();

        $this->assertDatabaseHas('creator_brand', [
            'brand_id' => $brand->id,
            'creator_id' => $creator->id,
            'role' => 'designer',
        ]);

        $this->assertDatabaseHas('brand_sources', [
            'brand_id' => $brand->id,
            'source_id' => $source->id,
        ]);
    }

    public function test_regular_user_cannot_delete_brand(): void
    {
        $this->actingAsRegularUser();
        $brand = Brand::query()->firstOrFail();

        $this->deleteJson("/api/v1/brands/{$brand->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_brand(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/brands', [
            'name' => 'Brand Delete Test',
            'slug' => 'brand-delete-test',
            'status' => 'published',
        ])->assertCreated();

        $brandId = $response->json('data.id');

        $this->deleteJson("/api/v1/brands/{$brandId}")
            ->assertOk();

        $this->assertSoftDeleted('brands', ['id' => $brandId]);

        $this->getJson("/api/v1/brands/{$brandId}")
            ->assertNotFound();
    }

    public function test_it_searches_brands_by_name(): void
    {
        $brand = Brand::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/brands?search=' . urlencode($brand->name)
        );

        $response->assertOk();
        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_brands_by_country(): void
    {
        $brand = Brand::query()
            ->where('status', 'published')
            ->whereNotNull('country_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/brands?country_id={$brand->country_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($brand->country_id, $item['country']['id']);
        }
    }

    public function test_it_filters_brands_by_city(): void
    {
        $brand = Brand::query()
            ->where('status', 'published')
            ->whereNotNull('city_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/brands?city_id={$brand->city_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($brand->city_id, $item['city']['id']);
        }
    }

    public function test_it_filters_brands_by_creator(): void
    {
        $creator = Creator::query()
            ->has('brands')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/brands?creator_id={$creator->id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $creatorIds = collect($item['creators'] ?? [])->pluck('id')->all();
            $this->assertContains($creator->id, $creatorIds);
        }
    }
}
