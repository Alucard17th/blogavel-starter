<h1>Admin - Posts</h1>

<p>
    <a href="{{ route('blogavel.admin.posts.create') }}">Create</a>
</p>

@if ($posts->count() === 0)
    <p>No posts.</p>
@else
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($posts as $post)
                <tr>
                    <td>{{ $post->id }}</td>
                    <td>{{ $post->title }}</td>
                    <td>{{ $post->status }}</td>
                    <td>
                        <a href="{{ route('blogavel.admin.posts.edit', $post) }}">Edit</a>
                        <form method="POST" action="{{ route('blogavel.admin.posts.destroy', $post) }}" style="display:inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $posts->links() }}
@endif
