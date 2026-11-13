<?php
/**
 * Rowlayout selector.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selectors.php';

/**
 * Sets the selectors of the row layout, by name or as a template.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Selector {

	/**
	 * The selectors that more than one section uses, by name.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const NAMED = [
		'base'    => '{base}',
		'margin'  => '{margin}',
		'inner'   => '{inner}',
		'overlay' => '{base} > .kt-row-layout-overlay',
	];

	/**
	 * Set the selector, by name or as a template.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param string                         $selector A name from the list of selectors, or a template that uses `{base}`, `{margin}` and `{inner}`.
	 *
	 * @return void
	 */
	public static function set( Kadence_Blocks_Css_Build_Input $input, $selector ): void {
		$template = self::NAMED[ $selector ] ?? $selector;

		$input->css()->set_selector( $input->derived( 'selectors' )->resolve( $template ) );
	}
}
