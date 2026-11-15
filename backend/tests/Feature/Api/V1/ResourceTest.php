<?php

namespace Tests\Feature\Api\V1;

use App\Models\Resource as ResourceModel;

class ResourceTest extends ApiV1TestCase
{
    public function test_it_has_seeded_resources(): void
    {
        $this->assertGreaterThan(0, ResourceModel::count());
    }

    public function test_it_returns_published_resources(): void
    {
        $response = $this->getJson('/api/v1/resources')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));

        foreach ($response->json('data') as $item) {
            $this->assertSame('published', $item['status']);
        }
    }

    public function test_it_returns_one_resource(): void
    {
        $resource = ResourceModel::query()->firstOrFail();

        $this->getJson("/api/v1/resources/{$resource->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'title', 'slug', 'description',
                    'resource_type', 'url', 'cover_image', 'status',
                ],
            ]);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/resources', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'title' => 'Resource Test API',
            'slug' => 'resource-test-api',
            'description' => 'Resource de test.',
            'resource_type' => 'guide',
            'url' => 'https://example.com/resource-test',
            'cover_image' => 'resources/test.jpg',
            'status' => 'published',
        ];
    }

    public function test_regular_user_cannot_create_resource(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/resources', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_resource(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/resources',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('resources', [
            'id' => $response->json('data.id'),
            'slug' => 'resource-test-api',
        ]);
    }

    public function test_resource_creation_validates_input(): void
    {
        $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/resources', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'title', 'slug', 'resource_type', 'url',
            ]);
    }

    public function test_resource_slug_must_be_unique(): void
    {
        $this->actingAsAdminWithToken();
        $resource = ResourceModel::query()->firstOrFail();
        $payload = $this->validPayload();
        $payload['slug'] = $resource->slug;

        $this->postJson('/api/v1/resources', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_regular_user_cannot_update_resource(): void
    {
        $this->actingAsRegularUser();
        $resource = ResourceModel::query()->firstOrFail();

        $this->putJson("/api/v1/resources/{$resource->id}", [
            'title' => 'Unauthorized Resource',
        ])->assertForbidden();
    }

    public function test_admin_can_update_resource(): void
    {
        $this->actingAsAdminWithToken();
        $resource = ResourceModel::query()->firstOrFail();

        $this->putJson("/api/v1/resources/{$resource->id}", [
            'title' => 'Updated Resource',
        ])->assertOk();

        $this->assertDatabaseHas('resources', [
            'id' => $resource->id,
            'title' => 'Updated Resource',
        ]);
    }

    public function test_regular_user_cannot_delete_resource(): void
    {
        $this->actingAsRegularUser();
        $resource = ResourceModel::query()->firstOrFail();

        $this->deleteJson("/api/v1/resources/{$resource->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_resource(): void
    {
       $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/resources', $this->validPayload())
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/resources/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('resources', ['id' => $id]);
        $this->getJson("/api/v1/resources/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_resources_by_title(): void
    {
        $resource = ResourceModel::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/resources?search=' . urlencode($resource->title)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_resources_by_type(): void
    {
        $resource = ResourceModel::query()
            ->where('status', 'published')
            ->whereNotNull('resource_type')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/resources?resource_type=' . urlencode($resource->resource_type)
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($resource->resource_type, $item['resource_type']);
        }
    }
}
