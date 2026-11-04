<?php declare( strict_types=1 );
// cspell:ignore oklch oklab unclipped Björn Ottosson bottosson .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide;

/**
 * Works out the hex color the Kadence theme renders for its complement palette color.
 *
 * The theme renders palette10 as `oklch(from var(--global-palette1) calc(l + 0.10 * (1 - l)) calc(c * 1.00)
 * calc(h + 180) / 100%)`: palette1 lightened slightly and turned half way round the hue wheel. Pages
 * without the theme's CSS variables can't resolve that, so this does the same math in PHP. A color the
 * turn pushes outside sRGB is clipped per channel, which is what browsers do when they render it.
 *
 * @since TBD
 */
final class Complement_Color {

	/**
	 * Matches a 3, 4, 6 or 8 digit hex color. Any alpha digits are ignored, since the theme renders the
	 * complement fully opaque.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const HEX_PATTERN = '/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i';

	/**
	 * Matches an rgb(), rgba(), hsl() or hsla() color, capturing the function name and its arguments.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FUNCTION_PATTERN = '/^(rgba?|hsla?)\(\s*([^)]*)\)$/i';

	/**
	 * The share of the remaining lightness the theme adds.
	 *
	 * @since TBD
	 *
	 * @var float
	 */
	private const LIGHTEN = 0.10;

	/**
	 * The complement of a hex, rgb() or hsl() color as a six digit hex, or null for any other value.
	 *
	 * @since TBD
	 *
	 * @param string $color The base color, palette1.
	 *
	 * @return string|null
	 */
	public static function of( string $color ): ?string {
		$rgb = self::rgb_of( trim( $color ) );

		if ( $rgb === null ) {
			return null;
		}

		[ $l, $a, $b ] = self::to_oklab( array_map( [ self::class, 'to_linear' ], $rgb ) );

		// Turning the hue 180 degrees at the same chroma flips both OKLab axes.
		$rgb = self::from_oklab( $l + self::LIGHTEN * ( 1 - $l ), -$a, -$b );

		$hex = '#';

		foreach ( $rgb as $channel ) {
			$hex .= sprintf( '%02x', (int) round( max( 0.0, min( 1.0, self::from_linear( $channel ) ) ) * 255 ) );
		}

		return $hex;
	}

	/**
	 * A color's red, green and blue channels from 0 to 1, or null when it is not a hex, rgb() or hsl() color.
	 * Any alpha is ignored, since the theme renders the complement fully opaque.
	 *
	 * @since TBD
	 *
	 * @param string $color The color.
	 *
	 * @return float[]|null
	 */
	private static function rgb_of( string $color ): ?array {
		if ( preg_match( self::FUNCTION_PATTERN, $color, $match ) === 1 ) {
			return self::rgb_of_function( strtolower( substr( $match[1], 0, 3 ) ), $match[2] );
		}

		if ( preg_match( self::HEX_PATTERN, $color, $match ) !== 1 ) {
			return null;
		}

		$digits = $match[1];

		if ( strlen( $digits ) <= 4 ) {
			$digits = $digits[0] . $digits[0] . $digits[1] . $digits[1] . $digits[2] . $digits[2];
		}

		return [
			hexdec( substr( $digits, 0, 2 ) ) / 255,
			hexdec( substr( $digits, 2, 2 ) ) / 255,
			hexdec( substr( $digits, 4, 2 ) ) / 255,
		];
	}

	/**
	 * The red, green and blue channels of an rgb() or hsl() color's arguments, in either the comma or the
	 * space separated syntax, or null when they are not numbers.
	 *
	 * @since TBD
	 *
	 * @param string $name      "rgb" or "hsl".
	 * @param string $arguments The text between the parentheses.
	 *
	 * @return float[]|null
	 */
	private static function rgb_of_function( string $name, string $arguments ): ?array {
		$parts = preg_split( '/\s*[,\/]\s*|\s+/', trim( $arguments ) );

		if ( ! is_array( $parts ) || count( $parts ) < 3 ) {
			return null;
		}

		$numbers = [];

		foreach ( array_slice( $parts, 0, 3 ) as $index => $part ) {
			$is_percent = str_ends_with( $part, '%' );
			$number     = $is_percent ? substr( $part, 0, -1 ) : ( $index === 0 && $name === 'hsl' ? preg_replace( '/deg$/i', '', $part ) : $part );

			if ( ! is_numeric( $number ) ) {
				return null;
			}

			$numbers[] = [ (float) $number, $is_percent ];
		}

		if ( $name === 'rgb' ) {
			return array_map(
				static fn( array $number ): float => max( 0.0, min( 1.0, $number[1] ? $number[0] / 100 : $number[0] / 255 ) ),
				$numbers
			);
		}

		$hue        = fmod( fmod( $numbers[0][0], 360 ) + 360, 360 );
		$saturation = max( 0.0, min( 1.0, $numbers[1][0] / 100 ) );
		$lightness  = max( 0.0, min( 1.0, $numbers[2][0] / 100 ) );
		$amount     = $saturation * min( $lightness, 1 - $lightness );

		$channel = static function ( int $offset ) use ( $hue, $lightness, $amount ): float {
			$k = fmod( $offset + $hue / 30, 12 );

			return $lightness - $amount * max( -1, min( $k - 3, 9 - $k, 1 ) );
		};

		return [ $channel( 0 ), $channel( 8 ), $channel( 4 ) ];
	}

	/**
	 * An sRGB channel decoded to linear light, using the standard sRGB transfer curve.
	 *
	 * @since TBD
	 *
	 * @param float $channel The channel, 0 to 1.
	 *
	 * @return float
	 */
	private static function to_linear( float $channel ): float {
		return $channel <= 0.04045 ? $channel / 12.92 : ( ( $channel + 0.055 ) / 1.055 ) ** 2.4;
	}

	/**
	 * A linear-light channel encoded back to sRGB.
	 *
	 * @since TBD
	 *
	 * @param float $channel The linear channel.
	 *
	 * @return float
	 */
	private static function from_linear( float $channel ): float {
		return $channel <= 0.0031308 ? 12.92 * $channel : 1.055 * ( $channel ** ( 1 / 2.4 ) ) - 0.055;
	}

	/**
	 * Linear sRGB to OKLab. The constants are Björn Ottosson's published OKLab matrices, the same ones
	 * CSS Color 4 uses: https://bottosson.github.io/posts/oklab/
	 *
	 * @since TBD
	 *
	 * @param float[] $rgb Linear red, green and blue.
	 *
	 * @return float[] Lightness, a and b.
	 */
	private static function to_oklab( array $rgb ): array {
		[ $r, $g, $b ] = $rgb;

		$l = ( 0.4122214708 * $r + 0.5363325363 * $g + 0.0514459929 * $b ) ** ( 1 / 3 );
		$m = ( 0.2119034982 * $r + 0.6806995451 * $g + 0.1073969566 * $b ) ** ( 1 / 3 );
		$s = ( 0.0883024619 * $r + 0.2817188376 * $g + 0.6299787005 * $b ) ** ( 1 / 3 );

		return [
			0.2104542553 * $l + 0.7936177850 * $m - 0.0040720468 * $s,
			1.9779984951 * $l - 2.4285922050 * $m + 0.4505937099 * $s,
			0.0259040371 * $l + 0.7827717662 * $m - 0.8086757660 * $s,
		];
	}

	/**
	 * OKLab to linear sRGB, unclipped. The inverse matrices from the same OKLab source.
	 *
	 * @since TBD
	 *
	 * @param float $lightness The lightness.
	 * @param float $a         The green to red axis.
	 * @param float $b         The blue to yellow axis.
	 *
	 * @return float[] Linear red, green and blue.
	 */
	private static function from_oklab( float $lightness, float $a, float $b ): array {
		$l = ( $lightness + 0.3963377774 * $a + 0.2158037573 * $b ) ** 3;
		$m = ( $lightness - 0.1055613458 * $a - 0.0638541728 * $b ) ** 3;
		$s = ( $lightness - 0.0894841775 * $a - 1.2914855480 * $b ) ** 3;

		return [
			4.0767416621 * $l - 3.3077115913 * $m + 0.2309699292 * $s,
			-1.2684380046 * $l + 2.6097574011 * $m - 0.3413193965 * $s,
			-0.0041960863 * $l - 0.7034186147 * $m + 1.7076147010 * $s,
		];
	}
}
