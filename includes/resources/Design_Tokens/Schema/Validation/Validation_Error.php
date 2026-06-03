<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation;

/**
 * One immutable validation failure: where it is, what kind it is, and a human-readable message.
 *
 * The path is a DTCG dot-path to the offending node (e.g. "semantic.shadow.card.$value.color"), so the
 * REST write layer can surface the exact location in its HTTP 422 body. The code is a STABLE machine
 * key — REST responses and MCP clients branch on it, so the CODE_* set is a cross-component contract,
 * not a free-form label.
 *
 * @since TBD
 */
final class Validation_Error {

	/**
	 * A node's $type is missing, not a string, or not in the v1 enum.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_TYPE_UNKNOWN = 'type_unknown';

	/**
	 * A value that looks like an alias is not a well-formed "{dot.path}" string.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_ALIAS_MALFORMED = 'alias_malformed';

	/**
	 * A literal value is not valid for its $type / kind (e.g. a color of "not-a-color").
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_VALUE_INVALID = 'value_invalid';

	/**
	 * A non-sentinel leaf has no $value.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_MISSING_VALUE = 'missing_value';

	/**
	 * An override sentinel ($value:null or $disabled) appeared in the baseline context.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_SENTINEL_NOT_ALLOWED = 'sentinel_not_allowed';

	/**
	 * The $disabled key is present but its value is not boolean true.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_SENTINEL_INVALID = 'sentinel_invalid';

	/**
	 * A composite $value is not an object, or a required composite sub-field is absent.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_COMPOSITE_FIELD_MISSING = 'composite_field_missing';

	/**
	 * A composite $value carries a sub-field not defined for its type.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_COMPOSITE_FIELD_UNKNOWN = 'composite_field_unknown';

	/**
	 * A document, group, or leaf node is not the expected array/object shape.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_MALFORMED_NODE = 'malformed_node';

	/**
	 * A token leaf carries a non-"$"-prefixed key that the DTCG leaf shape does not allow.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CODE_LEAF_FIELD_UNKNOWN = 'leaf_field_unknown';

	/**
	 * DTCG dot-path to the offending node.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $path;

	/**
	 * Stable machine code; one of the CODE_* constants.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $code;

	/**
	 * Human-readable explanation.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $message;

	/**
	 * @param string $path    DTCG dot-path to the offending node.
	 * @param string $code    A stable code, as returned by the code_*() accessors.
	 * @param string $message Human-readable explanation.
	 */
	public function __construct( string $path, string $code, string $message ) {
		$this->path    = $path;
		$this->code    = $code;
		$this->message = $message;
	}

	/**
	 * Array form for the REST/MCP boundary.
	 *
	 * @since TBD
	 *
	 * @return array{path: string, code: string, message: string}
	 */
	public function to_array(): array {
		return [
			'path'    => $this->path,
			'code'    => $this->code,
			'message' => $this->message,
		];
	}

	/**
	 * Code: a node's $type is missing, not a string, or not in the v1 enum.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_type_unknown(): string {
		return self::CODE_TYPE_UNKNOWN;
	}

	/**
	 * Code: a value that looks like an alias is not a well-formed "{dot.path}" string.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_alias_malformed(): string {
		return self::CODE_ALIAS_MALFORMED;
	}

	/**
	 * Code: a literal value is not valid for its $type / kind.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_value_invalid(): string {
		return self::CODE_VALUE_INVALID;
	}

	/**
	 * Code: a non-sentinel leaf has no $value.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_missing_value(): string {
		return self::CODE_MISSING_VALUE;
	}

	/**
	 * Code: an override sentinel appeared in the baseline context.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_sentinel_not_allowed(): string {
		return self::CODE_SENTINEL_NOT_ALLOWED;
	}

	/**
	 * Code: the $disabled key is present but its value is not boolean true.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_sentinel_invalid(): string {
		return self::CODE_SENTINEL_INVALID;
	}

	/**
	 * Code: a composite $value is not an object, or a required sub-field is absent.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_composite_field_missing(): string {
		return self::CODE_COMPOSITE_FIELD_MISSING;
	}

	/**
	 * Code: a composite $value carries a sub-field not defined for its type.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_composite_field_unknown(): string {
		return self::CODE_COMPOSITE_FIELD_UNKNOWN;
	}

	/**
	 * Code: a document, group, or leaf node is not the expected array/object shape.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_malformed_node(): string {
		return self::CODE_MALFORMED_NODE;
	}

	/**
	 * Code: a token leaf carries a non-"$"-prefixed key that the DTCG leaf shape does not allow.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_code_leaf_field_unknown(): string {
		return self::CODE_LEAF_FIELD_UNKNOWN;
	}
}
