<?php
/**
 * Lets the column grow on one device.
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
 * Lets the column grow on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Flex_Grow_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $device The device.
	 * @param int    $index  The position of the device.
	 */
	public function __construct( $device, $index ) {
		$this->device = $device;
		$this->index  = $index;
	}

	/**
	 * Write the flex grow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$grow = $input->item( 'flexGrow', $this->index );

		if ( ! is_numeric( $grow ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		Kadence_Blocks_Column_Selector::set( $input, 'flex_item' );
		$css->add_property( 'flex-grow', $grow );
		Kadence_Blocks_Column_Selector::set( $input, 'inner' );
		$css->add_property( 'height', '100%' );
		$css->set_media_state( 'desktop' );
	}
}
