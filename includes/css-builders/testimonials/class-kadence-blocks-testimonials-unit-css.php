<?php
/**
 * Writes a value with a unit, using one of the writers of the CSS.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a value with a unit, using one of the writers of the CSS.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Unit_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The method of the writer: `not_empty_with_unit` or `numeric_with_unit`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $writer_method;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The unit.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $writer_method The method of the writer: `not_empty_with_unit` or `numeric_with_unit`.
	 * @param string $property      The CSS property.
	 * @param string $attribute     The attribute.
	 * @param string $unit          The unit.
	 */
	public function __construct( $writer_method, $property, $attribute, $unit ) {
		$this->writer_method = $writer_method;
		$this->property      = $property;
		$this->attribute     = $attribute;
		$this->unit          = $unit;
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
		$method = $this->writer_method;

		( new Kadence_Blocks_Css_Writer( $input->css() ) )->$method( $this->property, $input->attribute( $this->attribute ), $this->unit );
	}
}
