<?php

namespace Tests\Feature\Api\V1;

use App\Models\Country;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SanctumBearerTokenTest extends ApiV1TestCase
{
    /**
     * Test 1 — Un admin peut se connecter et reçoit un token valide.
     */
    public function test_admin_can_login_and_receive_token(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email'    => 'admin@africaglobal.test',
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => ['user', 'token', 'abilities'],
            ]);

        $token     = $response->json('data.token');
        $abilities = $response->json('data.abilities');

        $this->assertNotEmpty($token);
        $this->assertIsString($token);
        $this->assertContains('*', $abilities);
    }

    /**
     * Test 2 — Un vrai Bearer Token admin permet d'accéder à /me.
     */
    public function test_bearer_token_grants_access_to_me(): void
    {
        $token = $this->loginAsAdmin();

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'admin@africaglobal.test')
            ->assertJsonPath('data.role', 'admin');
    }

    /**
     * Test 3 — Logout révoque le token courant.*/
 public function test_logout_revokes_current_token(): void
{
    $token = $this->loginAsAdmin();

    // 1. Le token fonctionne
    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/v1/me')
        ->assertOk();

    // 2. Logout
    $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/v1/logout')
        ->assertOk();

    // 3. On simule une nouvelle session HTTP
    //    En production, chaque requête HTTP est une app fraîche.
    //    En test, Laravel réutilise la même instance → il faut
    //    forcer la réinitialisation du guard.
    $this->app['auth']->forgetGuards();

    // 4. Le même token ne fonctionne plus
    $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/v1/me')
        ->assertUnauthorized();
}
    /**
     * Helper — login admin, retourne le token brut.
     */
    private function loginAsAdmin(): string
    {
        return $this->postJson('/api/v1/login', [
            'email'    => 'admin@africaglobal.test',
            'password' => 'password',
        ])
            ->assertOk()
            ->json('data.token');
    }
}