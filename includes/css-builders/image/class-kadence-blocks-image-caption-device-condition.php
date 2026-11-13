<?php
/**
 * Whether the caption has a size or a line height for a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether the caption has a size or a line height for a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Caption_Device_Condition implements Kadence_Blocks_Css_Input_Condition {

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
	public function __construct( int $index ) {
		$this->index = $index;
	}

	/**
	 * Whether the size or the line height of the device is not empty.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$caption = $input->attributes()['captionStyles'][0] ?? null;

		return $this->has_value( $caption, 'size' ) || $this->has_value( $caption, 'lineHeight' );
	}

	/**
	 * Whether a list of the caption has a value for the device.
	 *
	 * @since TBD
	 *
	 * @param array|null $caption The first caption style.
	 * @param string     $key The setting.
	 *
	 * @return bool
	 */
	private function has_value( $caption, string $key ): bool {
		$values = $caption[ $key ] ?? null;

		return is_array( $values ) && ! empty( $values[ $this->index ] );
	}
}
