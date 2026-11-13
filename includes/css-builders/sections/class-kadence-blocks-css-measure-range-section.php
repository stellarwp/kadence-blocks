<?php
/**
 * Writes the four sides of a legacy measure.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the four sides of a legacy measure.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Measure_Range_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the sides.
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
	 * @param string $attribute The attribute that stores the sides.
	 * @param string $property  The CSS property.
	 */
	public function __construct( $attribute, $property ) {
		$this->attribute = $attribute;
		$this->property  = $property;
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
		$input->css()->render_measure_range( $input->attributes(), $this->attribute, $this->property );
	}
}
