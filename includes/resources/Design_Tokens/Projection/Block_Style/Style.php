<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style;

/**
 * Single source for the native block-style naming, so the name passed to register_block_style() and the
 * class the scoped CSS targets can never drift apart.
 *
 * A register_block_style( $block, [ 'name' => 'kb-ghost' ] ) call makes WordPress add "is-style-kb-ghost"
 * to the block when that style is picked. The Registrar derives the name with {@see Style::name()} and the
 * Css_Builder derives the matching selector class with {@see Style::selector_class()}, both off the same
 * sanitized variant slug.
 *
 * @since TBD
 */
final class Style {

	/**
	 * The register_block_style() "name" prefix.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public const NAME_PREFIX = 'kb-';

	/**
	 * The selector class WordPress outputs for a kb- style name (is-style- + the name).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public const CLASS_PREFIX = 'is-style-kb-';

	/**
	 * The register_block_style() name for a variant slug, e.g. "ghost" => "kb-ghost".
	 *
	 * @since TBD
	 *
	 * @param string $variant The variant slug.
	 *
	 * @return string
	 */
	public static function name( string $variant ): string {
		return self::NAME_PREFIX . self::ident( $variant );
	}

	/**
	 * The class WordPress outputs for a variant's registered style, e.g. "ghost" => "is-style-kb-ghost".
	 *
	 * @since TBD
	 *
	 * @param string $variant The variant slug.
	 *
	 * @return string
	 */
	public static function selector_class( string $variant ): string {
		return self::CLASS_PREFIX . self::ident( $variant );
	}

	/**
	 * Whether a block is a non-Kadence block, projected through register_block_style here rather than the
	 * kbVariant class path that Kadence blocks use.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return bool
	 */
	public static function is_native( string $block ): bool {
		return strpos( $block, 'kadence/' ) !== 0;
	}

	/**
	 * Reduce a segment to a CSS-identifier-safe form, so a variant slug or block name can never break out
	 * of a selector or a class name. Keeps word characters and hyphens; collapses anything else to a single
	 * hyphen.
	 *
	 * @since TBD
	 *
	 * @param string $segment The raw segment.
	 *
	 * @return string
	 */
	public static function ident( string $segment ): string {
		return (string) preg_replace( '/[^A-Za-z0-9_-]+/', '-', $segment );
	}
}
