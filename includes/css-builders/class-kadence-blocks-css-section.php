<?php
/**
 * Contract for one section of a block's CSS.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * One cohesive slice of a block's CSS, such as its container, its title or its tablet rules.
 *
 * @since TBD
 */
interface Kadence_Blocks_Css_Section {

	/**
	 * Write this section's CSS through the builder carried by the input.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void;
}
