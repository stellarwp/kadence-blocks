<?php
/**
 * Whether the link is disabled and does not open its dropdown on click.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether the link is disabled and does not open its dropdown on click.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Link_Disabled_Link_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the condition is met.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$attributes = $input->attributes();

		return ! empty( $attributes['disableLink'] ) && true === $attributes['disableLink'] && ! $attributes['dropdownClick'];
	}
}
