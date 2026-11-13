<?php
/**
 * Writes a size of the header row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes a property with the value of an attribute and the unit another attribute stores, pixels when there is none.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Row_Dimension_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the size.
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
	 * @param string $property The CSS property.
	 * @param string $attribute The attribute that stores the size.
	 * @param string $unit_attribute The attribute that stores the unit.
	 */
	public function __construct( string $property, string $attribute, string $unit_attribute ) {
		$this->property       = $property;
		$this->attribute      = $attribute;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$unit = $input->attribute( $this->unit_attribute );

		$input->css()->add_property( $this->property, $input->attribute( $this->attribute ) . ( ! empty( $unit ) ? $unit : 'px' ) );
	}
}
