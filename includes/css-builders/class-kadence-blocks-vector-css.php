<?php
/**
 * Builds the CSS for the vector block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the vector block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Vector_Css extends Kadence_Blocks_Css_Block_Builder {

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
			new Kadence_Blocks_Css_Selector_Section( '.kb-vector-container{id}' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Empty_Condition( 'align' ),
				[
					new Kadence_Blocks_Css_Static_Section( 'display', 'flex' ),
					new Kadence_Blocks_Css_Static_Section( 'justify-content', 'center' ),
				],
				[]
			),
			new Kadence_Blocks_Css_Selector_Section( '.kb-vector-container{id} svg' ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'maxWidth', 'max-width', 'maxWidthUnit' ),
		];
	}
}
