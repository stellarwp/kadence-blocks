<?php
/**
 * Writes the border widths saved before version 3.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the border widths saved before version 3.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Border_Width_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The side of every position of a width.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const POSITIONS = [ 'top', 'right', 'bottom', 'left' ];

	/**
	 * The attribute that stores the widths of a device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the widths of a device.
	 */
	public function __construct( string $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Write the width of every side that is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$widths = $input->attribute( $this->attribute );

		if ( ! is_array( $widths ) ) {
			return;
		}

		$unit = $input->attribute( 'borderWidthUnit' );

		foreach ( $widths as $key => $width ) {
			if ( is_numeric( $width ) ) {
				$input->css()->add_property( 'border-' . self::POSITIONS[ $key ] . '-width', $width . ( $unit ?? 'px' ) );
			}
		}
	}
}
