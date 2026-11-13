<?php
/**
 * Advanced Buttons button background.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the background of a button: a gradient, transparent or a color with its opacity.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Background_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the background.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		if ( 'gradient' === $input->attribute( 'backgroundType' ) ) {
			$css->add_property( 'background', ( new Kadence_Blocks_Css_Stops_Gradient() )->value( $css, $input->attribute( 'gradient' ), $this->first_color( $input ) ) );
			return;
		}

		$background = $input->attribute( 'background' );

		if ( empty( $background ) ) {
			return;
		}

		if ( 'transparent' === $background ) {
			$css->add_property( 'background', 'transparent' );
			return;
		}

		$css->add_property( 'background', $css->render_color( $background, $this->opacity( $input ) ) );
	}

	/**
	 * The first color of the gradient: transparent white when no color was chosen.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return string
	 */
	private function first_color( Kadence_Blocks_Css_Build_Input $input ) {
		$background = $input->attribute( 'background' );

		if ( null === $background || 'transparent' === $background ) {
			return 'rgba(255,255,255,0)';
		}

		return $input->css()->render_color( $background, $this->opacity( $input ) );
	}

	/**
	 * The opacity of the background color, or full opacity when none was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return mixed
	 */
	private function opacity( Kadence_Blocks_Css_Build_Input $input ) {
		$opacity = $input->attribute( 'backgroundOpacity' );

		return is_numeric( $opacity ) ? $opacity : 1;
	}
}
