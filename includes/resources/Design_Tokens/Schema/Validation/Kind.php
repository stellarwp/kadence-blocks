<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Literals;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * The shared "alias OR literal-of-kind" decision, single-sourced so a leaf $value and a composite
 * sub-field that share a kind reach the exact same verdict — and the exact same error code.
 *
 * A "kind" is either a v1 $type (color, dimension, fontFamily) or a composite-only scale kind
 * (fontWeight, lineHeight). validate() makes a three-way decision in a fixed order:
 *
 *   1. a well-formed alias        → valid (the Resolver flattens it later; "alias anywhere" lives here).
 *   2. a malformed alias attempt  → CODE_ALIAS_MALFORMED (a value that reaches for a "{…}" but is not
 *                                   a whole-string alias — flagged distinctly so authors fix the alias
 *                                   rather than being told it is an invalid color/dimension).
 *   3. otherwise                  → a literal check via Literals; failure is CODE_VALUE_INVALID.
 *
 * @since TBD
 */
final class Kind {

	/**
	 * Validate a value of the given kind, accepting an alias.
	 *
	 * @since TBD
	 *
	 * @param string $kind  A Token_Type $type or KIND_* constant.
	 * @param mixed  $value The decoded value.
	 * @param string $path  Dot-path to the value, for error reporting.
	 *
	 * @return Validation_Error[] Empty when valid.
	 */
	public static function validate( string $kind, $value, string $path ): array {
		if ( Alias::is_alias( $value ) ) {
			return [];
		}

		if ( Alias::looks_like_alias( $value ) ) {
			return [
				new Validation_Error(
					$path,
					Validation_Error::get_code_alias_malformed(),
					sprintf(
						'Value "%s" looks like an alias but is not a whole-string "{dot.path}" reference.',
						self::describe( $value )
					)
				),
			];
		}

		if ( self::accepts_literal( $kind, $value ) ) {
			return [];
		}

		return [
			new Validation_Error(
				$path,
				Validation_Error::get_code_value_invalid(),
				sprintf( 'Value "%s" is not a valid %s.', self::describe( $value ), $kind )
			),
		];
	}

	/**
	 * Whether a literal (non-alias) value satisfies the grammar for the kind.
	 *
	 * @param string $kind  A Token_Type $type or KIND_* constant.
	 * @param mixed  $value The decoded value.
	 *
	 * @return bool
	 */
	private static function accepts_literal( string $kind, $value ): bool {
		switch ( $kind ) {
			case Token_Type::get_type_color():
				return Literals::is_color( $value );
			case Token_Type::get_type_dimension():
				return Literals::is_dimension( $value );
			case Token_Type::get_type_font_family():
				return Literals::is_font_family( $value );
			case Token_Type::get_kind_font_weight():
				return Literals::is_font_weight( $value );
			case Token_Type::get_kind_line_height():
				return Literals::is_line_height( $value );
			default:
				return false;
		}
	}

	/**
	 * Render a decoded value as a short string for an error message.
	 *
	 * @param mixed $value The decoded value.
	 *
	 * @return string
	 */
	private static function describe( $value ): string {
		if ( is_string( $value ) ) {
			return $value;
		}

		if ( is_bool( $value ) ) {
			return $value ? 'true' : 'false';
		}

		if ( $value === null ) {
			return 'null';
		}

		if ( is_array( $value ) ) {
			return 'array';
		}

		// Remaining scalars (int/float) are castable; anything else falls back to its type name.
		return is_scalar( $value ) ? (string) $value : gettype( $value );
	}
}
