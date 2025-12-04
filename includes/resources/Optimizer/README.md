# Kadence Performance Optimizer

A client-side analysis and server-side optimization system that improves Core Web Vitals (LCP, CLS, INP) by intelligently managing image loading, section rendering, and resource hints.

## Overview

The Optimizer works in two phases:

1. **Analysis Phase** (client-side): When a user triggers optimization in wp-admin, JavaScript analyzes the page using `@stellarwp/perf-analyzer-client` to detect critical images, section heights, and optimal image sizes for both desktop and mobile viewports.

2. **Application Phase** (server-side): On subsequent requests, the stored analysis data is used to apply optimizations like proper lazy loading, `content-visibility` for below-the-fold sections, and optimal image `sizes` attributes.

## Architecture

```
Optimizer/
├── Database/           # Custom tables (kb_optimizer, kb_optimizer_viewport_hash)
├── Store/              # Decorator-based storage layer
├── Hash/               # HTML hash comparison for invalidation
├── Image/              # Image processing pipeline
├── Lazy_Load/          # Element & background lazy loading
├── Skip_Rules/         # Conditions to bypass optimization
├── Rest/               # REST API endpoints
├── Response/           # DTOs (WebsiteAnalysis, DeviceAnalysis, ImageAnalysis, etc.)
├── Status/             # Post optimization status tracking
├── Post_List_Table/    # Admin column & bulk actions
└── assets/js/          # Frontend analyzer scripts
```

### Key Design Patterns

- **Provider Pattern**: Each subdomain has a `Provider.php` that registers dependencies
- **Decorator Pattern**: Store layer uses decorators for caching, expiration, exclusion, and status sync
- **Strategy Pattern**: Image processors and skip rules are pluggable

## Enabling the Optimizer

Users enable the optimizer through the **Kadence Blocks Controls** sidebar in the Gutenberg editor:

1. Open any post/page in the block editor
2. Click the Kadence "K" icon in the top toolbar to open **Kadence Blocks Controls**
3. Expand the **Performance Optimizer** panel
4. Toggle **"Globally Enable The Performance Optimizer"**

This saves the `performance_optimizer_enabled` setting to `kadence_blocks_settings` option.

## Store Decorator Chain

The `Store` interface is wrapped in decorators that execute top-to-bottom:

```
Expired_Store_Decorator     ← Filters stale data (isStale = true)
  └─ Cached_Store_Decorator   ← Request-level memoization
       └─ Excluded_Store_Decorator  ← Blocks excluded posts
            └─ Status_Sync_Store_Decorator  ← Syncs post meta status
                 └─ Table_Store  ← Database operations
```

This means:
- Expired data is filtered even from cache
- Excluded posts never receive optimization data
- Post meta status stays in sync with database state

## REST API Endpoints

Base: `/wp-json/kb-optimizer/v1/optimize`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/optimize` | Store analysis data for a post |
| GET | `/optimize` | Retrieve analysis data |
| DELETE | `/optimize` | Remove optimization for a post |
| POST | `/optimize/posts-metadata` | Get metadata for bulk optimization |
| DELETE | `/optimize/bulk/delete` | Bulk remove optimizations |

All endpoints require `edit_post` capability for the target post(s).

## Skip Rules

Optimization is bypassed when any skip rule returns `true`:

| Rule | Condition |
|------|-----------|
| `Optimizer_Request_Rule` | Request has optimizer query params |
| `Ignored_Query_Var_Rule` | Has preview or filtered query vars |
| `Not_Found_Rule` | 404 response |
| `Logged_In_Rule` | User is logged in |
| `Post_Excluded_Rule` | Post marked as excluded |

### Adding Ignored Query Variables

The `Ignored_Query_Var_Rule` skips optimization when specific query parameters are present. Add custom query vars to ignore:

```php
add_filter( 'kadence_blocks_optimizer_rule_skip_query_vars', static fn( array $vars ): array => [
    ...$vars,
    'my_custom_preview',
]);
```

## Image Processing

The `Image_Processor` uses output buffering to modify `<img>` tags:

1. **Lazy_Load_Processor**: Removes `loading="lazy"` from critical (above-fold) images, adds it to below-fold images
2. **Sizes_Attribute_Processor**: Sets optimal `sizes` attribute based on actual rendered dimensions

### Filtering Image Processing

```php
add_filter( 
    'kadence_blocks_optimizer_image_processor', 
    static fn( bool $should, string $src ): bool => $should && ! str_contains( $src, 'logo.png' ),
    10,
    5
);
```

## Section Lazy Loading

Below-the-fold Kadence Row and Column blocks receive `content-visibility: auto` with calculated `contain-intrinsic-size`:

```php
// Exclude specific classes from section lazy loading.
add_filter( 'kadence_blocks_optimizer_section_lazy_load_excluded_classes', static fn( array $classes ): array => [
    ...$classes,
    'my-parallax-section',
]);
```

**Note**: `kt-jarallax` is excluded by default since parallax sections need immediate rendering.

## Hash-Based Invalidation

The system compares HTML hashes on each request to detect content changes:

1. After optimization, hashes are stored for desktop and mobile viewports
2. On subsequent requests, current HTML is hashed and compared
3. If hashes differ, analysis is marked `isStale = true`
4. Stale data is filtered by `Expired_Store_Decorator`, forcing re-optimization

### Triggering Hash Storage

```
?kadence_set_optimizer_hash=1           # Desktop hash
?kadence_set_optimizer_hash=1&kadence_is_mobile=1  # Mobile hash
```

## Post Status Values

Status is stored in post meta (`_kb_optimizer_status`):

| Value | Constant | Description |
|-------|----------|-------------|
| -1 | `EXCLUDED` | User excluded from optimization |
| 0 | `NOT_OPTIMIZED` | No optimization data |
| 1 | `OPTIMIZED` | Active optimization |
| 2 | `STALE` | Outdated, pending re-optimization |

## Actions & Filters Reference

### Actions

```php
// Fired after hash is stored.
do_action( 'kadence_blocks_optimizer_set_hash', $hash, $path, $viewport );

// Fired when optimization data is invalidated.
do_action( 'kadence_blocks_optimizer_data_invalidated', $is_stale, $path );

// Fired after hash check completes.
do_action( 'kadence_blocks_hash_check_complete' );
```

### Filters

```php
// Force enable/disable the entire Optimizer feature, overidding the user's setting.
// Force enable.
add_filter( 'kadence_blocks_optimizer_enabled', '__return_true' );

// Force disable.
add_filter( 'kadence_blocks_optimizer_enabled', '__return_false' );

// Customize skip query vars/
add_filter( 'kadence_blocks_optimizer_rule_skip_query_vars', fn( array $vars ) => $vars );

// Exclude sections from lazy loading.
add_filter( 'kadence_blocks_optimizer_section_lazy_load_excluded_classes', fn( array $classes ) => $classes );

// Control image processing per-image.
add_filter( 'kadence_blocks_optimizer_image_processor', fn( bool $should, $src, $classes, $processor, $path ) => $should, 10, 5 );
```

## Debugging

### Enable Debug Logging

Set `WP_DEBUG` to `true` in `wp-config.php` to enable comprehensive logging via PHP's `error_log()`:

```php
define( 'WP_DEBUG', true );
```

Logs are prefixed with `[Kadence Blocks]:` and written to your PHP error log (location depends on server configuration).

### Check if a page is optimized

Look for the `kb-optimized` class on the `<body>` tag.

### View optimization data

```php
$store = KadenceWP\KadenceBlocks\Container::get( 
    \KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store::class 
);
$path = new \KadenceWP\KadenceBlocks\Optimizer\Path\Path( '/my-page/', $post_id );
$analysis = $store->get( $path );
```

### Preview optimized view

Add `?kadence_optimizer_preview=1` to any URL to see the optimized version regardless of skip rules (logged-in users, etc.).

## Common Issues

### Optimization not applying

1. Check skip rules - logged-in users are skipped by default
2. Verify post is published (drafts can't be optimized)
3. Check if post is excluded (`Status::EXCLUDED`)
4. Look for `isStale = true` in stored analysis

### Content-visibility causing layout shifts

Exclude problematic sections via the filter:

```php
add_filter( 'kadence_blocks_optimizer_section_lazy_load_excluded_classes', static fn( array $classes ): array => [
    ...$classes,
    'my-problematic-section',
]);
```

### Images loading incorrectly

The system uses a queue-based approach for critical images. If the same image appears multiple times, only the first N occurrences (matching the critical images count) are treated as critical.
