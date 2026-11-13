<?php
/**
 * Writes the shadow of the text, with the shadow of a new block when the block saved none.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the shadow of the text, with the shadow of a new block when the block saved none.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Text_Shadow_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The shadow of a new block.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const DEFAULT_SHADOW = [
		[
			'hOffset' => 1,
			'vOffset' => 1,
			'blur'    => 1,
			'color'   => '#000000',
			'opacity' => 0.2,
		],
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
		$attributes = $input->attributes();

		if ( empty( $attributes['textShadow'] ) ) {
			$attributes['textShadow'] = self::DEFAULT_SHADOW;
		}

		$input->context()->call( 'render_text_shadow', $attributes, $input->css() );
		$input->css()->set_media_state( 'desktop' );
	}
}
