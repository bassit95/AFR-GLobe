<?php

namespace App\Policies;

use App\Models\Collection;
use App\Models\User;

class CollectionPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Collection $collection): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Collection $collection): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Collection $collection): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Collection $collection): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Collection $collection): bool
    {
        return $user->role === 'admin';
    }
}