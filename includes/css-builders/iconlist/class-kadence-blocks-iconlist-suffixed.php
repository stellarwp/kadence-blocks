<?php
/**
 * Writes a property when its attribute is set, with a unit behind the value.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a property when its attribute is set, with a unit behind the value.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_Suffixed_Css implements Kadence_Blocks_Css_Section {

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
	 * The unit behind the value.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $suffix;

	/**
	 * The value when the attribute is not set, or null for nothing.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $fallback;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $property  The CSS property.
	 * @param string      $attribute The attribute that stores the value.
	 * @param string      $suffix    The unit behind the value.
	 * @param string|null $fallback  The value when the attribute is not set, or null for nothing.
	 */
	public function __construct( $property, $attribute, $suffix, $fallback ) {
		$this->property  = $property;
		$this->attribute = $attribute;
		$this->suffix    = $suffix;
		$this->fallback  = $fallback;
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
			$this->fallback_value( $input );
			return;
		}

		$input->css()->add_property( $this->property, $value . $this->suffix );
	}

	/**
	 * Write the fallback value, when there is one.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function fallback_value( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( null === $this->fallback ) {
			return;
		}

		$input->css()->add_property( $this->property, $this->fallback );
	}
}
