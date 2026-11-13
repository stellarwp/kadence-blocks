<?php
/**
 * Tells whether the tabs are vertical on a device and have a width for it.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the tabs are vertical on a device and have a width for it.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Vertical_Layout_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The name of the layout of the device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $layout;

	/**
	 * The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $layout The name of the layout of the device.
	 * @param int    $index  The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 */
	public function __construct( $layout, $index ) {
		$this->layout = $layout;
		$this->index  = $index;
	}

	/**
	 * Whether the layout of the device is vertical and one width, of the device or of a device before it,
	 * is set.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		if ( 'vtabs' !== $input->derived( $this->layout ) ) {
			return false;
		}

		for ( $index = 0; $index <= $this->index; $index++ ) {
			if ( ! empty( $input->item( 'verticalTabWidth', $index ) ) ) {
				return true;
			}
		}

		return false;
	}
}
