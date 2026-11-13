<?php
/**
 * Column selectors.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Sets the selectors of the column, replacing the placeholder for the column class with the unique id.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Selector {

	/**
	 * The selectors that more than one section uses, by name. `{col}` stands for the column class.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const NAMED = [
		'column'                 => '{col}',
		'inner'                  => '{col} > .kt-inside-inner-col',
		'inner_before'           => '{col} > .kt-inside-inner-col:before',
		'inner_and_before'       => '{col} > .kt-inside-inner-col,{col} > .kt-inside-inner-col:before',
		'hover_inner'            => '{col}:hover > .kt-inside-inner-col',
		'hover_inner_before'     => '{col}:hover > .kt-inside-inner-col:before',
		'hover_inner_and_before' => '{col}:hover > .kt-inside-inner-col,{col}:hover > .kt-inside-inner-col:before',
		'children'               => '.wp-block-kadence-column.kb-section-dir-horizontal{col} > .kt-inside-inner-col > *',
		'infobox'                => '.wp-block-kadence-column.kb-section-dir-horizontal{col} > .kt-inside-inner-col > .wp-block-kadence-infobox',
		'aligncenter'            => '{col} > .kt-inside-inner-col > .aligncenter',
		'ratio'                  => '{col} > .kt-inside-inner-col > .kb-image-is-ratio-size',
		'plain_children'         => '{col} > .kt-inside-inner-col > *, {col} > .kt-inside-inner-col > figure.wp-block-image, {col} > .kt-inside-inner-col > figure.wp-block-kadence-image',
		'flex_item'              => '{col}, .wp-block-kadence-column.kb-section-dir-horizontal > .kt-inside-inner-col > {col}',
	];

	/**
	 * Set the selector, by name or as a template.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param string                         $selector A name from the list of selectors, or a template that uses `{col}` for the column class.
	 *
	 * @return void
	 */
	public static function set( Kadence_Blocks_Css_Build_Input $input, $selector ): void {
		$template = self::NAMED[ $selector ] ?? $selector;

		$input->css()->set_selector( str_replace( '{col}', '.kadence-column' . $input->unique_id(), $template ) );
	}
}
