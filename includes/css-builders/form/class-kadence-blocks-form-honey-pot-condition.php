<?php
/**
 * Tells whether the honey pot is switched on.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the honey pot is switched on.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Honey_Pot_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the editor never turned the honey pot off.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$pot = $input->attribute( 'honeyPot' );

		return null === $pot || ! empty( $pot );
	}
}
