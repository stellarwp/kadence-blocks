<?php
/**
 * Writes the height of the image from the ratio the editor chose.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the height of the image from the ratio the editor chose.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Ratio_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The padding at the bottom of the image, by ratio. Anything else is square.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const RATIOS = [
		'land43'  => '75%',
		'land32'  => '66.67%',
		'land169' => '56.25%',
		'land21'  => '50%',
		'land31'  => '33%',
		'land41'  => '25%',
		'port34'  => '133.33%',
		'port23'  => '150%',
	];

	/**
	 * Write the padding.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$ratio = $input->attribute( 'imageRatio' );

		$input->css()->add_property( 'padding-bottom', is_string( $ratio ) && isset( self::RATIOS[ $ratio ] ) ? self::RATIOS[ $ratio ] : '100%' );
	}
}
