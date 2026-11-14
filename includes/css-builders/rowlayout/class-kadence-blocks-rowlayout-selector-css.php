<?php
/**
 * Rowlayout selector section.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sets one selector of the row layout.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Selector_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selector name or template.
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
	 * @param string $selector A name from the list of selectors, or a template.
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
		Kadence_Blocks_Rowlayout_Selector::set( $input, $this->selector );
	}
}
