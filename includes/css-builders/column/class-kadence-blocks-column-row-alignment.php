<?php
/**
 * Tells the row the column is in how to align it.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector-css.php';
require_once __DIR__ . '/class-kadence-blocks-column-device.php';
require_once __DIR__ . '/class-kadence-blocks-column-layout.php';
require_once __DIR__ . '/class-kadence-blocks-column-flex-values.php';

/**
 * Tells the row the column is in how to align it.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Row_Alignment_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The devices.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEVICES = [ 'desktop', 'tablet', 'mobile' ];

	/**
	 * Write the alignment of every device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( self::DEVICES as $index => $device ) {
			$this->write_device( $input, $device, $input->derived( 'layout' )->device( $index ) );
		}

		$input->css()->set_media_state( 'desktop' );
	}

	/**
	 * Write the alignment of one device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $device The device.
	 * @param Kadence_Blocks_Column_Device   $values The values of the device.
	 *
	 * @return void
	 */
	private function write_device( Kadence_Blocks_Css_Build_Input $input, $device, $values ): void {
		if ( empty( $values->vertical_align() ) ) {
			return;
		}

		$input->context()->call( 'set_vertical_align', $device, $values->vertical_align(), $values->direction(), $input->css(), $input->unique_id() );
	}
}
