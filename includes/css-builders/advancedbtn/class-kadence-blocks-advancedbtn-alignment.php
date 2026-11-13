<?php
/**
 * Advanced Buttons alignment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advancedbtn-flex-axes.php';

/**
 * Writes the direction and alignment of the buttons for desktop, tablet and mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Alignment_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The devices in the order they cascade: the device, its position in the stored lists, and the
	 * attributes that align it, strongest first.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEVICES = [
		[ null, 0, [ 'hAlign' ], [ 'vAlign' ] ],
		[ 'tablet', 1, [ 'thAlign', 'hAlign' ], [ 'tvAlign', 'vAlign' ] ],
		[ 'mobile', 2, [ 'mhAlign', 'thAlign', 'hAlign' ], [ 'mvAlign', 'tvAlign', 'vAlign' ] ],
	];

	/**
	 * Write the direction and alignment of every device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$axes = new Kadence_Blocks_Advancedbtn_Flex_Axes();

		foreach ( self::DEVICES as $device ) {
			$axes = $this->write_device( $input, $device, $axes );
		}

		$input->css()->set_media_state( 'desktop' );
	}

	/**
	 * Write one device and return the axes it leaves for the next one.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input       $input  What the section needs to write its CSS.
	 * @param array                                $device The device, its position and its alignment attributes.
	 * @param Kadence_Blocks_Advancedbtn_Flex_Axes $axes   The axes the previous device left.
	 *
	 * @return Kadence_Blocks_Advancedbtn_Flex_Axes
	 */
	private function write_device( Kadence_Blocks_Css_Build_Input $input, array $device, $axes ) {
		list( $name, $index, $horizontal, $vertical ) = $device;

		if ( null !== $name ) {
			$input->css()->set_media_state( $name );
		}

		$orientations = $input->attribute( 'orientation' );
		$orientation  = $orientations[ $index ] ?? null;
		$changed      = ! empty( $orientation );

		if ( $changed ) {
			$input->css()->add_property( 'flex-direction', $orientation );
			$axes = $axes->with_orientation( $orientation );
		}

		$this->write_axis( $input, $horizontal, $changed, $index, $axes->horizontal(), [ $axes, 'horizontal_value' ] );
		$this->write_axis( $input, $vertical, $changed, $index, $axes->vertical(), [ $axes, 'vertical_value' ] );

		return $axes;
	}

	/**
	 * Write the alignment along one axis when the device sets it, or when its direction changed.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param string[]                       $chain    The attributes that align the device, strongest first.
	 * @param bool                           $changed  Whether the device changed the flex direction.
	 * @param int                            $index    The position of the device.
	 * @param string                         $property The property that moves the buttons along the axis.
	 * @param callable                       $value    Turns an alignment into the value of the property.
	 *
	 * @return void
	 */
	private function write_axis( Kadence_Blocks_Css_Build_Input $input, $chain, $changed, $index, $property, $value ): void {
		$alignment = $this->alignment( $input, $chain, $index );

		if ( empty( $input->attribute( $chain[0] ) ) && ! ( $changed && $index > 0 ) ) {
			return;
		}

		$result = $value( $alignment );

		if ( null !== $result ) {
			$input->css()->add_property( $property, $result );
		}
	}

	/**
	 * The alignment of a device: the first attribute of the chain that was set, or centered for tablet and
	 * mobile.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string[]                       $chain The attributes that align the device, strongest first.
	 * @param int                            $index The position of the device.
	 *
	 * @return mixed
	 */
	private function alignment( Kadence_Blocks_Css_Build_Input $input, $chain, $index ) {
		foreach ( $chain as $key ) {
			if ( ! empty( $input->attribute( $key ) ) ) {
				return $input->attribute( $key );
			}
		}

		return $index > 0 ? 'center' : '';
	}
}
