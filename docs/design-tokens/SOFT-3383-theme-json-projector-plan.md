# SOFT-3383 — Theme_Json_Projector implementation plan

> Linear: https://linear.app/nexcess/issue/SOFT-3383/theme-json-projector
> Design doc §8A
> Parent: SOFT-3362 · Project: Design System · Label: Design Tokens

## 1. Goal

Add a **`Theme_Json` projector** to the Design Tokens module that injects the
registered tokens into WordPress's `theme.json` pipeline so the Site Editor
displays them as native presets (color palette, font families, spacing sizes,
shadow presets).

The defining constraint: **preset values are CSS variables, not literals.**

```php
// settings.color.palette.theme entry
[
    'slug'  => 'button-bg',
    'name'  => 'Button Background',
    'color' => 'var(--kb-token--semantic--color--button-bg)', // <- var, not "#0073aa"
]
```

Because the preset points at the token variable (the same `--kb-token--*`
variable the `Css_Var` projector already emits, bridged to `--wp--preset--*`),
the Site Editor shows the preset *and* changing a token value updates every
consumer without rewriting `theme.json`.

### Mapping (DTCG type / `wp_preset` category → theme.json bucket)

| `wp_preset` category | theme.json path                       | value key    |
|----------------------|---------------------------------------|--------------|
| `color`              | `settings.color.palette.theme`        | `color`      |
| `font-family`        | `settings.typography.fontFamilies.theme` | `fontFamily` |
| `spacing`            | `settings.spacing.spacingSizes`       | `size`       |
| `shadow`             | `settings.shadow.presets`             | `shadow`     |

**Radius** (a `dimension` token) has no native theme.json preset bucket, so it
is intentionally *not* projected here — it surfaces only as a custom
`--kb-token--*` variable and via block bindings. A radius token simply does not
declare a `wp_preset` projection (or declares one with a category we do not map),
so the projector skips it.

### Behavioral requirements (from the issue)

1. Hook **both** `wp_theme_json_data_default` and `wp_theme_json_data_theme`,
   mutating via `$theme_json->update_with([...])` — the same mechanism KB uses
   in `class-kadence-blocks-settings.php::load_color_palette_theme_json()`.
2. Preset values are CSS vars (`var(--kb-token--…)`), never literals.
3. **Early-bail fast** when no token declares a `wp_preset` projection.
4. The derived preset array is **built once** from a Resolver snapshot and
   **cached on the store version** (mirroring `Css_Builder::css_for_version()`).
5. Gated on `Token_Registry::is_active()` so a deactivated/degraded registry
   leaves KB's existing `theme.json` behavior untouched.

---

## 2. What already exists (reuse, don't reinvent)

PR #1017 (`SOFT-3382`, merged) shipped the `Css_Var` projector and the
projection scaffolding. We mirror its structure exactly.

```
includes/resources/Design_Tokens/
├── Projection/
│   ├── Provider.php                 # boots per-target providers (PROVIDERS array)
│   └── Css_Var/
│       ├── Css_Builder.php          # PURE builder; css_for_version() cached on version
│       ├── Projector.php            # WP-facing; gated on is_active(); try/catch RuntimeException
│       ├── Legacy_Filter_Bridge.php
│       ├── Provider.php             # singletons + add_filter/add_action wiring
│       └── Wp_Preset_Var.php        # Wp_Preset_Var::from(category, slug) => --wp--preset--cat--slug
├── Registry/
│   ├── Token_Registry.php           # by_projection('wp_preset'), is_active(), get()
│   ├── Token_Definition.php         # ->id, ->type, ->label, ->css_var, ->projections, has_projection()
│   └── Css_Var.php                  # Css_Var::from_id() => --kb-token--*
├── Resolver/
│   ├── Token_Resolver.php           # resolve(): Resolved_Tokens  (throws RuntimeException subclasses)
│   └── Resolved_Tokens.php          # by_id(), by_var(), value(string $id): ?string
└── Database/
    └── Token_Store.php              # get_version(string $slug = 'default'): string
```

Key facts we depend on:

- **`Token_Registry::by_projection('wp_preset')`** → `array<string id, Token_Definition>`
  of exactly the tokens we project. Empty array ⇒ early bail.
- **`Token_Definition::$projections['wp_preset']`** is either a bare category
  string (`'color'`) or `['category' => 'color', 'slug' => 'btn']`.
- **`Token_Definition::$css_var`** is the canonical `--kb-token--*` name we wrap
  in `var(...)`.
- **`Resolved_Tokens::value($id)`** → the resolved CSS value (used only to skip
  tokens with no/empty value — we emit the *var*, not this).
- **`Token_Store::get_version()`** → cache-busting hash, bumped on every write.
- **`Token_Resolver::resolve()`** can throw `RuntimeException` (alias cycle /
  dangling alias from a raw DB write) — must be caught so we degrade, not fatal.

### ⚠️ Slug/category derivation must not drift from `Css_Var`

`Css_Builder` already derives `(category, slug)` from a token's `wp_preset`
config in two private methods:

```php
// includes/resources/Design_Tokens/Projection/Css_Var/Css_Builder.php:205
private function preset_target( Token_Definition $token, string $id ): array { … }
// :232
private function slug_from_id( string $id ): string { … }
```

The theme.json preset `slug` **must** equal the `slug` segment that
`Css_Builder` feeds into `Wp_Preset_Var::from($category, $slug)`. If the two
projectors derive the slug differently, the editor swatch (theme.json preset)
and the `--wp--preset--color--<slug>: var(--kb-token--…)` bridge declaration
point at different names and the preset resolves to nothing.

**Decision:** extract that derivation into one shared value object both
projectors consume (Phase 1), instead of duplicating it. This is the cleanest
way to guarantee they never diverge.

---

## 3. Phasing

Split so each PR stays roughly within 300–400 changed lines and is reviewable
in isolation. Phases are sequential (each builds on the prior).

| Phase | PR | Scope | Est. changed lines |
|-------|----|-------|--------------------|
| 1 | Shared preset-target helper | Extract `(category, slug)` derivation into `Projection\Wp_Preset_Target`; refactor `Css_Var\Css_Builder` to use it. No behavior change. | ~160 (incl. tests) |
| 2 | Theme_Json builder (pure) | `Theme_Json\Theme_Json_Builder` + unit + snapshot tests. No WP wiring yet. | ~330 (incl. tests) |
| 3 | Theme_Json projector + wiring | `Theme_Json\Projector`, `Theme_Json\Provider`, register in `Projection\Provider`; integration tests. | ~300 (incl. tests) |

If Phase 1 is deemed unnecessary overhead by reviewers, it can be folded into
Phase 2 by having `Theme_Json_Builder` import a `public static` derivation from
`Css_Builder` — but the standalone value object is recommended for testability
and to keep `Css_Builder` from growing a public surface.

> All new files use `declare( strict_types=1 )`, the
> `KadenceWP\KadenceBlocks\Design_Tokens\…` namespace, `@since TBD` docblocks,
> and American spelling (cspell CI gate). Run `composer phpcs` and
> `npx cspell` on changed files before pushing.

---

## 4. Phase 1 — Shared `Wp_Preset_Target` value object

### 4.1 New file: `Projection/Wp_Preset_Target.php`

A pure value object: given a `Token_Definition` (or a raw `wp_preset` config +
id), produce a normalized `(category, slug)` pair, or signal "skip". This is the
single source of truth for how a `wp_preset` projection maps to a preset
identity, consumed by **both** `Css_Var\Css_Builder` and
`Theme_Json\Theme_Json_Builder`.

```php
<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;

/**
 * Normalizes a token's "wp_preset" projection config into a (category, slug) pair.
 *
 * The category becomes the "<category>" segment of the WordPress preset variable
 * (--wp--preset--<category>--<slug>) and selects the theme.json bucket; the slug is the
 * preset's identifier within that bucket. Both the Css_Var bridge and the Theme_Json
 * projector resolve through this one class so the preset variable they emit and the
 * theme.json preset slug can never drift apart.
 *
 * The projection config is either a bare category string (slug derived from the token id's
 * last dot-segment) or an explicit ['category' => …, 'slug' => …] array for the rare case
 * the slug must differ from the id segment:
 *
 *   'wp_preset' => 'color'                                 // semantic.color.button-bg => (color, button-bg)
 *   'wp_preset' => ['category' => 'color', 'slug' => 'btn'] // => (color, btn)
 *
 * @since TBD
 */
final class Wp_Preset_Target {

	/**
	 * The projection key a token declares to opt into preset projection.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public const PROJECTION = 'wp_preset';

	/**
	 * @since TBD
	 *
	 * @var string
	 */
	public string $category;

	/**
	 * @since TBD
	 *
	 * @var string
	 */
	public string $slug;

	/**
	 * @param string $category Preset category, e.g. "color", "font-family", "spacing", "shadow".
	 * @param string $slug     Preset slug, e.g. "button-bg".
	 */
	private function __construct( string $category, string $slug ) {
		$this->category = $category;
		$this->slug     = $slug;
	}

	/**
	 * Resolve a token's wp_preset config to a target, or null when the token does not declare a
	 * usable wp_preset projection (so callers skip it).
	 *
	 * @since TBD
	 *
	 * @param Token_Definition $token The token definition.
	 *
	 * @return self|null
	 */
	public static function from_token( Token_Definition $token ): ?self {
		if ( ! $token->has_projection( self::PROJECTION ) ) {
			return null;
		}

		$config = $token->projections[ self::PROJECTION ] ?? null;

		if ( is_string( $config ) && $config !== '' ) {
			return new self( $config, self::slug_from_id( $token->id ) );
		}

		if ( is_array( $config ) && isset( $config['category'] ) && is_string( $config['category'] ) && $config['category'] !== '' ) {
			$slug = isset( $config['slug'] ) && is_string( $config['slug'] ) && $config['slug'] !== ''
				? $config['slug']
				: self::slug_from_id( $token->id );

			return new self( $config['category'], $slug );
		}

		return null;
	}

	/**
	 * The last dot-segment of a token id, used as the default preset slug.
	 *
	 * Example: semantic.color.button-bg => button-bg
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return string
	 */
	public static function slug_from_id( string $id ): string {
		$pos = strrpos( $id, '.' );

		return $pos === false ? $id : substr( $id, $pos + 1 );
	}
}
```

### 4.2 Refactor `Css_Var/Css_Builder.php`

Replace the private `preset_target()` / `slug_from_id()` logic with the shared
value object. The behavior is identical; this only removes the duplication.

```php
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Wp_Preset_Target;

// …

private function preset_block( Resolved_Tokens $resolved ): string {
	$declarations = '';

	foreach ( $this->registry->by_projection( Wp_Preset_Target::PROJECTION ) as $id => $token ) {
		$value = $resolved->value( $id );
		if ( $value === null || $value === '' ) {
			continue;
		}

		$target = Wp_Preset_Target::from_token( $token );
		if ( $target === null ) {
			continue;
		}

		$preset        = Wp_Preset_Var::from( $target->category, $target->slug );
		$declarations .= $preset . ':var(' . $token->css_var . ');';
	}

	return $declarations === '' ? '' : self::SCOPE . '{' . $declarations . '}';
}
```

Then delete the now-unused `preset_target()`, `slug_from_id()`, and the
`private const WP_PRESET = 'wp_preset';` (replaced by
`Wp_Preset_Target::PROJECTION`). Keep `by_projection( Wp_Preset_Target::PROJECTION )`.

### 4.3 Tests (Phase 1)

- `tests/wpunit/Resources/Design_Tokens/Projection/Wp_Preset_TargetTest.php`
  - bare-string config → `(category, slug-from-id)`
  - array config with explicit slug → `(category, slug)`
  - array config without slug → `(category, slug-from-id)`
  - token without `wp_preset` → `null`
  - malformed config (empty string / array missing `category`) → `null`
  - `slug_from_id()` with and without a dot.
- Re-run the existing `Css_Var` builder + snapshot tests to confirm **no output
  change** (this phase is a pure refactor).

---

## 5. Phase 2 — `Theme_Json_Builder` (pure)

A pure builder with no WordPress calls and no globals, mirroring `Css_Builder`.
It produces the `update_with()` payload array from a `Resolved_Tokens` snapshot
and is cached per store version.

### 5.1 New file: `Projection/Theme_Json/Theme_Json_Builder.php`

```php
<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Wp_Preset_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;

/**
 * Builds the theme.json "settings" payload that surfaces design tokens as native WordPress
 * presets — color palette, font families, spacing sizes, shadow presets.
 *
 * Every preset value is a CSS variable pointing at the token's --kb-token--* variable, never the
 * literal value, so the Site Editor displays the preset and a token change updates all consumers
 * without rewriting theme.json. The variable target is identical to the --wp--preset--*: var(...)
 * bridge the Css_Var projector emits, so the editor swatch and the preset variable agree.
 *
 * Pure: no WordPress calls, no globals, no side effects. WordPress wiring lives in Projector.
 *
 * @since TBD
 */
final class Theme_Json_Builder {

	/**
	 * theme.json schema version the payload targets.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private const VERSION = 2;

	/**
	 * Object-cache group shared with the resolver and the Css_Var builder.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * Maps a wp_preset category to the theme.json settings path and the per-entry value key.
	 *
	 * 'path'      => dot-path under "settings" where the preset list lives.
	 * 'value_key' => the key on each preset entry that carries the value (alongside slug/name).
	 *
	 * Categories absent from this map (e.g. a radius token's "radius") are skipped: they have no
	 * native theme.json preset bucket and surface only as custom vars / block bindings.
	 *
	 * @since TBD
	 *
	 * @var array<string, array{path: string[], value_key: string}>
	 */
	private const BUCKETS = [
		'color'       => [ 'path' => [ 'color', 'palette' ],            'value_key' => 'color' ],
		'font-family' => [ 'path' => [ 'typography', 'fontFamilies' ],  'value_key' => 'fontFamily' ],
		'spacing'     => [ 'path' => [ 'spacing', 'spacingSizes' ],     'value_key' => 'size' ],
		'shadow'      => [ 'path' => [ 'shadow', 'presets' ],           'value_key' => 'shadow' ],
	];

	/**
	 * Buckets that nest their list under a "theme" origin key (color.palette.theme,
	 * typography.fontFamilies.theme). Spacing sizes and shadow presets are flat lists.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const THEME_ORIGIN = [ 'color', 'font-family' ];

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Per-request memo keyed on the store version, so a write (which bumps the version)
	 * invalidates the in-memory result without an explicit purge.
	 *
	 * @var array<string, array<string, mixed>>
	 */
	private array $memo = [];

	/**
	 * @param Token_Registry $registry
	 */
	public function __construct( Token_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Whether any token declares a wp_preset projection — the early-bail gate.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_presets(): bool {
		return $this->registry->by_projection( Wp_Preset_Target::PROJECTION ) !== [];
	}

	/**
	 * The update_with() payload for the resolved set: a version-2 document carrying only the
	 * "settings" presets derived from tokens. Returns an empty array when there is nothing to
	 * project, so the caller can skip update_with() entirely.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 *
	 * @return array<string, mixed>
	 */
	public function payload( Resolved_Tokens $resolved ): array {
		$settings = $this->settings( $resolved );

		if ( $settings === [] ) {
			return [];
		}

		return [
			'version'  => self::VERSION,
			'settings' => $settings,
		];
	}

	/**
	 * Cached variant of payload(): memoized per request and persisted in the object cache keyed on
	 * the plugin version + store version, exactly like Css_Builder::css_for_version(). The plugin
	 * version is folded in because the derived presets depend on shipped declarations and the
	 * baseline, which change with a build, not only on stored overrides.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved set (already version-correct from the resolver).
	 * @param string          $version  The store version the resolved set was built from.
	 *
	 * @return array<string, mixed>
	 */
	public function payload_for_version( Resolved_Tokens $resolved, string $version ): array {
		if ( isset( $this->memo[ $version ] ) ) {
			return $this->memo[ $version ];
		}

		$cache_key = 'theme_json_presets_' . KADENCE_BLOCKS_VERSION . '_' . $version;
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_array( $cached ) ) {
			return $this->memo[ $version ] = $cached;
		}

		$payload = $this->payload( $resolved );

		wp_cache_set( $cache_key, $payload, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $version ] = $payload;
	}

	/**
	 * Build the "settings" sub-tree: one preset list per non-empty bucket.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 *
	 * @return array<string, mixed>
	 */
	private function settings( Resolved_Tokens $resolved ): array {
		// Group preset entries by category first, then assemble the nested settings tree.
		$by_category = [];

		foreach ( $this->registry->by_projection( Wp_Preset_Target::PROJECTION ) as $id => $token ) {
			$target = Wp_Preset_Target::from_token( $token );
			if ( $target === null || ! isset( self::BUCKETS[ $target->category ] ) ) {
				continue; // Unmapped category (e.g. radius) — no native bucket; skip.
			}

			// Skip tokens with no resolvable value: an empty preset would render to nothing.
			$value = $resolved->value( $id );
			if ( $value === null || $value === '' ) {
				continue;
			}

			$by_category[ $target->category ][] = $this->preset_entry( $token, $target );
		}

		$settings = [];

		foreach ( $by_category as $category => $entries ) {
			$bucket = self::BUCKETS[ $category ];
			$leaf   = in_array( $category, self::THEME_ORIGIN, true )
				? array_merge( $bucket['path'], [ 'theme' ] )
				: $bucket['path'];

			$settings = $this->set_path( $settings, $leaf, $entries );
		}

		return $settings;
	}

	/**
	 * Build a single preset entry: slug + name + the value key carrying var(--kb-token--*).
	 *
	 * @since TBD
	 *
	 * @param Token_Definition  $token  The token.
	 * @param Wp_Preset_Target  $target The resolved (category, slug).
	 *
	 * @return array<string, string>
	 */
	private function preset_entry( Token_Definition $token, Wp_Preset_Target $target ): array {
		$value_key = self::BUCKETS[ $target->category ]['value_key'];

		return [
			'slug'       => $target->slug,
			'name'       => $token->label,
			$value_key   => 'var(' . $token->css_var . ')',
		];
	}

	/**
	 * Set a value at a dot-path inside a nested array, creating intermediate arrays.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $tree  The tree to write into.
	 * @param string[]             $path  The path segments.
	 * @param mixed                $value The value to set at the leaf.
	 *
	 * @return array<string, mixed>
	 */
	private function set_path( array $tree, array $path, $value ): array {
		$cursor = &$tree;
		foreach ( $path as $segment ) {
			if ( ! isset( $cursor[ $segment ] ) || ! is_array( $cursor[ $segment ] ) ) {
				$cursor[ $segment ] = [];
			}
			$cursor = &$cursor[ $segment ];
		}
		$cursor = $value;

		return $tree;
	}
}
```

> **Note on `name`:** the token `label` is already translated at declaration
> time via `__()` (see `declarations.php`), so we pass it straight through.

### 5.2 Tests (Phase 2)

- `tests/wpunit/Resources/Design_Tokens/Projection/Theme_Json/Theme_Json_BuilderTest.php`
  - `has_presets()` true when a `wp_preset` token exists, false otherwise.
  - color token → `settings.color.palette.theme` entry with
    `color => 'var(--kb-token--…)'` and correct `slug`/`name`.
  - font-family / spacing / shadow each land in the right bucket with the right
    value key (`fontFamily` / `size` / `shadow`); spacing & shadow are flat
    (no `theme` origin key).
  - a `dimension` token whose category is `radius` (unmapped) is **omitted**.
  - a token whose resolved value is empty/`null` is **omitted**.
  - explicit `['category'=>…, 'slug'=>…]` config honored.
  - `payload()` returns `[]` when nothing projects; otherwise wraps `settings`
    in `version => 2`.
  - `payload_for_version()` caches: second call with same version does not
    rebuild (assert via a spy registry or by asserting `wp_cache_get` hit).
- `tests/snapshot/Resources/Design_Tokens/Projection/Theme_Json/Theme_Json_Builder_SnapshotTest.php`
  - full payload for the shipped baseline declarations, snapshotted (mirrors
    `Css_Builder_SnapshotTest`).

---

## 6. Phase 3 — `Theme_Json\Projector` + wiring

### 6.1 New file: `Projection/Theme_Json/Projector.php`

WordPress-facing. One callback registered on both filters. Gated on
`is_active()`, early-bails when no `wp_preset` tokens, catches `RuntimeException`
from the resolver, and **merges** token presets onto any presets already present
in the incoming `theme.json` (so we add to, never clobber, the active theme's
palette / KB's existing `kadence_blocks_colors` injection).

```php
<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use RuntimeException;
use WP_Theme_JSON_Data;

/**
 * Projects the resolved token set into the WordPress theme.json pipeline so tokens surface as
 * native presets in the Site Editor (color palette, font families, spacing sizes, shadow presets).
 *
 * Hooks both wp_theme_json_data_default and wp_theme_json_data_theme and mutates via
 * $theme_json->update_with([...]) — the same mechanism KB uses in class-kadence-blocks-settings.php.
 * Every preset value is a CSS variable (var(--kb-token--*)), so changing a token updates all
 * presets without rewriting theme.json. Gated on Token_Registry::is_active() and on at least one
 * token declaring a wp_preset projection, so an inactive or preset-free registry is a no-op.
 *
 * @since TBD
 */
final class Projector {

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Theme_Json_Builder
	 */
	private Theme_Json_Builder $builder;

	/**
	 * @param Token_Registry     $registry
	 * @param Token_Resolver     $resolver
	 * @param Token_Store        $store
	 * @param Theme_Json_Builder $builder
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Resolver $resolver,
		Token_Store $store,
		Theme_Json_Builder $builder
	) {
		$this->registry = $registry;
		$this->resolver = $resolver;
		$this->store    = $store;
		$this->builder  = $builder;
	}

	/**
	 * Inject token presets into a theme.json data object. Bound to both
	 * wp_theme_json_data_default and wp_theme_json_data_theme.
	 *
	 * Bails fast (returns the object untouched) when projection is inactive or no token declares a
	 * wp_preset projection — the issue's "filter bails fast when no tokens declare wp_preset".
	 *
	 * @since TBD
	 *
	 * @param WP_Theme_JSON_Data $theme_json The theme.json data object.
	 *
	 * @return WP_Theme_JSON_Data
	 */
	public function inject( WP_Theme_JSON_Data $theme_json ): WP_Theme_JSON_Data {
		if ( ! $this->registry->is_active() || ! $this->builder->has_presets() ) {
			return $theme_json;
		}

		$payload = $this->payload();
		if ( $payload === [] ) {
			return $theme_json;
		}

		$theme_json->update_with( $this->merge_existing( $theme_json, $payload ) );

		return $theme_json;
	}

	/**
	 * Build the cached preset payload from the current resolved set. Returns an empty array when the
	 * stored document cannot be resolved (alias cycle / dangling alias from a raw DB write that
	 * bypassed REST validation), so theme.json is left untouched rather than fatalling the request.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function payload(): array {
		try {
			$version  = $this->store->get_version();
			$resolved = $this->resolver->resolve();
		} catch ( RuntimeException $e ) {
			return [];
		}

		return $this->builder->payload_for_version( $resolved, $version );
	}

	/**
	 * Merge the token preset lists onto whatever the incoming theme.json already declares, so we add
	 * to — never replace — the active theme's palette and KB's existing kadence_blocks_colors
	 * injection. update_with() replaces list-valued leaves wholesale, so we read the existing list,
	 * append the token entries (skipping slug collisions, existing wins), and hand back the union.
	 *
	 * @since TBD
	 *
	 * @param WP_Theme_JSON_Data   $theme_json The incoming data object.
	 * @param array<string, mixed> $payload    The token preset payload from the builder.
	 *
	 * @return array<string, mixed> The payload with each preset list merged onto the existing one.
	 */
	private function merge_existing( WP_Theme_JSON_Data $theme_json, array $payload ): array {
		$data = $theme_json->get_data();

		foreach ( $this->preset_leaves( $payload['settings'] ?? [] ) as $path ) {
			$existing = $this->get_path( $data, array_merge( [ 'settings' ], $path ) );
			$tokens   = $this->get_path( $payload, array_merge( [ 'settings' ], $path ) );

			if ( ! is_array( $existing ) || $existing === [] ) {
				continue; // Nothing to merge with; the builder's list stands as-is.
			}

			$existing_slugs = array_column( $existing, 'slug' );
			$additions      = array_filter(
				$tokens,
				static function ( array $entry ) use ( $existing_slugs ): bool {
					return ! in_array( $entry['slug'] ?? null, $existing_slugs, true );
				}
			);

			$payload = $this->set_path(
				$payload,
				array_merge( [ 'settings' ], $path ),
				array_merge( array_values( $existing ), array_values( $additions ) )
			);
		}

		return $payload;
	}

	// get_path() / set_path() / preset_leaves() are small array helpers — see Phase 3 notes.
}
```

> **Implementation note:** `get_path()` / `set_path()` are the read/write
> mirror of the builder's `set_path()`; `preset_leaves()` returns the list of
> preset leaf paths actually present in the payload (e.g.
> `[['color','palette','theme'], ['spacing','spacingSizes']]`). Keep these
> private and tiny. If `merge_existing()` pushes the file past the line budget,
> the read/write path helpers can move into a shared `Projection\Array_Path`
> utility — but inline-private is fine for one consumer.
>
> **Simpler alternative if merge is contentious:** the issue text does not
> strictly require merging with the theme's own palette — `wp_theme_json_data_*`
> + `update_with()` on a list leaf replaces that leaf. If product wants tokens
> to *add to* the theme palette (recommended, matches
> `load_color_palette_theme_json`'s merge mode), keep `merge_existing()`. If
> tokens should be the sole KB-managed presets, drop it and call
> `update_with($payload)` directly. **Recommendation: keep the merge.** Flag
> this for product confirmation in the PR description.

### 6.2 New file: `Projection/Theme_Json/Provider.php`

```php
<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the theme.json projector: binds the builder and projector as singletons, then wires the
 * projector's inject() to both theme.json data filters.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		$this->container->singleton( Theme_Json_Builder::class );
		$this->container->singleton( Projector::class );

		// Both layers: default (so user/theme can still override) and theme (so presets read as
		// theme-origin in the Site Editor). KB's existing palette injection runs at priority 999 on
		// wp_theme_json_data_theme; we run earlier so merge_existing() sees and preserves it.
		$callback = $this->container->callback( Projector::class, 'inject' );
		add_filter( 'wp_theme_json_data_default', $callback, 20 );
		add_filter( 'wp_theme_json_data_theme', $callback, 20 );
	}
}
```

> **Priority note:** `class-kadence-blocks-settings.php` hooks
> `wp_theme_json_data_theme` at **999**. We register at **20** so KB's
> `kadence_blocks_colors` palette is injected *after* us — meaning at our
> filter time it is not yet present, and our `merge_existing()` won't see it.
> That is fine: KB's own injection at 999 uses merge mode and will array_merge
> on top of the theme palette (which by then includes our token presets if WP
> threads the same object). **Confirm ordering empirically in Phase 3
> integration tests** — if token presets must survive KB's 999 injection,
> register our filter at priority **1000** instead so we run last and merge KB's
> result. Decide based on the integration test (§6.4).

### 6.3 Edit: `Projection/Provider.php`

Add the new provider to the boot list:

```php
private const PROVIDERS = [
	Css_Var\Provider::class,
	Theme_Json\Provider::class, // SOFT-3383
];
```

### 6.4 Tests (Phase 3)

- `tests/wpunit/Resources/Design_Tokens/Projection/Theme_Json/ProjectorTest.php`
  - inactive registry (`deactivate()`) → `inject()` returns the object
    unchanged (no `update_with`).
  - no `wp_preset` tokens → unchanged (early bail).
  - happy path → resulting `$theme_json->get_data()` contains the token presets
    under the right buckets with `var(--kb-token--*)` values.
  - resolver throws `RuntimeException` (seed an alias cycle via direct store
    write) → unchanged, no fatal.
  - **merge:** seed an existing `color.palette.theme` entry, assert token
    presets are appended and the existing entry survives; assert a slug
    collision keeps the existing entry.
- `tests/wpunit/Resources/Design_Tokens/Projection/Projection_ProviderTest.php`
  (extend existing) — assert both `wp_theme_json_data_default` and
  `wp_theme_json_data_theme` have the projector callback attached.
- **Ordering integration test:** run a request through both KB settings'
  injection and the token projector; assert both the `kadence_blocks_colors`
  palette and the token presets are present in the final
  `WP_Theme_JSON_Resolver` output. This is what settles the §6.2 priority
  question — adjust the priority if KB's 999 injection clobbers token presets.

---

## 7. Cross-cutting concerns

- **Caching:** payload cached in object-cache group `kb_design_tokens`, key
  `theme_json_presets_{KADENCE_BLOCKS_VERSION}_{store_version}`, 1-day TTL +
  per-request memo. Invalidates automatically on token write (version bump) and
  on plugin upgrade. No explicit purge hook needed — same contract as
  `Css_Builder`.
- **Graceful degradation:** every `resolve()` call is wrapped in
  `try { … } catch ( RuntimeException )` returning an empty payload, matching
  `Css_Var\Projector::build_css()`.
- **No literals leak:** the builder only ever emits `var(--kb-token--*)`; the
  resolved value is used *solely* to decide whether to skip an empty token. A
  test asserts no preset value is a non-`var(...)` string.
- **Slug parity with Css_Var:** guaranteed by the shared `Wp_Preset_Target`
  (Phase 1). Worth an explicit test asserting that for a given token the
  theme.json preset slug equals the `--wp--preset--<cat>--<slug>` slug segment
  the `Css_Var` bridge emits.
- **Spelling / lint:** American English everywhere (cspell CI). Run
  `composer phpcs` and `npx cspell` on changed files before pushing. Add
  `// cspell:ignore …` only where a real identifier (e.g. `fontFamilies`) trips
  the checker — note `fontFamilies`/`spacingSizes`/`fontFamily` are valid
  theme.json keys and may need allow-listing.

## 8. PR / review logistics

- Branch already in flight: `SOFT-3383/theme-json-projector` (current). Open
  Phase 2/3 PRs against `feature/design-tokens-module` (the module integration
  branch), matching how `SOFT-3382` was merged.
- On PRs targeting `feature/design-tokens-module`, request **dave-green-uk** and
  **d4mation** as reviewers.
- Each PR's description should carry a `Test plan` checklist mirroring #1017
  (`slic run wpunit …`, `slic run snapshot …`, `composer phpcs`, `npx cspell`).

## 9. Open questions to confirm in PR

1. **Merge vs. replace** of existing theme presets (§6.1) — recommend merge.
2. **Filter priority** relative to KB's existing 999 `theme_json` injection
   (§6.2) — settle with the ordering integration test.
3. **Spacing/shadow `theme` origin:** confirmed flat (`spacing.spacingSizes`,
   `shadow.presets` are not split by origin in theme.json v2) vs. color/typography
   which nest under `…theme`. Encoded in `THEME_ORIGIN`; verify against the
   target WP version's schema.
