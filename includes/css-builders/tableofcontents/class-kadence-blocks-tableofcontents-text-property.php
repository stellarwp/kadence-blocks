<?php
/**
 * Writes a property from a saved text value.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes a property as a string when the attribute was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Text_Property implements Kadence_Blocks_Css_Section {

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
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property  The CSS property.
	 * @param string $attribute The attribute that stores the value.
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
		$value = $input->attribute( $this->attribute );

		if ( null === $value ) {
			return;
		}

		$css = $input->css();
		$css->add_property( $this->property, $css->render_string( $value ) );
	}
}
