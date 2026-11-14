<?php
/**
 * Writes a responsive range attribute, such as a width or a size, with its unit.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes a responsive range attribute, such as a width or a size, with its unit.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Responsive_Range_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the range.
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
	 * @param string $attribute      The attribute that stores the range.
	 * @param string $property       The CSS property.
	 * @param string $unit_attribute The attribute that stores the unit.
	 */
	public function __construct( $attribute, $property, $unit_attribute ) {
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
		$input->css()->render_responsive_range( $input->attributes(), $this->attribute, $this->property, $this->unit_attribute );
	}
}
