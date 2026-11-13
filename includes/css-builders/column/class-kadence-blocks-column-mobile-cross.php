<?php
/**
 * Writes the horizontal alignment of a mobile column that flows from top to bottom.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector-css.php';
require_once __DIR__ . '/class-kadence-blocks-column-device.php';
require_once __DIR__ . '/class-kadence-blocks-column-layout.php';
require_once __DIR__ . '/class-kadence-blocks-column-flex-values.php';

/**
 * Writes the horizontal alignment of a mobile column that flows from top to bottom.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Mobile_Cross_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$layout = $input->derived( 'layout' );
		$css    = $input->css();

		if ( $this->needs_stretch( $input ) ) {
			$css->add_property( 'align-items', 'stretch' );
		}

		if ( ! $this->needs_stretch( $input ) && ! empty( $layout->device( 2 )->horizontal_align() ) ) {
			$css->add_property( 'align-items', $layout->device( 2 )->horizontal_align() );
		}

		if ( $layout->device( 1 )->is_horizontal() ) {
			$css->add_property( 'flex-wrap', 'nowrap' );
		}
	}

	/**
	 * Whether the content stretches: a larger device flows across and no smaller device aligned it.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function needs_stretch( Kadence_Blocks_Css_Build_Input $input ): bool {
		$layout  = $input->derived( 'layout' );
		$mobile  = empty( $input->item( 'justifyContent', 2 ) );
		$tablet  = empty( $input->item( 'justifyContent', 1 ) );
		$across  = $layout->device( 1 )->is_horizontal() && $mobile;
		$desktop = $layout->device( 0 )->is_horizontal() && $tablet && $mobile;

		return $across || $desktop;
	}
}
