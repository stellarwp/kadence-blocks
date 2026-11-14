<?php
/**
 * Infobox selector section.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sets one selector of the info box.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Selector_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selector template.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $selector The selector template, with `{base}` for the info box and `{tag}` for the title tag.
	 */
	public function __construct( $selector ) {
		$this->selector = $selector;
	}

	/**
	 * Set the selector.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		Kadence_Blocks_Infobox_Selector::set( $input, $this->selector );
	}
}
