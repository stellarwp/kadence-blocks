<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Cast;

/**
 * Renders an already-flattened (alias-free) DTCG value to a CSS-ready string,
 * dispatching on $type. Input is the literal produced by Token_Resolver — never an alias.
 *
 * @since TBD
 */
final class Css_Renderer {

	/**
	 * @param mixed $value Literal scalar, list, or composite array.
	 */
	public function render( string $type, $value ): string {
		switch ( $type ) {
			case Token_Type::get_type_font_family():
				return $this->font_family( $value );
			case Token_Type::get_type_shadow():
				return $this->shadow( $value );
			case Token_Type::get_type_typography():
				return $this->typography( $value );
			case Token_Type::get_type_color():
			case Token_Type::get_type_dimension():
			default:
				return Cast::to_string( $value );
		}
	}

	/**
	 * @param mixed $value string[] of family names, or a single string.
	 */
	private function font_family( $value ): string {
		if ( is_array( $value ) ) {
			$families = array_map(
				static function ( $family ): string {
					$name = Cast::to_string( $family );

					return strpos( $name, ' ' ) !== false ? '"' . $name . '"' : $name;
				},
				$value
			);

			return implode( ', ', $families );
		}

		return Cast::to_string( $value );
	}

	/**
	 * Render a shadow composite to "<offsetX> <offsetY> <blur> <spread> <color>".
	 *
	 * v1 supports a single shadow object. DTCG also permits a $value that is an array of
	 * shadow objects (stacked box-shadows); that shape is intentionally not handled here —
	 * Token_Resolver passes a list through untouched, and supporting it is a follow-up that
	 * would change this method (join each layer with ", ") and the resolver's list handling.
	 *
	 * @param mixed|array{color: string, offsetX: string, offsetY: string, blur: string, spread: string} $value
	 *              The resolved shadow shape; typed loosely so a malformed (non-array) token still degrades to "".
	 */
	private function shadow( $value ): string {
		// Render only a single shadow object (an associative map). A non-array, an empty array, or a
		// list-shaped value (a stacked-shadow array of objects, not supported in v1) has no single
		// offsetX/offsetY/… to read, so emit nothing rather than a "0 0 0 0" shaped from missing keys.
		if ( ! is_array( $value ) || $value === [] || array_keys( $value ) === range( 0, count( $value ) - 1 ) ) {
			return '';
		}

		return trim( sprintf(
			'%s %s %s %s %s',
			$value['offsetX'] ?? '0',
			$value['offsetY'] ?? '0',
			$value['blur']    ?? '0',
			$value['spread']  ?? '0',
			$value['color']   ?? ''
		) );
	}

	/**
	 * Render a typography composite to the CSS `font` shorthand
	 * ("<weight> <size>/<line-height> <family>"). Emitted as one custom property;
	 * projectors may also split it into longhand properties if needed.
	 *
	 * @param mixed|array{fontFamily: string|string[], fontSize: string, fontWeight: string, lineHeight: string} $value
	 *              The resolved typography shape; typed loosely so a malformed (non-array) token still degrades to "".
	 */
	private function typography( $value ): string {
		if ( ! is_array( $value ) ) {
			return '';
		}

		$weight = $value['fontWeight'] ?? '';
		$size   = Cast::to_string( $value['fontSize'] ?? '' );
		$lh     = $value['lineHeight'] ?? '';
		// fontFamily may resolve to a list (e.g. ["Inter","sans-serif"]); render it as a CSS family list.
		$family = $this->font_family( $value['fontFamily'] ?? '' );

		// The CSS `font` shorthand is only valid with both a font-size and a font-family;
		// without either, emit nothing rather than a malformed declaration (e.g. "700 /1.2").
		if ( $size === '' || $family === '' ) {
			return '';
		}

		$size_lh = $lh !== '' ? "{$size}/{$lh}" : $size;

		return trim( sprintf( '%s %s %s', $weight, $size_lh, $family ) );
	}
}
