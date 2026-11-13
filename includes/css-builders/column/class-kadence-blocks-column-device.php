<?php
/**
 * Column device values.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * The layout values of the column on one device, after falling back to the larger devices.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Device {

	/**
	 * The values by name.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $values;

	/**
	 * Create the values.
	 *
	 * @since TBD
	 *
	 * @param array $values The values by name.
	 */
	public function __construct( array $values ) {
		$this->values = $values;
	}

	/**
	 * The vertical alignment.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function vertical_align() {
		return $this->values['vertical_align'];
	}

	/**
	 * The horizontal alignment.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function horizontal_align() {
		return $this->values['horizontal_align'];
	}

	/**
	 * The flex wrap.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function flex_wrap() {
		return $this->values['flex_wrap'];
	}

	/**
	 * The direction.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function direction() {
		return $this->values['direction'];
	}

	/**
	 * The text alignment.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function text_align() {
		return $this->values['text_align'];
	}

	/**
	 * The unit of the maximum width.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public function max_width_unit() {
		return $this->values['max_width_unit'];
	}

	/**
	 * Whether the content flows from top to bottom.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_vertical(): bool {
		return in_array( $this->direction(), [ 'vertical', 'vertical-reverse' ], true );
	}

	/**
	 * Whether the content flows from left to right.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_horizontal(): bool {
		return in_array( $this->direction(), [ 'horizontal', 'horizontal-reverse' ], true );
	}
}
