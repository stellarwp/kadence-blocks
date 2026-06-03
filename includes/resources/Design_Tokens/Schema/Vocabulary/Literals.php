<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * Per-kind literal-value grammar, single-sourced so a leaf $value and a composite sub-field that share
 * a kind validate identically.
 *
 * These checks are deliberately permissive-but-meaningful: they reject obviously-wrong values (a color
 * of "not-a-color", a dimension of "red") while accepting the breadth of valid CSS — hex/function
 * colors, length units, and CSS function forms like var()/calc()/clamp(). They never see aliases:
 * callers short-circuit Alias::is_alias() first, so "alias anywhere" stays a single rule applied once.
 *
 * @since TBD
 */
final class Literals {

	/**
	 * Length units accepted in a dimension literal. "0" is also allowed unit-less.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LENGTH_UNITS = 'px|rem|em|ex|ch|vw|vh|vmin|vmax|vi|vb|cm|mm|in|pt|pc|q|fr|%|deg|rad|grad|turn|s|ms';

	/**
	 * CSS-wide keywords and the dynamic color keywords, valid for any kind.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const COLOR_KEYWORDS = [
		'transparent',
		'currentcolor',
		'inherit',
		'initial',
		'unset',
		'revert',
	];

	/**
	 * The CSS named colors (CSS Color Module Level 4 extended set, lower-cased). A curated allowlist is
	 * what lets "not-a-color" be rejected while "rebeccapurple" is accepted.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const NAMED_COLORS = [
		'aliceblue',
		'antiquewhite',
		'aqua',
		'aquamarine',
		'azure',
		'beige',
		'bisque',
		'black',
		'blanchedalmond',
		'blue',
		'blueviolet',
		'brown',
		'burlywood',
		'cadetblue',
		'chartreuse',
		'chocolate',
		'coral',
		'cornflowerblue',
		'cornsilk',
		'crimson',
		'cyan',
		'darkblue',
		'darkcyan',
		'darkgoldenrod',
		'darkgray',
		'darkgreen',
		'darkgrey',
		'darkkhaki',
		'darkmagenta',
		'darkolivegreen',
		'darkorange',
		'darkorchid',
		'darkred',
		'darksalmon',
		'darkseagreen',
		'darkslateblue',
		'darkslategray',
		'darkslategrey',
		'darkturquoise',
		'darkviolet',
		'deeppink',
		'deepskyblue',
		'dimgray',
		'dimgrey',
		'dodgerblue',
		'firebrick',
		'floralwhite',
		'forestgreen',
		'fuchsia',
		'gainsboro',
		'ghostwhite',
		'gold',
		'goldenrod',
		'gray',
		'green',
		'greenyellow',
		'grey',
		'honeydew',
		'hotpink',
		'indianred',
		'indigo',
		'ivory',
		'khaki',
		'lavender',
		'lavenderblush',
		'lawngreen',
		'lemonchiffon',
		'lightblue',
		'lightcoral',
		'lightcyan',
		'lightgoldenrodyellow',
		'lightgray',
		'lightgreen',
		'lightgrey',
		'lightpink',
		'lightsalmon',
		'lightseagreen',
		'lightskyblue',
		'lightslategray',
		'lightslategrey',
		'lightsteelblue',
		'lightyellow',
		'lime',
		'limegreen',
		'linen',
		'magenta',
		'maroon',
		'mediumaquamarine',
		'mediumblue',
		'mediumorchid',
		'mediumpurple',
		'mediumseagreen',
		'mediumslateblue',
		'mediumspringgreen',
		'mediumturquoise',
		'mediumvioletred',
		'midnightblue',
		'mintcream',
		'mistyrose',
		'moccasin',
		'navajowhite',
		'navy',
		'oldlace',
		'olive',
		'olivedrab',
		'orange',
		'orangered',
		'orchid',
		'palegoldenrod',
		'palegreen',
		'paleturquoise',
		'palevioletred',
		'papayawhip',
		'peachpuff',
		'peru',
		'pink',
		'plum',
		'powderblue',
		'purple',
		'rebeccapurple',
		'red',
		'rosybrown',
		'royalblue',
		'saddlebrown',
		'salmon',
		'sandybrown',
		'seagreen',
		'seashell',
		'sienna',
		'silver',
		'skyblue',
		'slateblue',
		'slategray',
		'slategrey',
		'snow',
		'springgreen',
		'steelblue',
		'tan',
		'teal',
		'thistle',
		'tomato',
		'turquoise',
		'violet',
		'wheat',
		'white',
		'whitesmoke',
		'yellow',
		'yellowgreen',
	];

	/**
	 * Whether the value is a valid color literal: a hex color, a CSS color function, a CSS-wide or
	 * dynamic keyword, or a named color.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate color.
	 *
	 * @return bool
	 */
	public static function is_color( $value ): bool {
		if ( ! is_string( $value ) || $value === '' ) {
			return false;
		}

		// #rgb, #rgba, #rrggbb, #rrggbbaa.
		if ( (bool) preg_match( '/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i', $value ) ) {
			return true;
		}

		$lower = strtolower( $value );

		if ( in_array( $lower, self::COLOR_KEYWORDS, true ) || in_array( $lower, self::NAMED_COLORS, true ) ) {
			return true;
		}

		// A CSS color function such as rgb, hsl, lab, oklch, color, or a var/calc reference.
		return self::is_function( $value );
	}

	/**
	 * Whether the value is a valid dimension literal: unit-less "0", a number with a length/angle/time
	 * unit, or a CSS function form (var()/calc()/clamp()/min()/max()).
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate dimension.
	 *
	 * @return bool
	 */
	public static function is_dimension( $value ): bool {
		if ( ! is_string( $value ) || $value === '' ) {
			return false;
		}

		if ( $value === '0' ) {
			return true;
		}

		if ( (bool) preg_match( '/^-?(\d+\.?\d*|\.\d+)(' . self::LENGTH_UNITS . ')$/i', $value ) ) {
			return true;
		}

		return self::is_function( $value );
	}

	/**
	 * Whether the value is a valid fontFamily literal: a non-empty list of non-empty string family
	 * names (e.g. ["Inter", "system-ui", "sans-serif"]).
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate fontFamily.
	 *
	 * @return bool
	 */
	public static function is_font_family( $value ): bool {
		if ( ! is_array( $value ) || $value === [] ) {
			return false;
		}

		// Must be a sequential list, every entry a non-empty string.
		$index = 0;
		foreach ( $value as $key => $family ) {
			if ( $key !== $index || ! is_string( $family ) || trim( $family ) === '' ) {
				return false;
			}
			++$index;
		}

		return true;
	}

	/**
	 * Whether the value is a valid fontWeight literal: a numeric weight 1-1000, its string form, or a
	 * CSS weight keyword.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate fontWeight.
	 *
	 * @return bool
	 */
	public static function is_font_weight( $value ): bool {
		if ( is_int( $value ) || ( is_string( $value ) && (bool) preg_match( '/^\d{1,4}$/', $value ) ) ) {
			$weight = (int) $value;

			return $weight >= 1 && $weight <= 1000;
		}

		if ( is_string( $value ) ) {
			return in_array( strtolower( $value ), [ 'normal', 'bold', 'bolder', 'lighter' ], true );
		}

		return false;
	}

	/**
	 * Whether the value is a valid lineHeight literal: a unit-less number (int or float), a dimension,
	 * or the "normal" keyword.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate lineHeight.
	 *
	 * @return bool
	 */
	public static function is_line_height( $value ): bool {
		if ( is_int( $value ) || is_float( $value ) ) {
			return $value >= 0;
		}

		if ( is_string( $value ) && strtolower( $value ) === 'normal' ) {
			return true;
		}

		// Unit-less numeric string or a dimension ("1.5", "1.5rem").
		if ( is_string( $value ) && (bool) preg_match( '/^\d+\.?\d*$/', $value ) ) {
			return true;
		}

		return self::is_dimension( $value );
	}

	/**
	 * Whether the string is a CSS function form, e.g. var(--x), calc(1rem + 2px), clamp(...). The body
	 * is intentionally unparsed — this is a shape gate, not a CSS expression validator.
	 *
	 * @param string $value The candidate function string.
	 *
	 * @return bool
	 */
	private static function is_function( string $value ): bool {
		return (bool) preg_match( '/^[a-z][a-z0-9-]*\(.*\)$/is', $value );
	}
}
