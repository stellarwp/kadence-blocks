<?php
/**
 * Aligns the columns vertically.
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

/**
 * Aligns the columns vertically.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Vertical_Alignment_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The values for what the editor saved.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const ALIGNMENTS = [
		'middle' => 'center',
		'bottom' => 'end',
		'top'    => 'start',
	];

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$alignment = $input->attribute( 'verticalAlignment' );

		if ( ! is_string( $alignment ) || ! isset( self::ALIGNMENTS[ $alignment ] ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'align-content', self::ALIGNMENTS[ $alignment ] );
		Kadence_Blocks_Rowlayout_Selector::set( $input, ':where({inner}) > .wp-block-kadence-column' );
		$css->add_property( 'justify-content', self::ALIGNMENTS[ $alignment ] );
		Kadence_Blocks_Rowlayout_Selector::set( $input, 'inner' );
	}
}
