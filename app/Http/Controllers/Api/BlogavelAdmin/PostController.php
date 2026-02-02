<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\BlogavelAdmin;

use Blogavel\Blogavel\Http\Resources\PostResource;
use Blogavel\Blogavel\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::query()->with(['category', 'tags', 'featuredMedia'])->orderByDesc('id');

        $status = $request->query('status');
        if (is_string($status) && $status !== '') {
            $query->where('status', $status);
        }

        $posts = $query->paginate(20);

        return PostResource::collection($posts);
    }

    public function show(string $post)
    {
        $model = Post::query()
            ->with(['category', 'tags', 'featuredMedia'])
            ->find($post);

        if (!$model) {
            return response()->json(
                ['message' => 'Post not found'],
                Response::HTTP_NOT_FOUND,
            );
        }

        return new PostResource($model);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:blogavel_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blogavel_posts,slug'],
            'content' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,scheduled,published'],
            'published_at' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:blogavel_tags,id'],
            'featured_media_id' => ['nullable', 'integer', 'exists:blogavel_media,id'],
        ]);

        if (!isset($data['slug']) || $data['slug'] === '') {
            $data['slug'] = Str::slug($data['title']);
        }

        $tagIds = $data['tags'] ?? [];
        unset($data['tags']);

        $post = Post::query()->create($data);

        if (count($tagIds) > 0) {
            $post->tags()->sync($tagIds);
        }

        $post->load(['category', 'tags', 'featuredMedia']);

        return (new PostResource($post))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(Request $request, string $post)
    {
        $model = Post::query()->find($post);

        if (!$model) {
            return response()->json(
                ['message' => 'Post not found'],
                Response::HTTP_NOT_FOUND,
            );
        }

        $data = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:blogavel_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blogavel_posts,slug,'.$model->id],
            'content' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,scheduled,published'],
            'published_at' => ['nullable', 'date'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:blogavel_tags,id'],
            'featured_media_id' => ['nullable', 'integer', 'exists:blogavel_media,id'],
            'remove_featured_media' => ['nullable', 'boolean'],
        ]);

        if (!isset($data['slug']) || $data['slug'] === '') {
            $data['slug'] = Str::slug($data['title']);
        }

        $tagIds = $data['tags'] ?? [];
        unset($data['tags']);

        $removeFeatured = (bool) ($data['remove_featured_media'] ?? false);
        unset($data['remove_featured_media']);

        $model->update($data);
        $model->tags()->sync($tagIds);

        if ($removeFeatured) {
            $model->featured_media_id = null;
            $model->save();
        }

        $model->load(['category', 'tags', 'featuredMedia']);

        return new PostResource($model);
    }
}
