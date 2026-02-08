<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\FeedController;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('blog/category/{slug}', [BlogController::class, 'category'])->name('blog.category');
Route::get('blog/tag/{slug}', [BlogController::class, 'tag'])->name('blog.tag');

Route::get('feed.xml', [FeedController::class, 'rss'])->name('feed.rss');
Route::get('sitemap.xml', [FeedController::class, 'sitemap'])->name('feed.sitemap');

Route::middleware(['auth', 'verified'])->prefix('dashboard/blogavel')->group(function () {
    Route::get('posts', fn () => Inertia::render('blogavel/admin/posts/index'))->name('dashboard.blogavel.posts.index');
    Route::get('posts/create', fn () => Inertia::render('blogavel/admin/posts/create'))->name('dashboard.blogavel.posts.create');
    Route::get('posts/{post}/edit', fn (string $post) => Inertia::render('blogavel/admin/posts/edit', ['postId' => $post]))->name('dashboard.blogavel.posts.edit');

    Route::get('categories', fn () => Inertia::render('blogavel/admin/categories/index'))->name('dashboard.blogavel.categories.index');
    Route::get('tags', fn () => Inertia::render('blogavel/admin/tags/index'))->name('dashboard.blogavel.tags.index');
    Route::get('media', fn () => Inertia::render('blogavel/admin/media/index'))->name('dashboard.blogavel.media.index');
    Route::get('comments', fn () => Inertia::render('blogavel/admin/comments/index'))->name('dashboard.blogavel.comments.index');
});

require __DIR__.'/settings.php';
