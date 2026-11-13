<?php
/**
 * Writes the value unchanged.
 *
 * @package Kadence Blocks
 */

/**
 * Writes the value exactly as stored.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Raw_Format implements Kadence_Blocks_Css_Value_Format {

	/**
	 * Return the value unchanged.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw attribute value.
	 *
	 * @return mixed
	 */
	public function format( $value ) {
		return $value;
	}
}
