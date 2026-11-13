<?php
/**
 * Writes the width of one column of the table on every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the width of one column of the table on every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Column_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the column.
	 *
	 * @since TBD
	 *
	 * @var int|string
	 */
	private $index;

	/**
	 * The settings of the column.
	 *
	 * @since TBD
	 *
	 * @var mixed
	 */
	private $settings;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int|string $index    The position of the column.
	 * @param mixed      $settings The settings of the column.
	 */
	public function __construct( $index, $settings ) {
		$this->index    = $index;
		$this->settings = $settings;
	}

	/**
	 * Write the widths.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$unit = ! empty( $this->settings['unit'] ) ? $this->settings['unit'] : '%';

		if ( $this->is_set( 'width' ) ) {
			$input->css()->set_selector( '.kb-table' . $input->derived( 'id' ) . ' tr > *:nth-child(' . ( $this->index + 1 ) . ')' );
			$input->css()->add_property( 'width', $this->settings['width'] . $unit );
		}

		$unit = $this->write_device( $input, 'tablet', 'Tablet', $unit );

		$this->write_device( $input, 'mobile', 'Mobile', $unit );
	}

	/**
	 * Whether the column has a width for a device.
	 *
	 * @since TBD
	 *
	 * @param string $key The attribute of the width.
	 *
	 * @return bool
	 */
	private function is_set( $key ): bool {
		return isset( $this->settings[ $key ] ) && '' !== $this->settings[ $key ];
	}

	/**
	 * Write the width of the column on a device. The unit of a device is kept for the one after it.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $device The device.
	 * @param string                         $suffix The ending of the attributes of the device.
	 * @param string                         $unit   The unit before the device.
	 */
	private function write_device( Kadence_Blocks_Css_Build_Input $input, $device, $suffix, $unit ) {
		if ( ! $this->is_set( 'width' . $suffix ) ) {
			return $unit;
		}

		$css = $input->css();

		if ( ! empty( $this->settings[ 'unit' . $suffix ] ) ) {
			$unit = $this->settings[ 'unit' . $suffix ];
		}

		$css->set_media_state( $device );
		$css->add_property( 'width', $this->settings[ 'width' . $suffix ] . $unit );
		$css->set_media_state( 'desktop' );

		return $unit;
	}
}
