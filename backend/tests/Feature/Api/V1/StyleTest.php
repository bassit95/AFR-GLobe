<?php

namespace Tests\Feature\Api\V1;

use App\Models\Style;

class StyleTest extends ApiV1TestCase
{
    public function test_it_has_seeded_styles(): void
    {
        $this->assertGreaterThan(0, Style::count());
    }

    public function test_it_returns_styles(): void
    {
        $response = $this->getJson('/api/v1/styles')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_returns_one_style_with_relations(): void
    {
        $style = Style::query()->firstOrFail();

        $this->getJson("/api/v1/styles/{$style->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'name', 'slug', 'description',
                    'parent', 'children',
                ],
            ]);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/styles', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'name' => 'Style Test API',
            'slug' => 'style-test-api',
            'description' => 'Style de test.',
        ];
    }

    public function test_regular_user_cannot_create_style(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/styles', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_style(): void
    {
       $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/styles',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('styles', [
            'id' => $response->json('data.id'),
            'slug' => 'style-test-api',
        ]);
    }

    public function test_style_creation_validates_input(): void
    {
        $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/styles', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'slug']);
    }

    public function test_style_slug_must_be_unique(): void
    {
        $this->actingAsAdminWithToken();
        $style = Style::query()->firstOrFail();
        $payload = $this->validPayload();
        $payload['slug'] = $style->slug;

        $this->postJson('/api/v1/styles', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_regular_user_cannot_update_style(): void
    {
        $this->actingAsRegularUser();
        $style = Style::query()->firstOrFail();

        $this->putJson("/api/v1/styles/{$style->id}", [
            'name' => 'Unauthorized Style',
        ])->assertForbidden();
    }

    public function test_admin_can_update_style(): void
    {
        $this->actingAsAdminWithToken();
        $style = Style::query()->firstOrFail();

        $this->putJson("/api/v1/styles/{$style->id}", [
            'name' => 'Updated Style',
        ])->assertOk();

        $this->assertDatabaseHas('styles', [
            'id' => $style->id,
            'name' => 'Updated Style',
        ]);
    }

    public function test_regular_user_cannot_delete_style(): void
    {
        $this->actingAsRegularUser();
        $style = Style::query()->firstOrFail();

        $this->deleteJson("/api/v1/styles/{$style->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_style(): void
    {
       $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/styles', $this->validPayload())
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/styles/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('styles', ['id' => $id]);
        $this->getJson("/api/v1/styles/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_styles(): void
    {
        $style = Style::query()->firstOrFail();

        $response = $this->getJson(
            '/api/v1/styles?search=' . urlencode($style->name)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_styles_by_parent(): void
    {
        $style = Style::query()
            ->whereNotNull('parent_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/styles?parent_id={$style->parent_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $parent = $item['parent']['id'] ?? null;
            $this->assertSame($style->parent_id, $parent);
        }
    }
}
