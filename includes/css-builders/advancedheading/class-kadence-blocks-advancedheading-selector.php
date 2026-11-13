<?php
/**
 * Sets the selector of the advanced heading CSS that follows.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Sets the selector of the advanced heading CSS that follows.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Selector_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selectors of one rule. `{root}`, `{data}` and `{id}` stand for parts of the block selector.
	 *
	 * @since TBD
	 *
	 * @var string|string[]
	 */
	private $templates;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string|string[] $templates The selectors of one rule. `{root}`, `{data}` and `{id}` stand for parts of the block selector.
	 */
	public function __construct( $templates ) {
		$this->templates = $templates;
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
		$selectors = str_replace(
			[ '{root}', '{data}', '{id}' ],
			[ '.wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id, '[data-kb-block="kb-adv-heading' . $unique_id . '"]', $unique_id ],
			$this->templates
		);

		$input->css()->set_selector( implode( ', ', (array) $selectors ) );
	}
}
