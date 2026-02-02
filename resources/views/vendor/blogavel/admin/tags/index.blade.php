<h1>Admin - Tags</h1>

<p>
    <a href="{{ route('blogavel.admin.tags.create') }}">Create</a>
</p>

@if ($tags->count() === 0)
    <p>No tags.</p>
@else
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tags as $tag)
                <tr>
                    <td>{{ $tag->id }}</td>
                    <td>{{ $tag->name }}</td>
                    <td>{{ $tag->slug }}</td>
                    <td>
                        <a href="{{ route('blogavel.admin.tags.edit', $tag) }}">Edit</a>
                        <form method="POST" action="{{ route('blogavel.admin.tags.destroy', $tag) }}" style="display:inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $tags->links() }}
@endif
