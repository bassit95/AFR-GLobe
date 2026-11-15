<?php

namespace App\Policies;

use App\Models\Style;
use App\Models\User;

class StylePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Style $style): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Style $style): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Style $style): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Style $style): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Style $style): bool
    {
        return $user->role === 'admin';
    }
}