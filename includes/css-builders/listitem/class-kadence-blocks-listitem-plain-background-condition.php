<?php
/**
 * Tells whether the highlight has no gradient of any kind, so that its background color shows.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the highlight has no gradient of any kind, so that its background color shows.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Plain_Background_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether neither the text gradient nor the background gradient of the highlight is on.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return empty( $input->attribute( 'enableMarkGradient' ) ) && empty( $input->attribute( 'enableMarkBackgroundGradient' ) );
	}
}
