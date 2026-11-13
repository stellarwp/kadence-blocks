<?php
/**
 * Writes the slides of the carousel that show before the carousel starts, on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the slides of the carousel that show before the carousel starts, on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Carousel_Device_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selector of the carousel before it starts.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const INIT = '.kt-blocks-testimonials-wrap{id} .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider)';

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $device The device.
	 */
	public function __construct( $device ) {
		$this->device = $device;
	}

	/**
	 * Write the slides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->set_media_state( $this->device );
		$this->hide_slides( $input );
		$this->show_first_slides( $input );
		$this->pull_back( $input );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * Hide the slides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function hide_slides( Kadence_Blocks_Css_Build_Input $input ): void {
		$this->select( $input, ' .kb-slide-item' );
		$input->css()->add_property( 'display', 'none' );
	}

	/**
	 * Show the first slides, one for every column.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function show_first_slides( Kadence_Blocks_Css_Build_Input $input ): void {
		$css     = $input->css();
		$layout  = $input->derived( 'carousel' );
		$columns = $layout->columns( $this->device );

		$this->select( $input, ' .kb-slide-item:nth-child(-n+' . $columns . ')' );
		$css->add_property( 'padding-left', $layout->gap( $this->device ) . $layout->unit() );
		$css->add_property( 'display', 'block' );
		$css->add_property( 'float', 'left' );
		$css->add_property( 'width', 'calc(100% / ' . $columns . ')' );
	}

	/**
	 * Pull the carousel back by the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function pull_back( Kadence_Blocks_Css_Build_Input $input ): void {
		$layout = $input->derived( 'carousel' );

		$this->select( $input, '' );
		$input->css()->add_property( 'margin-left', '-' . $layout->gap( $this->device ) . $layout->unit() );
	}

	/**
	 * Set the selector of the carousel, or of something in it.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param string                         $suffix What follows the carousel in the selector.
	 *
	 * @return void
	 */
	private function select( Kadence_Blocks_Css_Build_Input $input, $suffix ): void {
		$input->css()->set_selector( str_replace( '{id}', $input->unique_id(), self::INIT . $suffix ) );
	}
}
