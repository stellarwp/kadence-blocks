<?php
/**
 * Writes the width of the tab titles of vertical tabs on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the width of the tab titles of vertical tabs on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Vertical_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device: 0 desktop, 1 tablet, 2 mobile.
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
	 * @param int $index The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 */
	public function __construct( $index ) {
		$this->index = $index;
	}

	/**
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$unit  = $input->attribute( 'verticalTabWidthUnit' );
		$width = $this->width( $input );

		$input->css()->add_property( 'width', $width . ( ! empty( $unit ) ? $unit : '%' ) );
	}

	/**
	 * The width of the device: the one saved, or the one of the device before.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 */
	private function width( Kadence_Blocks_Css_Build_Input $input ) {
		for ( $index = $this->index; $index > 0; $index-- ) {
			$width = $input->item( 'verticalTabWidth', $index );

			if ( ! empty( $width ) ) {
				return $width;
			}
		}

		return $input->item( 'verticalTabWidth', 0 );
	}
}
