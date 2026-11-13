<?php
/**
 * Writes the margin of the list wrapper: none when the list has its own margin, a default bottom margin when it was never set.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the margin of the list wrapper: none when the list has its own margin, a default bottom
 * margin when it was never set.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_Outer_Margin_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The selector of the list wrapper.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SELECTOR = '.wp-block-kadence-iconlist.kt-svg-icon-list-items{id}:not(.this-stops-third-party-issues)';

	/**
	 * Write the margin.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$margin = $input->attribute( 'listMargin' );
		$css    = $input->css();

		if ( null === $margin ) {
			( new Kadence_Blocks_Css_Selector_Section( self::SELECTOR ) )->write( $input );
			$css->add_property( 'margin-bottom', 'var(--global-kb-spacing-sm, 1.5rem)' );
			return;
		}

		if ( ! is_array( $margin ) || ! isset( $margin[0] ) ) {
			return;
		}

		( new Kadence_Blocks_Css_Selector_Section( self::SELECTOR ) )->write( $input );
		$css->add_property( 'margin-top', '0px' );
		$css->add_property( 'margin-bottom', '0px' );
	}
}
