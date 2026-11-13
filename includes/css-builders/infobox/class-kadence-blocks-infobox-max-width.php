<?php
/**
 * Writes the maximum width of the info box on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the maximum width of the info box on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Max_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attributes that store the unit of every device.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const UNITS = [ 'maxWidthUnit', 'maxWidthTabletUnit', 'maxWidthMobileUnit' ];

	/**
	 * The attribute that stores the width.
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
	 * @param string $attribute The attribute that stores the width.
	 * @param string $device    The device.
	 * @param int    $index     The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 */
	public function __construct( $attribute, $device, $index ) {
		$this->attribute = $attribute;
		$this->device    = $device;
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
		$width = $input->attribute( $this->attribute );

		if ( empty( $width ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		$css->add_property( 'max-width', $width . $this->unit( $input ) );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * The unit of the device: the one it saved, or the one of the device before.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return string
	 */
	private function unit( Kadence_Blocks_Css_Build_Input $input ) {
		$unit = 'px';

		foreach ( array_slice( self::UNITS, 0, $this->index + 1 ) as $attribute ) {
			$saved = $input->attribute( $attribute );
			$unit  = ! empty( $saved ) ? $saved : $unit;
		}

		return $unit;
	}
}
