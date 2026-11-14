<?php
/**
 * Writes the height of the divider on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the height of the divider on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Device_Divider_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device, `tablet` or `mobile`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The CSS property that stores the height.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * What the site offers, when the band falls back to the height of the spacer.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Spacer_Environment|null
	 */
	private $environment;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string                                 $device      The device, `tablet` or `mobile`.
	 * @param string                                 $property    The CSS property that stores the height.
	 * @param Kadence_Blocks_Spacer_Environment|null $environment What the site offers, when the band falls back to the height of the spacer.
	 */
	public function __construct( $device, $property, $environment ) {
		$this->device      = $device;
		$this->property    = $property;
		$this->environment = $environment;
	}

	/**
	 * Write the height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$attributes = $input->attributes();
		$key        = $this->device . 'DividerHeight';

		if ( empty( $attributes[ $key ] ) ) {
			return;
		}

		$input->css()->add_property( $this->property, $this->height( $attributes, $key ) . 'px !important' );
	}

	/**
	 * The height of the divider: its own, or the one of the spacer when the band runs in the classic mode.
	 *
	 * @since TBD
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $key        The attribute that stores the height of the divider.
	 */
	private function height( array $attributes, $key ) {
		if ( null === $this->environment || $this->environment->is_fse_mode() ) {
			return $attributes[ $key ];
		}

		return $attributes[ $this->device . 'SpacerHeight' ];
	}
}
