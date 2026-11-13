<?php
/**
 * Writes padding, margin and radius lists.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a padding, margin or border radius from its attribute under the current selector.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Measure_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the values.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The extra arguments of the CSS builder, such as the tablet and mobile attributes.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $arguments;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property  The CSS property.
	 * @param string $attribute The attribute that stores the values.
	 * @param array  $arguments The extra arguments of the CSS builder.
	 */
	public function __construct( $property, $attribute, array $arguments = [] ) {
		$this->property  = $property;
		$this->attribute = $attribute;
		$this->arguments = $arguments;
	}

	/**
	 * Write the measure.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_measure_output( $input->attributes(), $this->attribute, $this->property, $this->arguments );
	}
}
