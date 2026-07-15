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
 * "kind" — usually another $type (color, dimension, fontFamily), and for typography four scale kinds
 * (fontWeight, lineHeight, fontStyle, textTransform) that are not themselves registrable $types.
 * composite_fields() returns the required field => kind map as DATA so a future responsive/clamp shape
 * extends the map rather than rewriting the walker; optional_composite_fields() returns the sub-fields
 * a composite may carry but need not (e.g. a typography token's fontStyle/textTransform/letterSpacing),
 * so a token that omits them still validates.
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
	 * The DTCG leaf key whose value is one of the $types above. Single-sourced here so the validator,
	 * resolver and projectors never hardcode the spelling.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KEY = '$type';

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
	 * The fontStyle composite sub-field kind (an enum literal: normal/italic/oblique). Not a registrable
	 * $type (see KIND_FONT_WEIGHT).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KIND_FONT_STYLE = 'fontStyle';

	/**
	 * The textTransform composite sub-field kind (an enum literal: none/uppercase/…). Not a registrable
	 * $type (see KIND_FONT_WEIGHT).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KIND_TEXT_TRANSFORM = 'textTransform';

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
	 * The composite types and their required sub-field => kind maps. A required field absent from the
	 * document is a missing-field error; a field present but listed in neither this map nor
	 * COMPOSITE_OPTIONAL_FIELDS is an unknown-field error. Every kind is validated "alias OR
	 * literal-of-kind", so an alias is accepted in any sub-field.
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
		],
	];

	/**
	 * The composite types and their optional sub-field => kind maps. An optional field may be omitted (so
	 * a token carrying only the required fields still validates), but when present it must satisfy its
	 * kind.
	 *
	 * Typography keeps only fontFamily required; every other text-style property is optional so a
	 * typography token drives exactly the properties it declares and leaves the rest to inherit. That
	 * mirrors how a Kadence per-instance typography bundle inherits any field left blank, and lets a
	 * design-system typography token seed (say) only the family without forcing a weight/size/line-height
	 * onto every block that consumes it.
	 *
	 * @var array<string, array<string, string>>
	 *
	 * @since TBD
	 */
	private const COMPOSITE_OPTIONAL_FIELDS = [
		self::TYPOGRAPHY => [
			'fontSize'      => self::DIMENSION,
			'fontWeight'    => self::KIND_FONT_WEIGHT,
			'lineHeight'    => self::KIND_LINE_HEIGHT,
			'fontStyle'     => self::KIND_FONT_STYLE,
			'textTransform' => self::KIND_TEXT_TRANSFORM,
			'letterSpacing' => self::DIMENSION,
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
	 * The required sub-field => kind map for a composite $type, or an empty array for a non-composite
	 * type.
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
	 * The optional sub-field => kind map for a composite $type, or an empty array when the type has none.
	 * These sub-fields may be omitted from a token, but validate against their kind when present.
	 *
	 * @since TBD
	 *
	 * @param string $type The composite $type.
	 *
	 * @return array<string, string> Field name => kind (a $type or a KIND_* constant).
	 */
	public static function optional_composite_fields( string $type ): array {
		return self::COMPOSITE_OPTIONAL_FIELDS[ $type ] ?? [];
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

	/**
	 * The fontStyle composite sub-field kind.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kind_font_style(): string {
		return self::KIND_FONT_STYLE;
	}

	/**
	 * The textTransform composite sub-field kind.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kind_text_transform(): string {
		return self::KIND_TEXT_TRANSFORM;
	}
}
