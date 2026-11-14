<?php
/**
 * Tells whether the titles have a margin.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Tells whether the titles have a margin.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Title_Margin_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the margin of the titles is a list on one device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( [ 'titleMargin', 'tabletTitleMargin', 'mobileTitleMargin' ] as $attribute ) {
			$margin = $input->attribute( $attribute );

			if ( ! empty( $margin ) && is_array( $margin ) ) {
				return true;
			}
		}

		return false;
	}
}
