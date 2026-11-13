<?php
/**
 * Passes for numeric values, zero included.
 *
 * @package Kadence Blocks
 */

/**
 * Passes when the value is numeric, so `0` is written, matching the legacy `is_numeric()` guard.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Numeric_Condition implements Kadence_Blocks_Css_Condition {

	/**
	 * Whether the value is numeric.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw attribute value, null when it was never set.
	 *
	 * @return bool
	 */
	public function is_met( $value ): bool {
		return is_numeric( $value );
	}
}
