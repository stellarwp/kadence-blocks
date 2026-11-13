<?php
/**
 * Writes the font size of a font on a device, made usable by the block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font size of a font on a device, made usable by the block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Font_Device_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The index of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int $index The index of the device.
	 */
	public function __construct( $index ) {
		$this->index = $index;
	}

	/**
	 * Write the size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$size = $input->item( 'size', $this->index );

		if ( empty( $size ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'font-size', $input->context()->call( 'get_usable_value', $css, $size, $input->attribute( 'sizeType', 'px' ), true ) );
	}
}
