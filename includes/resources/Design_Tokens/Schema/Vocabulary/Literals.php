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
	 * The CSS font-weight keywords accepted as a non-numeric weight literal.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const FONT_WEIGHT_KEYWORDS = [
		'normal',
		'bold',
		'bolder',
		'lighter',
	];

	/**
	 * The CSS font-style keywords accepted as a fontStyle literal. "oblique <angle>" is intentionally
	 * not modeled — the keyword forms cover the design-system need.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const FONT_STYLE_KEYWORDS = [
		'normal',
		'italic',
		'oblique',
	];

	/**
	 * The CSS text-transform keywords accepted as a textTransform literal.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const TEXT_TRANSFORM_KEYWORDS = [
		'none',
		'capitalize',
		'uppercase',
		'lowercase',
		'full-width',
		'full-size-kana',
	];

	/**
	 * The CSS border-style keywords accepted as a borderStyle literal.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const BORDER_STYLE_KEYWORDS = [
		'none',
		'hidden',
		'solid',
		'dashed',
		'dotted',
		'double',
		'groove',
		'ridge',
		'inset',
		'outset',
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
		if (
			is_int( $value )
			|| (
				// String form must not carry a leading zero ("0400" is a CSS parse error).
				is_string( $value )
				&& (bool) preg_match( '/^[1-9]\d{0,3}$/', $value )
			)
		) {
			$weight = (int) $value;

			return $weight >= 1 && $weight <= 1000;
		}

		if ( is_string( $value ) ) {
			return in_array( strtolower( $value ), self::FONT_WEIGHT_KEYWORDS, true );
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
	 * Whether the value is a valid clamp preferred (fluid) slot: a plain dimension, a CSS function form,
	 * or a bare calc-style expression combining number/length/percentage/viewport terms with the math
	 * operators + - * / (e.g. "0.995rem + 0.326vw", "100% - 20px"). The bare-expression form is what a
	 * dimension literal rejects — a clamp() argument accepts a <calc-sum> without a calc() wrapper, so the
	 * preferred slot must too. This is a shape gate, not a full CSS math validator.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate clamp preferred slot.
	 *
	 * @return bool
	 */
	public static function is_clamp_preferred( $value ): bool {
		if ( ! is_string( $value ) || trim( $value ) === '' ) {
			return false;
		}

		// A single length / "0" / function form (var()/calc()/clamp()/min()/max()) is already a dimension.
		if ( self::is_dimension( $value ) ) {
			return true;
		}

		// A bare calc-style sum: number(+unit) terms joined by + - * / (spaces optional in this shape gate).
		$term = '-?(?:\d+\.?\d*|\.\d+)(?:' . self::LENGTH_UNITS . ')?';

		return (bool) preg_match( '/^' . $term . '(?:\s*[-+*\/]\s*' . $term . ')+$/i', $value );
	}

	/**
	 * Whether the value is a valid fontStyle literal: one of the CSS font-style keywords.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate fontStyle.
	 *
	 * @return bool
	 */
	public static function is_font_style( $value ): bool {
		return is_string( $value ) && in_array( strtolower( $value ), self::FONT_STYLE_KEYWORDS, true );
	}

	/**
	 * Whether the value is a valid textTransform literal: one of the CSS text-transform keywords.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate textTransform.
	 *
	 * @return bool
	 */
	public static function is_text_transform( $value ): bool {
		return is_string( $value ) && in_array( strtolower( $value ), self::TEXT_TRANSFORM_KEYWORDS, true );
	}

	/**
	 * Whether the value is a valid borderStyle literal: one of the CSS border-style keywords.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The candidate borderStyle.
	 *
	 * @return bool
	 */
	public static function is_border_style( $value ): bool {
		return is_string( $value ) && in_array( strtolower( $value ), self::BORDER_STYLE_KEYWORDS, true );
	}

	/**
	 * Whether the string is a CSS function form, e.g. var(--x), calc(1rem + 2px), clamp(...). The body
	 * is intentionally unparsed — this is a shape gate, not a CSS expression validator. The greedy ".*"
	 * between the outer parens is required to let nested calls like calc(var(--x) + 2px) or
	 * clamp(1rem, var(--y), 3rem) match; constraining the body would reject legitimate CSS. The
	 * trade-off is that two function calls concatenated into one string (e.g. "rgb(0,0,0) hsl(0,0,0)")
	 * would also match, but a DTCG $value is a single token — that concatenation is not a shape this
	 * module is meant to police, and parsing it would belong in a real CSS parser.
	 *
	 * An empty argument IS rejected, though: no CSS <length>/<color> function is valid with a missing
	 * argument, and that is the shape an incomplete clamp()/var()/calc() takes when a slot is left blank
	 * (e.g. the token editor's fluid helper before every slot is filled). This catches the whole call
	 * being empty (func(), clamp(, , )) AND an empty leading or interior positional argument at any depth
	 * (clamp(, a, b), clamp(1rem, , 2rem), foo(bar(, x))). A TRAILING empty is left alone, because
	 * var(--x,) is a valid empty custom-property fallback. It stays a shape gate — argument count and type
	 * are not checked, so e.g. clamp(1rem) (too few args) still passes; that grammar belongs in a real CSS
	 * parser.
	 *
	 * @since TBD
	 *
	 * @param string $value The candidate function string.
	 *
	 * @return bool
	 */
	private static function is_function( string $value ): bool {
		if ( ! preg_match( '/^[a-z][a-z0-9-]*\((.*)\)$/i', $value, $matches ) ) {
			return false;
		}

		$args = $matches[1];

		// No real arguments at all: func(), clamp(, , ), var(  ).
		if ( trim( $args, " \t\n\r\0\x0B," ) === '' ) {
			return false;
		}

		// An empty leading or interior positional argument: a comma at the start or right after an open
		// paren, or two commas with nothing between them. A trailing empty (var(--x,)) is intentionally
		// not matched.
		return ! (bool) preg_match( '/(?:^|\()\s*,|,\s*,/', $args );
	}
}
