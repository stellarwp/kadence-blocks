<?php
/**
 * Writes the minimum height of the row on tablet or mobile.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the minimum height of the row on tablet or mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Min_Height_Device_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

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
	 * @param string $device    The device.
	 * @param string $attribute The attribute that stores the height.
	 */
	public function __construct( $device, $attribute ) {
		$this->device    = $device;
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
		$height = $input->attribute( $this->attribute );

		if ( ! is_numeric( $height ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		$css->add_property( 'min-height', $height . ( ! empty( $input->attribute( 'minHeightUnit' ) ) ? $input->attribute( 'minHeightUnit' ) : 'px' ) );
		$css->set_media_state( 'desktop' );
	}
}
