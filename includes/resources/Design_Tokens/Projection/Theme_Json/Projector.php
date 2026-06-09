<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use RuntimeException;
use WP_Theme_JSON_Data;

/**
 * Projects the resolved token set into the WordPress theme.json pipeline so tokens surface as native
 * presets in the Site Editor (color palette, font families, spacing sizes, shadow presets).
 *
 * Hooks both wp_theme_json_data_default and wp_theme_json_data_theme and mutates via
 * $theme_json->update_with([...]) — the same mechanism KB uses in class-kadence-blocks-settings.php.
 * Every preset value is a CSS variable (var(--kb-token--*)), so changing a token updates all presets
 * without rewriting theme.json. Gated on Token_Registry::is_active() and on at least one token
 * declaring a wp_preset projection, so an inactive or preset-free registry is a no-op.
 *
 * Token preset lists are merged onto whatever the incoming theme.json already declares, so KB adds to
 * — never replaces — the active theme's palette and KB's own kadence_blocks_colors injection.
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
	 * Inject token presets into a theme.json data object. Bound to both wp_theme_json_data_default
	 * and wp_theme_json_data_theme.
	 *
	 * Bails fast (returns the object untouched) when projection is inactive or no token declares a
	 * wp_preset projection.
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
	 * bypassed REST validation), so theme.json is left untouched rather than crashing the request.
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
	 * Merge the token preset lists onto whatever the incoming theme.json already declares, so KB adds
	 * to — never replaces — the active theme's palette and KB's existing kadence_blocks_colors
	 * injection. update_with() replaces list-valued leaves wholesale, so we read the existing list,
	 * append the token entries (skipping slug collisions — the existing entry wins), and hand back the
	 * union.
	 *
	 * @since TBD
	 *
	 * @param WP_Theme_JSON_Data   $theme_json The incoming data object.
	 * @param array<string, mixed> $payload    The token preset payload from the builder.
	 *
	 * @return array<string, mixed> The payload with each preset list merged onto the existing one.
	 */
	private function merge_existing( WP_Theme_JSON_Data $theme_json, array $payload ): array {
		$data     = $theme_json->get_data();
		$settings = $payload['settings'] ?? [];

		if ( ! is_array( $settings ) ) {
			return $payload;
		}

		foreach ( $this->preset_leaves( $settings ) as $path ) {
			$existing = $this->get_path( $data, array_merge( [ 'settings' ], $path ) );
			if ( ! is_array( $existing ) || $existing === [] ) {
				continue; // Nothing to merge with; the builder's list stands as-is.
			}

			$tokens         = (array) $this->get_path( $payload, array_merge( [ 'settings' ], $path ) );
			$existing_slugs = array_column( $existing, 'slug' );
			$additions      = array_filter(
				$tokens,
				static function ( $entry ) use ( $existing_slugs ): bool {
					return is_array( $entry ) && ! in_array( $entry['slug'] ?? null, $existing_slugs, true );
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

	/**
	 * The preset list leaf paths present in a settings sub-tree, e.g.
	 * [ ['color','palette','theme'], ['spacing','spacingSizes'] ].
	 *
	 * A leaf is a list of preset entries (a numerically-indexed array); recursion stops there so the
	 * preset entries themselves are not descended into.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $settings The settings sub-tree.
	 * @param string[]             $prefix   Accumulated path segments (internal recursion state).
	 *
	 * @return array<int, string[]> List of leaf paths, relative to "settings".
	 */
	private function preset_leaves( array $settings, array $prefix = [] ): array {
		$leaves = [];

		foreach ( $settings as $key => $value ) {
			if ( ! is_array( $value ) ) {
				continue;
			}

			$path = array_merge( $prefix, [ (string) $key ] );

			if ( array_key_exists( 0, $value ) ) {
				$leaves[] = $path; // A list of preset entries — this is a leaf.
				continue;
			}

			$leaves = array_merge( $leaves, $this->preset_leaves( $value, $path ) );
		}

		return $leaves;
	}

	/**
	 * Read the value at a path inside a nested array, or null when any segment is missing.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $tree The tree to read from.
	 * @param string[]             $path The path segments.
	 *
	 * @return mixed
	 */
	private function get_path( array $tree, array $path ) {
		$cursor = $tree;

		foreach ( $path as $segment ) {
			if ( ! is_array( $cursor ) || ! array_key_exists( $segment, $cursor ) ) {
				return null;
			}
			$cursor = $cursor[ $segment ];
		}

		return $cursor;
	}

	/**
	 * Set a value at a path inside a nested array, creating intermediate arrays as needed.
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
