import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { apiFetch } from '@/lib/api';
import type { BreadcrumbItem } from '@/types';

type Media = {
    id: number;
    url: string;
    mime_type: string;
    size: number;
    created_at: string | null;
};

type Paginated<T> = {
    data: T[];
    links: unknown;
    meta: unknown;
};

type ValidationError = {
    message?: string;
    errors?: Record<string, string[]>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Blog', href: '/dashboard/blogavel/posts' },
    { title: 'Media', href: '/dashboard/blogavel/media' },
];

export default function BlogavelMediaIndex() {
    const [items, setItems] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);

    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    async function load() {
        setLoading(true);
        try {
            const res = await apiFetch<Paginated<Media>>(
                '/api/blogavel/v1/admin/media',
            );
            setItems(res.data);
        } finally {
            setLoading(false);
        }
    }

    async function upload() {
        setProcessing(true);
        setErrors({});

        try {
            if (!file) return;

            const form = new FormData();
            form.append('file', file);

            await apiFetch('/api/blogavel/v1/admin/media', {
                method: 'POST',
                body: form,
            });

            setFile(null);
            await load();
        } catch (e) {
            const err = e as ValidationError;
            setErrors(err.errors ?? {});
        } finally {
            setProcessing(false);
        }
    }

    async function destroy(mediaId: number) {
        // eslint-disable-next-line no-alert
        if (!confirm('Delete this media item?')) return;

        await apiFetch(`/api/blogavel/v1/admin/media/${mediaId}`, {
            method: 'DELETE',
        });

        await load();
    }

    useEffect(() => {
        void load();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog - Media" />

            <div className="p-4">
                <Heading
                    title="Media"
                    description="Upload and manage images"
                />

                <div className="mt-6 grid gap-4 rounded-xl border p-4">
                    <div className="grid gap-2">
                        <Label htmlFor="file">Image</Label>
                        <Input
                            id="file"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFile(e.target.files?.[0] ?? null)
                            }
                        />
                        <InputError message={errors.file?.[0]} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            onClick={upload}
                            disabled={processing || !file}
                        >
                            Upload
                        </Button>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {loading ? (
                        <div className="text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                            No media uploaded yet.
                        </div>
                    ) : (
                        items.map((m) => (
                            <div
                                key={m.id}
                                className="overflow-hidden rounded-xl border"
                            >
                                <div className="aspect-video bg-muted/30">
                                    <img
                                        src={m.url}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-3">
                                    <div className="text-xs text-muted-foreground">
                                        {m.mime_type} · {Math.round(m.size / 1024)}KB
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => destroy(m.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
