<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception;

use RuntimeException;

/**
 * Thrown when the Variant_Resolver is asked for a block or variant the document does not define, or for
 * a block whose variant set declares no `$default`.
 *
 * @since TBD
 */
final class Unknown_Variant_Exception extends RuntimeException {

	/**
	 * The block declares no variants in the document.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return self
	 */
	public static function for_block( string $block ): self {
		return new self( sprintf( 'No variants are defined for block "%s".', $block ) );
	}

	/**
	 * The block has variants, but not the requested one.
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name.
	 * @param string $variant The requested variant slug.
	 *
	 * @return self
	 */
	public static function for_variant( string $block, string $variant ): self {
		return new self( sprintf( 'Unknown variant "%s" for block "%s".', $variant, $block ) );
	}

	/**
	 * The block's variant set declares no `$default`.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return self
	 */
	public static function no_default( string $block ): self {
		return new self( sprintf( 'Block "%s" has no default variant.', $block ) );
	}
}
