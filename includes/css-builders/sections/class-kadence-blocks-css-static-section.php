<?php
/**
 * Writes one property with a value that never changes.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes one property with a value that never changes.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Static_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The value.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $value;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property.
	 * @param string $value    The value.
	 */
	public function __construct( $property, $value ) {
		$this->property = $property;
		$this->value    = $value;
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
		$input->css()->add_property( $this->property, $this->value );
	}
}
