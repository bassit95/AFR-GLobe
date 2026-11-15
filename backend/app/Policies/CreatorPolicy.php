<?php

namespace App\Policies;

use App\Models\Creator;
use App\Models\User;

class CreatorPolicy
{
    public function viewAny(?User $user): bool      // ← ? ajouté
    {
        return true;
    }

    public function view(?User $user, Creator $creator): bool   // ← ? ajouté
    {
        return $creator->status === 'published'
        || $user?->role === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Creator $creator): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Creator $creator): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Creator $creator): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Creator $creator): bool
    {
        return $user->role === 'admin';
    }
}