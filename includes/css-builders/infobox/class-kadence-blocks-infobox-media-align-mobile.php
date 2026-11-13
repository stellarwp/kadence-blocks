<?php
/**
 * Aligns the media on mobile.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Aligns the media on mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Media_Align_Mobile_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The display, the justification and the direction, by where the media goes. Anything else is on the
	 * right.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const LAYOUTS = [
		'top'  => [ 'block', '', '' ],
		'left' => [ 'flex', 'flex-start', 'row' ],
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
		$media = $input->attribute( 'mediaAlignMobile' );

		if ( empty( $media ) ) {
			return;
		}

		$layout = is_string( $media ) && isset( self::LAYOUTS[ $media ] ) ? self::LAYOUTS[ $media ] : [ 'flex', 'flex-end', 'row-reverse' ];
		$css    = $input->css();
		$writer = new Kadence_Blocks_Css_Writer( $css );

		$css->set_media_state( 'mobile' );
		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap' );
		$css->add_property( 'display', $layout[0] );
		$writer->not_empty( 'justify-content', $layout[1] );
		$writer->not_empty( 'flex-direction', $layout[2] );
		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media' );
		$css->add_property( 'display', 'inline-block' );
		$css->add_property( 'max-width', '100%' );
		$css->set_media_state( 'desktop' );
	}
}
