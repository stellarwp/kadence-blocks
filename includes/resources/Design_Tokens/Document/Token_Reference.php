<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

/**
 * A single alias reference from a stored token to another token id.
 *
 * @since 3.8.0
 */
final class Token_Reference {

	/**
	 * The reference kind. One of the KIND_* values.
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	public string $kind;

	/**
	 * The canonical dot-path of the token holding the reference.
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	public string $path;

	/**
	 * Whether the rename/delete cascade can automatically handle this reference.
	 *
	 * @since 3.8.0
	 *
	 * @var bool
	 */
	public bool $supported;

	/**
	 * Semantic layer override with a direct $value alias.
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private const KIND_SEMANTIC_OVERRIDE = 'semantic_override';

	/**
	 * Alias found inside a composite $value sub-field (e.g. shadow.color).
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private const KIND_COMPOSITE_FIELD = 'composite_field';

	/**
	 * Alias found inside $extensions.presets or $extensions.foundationPresets.
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private const KIND_EXTENSION = 'extension';

	/**
	 * Primitive layer override with a direct $value alias to another primitive.
	 *
	 * @since 3.8.0
	 *
	 * @var string
	 */
	private const KIND_PRIMITIVE_OVERRIDE = 'primitive_override';

	/**
	 * @since 3.8.0
	 *
	 * @param string $kind      One of the KIND_* values.
	 * @param string $path      Canonical dot-path of the referencing token.
	 * @param bool   $supported Whether the cascade can handle this reference.
	 */
	public function __construct( string $kind, string $path, bool $supported ) {
		$this->kind      = $kind;
		$this->path      = $path;
		$this->supported = $supported;
	}

	/**
	 * @since 3.8.0
	 *
	 * @return string
	 */
	public static function get_kind_semantic_override(): string {
		return self::KIND_SEMANTIC_OVERRIDE;
	}

	/**
	 * @since 3.8.0
	 *
	 * @return string
	 */
	public static function get_kind_composite_field(): string {
		return self::KIND_COMPOSITE_FIELD;
	}

	/**
	 * @since 3.8.0
	 *
	 * @return string
	 */
	public static function get_kind_primitive_override(): string {
		return self::KIND_PRIMITIVE_OVERRIDE;
	}

	/**
	 * @since 3.8.0
	 *
	 * @return string
	 */
	public static function get_kind_extension(): string {
		return self::KIND_EXTENSION;
	}
}
