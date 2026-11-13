<?php
/**
 * Color rows.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-advancedgallery-color.php';

/**
 * Builds the sections of one element that has a color for each state.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Color_Rows {

	/**
	 * The color sections of an element, by property and then by state.
	 *
	 * @since TBD
	 *
	 * @param string $selector   The selector of the element, `{id}` stands for the block unique id.
	 * @param array  $properties The attribute that stores the color of the normal state, by CSS property.
	 * @param array  $states     The attribute suffix of each state, by the text added to the selector.
	 *
	 * @return array
	 */
	public static function sections( $selector, array $properties, array $states ): array {
		$sections = [];

		foreach ( $properties as $property => $attribute ) {
			foreach ( $states as $suffix => $state ) {
				$sections[] = new Kadence_Blocks_Advancedgallery_Color_Css( $selector . $suffix, $property, $attribute . $state );
			}
		}

		return $sections;
	}
}
