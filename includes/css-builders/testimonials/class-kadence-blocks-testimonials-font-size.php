<?php
/**
 * Writes the font size of a font on desktop.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font size of a font on desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Font_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Whether the size is made usable by the block, or only given its unit.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $usable;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param bool $usable Whether the size is made usable by the block, or only given its unit.
	 */
	public function __construct( $usable ) {
		$this->usable = $usable;
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
		$size = $input->attribute( 'size' );

		if ( ! is_array( $size ) || empty( $size[0] ) ) {
			return;
		}

		$css  = $input->css();
		$unit = $input->attribute( 'sizeType', 'px' );

		$css->add_property( 'font-size', $this->usable ? $input->context()->call( 'get_usable_value', $css, $size[0], $unit, true ) : $size[0] . $unit );
	}
}
