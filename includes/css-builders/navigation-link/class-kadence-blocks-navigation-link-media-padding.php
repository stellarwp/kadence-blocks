<?php
/**
 * Navigation link media padding.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Navigation link media padding.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Link_Media_Padding implements Kadence_Blocks_Css_Section {

	/**
	 * Write the padding variables of the media container.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$style = $input->item( 'mediaStyle', 0 );

		if ( empty( $style ) ) {
			return;
		}

		$input->css()->render_measure_output(
			$style,
			'padding',
			'padding',
			[
				'desktop_key' => 'padding',
				'tablet_key'  => 'paddingTablet',
				'mobile_key'  => 'paddingMobile',
				'unit_key'    => 'paddingType',
				'first_prop'  => '--kb-nav-link-media-container-padding-top',
				'second_prop' => '--kb-nav-link-media-container-padding-right',
				'third_prop'  => '--kb-nav-link-media-container-padding-bottom',
				'fourth_prop' => '--kb-nav-link-media-container-padding-left',
			]
		);
	}
}
