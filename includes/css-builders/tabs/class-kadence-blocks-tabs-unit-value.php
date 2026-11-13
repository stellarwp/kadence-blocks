<?php
/**
 * Writes a value with its unit, when there is one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a value with its unit, when there is one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Unit_Value_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the value.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The unit when the editor saved none.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $default_unit;

	/**
	 * The attribute that stores the unit, if any.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $unit_attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $property       The CSS property.
	 * @param string      $attribute      The attribute that stores the value.
	 * @param string      $default_unit   The unit when the editor saved none.
	 * @param string|null $unit_attribute The attribute that stores the unit, if any.
	 */
	public function __construct( $property, $attribute, $default_unit, $unit_attribute ) {
		$this->property       = $property;
		$this->attribute      = $attribute;
		$this->default_unit   = $default_unit;
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
		$unit = null === $this->unit_attribute ? $this->default_unit : $input->attribute( $this->unit_attribute, $this->default_unit );

		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( $this->property, $input->attribute( $this->attribute ), $unit );
	}
}
