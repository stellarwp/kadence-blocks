<?php
/**
 * Writes the value of a device with the unit that was saved next to it, or pixels.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the value of a device with the unit that was saved next to it, or pixels.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Indexed_Unit_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the values of every device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The index of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

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
	 * @param string $property       The CSS property.
	 * @param string $attribute      The attribute that stores the values of every device.
	 * @param int    $index          The index of the device.
	 * @param string $unit_attribute The attribute that stores the unit.
	 */
	public function __construct( $property, $attribute, $index, $unit_attribute ) {
		$this->property       = $property;
		$this->attribute      = $attribute;
		$this->index          = $index;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the value.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( $this->property, $input->item( $this->attribute, $this->index ), $input->attribute( $this->unit_attribute, 'px' ) );
	}
}
