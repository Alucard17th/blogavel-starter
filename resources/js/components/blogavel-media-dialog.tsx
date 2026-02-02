import { useEffect, useMemo, useState } from 'react';
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
import { apiFetch } from '@/lib/api';

type Media = {
    id: number;
    url: string;
    mime_type: string;
    size?: number;
};

type Paginated<T> = {
    data: T[];
    links?: {
        next?: string | null;
    };
};

type ValidationError = {
    message?: string;
    errors?: Record<string, string[]>;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedId: number | null;
    onSelect: (media: { id: number; url: string } | null) => void;
};

export function BlogavelMediaDialog({
    open,
    onOpenChange,
    selectedId,
    onSelect,
}: Props) {
    const [items, setItems] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [nextUrl, setNextUrl] = useState<string | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadErrors, setUploadErrors] = useState<Record<string, string[]>>({});

    const imageItems = useMemo(
        () => items.filter((m) => m.mime_type?.startsWith('image/')),
        [items],
    );

    async function loadFirstPage() {
        setLoading(true);
        setLoadError(null);

        try {
            const res = await apiFetch<Paginated<Media>>(
                '/api/blogavel/v1/admin/media',
            );
            setItems(res.data);
            setNextUrl(res.links?.next ?? null);
        } catch (e) {
            const err = e as ValidationError;
            setLoadError(err.message ?? 'Failed to load media');
        } finally {
            setLoading(false);
        }
    }

    async function loadMore() {
        if (!nextUrl) return;

        setLoading(true);
        setLoadError(null);

        try {
            const res = await apiFetch<Paginated<Media>>(nextUrl);
            setItems((prev) => [...prev, ...res.data]);
            setNextUrl(res.links?.next ?? null);
        } catch (e) {
            const err = e as ValidationError;
            setLoadError(err.message ?? 'Failed to load more media');
        } finally {
            setLoading(false);
        }
    }

    async function upload() {
        if (!file) return;

        setUploading(true);
        setUploadErrors({});

        try {
            const form = new FormData();
            form.append('file', file);

            const res = await apiFetch<{ data?: Media }>('/api/blogavel/v1/admin/media', {
                method: 'POST',
                body: form,
            });

            setFile(null);

            if (res?.data?.id && res?.data?.url) {
                setItems((prev) => [res.data as Media, ...prev]);
                onSelect({ id: res.data.id, url: res.data.url });
                onOpenChange(false);
            } else {
                await loadFirstPage();
            }
        } catch (e) {
            const err = e as ValidationError;
            setUploadErrors(err.errors ?? {});
        } finally {
            setUploading(false);
        }
    }

    useEffect(() => {
        if (!open) return;
        setFile(null);
        setUploadErrors({});
        void loadFirstPage();
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Media library</DialogTitle>
                    <DialogDescription>
                        Choose an image or upload a new one.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="grid gap-2 rounded-xl border p-4">
                        <Label htmlFor="media_upload">Upload new image</Label>
                        <Input
                            id="media_upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        <InputError message={uploadErrors.file?.[0]} />

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={upload}
                                disabled={!file || uploading}
                            >
                                Upload
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onSelect(null);
                                    onOpenChange(false);
                                }}
                                disabled={uploading}
                            >
                                Clear selection
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-sm text-muted-foreground">
                            Loading...
                        </div>
                    ) : loadError ? (
                        <div className="text-sm text-destructive">{loadError}</div>
                    ) : imageItems.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                            No images found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                            {imageItems.map((m) => {
                                const selected = selectedId === m.id;
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => {
                                            onSelect({ id: m.id, url: m.url });
                                            onOpenChange(false);
                                        }}
                                        className={
                                            selected
                                                ? 'overflow-hidden rounded-md ring-2 ring-ring'
                                                : 'overflow-hidden rounded-md ring-1 ring-border'
                                        }
                                    >
                                        <img
                                            src={m.url}
                                            alt=""
                                            className="aspect-video w-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {nextUrl ? (
                        <div className="flex justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={loadMore}
                                disabled={loading}
                            >
                                Load more
                            </Button>
                        </div>
                    ) : null}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
