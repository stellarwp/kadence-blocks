<?php
/**
 * Tells whether the label sits inside a line bar.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the label sits inside a line bar.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Inside_Line_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the label is inside, or has no position, and the bar is a line, or has no type.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$type = $input->attribute( 'barType' );

		return 'inside' === $input->attribute( 'labelPosition', 'inside' ) && ( empty( $type ) || 'line' === $type );
	}
}
