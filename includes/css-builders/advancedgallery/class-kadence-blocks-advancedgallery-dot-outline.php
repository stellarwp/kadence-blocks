<?php
/**
 * Writes the dots that are an outline.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the dots that are an outline.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Dot_Outline_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The name of the style.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $style;

	/**
	 * The color of the outline.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $color;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $style The name of the style.
	 * @param string $color The color of the outline.
	 */
	public function __construct( $style, $color ) {
		$this->style = $style;
		$this->color = $color;
	}

	/**
	 * Write the dots.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();
		$dot = '.kb-gallery-id-' . $input->unique_id() . ' .splide.kt-carousel-dotstyle-' . $this->style . ' .splide__pagination__page';

		$css->set_selector( $dot );
		$css->add_property( 'background-color', 'transparent' );
		$css->add_property( 'box-shadow', 'inset 0 0 0 1px ' . $this->color );
		$css->add_property( 'transition', 'box-shadow 0.3s ease' );
		$css->set_selector( $dot . '.is-active' );
		$css->add_property( 'background-color', 'transparent' );
		$css->add_property( 'box-shadow', 'inset 0 0 0 8px ' . $this->color );
	}
}
