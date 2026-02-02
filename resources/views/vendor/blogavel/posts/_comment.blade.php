<div style="margin-left: {{ $depth * 20 }}px; margin-top: 10px;">
    <div>
        <strong>{{ $comment->authorName() }}</strong>
    </div>
    <div>
        {!! nl2br(e($comment->content)) !!}
    </div>

    <form method="POST" action="{{ route('blogavel.comments.store', $post) }}" style="margin-top: 5px;">
        @csrf
        <input type="hidden" name="parent_id" value="{{ $comment->id }}" />
        <div>
            <label>Reply</label>
            <textarea name="content" rows="3"></textarea>
        </div>
        <div>
            <label>Name (guest)</label>
            <input name="guest_name" />
        </div>
        <div>
            <label>Email (guest)</label>
            <input name="guest_email" />
        </div>
        <button type="submit">Reply</button>
    </form>

    @foreach ($comment->children as $child)
        @include('blogavel::posts._comment', ['comment' => $child, 'post' => $post, 'depth' => $depth + 1])
    @endforeach
</div>
