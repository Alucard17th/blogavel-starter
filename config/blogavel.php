<?php

declare(strict_types=1);

return [
    'route_prefix' => 'blogavel',

    'admin_prefix' => 'admin',

    'admin_middleware' => ['web', 'auth'],

    'manage_blog_gate' => false,

    'manage_blog_allow_local' => true,

    'manage_blog_admin_emails' => array_values(array_filter(array_map('trim', explode(',', (string) env('BLOGAVEL_MANAGE_BLOG_ADMIN_EMAILS', ''))))),

    'manage_blog_admin_ids' => array_values(array_filter(array_map('intval', array_filter(array_map('trim', explode(',', (string) env('BLOGAVEL_MANAGE_BLOG_ADMIN_IDS', ''))))))),

    'public_posts_prefix' => 'posts',

    'media_disk' => 'public',

    'media_directory' => 'blogavel',

    'api_admin_auth' => env('BLOGAVEL_API_ADMIN_AUTH', 'sanctum'),

    'api_key_header' => env('BLOGAVEL_API_KEY_HEADER', 'X-API-KEY'),

    'api_keys' => array_values(array_filter(array_map('trim', explode(',', (string) env('BLOGAVEL_API_KEYS', ''))))),
];
