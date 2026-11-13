<?php
/**
 * Styles the pause button of a background slider.
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
 * Styles the pause button of a background slider.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Slider_Pause_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The colors of the button by arrow style: the background, the text and the border.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const STYLES = [
		'blackonlight' => [ 'rgba(255, 255, 255, 0.8)', '#000', 'none' ],
		'outlineblack' => [ 'transparent', '#000', '2px solid #000' ],
		'outlinewhite' => [ 'transparent', '#fff', '2px solid #fff' ],
		'none'         => [ 'rgba(0, 0, 0, 0.8)', '#fff', 'none' ],
	];

	/**
	 * Write the styles.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( 'slider' !== $input->attribute( 'backgroundSettingTab' ) ) {
			return;
		}

		$settings = $input->item( 'backgroundSliderSettings', 0 );
		$settings = is_array( $settings ) ? $settings : [];

		if ( empty( $settings['showPauseButton'] ) ) {
			return;
		}

		$style = $this->style( $settings['arrowStyle'] ?? null );

		Kadence_Blocks_Rowlayout_Selector::set( $input, '{base} .kb-blocks-bg-slider .kb-gallery-pause-button' );
		$input->css()->add_property( 'background-color', $style[0] );
		$input->css()->add_property( 'color', $style[1] );
		$input->css()->add_property( 'border', $style[2] );
	}

	/**
	 * The colors for an arrow style, the dark button for anything unknown.
	 *
	 * @since TBD
	 *
	 * @param mixed $arrow The saved arrow style.
	 *
	 * @return array
	 */
	private function style( $arrow ): array {
		return is_string( $arrow ) && isset( self::STYLES[ $arrow ] ) ? self::STYLES[ $arrow ] : self::STYLES['none'];
	}
}
