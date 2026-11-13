<?php
/**
 * Writes the background of one column of the table.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the background of one column of the table.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Column_Background_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the column.
	 *
	 * @since TBD
	 *
	 * @var int|string
	 */
	private $index;

	/**
	 * The background of the column.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $background;

	/**
	 * What follows the selector of the cell: nothing, or the hover state.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $suffix;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int|string $index      The position of the column.
	 * @param string     $background The background of the column.
	 * @param string     $suffix     What follows the selector of the cell: nothing, or the hover state.
	 */
	public function __construct( $index, $background, $suffix ) {
		$this->index      = $index;
		$this->background = $background;
		$this->suffix     = $suffix;
	}

	/**
	 * Write the background.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css  = $input->css();
		$base = '.kb-table-container .kb-table' . $input->derived( 'id' );

		$css->set_selector( $base . ' td:nth-of-type(' . $this->data_position( $input ) . ')' . $this->suffix );
		$css->add_property( 'background-color', $css->render_color( $this->background ) );
		$css->set_selector( $base . ' th:nth-of-type(' . ( $this->index + 1 ) . ')' . $this->suffix );
		$css->add_property( 'background-color', $css->render_color( $this->background ) );
	}

	/**
	 * The position of the data cell: one less when the first column holds the headers.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 */
	private function data_position( Kadence_Blocks_Css_Build_Input $input ) {
		return empty( $input->attribute( 'isFirstColumnHeader' ) ) ? $this->index + 1 : $this->index;
	}
}
