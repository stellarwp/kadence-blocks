<?php
/**
 * Tells whether the list text has styles.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the list text has styles.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_List_Styles_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the first entry of the list styles holds settings.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return is_array( $input->attribute( 'listStyles' ) ) && is_array( $input->item( 'listStyles', 0 ) );
	}
}
