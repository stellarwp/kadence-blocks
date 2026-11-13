<?php
/**
 * Writes the layout of one device, depending on its direction.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the layout of one device, depending on its direction.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Orientation_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The sections for a column that flows from top to bottom.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Section[]
	 */
	private $vertical;

	/**
	 * The sections for a column that flows from left to right.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Section[]
	 */
	private $horizontal;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int   $index      The position of the device.
	 * @param array $vertical   The sections for a column that flows from top to bottom.
	 * @param array $horizontal The sections for a column that flows from left to right.
	 */
	public function __construct( $index, array $vertical, array $horizontal ) {
		$this->index      = $index;
		$this->vertical   = $vertical;
		$this->horizontal = $horizontal;
	}

	/**
	 * Write the sections of the direction.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$device = $input->derived( 'layout' )->device( $this->index );

		if ( $device->is_vertical() ) {
			$this->write_all( $input, $this->vertical );
			return;
		}

		if ( $device->is_horizontal() ) {
			$this->write_all( $input, $this->horizontal );
		}
	}

	/**
	 * Run sections.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param array                          $sections The sections.
	 *
	 * @return void
	 */
	private function write_all( Kadence_Blocks_Css_Build_Input $input, array $sections ): void {
		foreach ( $sections as $section ) {
			$section->write( $input );
		}
	}
}
