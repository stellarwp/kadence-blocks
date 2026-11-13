<?php
/**
 * Tells whether a full width row breaks its columns out of the content.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selectors.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-columns.php';

/**
 * Tells whether a full width row breaks its columns out of the content.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Breakout_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the row inherits the content width, is full width, has two columns that are not stacked and
	 * breaks one out.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$columns = $input->derived( 'columns' );

		return true === $input->attribute( 'inheritMaxWidth' )
			&& 'full' === $input->attribute( 'align' )
			&& 2 === $columns->count()
			&& 'row' !== $columns->layout_for( 'desktop' )
			&& ( true === $input->attribute( 'breakoutLeft' ) || true === $input->attribute( 'breakoutRight' ) );
	}
}
