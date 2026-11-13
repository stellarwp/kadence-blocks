<?php
/**
 * Gives the row the width of the content of the theme.
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

/**
 * Gives the row the width of the content of the theme.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Inherited_Width_Css implements Kadence_Blocks_Css_Section {

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
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css   = $input->css();
		$width = $this->environment->content_width();

		if ( null === $width ) {
			$css->add_property( 'max-width', 'var(--wp--style--global--content-size)' );
			return;
		}

		if ( ! $this->environment->has_kadence_theme() ) {
			$css->add_property( 'max-width', absint( $width ) . 'px' );
			return;
		}

		$css->add_property( 'max-width', 'var( --global-content-width, ' . absint( $width ) . 'px )' );
		$css->add_property( 'padding-left', 'var(--global-content-edge-padding)' );
		$css->add_property( 'padding-right', 'var(--global-content-edge-padding)' );
	}
}
