<?php
/**
 * Writes a color with the color renderer of the CSS.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a color with the color renderer of the CSS.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Color_Output_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the opacity.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $opacity;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the color.
	 * @param string $property  The CSS property.
	 * @param string $opacity   The attribute that stores the opacity.
	 */
	public function __construct( $attribute, $property, $opacity ) {
		$this->attribute = $attribute;
		$this->property  = $property;
		$this->opacity   = $opacity;
	}

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_color_output( $input->attributes(), $this->attribute, $this->property, $this->opacity );
	}
}
