<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary;

/**
 * The v1 DTCG $type vocabulary and the field shapes of the composite types.
 *
 * This is the single source of truth the baseline document, the JSON Schema (Dtcg_Schema_Generator)
 * and the Resolver all read, so the type vocabulary cannot drift between them. PHP 7.4 has
 * no native enums, so the vocabulary is modelled as class constants plus static lookup maps.
 *
 * Composite types (shadow, typography) hold an object $value whose sub-fields each validate as a
 * "kind" — usually another $type (color, dimension, fontFamily), and for typography two scale kinds
 * (fontWeight, lineHeight) that are not themselves registrable $types. composite_fields() returns that
 * field => kind map as DATA so a future responsive/clamp shape extends the map rather than
 * rewriting the walker.
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
	 * The typography $type (a composite object $value).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TYPOGRAPHY = 'typography';

	/**
	 * The fontWeight composite sub-field kind. Not a registrable $type — kept distinct from the $type
	 * constants so dispatch never confuses "a typography token" with "the fontWeight field inside one".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KIND_FONT_WEIGHT = 'fontWeight';

	/**
	 * The lineHeight composite sub-field kind. Not a registrable $type (see KIND_FONT_WEIGHT).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KIND_LINE_HEIGHT = 'lineHeight';

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
		self::TYPOGRAPHY,
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
		self::SHADOW     => [
			'color'   => self::COLOR,
			'offsetX' => self::DIMENSION,
			'offsetY' => self::DIMENSION,
			'blur'    => self::DIMENSION,
			'spread'  => self::DIMENSION,
		],
		self::TYPOGRAPHY => [
			'fontFamily' => self::FONT_FAMILY,
			'fontSize'   => self::DIMENSION,
			'fontWeight' => self::KIND_FONT_WEIGHT,
			'lineHeight' => self::KIND_LINE_HEIGHT,
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

	/**
	 * The typography $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_typography(): string {
		return self::TYPOGRAPHY;
	}

	/**
	 * The fontWeight composite sub-field kind.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kind_font_weight(): string {
		return self::KIND_FONT_WEIGHT;
	}

	/**
	 * The lineHeight composite sub-field kind.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kind_line_height(): string {
		return self::KIND_LINE_HEIGHT;
	}
}
