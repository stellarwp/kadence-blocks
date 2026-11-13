<?php
/**
 * Writes a saved background image: the image, how it fits and where it sits.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a saved background image: the image, how it fits and where it sits.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Background_Image_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The fallbacks of the image settings, by property.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEFAULTS = [
		'background-size'       => [ 'bgImgSize', 'cover' ],
		'background-position'   => [ 'bgImgPosition', 'center center' ],
		'background-attachment' => [ 'bgImgAttachment', 'scroll' ],
		'background-repeat'     => [ 'bgImgRepeat', 'no-repeat' ],
	];

	/**
	 * The attribute that stores the image.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the image.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Write the image.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$image = $input->item( $this->attribute, 0 );

		if ( ! is_array( $image ) || empty( $image['bgImg'] ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'background-image', sprintf( "url('%s')", $image['bgImg'] ) );

		foreach ( self::DEFAULTS as $property => $setting ) {
			$css->add_property( $property, ! empty( $image[ $setting[0] ] ) ? $image[ $setting[0] ] : $setting[1] );
		}

		$this->write_fixed_attachment( $css, $image );
	}

	/**
	 * Scroll a fixed image on tablets, which cannot fix it.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css   The CSS builder.
	 * @param array                                     $image The saved image.
	 *
	 * @return void
	 */
	private function write_fixed_attachment( $css, array $image ): void {
		if ( empty( $image['bgImgAttachment'] ) || 'fixed' !== $image['bgImgAttachment'] || apply_filters( 'kadence_blocks_attachment_fixed_on_mobile', false ) ) {
			return;
		}

		$css->set_media_state( 'tabletPro' );
		$css->add_property( 'background-attachment', 'scroll' );
		$css->set_media_state( 'desktop' );
	}
}
