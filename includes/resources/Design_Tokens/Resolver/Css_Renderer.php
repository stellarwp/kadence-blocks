<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

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
			case 'fontFamily':
				return $this->font_family( $value );
			case 'shadow':
				return $this->shadow( $value );
			case 'typography':
				return $this->typography( $value );
			case 'color':
			case 'dimension':
			default:
				return is_scalar( $value ) ? (string) $value : '';
		}
	}

	/**
	 * @param mixed $value string[] of family names, or a single string.
	 */
	private function font_family( $value ): string {
		if ( is_array( $value ) ) {
			$families = array_map(
				static fn( $f ): string => strpos( (string) $f, ' ' ) !== false ? '"' . $f . '"' : (string) $f,
				$value
			);

			return implode( ', ', $families );
		}

		return is_scalar( $value ) ? (string) $value : '';
	}

	/**
	 * Render a shadow composite to "<offsetX> <offsetY> <blur> <spread> <color>".
	 *
	 * @param mixed $value
	 */
	private function shadow( $value ): string {
		if ( ! is_array( $value ) ) {
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
	 * @param mixed $value
	 */
	private function typography( $value ): string {
		if ( ! is_array( $value ) ) {
			return '';
		}

		$weight = $value['fontWeight'] ?? '';
		$size   = $value['fontSize'] ?? '';
		$lh     = $value['lineHeight'] ?? '';
		// fontFamily may resolve to a list (e.g. ["Inter","sans-serif"]); render it as a CSS family list.
		$family = $this->font_family( $value['fontFamily'] ?? '' );

		$size_lh = $lh !== '' ? "{$size}/{$lh}" : (string) $size;

		return trim( sprintf( '%s %s %s', $weight, $size_lh, $family ) );
	}
}
