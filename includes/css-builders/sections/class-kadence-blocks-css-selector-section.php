<?php
/**
 * Sets the selector of the CSS that follows.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Sets the selector the sections after it write under.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Selector_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The selectors, joined with commas. `{id}` stands for the block unique id.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $selectors;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string|string[] $selectors One selector, or several that share a rule. `{id}` stands for the block unique id.
	 */
	public function __construct( $selectors ) {
		$this->selectors = (array) $selectors;
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
		$unique_id = $input->unique_id();

		$input->css()->set_selector( implode( ', ', str_replace( '{id}', $unique_id, $this->selectors ) ) );
	}
}
