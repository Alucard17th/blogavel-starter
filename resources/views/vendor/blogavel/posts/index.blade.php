<h1>Posts</h1>

@if ($posts->count() === 0)
    <p>No posts.</p>
@else
    <ul>
        @foreach ($posts as $post)
            <li>
                <a href="{{ route('blogavel.posts.show', $post) }}">{{ $post->title }}</a>
            </li>
        @endforeach
    </ul>

    {{ $posts->links() }}
@endif
