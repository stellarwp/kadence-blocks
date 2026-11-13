<?php
/**
 * Contract for turning an attribute value into a CSS value.
 *
 * @package Kadence Blocks
 */

/**
 * Turns an attribute value into the string written after the property name.
 *
 * @since TBD
 */
interface Kadence_Blocks_Css_Value_Format {

	/**
	 * Format the value.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw attribute value.
	 *
	 * @return mixed The value handed to the CSS builder.
	 */
	public function format( $value );
}
