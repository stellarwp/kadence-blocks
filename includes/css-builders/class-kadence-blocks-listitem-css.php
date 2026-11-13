<?php
/**
 * Builds the CSS for the listitem block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/listitem/loader.php';

/**
 * Builds the CSS for the listitem block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Css {

	/**
	 * The selector of the icon of the item.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ICON = '.kt-svg-icon-list-item-{id} .kt-svg-icon-list-single';

	/**
	 * The selector of the highlighted text of the item.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const MARK = '.kt-svg-icon-list-item-{id} .kt-svg-icon-list-text mark.kt-highlight';

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
			$this->icon_sections(),
			$this->highlight_text_sections(),
			$this->highlight_box_sections(),
			$this->highlight_device_sections()
		);
	}

	/**
	 * The sections of the icon of the item.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function icon_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::ICON ),
			new Kadence_Blocks_Listitem_Size_Css(),
			new Kadence_Blocks_Listitem_Important_Css( 'color', 'color', ' !important', true ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Listitem_Styled_Condition(),
				[
					new Kadence_Blocks_Listitem_Important_Css( 'background-color', 'background', '!important', true ),
					new Kadence_Blocks_Listitem_Important_Css( 'padding', 'padding', 'px !important', false ),
					new Kadence_Blocks_Listitem_Important_Css( 'border-color', 'border', ' !important', true ),
					new Kadence_Blocks_Listitem_Important_Css( 'border-width', 'borderWidth', 'px !important', false ),
					new Kadence_Blocks_Listitem_Important_Css( 'border-radius', 'borderRadius', '% !important', false ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the text of the highlight: its font, its colors and its gradients.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function highlight_text_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::MARK ),
			new Kadence_Blocks_Css_Static_Section( 'background-color', 'unset' ),
			new Kadence_Blocks_Listitem_Unit_Css( 'letter-spacing', 'markLetterSpacing', null, 'markLetterSpacingType' ),
			new Kadence_Blocks_Listitem_Font_Size_Css( 0 ),
			new Kadence_Blocks_Listitem_Unit_Css( 'line-height', 'markLineHeight', 0, 'markLineType' ),
			new Kadence_Blocks_Listitem_Font_Family_Css(),
			new Kadence_Blocks_Listitem_Font_Weight_Css(),
			new Kadence_Blocks_Css_Value_Section( 'font-style', 'markFontStyle' ),
			new Kadence_Blocks_Css_Enabled_Section(
				'textGradient',
				[
					new Kadence_Blocks_Css_Enabled_Section(
						'enableTextGradient',
						[
							new Kadence_Blocks_Css_Static_Section( '-webkit-text-fill-color', 'initial !important' ),
							new Kadence_Blocks_Css_Static_Section( '-webkit-background-clip', 'initial !important' ),
							new Kadence_Blocks_Css_Static_Section( 'background-clip', 'initial !important' ),
						]
					),
				]
			),
			new Kadence_Blocks_Listitem_Mark_Color_Css(),
			new Kadence_Blocks_Css_Enabled_Section( 'enableMarkBackgroundGradient', [ new Kadence_Blocks_Css_Value_Section( 'background-image', 'markBackgroundGradient' ) ] ),
			new Kadence_Blocks_Css_Value_Section( 'text-transform', 'markTextTransform' ),
		];
	}

	/**
	 * The sections of the box of the highlight: its background, its border and its padding.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function highlight_box_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Listitem_Plain_Background_Condition(),
				[ new Kadence_Blocks_Listitem_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity' ) ],
				[]
			),
			new Kadence_Blocks_Listitem_Alpha_Color_Css( 'border-color', 'markBorder', 'markBorderOpacity' ),
			new Kadence_Blocks_Listitem_Unit_Css( 'border-width', 'markBorderWidth', null, null ),
			new Kadence_Blocks_Listitem_Border_Style_Css(),
			new Kadence_Blocks_Css_Border_Styles_Section( 'markBorderStyles' ),
			new Kadence_Blocks_Listitem_Border_Radius_Css( 'markBorderRadius' ),
			new Kadence_Blocks_Css_Static_Section( '-webkit-box-decoration-break', 'clone' ),
			new Kadence_Blocks_Css_Static_Section( 'box-decoration-break', 'clone' ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Listitem_Border_Radius_Css( 'tabletMarkBorderRadius' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Listitem_Border_Radius_Css( 'mobileMarkBorderRadius' ) ] ),
			new Kadence_Blocks_Css_Measure_Section(
				'padding',
				'markPadding',
				[
					'desktop_key' => 'markPadding',
					'tablet_key'  => 'markTabPadding',
					'mobile_key'  => 'markMobilePadding',
				]
			),
		];
	}

	/**
	 * The sections that set the font size and the line height of the highlight on the tablet and on the mobile.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function highlight_device_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::MARK ),
			new Kadence_Blocks_Css_Device_Section(
				'tablet',
				[
					new Kadence_Blocks_Listitem_Font_Size_Css( 1 ),
					new Kadence_Blocks_Listitem_Unit_Css( 'line-height', 'markLineHeight', 1, 'markLineType' ),
				]
			),
			new Kadence_Blocks_Css_Device_Section(
				'mobile',
				[
					new Kadence_Blocks_Listitem_Font_Size_Css( 2 ),
					new Kadence_Blocks_Listitem_Unit_Css( 'line-height', 'markLineHeight', 2, 'markLineType' ),
				]
			),
		];
	}
}
