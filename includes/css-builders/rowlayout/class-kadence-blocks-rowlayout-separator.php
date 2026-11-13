<?php
/**
 * Writes the separator on the top or the bottom edge of the row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';

/**
 * Writes the separator on the top or the bottom edge of the row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Separator_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The edge, `top` or `bottom`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $edge;

	/**
	 * Whether sizes have to be numbers, or only have to be saved.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $numbers_only;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $edge         The edge, `top` or `bottom`.
	 * @param bool   $numbers_only Whether sizes have to be numbers, or only have to be saved.
	 */
	public function __construct( $edge, $numbers_only ) {
		$this->edge         = $edge;
		$this->numbers_only = $numbers_only;
	}

	/**
	 * Write the separator.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$separator = $input->attribute( $this->edge . 'Sep' );

		if ( null === $separator || 'none' == $separator ) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseNotEqual -- Matches the original loose comparison.
			return;
		}

		$unit   = $input->attribute( $this->edge . 'SepHeightUnit' ) ?: 'px';
		$height = $input->attribute( $this->edge . 'SepHeight' ) ?: '100';

		$this->select( $input, '' );
		$input->css()->add_property( 'height', $height . $unit );
		$this->write_width( $input, '' );
		$this->write_color( $input );
		$this->write_device( $input, 'tablet', 'Tab', $unit );
		$this->write_device( $input, 'mobile', 'Mobile', $unit );
	}

	/**
	 * Set the selector of the separator or of its drawing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string                         $part  Nothing for the separator, ` svg` for its drawing.
	 *
	 * @return void
	 */
	private function select( Kadence_Blocks_Css_Build_Input $input, $part ): void {
		Kadence_Blocks_Rowlayout_Selector::set( $input, '{base} .kt-row-layout-' . $this->edge . '-sep' . $part );
	}

	/**
	 * Whether a size was saved: as a number, or as anything for the sides that only need it saved.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The saved size.
	 *
	 * @return bool
	 */
	private function is_saved( $value ): bool {
		return $this->numbers_only ? is_numeric( $value ) : null !== $value;
	}

	/**
	 * Write the width of the drawing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $suffix The end of the attribute name.
	 *
	 * @return void
	 */
	private function write_width( Kadence_Blocks_Css_Build_Input $input, $suffix ): void {
		$width = $input->attribute( $this->edge . 'SepWidth' . $suffix );

		if ( ! $this->is_saved( $width ) ) {
			return;
		}

		$this->select( $input, ' svg' );
		$input->css()->add_property( 'width', $width . '%' );
	}

	/**
	 * Write the color of the drawing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_color( Kadence_Blocks_Css_Build_Input $input ): void {
		$color = $input->attribute( $this->edge . 'SepColor' );

		if ( empty( $color ) ) {
			return;
		}

		$this->select( $input, ' svg' );
		$input->css()->add_property( 'fill', $input->css()->render_color( $color ) . '!important' );
	}

	/**
	 * Write the height and the width of a device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $device The device.
	 * @param string                         $suffix The end of the attribute names of the device.
	 * @param string                         $unit   The unit of the height.
	 *
	 * @return void
	 */
	private function write_device( Kadence_Blocks_Css_Build_Input $input, $device, $suffix, $unit ): void {
		$height = $input->attribute( $this->edge . 'SepHeight' . $suffix );
		$css    = $input->css();

		$css->set_media_state( $device );

		if ( $this->is_saved( $height ) ) {
			$this->select( $input, '' );
			$css->add_property( 'height', $height . $unit );
		}

		$this->write_width( $input, $suffix );
		$css->set_media_state( 'desktop' );
	}
}
