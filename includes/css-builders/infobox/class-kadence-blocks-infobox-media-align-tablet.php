<?php
/**
 * Aligns the media on tablet.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Aligns the media on tablet.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Media_Align_Tablet_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The display, the alignment and the justification, by where the media goes. Anything else is on the
	 * right.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const LAYOUTS = [
		'top'  => [ 'block', '', '' ],
		'left' => [ 'flex', 'center', 'flex-start' ],
	];

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$media = $input->attribute( 'mediaAlignTablet' );

		if ( empty( $media ) ) {
			return;
		}

		$layout = is_string( $media ) && isset( self::LAYOUTS[ $media ] ) ? self::LAYOUTS[ $media ] : [ 'flex', 'center', 'flex-end' ];
		$css    = $input->css();
		$writer = new Kadence_Blocks_Css_Writer( $css );

		$css->set_media_state( 'tablet' );
		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap' );
		$css->add_property( 'display', $layout[0] );
		$writer->not_empty( 'align-items', $layout[1] );
		$writer->not_empty( 'justify-content', $layout[2] );
		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media' );
		$css->add_property( 'display', 'top' === $media ? 'inline-block' : 'block' );
		$this->write_width( $css, $media );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * Keep the media on top inside its container.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css   The CSS builder.
	 * @param mixed                                     $media Where the media goes.
	 *
	 * @return void
	 */
	private function write_width( $css, $media ): void {
		if ( 'top' === $media ) {
			$css->add_property( 'max-width', '100%' );
		}
	}
}
