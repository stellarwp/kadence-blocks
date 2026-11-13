<?php
/**
 * Aligns the content of a column that flows from left to right.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector.php';
require_once __DIR__ . '/class-kadence-blocks-column-selector-css.php';
require_once __DIR__ . '/class-kadence-blocks-column-device.php';
require_once __DIR__ . '/class-kadence-blocks-column-layout.php';
require_once __DIR__ . '/class-kadence-blocks-column-flex-values.php';

/**
 * Aligns the content of a column that flows from left to right.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Row_Align_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Whether the device before has to flow from top to bottom.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $needs_vertical_parent;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int  $index                 The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 * @param bool $needs_vertical_parent Whether the device before has to flow from top to bottom.
	 */
	public function __construct( $index, $needs_vertical_parent ) {
		$this->index                 = $index;
		$this->needs_vertical_parent = $needs_vertical_parent;
	}

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$layout = $input->derived( 'layout' );

		if ( $this->needs_vertical_parent && ! $layout->device( $this->index - 1 )->is_vertical() ) {
			return;
		}

		$input->css()->add_property( 'align-items', ( new Kadence_Blocks_Column_Flex_Values() )->cross( $layout->device( $this->index )->vertical_align() ) );
	}
}
