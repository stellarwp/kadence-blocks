<?php
/**
 * Rounds the image of media that has padding.
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
 * Rounds the image of media that has padding.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Image_Radius_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the radius.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$style   = $input->derived( 'media' )->style();
		$radius  = $style['borderRadius'] ?? null;
		$padding = $style['padding'] ?? null;

		if ( empty( $radius ) || ! $this->has_padding( $padding ) ) {
			return;
		}

		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-media .kadence-info-box-image-intrisic img' );
		$input->css()->add_property( 'border-radius', $radius . ( $style['borderRadiusUnit'] ?? 'px' ) );
	}

	/**
	 * Whether any side of the padding is above zero.
	 *
	 * @since TBD
	 *
	 * @param mixed $padding The saved padding.
	 *
	 * @return bool
	 */
	private function has_padding( $padding ): bool {
		if ( ! is_array( $padding ) ) {
			return false;
		}

		foreach ( $padding as $side ) {
			if ( $side > 0 ) {
				return true;
			}
		}

		return false;
	}
}
