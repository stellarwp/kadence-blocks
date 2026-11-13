<?php
/**
 * Tells whether the subtitle has a size or a line height on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the subtitle has a size or a line height on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Subtitle_Device_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The position of the device: 1 tablet, 2 mobile.
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
	 * @param int $index The position of the device: 1 tablet, 2 mobile.
	 */
	public function __construct( $index ) {
		$this->index = $index;
	}

	/**
	 * Whether the size or the line height of the subtitle is set on the device. It runs on the settings of
	 * the subtitle font.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( [ 'size', 'lineHeight' ] as $attribute ) {
			if ( is_array( $input->attribute( $attribute ) ) && ! empty( $input->item( $attribute, $this->index ) ) ) {
				return true;
			}
		}

		return false;
	}
}
