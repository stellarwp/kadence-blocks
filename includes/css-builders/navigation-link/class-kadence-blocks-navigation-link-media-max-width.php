<?php
/**
 * Navigation link media max width.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Navigation link media max width.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Link_Media_Max_Width implements Kadence_Blocks_Css_Section {

	/**
	 * Write the largest width of the media.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$attributes = $input->attributes();

		$input->css()->add_property( '--kb-nav-link-media-max-width', $attributes['mediaImage'][0]['maxWidth'] . 'px' );
	}
}
