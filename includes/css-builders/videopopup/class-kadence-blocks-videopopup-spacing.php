<?php
/**
 * Writes the padding or the margin of the video popup.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the padding or the margin of the video popup.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Spacing_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute and the CSS property, `padding` or `margin`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $name;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $name The attribute and the CSS property, `padding` or `margin`.
	 */
	public function __construct( $name ) {
		$this->name = $name;
	}

	/**
	 * Write the spacing when its attribute is a list.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! is_array( $input->attribute( $this->name ) ) ) {
			return;
		}

		$input->css()->render_measure_output( $this->measure_attributes( $input ), $this->name, $this->name );
	}

	/**
	 * The attributes the CSS builder reads: one list per device and the unit.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return array
	 */
	private function measure_attributes( Kadence_Blocks_Css_Build_Input $input ): array {
		$spacing = $input->item( $this->name, 0 );
		$unit    = $input->attribute( $this->name . 'Unit' );
		$title   = ucfirst( $this->name );

		return [
			$this->name          => $this->side_list( $spacing, 'desk' ),
			'tablet' . $title    => $this->side_list( $spacing, 'tablet' ),
			'mobile' . $title    => $this->side_list( $spacing, 'mobile' ),
			$this->name . 'Type' => ! empty( $unit ) ? $unit : 'px',
		];
	}

	/**
	 * The values of one device, or an empty list.
	 *
	 * @since TBD
	 *
	 * @param mixed  $spacing The settings of the first entry.
	 * @param string $device  The device key.
	 *
	 * @return array
	 */
	private function side_list( $spacing, $device ): array {
		return ( isset( $spacing[ $device ] ) && is_array( $spacing[ $device ] ) ) ? $spacing[ $device ] : [];
	}
}
