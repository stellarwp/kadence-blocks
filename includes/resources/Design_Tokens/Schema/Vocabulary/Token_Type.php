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
 * (color, dimension); composite_fields() returns the field => $type map as DATA so a future shape
 * extends the map rather than rewriting the walker. Text-style properties (fontWeight, lineHeight,
 * fontStyle, textTransform) and borderStyle are plain scalar $types a block binds one discrete token
 * per property — there is no bundled typography composite, because a block that sets each property
 * individually can never consume a single `font` shorthand.
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
	 * The dimension $type (covers spacing, radius, border-width, icon-size, font-size, letter-spacing).
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
	 * The fontWeight $type (a numeric weight 1-1000 or a CSS weight keyword).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FONT_WEIGHT = 'fontWeight';

	/**
	 * The lineHeight $type (a unit-less number, a dimension, or "normal").
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LINE_HEIGHT = 'lineHeight';

	/**
	 * The fontStyle $type (an enum literal: normal/italic/oblique).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FONT_STYLE = 'fontStyle';

	/**
	 * The textTransform $type (an enum literal: none/uppercase/…).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TEXT_TRANSFORM = 'textTransform';

	/**
	 * The borderStyle $type (an enum literal: none/solid/dashed/…).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BORDER_STYLE = 'borderStyle';

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
	 * The "boolean" kind label used by OPTIONAL_FIELDS. Not a v1 $type (DTCG has no boolean $type),
	 * so it never appears in TYPES — it only marks an optional composite sub-field as a strict
	 * literal boolean in Composite_Value::validate().
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KIND_BOOLEAN = 'boolean';

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
		self::FONT_WEIGHT,
		self::LINE_HEIGHT,
		self::FONT_STYLE,
		self::TEXT_TRANSFORM,
		self::BORDER_STYLE,
		self::SHADOW,
	];

	/**
	 * The registered-id segment for each $type whose DTCG spelling is not itself a valid
	 * kebab-case id segment. A $type absent from this map uses its own spelling verbatim.
	 *
	 * The id segment is not the same vocabulary as the $type spelling: an id feeds
	 * Css_Var::from_id(), which only swaps "." for "--" and therefore requires the kebab
	 * charset, while $type is the DTCG spec spelling and stays camelCase where the spec says so.
	 * This map is the single place that reconciles the two so Reserved_Namespace and the
	 * mirrored JS map never re-derive it independently.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	private const ID_SEGMENTS = [
		self::FONT_FAMILY    => 'font-family',
		self::FONT_WEIGHT    => 'font-weight',
		self::LINE_HEIGHT    => 'line-height',
		self::FONT_STYLE     => 'font-style',
		self::TEXT_TRANSFORM => 'text-transform',
		self::BORDER_STYLE   => 'border-style',
	];

	/**
	 * The composite types and their sub-field => $type maps. A field absent from the document is a
	 * missing-field error; a field present but not listed here is an unknown-field error. Every field is
	 * validated "alias OR literal-of-$type", so an alias is accepted in any sub-field.
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
	 * The composite types and their sub-field => kind map for fields that MAY be present but are never
	 * required. Kept separate from COMPOSITE_FIELDS (which Composite_Value::validate() treats as the
	 * required set) so adding an optional field never turns an existing baseline token invalid — the
	 * shadow tokens in baseline.json predate "inset" and carry only the five required fields.
	 *
	 * "boolean" is a label, not a v1 $type: DTCG has no boolean $type and none is registered here, so an
	 * optional field is not dispatched through Kind::validate() (which would accept an alias for any
	 * kind) — the composite validator checks it as a strict literal instead.
	 *
	 * @var array<string, array<string, string>>
	 *
	 * @since TBD
	 */
	private const OPTIONAL_FIELDS = [
		self::SHADOW => [
			'inset' => self::KIND_BOOLEAN,
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
	 * The registered-id segment for a $type: the mapped kebab spelling if one is registered in
	 * ID_SEGMENTS, or the $type verbatim otherwise.
	 *
	 * A pure string mapper that performs no validation of its own — the same posture as Reserved_Namespace::canonical():
	 * callers pass a $type that already passed is_valid(). An unregistered input returns
	 * verbatim and produces an id downstream validation rejects.
	 *
	 * @since TBD
	 *
	 * @param string $type The DTCG $type (spec spelling).
	 *
	 * @return string The registered-id segment for $type.
	 */
	public static function get_id_segment( string $type ): string {
		return self::ID_SEGMENTS[ $type ] ?? $type;
	}

	/**
	 * Every v1 $type's registered-id segment, in the same declaration order as all().
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function get_id_segments(): array {
		return array_map( [ self::class, 'get_id_segment' ], self::TYPES );
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
	 * The sub-field => $type map for a composite $type, or an empty array for a non-composite type.
	 *
	 * @since TBD
	 *
	 * @param string $type The composite $type.
	 *
	 * @return array<string, string> Field name => the sub-field's $type.
	 */
	public static function composite_fields( string $type ): array {
		return self::COMPOSITE_FIELDS[ $type ] ?? [];
	}

	/**
	 * The optional sub-field => kind map for a composite $type, or an empty array for a non-composite
	 * type or one with no optional fields. A field returned here is never required by
	 * Composite_Value::validate() — it is only validated when present.
	 *
	 * @since TBD
	 *
	 * @param string $type The composite $type.
	 *
	 * @return array<string, string> Field name => the sub-field's kind label.
	 */
	public static function optional_fields( string $type ): array {
		return self::OPTIONAL_FIELDS[ $type ] ?? [];
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
	 * The "boolean" kind label used by an optional composite sub-field (e.g. shadow's "inset").
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kind_boolean(): string {
		return self::KIND_BOOLEAN;
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
	 * The fontWeight $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_font_weight(): string {
		return self::FONT_WEIGHT;
	}

	/**
	 * The lineHeight $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_line_height(): string {
		return self::LINE_HEIGHT;
	}

	/**
	 * The fontStyle $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_font_style(): string {
		return self::FONT_STYLE;
	}

	/**
	 * The textTransform $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_text_transform(): string {
		return self::TEXT_TRANSFORM;
	}

	/**
	 * The borderStyle $type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_type_border_style(): string {
		return self::BORDER_STYLE;
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
