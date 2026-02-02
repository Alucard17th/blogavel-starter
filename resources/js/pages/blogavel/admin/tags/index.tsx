import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { apiFetch } from '@/lib/api';
import type { BreadcrumbItem } from '@/types';

type Tag = {
    id: number;
    name: string;
    slug: string;
};

type ResourceCollection<T> = { data: T[] };

type ValidationError = {
    message?: string;
    errors?: Record<string, string[]>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Blog', href: '/dashboard/blogavel/posts' },
    { title: 'Tags', href: '/dashboard/blogavel/tags' },
];

export default function BlogavelTagsIndex() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editSlug, setEditSlug] = useState('');
    const [editProcessing, setEditProcessing] = useState(false);
    const [editErrors, setEditErrors] = useState<Record<string, string[]>>({});

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    async function load() {
        setLoading(true);
        try {
            const res = await apiFetch<ResourceCollection<Tag>>(
                '/api/blogavel/v1/admin/tags',
            );
            setTags(res.data);
        } finally {
            setLoading(false);
        }
    }

    async function create() {
        setProcessing(true);
        setErrors({});

        try {
            await apiFetch('/api/blogavel/v1/admin/tags', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    slug: slug || null,
                }),
            });

            setName('');
            setSlug('');
            await load();
        } catch (e) {
            const err = e as ValidationError;
            setErrors(err.errors ?? {});
        } finally {
            setProcessing(false);
        }
    }

    function openEdit(tag: Tag) {
        setEditId(tag.id);
        setEditName(tag.name ?? '');
        setEditSlug(tag.slug ?? '');
        setEditErrors({});
        setEditOpen(true);
    }

    async function update() {
        if (editId === null) return;

        setEditProcessing(true);
        setEditErrors({});

        try {
            await apiFetch(`/api/blogavel/v1/admin/tags/${editId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: editName,
                    slug: editSlug || null,
                }),
            });

            setEditOpen(false);
            setEditId(null);
            await load();
        } catch (e) {
            const err = e as ValidationError;
            setEditErrors(err.errors ?? {});
        } finally {
            setEditProcessing(false);
        }
    }

    async function destroy(tagId: number) {
        // eslint-disable-next-line no-alert
        if (!confirm('Delete this tag?')) return;

        await apiFetch(`/api/blogavel/v1/admin/tags/${tagId}`, {
            method: 'DELETE',
        });

        await load();
    }

    useEffect(() => {
        void load();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog - Tags" />

            <div className="p-4">
                <Heading title="Tags" description="Create and manage tags" />

                <div className="mt-6 grid gap-4 rounded-xl border p-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <InputError message={errors.name?.[0]} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="Leave empty to auto-generate"
                        />
                        <InputError message={errors.slug?.[0]} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            onClick={create}
                            disabled={processing}
                        >
                            Add tag
                        </Button>
                    </div>
                </div>

                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit tag</DialogTitle>
                            <DialogDescription>Update tag name and slug.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_name">Name</Label>
                                <Input
                                    id="edit_name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                                <InputError message={editErrors.name?.[0]} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit_slug">Slug</Label>
                                <Input
                                    id="edit_slug"
                                    value={editSlug}
                                    onChange={(e) => setEditSlug(e.target.value)}
                                    placeholder="Leave empty to auto-generate"
                                />
                                <InputError message={editErrors.slug?.[0]} />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setEditOpen(false)}
                                disabled={editProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={update}
                                disabled={editProcessing}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="mt-6 overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left font-medium">
                                    Slug
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
                            ) : tags.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        No tags yet.
                                    </td>
                                </tr>
                            ) : (
                                tags.map((t) => (
                                    <tr key={t.id} className="border-t">
                                        <td className="px-4 py-3 font-medium">
                                            {t.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {t.slug}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEdit(t)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => destroy(t.id)}
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
