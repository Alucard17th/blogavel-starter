import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { apiFetch } from '@/lib/api';
import type { BreadcrumbItem } from '@/types';

type Post = {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'scheduled' | 'published';
    published_at: string | null;
    created_at: string | null;
    updated_at: string | null;
};

type Paginated<T> = {
    data: T[];
    links: unknown;
    meta: unknown;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Blog', href: '/dashboard/blogavel/posts' },
    { title: 'Posts', href: '/dashboard/blogavel/posts' },
];

function statusVariant(status: Post['status']): 'secondary' | 'outline' {
    return status === 'published' ? 'secondary' : 'outline';
}

export default function BlogavelPostsIndex() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const res = await apiFetch<Paginated<Post>>(
                '/api/blogavel/v1/admin/posts',
            );
            setPosts(res.data);
        } finally {
            setLoading(false);
        }
    }

    async function destroy(postId: number) {
        // eslint-disable-next-line no-alert
        if (!confirm('Delete this post?')) return;

        await apiFetch(`/api/blogavel/v1/admin/posts/${postId}`, {
            method: 'DELETE',
        });

        await load();
    }

    useEffect(() => {
        void load();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog - Posts" />

            <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Posts"
                        description="Create and manage your blog posts"
                    />

                    <Button asChild>
                        <Link href="/dashboard/blogavel/posts/create">New post</Link>
                    </Button>
                </div>

                <div className="mt-6 overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">
                                    Title
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Published
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        No posts yet.
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="border-t">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {post.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {post.slug}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={statusVariant(post.status)}
                                            >
                                                {post.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {post.published_at ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/dashboard/blogavel/posts/${post.id}/edit`}
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => destroy(post.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
