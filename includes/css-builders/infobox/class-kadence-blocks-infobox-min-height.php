<?php
/**
 * Writes the minimum height of a text on every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-infobox-selector.php';

/**
 * Writes the minimum height of a text on every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Min_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the heights.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The attribute that stores the unit.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit;

	/**
	 * The selector template.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the heights.
	 * @param string $unit      The attribute that stores the unit.
	 * @param string $selector  The selector template.
	 */
	public function __construct( $attribute, $unit, $selector ) {
		$this->attribute = $attribute;
		$this->unit      = $unit;
		$this->selector  = $selector;
	}

	/**
	 * Write the heights.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$heights = $input->attribute( $this->attribute );

		if ( ! is_array( $heights ) || null === $input->item( $this->attribute, 0 ) ) {
			return;
		}

		foreach ( [ 'desktop', 'tablet', 'mobile' ] as $index => $device ) {
			$this->write_device( $input, $device, $index );
		}
	}

	/**
	 * Write the minimum height of a device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $device The device.
	 * @param int                            $index  The position of the device.
	 *
	 * @return void
	 */
	private function write_device( Kadence_Blocks_Css_Build_Input $input, $device, $index ): void {
		$height = $input->item( $this->attribute, $index );

		if ( ! is_numeric( $height ) ) {
			return;
		}

		$input->css()->set_media_state( $device );
		Kadence_Blocks_Infobox_Selector::set( $input, $this->selector );
		$input->css()->add_property( 'min-height', $height . $input->attribute( $this->unit, 'px' ) );
		$input->css()->set_media_state( 'desktop' );
	}
}
