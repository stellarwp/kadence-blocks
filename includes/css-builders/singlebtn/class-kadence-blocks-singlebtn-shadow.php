<?php
/**
 * Writes the box shadow of a button: the editor shadow, or the reset of a button that paints its own shape.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-singlebtn-visible-shadow-condition.php';

/**
 * Writes the box shadow of a button: the editor shadow, or the reset of a button that paints its own
 * shape.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Shadow_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css        = $input->css();
		$context    = $input->context();
		$has_preset = $context->call( 'render_preset_shadow', $css, $input->attributes() );
		$condition  = new Kadence_Blocks_Singlebtn_Visible_Shadow_Condition( 'displayShadow', 'shadow' );

		if ( $condition->is_met( $input ) ) {
			$css->add_property( 'box-shadow', $context->call( 'render_button_shadow', $css, $condition->shadow( $input ) ) );
			return;
		}

		// Reset to `none` only when no preset claims this rule's box-shadow, so its variable is not silenced.
		if ( ! $has_preset && $context->call( 'paints_own_shape', $input->attributes() ) ) {
			$css->add_property( 'box-shadow', 'none' );
		}
	}
}
