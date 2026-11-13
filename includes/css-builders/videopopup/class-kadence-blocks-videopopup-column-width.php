<?php
/**
 * Limits the width of the video popup inside a horizontal column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Limits the width of the video popup inside a horizontal column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Column_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the maximum width in pixels and the full width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->add_property( 'max-width', $input->attribute( 'maxWidth' ) . 'px' );
		$css->add_property( 'width', '100%' );
	}
}
