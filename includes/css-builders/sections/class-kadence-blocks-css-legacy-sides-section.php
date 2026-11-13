<?php
/**
 * Writes the old side by side attributes of a setting for every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the old side by side attributes of a setting for every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Legacy_Sides_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The devices and the end of the attribute names of each.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEVICES = [ [ 'desktop', '' ], [ 'tablet', 'T' ], [ 'mobile', 'M' ] ];

	/**
	 * The CSS property, such as padding.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The sides, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $sides;

	/**
	 * The attribute that stores the unit.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property The CSS property, such as padding.
	 * @param array  $sides    The sides, in the order they are written.
	 * @param string $unit     The attribute that stores the unit.
	 */
	public function __construct( $property, array $sides, $unit ) {
		$this->property = $property;
		$this->sides    = $sides;
		$this->unit     = $unit;
	}

	/**
	 * Write the sides of every device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		foreach ( self::DEVICES as $device ) {
			$css->set_media_state( $device[0] );
			$this->write_sides( $input, $device[1] );
		}

		$css->set_media_state( 'desktop' );
	}

	/**
	 * Write the sides of one device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $suffix The end of the attribute names of the device.
	 *
	 * @return void
	 */
	private function write_sides( Kadence_Blocks_Css_Build_Input $input, $suffix ): void {
		$writer = new Kadence_Blocks_Css_Writer( $input->css() );
		$unit   = $input->attribute( $this->unit ) ?: 'px';

		foreach ( $this->sides as $side ) {
			$writer->numeric_with_unit( $this->property . '-' . $side, $input->attribute( $side . ucfirst( $this->property ) . $suffix ), $unit );
		}
	}
}
