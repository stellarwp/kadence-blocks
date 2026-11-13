<?php
/**
 * Navigation link media intrinsic size.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Navigation link media intrinsic size.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Link_Media_Intrinsic implements Kadence_Blocks_Css_Section {

	/**
	 * Write the intrinsic size of the media when it has a ratio.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$ratio = $input->derived( 'ratio' );

		if ( ! $ratio->has_ratio() ) {
			return;
		}

		$attributes = $input->attributes();
		$width      = $attributes['mediaImage'][0]['width'];
		$css        = $input->css();

		$css->add_property( '--kb-nav-link-media-intrinsic-padding-bottom', $ratio->padding() );
		$css->add_property( '--kb-nav-link-media-intrinsic-height', '0px' );
		$css->add_property( '--kb-nav-link-media-intrinsic-width', ! is_numeric( $width ) ? null : $width . 'px' );
	}
}
