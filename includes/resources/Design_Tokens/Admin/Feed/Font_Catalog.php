<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

/**
 * Reads and normalizes the font catalog the Typography screen's searchable dropdown lists:
 * every Google font family name plus every site-registered custom font name.
 *
 * The Google names come from includes/gfonts-names-array.php, the same generated, flat name
 * list the block editor already localizes (class-kadence-blocks-editor-assets.php's g_font_names).
 * The larger includes/gfonts-array.php (variants/subsets/weights/italics per family) is not read
 * here: it carries no category field, so it cannot contribute anything a generic-fallback stack
 * would need, and shipping its 338KB to this catalog would be pure waste.
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
	 * The filter the block editor already reads for site-registered custom fonts.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CUSTOM_FONTS_FILTER = 'kadence_blocks_custom_fonts';

	/**
	 * The catalog: every Google family name, and every custom family name not already among them.
	 *
	 * @since TBD
	 *
	 * @return array{google: string[], custom: string[]}
	 */
	public function all(): array {
		$google = $this->google_names();
		$custom = array_values( array_diff( $this->custom_names(), $google ) );

		return [
			'google' => $google,
			'custom' => $custom,
		];
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
