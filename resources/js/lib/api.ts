import { router } from '@inertiajs/react';

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()!.split(';').shift() ?? null;
    }

    return null;
}

export async function apiFetch<T>(
    input: RequestInfo | URL,
    init: RequestInit = {},
): Promise<T> {
    const headers = new Headers(init.headers ?? {});

    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }

    if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const method = (init.method ?? 'GET').toUpperCase();
    const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (isStateChanging) {
        await fetch('/sanctum/csrf-cookie', { credentials: 'same-origin' });

        const token = getCookie('XSRF-TOKEN');
        if (token) {
            headers.set('X-XSRF-TOKEN', decodeURIComponent(token));
        }

        headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    const response = await fetch(input, {
        ...init,
        headers,
        credentials: 'same-origin',
    });

    if (response.status === 401) {
        router.visit('/login');
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const contentType = response.headers.get('content-type') ?? '';

        if (contentType.includes('application/json')) {
            const json = (await response.json()) as unknown;
            throw json;
        }

        const text = await response.text();
        throw new Error(text || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}
