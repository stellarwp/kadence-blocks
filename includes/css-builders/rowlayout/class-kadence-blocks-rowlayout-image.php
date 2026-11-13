<?php
/**
 * Writes a saved background image of the row, with its settings.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a saved background image of the row, with its settings.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Image_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The size of the image: the end of the attribute name, the property and the fallback.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const SIZE = [ 'Size', 'background-size', 'cover' ];

	/**
	 * The position of the image: the end of the attribute name, the property and the fallback.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const POSITION = [ 'Position', 'background-position', 'center center' ];

	/**
	 * The repeat of the image: the end of the attribute name, the property and the fallback.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const REPEAT = [ 'Repeat', 'background-repeat', 'no-repeat' ];

	/**
	 * The attribute that stores the image, which the attributes of its settings start with.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $prefix;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $prefix The attribute that stores the image, which the attributes of its settings start with.
	 */
	public function __construct( $prefix ) {
		$this->prefix = $prefix;
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
		$image = $input->attribute( $this->prefix );

		if ( empty( $image ) ) {
			return;
		}

		$css        = $input->css();
		$attachment = $this->attachment( $input );

		$css->add_property( 'background-image', sprintf( "url('%s')", $image ) );
		$this->write_setting( $input, self::SIZE );
		$this->write_setting( $input, self::POSITION );
		$css->add_property( 'background-attachment', $attachment );
		$this->write_setting( $input, self::REPEAT );
		$this->write_fixed_attachment( $css, $attachment );
	}

	/**
	 * Write one setting of the image.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input   What the section needs to write its CSS.
	 * @param array                          $setting The end of the attribute name, the property and the fallback.
	 *
	 * @return void
	 */
	private function write_setting( Kadence_Blocks_Css_Build_Input $input, array $setting ): void {
		$input->css()->add_property( $setting[1], $input->attribute( $this->prefix . $setting[0], $setting[2] ) );
	}

	/**
	 * How the image is attached: parallax images are fixed, and an image with no setting scrolls.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return string
	 */
	private function attachment( Kadence_Blocks_Css_Build_Input $input ) {
		$attachment = $input->attribute( $this->prefix . 'Attachment', 'scroll' );

		return 'parallax' === $attachment ? 'fixed' : $attachment;
	}

	/**
	 * Scroll a fixed image on tablets, which cannot fix it.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css        The CSS builder.
	 * @param string                                    $attachment How the image is attached.
	 *
	 * @return void
	 */
	private function write_fixed_attachment( $css, $attachment ): void {
		if ( 'fixed' !== $attachment || apply_filters( 'kadence_blocks_attachment_fixed_on_mobile', false ) ) {
			return;
		}

		$css->set_media_state( 'tabletPro' );
		$css->add_property( 'background-attachment', 'scroll' );
		$css->set_media_state( 'desktop' );
	}
}
