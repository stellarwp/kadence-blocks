<?php
/**
 * Builds the CSS for the singlebtn block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-builder.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/singlebtn/loader.php';

/**
 * Builds the CSS for the singlebtn block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * Values worked out once from the attributes, for the sections to read.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return array
	 */
	protected function derived( $attributes ): array {
		return Kadence_Blocks_Css_Button_Types::derive( $attributes );
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [
			new Kadence_Blocks_Singlebtn_Dynamic_Css(),
			new Kadence_Blocks_Css_Button_Width_Section( '.wp-block-kadence-advancedbtn .kb-btn{id}.kb-button, ul.menu .wp-block-kadence-advancedbtn .kb-btn{id}.kb-button', 'ul.menu .wp-block-kadence-advancedbtn .kb-btn{id}.kb-button' ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-advancedbtn .kb-btn{id}.kb-button' ),
			new Kadence_Blocks_Singlebtn_Text_Color_Css( 'color', 'textBackgroundType', 'textGradient', '.wp-block-kadence-advancedbtn .kb-btn{id}.kb-button .kt-btn-inner-text', '.wp-block-kadence-advancedbtn .kb-btn{id}.kb-button' ),
			new Kadence_Blocks_Css_Button_Background_Section(),
			new Kadence_Blocks_Css_Typography_Section( 'typography' ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ),
			new Kadence_Blocks_Singlebtn_Preset_Css( 'render_preset_border' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle', true ),
			new Kadence_Blocks_Singlebtn_Preset_Css( 'render_preset_spacing' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] ),
			new Kadence_Blocks_Singlebtn_Shadow_Css(),
			new Kadence_Blocks_Css_Enabled_Section(
				'textUnderline',
				[
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-advancedbtn .kb-btn{id}.kb-button:not(.specificity):not(.extra-specificity)' ),
					new Kadence_Blocks_Css_Value_Section( 'text-decoration', 'textUnderline' ),
				]
			),
			new Kadence_Blocks_Css_Button_Icon_Section( [ 'font-size', '--kb-button-icon-size' ] ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-advancedbtn .kb-btn{id}.kb-button:hover, .wp-block-kadence-advancedbtn .kb-btn{id}.kb-button:focus' ),
			new Kadence_Blocks_Singlebtn_Text_Color_Css( 'colorHover', 'textBackgroundHoverType', 'textGradientHover', '.wp-block-kadence-advancedbtn .kb-btn{id}.kb-button:hover .kt-btn-inner-text, .wp-block-kadence-advancedbtn .kb-btn{id}.kb-button:focus .kt-btn-inner-text', '.wp-block-kadence-advancedbtn .kb-btn{id}.kb-button:hover, .wp-block-kadence-advancedbtn .kb-btn{id}.kb-button:focus' ),
			new Kadence_Blocks_Css_Button_Hover_Background_Section(),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderHoverRadius' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'borderHoverStyle', true ),
			new Kadence_Blocks_Singlebtn_Hover_Inset_Css(),
			new Kadence_Blocks_Singlebtn_Hover_Shadow_Css(),
			new Kadence_Blocks_Singlebtn_Hover_Before_Css(),
			new Kadence_Blocks_Css_Button_Visibility_Section( 'onlyIcon', 0, null, '.kb-btn{id}.kb-button .kt-btn-inner-text', false ),
			new Kadence_Blocks_Css_Button_Visibility_Section( 'onlyIcon', 1, 'tablet', '.kb-btn{id}.kb-button .kt-btn-inner-text', true ),
			new Kadence_Blocks_Css_Button_Visibility_Section( 'onlyText', 0, 'tablet', '.kb-btn{id}.kb-button .kb-svg-icon-wrap', false ),
			new Kadence_Blocks_Css_Button_Visibility_Section( 'onlyIcon', 2, 'mobile', '.kb-btn{id}.kb-button .kt-btn-inner-text', false ),
			new Kadence_Blocks_Css_Button_Visibility_Section( 'onlyText', 1, 'mobile', '.kb-btn{id}.kb-button .kb-svg-icon-wrap', true ),
			new Kadence_Blocks_Css_Device_Section( 'desktop', [] ),
		];
	}
}
