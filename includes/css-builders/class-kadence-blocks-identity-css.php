<?php
/**
 * Builds the CSS for the identity block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the identity block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Identity_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-identity{id}' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin' ),
			new Kadence_Blocks_Css_Rule_Section(
				'.kb-identity{id} a',
				[
					'text-decoration' => 'inherit',
					'color'           => 'inherit',
				]
			),
			new Kadence_Blocks_Css_Selector_Section( '.kb-identity{id} .wp-block-site-title' ),
			new Kadence_Blocks_Css_Typography_Section( 'titleTypography' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-identity{id} .wp-block-site-tagline' ),
			new Kadence_Blocks_Css_Typography_Section( 'taglineTypography' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-identity{id} .kb-identity-layout-container' ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Identity_Aligned_Layout_Condition(), [ new Kadence_Blocks_Identity_Vertical_Align_Css() ], [] ),
		];
	}
}
