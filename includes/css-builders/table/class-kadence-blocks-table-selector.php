<?php
/**
 * Sets the selector of the CSS that follows, with the escaped unique id of the table.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sets the selector of the CSS that follows, with the escaped unique id of the table.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Selector_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selector, with {id} where the unique id goes.
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
	 * @param string $selector The selector, with {id} where the unique id goes.
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
		$input->css()->set_selector( str_replace( '{id}', $input->derived( 'id' ), $this->selector ) );
	}
}
