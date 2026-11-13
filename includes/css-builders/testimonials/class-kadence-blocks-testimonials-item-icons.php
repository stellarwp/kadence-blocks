<?php
/**
 * Writes the color and the size of the icon of every testimonial.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-testimonials-unit-css.php';

/**
 * Writes the color and the size of the icon of every testimonial.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Item_Icons_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the icons.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$items = $input->attribute( 'testimonials' );

		if ( ! is_array( $items ) ) {
			return;
		}

		foreach ( $items as $key => $item ) {
			$this->write_item( $input, $key, is_array( $item ) ? $item : [] );
		}
	}

	/**
	 * Write the icon of one testimonial.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param int|string                     $key   The key of the testimonial.
	 * @param array                          $item  The settings of the testimonial.
	 *
	 * @return void
	 */
	private function write_item( Kadence_Blocks_Css_Build_Input $input, $key, array $item ): void {
		$input->css()->set_selector( '.kt-blocks-testimonials-wrap' . $input->unique_id() . ' .kt-testimonial-item-' . $key . ' .kt-svg-testimonial-icon' );

		$scoped = $input->with_attributes( $item );

		foreach ( $this->sections() as $section ) {
			$section->write( $scoped );
		}
	}

	/**
	 * The sections of the icon of one testimonial.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function sections(): array {
		return [
			new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
			new Kadence_Blocks_Testimonials_Unit_Css( 'numeric_with_unit', 'font-size', 'isize', 'px' ),
		];
	}
}
