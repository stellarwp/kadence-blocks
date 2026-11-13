<?php
/**
 * Writes the letter spacing of a device other than the desktop.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the letter spacing of a device other than the desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Device_Letter_Spacing_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the spacing.
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
	 * @param string $attribute The attribute that stores the spacing.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Write the letter spacing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$spacing = $input->attribute( $this->attribute );

		if ( is_numeric( $spacing ) ) {
			$input->css()->add_property( 'letter-spacing', $spacing . $input->attribute( 'letterSpacingType', 'px' ) );
		}
	}
}
