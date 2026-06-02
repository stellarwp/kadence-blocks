<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * The DTCG alias-string grammar, single-sourced for the schema, the validator and the Resolver.
 *
 * An alias is a WHOLE-STRING reference of the form "{dot.path.into.the.document}" — e.g.
 * "{primitive.color.brand.primary}". Partial interpolation ("1px solid {…}") is NOT supported in v1,
 * so an alias is matched anchored end to end. The path inside the braces is a DTCG dot-path into the
 * document root; the Resolver follows it, recursively, and is the only place aliases
 * flatten. Mirrors the static-util style of Css_Var so the alias rule cannot drift between consumers.
 *
 * @since TBD
 */
final class Alias {

	/**
	 * Whole-string alias pattern (PCRE, without delimiters). A "{", a dot-path of word characters,
	 * dots and dashes, then a "}", anchored end to end. Exposed via pattern() so the schema generator
	 * and the Resolver reuse the exact same expression.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PATTERN = '^\{[\w.-]+\}$';

	/**
	 * The whole-string alias pattern (PCRE, without delimiters), for consumers that build their own
	 * matcher — e.g. the JSON Schema generator and the Resolver.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_pattern(): string {
		return self::PATTERN;
	}

	/**
	 * Whether the given value is an alias string.
	 *
	 * Only strings can be aliases; any non-string (number, array, object, null) returns false so
	 * callers can short-circuit "alias OR literal" cleanly.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The value to test.
	 *
	 * @return bool
	 */
	public static function is_alias( $value ): bool {
		return is_string( $value ) && (bool) preg_match( '/' . self::PATTERN . '/', $value );
	}

	/**
	 * Whether the value reaches for alias syntax (contains a brace) without being a well-formed alias.
	 *
	 * Intended for use after is_alias() has already returned false: it distinguishes a fumbled alias
	 * (e.g. "{bad path}", "{unclosed") from a plain literal, so callers can report a malformed alias
	 * rather than an invalid value. Deliberately looser than the canonical pattern — it owns the "{ }"
	 * delimiter knowledge so consumers never hard-code it.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The value to test.
	 *
	 * @return bool
	 */
	public static function looks_like_alias( $value ): bool {
		return is_string( $value ) && ( strpos( $value, '{' ) !== false || strpos( $value, '}' ) !== false );
	}

	/**
	 * The dot-path referenced by an alias string, with the surrounding braces stripped.
	 *
	 * @since TBD
	 *
	 * @param string $value An alias string, e.g. "{primitive.color.brand.primary}".
	 *
	 * @return string The inner dot-path, e.g. "primitive.color.brand.primary". Empty string when the
	 *                value is not a well-formed alias.
	 */
	public static function path_of( string $value ): string {
		if ( ! self::is_alias( $value ) ) {
			return '';
		}

		return substr( $value, 1, -1 );
	}
}
