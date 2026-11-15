<?php

namespace Tests\Feature\Api\V1;

use App\Models\Country;

class CountryTest extends ApiV1TestCase
{
    public function test_it_has_seeded_countries(): void
    {
        $this->assertGreaterThan(0, Country::count());
    }

    public function test_it_returns_countries(): void
    {
        $response = $this->getJson('/api/v1/countries')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_returns_one_country(): void
    {
        $country = Country::query()->firstOrFail();

        $this->getJson("/api/v1/countries/{$country->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => ['id', 'name', 'code', 'continent'],
            ]);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/countries', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'name' => 'Testland',
            'code' => 'ZZ',
            'continent' => 'Africa',
        ];
    }

    public function test_regular_user_cannot_create_country(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/countries', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_country(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/countries',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('countries', [
            'id' => $response->json('data.id'),
            'code' => 'ZZ',
        ]);
    }

    public function test_country_creation_validates_input(): void
    {
       $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/countries', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'code']);
    }

    public function test_country_name_and_code_must_be_unique(): void
    {
        $this->actingAsAdminWithToken();
        $country = Country::query()->firstOrFail();

        $this->postJson('/api/v1/countries', [
            'name' => $country->name,
            'code' => $country->code,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'code']);
    }

    public function test_regular_user_cannot_update_country(): void
    {
        $this->actingAsRegularUser();
        $country = Country::query()->firstOrFail();

        $this->putJson("/api/v1/countries/{$country->id}", [
            'name' => 'Unauthorized Country',
        ])->assertForbidden();
    }

    public function test_admin_can_update_country(): void
    {
        $this->actingAsAdminWithToken();
        $country = Country::query()->firstOrFail();

        $this->putJson("/api/v1/countries/{$country->id}", [
            'name' => 'Updated Country',
        ])->assertOk();

        $this->assertDatabaseHas('countries', [
            'id' => $country->id,
            'name' => 'Updated Country',
        ]);
    }

    public function test_regular_user_cannot_delete_country(): void
    {
        $this->actingAsRegularUser();
        $country = Country::query()->firstOrFail();

        $this->deleteJson("/api/v1/countries/{$country->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_country(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/countries', $this->validPayload())
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/countries/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('countries', ['id' => $id]);
        $this->getJson("/api/v1/countries/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_countries_by_name(): void
    {
        $country = Country::query()->firstOrFail();

        $response = $this->getJson(
            '/api/v1/countries?search=' . urlencode($country->name)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_countries_by_code(): void
    {
        $country = Country::query()->firstOrFail();

        $response = $this->getJson(
            "/api/v1/countries?code={$country->code}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($country->code, $item['code']);
        }
    }

    public function test_it_filters_countries_by_continent(): void
    {
        $country = Country::query()
            ->whereNotNull('continent')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/countries?continent=' . urlencode($country->continent)
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($country->continent, $item['continent']);
        }
    }
}
