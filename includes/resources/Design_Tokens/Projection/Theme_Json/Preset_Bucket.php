<?php declare( strict_types=1 );
// cspell:ignore fontfamilies fontfamily spacingsizes .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json;

/**
 * Maps a wp_preset category to its theme.json settings path and per-entry value key.
 *
 * Promoted out of Json_Builder (where it was a private BUCKETS const) so the Global Styles sync
 * listener (Design_Tokens\Global_Styles\Site_Editor_Preset_Locator) can address the exact same
 * theme.json location Json_Builder writes to, without a second hand-maintained copy of the map.
 * Mirrors the Kadence_Palette_Slot value-object extraction pattern.
 *
 * Categories absent from this map (e.g. a radius token's "radius") have no native theme.json
 * preset bucket and are skipped by every consumer.
 *
 * @since TBD
 */
final class Preset_Bucket {

	/**
	 * category => { path: settings sub-path, value_key: the entry field carrying the value }.
	 *
	 * @since TBD
	 *
	 * @var array<string, array{path: string[], value_key: string}>
	 */
	private const BUCKETS = [
		'color'       => [ 'path' => [ 'color', 'palette', 'theme' ], 'value_key' => 'color' ],
		'font-family' => [ 'path' => [ 'typography', 'fontFamilies', 'theme' ], 'value_key' => 'fontFamily' ],
		'spacing'     => [ 'path' => [ 'spacing', 'spacingSizes' ], 'value_key' => 'size' ],
		'shadow'      => [ 'path' => [ 'shadow', 'presets' ], 'value_key' => 'shadow' ],
	];

	/**
	 * The settings sub-path for a category, or null when the category has no native bucket.
	 *
	 * @since TBD
	 *
	 * @param string $category The wp_preset category, e.g. "color".
	 *
	 * @return string[]|null
	 */
	public static function path_for( string $category ): ?array {
		return self::BUCKETS[ $category ]['path'] ?? null;
	}

	/**
	 * The preset-entry field that carries the value for a category, or null when unmapped.
	 *
	 * @since TBD
	 *
	 * @param string $category The wp_preset category, e.g. "color".
	 *
	 * @return string|null
	 */
	public static function value_key_for( string $category ): ?string {
		return self::BUCKETS[ $category ]['value_key'] ?? null;
	}

	/**
	 * Every mapped category, for callers that need to enumerate the buckets (e.g. a locator
	 * walking every possible preset location).
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function categories(): array {
		return array_keys( self::BUCKETS );
	}
}
