<?php
/**
 * Advanced Buttons button gap.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the space after a button, flipped for right to left languages.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Gap_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$gap = $input->attribute( 'gap' );

		if ( ! is_numeric( $gap ) ) {
			return;
		}

		$css = $input->css();

		$css->set_selector( '.kt-btns' . $input->unique_id() . ' .kt-btn-wrap-' . $input->derived( 'key' ) );
		$css->add_property( 'margin-right', $gap . 'px' );

		if ( is_rtl() ) {
			$this->write_rtl( $input, $gap );
		}
	}

	/**
	 * Write the gap on the other side for right to left languages.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param mixed                          $gap   The gap.
	 *
	 * @return void
	 */
	private function write_rtl( Kadence_Blocks_Css_Build_Input $input, $gap ): void {
		$css = $input->css();

		$css->set_selector( '.rtl .kt-btns' . $input->unique_id() . ' .kt-btn-wrap-' . $input->derived( 'key' ) );
		$css->add_property( 'margin-left', $gap . 'px' );
		$css->add_property( 'margin-right', '0px' );
	}
}
