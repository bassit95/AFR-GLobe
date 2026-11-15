<?php

namespace App\Policies;

use App\Models\Boutique;
use App\Models\User;

class BoutiquePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(User $user, Boutique $boutique): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Boutique $boutique): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Boutique $boutique): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Boutique $boutique): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Boutique $boutique): bool
    {
        return $user->role === 'admin';
    }
}