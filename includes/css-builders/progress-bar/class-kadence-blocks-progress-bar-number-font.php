<?php
/**
 * Writes the typography of the percentage.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-progress-bar-number-font-merge.php';

/**
 * Writes the typography of the percentage.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Number_Font_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the typography.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$attributes = $input->attributes();
		$number     = $input->attribute( 'numberFont' );
		$label      = $input->attribute( 'labelFont' );

		if ( null === $number && null === $label ) {
			return;
		}

		if ( null !== $number && null !== $label ) {
			$attributes['numberFont'] = Kadence_Blocks_Progress_Bar_Number_Font_Merge::resolve( $number, $label, $input->context() );
		}

		$input->css()->render_typography( $attributes, null !== $number ? 'numberFont' : 'labelFont' );
	}
}
