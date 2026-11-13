<?php
/**
 * Icon flex align section.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Aligns the icons on every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Icon_Flex_Align_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attributes that store the alignment of each device.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const ARGUMENTS = [
		'desktop_key' => 'textAlignment',
		'tablet_key'  => 'tabletTextAlignment',
		'mobile_key'  => 'mobileTextAlignment',
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
		$input->css()->render_flex_align( $input->attributes(), 'textAlignment', self::ARGUMENTS );
	}
}
