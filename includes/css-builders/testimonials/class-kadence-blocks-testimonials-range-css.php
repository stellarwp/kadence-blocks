<?php
/**
 * Writes a setting with one of the range renderers of the CSS.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a setting with one of the range renderers of the CSS.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Range_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The renderer: `render_range`, `render_measure_range` or `render_responsive_range`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $renderer;

	/**
	 * The attribute.
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
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $renderer  The renderer: `render_range`, `render_measure_range` or `render_responsive_range`.
	 * @param string $attribute The attribute.
	 * @param string $property  The CSS property.
	 */
	public function __construct( $renderer, $attribute, $property ) {
		$this->renderer  = $renderer;
		$this->attribute = $attribute;
		$this->property  = $property;
	}

	/**
	 * Write the range.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$renderer = $this->renderer;

		$input->css()->$renderer( $input->attributes(), $this->attribute, $this->property );
	}
}
