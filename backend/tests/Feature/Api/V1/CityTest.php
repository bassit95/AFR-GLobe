<?php

namespace Tests\Feature\Api\V1;

use App\Models\City;
use App\Models\Country;
use Illuminate\Support\Str;

class CityTest extends ApiV1TestCase
{
    public function test_it_has_seeded_cities(): void
    {
        $this->assertGreaterThan(0, City::count());
    }

    public function test_it_returns_cities(): void
    {
        $response = $this->getJson('/api/v1/cities')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_returns_one_city_with_country(): void
    {
        $city = City::query()->firstOrFail();

        $this->getJson("/api/v1/cities/{$city->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'country',
                ],
            ]);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/cities', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        $country = Country::query()->firstOrFail();

        return [
            'country_id' => $country->id,
            'name' => 'Test City ' . Str::random(6),
        ];
    }

    public function test_regular_user_cannot_create_city(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/cities', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_city(): void
    {
        $this->actingAsAdminWithToken();

        $payload = $this->validPayload();

        $response = $this->postJson('/api/v1/cities', $payload)
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('cities', [
            'id' => $response->json('data.id'),
            'country_id' => $payload['country_id'],
            'name' => $payload['name'],
        ]);
    }

    public function test_city_creation_validates_input(): void
    {
        $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/cities', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['country_id', 'name']);
    }

    public function test_city_name_must_be_unique_inside_the_country(): void
    {
        $this->actingAsAdminWithToken();
        $city = City::query()->firstOrFail();

        $this->postJson('/api/v1/cities', [
            'country_id' => $city->country_id,
            'name' => $city->name,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_regular_user_cannot_update_city(): void
    {
        $this->actingAsRegularUser();
        $city = City::query()->firstOrFail();

        $this->putJson("/api/v1/cities/{$city->id}", [
            'name' => 'Unauthorized City',
        ])->assertForbidden();
    }

    public function test_admin_can_update_city(): void
    {
        $this->actingAsAdminWithToken();
        $city = City::query()->firstOrFail();

        $newName = 'Updated City ' . Str::random(6);

        $this->putJson("/api/v1/cities/{$city->id}", [
            'name' => $newName,
        ])->assertOk();

        $this->assertDatabaseHas('cities', [
            'id' => $city->id,
            'name' => $newName,
        ]);
    }

    public function test_regular_user_cannot_delete_city(): void
    {
        $this->actingAsRegularUser();
        $city = City::query()->firstOrFail();

        $this->deleteJson("/api/v1/cities/{$city->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_city(): void
    {
       $this->actingAsAdminWithToken();

        $payload = $this->validPayload();

        $response = $this->postJson('/api/v1/cities', $payload)
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/cities/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('cities', ['id' => $id]);
        $this->getJson("/api/v1/cities/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_cities_by_name(): void
    {
        $city = City::query()->firstOrFail();

        $response = $this->getJson(
            '/api/v1/cities?search=' . urlencode($city->name)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_cities_by_country(): void
    {
        $city = City::query()->firstOrFail();

        $response = $this->getJson(
            "/api/v1/cities?country_id={$city->country_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($city->country_id, $item['country']['id']);
        }
    }
}
