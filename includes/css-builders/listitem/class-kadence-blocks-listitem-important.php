<?php
/**
 * Writes a property that overrides the style of the list, when its attribute is not empty.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a property that overrides the style of the list, when its attribute is not empty.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Important_Css implements Kadence_Blocks_Css_Section {

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
	 * What goes behind the value.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $suffix;

	/**
	 * Whether the value is a color.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $is_color;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property  The CSS property.
	 * @param string $attribute The attribute that stores the value.
	 * @param string $suffix    What goes behind the value.
	 * @param bool   $is_color  Whether the value is a color.
	 */
	public function __construct( $property, $attribute, $suffix, $is_color ) {
		$this->property  = $property;
		$this->attribute = $attribute;
		$this->suffix    = $suffix;
		$this->is_color  = $is_color;
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

		if ( empty( $value ) ) {
			return;
		}

		$value = $this->is_color ? $input->css()->render_color( $value ) : $value;

		$input->css()->add_property( $this->property, $value . $this->suffix );
	}
}
