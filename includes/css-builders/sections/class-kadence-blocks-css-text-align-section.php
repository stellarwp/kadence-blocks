<?php
/**
 * Writes the text alignment of every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the text alignment of every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Text_Align_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the alignment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The attributes that store the alignment of desktop, tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $arguments;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string   $attribute The attribute that stores the alignment.
	 * @param string[] $arguments The attributes that store the alignment of desktop, tablet and mobile.
	 */
	public function __construct( $attribute, $arguments ) {
		$this->attribute = $attribute;
		$this->arguments = $arguments;
	}

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_text_align( $input->attributes(), $this->attribute, $this->arguments );
	}
}
