<?php
/**
 * Writes a size that is saved for every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a size that is saved for every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Range_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the size.
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
	 * The attribute that stores the unit, if any.
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
	 * @param string $attribute      The attribute that stores the size.
	 * @param string $property       The CSS property.
	 * @param string $unit_attribute The attribute that stores the unit, if any.
	 */
	public function __construct( $attribute, $property, $unit_attribute = '' ) {
		$this->attribute      = $attribute;
		$this->property       = $property;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the size of every device.
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
