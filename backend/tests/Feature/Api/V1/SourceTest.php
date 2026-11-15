<?php

namespace Tests\Feature\Api\V1;

use App\Models\Source;

class SourceTest extends ApiV1TestCase
{
    public function test_it_has_seeded_sources(): void
    {
        $this->assertGreaterThan(0, Source::count());
    }

    public function test_it_returns_sources(): void
    {
        $response = $this->getJson('/api/v1/sources')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_returns_one_source(): void
    {
        $source = Source::query()->firstOrFail();

        $this->getJson("/api/v1/sources/{$source->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'title', 'source_type', 'url',
                    'publisher', 'published_at', 'checked_at',
                ],
            ]);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/sources', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'title' => 'Source Test API',
            'source_type' => 'website',
            'url' => 'https://example.com/source-test',
            'publisher' => 'Africa Global Test',
            'published_at' => now()->toDateString(),
            'checked_at' => now()->toDateTimeString(),
        ];
    }

    public function test_regular_user_cannot_create_source(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/sources', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_source(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/sources',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('sources', [
            'id' => $response->json('data.id'),
            'title' => 'Source Test API',
        ]);
    }

    public function test_source_creation_validates_input(): void
    {
        $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/sources', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title', 'source_type', 'url',
            ]);
    }

    public function test_regular_user_cannot_update_source(): void
    {
        $this->actingAsRegularUser();
        $source = Source::query()->firstOrFail();

        $this->putJson("/api/v1/sources/{$source->id}", [
            'title' => 'Unauthorized Source',
        ])->assertForbidden();
    }

    public function test_admin_can_update_source(): void
    {
        $this->actingAsAdminWithToken();
        $source = Source::query()->firstOrFail();

        $this->putJson("/api/v1/sources/{$source->id}", [
            'title' => 'Updated Source',
        ])->assertOk();

        $this->assertDatabaseHas('sources', [
            'id' => $source->id,
            'title' => 'Updated Source',
        ]);
    }

    public function test_regular_user_cannot_delete_source(): void
    {
        $this->actingAsRegularUser();
        $source = Source::query()->firstOrFail();

        $this->deleteJson("/api/v1/sources/{$source->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_source(): void
    {
       $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/sources', $this->validPayload())
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/sources/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('sources', ['id' => $id]);
        $this->getJson("/api/v1/sources/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_sources(): void
    {
        $source = Source::query()->firstOrFail();

        $response = $this->getJson(
            '/api/v1/sources?search=' . urlencode($source->title)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_sources_by_type(): void
    {
        $source = Source::query()
            ->whereNotNull('source_type')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/sources?source_type=' . urlencode($source->source_type)
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($source->source_type, $item['source_type']);
        }
    }

    public function test_it_filters_sources_by_publisher(): void
    {
        $source = Source::query()
            ->whereNotNull('publisher')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/sources?publisher=' . urlencode($source->publisher)
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertStringContainsString(
                $source->publisher,
                $item['publisher']
            );
        }
    }
}
