<?php
/**
 * Writes the background of the info box container.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the background of the info box container.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Container_Background_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the background.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$background = $input->attribute( 'containerBackground' );
		$opacity    = $input->attribute( 'containerBackgroundOpacity' );
		$css        = $input->css();
		$alpha      = is_numeric( $opacity ) ? $opacity : 1;

		if ( ! empty( $background ) ) {
			$css->add_property( 'background', $css->render_color( $background, $alpha ) );
			return;
		}

		if ( is_numeric( $opacity ) ) {
			$css->add_property( 'background', $css->render_color( '#f2f2f2', $alpha ) );
		}
	}
}
