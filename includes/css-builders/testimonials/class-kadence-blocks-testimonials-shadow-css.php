<?php
/**
 * Writes the shadow of an item, a soft one when none was saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the shadow of an item, a soft one when none was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Shadow_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The shadow used when none was saved.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEFAULT_SHADOW = [
		'color'   => '#000000',
		'opacity' => 0.2,
		'spread'  => 0,
		'blur'    => 14,
		'hOffset' => 4,
		'vOffset' => 2,
	];

	/**
	 * The values the renderer uses for what a shadow lacks.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEFAULTS = [
		'hOffset' => '4',
		'vOffset' => '2',
		'blur'    => '14',
		'spread'  => '0',
		'color'   => '#000000',
		'opacity' => 0.2,
	];

	/**
	 * Write the shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css    = $input->css();
		$shadow = $input->item( 'shadow', 0, self::DEFAULT_SHADOW );

		$css->add_property( 'box-shadow', $css->render_shadow( $shadow, self::DEFAULTS ) );
	}
}
