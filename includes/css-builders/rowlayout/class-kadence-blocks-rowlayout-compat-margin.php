<?php
/**
 * Keeps GeneratePress from adding a bottom margin to the row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Keeps GeneratePress from adding a bottom margin to the row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Compat_Margin_Css implements Kadence_Blocks_Css_Section {

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
	 * Write the margin.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( $this->environment->has_generatepress() ) {
			$input->css()->add_property( 'margin-bottom', '0px' );
		}
	}
}
