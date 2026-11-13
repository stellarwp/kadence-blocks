<?php
/**
 * Writes the CSS of the Pro table, when the site has one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the CSS of the Pro table, when the site has one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Pro_Styles_Css implements Kadence_Blocks_Css_Section {

	/**
	 * What the site offers the table.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Table_Environment
	 */
	private $environment;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Table_Environment $environment What the site offers the table.
	 */
	public function __construct( $environment ) {
		$this->environment = $environment;
	}

	/**
	 * Write the CSS.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$this->environment->write_pro_styles( $input->attributes(), $input->css(), $input->unique_id(), $input->unique_style_id() );
	}
}
