<?php
/**
 * Writes the backgrounds of the columns of the table.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-table-column-background.php';

/**
 * Writes the backgrounds of the columns of the table.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Column_Backgrounds_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the backgrounds.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

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
	 * @param string $attribute The attribute that stores the backgrounds.
	 * @param string $suffix    What follows the selector of the cell: nothing, or the hover state.
	 */
	public function __construct( $attribute, $suffix ) {
		$this->attribute = $attribute;
		$this->suffix    = $suffix;
	}

	/**
	 * Write the backgrounds.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$backgrounds = $input->attribute( $this->attribute );

		if ( empty( $backgrounds ) ) {
			return;
		}

		foreach ( $backgrounds as $index => $background ) {
			if ( $background ) {
				( new Kadence_Blocks_Table_Column_Background_Css( $index, $background, $this->suffix ) )->write( $input );
			}
		}
	}
}
