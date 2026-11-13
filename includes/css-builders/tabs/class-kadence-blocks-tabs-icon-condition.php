<?php
/**
 * Tells whether one of the tab titles has an icon.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether one of the tab titles has an icon.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Icon_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the titles are set and one of them has an icon.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$titles = $input->attribute( 'titles' );

		return null !== $titles && (bool) array_filter( array_column( $titles, 'icon' ) );
	}
}
