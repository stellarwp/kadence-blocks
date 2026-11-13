<?php
/**
 * Builds the CSS for the rowlayout block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/rowlayout/loader.php';

/**
 * Builds the CSS for the rowlayout block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Css {

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
			$this->context,
			[
				'selectors' => new Kadence_Blocks_Rowlayout_Selectors( $attributes, $unique_id ),
				'columns'   => new Kadence_Blocks_Rowlayout_Columns( $attributes ),
			]
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
		$environment = new Kadence_Blocks_Rowlayout_Site_Environment();

		return array_merge(
			$this->spacing_sections( $environment ),
			$this->layout_sections(),
			[ new Kadence_Blocks_Rowlayout_Breakout_Css( $environment ) ],
			$this->box_sections(),
			$this->background_sections( $environment ),
			$this->overlay_sections(),
			$this->closing_sections()
		);
	}

	/**
	 * The sections of the margin, the alignment, the gap, the width, the padding and the height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment What the site offers.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function spacing_sections( Kadence_Blocks_Rowlayout_Environment $environment ): array {
		return array_merge( $this->margin_sections( $environment ), $this->size_sections( $environment ), $this->padding_sections() );
	}

	/**
	 * The sections of the margin.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment What the site offers.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function margin_sections( Kadence_Blocks_Rowlayout_Environment $environment ): array {
		return [
			new Kadence_Blocks_Rowlayout_Selector_Css( 'margin' ),
			new Kadence_Blocks_Rowlayout_Compat_Margin_Css( $environment ),
			new Kadence_Blocks_Css_Choice_Section(
				Kadence_Blocks_Css_Legacy_Condition::sides( 'margin', [ 'top', 'bottom' ] ),
				[ new Kadence_Blocks_Css_Legacy_Sides_Section( 'margin', [ 'top', 'bottom' ], 'marginUnit' ) ],
				[ new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] ) ]
			),
		];
	}

	/**
	 * The sections of the alignment, the gaps and the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment What the site offers.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function size_sections( Kadence_Blocks_Rowlayout_Environment $environment ): array {
		return [
			new Kadence_Blocks_Rowlayout_Selector_Css( 'inner' ),
			new Kadence_Blocks_Rowlayout_Separator_Layer_Css(),
			new Kadence_Blocks_Rowlayout_Vertical_Alignment_Css(),
			new Kadence_Blocks_Rowlayout_Gap_Css( [ 'columnGutter', 'tabletGutter', 'mobileGutter' ], 'column-gap', 'customGutter', 'gutterType' ),
			new Kadence_Blocks_Rowlayout_Gap_Css( [ 'collapseGutter', 'tabletRowGutter', 'mobileRowGutter' ], 'row-gap', 'customRowGutter', 'rowGutterType' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'inheritMaxWidth', true ),
				[ new Kadence_Blocks_Rowlayout_Inherited_Width_Css( $environment ) ],
				[
					new Kadence_Blocks_Rowlayout_Max_Width_Css( 'desktop', 'maxWidth', null ),
					new Kadence_Blocks_Rowlayout_Max_Width_Css( 'tablet', 'responsiveMaxWidth', 0 ),
					new Kadence_Blocks_Rowlayout_Max_Width_Css( 'mobile', 'responsiveMaxWidth', 1 ),
				]
			),
		];
	}

	/**
	 * The sections of the padding and the minimum height.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function padding_sections(): array {
		return [
			new Kadence_Blocks_Rowlayout_Default_Padding_Css(),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition(
					[],
					[ 'topPadding', 'bottomPadding', 'leftPadding', 'rightPadding', 'topPaddingM', 'bottomPaddingM', 'leftPaddingM', 'rightPaddingM' ],
					[]
				),
				[
					new Kadence_Blocks_Rowlayout_Vertical_Padding_Css(),
					new Kadence_Blocks_Rowlayout_Padding_Entries_Css( 'desktop', [ [ 'padding-left', 'leftPadding', null ], [ 'padding-right', 'rightPadding', null ] ] ),
					new Kadence_Blocks_Rowlayout_Padding_Entries_Css(
						'tablet',
						[
							[ 'padding-top', 'tabletPadding', 0 ],
							[ 'padding-right', 'tabletPadding', 1 ],
							[ 'padding-bottom', 'tabletPadding', 2 ],
							[ 'padding-left', 'tabletPadding', 3 ],
						]
					),
					new Kadence_Blocks_Rowlayout_Padding_Entries_Css(
						'mobile',
						[
							[ 'padding-top', 'topPaddingM', null ],
							[ 'padding-bottom', 'bottomPaddingM', null ],
							[ 'padding-left', 'leftPaddingM', null ],
							[ 'padding-right', 'rightPaddingM', null ],
						]
					),
				],
				[ new Kadence_Blocks_Rowlayout_Padding_Fallback_Css(), new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ) ]
			),
			new Kadence_Blocks_Rowlayout_Min_Height_Css(),
			new Kadence_Blocks_Rowlayout_Min_Height_Device_Css( 'tablet', 'minHeightTablet' ),
			new Kadence_Blocks_Rowlayout_Min_Height_Device_Css( 'mobile', 'minHeightMobile' ),
		];
	}

	/**
	 * The sections of the grid of columns on every device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function layout_sections(): array {
		return [
			new Kadence_Blocks_Rowlayout_Grid_Css( 'desktop', 'desktop', 'desktop' ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Rowlayout_Order_Css( 'desktop' ) ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Rowlayout_Tablet_Gap_Condition(),
				[ new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Rowlayout_Selector_Css( 'inner' ), new Kadence_Blocks_Rowlayout_Grid_Css( 'desktop', 'tablet_inherit', 'tablet' ) ] ) ],
				[]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Rowlayout_Tablet_Layout_Condition(),
				[ new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Rowlayout_Selector_Css( 'inner' ), new Kadence_Blocks_Rowlayout_Grid_Css( 'tablet', 'tablet', 'tablet' ), new Kadence_Blocks_Rowlayout_Order_Css( 'tablet' ) ] ) ],
				[
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Rowlayout_Many_Columns_Condition(),
						[ new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Rowlayout_Selector_Css( 'inner' ), new Kadence_Blocks_Rowlayout_Grid_Css( 'mobile', 'mobile', 'tablet' ), new Kadence_Blocks_Rowlayout_Order_Css( 'mobile' ) ] ) ],
						[]
					),
				]
			),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Rowlayout_Selector_Css( 'inner' ), new Kadence_Blocks_Rowlayout_Grid_Css( 'mobile', 'mobile', 'mobile' ), new Kadence_Blocks_Rowlayout_Order_Css( 'mobile' ) ] ),
		];
	}

	/**
	 * The sections of the border radius, the shadow and the border.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function box_sections(): array {
		return [
			new Kadence_Blocks_Rowlayout_Selector_Css( 'base' ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Rowlayout_Radius_Condition(),
				[ new Kadence_Blocks_Rowlayout_Clip_Css(), new Kadence_Blocks_Rowlayout_Selector_Css( 'overlay' ), new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ) ],
				[]
			),
			new Kadence_Blocks_Rowlayout_Selector_Css( 'base' ),
			new Kadence_Blocks_Css_Enabled_Section( 'displayBoxShadow', [ new Kadence_Blocks_Css_Shadow_Section( 'boxShadow' ) ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'border', 'tabletBorder', 'mobileBorder' ], [], [ 'borderWidth', 'tabletBorderWidth', 'mobileBorderWidth' ] ),
				[
					new Kadence_Blocks_Css_Color_Section( 'border-color', 'border' ),
					new Kadence_Blocks_Css_Measure_Section( 'border-width', 'borderWidth' ),
					new Kadence_Blocks_Rowlayout_Border_Color_Css( 'tablet', 'tabletBorder' ),
					new Kadence_Blocks_Rowlayout_Border_Color_Css( 'mobile', 'mobileBorder' ),
				],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle' ) ]
			),
		];
	}

	/**
	 * The sections of the background on every device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment What the site offers.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function background_sections( Kadence_Blocks_Rowlayout_Environment $environment ): array {
		return [
			new Kadence_Blocks_Rowlayout_Selector_Css( 'base' ),
			new Kadence_Blocks_Css_Typed_Section(
				'backgroundSettingTab',
				[
					'normal'   => [ new Kadence_Blocks_Rowlayout_Background_Color_Css( $environment ), new Kadence_Blocks_Rowlayout_Image_Css( 'bgImg' ) ],
					'gradient' => [ new Kadence_Blocks_Rowlayout_Gradient_Css( 'background-image', 'gradient' ) ],
				]
			),
			new Kadence_Blocks_Rowlayout_Tablet_Background_Css(),
			new Kadence_Blocks_Rowlayout_Mobile_Background_Css(),
		];
	}

	/**
	 * The sections of the overlay on every device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function overlay_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'overlay', 'overlayBgImg', 'overlaySecond', 'overlayGradient' ], [], [] ),
				[
					new Kadence_Blocks_Rowlayout_Selector_Css( 'overlay' ),
					new Kadence_Blocks_Rowlayout_Overlay_Opacity_Css(),
					new Kadence_Blocks_Css_Typed_Section(
						'currentOverlayTab',
						[
							'normal'   => [ new Kadence_Blocks_Rowlayout_Overlay_Color_Css(), new Kadence_Blocks_Rowlayout_Image_Css( 'overlayBgImg' ) ],
							'gradient' => [ new Kadence_Blocks_Rowlayout_Gradient_Css( 'background', 'overlayGradient' ) ],
							'grad'     => [ new Kadence_Blocks_Rowlayout_Overlay_Old_Gradient_Css() ],
						]
					),
					new Kadence_Blocks_Rowlayout_Blend_Css(),
				],
				[]
			),
			new Kadence_Blocks_Rowlayout_Responsive_Overlay_Css( 'tablet', 'tabletOverlay' ),
			new Kadence_Blocks_Rowlayout_Responsive_Overlay_Css( 'mobile', 'mobileOverlay' ),
		];
	}

	/**
	 * The sections of the stacking order, the text colors, the separators, the visibility and the custom CSS.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function closing_sections(): array {
		return [
			new Kadence_Blocks_Rowlayout_Z_Index_Css(),
			new Kadence_Blocks_Rowlayout_Color_Output_Css( 'textColor', '{base} ,{base} h1,{base} h2,{base} h3,{base} h4,{base} h5,{base} h6' ),
			new Kadence_Blocks_Rowlayout_Color_Output_Css( 'linkColor', '{base} a' ),
			new Kadence_Blocks_Rowlayout_Color_Output_Css( 'linkHoverColor', '{base} a:hover' ),
			new Kadence_Blocks_Rowlayout_Separator_Css( 'bottom', false ),
			new Kadence_Blocks_Rowlayout_Separator_Css( 'top', true ),
			new Kadence_Blocks_Rowlayout_Visibility_Css( 'vsdesk', 'desktopOnly' ),
			new Kadence_Blocks_Rowlayout_Visibility_Css( 'vstablet', 'tabletOnly' ),
			new Kadence_Blocks_Rowlayout_Visibility_Css( 'vsmobile', 'mobile' ),
			new Kadence_Blocks_Rowlayout_Slider_Pause_Css(),
			new Kadence_Blocks_Rowlayout_Custom_Css(),
		];
	}
}
