<?php
/**
 * Writes the hover overlay of a gradient button, and of a button with a gradient hover.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the hover overlay of a gradient button, and of a button with a gradient hover.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Hover_Before_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selector of the overlay.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SELECTOR = '.kb-btn{id}.kb-button::before';

	/**
	 * Write the overlay.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$this->write_solid( $input );
		$this->write_gradient( $input );
	}

	/**
	 * Write the hover color of a gradient button as its overlay.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_solid( Kadence_Blocks_Css_Build_Input $input ): void {
		$background = $input->attribute( 'backgroundHover' );

		if ( 'gradient' !== $input->derived( 'bg_type' ) || 'normal' !== $input->derived( 'bg_hover_type' ) || empty( $background ) ) {
			return;
		}

		$css = $input->css();

		( new Kadence_Blocks_Css_Selector_Section( self::SELECTOR ) )->write( $input );

		$css->add_property( 'background', $css->render_color( $background ) );
		$css->add_property( 'transition', 'opacity .3s ease-in-out' );
	}

	/**
	 * Write the hover gradient as the overlay.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_gradient( Kadence_Blocks_Css_Build_Input $input ): void {
		$gradient = $input->attribute( 'gradientHover' );

		if ( 'gradient' !== $input->derived( 'bg_hover_type' ) || empty( $gradient ) ) {
			return;
		}

		$css = $input->css();

		( new Kadence_Blocks_Css_Selector_Section( self::SELECTOR ) )->write( $input );

		$css->add_property( 'background', $gradient );
		$css->add_property( 'transition', 'opacity .3s ease-in-out' );
	}
}
