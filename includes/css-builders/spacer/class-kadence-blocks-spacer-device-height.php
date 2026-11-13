<?php
/**
 * Writes the height of the spacer on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the height of the spacer on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Device_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the height.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the height.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Write the height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->add_property( 'height', $input->attribute( $this->attribute ) . $input->attribute( 'spacerHeightUnits', 'px' ) . '!important' );
	}
}
