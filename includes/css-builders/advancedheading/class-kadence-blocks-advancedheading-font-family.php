<?php
/**
 * Writes the font family, and tells the CSS builder which font to load.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font family, and tells the CSS builder which font to load.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Font_Family_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the family.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $typography;

	/**
	 * The attribute that tells if the family is a Google font.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $google;

	/**
	 * The attribute that tells if the Google font is loaded.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $load;

	/**
	 * The attribute that stores the variant.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $variant;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $typography The attribute that stores the family.
	 * @param string $google     The attribute that tells if the family is a Google font.
	 * @param string $load       The attribute that tells if the Google font is loaded.
	 * @param string $variant    The attribute that stores the variant.
	 */
	public function __construct( $typography, $google, $load, $variant ) {
		$this->typography = $typography;
		$this->google     = $google;
		$this->load       = $load;
		$this->variant    = $variant;
	}

	/**
	 * Write the family.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$typography = $input->attribute( $this->typography );

		if ( empty( $typography ) ) {
			return;
		}

		$css     = $input->css();
		$load    = $input->attribute( $this->load );
		$google  = (bool) $input->attribute( $this->google ) && ( null === $load || $load );
		$variant = $input->attribute( $this->variant );

		$css->add_property( 'font-family', $css->render_font_family( $typography, $google, ! empty( $variant ) ? $variant : null ) );
	}
}
