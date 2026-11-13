<?php
/**
 * Writes a color that has an opacity of its own.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes a color that has an opacity of its own.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Alpha_Color_Section implements Kadence_Blocks_Css_Section {

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
	 * The attribute that stores the opacity.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $opacity;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property  The CSS property.
	 * @param string $attribute The attribute that stores the color.
	 * @param string $opacity   The attribute that stores the opacity.
	 */
	public function __construct( $property, $attribute, $opacity ) {
		$this->property  = $property;
		$this->attribute = $attribute;
		$this->opacity   = $opacity;
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

		if ( empty( $color ) ) {
			return;
		}

		$opacity = $input->attribute( $this->opacity );

		$input->css()->add_property( $this->property, $input->css()->render_color( $color, is_numeric( $opacity ) ? $opacity : 1 ) );
	}
}
