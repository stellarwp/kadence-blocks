<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

/**
 * A single alias reference from a stored token to another token id.
 *
 * @since TBD
 */
final class Token_Reference {

	/**
	 * Semantic layer override with a direct $value alias.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KIND_SEMANTIC_OVERRIDE = 'semantic_override';

	/**
	 * Alias found inside a composite $value sub-field (e.g. shadow.color).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KIND_COMPOSITE_FIELD = 'composite_field';

	/**
	 * Alias found inside $extensions.variants or $extensions.foundationPresets.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const KIND_EXTENSION = 'extension';

	/**
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kind_semantic_override(): string {
		return self::KIND_SEMANTIC_OVERRIDE;
	}

	/**
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kind_composite_field(): string {
		return self::KIND_COMPOSITE_FIELD;
	}

	/**
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_kind_extension(): string {
		return self::KIND_EXTENSION;
	}

	/**
	 * The reference kind. One of the KIND_* values.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $kind;

	/**
	 * The canonical dot-path of the token holding the reference.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $path;

	/**
	 * Whether the phase-1 cascade can automatically handle this reference.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	public bool $supported;

	/**
	 * @since TBD
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
}
