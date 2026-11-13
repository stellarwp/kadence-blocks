<?php
/**
 * Writes a color the block, the theme or a color class may own.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a color the block, the theme or a color class may own.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Themed_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The attribute that stores the color class.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $class_attribute;

	/**
	 * The attribute that turns the color into a gradient.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $gradient_attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property           The CSS property.
	 * @param string $attribute          The attribute that stores the color.
	 * @param string $class_attribute    The attribute that stores the color class.
	 * @param string $gradient_attribute The attribute that turns the color into a gradient.
	 */
	public function __construct( $property, $attribute, $class_attribute, $gradient_attribute ) {
		$this->property           = $property;
		$this->attribute          = $attribute;
		$this->class_attribute    = $class_attribute;
		$this->gradient_attribute = $gradient_attribute;
	}

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$color = $input->attribute( $this->attribute );

		if ( empty( $color ) || ! empty( $input->attribute( $this->gradient_attribute ) ) ) {
			return;
		}

		$palette = ! class_exists( 'Kadence\Theme' ) && 0 === strpos( $color, 'palette' );

		if ( $palette || empty( $input->attribute( $this->class_attribute ) ) ) {
			$input->css()->add_property( $this->property, $input->css()->render_color( $color ) );
		}
	}
}
