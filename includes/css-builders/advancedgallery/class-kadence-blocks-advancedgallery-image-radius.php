<?php
/**
 * Writes the rounded corners of the images on one device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the rounded corners of the images on one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Image_Radius_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the corners.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

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
	 * @param string $attribute The attribute that stores the corners.
	 * @param string $device    The device.
	 */
	public function __construct( $attribute, $device ) {
		$this->attribute = $attribute;
		$this->device    = $device;
	}

	/**
	 * Write the corners.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$radius = $input->attribute( $this->attribute );

		if ( ! is_array( $radius ) || ! is_numeric( $radius[0] ?? null ) ) {
			return;
		}

		$css  = $input->css();
		$unit = $input->attribute( 'imageRadiusUnit', 'px' );

		$css->set_media_state( $this->device );
		( new Kadence_Blocks_Css_Selector_Section( [ '.kb-gallery-id-{id} .kadence-blocks-gallery-item .kb-gal-image-radius', '.kb-gallery-id-{id} .kb-slide-item .kb-gal-image-radius img' ] ) )->write( $input );
		$css->add_property( 'border-radius', $this->corners( $radius, $unit ) . ';' );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * The four corners with their unit.
	 *
	 * @since TBD
	 *
	 * @param array  $radius The corners.
	 * @param string $unit   The unit.
	 *
	 * @return string
	 */
	private function corners( array $radius, $unit ) {
		$corners = [ $radius[0] . $unit ];

		foreach ( [ 1, 2, 3 ] as $index ) {
			$corners[] = ( is_numeric( $radius[ $index ] ?? null ) ? $radius[ $index ] : 0 ) . $unit;
		}

		return implode( ' ', $corners );
	}
}
