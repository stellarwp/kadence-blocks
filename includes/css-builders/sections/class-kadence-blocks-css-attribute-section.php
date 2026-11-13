<?php
/**
 * Writes an attribute as the value of a property.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';

/**
 * Writes the stored value of an attribute as it is, unless it is missing.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Attribute_Section implements Kadence_Blocks_Css_Section {

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
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param string $attribute The attribute.
	 */
	public function __construct( string $property, string $attribute ) {
		$this->property  = $property;
		$this->attribute = $attribute;
	}

	/**
	 * Write the property.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->add_property( $this->property, $input->attribute( $this->attribute ) );
	}
}
