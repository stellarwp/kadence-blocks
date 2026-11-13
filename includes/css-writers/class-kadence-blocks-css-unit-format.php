<?php
/**
 * Appends a unit to the value.
 *
 * @package Kadence Blocks
 */

/**
 * Appends a fixed unit, such as `px`, to the value.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Unit_Format implements Kadence_Blocks_Css_Value_Format {

	/**
	 * The unit to append.
	 *
	 * @since TBD
	 *
	 * @var mixed
	 */
	private $unit;

	/**
	 * Create the format.
	 *
	 * @since TBD
	 *
	 * @param mixed $unit The unit to append, concatenated as stored.
	 */
	public function __construct( $unit ) {
		$this->unit = $unit;
	}

	/**
	 * Return the value followed by the unit.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw attribute value.
	 *
	 * @return string
	 */
	public function format( $value ) {
		return $value . $this->unit;
	}
}
