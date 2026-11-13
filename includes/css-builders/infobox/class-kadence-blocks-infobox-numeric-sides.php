<?php
/**
 * Writes a padding or a margin saved as a list of numbers.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a padding or a margin saved as a list of numbers.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Numeric_Sides_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 */
	public function __construct( $property ) {
		$this->property = $property;
	}

	/**
	 * Write the sides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$sides = $input->attribute( $this->property );

		if ( is_array( $sides ) ) {
			( new Kadence_Blocks_Css_Writer( $input->css() ) )->numeric_sides( $this->property, $sides, 'px' );
		}
	}
}
