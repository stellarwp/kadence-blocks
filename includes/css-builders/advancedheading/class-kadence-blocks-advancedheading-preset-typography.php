<?php
/**
 * Writes the typography of the preset when the block has none of its own.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the typography of the preset when the block has none of its own.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Preset_Typography_Css implements Kadence_Blocks_Css_Section {

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
		$input->context()->call( 'render_preset_typography', $input->css(), $input->attributes() );
	}
}
