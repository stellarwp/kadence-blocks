<?php
/**
 * Writes the maximum width of the table of contents.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the maximum width in its unit.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Max_Width implements Kadence_Blocks_Css_Section {

	/**
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$width = $input->attribute( 'maxWidth' );

		if ( empty( $width ) ) {
			return;
		}

		$css = $input->css();
		$css->add_property( 'max-width', $css->render_number( $width, $input->attribute( 'maxWidthType', 'px' ) ) );
	}
}
