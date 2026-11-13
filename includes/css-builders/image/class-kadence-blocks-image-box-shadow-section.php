<?php
/**
 * Writes the box shadow of the image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the box shadow of the image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Box_Shadow_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The shadow a raised flag with no stored value means.
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
		'hOffset' => 0,
		'vOffset' => 0,
		'inset'   => false,
	];

	/**
	 * What the shadow renderer falls back to.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const RENDER_DEFAULTS = [
		'hOffset' => '0',
		'vOffset' => '0',
		'blur'    => '14',
		'spread'  => '0',
		'color'   => '#000000',
		'opacity' => 0.2,
	];

	/**
	 * Write the shadow when it is switched on and visible.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->attribute( 'displayBoxShadow' ) ) ) {
			return;
		}

		$shadow = $this->shadow( $input );

		if ( ! $input->context()->call( 'has_visible_shadow', $shadow ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'box-shadow', $css->render_shadow( $shadow, self::RENDER_DEFAULTS ) );
	}

	/**
	 * The saved shadow, or the shipped one.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return array
	 */
	private function shadow( Kadence_Blocks_Css_Build_Input $input ): array {
		$attributes = $input->attributes();

		return isset( $attributes['boxShadow'][0] ) && is_array( $attributes['boxShadow'][0] ) ? $attributes['boxShadow'][0] : self::DEFAULT_SHADOW;
	}
}
