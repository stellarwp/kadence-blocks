<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

/**
 * Reads and normalizes the font catalog the Typography screen's searchable dropdown lists:
 * every Google font family name plus every site-registered custom font name.
 *
 * The Google names come from includes/gfonts-names-array.php, the same generated, flat name
 * list the block editor already localizes (class-kadence-blocks-editor-assets.php's g_font_names).
 *
 * Per-family WEIGHTS come from the larger includes/gfonts-array.php, but only the weights: that file
 * also carries variants, subsets and italics per family, and shipping all 338KB of it would be waste
 * when the one thing a consumer needs from it is which weights a family actually has. A weight
 * control that offers 100-900 for every family promises faces most families do not ship, and the
 * browser answers with a synthesized approximation rather than the design system's own type.
 *
 * Custom names come from the kadence_blocks_custom_fonts filter, the same one the block editor
 * localizes as c_fonts — its shape is an associative array keyed by font name (a string key may
 * itself be a font-stack expression such as `"My Font", sans-serif`), so a string key is taken as
 * a name; an integer-keyed string entry (a plain list of names) passes through as-is.
 *
 * @since TBD
 */
final class Font_Catalog {

	/**
	 * The generated Google font names file, relative to the plugin root.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const NAMES_FILE = 'includes/gfonts-names-array.php';

	/**
	 * The generated Google font detail file, read for its per-family weight lists alone.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DETAILS_FILE = 'includes/gfonts-array.php';

	/**
	 * The filter the block editor already reads for site-registered custom fonts.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CUSTOM_FONTS_FILTER = 'kadence_blocks_custom_fonts';

	/**
	 * The catalog: every Google family name, every custom family name not already among them, and the
	 * weights each Google family ships.
	 *
	 * A custom family contributes no weights — the custom-fonts filter carries none — so it is absent
	 * from the map rather than present with an empty list, which lets a consumer tell "this family
	 * ships only regular" apart from "nothing is known about this family".
	 *
	 * @since TBD
	 *
	 * @return array{google: string[], custom: string[], weights: array<string, string[]>}
	 */
	public function all(): array {
		$google = $this->google_names();
		$custom = array_values( array_diff( $this->custom_names(), $google ) );

		return [
			'google'  => $google,
			'custom'  => $custom,
			'weights' => $this->google_weights(),
		];
	}

	/**
	 * The weights each Google family ships, keyed by family name.
	 *
	 * Normalized to numeric strings: the generated file spells the default weight `regular`, which is
	 * `400` everywhere a CSS `font-weight` is written, and leaving both spellings in would make a
	 * consumer match two things for one weight. Sorted numerically so a picker lists them in weight
	 * order rather than the file's own.
	 *
	 * Fail-soft to an empty map when the generated file is absent, the same posture google_names()
	 * takes for its own file.
	 *
	 * @since TBD
	 *
	 * @return array<string, string[]>
	 */
	private function google_weights(): array {
		$path = KADENCE_BLOCKS_PATH . self::DETAILS_FILE;

		if ( ! file_exists( $path ) ) {
			return [];
		}

		$fonts = include $path;

		if ( ! is_array( $fonts ) ) {
			return [];
		}

		$weights = [];

		foreach ( $fonts as $family => $details ) {
			if ( ! is_string( $family ) || ! is_array( $details ) || ! isset( $details['w'] ) || ! is_array( $details['w'] ) ) {
				continue;
			}

			$family_weights = [];

			foreach ( $details['w'] as $weight ) {
				if ( ! is_string( $weight ) && ! is_int( $weight ) ) {
					continue;
				}

				$weight = 'regular' === $weight ? '400' : (string) $weight;

				// An italic-only entry ("700italic") names a weight already listed in its own right, so
				// it would duplicate rather than add one.
				if ( ! preg_match( '/^\d+$/', $weight ) ) {
					continue;
				}

				$family_weights[] = $weight;
			}

			if ( $family_weights === [] ) {
				continue;
			}

			// Deduplicated by VALUE, not by key: PHP converts a numeric-string array key to an integer, so
			// keying on the weight would hand back `400` where every consumer compares against `'400'`.
			$family_weights = array_values( array_unique( $family_weights ) );
			sort( $family_weights, SORT_NUMERIC );

			$weights[ $family ] = $family_weights;
		}

		return $weights;
	}

	/**
	 * The Google font names, fail-soft to an empty list when the generated file is absent — the
	 * same posture class-kadence-blocks-editor-assets.php already takes for the same file.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function google_names(): array {
		$path = KADENCE_BLOCKS_PATH . self::NAMES_FILE;

		if ( ! file_exists( $path ) ) {
			return [];
		}

		$names = include $path;

		return is_array( $names ) ? array_values( array_filter( $names, 'is_string' ) ) : [];
	}

	/**
	 * The site's custom font names, normalized from the custom-fonts filter's associative shape.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function custom_names(): array {
		/**
		 * Filters the site-registered custom fonts, the same list the block editor localizes as
		 * c_fonts. Each entry is keyed by the font's family name or by a whole font-stack
		 * expression (`"My Font", sans-serif`, the shape kadence_blocks_convert_custom_fonts()
		 * builds when a fallback is registered); an integer-keyed string entry is a plain name.
		 *
		 * @since TBD
		 *
		 * @param array<string|int, mixed> $fonts The registered custom fonts.
		 *
		 * @return array<string|int, mixed> The registered custom fonts.
		 */
		$fonts = apply_filters( self::CUSTOM_FONTS_FILTER, [] );

		if ( ! is_array( $fonts ) ) {
			return [];
		}

		$names = [];

		foreach ( $fonts as $key => $value ) {
			$name = is_string( $key ) ? $this->family_of( $key ) : ( is_string( $value ) ? $this->family_of( $value ) : '' );

			if ( $name !== '' ) {
				$names[] = $name;
			}
		}

		return $names;
	}

	/**
	 * The family name a catalog entry names, taken from a font-stack expression when it carries
	 * one: the first family, with its surrounding quotes removed.
	 *
	 * A registered fallback puts the whole stack in the key (`"My Font", sans-serif`). Catalogued
	 * verbatim, that string becomes the picked font's `$value`, which Css_Renderer quotes as one
	 * family — `font-family: "\"My Font\", sans-serif"`, invalid — and never matches its own
	 * Google entry when the two lists are deduplicated. The family alone is what both need. The
	 * fallback is deliberately not carried into the token: a font primitive is minted as a
	 * single-family stack, the same rule that keeps a generic fallback from being invented for a
	 * Google family.
	 *
	 * @since TBD
	 *
	 * @param string $entry The catalog entry, a family name or a font-stack expression.
	 *
	 * @return string The family name, or "" when the entry names none.
	 */
	private function family_of( string $entry ): string {
		$first = explode( ',', $entry )[0];

		return trim( $first, " \t\n\r\0\x0B\"'" );
	}
}
