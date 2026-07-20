<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * The v1 DTCG $type vocabulary and the field shapes of the composite types.
 *
 * This is the single source of truth the baseline document, the JSON Schema (Dtcg_Schema_Generator)
 * and the Resolver all read, so the type vocabulary cannot drift between them. PHP 7.4 has
 * no native enums, so the vocabulary is modelled as class constants plus static lookup maps.
 *
 * The shadow composite type holds an object $value whose sub-fields each validate as another $type
 * (color, dimension); composite_fields() returns that field => $type map as DATA so a future shape
 * extends the map rather than rewriting the walker.
 *
 * @since TBD
 */
final class Token_Type {

	/**
	 * The color $type.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const COLOR = 'color';

	/**
	 * The dimension $type (covers spacing, radius, border-width, icon-size).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DIMENSION = 'dimension';

	/**
	 * The fontFamily $type (an array $value).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FONT_FAMILY = 'fontFamily';

	/**
	 * The shadow $type (a composite object $value).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SHADOW = 'shadow';

	/**
	 * The DTCG leaf key whose value is one of the $types above. Single-sourced here so the validator,
	 * resolver and projectors never hardcode the spelling.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KEY = '$type';

	/**
	 * Every v1 $type, in declaration order.
	 *
	 * @var string[]
	 *
	 * @since TBD
	 */
	private const TYPES = [
		self::COLOR,
		self::DIMENSION,
		self::FONT_FAMILY,
		self::SHADOW,
	];

	/**
	 * The composite types and their sub-field => kind maps. A field absent from the document is a
	 * missing-field error; a field present but not listed here is an unknown-field error. Every kind is
	 * validated "alias OR literal-of-kind", so an alias is accepted in any sub-field.
	 *
	 * @var array<string, array<string, string>>
	 *
	 * @since TBD
	 */
	private const COMPOSITE_FIELDS = [
		self::SHADOW => [
			'color'   => self::COLOR,
			'offsetX' => self::DIMENSION,
			'offsetY' => self::DIMENSION,
			'blur'    => self::DIMENSION,
			'spread'  => self::DIMENSION,
		],
	];

	/**
	 * Every v1 $type.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function all(): array {
		return self::TYPES;
	}

	/**
	 * Whether the given string is a known v1 $type.
	 *
	 * @since TBD
	 *
	 * @param string $type The candidate $type.
	 *
	 * @return bool
	 */
	public static function is_valid( string $type ): bool {
		return in_array( $type, self::TYPES, true );
	}

	/**
	 * Whether the given $type carries an object $value walked field by field.
	 *
	 * @since TBD
	 *
	 * @param string $type The $type to test.
	 *
	 * @return bool
	 */
	public static function is_composite( string $type ): bool {
		return isset( self::COMPOSITE_FIELDS[ $type ] );
	}

	/**
	 * The sub-field => kind map for a composite $type, or an empty array for a non-composite type.
	 *
	 * @since TBD
	 *
	 * @param string $type The composite $type.
	 *
	 * @return array<string, string> Field name => kind (a $type or a KIND_* constant).
	 */
	public static function composite_fields( string $type ): array {
		return self::COMPOSITE_FIELDS[ $type ] ?? [];
	}

	/**
	 * The DTCG leaf key that carries a token's $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_key(): string {
		return self::KEY;
	}

	/**
	 * The color $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_color(): string {
		return self::COLOR;
	}

	/**
	 * The dimension $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_dimension(): string {
		return self::DIMENSION;
	}

	/**
	 * The fontFamily $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_font_family(): string {
		return self::FONT_FAMILY;
	}

	/**
	 * The shadow $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_shadow(): string {
		return self::SHADOW;
	}
}
