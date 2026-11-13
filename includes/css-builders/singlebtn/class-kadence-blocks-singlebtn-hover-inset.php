<?php
/**
 * Moves the hover shadow of a gradient button to its overlay when the shadow is an inset one.
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
 * Moves the hover shadow of a gradient button to its overlay when the shadow is an inset one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Hover_Inset_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the reset and move to the overlay.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$condition = new Kadence_Blocks_Singlebtn_Visible_Shadow_Condition( 'displayHoverShadow', 'shadowHover' );
		$gradient  = 'gradient' === $input->derived( 'bg_type' ) || 'gradient' === $input->derived( 'bg_hover_type' );

		if ( ! $gradient || ! $condition->is_met( $input ) || true !== ( $condition->shadow( $input )['inset'] ?? null ) ) {
			return;
		}

		$input->css()->add_property( 'box-shadow', 'none' );

		( new Kadence_Blocks_Css_Selector_Section( '.kb-btn{id}.kb-button:hover::before' ) )->write( $input );
	}
}
