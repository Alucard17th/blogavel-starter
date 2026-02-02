import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { apiFetch } from '@/lib/api';
import type { BreadcrumbItem } from '@/types';

type Comment = {
    id: number;
    post_id: number;
    content: string;
    status: 'pending' | 'approved' | 'spam';
    guest_name: string | null;
    guest_email: string | null;
    created_at: string | null;
};

type Paginated<T> = {
    data: T[];
    links: unknown;
    meta: unknown;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Blog', href: '/dashboard/blogavel/posts' },
    { title: 'Comments', href: '/dashboard/blogavel/comments' },
];

export default function BlogavelCommentsIndex() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);
        try {
            const res = await apiFetch<Paginated<Comment>>(
                '/api/blogavel/v1/admin/comments',
            );
            setComments(res.data);
        } finally {
            setLoading(false);
        }
    }

    async function approve(id: number) {
        await apiFetch(`/api/blogavel/v1/admin/comments/${id}/approve`, {
            method: 'POST',
        });
        await load();
    }

    async function spam(id: number) {
        await apiFetch(`/api/blogavel/v1/admin/comments/${id}/spam`, {
            method: 'POST',
        });
        await load();
    }

    async function destroy(id: number) {
        // eslint-disable-next-line no-alert
        if (!confirm('Delete this comment?')) return;

        await apiFetch(`/api/blogavel/v1/admin/comments/${id}`, {
            method: 'DELETE',
        });
        await load();
    }

    useEffect(() => {
        void load();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog - Comments" />

            <div className="p-4">
                <Heading
                    title="Comments"
                    description="Moderate comments (approve / spam / delete)"
                />

                <div className="mt-6 overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">
                                    Comment
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Status
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
                                        colSpan={3}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : comments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        No comments.
                                    </td>
                                </tr>
                            ) : (
                                comments.map((c) => (
                                    <tr key={c.id} className="border-t">
                                        <td className="px-4 py-3">
                                            <div className="line-clamp-2 font-medium">
                                                {c.content}
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                {c.guest_name ?? 'User'} · post #{c.post_id}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline">
                                                {c.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => approve(c.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => spam(c.id)}
                                                >
                                                    Spam
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => destroy(c.id)}
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
