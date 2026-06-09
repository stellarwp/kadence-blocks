# Kadence Concierge — Architecture Brief

**Feature:** Kadence Concierge v1  
**Location:** `includes/resources/Concierge/`  
**Status:** Planning

---

## Overview

Kadence Concierge is a site-audit subsystem that surfaces pre-publish quality issues and ongoing site hygiene problems. It is built as a first-class module inside the existing `includes/resources` DI container architecture.

---

## V1 Scope

### 1. Pre-Publish QA
Checks run against a specific post/page at publish time:
- Broken links (dead `href` anchors in content)
- Unlinked CTAs (buttons with no `href`)
- Oversized images (filesize above configurable threshold)
- Missing alt text (images in post content)
- Missing meta title (SEO title absent)

### 2. Site Hygiene
Checks run against the whole site:
- Missing favicon (`site_icon` option empty)
- Unchanged default tagline (`blogdescription` still set to WordPress default)
- Placeholder content (lorem ipsum detected in published posts)
- Inactive plugins (installed but deactivated)
- Inactive themes (installed but not active)

### 3. Missing Alt Text Detection
`Missing_Alt_Text_Check` operates in two modes controlled by `Check_Context`:
- **Post-scoped** — runs during pre-publish QA against a single post
- **Site-wide** — scans the full media library; callable independently

---

## Directory Structure

```
includes/resources/Concierge/
├── Provider.php                        # Top-level; registers 3 sub-providers
├── Contracts/
│   ├── Check.php                       # Core interface all checks implement
│   ├── Fixable.php                     # Optional: auto-repair capability
│   └── Serializable.php                # REST response contract
├── Check_Context.php                   # Value object: post_id, scope, params
├── Check_Result.php                    # Immutable VO: ::pass() ::warn() ::fail()
├── Check_Status.php                    # Enum: PASS | WARN | FAIL
├── Check_Registry.php                  # Holds all registered checks
├── Check_Runner.php                    # Executes checks, returns Report
├── Report.php                          # Aggregated results collection
├── Exceptions/
│   └── Unknown_Check_Exception.php
├── Pre_Publish/
│   ├── Provider.php
│   ├── Broken_Links_Check.php
│   ├── Unlinked_CTAs_Check.php
│   ├── Oversized_Images_Check.php
│   ├── Missing_Alt_Text_Check.php
│   └── Missing_Meta_Title_Check.php
├── Site_Hygiene/
│   ├── Provider.php
│   ├── Missing_Favicon_Check.php
│   ├── Default_Tagline_Check.php
│   ├── Placeholder_Content_Check.php
│   ├── Inactive_Plugins_Check.php
│   └── Inactive_Themes_Check.php
└── Rest/
    └── V1/
        ├── Provider.php
        ├── Contracts/
        │   └── Controller.php          # Abstract base; namespace kb-concierge/v1
        ├── Run_Checks_Controller.php   # POST /wp-json/kb-concierge/v1/run
        └── Results_Controller.php      # GET  /wp-json/kb-concierge/v1/results/{category}
```

---

## Core Contracts

### `Contracts\Check`
The single interface every check implements.

```php
interface Check {
    public function id(): string;           // e.g. 'broken_links'
    public function label(): string;        // e.g. 'Broken Links'
    public function category(): string;     // 'pre_publish' | 'site_hygiene'
    public function run( Check_Context $context ): Check_Result;
}
```

### `Contracts\Fixable` (optional)
Checks that can auto-repair implement this on top of `Check`.

```php
interface Fixable {
    public function fix( Check_Context $context ): bool;
}
```

---

## Key Classes

### `Check_Status` (Enum)
Uses `myclabs/php-enum` (strauss-prefixed). Provides type-safe status values with `getValue()`, `equals()`, and JSON serialization built in.

```php
final class Check_Status extends Enum {
    private const PASS = 'pass';
    private const WARN = 'warn';
    private const FAIL = 'fail';
}
```

### `Check_Result` (Value Object)
Immutable. Created via named static constructors.

```php
Check_Result::pass( 'broken_links', 'No broken links found.' );
Check_Result::warn( 'oversized_images', '2 images exceed threshold.', $items );
Check_Result::fail( 'missing_favicon', 'No favicon is set.' );
```

### `Check_Context` (Value Object)
Carries runtime inputs to each check.

```php
// Pre-publish (post-scoped)
new Check_Context( scope: 'pre_publish', post_id: 42 );

// Site-wide
new Check_Context( scope: 'site' );
```

### `Check_Registry`
Collects check instances. Exposes a filter hook (`kadence_blocks_concierge_checks`) so third-party code can inject or suppress checks.

```php
public function add( Check $check ): void;
public function has( string $check_id ): bool;
public function get( string $check_id ): Check;         // throws Unknown_Check_Exception
public function all(): array;
public function all_for_category( string $category ): array;
```

### `Check_Runner`
Depends only on the `Check` interface — not on any concrete check class (Dependency Inversion).

```php
public function run_all( Check_Context $context ): Report;
public function run_category( string $category, Check_Context $context ): Report;
public function run_one( string $check_id, Check_Context $context ): Check_Result;
```

### `Report`
Aggregated result of a runner pass.

```php
public function results(): array;           // Check_Result[]
public function has_failures(): bool;
public function for_category( string $cat ): self;
public function to_array(): array;          // REST-serializable
```

---

## REST API

**Base namespace:** `kb-concierge/v1`  
**Capability gate:** `edit_theme_options` (filterable)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/run` | Trigger checks. Body controls scope (see below). |
| `GET`  | `/results/{category}` | Retrieve the last cached report for a category. |

**POST `/run` request body:**

```json
// Run all checks
{}

// Run a category
{ "category": "pre_publish", "post_id": 42 }

// Run a single check
{ "check_id": "broken_links", "post_id": 42 }
```

---

## Provider Registration

`Concierge_Provider` is added to `App.php`'s `$providers` array after `Health_Provider`:

```php
private $providers = [
    // ...
    Health_Provider::class,
    Concierge_Provider::class,   // ← add here
    // ...
];
```

Checks are stateless, so they don't need to be singletons. Always resolve them through the container — but bind with `bind` rather than `singleton` unless a check has a compelling reason to be shared.

```php
// Pre_Publish/Provider.php
public function register(): void {
    $this->container->bind( Broken_Links_Check::class );
    $this->container->bind( Unlinked_CTAs_Check::class );
    $this->container->bind( Oversized_Images_Check::class );
    $this->container->bind( Missing_Alt_Text_Check::class );
    $this->container->bind( Missing_Meta_Title_Check::class );

    add_action( 'init', function() {
        $registry = $this->container->make( Check_Registry::class );
        $registry->add( $this->container->make( Broken_Links_Check::class ) );
        $registry->add( $this->container->make( Unlinked_CTAs_Check::class ) );
        $registry->add( $this->container->make( Oversized_Images_Check::class ) );
        $registry->add( $this->container->make( Missing_Alt_Text_Check::class ) );
        $registry->add( $this->container->make( Missing_Meta_Title_Check::class ) );
    } );
}
```

---

## SOLID Principles

| Principle | How it's applied |
|-----------|-----------------|
| **Single Responsibility** | Each `Check` class does exactly one thing. `Check_Runner` only orchestrates; it never contains check logic. |
| **Open/Closed** | New checks are added by implementing the interface and registering in a provider — no existing class changes. The filter hook extends this to third parties. |
| **Liskov Substitution** | Any `Check` implementation can be passed to the runner without special-casing. |
| **Interface Segregation** | `Fixable` is a separate optional interface — checks that can't auto-repair don't implement it. |
| **Dependency Inversion** | `Check_Runner` depends on `Contracts\Check`, not on any concrete check. |

---

## New Dependency

**`myclabs/php-enum`** must be added to `composer.json` and processed by strauss.

```bash
composer require myclabs/php-enum
composer exec strauss
```

Strauss prefixes it to `KadenceWP\KadenceBlocks\MyCLabs\Enum\Enum` — consistent with all other vendor dependencies in the project.

---

## Testing Strategy

All tests live under `tests/` following existing project conventions.

| Test type | What it covers |
|-----------|---------------|
| **Unit** | Each `Check` in isolation with mocked WP functions. Verifies correct `Check_Result` status and `items` for pass/warn/fail scenarios. |
| **Unit** | `Check_Registry` — add, get, has, unknown ID exception, category filtering. |
| **Unit** | `Check_Runner` — delegates correctly to registry; `run_one` returns single result; `run_all` aggregates into Report. |
| **Integration** | Runner + Registry wired together via container. Uses WP test factory to create posts with known issues. |
| **Snapshot** | `Report::to_array()` and REST response shape — exact format locked against regression. |

---

## Open Questions

1. Should check results be persisted (e.g. cached in a transient or custom table) so `Results_Controller` can serve the last run without re-running? Or always run on demand?
2. Configurable thresholds (e.g. oversized image size limit) — stored in `wp_options` or passed via `Check_Context`?
3. Should pre-publish checks block publishing (hard gate) or show warnings without blocking (soft gate)?
4. v2 scope: auto-fix via `Fixable` interface — worth noting in provider stubs now so the extension point exists.
