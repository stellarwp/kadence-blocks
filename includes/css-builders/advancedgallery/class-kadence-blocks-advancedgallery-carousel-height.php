<?php
/**
 * Writes the height of the images of a gallery on every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the height of the images of a gallery on every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Carousel_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device of each position in the heights.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEVICES = [ 'desktop', 'tablet', 'mobile' ];

	/**
	 * The selectors of the images.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $selectors;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param array $selectors The selectors of the images, `{id}` stands for the block unique id.
	 */
	public function __construct( array $selectors ) {
		$this->selectors = $selectors;
	}

	/**
	 * Write the heights.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$heights = $input->attribute( 'carouselHeight' );

		if ( ! is_array( $heights ) ) {
			return;
		}

		$css      = $input->css();
		$selector = new Kadence_Blocks_Css_Selector_Section( $this->selectors );

		foreach ( self::DEVICES as $index => $device ) {
			if ( is_numeric( $heights[ $index ] ?? null ) ) {
				$css->set_media_state( $device );
				$selector->write( $input );
				$css->add_property( 'height', $heights[ $index ] . 'px' );
			}
		}

		$css->set_media_state( 'desktop' );
	}
}
