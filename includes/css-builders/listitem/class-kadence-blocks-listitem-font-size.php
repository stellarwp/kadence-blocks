<?php
/**
 * Writes the font size of the highlight on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font size of the highlight on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Font_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device in the sizes.
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
	 * @param int $index The position of the device in the sizes.
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
		$size = $input->item( 'markSize', $this->index );

		if ( empty( $size ) ) {
			return;
		}

		$input->css()->add_property( 'font-size', $input->css()->get_font_size( $size, $input->attribute( 'markSizeType', 'px' ) ) );
	}
}
