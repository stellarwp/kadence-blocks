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
 * This is the interface to implement to add CSS to a block, from a builder or from the `kadence_blocks_css_sections`
 * filter. The rules of the contract:
 *
 * - All sections of a block share one CSS builder (`$input->css()`), so they share its current selector and its media
 *   state. A section that adds properties writes them under the selector the sections before it set: put a selector
 *   section (`Kadence_Blocks_Css_Selector_Section`, or `$input->css()->set_selector()`) before it.
 * - The order of the list matters for that reason. Return the media state to desktop when a section changed it.
 * - A section reads from `$input` and never changes it. It writes nothing, and does not fail, when its attributes are
 *   missing or empty.
 * - A section is created once per build and holds no state between builds.
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
