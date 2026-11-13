<?php
/**
 * Writes a background of the header row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the variables of a background of the header row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Row_Background_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the background.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The variable that holds the background.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the background.
	 * @param string $property The variable that holds the background.
	 */
	public function __construct( string $attribute, string $property ) {
		$this->attribute = $attribute;
		$this->property  = $property;
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
		$css = $input->css();

		$css->render_background( $input->attribute( $this->attribute ), $css, $this->property );
	}
}
