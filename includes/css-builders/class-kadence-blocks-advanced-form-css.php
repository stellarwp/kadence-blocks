<?php
/**
 * Builds the CSS for the advanced form block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/advanced-form/loader.php';

/**
 * Builds the CSS for the advanced form block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Css {

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
		if ( ! isset( $attributes['id'] ) ) {
			return null;
		}

		$settings = Kadence_Blocks_Advanced_Form_Settings::from_post_attributes( $this->context->call( 'get_form_attributes', $attributes['id'] ) );
		$input    = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_style_id, $this->context, [ 'settings' => $settings ] );

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
		return array_merge(
			$this->container_sections(),
			$this->field_sections(),
			$this->field_variable_sections(),
			$this->focus_sections(),
			$this->label_sections(),
			$this->text_sections(),
			$this->message_sections()
		);
	}

	/**
	 * A section that sets the selector, relative to the form.
	 *
	 * @since TBD
	 *
	 * @param string $suffix What follows the class of the form in the selector.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function selector( string $suffix = '' ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-advanced-form{id}' . $suffix );
	}

	/**
	 * A section that sets one selector for all the inputs of the form.
	 *
	 * @since TBD
	 *
	 * @param string[] $tags   The tags of the inputs.
	 * @param string   $prefix What follows the class of the form in front of each tag.
	 * @param string   $suffix What follows each tag.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function input_selector( array $tags, string $prefix, string $suffix ): Kadence_Blocks_Css_Section {
		$selectors = [];

		foreach ( $tags as $tag ) {
			$selectors[] = '.wp-block-kadence-advanced-form{id}' . $prefix . $tag . $suffix;
		}

		return new Kadence_Blocks_Css_Selector_Section( implode( ',', $selectors ) );
	}

	/**
	 * The sections of the container: its spacing, its background and its width.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-advanced-form{id}, .wp-block-kadence-advanced-form{id}.kb-form-has-background' ),
			new Kadence_Blocks_Advanced_Form_Measure_Css(
				null,
				'padding',
				'padding',
				[
					'desktop_key' => 'padding',
					'tablet_key'  => 'tabletPadding',
					'mobile_key'  => 'mobilePadding',
				] 
			),
			new Kadence_Blocks_Advanced_Form_Measure_Css(
				null,
				'margin',
				'margin',
				[
					'desktop_key' => 'margin',
					'tablet_key'  => 'tabletMargin',
					'mobile_key'  => 'mobileMargin',
				] 
			),
			$this->selector(),
			new Kadence_Blocks_Advanced_Form_Fill_Css( 'background', 'backgroundType', 'gradient', 'background', 'background' ),
			new Kadence_Blocks_Advanced_Form_Max_Width_Css(),
			$this->selector( ' .kb-advanced-form' ),
			new Kadence_Blocks_Advanced_Form_Gap_Css(),
		];
	}

	/**
	 * The sections of the inputs: their font, their border, their shadow and their padding.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function field_sections(): array {
		$tags = [ 'input[type=text]', 'input[type=tel]', 'input[type=number]', 'input[type=date]', 'input[type=time]', 'input[type=email]', 'input[type=file]', 'select', 'textarea' ];

		return [
			$this->input_selector( $tags, ' .kb-advanced-form ', '' ),
			new Kadence_Blocks_Advanced_Form_Typography_Css( 'inputFont' ),
			new Kadence_Blocks_Advanced_Form_Border_Css( 'fieldBorderStyle' ),
			new Kadence_Blocks_Advanced_Form_Measure_Css( null, 'fieldBorderRadius', 'border-radius', [] ),
			new Kadence_Blocks_Advanced_Form_Shadow_Css( 'boxShadow' ),
			new Kadence_Blocks_Advanced_Form_Measure_Css( 'style', 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
		];
	}

	/**
	 * The sections of the CSS variables of the form: the colors, the background and the border of the fields.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function field_variable_sections(): array {
		return [
			$this->selector(),
			new Kadence_Blocks_Advanced_Form_Dark_Scheme_Css(),
			new Kadence_Blocks_Advanced_Form_Color_Css( 'inputFont', 'color', '--kb-form-text-color' ),
			new Kadence_Blocks_Advanced_Form_Color_Css( 'style', 'color', '--kb-form-text-focus-color' ),
			new Kadence_Blocks_Advanced_Form_Fill_Css( 'style', 'backgroundType', 'gradient', 'background', '--kb-form-background-color' ),
			new Kadence_Blocks_Advanced_Form_Border_Variable_Css( 'width', '--kb-form-border-width' ),
			new Kadence_Blocks_Advanced_Form_Border_Variable_Css( 'color', '--kb-form-border-color' ),
			$this->selector(),
			new Kadence_Blocks_Advanced_Form_Color_Css( 'style', 'placeholderColor', '--kb-form-placeholder-color' ),
		];
	}

	/**
	 * The sections of the inputs that have focus.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function focus_sections(): array {
		$tags = [ 'input[type=text]', 'input[type=email]', 'input[type=tel]', 'input[type=date]', 'input[type=number]', 'input[type=time]', 'input[type=file]', 'select', 'textarea' ];

		return [
			$this->input_selector( $tags, ' ', ':focus' ),
			new Kadence_Blocks_Advanced_Form_Color_Css( 'inputFont', 'colorActive', 'color' ),
			new Kadence_Blocks_Advanced_Form_Active_Border_Css(),
			new Kadence_Blocks_Advanced_Form_Shadow_Css( 'boxShadowActive' ),
			new Kadence_Blocks_Advanced_Form_Fill_Css( 'style', 'backgroundActiveType', 'gradientActive', 'backgroundActive', 'background' ),
		];
	}

	/**
	 * The sections of the labels, and of the mark of the required fields.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function label_sections(): array {
		return [
			$this->selector( ' .kb-adv-form-field .kb-adv-form-label' ),
			new Kadence_Blocks_Advanced_Form_Measure_Css( 'labelFont', 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
			new Kadence_Blocks_Advanced_Form_Measure_Css( 'labelFont', 'margin', 'margin', [] ),
			new Kadence_Blocks_Advanced_Form_Typography_Css( 'labelFont' ),
			$this->selector( ' .kb-adv-form-label .kb-adv-form-required' ),
			new Kadence_Blocks_Advanced_Form_Color_Css( 'style', 'requiredColor', 'color' ),
		];
	}

	/**
	 * The sections of the radio labels and of the help text.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function text_sections(): array {
		return [
			$this->selector( ' .kb-radio-check-item label' ),
			new Kadence_Blocks_Advanced_Form_Color_Css( 'radioLabelFont', 'color', 'color' ),
			new Kadence_Blocks_Advanced_Form_Typography_Css( 'radioLabelFont' ),
			$this->selector( ' .kb-adv-form-help' ),
			new Kadence_Blocks_Advanced_Form_Typography_Css( 'helpFont' ),
			new Kadence_Blocks_Advanced_Form_Measure_Css( 'helpFont', 'padding', 'padding', [] ),
			new Kadence_Blocks_Advanced_Form_Measure_Css( 'helpFont', 'margin', 'margin', [] ),
			new Kadence_Blocks_Advanced_Form_Normal_Style_Css(),
		];
	}

	/**
	 * The sections of the messages: the text, then the success and the error states.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function message_sections(): array {
		return [
			$this->selector( ' .kb-adv-form-message' ),
			new Kadence_Blocks_Advanced_Form_Message_Spacing_Css( 'messagePadding', 'padding' ),
			new Kadence_Blocks_Advanced_Form_Message_Spacing_Css( 'messageMargin', 'margin' ),
			new Kadence_Blocks_Advanced_Form_Message_Typography_Css(),
			new Kadence_Blocks_Advanced_Form_Measure_Css( null, 'messageBorderRadius', 'border-radius', [] ),
			$this->selector( ' .kb-adv-form-success' ),
			new Kadence_Blocks_Advanced_Form_Border_Css( 'messageBorderSuccess' ),
			new Kadence_Blocks_Advanced_Form_Color_Css( null, 'messageColor', 'color' ),
			new Kadence_Blocks_Advanced_Form_Color_Css( null, 'messageBackground', 'background' ),
			$this->selector( ' .kb-adv-form-warning' ),
			new Kadence_Blocks_Advanced_Form_Border_Css( 'messageBorderError' ),
			new Kadence_Blocks_Advanced_Form_Color_Css( null, 'messageColorError', 'color' ),
			new Kadence_Blocks_Advanced_Form_Color_Css( null, 'messageBackgroundError', 'background' ),
		];
	}
}
