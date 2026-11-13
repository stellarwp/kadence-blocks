<?php
/**
 * Show more fade out.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Fades the end of the content out with a mask.
 *
 * @since TBD
 */
final class Kadence_Blocks_Show_More_Fade_Out implements Kadence_Blocks_Css_Section {

	/**
	 * Write the masks.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css      = $input->css();
		$fade_out = $input->attribute( 'fadeOutSize' );
		$mask     = 'linear-gradient(to bottom, black ' . ( null !== $fade_out ? abs( $fade_out - 100 ) : 50 ) . '%, transparent 100%)';

		$css->add_property( '-webkit-mask-image', $mask );
		$css->add_property( 'mask-image', $mask );
	}
}
