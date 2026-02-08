<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Blogavel\Blogavel\Models\Category;
use Blogavel\Blogavel\Models\Tag;
use Blogavel\Blogavel\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

final class BlogController extends Controller
{
    public function index(Request $request)
    {
        $paginator = Post::query()
            ->with(['featuredMedia', 'author', 'category', 'tags'])
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(10, ['id', 'title', 'slug', 'published_at', 'featured_media_id', 'author_id', 'category_id'])
            ->withQueryString();

        $posts = collect($paginator->items())->map(function (Post $post) {
                $featuredUrl = null;
                if ($post->featuredMedia) {
                    $featuredUrl = Storage::disk($post->featuredMedia->disk)->url($post->featuredMedia->path);
                }

                $authorName = null;
                if ($post->author) {
                    $authorName = $post->author->name ?? null;
                }

                $author = null;
                if ($post->author) {
                    $author = [
                        'id' => $post->author->id ?? null,
                        'name' => $post->author->name ?? null,
                        'email' => $post->author->email ?? null,
                        'created_at' => $post->author->created_at ?? null,
                    ];
                }

                $category = null;
                if ($post->category) {
                    $category = [
                        'id' => $post->category->id,
                        'name' => $post->category->name,
                        'slug' => $post->category->slug,
                    ];
                }

                $tags = $post->tags
                    ? $post->tags->map(function ($tag) {
                        return [
                            'id' => $tag->id,
                            'name' => $tag->name,
                            'slug' => $tag->slug,
                        ];
                    })->values()->all()
                    : [];

                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'published_at' => $post->published_at,
                    'featured_media_url' => $featuredUrl,
                    'author_name' => $authorName,
                    'author' => $author,
                    'category' => $category,
                    'tags' => $tags,
                ];
            })->values();

        $firstWithImage = collect($paginator->items())->first(function (Post $post) {
            return (bool) $post->featuredMedia;
        });

        $ogImage = null;
        if ($firstWithImage && $firstWithImage->featuredMedia) {
            $ogImage = Storage::disk($firstWithImage->featuredMedia->disk)->url($firstWithImage->featuredMedia->path);
        }

        $title = 'Blog';
        $description = 'Product updates, guides, and notes.';
        $canonicalUrl = url('/blog');

        if ($request->wantsJson()) {
            return response()->json([
                'posts' => [
                    'data' => $posts,
                    'meta' => [
                        'current_page' => $paginator->currentPage(),
                        'last_page' => $paginator->lastPage(),
                        'per_page' => $paginator->perPage(),
                        'total' => $paginator->total(),
                        'next_page_url' => $paginator->nextPageUrl(),
                    ],
                ],
            ]);
        }

        return Inertia::render('blog/index', [
            'posts' => [
                'data' => $posts,
                'links' => $paginator->linkCollection(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'next_page_url' => $paginator->nextPageUrl(),
                ],
            ],
            'seo' => [
                'title' => $title,
                'description' => $description,
                'canonical' => $canonicalUrl,
                'og' => [
                    'title' => $title,
                    'description' => $description,
                    'url' => $canonicalUrl,
                    'image' => $ogImage,
                    'type' => 'website',
                ],
            ],
        ]);
    }

    public function show(string $slug)
    {
        $post = Post::query()
            ->with(['featuredMedia', 'author', 'category', 'tags'])
            ->where('status', 'published')
            ->where('slug', $slug)
            ->firstOrFail(['id', 'title', 'slug', 'content', 'published_at', 'featured_media_id', 'author_id', 'category_id']);

        $older = null;
        $newer = null;

        if ($post->published_at) {
            $olderModel = Post::query()
                ->where('status', 'published')
                ->where(function ($q) use ($post) {
                    $q->where('published_at', '<', $post->published_at)
                        ->orWhere(function ($q2) use ($post) {
                            $q2->where('published_at', '=', $post->published_at)
                                ->where('id', '<', $post->id);
                        });
                })
                ->orderByDesc('published_at')
                ->orderByDesc('id')
                ->first(['id', 'title', 'slug', 'published_at']);

            $newerModel = Post::query()
                ->where('status', 'published')
                ->where(function ($q) use ($post) {
                    $q->where('published_at', '>', $post->published_at)
                        ->orWhere(function ($q2) use ($post) {
                            $q2->where('published_at', '=', $post->published_at)
                                ->where('id', '>', $post->id);
                        });
                })
                ->orderBy('published_at')
                ->orderBy('id')
                ->first(['id', 'title', 'slug', 'published_at']);

            if ($olderModel) {
                $older = [
                    'id' => $olderModel->id,
                    'title' => $olderModel->title,
                    'slug' => $olderModel->slug,
                ];
            }

            if ($newerModel) {
                $newer = [
                    'id' => $newerModel->id,
                    'title' => $newerModel->title,
                    'slug' => $newerModel->slug,
                ];
            }
        }

        $featuredUrl = null;
        if ($post->featuredMedia) {
            $featuredUrl = Storage::disk($post->featuredMedia->disk)->url($post->featuredMedia->path);
        }

        $authorName = null;
        if ($post->author) {
            $authorName = $post->author->name ?? null;
        }

        $author = null;
        if ($post->author) {
            $author = [
                'id' => $post->author->id ?? null,
                'name' => $post->author->name ?? null,
                'email' => $post->author->email ?? null,
                'created_at' => $post->author->created_at ?? null,
            ];
        }

        $category = null;
        if ($post->category) {
            $category = [
                'id' => $post->category->id,
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ];
        }

        $tags = $post->tags
            ? $post->tags->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                ];
            })->values()->all()
            : [];

        $title = $post->title;
        $description = Str::limit(trim(strip_tags((string) ($post->content ?? ''))), 160, '');
        if ($description === '') {
            $description = 'Blog post';
        }
        $canonicalUrl = url('/blog/'.$post->slug);

        return Inertia::render('blog/show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'content' => $post->content,
                'published_at' => $post->published_at,
                'featured_media_url' => $featuredUrl,
                'author_name' => $authorName,
                'author' => $author,
                'category' => $category,
                'tags' => $tags,
            ],
            'adjacent' => [
                'older' => $older,
                'newer' => $newer,
            ],
            'seo' => [
                'title' => $title,
                'description' => $description,
                'canonical' => $canonicalUrl,
                'og' => [
                    'title' => $title,
                    'description' => $description,
                    'url' => $canonicalUrl,
                    'image' => $featuredUrl,
                    'type' => 'article',
                ],
            ],
        ]);
    }

    public function category(Request $request, string $slug)
    {
        $category = Category::query()->where('slug', $slug)->firstOrFail(['id', 'name', 'slug']);

        $paginator = Post::query()
            ->with(['featuredMedia', 'author', 'category', 'tags'])
            ->where('status', 'published')
            ->where('category_id', $category->id)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(10, ['id', 'title', 'slug', 'published_at', 'featured_media_id', 'author_id', 'category_id'])
            ->withQueryString();

        $posts = collect($paginator->items())->map(function (Post $post) {
            $featuredUrl = null;
            if ($post->featuredMedia) {
                $featuredUrl = Storage::disk($post->featuredMedia->disk)->url($post->featuredMedia->path);
            }

            $authorName = null;
            if ($post->author) {
                $authorName = $post->author->name ?? null;
            }

            $author = null;
            if ($post->author) {
                $author = [
                    'id' => $post->author->id ?? null,
                    'name' => $post->author->name ?? null,
                    'email' => $post->author->email ?? null,
                    'created_at' => $post->author->created_at ?? null,
                ];
            }

            $cat = null;
            if ($post->category) {
                $cat = [
                    'id' => $post->category->id,
                    'name' => $post->category->name,
                    'slug' => $post->category->slug,
                ];
            }

            $tags = $post->tags
                ? $post->tags->map(function ($tag) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->name,
                        'slug' => $tag->slug,
                    ];
                })->values()->all()
                : [];

            return [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'published_at' => $post->published_at,
                'featured_media_url' => $featuredUrl,
                'author_name' => $authorName,
                'author' => $author,
                'category' => $cat,
                'tags' => $tags,
            ];
        })->values();

        $title = 'Category: '.$category->name;
        $description = 'Posts in '.$category->name;
        $canonicalUrl = url('/blog/category/'.$category->slug);

        if ($request->wantsJson()) {
            return response()->json([
                'posts' => [
                    'data' => $posts,
                    'meta' => [
                        'current_page' => $paginator->currentPage(),
                        'last_page' => $paginator->lastPage(),
                        'per_page' => $paginator->perPage(),
                        'total' => $paginator->total(),
                        'next_page_url' => $paginator->nextPageUrl(),
                    ],
                ],
            ]);
        }

        return Inertia::render('blog/archive', [
            'archive' => [
                'type' => 'category',
                'slug' => $category->slug,
                'name' => $category->name,
            ],
            'posts' => [
                'data' => $posts,
                'links' => $paginator->linkCollection(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'next_page_url' => $paginator->nextPageUrl(),
                ],
            ],
            'seo' => [
                'title' => $title,
                'description' => $description,
                'canonical' => $canonicalUrl,
                'og' => [
                    'title' => $title,
                    'description' => $description,
                    'url' => $canonicalUrl,
                    'image' => null,
                    'type' => 'website',
                ],
            ],
        ]);
    }

    public function tag(Request $request, string $slug)
    {
        $tag = Tag::query()->where('slug', $slug)->firstOrFail(['id', 'name', 'slug']);

        $paginator = Post::query()
            ->with(['featuredMedia', 'author', 'category', 'tags'])
            ->where('status', 'published')
            ->whereHas('tags', function ($q) use ($tag) {
                $q->where('blogavel_tags.id', $tag->id);
            })
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(10, ['id', 'title', 'slug', 'published_at', 'featured_media_id', 'author_id', 'category_id'])
            ->withQueryString();

        $posts = collect($paginator->items())->map(function (Post $post) {
            $featuredUrl = null;
            if ($post->featuredMedia) {
                $featuredUrl = Storage::disk($post->featuredMedia->disk)->url($post->featuredMedia->path);
            }

            $authorName = null;
            if ($post->author) {
                $authorName = $post->author->name ?? null;
            }

            $author = null;
            if ($post->author) {
                $author = [
                    'id' => $post->author->id ?? null,
                    'name' => $post->author->name ?? null,
                    'email' => $post->author->email ?? null,
                    'created_at' => $post->author->created_at ?? null,
                ];
            }

            $cat = null;
            if ($post->category) {
                $cat = [
                    'id' => $post->category->id,
                    'name' => $post->category->name,
                    'slug' => $post->category->slug,
                ];
            }

            $tags = $post->tags
                ? $post->tags->map(function ($tag) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->name,
                        'slug' => $tag->slug,
                    ];
                })->values()->all()
                : [];

            return [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'published_at' => $post->published_at,
                'featured_media_url' => $featuredUrl,
                'author_name' => $authorName,
                'author' => $author,
                'category' => $cat,
                'tags' => $tags,
            ];
        })->values();

        $title = 'Tag: '.$tag->name;
        $description = 'Posts tagged '.$tag->name;
        $canonicalUrl = url('/blog/tag/'.$tag->slug);

        if ($request->wantsJson()) {
            return response()->json([
                'posts' => [
                    'data' => $posts,
                    'meta' => [
                        'current_page' => $paginator->currentPage(),
                        'last_page' => $paginator->lastPage(),
                        'per_page' => $paginator->perPage(),
                        'total' => $paginator->total(),
                        'next_page_url' => $paginator->nextPageUrl(),
                    ],
                ],
            ]);
        }

        return Inertia::render('blog/archive', [
            'archive' => [
                'type' => 'tag',
                'slug' => $tag->slug,
                'name' => $tag->name,
            ],
            'posts' => [
                'data' => $posts,
                'links' => $paginator->linkCollection(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'next_page_url' => $paginator->nextPageUrl(),
                ],
            ],
            'seo' => [
                'title' => $title,
                'description' => $description,
                'canonical' => $canonicalUrl,
                'og' => [
                    'title' => $title,
                    'description' => $description,
                    'url' => $canonicalUrl,
                    'image' => null,
                    'type' => 'website',
                ],
            ],
        ]);
    }
}
