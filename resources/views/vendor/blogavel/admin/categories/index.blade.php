<h1>Admin - Categories</h1>

<p>
    <a href="{{ route('blogavel.admin.categories.create') }}">Create</a>
</p>

@if ($categories->count() === 0)
    <p>No categories.</p>
@else
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Parent</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($categories as $category)
                <tr>
                    <td>{{ $category->id }}</td>
                    <td>{{ $category->name }}</td>
                    <td>{{ $category->slug }}</td>
                    <td>{{ optional($category->parent)->name }}</td>
                    <td>
                        <a href="{{ route('blogavel.admin.categories.edit', $category) }}">Edit</a>
                        <form method="POST" action="{{ route('blogavel.admin.categories.destroy', $category) }}" style="display:inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $categories->links() }}
@endif
