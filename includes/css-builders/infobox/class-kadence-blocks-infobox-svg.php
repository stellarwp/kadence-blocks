<?php
/**
 * Writes the size and the colors of an SVG image.
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
 * Writes the size and the colors of an SVG image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Svg_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the SVG.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$media = $input->derived( 'media' );
		$css   = $input->css();
		$width = $media->image()['maxWidth'] ?? null;

		if ( ! empty( $width ) ) {
			Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-media .kt-info-box-image' );
			$css->add_property( 'width', $width . 'px' );
			$css->add_property( 'height', 'auto' );
		}

		$this->write_fill( $input, $media->icon()['color'] ?? null, '{base} .kt-blocks-info-box-media .kt-info-box-image, {base} .kt-blocks-info-box-media .kt-info-box-image path' );
		$this->write_fill( $input, $media->icon()['hoverColor'] ?? null, '{base} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media .kt-info-box-image, {base} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media .kt-info-box-image path' );
	}

	/**
	 * Fill the drawing with a color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param mixed                          $color    The saved color.
	 * @param string                         $selector The selector.
	 *
	 * @return void
	 */
	private function write_fill( Kadence_Blocks_Css_Build_Input $input, $color, $selector ): void {
		if ( empty( $color ) ) {
			return;
		}

		Kadence_Blocks_Infobox_Selector::set( $input, $selector );
		$input->css()->add_property( 'fill', $color );
	}
}
