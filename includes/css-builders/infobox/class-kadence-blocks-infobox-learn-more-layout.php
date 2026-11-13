<?php
/**
 * Puts the learn more link at the bottom of a full height info box.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-infobox-selector.php';
require_once __DIR__ . '/class-kadence-blocks-infobox-flex-align.php';

/**
 * Puts the learn more link at the bottom of a full height info box.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Learn_More_Layout_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The flex values for what the editor saved. Anything else is centered.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const ALIGNMENTS = [
		'right' => 'flex-end',
		'left'  => 'flex-start',
	];

	/**
	 * Write the layout.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css   = $input->css();
		$align = $input->attribute( 'hAlign' );
		$flex  = is_string( $align ) ? ( self::ALIGNMENTS[ $align ] ?? 'center' ) : 'center';

		$css->add_property( 'display', 'flex' );
		$css->add_property( 'flex-direction', 'column' );
		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap .kt-infobox-textcontent' );
		$css->add_property( 'display', 'flex' );
		$css->add_property( 'flex-direction', 'column' );
		$css->add_property( 'align-items', $flex );
		$css->add_property( 'flex-grow', '1' );
		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap .kt-infobox-textcontent .kt-blocks-info-box-learnmore-wrap' );
		$css->add_property( 'margin-top', 'auto' );

		( new Kadence_Blocks_Infobox_Flex_Align_Css( 'hAlignTablet', 'tablet' ) )->write( $input );
		( new Kadence_Blocks_Infobox_Flex_Align_Css( 'hAlignMobile', 'mobile' ) )->write( $input );
	}
}
