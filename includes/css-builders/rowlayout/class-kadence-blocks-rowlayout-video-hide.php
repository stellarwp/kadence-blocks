<?php
/**
 * Hides the background video and slider of the row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-background-facts.php';

/**
 * Hides the background video and slider of the row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Video_Hide_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the rule.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( 'normal' === ( new Kadence_Blocks_Rowlayout_Background_Facts( $input ) )->type() ) {
			return;
		}

		Kadence_Blocks_Rowlayout_Selector::set( $input, '{base} .kb-blocks-bg-video-container,{base} .kb-blocks-bg-slider' );
		$input->css()->add_property( 'display', 'none' );
	}
}
