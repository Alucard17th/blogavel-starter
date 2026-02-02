<h1>Admin - Comments</h1>

@if ($comments->count() === 0)
    <p>No comments.</p>
@else
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Post</th>
                <th>Author</th>
                <th>Status</th>
                <th>Content</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($comments as $comment)
                <tr>
                    <td>{{ $comment->id }}</td>
                    <td>{{ $comment->post_id }}</td>
                    <td>{{ $comment->authorName() }}</td>
                    <td>{{ $comment->status }}</td>
                    <td>{{ $comment->content }}</td>
                    <td>
                        <form method="POST" action="{{ route('blogavel.admin.comments.approve', $comment) }}" style="display:inline">
                            @csrf
                            <button type="submit">Approve</button>
                        </form>
                        <form method="POST" action="{{ route('blogavel.admin.comments.spam', $comment) }}" style="display:inline">
                            @csrf
                            <button type="submit">Spam</button>
                        </form>
                        <form method="POST" action="{{ route('blogavel.admin.comments.destroy', $comment) }}" style="display:inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $comments->links() }}
@endif
