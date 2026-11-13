<?php
/**
 * Writes the height and the width of the mask on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the height and the width of the mask on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Mask_Dimensions_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $device The device.
	 */
	public function __construct( $device ) {
		$this->device = $device;
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
		$css  = $input->css();
		$size = $input->derived( 'mask' )->size( $this->device );

		$css->add_property( 'height', $size->height_css() );
		$css->add_property( 'width', $size->width_css() );
	}
}
