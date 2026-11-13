<?php
/**
 * Writes the text orientation of a device, and the height it needs.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the text orientation of a device, and the height it needs.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Orientation_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the orientation.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The device, or null for the desktop.
	 *
	 * @since TBD
	 *
	 * @var string|null
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
	 * @param string      $attribute The attribute that stores the orientation.
	 * @param string|null $device    The device, or null for the desktop.
	 * @param int         $index     The position of the device.
	 */
	public function __construct( $attribute, $device, $index ) {
		$this->attribute = $attribute;
		$this->device    = $device;
		$this->index     = $index;
	}

	/**
	 * Write the orientation.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$orientation = $input->attribute( $this->attribute );

		if ( null === $orientation ) {
			return;
		}

		$css     = $input->css();
		$context = $input->context();

		if ( null !== $this->device ) {
			$css->set_media_state( $this->device );
		}

		$context->call( 'handle_text_orientation', $css, $orientation );
		$context->call( 'handle_max_height', $css, $input->attributes(), $this->index, $this->attribute );
	}
}
