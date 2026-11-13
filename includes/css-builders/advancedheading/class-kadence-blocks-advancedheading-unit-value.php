<?php
/**
 * Writes a value that is not empty, with its unit.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a value that is not empty, with its unit.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Unit_Value_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the value, or the list of values.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The position in the list, or null if the attribute is not a list.
	 *
	 * @since TBD
	 *
	 * @var int|null
	 */
	private $index;

	/**
	 * The attribute that stores the unit, if any.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $unit_attribute;

	/**
	 * The unit when the block saved none.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $fallback_unit;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $property       The CSS property.
	 * @param string      $attribute      The attribute that stores the value, or the list of values.
	 * @param int|null    $index          The position in the list, or null if the attribute is not a list.
	 * @param string|null $unit_attribute The attribute that stores the unit, if any.
	 * @param string      $fallback_unit  The unit when the block saved none.
	 */
	public function __construct( $property, $attribute, $index, $unit_attribute, $fallback_unit ) {
		$this->property       = $property;
		$this->attribute      = $attribute;
		$this->index          = $index;
		$this->unit_attribute = $unit_attribute;
		$this->fallback_unit  = $fallback_unit;
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
		$value = null === $this->index ? $input->attribute( $this->attribute ) : $input->item( $this->attribute, $this->index );
		$unit  = null === $this->unit_attribute ? $this->fallback_unit : $input->attribute( $this->unit_attribute, $this->fallback_unit );

		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( $this->property, $value, $unit );
	}
}
