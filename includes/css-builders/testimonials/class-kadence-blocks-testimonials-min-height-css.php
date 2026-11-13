<?php
/**
 * Writes the minimum height of a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-testimonials-min-height.php';

/**
 * Writes the minimum height of a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Min_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the minimum heights.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

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
	 * @param string $attribute The attribute that stores the minimum heights.
	 * @param int    $index     The index of the device.
	 */
	public function __construct( $attribute, $index ) {
		$this->attribute = $attribute;
		$this->index     = $index;
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
		if ( ! Kadence_Blocks_Testimonials_Min_Height::is_set( $input, $this->attribute, $this->index ) ) {
			return;
		}

		$input->css()->add_property( 'min-height', $input->item( $this->attribute, $this->index ) . 'px' );
	}
}
