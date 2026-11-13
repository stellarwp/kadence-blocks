<?php
/**
 * Writes the line height of the title or of the content.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the line height of the desktop or of the tablet.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Line_Height implements Kadence_Blocks_Css_Section {

	/**
	 * The start of the attribute names.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $prefix;

	/**
	 * The position of the device in the list.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $prefix The start of the attribute names: `title` or `content`.
	 * @param int    $index  The position of the device in the list: 0 desktop, 1 tablet, 2 mobile.
	 */
	public function __construct( string $prefix, int $index ) {
		$this->prefix = $prefix;
		$this->index  = $index;
	}

	/**
	 * Write the line height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$writer = new Kadence_Blocks_Css_Writer( $input->css() );

		$writer->not_empty_with_unit( 'line-height', $input->item( $this->prefix . 'LineHeight', $this->index ), $input->attribute( $this->prefix . 'LineType', 'px' ) );
	}
}
