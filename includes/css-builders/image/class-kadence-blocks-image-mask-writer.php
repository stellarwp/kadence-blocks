<?php
/**
 * Writes the properties of a mask.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the properties of a mask.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Mask_Writer {

	/**
	 * Write the image, the size, the repeat and the position of the mask, with and without the prefix.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css The CSS builder.
	 * @param string                                    $image The mask image as a CSS value.
	 * @param string                                    $size The mask size.
	 * @param string                                    $repeat The mask repeat.
	 * @param string                                    $position The mask position.
	 *
	 * @return void
	 */
	public static function write( $css, string $image, string $size, string $repeat, string $position ): void {
		foreach ( [
			'image'    => $image,
			'size'     => $size,
			'repeat'   => $repeat,
			'position' => $position,
		] as $name => $value ) {
			$css->add_property( '-webkit-mask-' . $name, $value );
			$css->add_property( 'mask-' . $name, $value );
		}
	}
}
