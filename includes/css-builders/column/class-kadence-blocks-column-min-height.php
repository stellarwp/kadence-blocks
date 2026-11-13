<?php
/**
 * Writes the minimum height of the column on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the minimum height of the column on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Min_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The position of the device.
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
	 * @param string $device The device.
	 * @param int    $index  The position of the device.
	 */
	public function __construct( $device, $index ) {
		$this->device = $device;
		$this->index  = $index;
	}

	/**
	 * Write the minimum height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$height = $input->item( 'height', $this->index );

		if ( ! is_numeric( $height ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		$css->add_property( 'min-height', $height . ( ! empty( $input->attribute( 'heightUnit' ) ) ? $input->attribute( 'heightUnit' ) : 'px' ) );
		$css->set_media_state( 'desktop' );
	}
}
