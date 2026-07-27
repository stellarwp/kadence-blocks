<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception;

use RuntimeException;

/**
 * Thrown when the Preset_Resolver is asked for a block or preset the document does not define, or for
 * a block whose preset set declares no `$default`.
 *
 * @since TBD
 */
final class Unknown_Preset_Exception extends RuntimeException {

	/**
	 * The block declares no presets in the document.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return self
	 */
	public static function for_block( string $block ): self {
		return new self( sprintf( 'No presets are defined for block "%s".', $block ) );
	}

	/**
	 * The block has presets, but not the requested one.
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name.
	 * @param string $preset The requested preset slug.
	 *
	 * @return self
	 */
	public static function for_preset( string $block, string $preset ): self {
		return new self( sprintf( 'Unknown preset "%s" for block "%s".', $preset, $block ) );
	}

	/**
	 * The block's preset set declares no `$default`.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return self
	 */
	public static function no_default( string $block ): self {
		return new self( sprintf( 'Block "%s" has no default preset.', $block ) );
	}
}
