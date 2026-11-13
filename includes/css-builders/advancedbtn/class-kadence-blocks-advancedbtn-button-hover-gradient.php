<?php
/**
 * Advanced Buttons gradient hover.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the hover of a gradient button on its overlay, which fades in over the normal background.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Hover_Gradient_Css implements Kadence_Blocks_Css_Section {

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
		$css = $input->css();

		$css->set_selector( str_replace( [ '{id}', '{key}' ], [ $input->unique_id(), $input->derived( 'key' ) ], '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button::before' ) );
		$css->add_property( 'transition', 'opacity .3s ease-in-out' );

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
		$this->write_radius( $input );
	}

	/**
	 * Write the hover background: a gradient, or a color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_background( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		if ( 'gradient' === $input->attribute( 'backgroundHoverType' ) ) {
			$css->add_property( 'background', ( new Kadence_Blocks_Css_Stops_Gradient() )->value( $css, $input->attribute( 'gradientHover' ), $this->first_color( $input ) ) );
			return;
		}

		$hover = $input->attribute( 'backgroundHover' );

		if ( ! empty( $hover ) ) {
			$css->add_property( 'background', $css->render_color( $hover, $this->opacity( $input ) ) );
		}
	}

	/**
	 * The first color of the hover gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return string
	 */
	private function first_color( Kadence_Blocks_Css_Build_Input $input ) {
		return $input->css()->render_color( $input->attribute( 'backgroundHover', '#444444' ), $this->opacity( $input ) );
	}

	/**
	 * The opacity of the hover background, or full opacity when none was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return mixed
	 */
	private function opacity( Kadence_Blocks_Css_Build_Input $input ) {
		$opacity = $input->attribute( 'backgroundHoverOpacity' );

		return is_numeric( $opacity ) ? $opacity : 1;
	}

	/**
	 * Round the overlay of a button that has an inset hover shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_radius( Kadence_Blocks_Css_Build_Input $input ): void {
		$shadow = $input->attribute( 'boxShadowHover' );

		if ( ! is_array( $shadow ) || true !== ( $shadow[0] ?? null ) || true !== ( $shadow[7] ?? null ) ) {
			return;
		}

		$radius = $input->attribute( 'borderRadius' );

		$input->css()->add_property( 'border-radius', ( is_numeric( $radius ) ? $radius : '3' ) . 'px' );
	}
}
