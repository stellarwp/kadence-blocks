<?php
/**
 * Writes the font size of the title.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once __DIR__ . '/class-kadence-blocks-posts-title-metric.php';

/**
 * Writes the font size of the title for one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Posts_Title_Font_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device.
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
	 * @param int $index The position of the device.
	 */
	public function __construct( int $index ) {
		$this->index = $index;
	}

	/**
	 * Write the font size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input The input scoped to the title font.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$value = Kadence_Blocks_Posts_Title_Metric::read( $input, 'size', $this->index );

		if ( null === $value ) {
			return;
		}

		$input->css()->add_property( 'font-size', $input->css()->get_font_size( $value, $input->attribute( 'sizeType', 'px' ) ) );
	}
}
