<?php
/**
 * Writes the saved drop shadow.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the saved drop shadow.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Drop_Shadow_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the filter of the first drop shadow, with the defaults for what it leaves out.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$shadow = $input->attribute( 'dropShadow' )[0];
		$css    = $input->css();
		$color  = ! empty( $shadow['color'] ) ? $shadow['color'] : '#000000';

		$css->add_property(
			'filter',
			'drop-shadow(' . $this->number( $shadow, 'hOffset', '0' ) . 'px ' . $this->number( $shadow, 'vOffset', '0' ) . 'px ' . $this->number( $shadow, 'blur', '14' ) . 'px ' . $css->render_color( $color, $this->number( $shadow, 'opacity', 0.2 ) ) . ')'
		);
	}

	/**
	 * A setting of the shadow when it is a number, or the default.
	 *
	 * @since TBD
	 *
	 * @param array  $shadow The shadow.
	 * @param string $key The setting.
	 * @param mixed  $fallback The default.
	 *
	 * @return mixed
	 */
	private function number( array $shadow, string $key, $fallback ) {
		return isset( $shadow[ $key ] ) && is_numeric( $shadow[ $key ] ) ? $shadow[ $key ] : $fallback;
	}
}
