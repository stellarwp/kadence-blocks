<?php
/**
 * Writes a color, using a default one when none was saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a color, using a default one when none was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Default_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The color to use when none was saved.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $fallback;

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
	 * @param string $fallback  The color to use when none was saved.
	 * @param string $property  The CSS property.
	 * @param string $opacity   The attribute that stores the opacity.
	 */
	public function __construct( $attribute, $fallback, $property, $opacity ) {
		$this->attribute = $attribute;
		$this->fallback  = $fallback;
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
		$attributes = $input->attributes();

		if ( ! isset( $attributes[ $this->attribute ] ) ) {
			$attributes[ $this->attribute ] = $this->fallback;
		}

		$input->css()->render_color_output( $attributes, $this->attribute, $this->property, $this->opacity );
	}
}
