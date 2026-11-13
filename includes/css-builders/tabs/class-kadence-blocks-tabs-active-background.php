<?php
/**
 * Writes the background of the active tab title: the one saved, or white.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the background of the active tab title: the one saved, or white.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Active_Background_Css implements Kadence_Blocks_Css_Section {

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
		$css        = $input->css();
		$background = $input->attribute( 'titleBgActive' );

		$css->add_property( 'background', ! empty( $background ) ? $css->sanitize_color( $background ) : '#ffffff' );
	}
}
