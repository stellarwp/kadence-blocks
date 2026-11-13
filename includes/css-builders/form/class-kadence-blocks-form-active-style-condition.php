<?php
/**
 * Tells whether the text fields have a style of their own when they are focused.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the text fields have a style of their own when they are focused.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Active_Style_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether any setting of the focus style was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( [ 'colorActive', 'backgroundActive', 'borderActive' ] as $attribute ) {
			if ( ! empty( $input->attribute( $attribute ) ) ) {
				return true;
			}
		}

		$shadow = $input->attribute( 'boxShadow' );

		return 'gradient' === $input->attribute( 'backgroundActiveType' ) || ( is_array( $shadow ) && true === ( $shadow[0] ?? null ) );
	}
}
