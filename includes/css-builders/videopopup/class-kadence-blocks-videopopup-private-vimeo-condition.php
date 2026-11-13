<?php
/**
 * Tells whether the video is a private Vimeo video.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/class-kadence-blocks-css-input-condition.php';

/**
 * Tells whether the video is a private Vimeo video.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Private_Vimeo_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the URL is a Vimeo one and the video is marked private.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$url     = $input->attribute( 'url' );
		$private = $input->attribute( 'isVimeoPrivate' );

		if ( null === $url || null === $private ) {
			return false;
		}

		return false !== strpos( $url, 'vimeo.com/' ) && $private;
	}
}
