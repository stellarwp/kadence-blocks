<?php
/**
 * Builds the CSS for the submit block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/submit/loader.php';

/**
 * Builds the CSS for the submit block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Submit_Css {

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
		$class_id = $this->context->call( 'class_id', $attributes );
		$input    = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $class_id, $unique_style_id, $this->context, Kadence_Blocks_Css_Button_Types::derive( $attributes ) );

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}

		return $css->css_output();
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections(): array {
		return [
			new Kadence_Blocks_Css_Button_Width_Section( '.kb-submit-field .kb-btn{id}.kb-button, ul.menu .kb-submit-field .kb-btn{id}.kb-button', 'ul.menu .kb-submit-field .kb-btn{id}.kb-button' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Submit_Inherit_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.kb-submit-field.kb-field{id}' ),
					new Kadence_Blocks_Css_Static_Section( 'display', 'contents' ),
				],
				[]
			),
			new Kadence_Blocks_Css_Selector_Section( '.kb-submit-field .kb-btn{id}.kb-button' ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
			new Kadence_Blocks_Css_Button_Background_Section(),
			new Kadence_Blocks_Css_Typography_Section( 'typography' ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle', true ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'displayShadow', true ),
				[ new Kadence_Blocks_Css_Shadow_Section( 'shadow', '1px 1px 2px 0px rgba(0, 0, 0, 0.2)' ) ],
				[]
			),
			new Kadence_Blocks_Css_Button_Icon_Section( [ 'font-size' ] ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-submit-field .kb-btn{id}.kb-button:hover, .kb-submit-field .kb-btn{id}.kb-button:focus' ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'colorHover' ),
			new Kadence_Blocks_Css_Button_Hover_Background_Section(),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderHoverRadius' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'borderHoverStyle', true ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'displayHoverShadow', true ),
				[
					new Kadence_Blocks_Submit_Hover_Inset_Css(),
					new Kadence_Blocks_Css_Shadow_Section( 'shadowHover', '2px 2px 3px 0px rgba(0, 0, 0, 0.4)' ),
				],
				[]
			),
			new Kadence_Blocks_Submit_Hover_Before_Css(),
			new Kadence_Blocks_Css_Button_Visibility_Section( 'onlyIcon', 0, null, '.kb-btn{id}.kb-button .kt-btn-inner-text', false ),
			new Kadence_Blocks_Css_Button_Visibility_Section( 'onlyIcon', 1, 'tablet', '.kb-btn{id}.kb-button .kt-btn-inner-text', true ),
			new Kadence_Blocks_Css_Button_Visibility_Section( 'onlyIcon', 2, 'mobile', '.kb-btn{id}.kb-button .kt-btn-inner-text', true ),
			new Kadence_Blocks_Css_Device_Section( 'desktop', [] ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-submit-field.kb-field{id}' ),
			new Kadence_Blocks_Submit_Align_Css( 'hAlign', 'desktop' ),
			new Kadence_Blocks_Submit_Align_Css( 'thAlign', 'tablet' ),
			new Kadence_Blocks_Submit_Align_Css( 'mhAlign', 'mobile' ),
		];
	}
}
