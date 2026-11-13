<?php
/**
 * Loads the Google fonts the block uses.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Loads the Google fonts the block uses.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Google_Fonts_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attributes that store a font.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const FONTS = [ 'titleFont', 'contentFont', 'nameFont', 'occupationFont' ];

	/**
	 * Load the fonts.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( self::FONTS as $attribute ) {
			$this->load( $input, $input->item( $attribute, 0 ) );
		}
	}

	/**
	 * Load one font when it is a Google font that is to be loaded.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param mixed                          $font  The saved font.
	 *
	 * @return void
	 */
	private function load( Kadence_Blocks_Css_Build_Input $input, $font ): void {
		if ( ! $this->is_loadable( $font ) ) {
			return;
		}

		$input->css()->maybe_add_google_font( $font['family'], $font['variant'] ?? null, $font['subset'] ?? null );
	}

	/**
	 * Whether the font is a Google font that is to be loaded.
	 *
	 * @since TBD
	 *
	 * @param mixed $font The saved font.
	 *
	 * @return bool
	 */
	private function is_loadable( $font ): bool {
		if ( ! is_array( $font ) ) {
			return false;
		}

		return true === ( $font['google'] ?? null ) && true === ( $font['loadGoogle'] ?? null ) && isset( $font['family'] );
	}
}
