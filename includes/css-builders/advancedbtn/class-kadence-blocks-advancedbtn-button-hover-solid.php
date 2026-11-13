<?php
/**
 * Advanced Buttons solid hover.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the hover background of a button that is not a gradient, and hides its overlay.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Hover_Solid_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the hover.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->set_selector( str_replace( [ '{id}', '{key}' ], [ $input->unique_id(), $input->derived( 'key' ) ], '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button::before' ) );
		$css->add_property( 'display', 'none' );
		$css->set_selector( implode( ', ', str_replace( [ '{id}', '{key}' ], [ $input->unique_id(), $input->derived( 'key' ) ], [ '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button:hover', '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button:focus' ] ) ) );

		$this->write_background( $input );

		( new Kadence_Blocks_Css_Legacy_Shadow_Section(
			'boxShadowHover',
			[
				'hOffset' => '2',
				'vOffset' => '2',
				'blur'    => '3',
				'spread'  => '0',
				'color'   => '#000000',
				'opacity' => 0.4,
			],
			true 
		) )->write( $input );
	}

	/**
	 * Write the hover background: the chosen color, or a dark default unless the button inherits its
	 * styles.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_background( Kadence_Blocks_Css_Build_Input $input ): void {
		$css     = $input->css();
		$hover   = $input->attribute( 'backgroundHover' );
		$opacity = $input->attribute( 'backgroundHoverOpacity' );
		$alpha   = is_numeric( $opacity ) ? $opacity : 1;

		if ( ! empty( $hover ) ) {
			$css->add_property( 'background', $css->render_color( $hover, $alpha ) );
			return;
		}

		if ( 'inherit' !== $input->attribute( 'inheritStyles' ) ) {
			$css->add_property( 'background', $css->render_color( '#444444', $alpha ) );
		}
	}
}
