<?php declare( strict_types=1 );
// cspell:ignore fontfamilies fontfamily spacingsizes .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Wp_Preset_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;

/**
 * Builds the theme.json "settings" payload that surfaces design tokens as native WordPress presets —
 * color palette, font families, spacing sizes, shadow presets.
 *
 * Every preset value is a CSS variable pointing at the token's --kb-token--* variable, never the
 * literal value, so the Site Editor displays the preset and a token change updates all consumers
 * without rewriting theme.json. The variable target is identical to the --wp--preset--*: var(...)
 * bridge the Css_Var projector emits, so the editor swatch and the preset variable agree. Slug and
 * category derivation is shared with that projector through Wp_Preset_Target so the two never drift.
 *
 * Radius (a dimension token) has no native theme.json preset bucket, so a token whose wp_preset
 * category is unmapped here is skipped: it surfaces only as a custom var and via block bindings.
 *
 * Pure: no WordPress calls, no globals, no side effects. WordPress wiring lives in Projector.
 *
 * @since TBD
 */
final class Json_Builder {

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
	 * 'path'      => path segments under "settings" where the preset list lives.
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
		'color'       => [
			'path'      => [ 'color', 'palette', 'theme' ],
			'value_key' => 'color',
		],
		'font-family' => [
			'path'      => [ 'typography', 'fontFamilies', 'theme' ],
			'value_key' => 'fontFamily',
		],
		'spacing'     => [
			'path'      => [ 'spacing', 'spacingSizes' ],
			'value_key' => 'size',
		],
		'shadow'      => [
			'path'      => [ 'shadow', 'presets' ],
			'value_key' => 'shadow',
		],
	];

	/**
	 * The token registry.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Per-request memo keyed on the store version, so a write (which bumps the version) invalidates
	 * the in-memory result without an explicit purge.
	 *
	 * @since TBD
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
	 * Cached variant of payload(): memoized per request and persisted in the object cache keyed on the
	 * plugin version + store version, exactly like Css_Builder::css_for_version(). The plugin version
	 * is folded in because the derived presets depend on shipped declarations and the baseline, which
	 * change with a build, not only on stored overrides.
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

		$found     = false;
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
		// Group preset entries by category first, then assemble the nested settings tree, so each
		// bucket's path is written exactly once even with many tokens in the same category.
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
			$settings = $this->set_path( $settings, self::BUCKETS[ $category ]['path'], $entries );
		}

		return $settings;
	}

	/**
	 * Build a single preset entry: slug + name + the value key carrying var(--kb-token--*).
	 *
	 * @since TBD
	 *
	 * @param Token_Definition $token  The token.
	 * @param Wp_Preset_Target $target The resolved (category, slug).
	 *
	 * @return array<string, string>
	 */
	private function preset_entry( Token_Definition $token, Wp_Preset_Target $target ): array {
		$value_key = self::BUCKETS[ $target->category ]['value_key'];

		return [
			'slug'     => $target->slug,
			'name'     => $token->label,
			$value_key => 'var(' . $token->css_var . ')',
		];
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
