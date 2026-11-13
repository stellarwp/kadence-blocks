<?php
/**
 * Tells whether the text fields have a style of their own.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the text fields have a style of their own.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Field_Style_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether any setting of the style of the fields was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( [ 'color', 'background', 'border' ] as $attribute ) {
			if ( ! empty( $input->attribute( $attribute ) ) ) {
				return true;
			}
		}

		return $this->has_setting( $input );
	}

	/**
	 * Whether the gradient, the shadow, the radius, the font or the border width was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function has_setting( Kadence_Blocks_Css_Build_Input $input ): bool {
		$shadow = $input->attribute( 'boxShadow' );
		$line   = $input->attribute( 'lineHeight' );
		$width  = $input->attribute( 'borderWidth' );

		return 'gradient' === $input->attribute( 'backgroundType' )
			|| ( is_array( $shadow ) && true === ( $shadow[0] ?? null ) )
			|| is_numeric( $input->attribute( 'borderRadius' ) )
			|| is_array( $input->attribute( 'fontSize' ) )
			|| ( is_array( $line ) && is_numeric( $line[0] ?? null ) )
			|| ( is_array( $width ) && is_numeric( $width[0] ?? null ) );
	}
}
