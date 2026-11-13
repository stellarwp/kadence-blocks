<?php
/**
 * Writes the space between the images on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the space between the images on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Gutter_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The types that put half the gutter on each side of an image.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const SPACED = [ 'masonry', 'grid', 'tiles' ];

	/**
	 * The position of the device in the gutter.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The gutter when none was saved.
	 *
	 * @since TBD
	 *
	 * @var int|null
	 */
	private $fallback;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int      $index    The position of the device in the gutter.
	 * @param string   $device   The device.
	 * @param int|null $fallback The gutter when none was saved.
	 */
	public function __construct( $index, $device, $fallback ) {
		$this->index    = $index;
		$this->device   = $device;
		$this->fallback = $fallback;
	}

	/**
	 * Write the gutter.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$value = $input->item( 'gutter', $this->index );
		$value = is_numeric( $value ) ? $value : $this->fallback;

		if ( null === $value ) {
			return;
		}

		$input->css()->set_media_state( $this->device );

		if ( 'thumbslider' === $input->derived( 'gallery_type' ) ) {
			$this->write_thumbnail( $input, $value );
		}

		$this->write_spaced( $input, $value );

		$input->css()->set_media_state( 'desktop' );
	}

	/**
	 * Write the space around the images of a type that spaces them.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param int|float|string               $value The gutter.
	 *
	 * @return void
	 */
	private function write_spaced( Kadence_Blocks_Css_Build_Input $input, $value ): void {
		$type = $input->derived( 'gallery_type' );

		if ( ! in_array( $type, self::SPACED, true ) ) {
			return;
		}

		$css  = $input->css();
		$unit = $input->derived( 'gutter_unit', 'px' );
		$id   = $input->unique_id();

		$css->set_selector( '.wp-block-kadence-advancedgallery .kb-gallery-type-' . $type . '.kb-gallery-id-' . $id );
		$css->add_property( 'margin', '-' . ( $value / 2 ) . $unit );
		$css->set_selector( '.kb-gallery-type-' . $type . '.kb-gallery-id-' . $id . ' .kadence-blocks-gallery-item' );
		$css->add_property( 'padding', ( $value / 2 ) . $unit );
	}

	/**
	 * Write the space under the slider of a thumbnail gallery.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param int|float|string               $value The gutter.
	 *
	 * @return void
	 */
	private function write_thumbnail( Kadence_Blocks_Css_Build_Input $input, $value ): void {
		if ( ! $input->derived( 'updated_version' ) ) {
			return;
		}

		$css = $input->css();

		$css->set_selector( '.kb-gallery-type-thumbslider.kb-gallery-id-' . $input->unique_id() . ' .kt-blocks-carousel-init ' );
		$css->add_property( 'margin-bottom', $value . $input->derived( 'gutter_unit', 'px' ) );
	}
}
