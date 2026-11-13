<?php
/**
 * Tells whether a font, or the minimum height saved next to it, has any setting to write on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-testimonials-min-height.php';

/**
 * Tells whether a font, or the minimum height saved next to it, has any setting to write on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Font_Device_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $font;

	/**
	 * The index of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The attribute that stores the minimum heights, if any.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $min_height;

	/**
	 * The index of the minimum height that decides.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $min_index;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string      $font       The attribute that stores the font.
	 * @param int         $index      The index of the device.
	 * @param string|null $min_height The attribute that stores the minimum heights, if any.
	 * @param int         $min_index  The index of the minimum height that decides.
	 */
	public function __construct( $font, $index, $min_height, $min_index ) {
		$this->font       = $font;
		$this->index      = $index;
		$this->min_height = $min_height;
		$this->min_index  = $min_index;
	}

	/**
	 * Whether the font has a size or a line height for the device, or a minimum height does.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		if ( $this->has_font_settings( $input ) ) {
			return true;
		}

		return null !== $this->min_height && Kadence_Blocks_Testimonials_Min_Height::is_set( $input, $this->min_height, $this->min_index );
	}

	/**
	 * Whether the font has a size or a line height for the device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function has_font_settings( Kadence_Blocks_Css_Build_Input $input ): bool {
		$font = $input->item( $this->font, 0 );

		if ( ! is_array( $font ) ) {
			return false;
		}

		return $this->has_value( $font['size'] ?? null ) || $this->has_value( $font['lineHeight'] ?? null );
	}

	/**
	 * Whether a list has a value for the device.
	 *
	 * @since TBD
	 *
	 * @param mixed $values The list.
	 *
	 * @return bool
	 */
	private function has_value( $values ): bool {
		return is_array( $values ) && ! empty( $values[ $this->index ] );
	}
}
