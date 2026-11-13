<?php
/**
 * Lays the panes out for a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-accordion-grid.php';
require_once __DIR__ . '/class-kadence-blocks-accordion-row.php';

/**
 * Lays the panes out for a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Layout_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The index of the device in the layouts.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Whether the device may inherit one column from the layouts of the other devices.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $with_row;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int  $index    The index of the device in the layouts.
	 * @param bool $with_row Whether the device lays the panes out in one column.
	 */
	public function __construct( $index, $with_row ) {
		$this->index    = $index;
		$this->with_row = $with_row;
	}

	/**
	 * Write the layout.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$layout = $input->item( 'columnLayout', $this->index );

		if ( empty( $layout ) || ( ! $this->with_row && 'row' === $layout ) ) {
			return;
		}

		foreach ( $this->layouts() as $name => $section ) {
			if ( $layout == $name ) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual -- The editor saved loosely typed values.
				$section->write( $input );
				return;
			}
		}
	}

	/**
	 * The layouts by name, in the order they are matched.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function layouts(): array {
		$layouts = $this->with_row ? [ 'row' => new Kadence_Blocks_Accordion_Row_Css() ] : [];

		$layouts['two-column']   = new Kadence_Blocks_Accordion_Grid_Css( 2 );
		$layouts['three-column'] = new Kadence_Blocks_Accordion_Grid_Css( 3 );

		return $layouts;
	}
}
