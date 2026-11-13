<?php
/**
 * Lets the content of a column that now flows from left to right stop being justified like it did from top to bottom.
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
 * Lets the content of a column that now flows from left to right stop being justified like it did from
 * top to bottom.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Vertical_To_Horizontal_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device before.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $before;

	/**
	 * The position of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Whether only the plain vertical direction counts, not the reversed one.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $strict;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int  $before The position of the device before.
	 * @param int  $index  The position of the device.
	 * @param bool $strict Whether only the plain vertical direction counts, not the reversed one.
	 */
	public function __construct( $before, $index, $strict ) {
		$this->before = $before;
		$this->index  = $index;
		$this->strict = $strict;
	}

	/**
	 * Write the reset.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$layout = $input->derived( 'layout' );

		if ( empty( $layout->device( $this->index )->vertical_align() ) || ! $this->flowed_down( $layout->device( $this->before ) ) ) {
			return;
		}

		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, 'inner' );
		$css->add_property( 'justify-content', 'inherit' );
		Kadence_Blocks_Column_Selector::set( $input, 'aligncenter' );
		$css->add_property( 'width', 'auto' );
	}

	/**
	 * Whether the device before flowed from top to bottom.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Column_Device $device The values of the device before.
	 *
	 * @return bool
	 */
	private function flowed_down( $device ): bool {
		return $this->strict ? 'vertical' === $device->direction() : $device->is_vertical();
	}
}
