<?php
/**
 * Writes the margin or the padding of a font, or the separate setting when the font has none.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the margin or the padding of a font, or the separate setting when the font has none.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Font_Spacing_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $font;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the separate setting.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $fallback;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $font     The attribute that stores the font.
	 * @param string $property The CSS property.
	 * @param string $fallback The attribute that stores the separate setting.
	 */
	public function __construct( $font, $property, $fallback ) {
		$this->font     = $font;
		$this->property = $property;
		$this->fallback = $fallback;
	}

	/**
	 * Write the spacing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$font    = $input->item( $this->font, 0 );
		$spacing = is_array( $font ) ? ( $font[ $this->property ] ?? null ) : null;

		if ( is_array( $spacing ) && array_filter( $spacing ) ) {
			( new Kadence_Blocks_Css_Writer( $input->css() ) )->numeric_sides( $this->property, $spacing, 'px' );

			return;
		}

		$input->css()->render_measure_output( $input->attributes(), $this->fallback, $this->property );
	}
}
