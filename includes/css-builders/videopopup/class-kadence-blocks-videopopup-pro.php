<?php
/**
 * Lets the Pro video popup block add its CSS.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/videopopup/class-kadence-blocks-videopopup-environment.php';

/**
 * Lets the Pro video popup block add its CSS.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Pro_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Run the Pro CSS builder when Pro is active.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$pro_block = $input->derived( 'environment' )->pro_block();

		if ( null === $pro_block ) {
			return;
		}

		$pro_block->build_css( $input->attributes(), $input->css(), $input->unique_id(), $input->unique_style_id() );
	}
}
