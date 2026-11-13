<?php
/**
 * Reverses the order of the columns of a collapsed row, four rows deep.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selectors.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-columns.php';

/**
 * Reverses the order of the columns of a collapsed row, four rows deep.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Order_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device whose layout decides.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $layout;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $layout The device whose layout decides.
	 */
	public function __construct( $layout ) {
		$this->layout = $layout;
	}

	/**
	 * Write the order.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$columns = $input->derived( 'columns' );

		if ( ! $columns->is_collapsing( $columns->layout_for( $this->layout ) ) ) {
			return;
		}

		foreach ( [ 0, 1, 2, 3 ] as $row ) {
			$this->write_row( $input, $columns->count(), $row );
		}
	}

	/**
	 * Write the order of the columns of one row.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param mixed                          $count How many columns a row has.
	 * @param int                            $row   The row, starting at zero.
	 *
	 * @return void
	 */
	private function write_row( Kadence_Blocks_Css_Build_Input $input, $count, $row ): void {
		foreach ( range( 1, $count ) as $item ) {
			Kadence_Blocks_Rowlayout_Selector::set( $input, '{inner} > .wp-block-kadence-column:nth-child(' . ( $item + $row * $count ) . ' of *:not(style))' );
			$input->css()->add_property( 'order', $count - $item + 1 + $row * 10 );
		}
	}
}
