<?php
/**
 * Tells whether the submit button has an inset shadow on hover.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the submit button has an inset shadow on hover.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Hover_Inset_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the hover shadow is switched on and inset.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$shadow = $input->attribute( 'boxShadowHover' );

		return is_array( $shadow ) && true === ( $shadow[0] ?? null ) && true === ( $shadow[7] ?? null );
	}
}
