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
 * kadence_slot) are produced, so the mapper can never introduce a token id of its own.
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
	 * Accepts hex, rgb()/rgba(), hsl()/hsla(). Anything else (an empty string, a CSS var, a gradient) is
	 * skipped so a bad theme value never reaches the resolver.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const COLOR_PATTERN = '/^(#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\))$/i';

	/**
	 * Map a snapshot onto the tokens that claim palette slots.
	 *
	 * @since TBD
	 *
	 * @param array{palette: array<string, mixed>, settings: array<string, mixed>} $snapshot    The reader's snapshot.
	 * @param array<string, string>                                                $slot_tokens Slot slug => token id, from the registry.
	 *
	 * @return array<string, string> Token id => literal color, for every claimed slot with a usable color.
	 */
	public function map( array $snapshot, array $slot_tokens ): array {
		$set    = $this->active_set( $snapshot['palette'] );
		$values = [];

		foreach ( $slot_tokens as $slug => $token_id ) {
			$color = $this->color_of( $set, $slug );

			if ( $color === null ) {
				continue;
			}

			$values[ $token_id ] = $color;
		}

		return $values;
	}

	/**
	 * The theme setting keys the reader must fetch. Empty until a mapping consumes one.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function setting_keys(): array {
		return [];
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
	private function color_of( array $set, string $slug ): ?string {
		$color = trim( $set[ $slug ] ?? '' );

		if ( $color === self::COMPLEMENT_MARKER || preg_match( self::COLOR_PATTERN, $color ) !== 1 ) {
			return null;
		}

		return $color;
	}
}
