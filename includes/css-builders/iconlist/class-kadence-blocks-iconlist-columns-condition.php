<?php
/**
 * Tells whether the list has several columns on a device, which then need a margin between the items.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the list has several columns on a device, which then need a margin between the items.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_Columns_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The device: desktop, tablet or mobile.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $device The device: desktop, tablet or mobile.
	 */
	public function __construct( $device ) {
		$this->device = $device;
	}

	/**
	 * Whether the list has several columns on the device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		if ( 'desktop' === $this->device ) {
			return $this->is_multiple( $input, 'columns' );
		}

		if ( 'tablet' === $this->device ) {
			return $this->is_multiple( $input, 'tabletColumns' ) || ( $this->is_blank( $input, 'tabletColumns' ) && $this->is_multiple( $input, 'columns' ) );
		}

		return $this->is_multiple( $input, 'mobileColumns' ) || ( $this->is_blank( $input, 'mobileColumns' ) && $this->is_multiple( $input, 'tabletColumns' ) ) || ( $this->is_blank( $input, 'tabletColumns' ) && $this->is_blank( $input, 'mobileColumns' ) && $this->is_multiple( $input, 'columns' ) );
	}

	/**
	 * Whether the attribute holds more than one column.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string                         $name  The attribute.
	 *
	 * @return bool
	 */
	private function is_multiple( Kadence_Blocks_Css_Build_Input $input, $name ): bool {
		$columns = $input->attribute( $name );

		return ! empty( $columns ) && abs( $columns ) > 1;
	}

	/**
	 * Whether the attribute is empty.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string                         $name  The attribute.
	 *
	 * @return bool
	 */
	private function is_blank( Kadence_Blocks_Css_Build_Input $input, $name ): bool {
		return empty( $input->attribute( $name ) );
	}
}
