<?php
/**
 * Writes the value of an attribute as it is.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the value of an attribute as it is.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Attribute_Property_Css implements Kadence_Blocks_Css_Section {

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
	 * Whether an empty value is left out.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $filled;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property  The CSS property.
	 * @param string $attribute The attribute that stores the value.
	 * @param bool   $filled    Whether an empty value is left out.
	 */
	public function __construct( $property, $attribute, $filled ) {
		$this->property  = $property;
		$this->attribute = $attribute;
		$this->filled    = $filled;
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
		$value = $input->attribute( $this->attribute );

		if ( $this->filled && empty( $value ) ) {
			return;
		}

		$input->css()->add_property( $this->property, $value );
	}
}
