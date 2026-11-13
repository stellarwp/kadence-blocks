<?php
/**
 * Writes a value that has one number for each device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a value that has one number for each device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Responsive_Range_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the numbers.
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
	 * @param string $attribute      The attribute that stores the numbers.
	 * @param string $property       The CSS property.
	 * @param string $unit_attribute The attribute that stores the unit.
	 */
	public function __construct( $attribute, $property, $unit_attribute ) {
		$this->attribute      = $attribute;
		$this->property       = $property;
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
		$input->css()->render_responsive_range( $input->attributes(), $this->attribute, $this->property, $this->unit_attribute );
	}
}
