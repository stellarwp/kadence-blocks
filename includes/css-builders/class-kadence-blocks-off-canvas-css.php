<?php
/**
 * Builds the CSS for the off canvas block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Builds the CSS for the off canvas block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Off_Canvas_Css {

	/**
	 * What this builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

	/**
	 * Create the builder.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Block_Context $context What this builder needs from the block.
	 */
	public function __construct( Kadence_Blocks_Css_Block_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Build the block CSS.
	 *
	 * @since TBD
	 *
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 *
	 * @return string|null
	 */
	public function build( $attributes, $css, $unique_id, $unique_style_id ) {
		$input = new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			$unique_id,
			$unique_style_id,
			$this->context
		);

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}

		return $css->css_output();
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections(): array {
		return [
			new Kadence_Blocks_Css_Sized_Dynamic_Section(),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas{id} .kb-off-canvas-inner-wrap' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'border', false, Kadence_Blocks_Css_Device_Keys::arguments( 'border' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', Kadence_Blocks_Css_Device_Keys::arguments( 'borderRadius' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas{id} .kb-off-canvas-inner' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', Kadence_Blocks_Css_Device_Keys::arguments( 'padding' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas{id} .kb-off-canvas-close' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'closeIconPadding', Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconPadding', 'closeIconPaddingUnit' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'closeIconMargin', Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconMargin', 'closeIconMarginUnit' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'closeIconBorderRadius', Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconBorderRadius' ) ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'closeIconBorder', false, Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconBorder' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas{id} .kb-off-canvas-close:hover, .wp-block-kadence-off-canvas{id} .kb-off-canvas-close:focus-visible' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'closeIconBorderHover', false, Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconBorderHover' ) ),
		];
	}
}
