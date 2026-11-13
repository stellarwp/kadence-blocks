<?php
/**
 * Advanced Buttons typography.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font settings shared by every button.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Typography_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attributes that switch the typography on when any of them was saved.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const TRIGGERS = [ 'typography', 'textTransform', 'fontWeight', 'fontStyle' ];

	/**
	 * Write the typography when any font setting was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( self::TRIGGERS as $key ) {
			if ( null !== $input->attribute( $key ) ) {
				$this->write_typography( $input );
				return;
			}
		}
	}

	/**
	 * Write the font family, weight, style and text transform.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_typography( Kadence_Blocks_Css_Build_Input $input ): void {
		$css    = $input->css();
		$writer = new Kadence_Blocks_Css_Writer( $css );
		$family = $input->attribute( 'typography' );

		$css->set_selector( '.kt-btns' . $input->unique_id() . ' .kt-button' );

		if ( ! empty( $family ) ) {
			$css->add_property( 'font-family', $css->render_font_family( $family ) );
		}

		$writer->not_empty_font_weight( 'font-weight', $input->attribute( 'fontWeight' ) );
		$writer->not_empty( 'font-style', $input->attribute( 'fontStyle' ) );
		$writer->not_empty( 'text-transform', $input->attribute( 'textTransform' ) );
	}
}
