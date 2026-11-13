<?php
/**
 * A rule of fixed declarations.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-css-selector-section.php';
require_once __DIR__ . '/class-kadence-blocks-css-static-section.php';

/**
 * Sets a selector, then writes properties whose values never change.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Rule_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The sections that set the selector and write the properties, in order.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Section[]
	 */
	private $sections;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string|string[] $selectors    One selector, or several that share the rule. `{id}` stands for the block unique id.
	 * @param array           $declarations The values by property, in the order they are written.
	 */
	public function __construct( $selectors, array $declarations ) {
		$this->sections = [ new Kadence_Blocks_Css_Selector_Section( $selectors ) ];

		foreach ( $declarations as $property => $value ) {
			$this->sections[] = new Kadence_Blocks_Css_Static_Section( $property, $value );
		}
	}

	/**
	 * Write the rule.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( $this->sections as $section ) {
			$section->write( $input );
		}
	}
}
