<?php
/**
 * Tells whether a fixed width submit button hands its styles to the field around it.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether a fixed width submit button hands its styles to the field around it.
 *
 * @since TBD
 */
final class Kadence_Blocks_Submit_Inherit_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the width is fixed and the styles are inherited.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return 'fixed' === $input->derived( 'width_type' ) && ! empty( $input->attribute( 'inheritStyles' ) ) && 'inherit' === $input->attribute( 'inheritStyles' );
	}
}
