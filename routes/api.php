<?php

use App\Http\Controllers\Api\BlogavelAdmin\CategoryController;
use App\Http\Controllers\Api\BlogavelAdmin\MediaController;
use App\Http\Controllers\Api\BlogavelAdmin\PostController;
use App\Http\Controllers\Api\BlogavelAdmin\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->prefix('blogavel/v1/admin')->group(function () {
    Route::get('posts', [PostController::class, 'index'])->name('blogavel.api.v1.admin.posts.index');
    Route::get('posts/{post}', [PostController::class, 'show'])->whereNumber('post')->name('blogavel.api.v1.admin.posts.show');

    Route::post('posts', [PostController::class, 'store'])->name('blogavel.api.v1.admin.posts.store');
    Route::put('posts/{post}', [PostController::class, 'update'])->whereNumber('post')->name('blogavel.api.v1.admin.posts.update');

    Route::get('categories', [CategoryController::class, 'index'])->name('blogavel.api.v1.admin.categories.index');

    Route::get('tags', [TagController::class, 'index'])->name('blogavel.api.v1.admin.tags.index');

    Route::get('media', [MediaController::class, 'index'])->name('blogavel.api.v1.admin.media.index');
    Route::get('media/{media}', [MediaController::class, 'show'])->whereNumber('media')->name('blogavel.api.v1.admin.media.show');
});
