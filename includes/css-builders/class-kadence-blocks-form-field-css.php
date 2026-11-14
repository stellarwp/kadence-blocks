<?php
/**
 * Builds the CSS for the advanced form fields.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-builder.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Builds the CSS of a form field: its width limits. The text, email, date and the other fields share it.
 *
 * @since TBD
 */
class Kadence_Blocks_Form_Field_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return array_merge(
			[
				new Kadence_Blocks_Css_Field_Selector_Section(),
				new Kadence_Blocks_Css_Responsive_Range_Section( 'maxWidth', 'max-width', 'maxWidthUnit' ),
				new Kadence_Blocks_Css_Responsive_Range_Section( 'minWidth', 'min-width', 'minWidthUnit' ),
			],
			$this->extra_sections()
		);
	}

	/**
	 * The sections a kind of field adds after the width limits.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function extra_sections(): array {
		return [];
	}
}
