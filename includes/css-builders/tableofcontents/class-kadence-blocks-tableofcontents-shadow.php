<?php
/**
 * Writes the box shadow of the table of contents.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the saved shadow, or the default one, when the shadow is on.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Shadow implements Kadence_Blocks_Css_Section {

	/**
	 * Write the shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$shadow = $input->attribute( 'shadow' );
		$css    = $input->css();

		if ( empty( $input->attribute( 'displayShadow' ) ) ) {
			return;
		}

		if ( is_array( $shadow ) && is_array( $shadow[0] ?? null ) ) {
			$css->add_property( 'box-shadow', $css->render_shadow( $shadow[0] ) );
			return;
		}

		$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
	}
}
