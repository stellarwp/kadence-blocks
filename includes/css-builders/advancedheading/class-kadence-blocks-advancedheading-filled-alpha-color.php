<?php
/**
 * Writes a color with its opacity, unless another attribute takes its place.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a color with its opacity, unless another attribute takes its place.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Filled_Alpha_Color_Css implements Kadence_Blocks_Css_Section {

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
	private $opacity_attribute;

	/**
	 * The attributes that take the place of the color when one is filled.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $blockers;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string   $property          The CSS property.
	 * @param string   $attribute         The attribute that stores the color.
	 * @param string   $opacity_attribute The attribute that stores the opacity.
	 * @param string[] $blockers          The attributes that take the place of the color when one is filled.
	 */
	public function __construct( $property, $attribute, $opacity_attribute, $blockers ) {
		$this->property          = $property;
		$this->attribute         = $attribute;
		$this->opacity_attribute = $opacity_attribute;
		$this->blockers          = $blockers;
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

		if ( empty( $color ) || $this->is_blocked( $input ) ) {
			return;
		}

		$opacity = $input->attribute( $this->opacity_attribute );
		$css     = $input->css();

		$css->add_property( $this->property, $css->render_color( $color, ! empty( $opacity ) ? $opacity : 1 ) );
	}

	/**
	 * Whether an attribute takes the place of the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function is_blocked( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( $this->blockers as $blocker ) {
			if ( ! empty( $input->attribute( $blocker ) ) ) {
				return true;
			}
		}

		return false;
	}
}
