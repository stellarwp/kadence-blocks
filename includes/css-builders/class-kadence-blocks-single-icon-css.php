<?php
/**
 * Builds the CSS for the single icon block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/single-icon/loader.php';

/**
 * Builds the CSS for the single icon block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Single_Icon_Css {

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
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Single_Icon_Array_Condition(), $this->icon_sections(), [] ),
		];
	}

	/**
	 * The sections of the icon.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function icon_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( [ '.kt-svg-item-{id} .kb-svg-icon-wrap', '.kt-svg-style-stacked.kt-svg-item-{id} .kb-svg-icon-wrap' ] ),
			new Kadence_Blocks_Css_Color_Output_Section( 'color', 'color' ),
			new Kadence_Blocks_Css_Responsive_Size_Section( [ 'size', 'tabletSize', 'mobileSize' ], 'font-size', '' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Css_Strict_Condition( 'style', 'stacked' ), $this->stacked_sections(), [] ),
			new Kadence_Blocks_Css_Selector_Section( '.kt-svg-item-{id}:hover .kb-svg-icon-wrap' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'hColor', 'color' ),
		];
	}

	/**
	 * The sections of the background, the border and the padding of a stacked icon, and of its hover state.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function stacked_sections(): array {
		return [
			new Kadence_Blocks_Css_Color_Output_Section( 'background', 'background' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'border', 'border-color' ),
			new Kadence_Blocks_Css_Range_Section( 'borderWidth', 'border-width', 'px' ),
			new Kadence_Blocks_Css_Range_Section( 'borderRadius', 'border-radius', '%' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
			new Kadence_Blocks_Css_Selector_Section( '.kt-svg-item-{id}:hover .kb-svg-icon-wrap' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'hBackground', 'background' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'hBorder', 'border-color' ),
		];
	}
}
