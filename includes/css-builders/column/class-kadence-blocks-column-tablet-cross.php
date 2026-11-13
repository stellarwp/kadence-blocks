<?php
/**
 * Writes the horizontal alignment of a tablet column that flows from top to bottom.
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
 * Writes the horizontal alignment of a tablet column that flows from top to bottom.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Tablet_Cross_Css implements Kadence_Blocks_Css_Section {

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
		$flows_across = $input->derived( 'layout' )->device( 0 )->is_horizontal();

		$this->write_align( $input, $flows_across );

		if ( $flows_across ) {
			$input->css()->add_property( 'flex-wrap', 'nowrap' );
		}
	}

	/**
	 * Write the alignment: stretched when desktop flows across and tablet has no alignment of its own.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input        What the section needs to write its CSS.
	 * @param bool                           $flows_across Whether the column flows from left to right on desktop.
	 *
	 * @return void
	 */
	private function write_align( Kadence_Blocks_Css_Build_Input $input, $flows_across ): void {
		$css = $input->css();

		if ( $flows_across && empty( $input->item( 'justifyContent', 1 ) ) ) {
			$css->add_property( 'align-items', 'stretch' );
			return;
		}

		$align = $input->derived( 'layout' )->device( 1 )->horizontal_align();

		if ( ! empty( $align ) ) {
			$css->add_property( 'align-items', $align );
		}
	}
}
