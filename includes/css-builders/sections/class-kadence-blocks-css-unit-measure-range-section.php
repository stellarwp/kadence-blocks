<?php
/**
 * Writes a measure range with a unit of its own.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';

/**
 * Writes the sides of a range attribute, in the unit another attribute stores.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Unit_Measure_Range_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The range attribute.
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
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The range attribute.
	 * @param string $property The CSS property.
	 * @param string $unit_attribute The attribute that stores the unit.
	 */
	public function __construct( string $attribute, string $property, string $unit_attribute ) {
		$this->attribute      = $attribute;
		$this->property       = $property;
		$this->unit_attribute = $unit_attribute;
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
		$input->css()->render_measure_range( $input->attributes(), $this->attribute, $this->property, $input->attribute( $this->unit_attribute ) );
	}
}
