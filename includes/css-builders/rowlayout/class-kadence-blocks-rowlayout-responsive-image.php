<?php
/**
 * Responsive image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Responsive image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Responsive_Image {

	/**
	 * The size of the image: the end of the key, the property and the fallback.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const SIZE = [ 'Size', 'background-size', 'cover' ];

	/**
	 * The position of the image: the end of the key, the property and the fallback.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const POSITION = [ 'Position', 'background-position', 'center center' ];

	/**
	 * The repeat of the image: the end of the key, the property and the fallback.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const REPEAT = [ 'Repeat', 'background-repeat', 'no-repeat' ];

	/**
	 * Write the image of a device, which the keys of its settings start with a prefix.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css       The CSS builder.
	 * @param array                                     $image     The saved image and its settings.
	 * @param string                                    $prefix    The key of the image, which the keys of its settings start with.
	 * @param string                                    $important What follows the image: nothing, or `!important`.
	 *
	 * @return void
	 */
	public function write( $css, array $image, $prefix, $important ): void {
		$css->add_property( 'background-image', sprintf( "url('%s')", $image[ $prefix ] ) . $important );

		$this->write_setting( $css, $image, $prefix, self::SIZE );
		$this->write_setting( $css, $image, $prefix, self::POSITION );
		$css->add_property( 'background-attachment', $this->attachment( $image, $prefix ) );
		$this->write_setting( $css, $image, $prefix, self::REPEAT );
	}

	/**
	 * Write one setting of the image.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css     The CSS builder.
	 * @param array                                     $image   The saved image and its settings.
	 * @param string                                    $prefix  The key of the image.
	 * @param array                                     $setting The end of the key, the property and the fallback.
	 *
	 * @return void
	 */
	private function write_setting( $css, array $image, $prefix, array $setting ): void {
		$css->add_property( $setting[1], ! empty( $image[ $prefix . $setting[0] ] ) ? $image[ $prefix . $setting[0] ] : $setting[2] );
	}

	/**
	 * How the image is attached: parallax images are fixed, and an image with no setting scrolls.
	 *
	 * @since TBD
	 *
	 * @param array  $image  The saved image and its settings.
	 * @param string $prefix The key of the image.
	 *
	 * @return string
	 */
	public function attachment( array $image, $prefix ) {
		$attachment = ! empty( $image[ $prefix . 'Attachment' ] ) ? $image[ $prefix . 'Attachment' ] : 'scroll';

		return 'parallax' === $attachment ? 'fixed' : $attachment;
	}
}
