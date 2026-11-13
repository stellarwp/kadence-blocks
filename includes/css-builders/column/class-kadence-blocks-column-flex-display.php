<?php
/**
 * Makes the inner column a flex box on the first device that needs it.
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
 * Makes the inner column a flex box on the first device that needs it.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Flex_Display_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The devices, by their position.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEVICES = [ 'desktop', 'tablet', 'mobile' ];

	/**
	 * The directions that need a flex box.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const FLEX_DIRECTIONS = [ 'horizontal', 'horizontal-reverse', 'vertical-reverse' ];

	/**
	 * Write the flex display for the first device that needs it.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( self::DEVICES as $index => $device ) {
			if ( $this->is_flex( $input, $index ) ) {
				$this->write_display( $input, $device );
				return;
			}
		}
	}

	/**
	 * Whether the inner column of a device needs a flex box.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param int                            $index The position of the device: 0 desktop, 1 tablet, 2 mobile.
	 *
	 * @return bool
	 */
	private function is_flex( Kadence_Blocks_Css_Build_Input $input, $index ): bool {
		$device = $input->derived( 'layout' )->device( $index );

		return in_array( $device->direction(), self::FLEX_DIRECTIONS, true )
			|| ! empty( $device->vertical_align() )
			|| ! empty( $device->horizontal_align() )
			|| ! empty( $input->item( 'rowGapVariable', $index ) );
	}

	/**
	 * Write the flex display for a device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $device The device.
	 *
	 * @return void
	 */
	private function write_display( Kadence_Blocks_Css_Build_Input $input, $device ): void {
		$css = $input->css();

		$css->set_media_state( $device );
		Kadence_Blocks_Column_Selector::set( $input, 'inner' );
		$css->add_property( 'display', 'flex' );
		$css->set_media_state( 'desktop' );
	}
}
