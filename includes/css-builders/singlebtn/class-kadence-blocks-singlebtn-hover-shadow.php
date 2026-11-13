<?php
/**
 * Writes the hover box shadow of a button: the editor shadow, or the preset hover shadow of a button that paints its own shape.
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
 * Writes the hover box shadow of a button: the editor shadow, or the preset hover shadow of a button
 * that paints its own shape.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Hover_Shadow_Css implements Kadence_Blocks_Css_Section {

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
		$css       = $input->css();
		$context   = $input->context();
		$condition = new Kadence_Blocks_Singlebtn_Visible_Shadow_Condition( 'displayHoverShadow', 'shadowHover' );

		if ( $condition->is_met( $input ) ) {
			$css->add_property( 'box-shadow', $context->call( 'render_button_shadow', $css, $condition->shadow( $input ) ) );
			return;
		}

		if ( $context->call( 'paints_own_shape', $input->attributes() ) ) {
			$css->add_property( 'box-shadow', 'var(--kb-btn-shadow-hover, none)' );
		}
	}
}
