<?php
/**
 * Builds the CSS for the accordion block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/accordion/loader.php';

/**
 * Builds the CSS for the accordion block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Css {

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
		return array_merge(
			$this->layout_sections(),
			$this->panel_sections(),
			[ new Kadence_Blocks_Accordion_Title_Styles_Css( $this->title_sections() ) ]
		);
	}

	/**
	 * The gap and the layout of the panes on every device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function layout_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'inner' ) ),
			new Kadence_Blocks_Css_Gap_Section( 'columnGap', 'column-gap', 'columnGapUnit' ),
			new Kadence_Blocks_Accordion_Title_Margin_Css( 'row-gap' ),
			new Kadence_Blocks_Accordion_Layout_Css( 0, false ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Accordion_Layout_Css( 1, true ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Accordion_Layout_Css( 2, true ) ] ),
		];
	}

	/**
	 * The border, the background and the padding of the panels.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function panel_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'panel' ) ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Border_Condition( 'contentBorder' ),
				[
					new Kadence_Blocks_Css_Measure_Range_Section( 'contentBorder', 'border-width' ),
					new Kadence_Blocks_Css_Color_Output_Section( 'contentBorderColor', 'border-color' ),
				],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'contentBorderStyle' ) ]
			),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'contentBorderRadius', [ 'unit_key' => 'contentBorderRadiusUnit' ] ),
			new Kadence_Blocks_Css_Color_Output_Section( 'contentBgColor', 'background' ),
			new Kadence_Blocks_Css_Measure_Section(
				'padding',
				'contentPadding',
				[
					'desktop_key' => 'contentPadding',
					'tablet_key'  => 'contentTabletPadding',
					'mobile_key'  => 'contentMobilePadding',
				]
			),
		];
	}

	/**
	 * The sections that need the styles of the pane titles.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function title_sections(): array {
		return array_merge(
			$this->header_sections(),
			$this->icon_color_sections( 'icon_circle' ),
			$this->text_color_sections(),
			$this->icon_color_sections( 'icon_basic' ),
			$this->hover_sections(),
			$this->active_sections()
		);
	}

	/**
	 * The border, the background, the typography and the padding of the pane titles.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function header_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'header' ) ),
			new Kadence_Blocks_Css_Choice_Section(
				$this->legacy_widths(),
				[
					$this->in_title(
						[
							new Kadence_Blocks_Css_Border_Color_Section( 'border' ),
							new Kadence_Blocks_Css_Measure_Range_Section( 'borderWidth', 'border-width' ),
						]
					),
				],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'titleBorder', true ) ]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Border_Condition( 'borderRadius', 'title_styles' ),
				[ $this->in_title( [ new Kadence_Blocks_Css_Border_Radius_Section( 'borderRadius', 'px' ) ] ) ],
				[ new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'titleBorderRadius', [ 'unit_key' => 'titleBorderRadiusUnit' ] ) ]
			),
			$this->in_title(
				[
					new Kadence_Blocks_Css_Color_Output_Section( 'background', 'background' ),
					new Kadence_Blocks_Css_Typography_Section( '' ),
					new Kadence_Blocks_Css_Measure_Section(
						'padding',
						'padding',
						[
							'tablet_key' => 'paddingTablet',
							'mobile_key' => 'paddingMobile',
						]
					),
				]
			),
		];
	}

	/**
	 * The colors of the text and the links of the panels.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function text_color_sections(): array {
		return [
			new Kadence_Blocks_Css_Gate_Section( [ 'textColor' ], [ new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'text' ) ), new Kadence_Blocks_Css_Rendered_Color_Section( 'color', 'textColor' ) ] ),
			new Kadence_Blocks_Css_Gate_Section( [ 'linkColor' ], [ new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'link' ) ), new Kadence_Blocks_Css_Rendered_Color_Section( 'color', 'linkColor' ) ] ),
			new Kadence_Blocks_Css_Gate_Section( [ 'linkHoverColor' ], [ new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'link_hover' ) ), new Kadence_Blocks_Css_Rendered_Color_Section( 'color', 'linkHoverColor' ) ] ),
		];
	}

	/**
	 * The hover styles of the pane titles and their icons.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function hover_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'hover_marks' ) ),
			$this->in_title( [ new Kadence_Blocks_Css_Color_Output_Section( 'background', 'background' ) ] ),
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'hover_header' ) ),
			$this->in_title(
				[
					new Kadence_Blocks_Css_Color_Output_Section( 'colorHover', 'color' ),
					new Kadence_Blocks_Css_Color_Output_Section( 'backgroundHover', 'background' ),
				]
			),
			new Kadence_Blocks_Css_Choice_Section(
				$this->legacy_widths(),
				[ $this->in_title( [ new Kadence_Blocks_Css_Border_Color_Section( 'borderHover' ) ] ) ],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'titleBorderHover', true ) ]
			),
			$this->icon_state( 'hover', 'colorHover', 'hover_circle', 'hover_basic' ),
			$this->in_title( [ new Kadence_Blocks_Css_Enabled_Section( 'backgroundHover', [ new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'hover_background' ) ), new Kadence_Blocks_Css_Color_Output_Section( 'backgroundHover', 'background' ) ] ) ] ),
		];
	}

	/**
	 * The active styles of the pane titles and their icons.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function active_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'active_header' ) ),
			$this->in_title(
				[
					new Kadence_Blocks_Css_Color_Output_Section( 'colorActive', 'color' ),
					new Kadence_Blocks_Css_Color_Output_Section( 'backgroundActive', 'background' ),
				]
			),
			new Kadence_Blocks_Css_Choice_Section(
				$this->legacy_widths(),
				[ $this->in_title( [ new Kadence_Blocks_Css_Border_Color_Section( 'borderActive' ) ] ) ],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'titleBorderActive', true ) ]
			),
			$this->icon_state( 'active', 'colorActive', 'active_circle', 'active_basic' ),
			$this->in_title( [ new Kadence_Blocks_Css_Enabled_Section( 'backgroundActive', [ new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( 'active_background' ) ), new Kadence_Blocks_Css_Color_Output_Section( 'backgroundActive', 'background' ) ] ) ] ),
		];
	}

	/**
	 * The icon color of the standard state under one set of selectors.
	 *
	 * @since TBD
	 *
	 * @param string $selectors The name of the selectors.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function icon_color_sections( string $selectors ): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( $selectors ) ),
			new Kadence_Blocks_Accordion_Icon_Color_Css( 'standard', 'color' ),
		];
	}

	/**
	 * The icon colors of a state: set when the icon or the title has a color for it.
	 *
	 * @since TBD
	 *
	 * @param string $state     The state of the icon color.
	 * @param string $title_key The attribute of the title that stores the color to fall back to.
	 * @param string $circled   The name of the selectors of the circled icons.
	 * @param string $basic     The name of the selectors of the other icons.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function icon_state( string $state, string $title_key, string $circled, string $basic ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Accordion_Icon_State_Condition( $state, $title_key ),
			[
				new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( $circled ) ),
				new Kadence_Blocks_Accordion_Icon_Color_Css( $state, $title_key ),
				new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Accordion_Selectors::named( $basic ) ),
				new Kadence_Blocks_Accordion_Icon_Color_Css( $state, $title_key ),
			],
			[]
		);
	}

	/**
	 * Sections that write against the styles of the pane titles.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Section[] $sections The sections.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function in_title( array $sections ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Derived_Scope_Section( 'title_styles', $sections );
	}

	/**
	 * Whether the pane titles still store the legacy border widths.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Input_Condition
	 */
	private function legacy_widths(): Kadence_Blocks_Css_Input_Condition {
		return new Kadence_Blocks_Css_Legacy_Border_Condition( 'borderWidth', 'title_styles' );
	}
}
