<?php
/**
 * Writes the font size of the title or of the content.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font size of one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Font_Size implements Kadence_Blocks_Css_Section {

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
	 * Write the size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$size = $input->item( $this->prefix . 'Size', $this->index );

		if ( empty( $size ) ) {
			return;
		}

		$unit = $input->attribute( $this->prefix . 'SizeType' );
		$css  = $input->css();
		$css->add_property( 'font-size', $css->get_font_size( $size, ! empty( $unit ) ? $unit : 'px' ) );
	}
}
