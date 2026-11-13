<?php
/**
 * Draws the border of the media on hover.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-infobox-selector.php';

/**
 * Draws the border of the media on hover.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Draw_Border_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the border.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$style = $input->derived( 'media' )->style();
		$css   = $input->css();
		$width = is_array( $style['borderWidth'] ?? null ) ? $style['borderWidth'][0] : null;
		$color = ! empty( $style['hoverBorder'] ) ? $css->render_color( $style['hoverBorder'] ) : '#444444';

		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media' );
		$css->add_property( 'border-width', '0px' );
		$this->write_shadow( $input, $style, $width );
		$this->write_corners( $input, $style, $width );
		$this->write_after( $input, $color, $width );

		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before' );
		$css->add_property( 'border-top-color', $color );
		$css->add_property( 'border-right-color', $color );
		$css->add_property( 'border-bottom-color', $color );
	}

	/**
	 * Draw the border with an inset shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param array                          $style The style of the media.
	 * @param mixed                          $width The width of the border, or null when it has none.
	 *
	 * @return void
	 */
	private function write_shadow( Kadence_Blocks_Css_Build_Input $input, array $style, $width ): void {
		if ( null === $width ) {
			return;
		}

		$input->css()->add_property( 'box-shadow', 'inset 0 0 0 ' . $width . 'px ' . ( ! empty( $style['border'] ) ? $style['border'] : '#444444' ) );
	}

	/**
	 * Round the parts that draw the border, and give them the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param array                          $style The style of the media.
	 * @param mixed                          $width The width of the border, or null when it has none.
	 *
	 * @return void
	 */
	private function write_corners( Kadence_Blocks_Css_Build_Input $input, array $style, $width ): void {
		$css = $input->css();

		if ( ! empty( $style['borderRadius'] ) ) {
			Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, {base} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after' );
			$css->add_property( 'border-radius', $style['borderRadius'] . 'px' );
		}

		if ( null !== $width ) {
			Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before' );
			$css->add_property( 'border-width', $width . 'px' );
		}
	}

	/**
	 * Color and size the border the hovered media draws last.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string                         $color The color of the border.
	 * @param mixed                          $width The width of the border, or null when it has none.
	 *
	 * @return void
	 */
	private function write_after( Kadence_Blocks_Css_Build_Input $input, $color, $width ): void {
		if ( null === $width ) {
			return;
		}

		$css = $input->css();

		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after' );
		$css->add_property( 'border-right-color', $color );
		$css->add_property( 'border-right-width', $width . 'px' );
		$css->add_property( 'border-top-width', $width . 'px' );
		$css->add_property( 'border-bottom-width', $width . 'px' );
	}
}
