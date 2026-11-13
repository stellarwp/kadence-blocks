<?php
/**
 * Writes the maximum width of the row on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the maximum width of the row on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Max_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The attribute that stores the width.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The position in the attribute, or null when it is one value.
	 *
	 * @since TBD
	 *
	 * @var int|null
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string   $device    The device.
	 * @param string   $attribute The attribute that stores the width.
	 * @param int|null $index     The position in the attribute, or null when it is one value.
	 */
	public function __construct( $device, $attribute, $index ) {
		$this->device    = $device;
		$this->attribute = $attribute;
		$this->index     = $index;
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
		$width = null === $this->index ? $input->attribute( $this->attribute ) : $input->item( $this->attribute, $this->index );

		if ( ! is_numeric( $width ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		$css->add_property( 'max-width', $width . ( ! empty( $input->attribute( 'maxWidthUnit' ) ) ? $input->attribute( 'maxWidthUnit' ) : 'px' ) );
		$css->add_property( 'margin-left', 'auto' );
		$css->add_property( 'margin-right', 'auto' );
		$css->set_media_state( 'desktop' );
	}
}
