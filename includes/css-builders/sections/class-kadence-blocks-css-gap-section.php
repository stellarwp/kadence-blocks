<?php
/**
 * Writes a gap with its unit.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a gap with its unit.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Gap_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the gap.
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
	 * The attribute that stores the unit.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit_attribute;

	/**
	 * The extra arguments of the CSS builder, such as how to render variables.
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
	 * @param string $attribute      The attribute that stores the gap.
	 * @param string $property       The CSS property.
	 * @param string $unit_attribute The attribute that stores the unit.
	 * @param array  $arguments      The extra arguments of the CSS builder.
	 */
	public function __construct( $attribute, $property, $unit_attribute, array $arguments = [] ) {
		$this->attribute      = $attribute;
		$this->property       = $property;
		$this->unit_attribute = $unit_attribute;
		$this->arguments      = $arguments;
	}

	/**
	 * Write the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_gap( $input->attributes(), $this->attribute, $this->property, $this->unit_attribute, $this->arguments );
	}
}
