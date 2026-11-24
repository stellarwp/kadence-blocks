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
	 * The literal key chain from the document root to the referencing token.
	 *
	 * Empty when the dot-path alone addresses the token. Set for locations whose keys carry dots or
	 * slashes ("com.kadence.designTokens", "kadence/singlebtn"), which a dot-path cannot express.
	 *
	 * @since 3.9.2
	 *
	 * @var string[]
	 */
	public array $keys;

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
	 * Direct alias held by a block preset token under $extensions.presets or $extensions.foundationPresets.
	 *
	 * @since 3.9.2
	 *
	 * @var string
	 */
	private const KIND_PRESET_OVERRIDE = 'preset_override';

	/**
	 * @since 3.8.0
	 * @since 3.9.2 Added the $keys parameter.
	 *
	 * @param string   $kind      One of the KIND_* values.
	 * @param string   $path      Canonical dot-path of the referencing token.
	 * @param bool     $supported Whether the cascade can handle this reference.
	 * @param string[] $keys      Literal key chain to the token, when the dot-path cannot address it.
	 */
	public function __construct( string $kind, string $path, bool $supported, array $keys = [] ) {
		$this->kind      = $kind;
		$this->path      = $path;
		$this->supported = $supported;
		$this->keys      = $keys;
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

	/**
	 * @since 3.9.2
	 *
	 * @return string
	 */
	public static function get_kind_preset_override(): string {
		return self::KIND_PRESET_OVERRIDE;
	}
}
