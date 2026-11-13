<?php
/**
 * Writes the border radius with the renderer of the CSS, in the unit that was saved or pixels.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the border radius with the renderer of the CSS, in the unit that was saved or pixels.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Border_Radius_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the radius.
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
	private $unit_attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute      The attribute that stores the radius.
	 * @param string $unit_attribute The attribute that stores the unit.
	 */
	public function __construct( $attribute, $unit_attribute ) {
		$this->attribute      = $attribute;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the radius.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_border_radius( $input->attributes(), $this->attribute, $input->attribute( $this->unit_attribute, 'px' ) );
	}
}
