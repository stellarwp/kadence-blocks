<?php
/**
 * Names the attributes that store a value on every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Names the attributes that store a value on every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Device_Keys {

	/**
	 * The arguments of a measure or border output for an attribute that has a Tablet and a Mobile twin.
	 *
	 * @since TBD
	 *
	 * @param string      $name      The attribute of the value on desktop.
	 * @param string|null $unit_name The attribute that stores the unit, or null when there is none.
	 *
	 * @return array<string, string>
	 */
	public static function arguments( string $name, ?string $unit_name = null ): array {
		$arguments = [
			'desktop_key' => $name,
			'tablet_key'  => $name . 'Tablet',
			'mobile_key'  => $name . 'Mobile',
		];

		if ( null !== $unit_name ) {
			$arguments['unit_key'] = $unit_name;
		}

		return $arguments;
	}
}
