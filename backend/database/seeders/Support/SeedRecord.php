<?php

namespace Database\Seeders\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

final class SeedRecord
{
    /** Find-or-create a record and restore it when it was soft-deleted. */
    public static function upsert(string $modelClass, array $identity, array $values): Model
    {
        $usesSoftDeletes = in_array(SoftDeletes::class, class_uses_recursive($modelClass), true);
        $query = $usesSoftDeletes ? $modelClass::withTrashed() : $modelClass::query();
        /** @var Model $model */
        $model = $query->firstOrNew($identity);

        if ($model->exists && $usesSoftDeletes && $model->trashed()) {
            $model->restore();
        }

        $model->fill($values);
        $model->save();

        return $model;
    }
}
