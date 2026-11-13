<?php
/**
 * Writes the background of the captions.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the background of the captions.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Caption_Background_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Whether the background fades out.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $gradient;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param bool $gradient Whether the background fades out.
	 */
	public function __construct( $gradient ) {
		$this->gradient = $gradient;
	}

	/**
	 * Write the background.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css     = $input->css();
		$font    = $input->item( 'captionStyles', 0 );
		$opacity = $font['backgroundOpacity'] ?? null;
		$color   = $css->render_color( $font['background'], is_numeric( $opacity ) ? $opacity : '0.8' );

		$css->add_property( 'background', $this->gradient ? 'linear-gradient(0deg, ' . $color . ' 0, rgba(0, 0, 0, 0) 100%)' : $color );
	}
}
