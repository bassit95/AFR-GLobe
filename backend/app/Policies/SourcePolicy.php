<?php

namespace App\Policies;

use App\Models\Source;
use App\Models\User;

class SourcePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Source $source): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Source $source): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Source $source): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Source $source): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Source $source): bool
    {
        return $user->role === 'admin';
    }
}