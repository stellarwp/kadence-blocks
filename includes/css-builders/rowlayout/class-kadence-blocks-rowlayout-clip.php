<?php
/**
 * Clips the content of a row with rounded corners.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Clips the content of a row with rounded corners.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Clip_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the clip.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( false !== $input->attribute( 'borderRadiusOverflow' ) ) {
			$input->css()->add_property( 'overflow', 'clip' );
		}

		$input->css()->add_property( 'isolation', 'isolate' );
	}
}
