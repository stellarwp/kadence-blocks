<?php
/**
 * Writes the negative margins the breakout uses.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-breakout-values.php';

/**
 * Writes the negative margins the breakout uses.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Breakout_Variables_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the variables.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$values = $input->derived( 'breakout' );
		$css    = $input->css();

		Kadence_Blocks_Rowlayout_Selector::set( $input, 'base' );
		$css->add_property( '--breakout-negative-margin-right', $this->margin( $values, 'right' ) );
		$css->add_property( '--breakout-negative-margin-left', $this->margin( $values, 'left' ) );
	}

	/**
	 * The negative margin of a side.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Breakout_Values $values The values of the breakout.
	 * @param string                                   $side   `left` or `right`.
	 *
	 * @return string
	 */
	private function margin( $values, $side ) {
		return 'calc( ( ( ( var(--global-vw, 100vw) - ( ' . $values->inherit_width() . ' - ( ' . $values->padding( $side ) . '*2 ) ) ) / 2 ) *-1) + -1px)';
	}
}
