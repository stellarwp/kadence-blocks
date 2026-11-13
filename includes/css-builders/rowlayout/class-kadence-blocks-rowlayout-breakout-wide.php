<?php
/**
 * Moves the column out of the content from the width of the content on.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-breakout-margin.php';

/**
 * Moves the column out of the content from the width of the content on.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Breakout_Wide_Css implements Kadence_Blocks_Css_Section {

	/**
	 * What the site offers.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Rowlayout_Environment
	 */
	private $environment;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment What the site offers: the theme, the content width.
	 */
	public function __construct( $environment ) {
		$this->environment = $environment;
	}

	/**
	 * Write the margins.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css   = $input->css();
		$query = $this->min_width( $input );

		if ( empty( $query ) ) {
			( new Kadence_Blocks_Css_Device_Section( 'desktopOnly', [ new Kadence_Blocks_Rowlayout_Breakout_Margin_Css( 'wide_only' ) ] ) )->write( $input );
			return;
		}

		$css->start_media_query( '(min-width:' . $query . ')' );
		( new Kadence_Blocks_Rowlayout_Breakout_Margin_Css( 'wide' ) )->write( $input );
		$css->stop_media_query();
	}

	/**
	 * The width the media query starts at: the content width of the global styles, or the one of the
	 * theme.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return string
	 */
	private function min_width( Kadence_Blocks_Css_Build_Input $input ) {
		$width = $this->environment->is_fse_mode() ? $input->context()->call( 'get_global_styles_content_size_length' ) : '';
		$theme = $this->environment->content_width();

		if ( ! $width && ! empty( $theme ) ) {
			$width = absint( $theme ) . 'px';
		}

		return (string) $width;
	}
}
