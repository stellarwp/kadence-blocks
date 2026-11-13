<?php
/**
 * Writes the gap between the columns or the rows.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the gap between the columns or the rows.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Gap_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attributes that store the gap, for desktop, tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $devices;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the custom gap.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $custom;

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
	 * @param array  $devices  The attributes that store the gap, for desktop, tablet and mobile.
	 * @param string $property The CSS property.
	 * @param string $custom   The attribute that stores the custom gap.
	 * @param string $unit     The attribute that stores the unit.
	 */
	public function __construct( array $devices, $property, $custom, $unit ) {
		$this->devices  = $devices;
		$this->property = $property;
		$this->custom   = $custom;
		$this->unit     = $unit;
	}

	/**
	 * Write the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_row_gap( $input->attributes(), $this->devices, $this->property, $this->custom, $this->unit );
	}
}
