<?php
/**
 * Writes the size of the arrows on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the size of the arrows on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Arrow_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device in the size.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

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
	 * @param int    $index  The position of the device in the size.
	 * @param string $device The device.
	 */
	public function __construct( $index, $device ) {
		$this->index  = $index;
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
		$size = $input->item( 'arrowSize', $this->index );

		if ( empty( $size ) ) {
			return;
		}

		$css  = $input->css();
		$unit = $input->attribute( 'arrowSizeUnit' );

		// The device stays set for the sections that follow.
		$css->set_media_state( $this->device );
		$css->set_selector( '.kb-gallery-id-' . $input->unique_id() . ' .splide__arrow' );
		$css->add_property( 'font-size', $css->get_font_size( $size, ! empty( $unit ) ? $unit : 'px' ) );
	}
}
