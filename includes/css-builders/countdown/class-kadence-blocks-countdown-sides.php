<?php
/**
 * Writes the sides of a box.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the sides of a box from an attribute that stores a list, when the attribute is a list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Sides_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the list.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The CSS property of each side, keyed by the position in the list.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $sides;

	/**
	 * The attribute that stores the unit, or null for pixels.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $unit_attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $attribute      The attribute that stores the list.
	 * @param array       $sides          The CSS property of each side, keyed by the position in the list.
	 * @param string|null $unit_attribute The attribute that stores the unit, or null for pixels.
	 */
	public function __construct( string $attribute, array $sides, ?string $unit_attribute ) {
		$this->attribute      = $attribute;
		$this->sides          = $sides;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the sides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$list = $input->attribute( $this->attribute );

		if ( ! is_array( $list ) ) {
			return;
		}

		$writer = new Kadence_Blocks_Css_Writer( $input->css() );
		$unit   = null === $this->unit_attribute ? 'px' : $input->attribute( $this->unit_attribute, 'px' );

		foreach ( $this->sides as $property => $position ) {
			$writer->numeric_with_unit( $property, $list[ $position ] ?? null, $unit );
		}
	}
}
