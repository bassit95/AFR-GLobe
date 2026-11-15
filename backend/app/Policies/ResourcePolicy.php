<?php

namespace App\Policies;

use App\Models\Resource;
use App\Models\User;

class ResourcePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Resource $resource): bool
    {
       
       return $resource->status === 'published'
        || $user?->role === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Resource $resource): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Resource $resource): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Resource $resource): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Resource $resource): bool
    {
        return $user->role === 'admin';
    }
}