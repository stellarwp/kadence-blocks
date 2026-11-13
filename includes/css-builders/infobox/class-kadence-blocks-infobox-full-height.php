<?php
/**
 * Makes the info box as high as the column it is in.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-infobox-selector.php';

/**
 * Makes the info box as high as the column it is in.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Full_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->attribute( 'fullHeight' ) ) ) {
			return;
		}

		$css = $input->css();

		Kadence_Blocks_Infobox_Selector::set( $input, '{base}' );
		$css->add_property( 'height', '100%' );
		Kadence_Blocks_Infobox_Selector::set( $input, '.wp-block-kadence-column.kb-section-dir-horizontal > .kt-inside-inner-col > {base}' );
		$css->add_property( 'height', 'auto' );
		$css->add_property( 'align-self', 'stretch' );
	}
}
