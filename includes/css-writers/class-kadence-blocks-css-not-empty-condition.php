<?php
/**
 * Passes for any value PHP does not consider empty.
 *
 * @package Kadence Blocks
 */

/**
 * Passes when the value is not empty, matching the legacy `isset() && ! empty()` guard.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Not_Empty_Condition implements Kadence_Blocks_Css_Condition {

	/**
	 * Whether the value is not empty.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw attribute value, null when it was never set.
	 *
	 * @return bool
	 */
	public function is_met( $value ): bool {
		return ! empty( $value );
	}
}
