<?php
/**
 * Writes the letter spacing of the title or of the content.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the letter spacing in pixels when it was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Letter_Spacing implements Kadence_Blocks_Css_Section {

	/**
	 * The start of the attribute names.
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
	 * @param string $prefix The start of the attribute names: `title` or `content`.
	 */
	public function __construct( string $prefix ) {
		$this->prefix = $prefix;
	}

	/**
	 * Write the spacing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$spacing = $input->attribute( $this->prefix . 'LetterSpacing' );

		if ( null === $spacing ) {
			return;
		}

		$css = $input->css();
		$css->add_property( 'letter-spacing', $css->render_number( $spacing, 'px' ) );
	}
}
