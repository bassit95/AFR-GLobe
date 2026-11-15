<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // No shared/default password: configure these variables only in your local .env.
        $email = env('AFRICA_GLOBAL_ADMIN_EMAIL');
        $password = env('AFRICA_GLOBAL_ADMIN_PASSWORD');

        if (!is_string($email) || $email === '' || !is_string($password) || strlen($password) < 6) {
            $this->command?->warn('UserSeeder ignoré : définis AFRICA_GLOBAL_ADMIN_EMAIL et AFRICA_GLOBAL_ADMIN_PASSWORD (12 caractères minimum) dans .env.');
            return;
        }

        SeedRecord::upsert(User::class, ['email' => $email], [
            'name' => 'Africa Global Admin',
            'role' => 'admin',
            'password' => Hash::make($password),
        ]);
    }
}
