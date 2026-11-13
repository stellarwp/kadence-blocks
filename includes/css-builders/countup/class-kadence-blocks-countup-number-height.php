<?php
/**
 * Writes the minimum height of the number on tablet and mobile.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Writes the minimum height of the number for a device other than desktop, in pixels, when it is a number.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countup_Number_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device, 1 for tablet, 2 for mobile.
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
	 * @param int $index The device, 1 for tablet, 2 for mobile.
	 */
	public function __construct( int $index ) {
		$this->index = $index;
	}

	/**
	 * Write the minimum height of the device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css        = $input->css();
		$attributes = $input->attributes();

		// The list is read by reference, as the original builder read it, so a list that is text or a number fails as it did.
		if ( ! $css->is_number( $attributes['numberMinHeight'][ $this->index ] ) ) {
			return;
		}

		$css->add_property( 'min-height', $attributes['numberMinHeight'][ $this->index ] . 'px' );
	}
}
