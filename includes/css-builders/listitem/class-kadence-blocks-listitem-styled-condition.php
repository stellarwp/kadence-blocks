<?php
/**
 * Tells whether the item has a style other than the default one, which is the only one with a background and a border.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the item has a style other than the default one, which is the only one with a
 * background and a border.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Styled_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the style is set and is not the default.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$style = $input->attribute( 'style' );

		return ! empty( $style ) && 'default' !== $style;
	}
}
