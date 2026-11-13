<?php
/**
 * Builds the CSS for the form block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/form/loader.php';

/**
 * Builds the CSS for the form block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Css {

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
		$input = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_style_id, $this->context );

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
			$this->preparation_sections(),
			[ new Kadence_Blocks_Css_Scoped_Section( 'style', $this->style_sections() ) ],
			[ new Kadence_Blocks_Css_Scoped_Section( 'labelFont', $this->label_sections() ) ],
			[ new Kadence_Blocks_Css_Scoped_Section( 'submit', $this->submit_sections() ) ],
			[ new Kadence_Blocks_Css_Scoped_Section( 'submitMargin', $this->submit_margin_sections() ) ],
			[ new Kadence_Blocks_Css_Scoped_Section( 'submitFont', $this->submit_font_sections() ) ],
			[ new Kadence_Blocks_Css_Scoped_Section( 'messageFont', $this->message_sections() ) ],
			$this->closing_sections()
		);
	}

	/**
	 * The sections that load the scripts and the fonts, and write the margin of the form.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function preparation_sections(): array {
		return [
			new Kadence_Blocks_Form_Scripts_Css(),
			new Kadence_Blocks_Form_Google_Font_Css( 'labelFont' ),
			new Kadence_Blocks_Form_Google_Font_Css( 'submitFont' ),
			new Kadence_Blocks_Form_Google_Font_Css( 'messageFont' ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-form.kadence-form-{id}.kb-form-wrap' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'containerMargin' ),
		];
	}

	/**
	 * The sections of the style of the fields: the gaps, the colors and the sizes.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function style_sections(): array {
		return array_merge( $this->gap_sections(), $this->field_sections(), $this->field_device_sections() );
	}

	/**
	 * The sections of the gaps between the fields, and of the color of the required mark.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function gap_sections(): array {
		return [
			new Kadence_Blocks_Form_Row_Gap_Css( 'rowGap', 'desktop' ),
			new Kadence_Blocks_Form_Gutter_Css( 'gutter', 'desktop' ),
			new Kadence_Blocks_Form_Row_Gap_Css( 'tabletRowGap', 'tablet' ),
			new Kadence_Blocks_Form_Gutter_Css( 'tabletGutter', 'tablet' ),
			new Kadence_Blocks_Form_Row_Gap_Css( 'mobileRowGap', 'mobile' ),
			new Kadence_Blocks_Form_Gutter_Css( 'mobileGutter', 'mobile' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'requiredColor' ], [], [] ),
				[ new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field label .required' ), new Kadence_Blocks_Css_Color_Section( 'color', 'requiredColor' ) ],
				[]
			),
		];
	}

	/**
	 * The sections of the colors, the border and the shadow of the fields, and of their focus state.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function field_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Form_Field_Style_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-select-style-field' ),
					new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
					new Kadence_Blocks_Form_Radius_Css( 'borderRadius', true ),
					new Kadence_Blocks_Form_Font_Size_Css( 'fontSize', 'fontSizeType', 'lineType', true ),
					new Kadence_Blocks_Form_Border_Width_Css(),
					new Kadence_Blocks_Form_Background_Css( 'backgroundType', 'background', 'backgroundOpacity', 'gradient', true ),
					new Kadence_Blocks_Css_Alpha_Color_Section( 'border-color', 'border', 'borderOpacity' ),
					new Kadence_Blocks_Css_Legacy_Shadow_Section(
						'boxShadow',
						[
							'hOffset' => '1',
							'vOffset' => '1',
							'blur'    => '2',
							'spread'  => '0',
							'color'   => '#000000',
							'opacity' => 0.2,
						],
						null 
					),
				],
				[]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Form_Active_Style_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-text-style-field:focus, .kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-select-style-field:focus' ),
					new Kadence_Blocks_Css_Color_Section( 'color', 'colorActive' ),
					new Kadence_Blocks_Css_Alpha_Color_Section( 'border-color', 'borderActive', 'borderActiveOpacity' ),
					new Kadence_Blocks_Css_Legacy_Shadow_Section(
						'boxShadowActive',
						[
							'hOffset' => '2',
							'vOffset' => '2',
							'blur'    => '3',
							'spread'  => '0',
							'color'   => '#000000',
							'opacity' => 0.4,
						],
						null 
					),
					new Kadence_Blocks_Form_Background_Css( 'backgroundActiveType', 'backgroundActive', 'backgroundActiveOpacity', 'gradientActive', false ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the font sizes and the padding of the fields on tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function field_device_sections(): array {
		return [
			new Kadence_Blocks_Form_Font_Device_Css( 'fontSize', 'fontSizeType', 1, 'tablet', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-select-style-field', false ),
			new Kadence_Blocks_Form_Font_Device_Css( 'fontSize', 'fontSizeType', 2, 'mobile', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-select-style-field', false ),
			new Kadence_Blocks_Form_Padding_Css( 'deskPadding', 'desktop', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-text-style-field' ),
			new Kadence_Blocks_Form_Padding_Css( 'tabletPadding', 'tablet', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-text-style-field' ),
			new Kadence_Blocks_Form_Padding_Css( 'mobilePadding', 'mobile', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-text-style-field' ),
		];
	}

	/**
	 * The sections of the label.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function label_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field > label' ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
			new Kadence_Blocks_Form_Font_Size_Css( 'size', 'sizeType', 'lineType', false ),
			new Kadence_Blocks_Form_Font_Text_Css(),
			new Kadence_Blocks_Css_Side_List_Section( 'padding', 'padding-%s' ),
			new Kadence_Blocks_Css_Side_List_Section( 'margin', 'margin-%s' ),
			new Kadence_Blocks_Form_Checkbox_Style_Css( 0, false ),
			new Kadence_Blocks_Form_Font_Device_Css( 'size', 'sizeType', 1, 'tablet', '.kadence-form-{id} .kb-form .kadence-blocks-form-field > label', true ),
			new Kadence_Blocks_Form_Font_Device_Css( 'size', 'sizeType', 2, 'mobile', '.kadence-form-{id} .kb-form .kadence-blocks-form-field > label', true ),
		];
	}

	/**
	 * The sections of the submit button: its look, its hover state and its padding.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function submit_sections(): array {
		return array_merge( $this->submit_look_sections(), $this->submit_hover_sections(), $this->submit_padding_sections() );
	}

	/**
	 * The sections of the look of the submit button.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function submit_look_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit' ),
			new Kadence_Blocks_Form_Submit_Width_Css(),
			new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
			new Kadence_Blocks_Form_Radius_Css( 'borderRadius', true ),
			new Kadence_Blocks_Form_Border_Width_Css(),
			new Kadence_Blocks_Form_Background_Css( 'backgroundType', 'background', 'backgroundOpacity', 'gradient', true ),
			new Kadence_Blocks_Css_Alpha_Color_Section( 'border-color', 'border', 'borderOpacity' ),
			new Kadence_Blocks_Css_Legacy_Shadow_Section(
				'boxShadow',
				[
					'hOffset' => '1',
					'vOffset' => '1',
					'blur'    => '2',
					'spread'  => '0',
					'color'   => '#000000',
					'opacity' => 0.2,
				],
				null 
			),
		];
	}

	/**
	 * The sections of the hover state of the submit button.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function submit_hover_sections(): array {
		$hover_shadow = [
			'hOffset' => '2',
			'vOffset' => '2',
			'blur'    => '3',
			'spread'  => '0',
			'color'   => '#000000',
			'opacity' => 0.4,
		];

		return [
			new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit:hover, .kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit:focus ' ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'colorHover' ),
			new Kadence_Blocks_Css_Alpha_Color_Section( 'border-color', 'borderHover', 'borderHoverOpacity' ),
			new Kadence_Blocks_Css_Legacy_Shadow_Section( 'boxShadowHover', $hover_shadow, false ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Form_Submit_Gradient_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit::before' ),
					new Kadence_Blocks_Form_Background_Css( 'backgroundHoverType', 'backgroundHover', 'backgroundHoverOpacity', 'gradientHover', false ),
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Form_Hover_Inset_Condition(),
						[ new Kadence_Blocks_Css_Legacy_Shadow_Section( 'boxShadowHover', $hover_shadow, true ), new Kadence_Blocks_Form_Radius_Css( 'borderRadius', true ) ],
						[]
					),
				],
				[
					new Kadence_Blocks_Css_Alpha_Color_Section( 'background', 'backgroundHover', 'backgroundHoverOpacity' ),
					new Kadence_Blocks_Css_Legacy_Shadow_Section( 'boxShadowHover', $hover_shadow, true ),
				]
			),
		];
	}

	/**
	 * The sections of the custom padding of the submit button.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function submit_padding_sections(): array {
		return [
			new Kadence_Blocks_Form_Padding_Css( 'deskPadding', 'desktop', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit' ),
			new Kadence_Blocks_Form_Padding_Css( 'tabletPadding', 'tablet', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit' ),
			new Kadence_Blocks_Form_Padding_Css( 'mobilePadding', 'mobile', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit' ),
		];
	}

	/**
	 * The sections of the margin of the submit button.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function submit_margin_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit' ),
			new Kadence_Blocks_Css_Side_List_Section( 'desk', 'margin-%s', 'unit', true ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit' ), new Kadence_Blocks_Css_Side_List_Section( 'tablet', 'margin-%s', 'unit', true ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit' ), new Kadence_Blocks_Css_Side_List_Section( 'mobile', 'margin-%s', 'unit', true ) ] ),
		];
	}

	/**
	 * The sections of the font of the submit button.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function submit_font_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit' ),
			new Kadence_Blocks_Form_Font_Size_Css( 'size', 'sizeType', 'lineType', false ),
			new Kadence_Blocks_Form_Font_Text_Css(),
			new Kadence_Blocks_Form_Font_Device_Css( 'size', 'sizeType', 1, 'tablet', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit', false ),
			new Kadence_Blocks_Form_Font_Device_Css( 'size', 'sizeType', 2, 'mobile', '.kadence-form-{id} .kb-form .kadence-blocks-form-field .kb-forms-submit', false ),
		];
	}

	/**
	 * The sections of the messages: the success, the error and the text of both.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function message_sections(): array {
		return array_merge(
			[ $this->state_section( 'Success', 'success' ), $this->state_section( 'Error', 'warning' ) ],
			[
				new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kadence-blocks-form-message, .kadence-form-{id} .kb-form-error-msg' ),
				new Kadence_Blocks_Form_Radius_Css( 'borderRadius', false ),
				new Kadence_Blocks_Form_Border_Width_Css(),
				new Kadence_Blocks_Form_Font_Size_Css( 'size', 'sizeType', 'lineType', false ),
				new Kadence_Blocks_Form_Font_Text_Css(),
				new Kadence_Blocks_Css_Side_List_Section( 'padding', 'padding-%s' ),
				new Kadence_Blocks_Css_Side_List_Section( 'margin', 'margin-%s' ),
				new Kadence_Blocks_Form_Font_Device_Css( 'size', 'fontSizeType', 1, 'tablet', '.kadence-form-{id} .kadence-blocks-form-message', false ),
				new Kadence_Blocks_Form_Font_Device_Css( 'size', 'fontSizeType', 2, 'mobile', '.kadence-form-{id} .kadence-blocks-form-message', false ),
			]
		);
	}

	/**
	 * The section of the colors of one state of the message.
	 *
	 * @since TBD
	 *
	 * @param string $state The end of the attribute names: `Success` or `Error`.
	 * @param string $element The end of the class name of the message element.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function state_section( string $state, string $element ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Legacy_Condition( [ 'color' . $state, 'background' . $state ], [], [] ),
			[
				new Kadence_Blocks_Css_Selector_Section( '.kadence-form-{id} .kadence-blocks-form-' . $element ),
				new Kadence_Blocks_Css_Color_Section( 'color', 'color' . $state ),
				new Kadence_Blocks_Css_Color_Section( 'border-color', 'border' . $state ),
				new Kadence_Blocks_Css_Alpha_Color_Section( 'background', 'background' . $state, 'background' . $state . 'Opacity' ),
			],
			[]
		);
	}

	/**
	 * The sections that hide the honey pot field, when the form has one.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function closing_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Form_Honey_Pot_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.kb-form input.kadence-blocks-field.verify' ),
					new Kadence_Blocks_Css_Static_Section( 'opacity', '0.0' ),
					new Kadence_Blocks_Css_Static_Section( 'position', 'absolute' ),
					new Kadence_Blocks_Css_Static_Section( 'top', '0.0' ),
					new Kadence_Blocks_Css_Static_Section( 'left', '0.0' ),
					new Kadence_Blocks_Css_Static_Section( 'width', '0.0' ),
					new Kadence_Blocks_Css_Static_Section( 'height', '0.0' ),
					new Kadence_Blocks_Css_Static_Section( 'z-index', '-1' ),
				],
				[]
			),
		];
	}
}
