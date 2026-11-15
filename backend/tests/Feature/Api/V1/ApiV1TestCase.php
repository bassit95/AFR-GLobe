<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

abstract class ApiV1TestCase extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Recharger toutes les données prévues par DatabaseSeeder.
        $this->seed();
    }

    protected function adminUser(): User
    {
        return User::query()
            ->where('role', 'admin')
            ->firstOrFail();
    }

    protected function regularUser(): User
    {
        return User::create([
            'name' => 'Regular Test User',
            'email' => 'regular-test-user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
    }

    protected function actingAsAdminWithToken(): void
{
    $user = $this->adminUser();

    $token = $user->createToken('test-token', ['*'])->plainTextToken;

    $this->withHeader('Authorization', 'Bearer ' . $token);
}

    protected function actingAsRegularUser(): void
    {
        $this->actingAs($this->regularUser(), 'sanctum');
    }
}
