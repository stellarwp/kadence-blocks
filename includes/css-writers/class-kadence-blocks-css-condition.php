<?php
/**
 * Contract for a check that decides whether a CSS declaration is written.
 *
 * @package Kadence Blocks
 */

/**
 * Decides whether a value is worth writing as a CSS declaration.
 *
 * @since TBD
 */
interface Kadence_Blocks_Css_Condition {

	/**
	 * Whether the value passes the check.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw attribute value, null when it was never set.
	 *
	 * @return bool
	 */
	public function is_met( $value ): bool;
}
