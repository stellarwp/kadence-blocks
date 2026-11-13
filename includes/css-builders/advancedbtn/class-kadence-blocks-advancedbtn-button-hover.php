<?php
/**
 * Advanced Buttons button hover.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advancedbtn-button-type.php';
require_once __DIR__ . '/class-kadence-blocks-advancedbtn-button-hover-gradient.php';
require_once __DIR__ . '/class-kadence-blocks-advancedbtn-button-hover-solid.php';

/**
 * Writes the hover and focus state of a button.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Hover_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the hover state.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css    = $input->css();
		$writer = new Kadence_Blocks_Css_Writer( $css );

		$css->set_selector( implode( ', ', str_replace( [ '{id}', '{key}' ], [ $input->unique_id(), $input->derived( 'key' ) ], [ '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button:hover', '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button:focus' ] ) ) );
		$writer->not_empty_color( 'color', $input->attribute( 'colorHover' ) );

		$this->write_border( $input );

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
			false 
		) )->write( $input );

		$this->type_section( $input )->write( $input );
	}

	/**
	 * Write the hover border color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_border( Kadence_Blocks_Css_Build_Input $input ): void {
		$border = $input->attribute( 'borderHover' );

		if ( empty( $border ) ) {
			return;
		}

		$opacity = $input->attribute( 'borderHoverOpacity' );

		$input->css()->add_property( 'border-color', $input->css()->render_color( $border, is_numeric( $opacity ) ? $opacity : 1 ) );
	}

	/**
	 * The section that writes the rest of the hover: the gradient overlay, or the solid color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function type_section( Kadence_Blocks_Css_Build_Input $input ) {
		if ( ( new Kadence_Blocks_Advancedbtn_Button_Type() )->is_gradient( $input ) ) {
			return new Kadence_Blocks_Advancedbtn_Button_Hover_Gradient_Css();
		}

		return new Kadence_Blocks_Advancedbtn_Button_Hover_Solid_Css();
	}
}
