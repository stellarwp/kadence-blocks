<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide;

/**
 * Pure translation from a theme Style Guide snapshot to `token id => $value`.
 *
 * No WordPress calls, no globals, no I/O: the reader hands raw data in and the overlay takes the map
 * out, so every rule here is unit-testable without a database or a theme.
 *
 * The palette half honors the theme's "active" pointer — palette / second-palette / third-palette —
 * because that is the set the theme renders. Only slots the caller passes in (the tokens declaring a
 * kadence_slot) are produced, and the settings half writes only the token ids listed here, so the
 * mapper can never introduce a token id of its own.
 *
 * @since TBD
 */
final class Style_Guide_Mapper {

	/**
	 * The palette option key naming the set the theme renders.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ACTIVE_KEY = 'active';

	/**
	 * The palette set the theme falls back to when "active" is missing or empty.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEFAULT_SET = 'palette';

	/**
	 * The theme stores this on palette10 to mean "derive the complement of palette1 at render time".
	 * It is a marker, not a color, so it must never become a token value.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const COMPLEMENT_MARKER = '#FfFfFf';

	/**
	 * Accepts hex, rgb()/rgba(), hsl()/hsla(). Anything else (an empty string, a CSS var, a bare word) is
	 * skipped so a bad theme value never reaches the resolver. A palette slot never carries a gradient; a
	 * button setting may, and GRADIENT_PATTERN admits it there.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const COLOR_PATTERN = '/^(#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\))$/i';

	/**
	 * Theme color settings that re-value a semantic color: token id => [ setting key, sub-key ] inside the
	 * array kadence()->option( setting key ) returns.
	 *
	 * @since TBD
	 *
	 * @var array<string, string[]>
	 */
	private const SETTING_TOKENS = [
		'semantic.color.button-bg'         => [ 'buttons_background', 'color' ],
		'semantic.color.button-bg-hover'   => [ 'buttons_background', 'hover' ],
		'semantic.color.button-text'       => [ 'buttons_color', 'color' ],
		'semantic.color.button-text-hover' => [ 'buttons_color', 'hover' ],
	];

	/**
	 * Matches a theme palette reference such as "palette4". Wider than the projection's palette1…9 pattern
	 * because the theme lets a setting point at any of its fifteen slots.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLOT_REFERENCE = '/^palette([1-9]|1[0-5])$/';

	/**
	 * A CSS gradient the theme stores in place of a background color. Kept as-is: the button's background
	 * shorthand renders it, and dropping it would change the site.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const GRADIENT_PATTERN = '/^(linear|radial|conic)-gradient\(.+\)$/i';

	/**
	 * Map a snapshot onto the tokens that claim palette slots.
	 *
	 * @since TBD
	 *
	 * @param array{palette: array<string, mixed>, settings: array<string, mixed>} $snapshot    The reader's snapshot.
	 * @param array<string, string>                                                $slot_tokens Slot slug => token id, from the registry.
	 *
	 * @return array<string, string> Token id => literal color, gradient or alias, for every claimed slot with a
	 *                               usable color and every button setting with a usable value.
	 */
	public function map( array $snapshot, array $slot_tokens ): array {
		$set    = $this->active_set( $snapshot['palette'] );
		$values = [];

		foreach ( $slot_tokens as $slug => $token_id ) {
			$color = self::color_of( $set, $slug );

			if ( $color === null ) {
				continue;
			}

			$values[ $token_id ] = $color;
		}

		foreach ( self::SETTING_TOKENS as $token_id => $path ) {
			$value = self::theme_color_value( $this->setting_at( $snapshot['settings'], $path ), $set, $slot_tokens );

			if ( $value === null ) {
				continue;
			}

			$values[ $token_id ] = $value;
		}

		return $values;
	}

	/**
	 * The theme setting keys the reader must fetch.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function setting_keys(): array {
		return array_values( array_unique( array_column( self::SETTING_TOKENS, 0 ) ) );
	}

	/**
	 * A theme color setting as a token value: a palette1…9 reference becomes an alias of the primitive that
	 * claims the slot, a palette10…15 reference becomes the active set's literal, a color or gradient
	 * literal stays as it is. Anything else is null.
	 *
	 * @since TBD
	 *
	 * @param mixed                 $raw         The setting value.
	 * @param array<string, string> $set         Slot slug => color of the active set.
	 * @param array<string, string> $slot_tokens Slot slug => token id.
	 *
	 * @return string|null
	 */
	public static function theme_color_value( $raw, array $set, array $slot_tokens ): ?string {
		if ( ! is_string( $raw ) || trim( $raw ) === '' ) {
			return null;
		}

		$raw = trim( $raw );

		if ( preg_match( self::SLOT_REFERENCE, $raw ) === 1 ) {
			if ( isset( $slot_tokens[ $raw ] ) ) {
				return '{' . $slot_tokens[ $raw ] . '}';
			}

			return self::color_of( $set, $raw );
		}

		if ( preg_match( self::COLOR_PATTERN, $raw ) === 1 || preg_match( self::GRADIENT_PATTERN, $raw ) === 1 ) {
			return $raw;
		}

		return null;
	}

	/**
	 * The slot slug => color map of the palette set the theme renders.
	 *
	 * Mirrors the theme's palette_option(): the "active" pointer names the set; a missing or empty
	 * pointer means "palette"; a pointer naming a set that does not exist yields nothing (the theme
	 * renders empty values in that case, so re-valuing nothing keeps the two in step).
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $palette The decoded kadence_global_palette option.
	 *
	 * @return array<string, string>
	 */
	public function active_set( array $palette ): array {
		$active = $palette[ self::ACTIVE_KEY ] ?? null;
		$key    = is_string( $active ) && $active !== '' ? $active : self::DEFAULT_SET;
		$list   = $palette[ $key ] ?? null;

		if ( ! is_array( $list ) ) {
			return [];
		}

		$set = [];

		foreach ( $list as $entry ) {
			if (
				! is_array( $entry )
				|| ! isset( $entry['slug'], $entry['color'] )
				|| ! is_string( $entry['slug'] )
				|| ! is_string( $entry['color'] )
			) {
				continue;
			}

			$set[ $entry['slug'] ] = $entry['color'];
		}

		return $set;
	}

	/**
	 * The usable color stored on a slot, or null when the slot is absent, empty, the complement marker,
	 * or not a color literal.
	 *
	 * @since TBD
	 *
	 * @param array<string, string> $set  Slot slug => color of the active set.
	 * @param string                $slug The slot slug.
	 *
	 * @return string|null
	 */
	private static function color_of( array $set, string $slug ): ?string {
		$color = trim( $set[ $slug ] ?? '' );

		if ( $color === self::COMPLEMENT_MARKER || preg_match( self::COLOR_PATTERN, $color ) !== 1 ) {
			return null;
		}

		return $color;
	}

	/**
	 * The value at a key path inside the settings snapshot, or null when any step is missing or not an array.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $settings Setting key => the value kadence()->option() returned.
	 * @param string[]             $path     The key path, e.g. [ 'buttons_background', 'color' ].
	 *
	 * @return mixed
	 */
	private function setting_at( array $settings, array $path ) {
		$node = $settings;

		foreach ( $path as $key ) {
			if ( ! is_array( $node ) || ! array_key_exists( $key, $node ) ) {
				return null;
			}

			$node = $node[ $key ];
		}

		return $node;
	}
}
