<?php
/**
 * Writes the line height of the title or of the content on mobile.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the line height of mobile, which only a saved list can hold.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tableofcontents_Mobile_Line_Height implements Kadence_Blocks_Css_Section {

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
	 * Write the line height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$line = $input->attribute( $this->prefix . 'LineHeight' );

		if ( ! is_array( $line ) || empty( $line[2] ) ) {
			return;
		}

		$input->css()->add_property( 'line-height', $line[2] . $input->attribute( $this->prefix . 'LineType', 'px' ) );
	}
}
