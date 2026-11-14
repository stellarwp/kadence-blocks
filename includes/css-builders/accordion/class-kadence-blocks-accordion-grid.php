<?php
/**
 * Lays the panes out in columns.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Lays the panes out in columns.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Grid_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The number of columns.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $columns;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int $columns The number of columns.
	 */
	public function __construct( $columns ) {
		$this->columns = $columns;
	}

	/**
	 * Write the grid.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->add_property( 'display', 'grid' );
		$css->add_property( 'grid-template-columns', 'repeat(' . $this->columns . ', minmax(0, 1fr))' );
	}
}
