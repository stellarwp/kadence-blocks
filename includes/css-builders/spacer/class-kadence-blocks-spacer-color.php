<?php
/**
 * Writes the color of the divider, with its opacity.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the color of the divider, with its opacity.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$color = $input->attribute( 'dividerColor' );

		if ( empty( $color ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'border-top-color', $css->render_color( $color, $this->alpha( $input->attribute( 'dividerOpacity' ) ) ) );
	}

	/**
	 * The alpha of the color, written the way the editor always wrote it.
	 *
	 * @since TBD
	 *
	 * @param int|float|string|null $saved The opacity the editor saved.
	 */
	private function alpha( $saved ) {
		$opacity = is_numeric( $saved ) ? $saved : 100;

		if ( $opacity < 10 ) {
			return '0.0' . $opacity;
		}

		return $opacity >= 100 ? '1' : '0.' . $opacity;
	}
}
