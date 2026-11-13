<?php
/**
 * Writes the text alignment of the info box on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the text alignment of the info box on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Text_Align_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the alignment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

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
	 * @param string $attribute The attribute that stores the alignment.
	 * @param string $device    The device.
	 */
	public function __construct( $attribute, $device ) {
		$this->attribute = $attribute;
		$this->device    = $device;
	}

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$align = $input->attribute( $this->attribute );

		if ( empty( $align ) ) {
			return;
		}

		$input->css()->set_media_state( $this->device );
		$input->css()->add_property( 'text-align', $align );
		$input->css()->set_media_state( 'desktop' );
	}
}
