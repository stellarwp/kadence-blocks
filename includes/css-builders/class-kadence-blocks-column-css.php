<?php
/**
 * Builds the CSS for the column block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/column/loader.php';

/**
 * Builds the CSS for the column block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Css {

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
		$input = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_style_id, $this->context, [ 'layout' => new Kadence_Blocks_Column_Layout( $attributes ) ] );

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
		return array_merge(
			$this->flow_sections(),
			$this->box_sections(),
			$this->direction_sections(),
			$this->fill_sections(),
			$this->text_sections(),
			$this->tablet_sections(),
			$this->mobile_sections(),
			$this->closing_sections()
		);
	}

	/**
	 * The sections that size the column and make it a flex box.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function flow_sections(): array {
		return [
			new Kadence_Blocks_Column_Flex_Display_Css(),
			new Kadence_Blocks_Column_Flex_Grow_Css( 'desktop', 0 ),
			new Kadence_Blocks_Column_Flex_Grow_Css( 'tablet', 1 ),
			new Kadence_Blocks_Column_Flex_Grow_Css( 'mobile', 2 ),
			new Kadence_Blocks_Column_Max_Width_Desktop_Css(),
			new Kadence_Blocks_Column_Sticky_Css(),
			new Kadence_Blocks_Column_Sticky_Offset_Css( 'tablet', 1 ),
			new Kadence_Blocks_Column_Sticky_Offset_Css( 'mobile', 2 ),
		];
	}

	/**
	 * The sections of the padding, the height, the shadow, the borders and the gap.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function box_sections(): array {
		return array_merge( $this->padding_sections(), $this->border_sections(), $this->hover_border_sections(), $this->gap_sections() );
	}

	/**
	 * The sections of the padding, the minimum height and the shadow.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function padding_sections(): array {
		return [
			new Kadence_Blocks_Column_Selector_Css( 'inner' ),
			new Kadence_Blocks_Css_Choice_Section(
				Kadence_Blocks_Css_Legacy_Condition::sides( 'padding' ),
				[ new Kadence_Blocks_Css_Legacy_Sides_Section( 'padding', [ 'top', 'bottom', 'left', 'right' ], 'paddingType' ) ],
				[ new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingType' ] ) ]
			),
			new Kadence_Blocks_Column_Selector_Css( 'inner' ),
			new Kadence_Blocks_Column_Min_Height_Css( 'desktop', 0 ),
			new Kadence_Blocks_Column_Min_Height_Css( 'tablet', 1 ),
			new Kadence_Blocks_Column_Min_Height_Css( 'mobile', 2 ),
			new Kadence_Blocks_Css_Enabled_Section( 'displayShadow', [ new Kadence_Blocks_Css_Shadow_Section( 'shadow' ) ] ),
		];
	}

	/**
	 * The sections of the border and the border radius.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function border_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'border' ], [], [ 'borderWidth', 'tabletBorderWidth', 'mobileBorderWidth' ] ),
				[ new Kadence_Blocks_Column_Border_Color_Css(), new Kadence_Blocks_Css_Measure_Section( 'border-width', 'borderWidth' ) ],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle' ) ]
			),
			new Kadence_Blocks_Column_Selector_Css( 'inner_and_before' ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ),
		];
	}

	/**
	 * The sections of the hover border, the hover border radius and the hover shadow.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function hover_border_sections(): array {
		return [
			new Kadence_Blocks_Column_Selector_Css( 'hover_inner' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'borderHover' ], [], [ 'borderHoverWidth', 'tabletBorderHoverWidth', 'mobileBorderHoverWidth' ] ),
				[ new Kadence_Blocks_Css_Color_Section( 'border-color', 'borderHover' ), new Kadence_Blocks_Css_Measure_Section( 'border-width', 'borderHoverWidth' ) ],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'borderHoverStyle' ) ]
			),
			new Kadence_Blocks_Column_Selector_Css( 'hover_inner_and_before' ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderHoverRadius', [ 'unit_key' => 'borderHoverRadiusUnit' ] ),
			new Kadence_Blocks_Css_Enabled_Section( 'displayHoverShadow', [ new Kadence_Blocks_Column_Selector_Css( 'hover_inner' ), new Kadence_Blocks_Css_Shadow_Section( 'shadowHover' ) ] ),
		];
	}

	/**
	 * The sections of the gap between the content.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function gap_sections(): array {
		return [
			new Kadence_Blocks_Column_Selector_Css( 'inner' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Column_Horizontal_Gap_Condition(),
				[ new Kadence_Blocks_Column_Horizontal_Gap_Css() ],
				[ new Kadence_Blocks_Column_Vertical_Gap_Css() ]
			),
		];
	}

	/**
	 * The sections of the direction of the content on desktop, and of how the row aligns the column.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function direction_sections(): array {
		return [
			new Kadence_Blocks_Column_Orientation_Css( 0, [ new Kadence_Blocks_Column_Desktop_Vertical_Css() ], [ new Kadence_Blocks_Column_Desktop_Horizontal_Css() ] ),
			new Kadence_Blocks_Column_Row_Alignment_Css(),
		];
	}

	/**
	 * The sections of the background and the overlay, in their normal and hover state.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function fill_sections(): array {
		return array_merge( $this->background_sections(), $this->overlay_sections() );
	}

	/**
	 * The sections of the background, the hover background and the backdrop filter.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function background_sections(): array {
		return [
			new Kadence_Blocks_Column_Selector_Css( 'inner' ),
			new Kadence_Blocks_Css_Typed_Section(
				'backgroundType',
				[
					'normal'   => [ new Kadence_Blocks_Column_Background_Color_Css(), new Kadence_Blocks_Column_Background_Image_Css( 'backgroundImg' ) ],
					'gradient' => [ new Kadence_Blocks_Css_Value_Section( 'background-image', 'gradient' ) ],
				]
			),
			new Kadence_Blocks_Column_Selector_Css( 'hover_inner' ),
			new Kadence_Blocks_Css_Typed_Section(
				'backgroundHoverType',
				[
					'normal'   => [ new Kadence_Blocks_Column_Hover_Color_Css( 'backgroundHover', false ), new Kadence_Blocks_Column_Background_Image_Css( 'backgroundImgHover' ) ],
					'gradient' => [ new Kadence_Blocks_Css_Value_Section( 'background-image', 'gradientHover' ) ],
				]
			),
			new Kadence_Blocks_Column_Backdrop_Filter_Css(),
		];
	}

	/**
	 * The sections of the overlay and the hover overlay.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function overlay_sections(): array {
		return [
			new Kadence_Blocks_Column_Selector_Css( 'inner_before' ),
			new Kadence_Blocks_Column_Opacity_Css( 'overlayOpacity' ),
			new Kadence_Blocks_Css_Value_Section( 'mix-blend-mode', 'overlayBlendMode' ),
			new Kadence_Blocks_Css_Typed_Section(
				'overlayType',
				[
					'normal'   => [ new Kadence_Blocks_Css_Color_Section( 'background-color', 'overlay' ), new Kadence_Blocks_Column_Background_Image_Css( 'overlayImg' ) ],
					'gradient' => [ new Kadence_Blocks_Css_Value_Section( 'background-image', 'overlayGradient' ) ],
				]
			),
			new Kadence_Blocks_Column_Selector_Css( 'hover_inner_before' ),
			new Kadence_Blocks_Column_Opacity_Css( 'overlayHoverOpacity' ),
			new Kadence_Blocks_Css_Value_Section( 'mix-blend-mode', 'hoverOverlayBlendMode' ),
			new Kadence_Blocks_Css_Typed_Section(
				'overlayHoverType',
				[
					'normal'   => [ new Kadence_Blocks_Column_Hover_Color_Css( 'overlayHover', true ), new Kadence_Blocks_Column_Background_Image_Css( 'overlayImgHover' ) ],
					'gradient' => [ new Kadence_Blocks_Css_Value_Section( 'background-image', 'overlayGradientHover' ) ],
				]
			),
		];
	}

	/**
	 * The sections of the text alignment, the text colors and the stacking order.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function text_sections(): array {
		$headings = '{col}, {col} h1, {col} h2, {col} h3, {col} h4, {col} h5, {col} h6';
		$hovered  = '{col}:hover, {col}:hover h1, {col}:hover h2, {col}:hover h3, {col}:hover h4, {col}:hover h5, {col}:hover h6';

		return [
			new Kadence_Blocks_Column_Text_Align_Css( 0 ),
			new Kadence_Blocks_Column_Color_Rule_Css( 'textColor', $headings ),
			new Kadence_Blocks_Column_Color_Rule_Css( 'linkColor', '{col} a' ),
			new Kadence_Blocks_Column_Color_Rule_Css( 'linkHoverColor', '{col} a:hover' ),
			new Kadence_Blocks_Column_Color_Rule_Css( 'textColorHover', $hovered ),
			new Kadence_Blocks_Column_Color_Rule_Css( 'linkColorHover', '{col}:hover a' ),
			new Kadence_Blocks_Column_Color_Rule_Css( 'linkHoverColorHover', '{col}:hover a:hover' ),
			new Kadence_Blocks_Column_Z_Index_Css(),
		];
	}

	/**
	 * The sections of the tablet media query.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function tablet_sections(): array {
		return [
			new Kadence_Blocks_Css_Device_Section(
				'tablet',
				[
					new Kadence_Blocks_Column_Max_Width_Tablet_Css(),
					new Kadence_Blocks_Column_Collapse_Order_Css( 'tab', '' ),
					new Kadence_Blocks_Column_Text_Align_Css( 1 ),
					new Kadence_Blocks_Column_Orientation_Css(
						1,
						[ new Kadence_Blocks_Column_Vertical_Flow_Css( 1 ), new Kadence_Blocks_Column_Tablet_Cross_Css(), new Kadence_Blocks_Column_Tablet_Children_Css() ],
						[
							new Kadence_Blocks_Column_Flex_Basis_Css( 1 ),
							new Kadence_Blocks_Column_Vertical_To_Horizontal_Css( 0, 1, false ),
							new Kadence_Blocks_Column_Row_Direction_Css( 1 ),
							new Kadence_Blocks_Column_Row_Align_Css( 1, false ),
							new Kadence_Blocks_Column_Text_Justify_Css( 1 ),
							new Kadence_Blocks_Column_Row_Wrap_Css( 1 ),
							new Kadence_Blocks_Column_Row_Children_Css( 'tabletOnly' ),
						]
					),
				]
			),
		];
	}

	/**
	 * The sections of the mobile media query.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function mobile_sections(): array {
		return [
			new Kadence_Blocks_Css_Device_Section(
				'mobile',
				[
					new Kadence_Blocks_Column_Max_Width_Mobile_Css(),
					new Kadence_Blocks_Column_Max_Width_Fallback_Css( 1 ),
					new Kadence_Blocks_Column_Max_Width_Fallback_Css( 0 ),
					new Kadence_Blocks_Column_Collapse_Order_Css( 'mobile', ' !important' ),
					new Kadence_Blocks_Column_Text_Align_Css( 2 ),
					new Kadence_Blocks_Column_Orientation_Css(
						2,
						[ new Kadence_Blocks_Column_Vertical_Flow_Css( 2 ), new Kadence_Blocks_Column_Mobile_Cross_Css(), new Kadence_Blocks_Column_Mobile_Children_Css() ],
						[
							new Kadence_Blocks_Column_Flex_Basis_Css( 2 ),
							new Kadence_Blocks_Column_Vertical_To_Horizontal_Css( 1, 2, true ),
							new Kadence_Blocks_Column_Row_Direction_Css( 2 ),
							new Kadence_Blocks_Column_Start_Justify_Css(),
							new Kadence_Blocks_Column_Row_Align_Css( 2, true ),
							new Kadence_Blocks_Column_Text_Justify_Css( 2 ),
							new Kadence_Blocks_Column_Row_Wrap_Css( 2 ),
							new Kadence_Blocks_Column_Row_Children_Css( 'mobile' ),
						]
					),
				]
			),
		];
	}

	/**
	 * The sections that go last so that they have priority: the margin and the custom CSS.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function closing_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				Kadence_Blocks_Css_Legacy_Condition::sides( 'margin' ),
				[
					new Kadence_Blocks_Column_Selector_Css( '.wp-block-kadence-column{col} > .kt-inside-inner-col' ),
					new Kadence_Blocks_Css_Legacy_Sides_Section( 'margin', [ 'top', 'bottom', 'right', 'left' ], 'marginType' ),
				],
				[
					new Kadence_Blocks_Column_Selector_Css( '{col}, .kt-inside-inner-col > {col}:not(.specificity)' ),
					new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', [ 'unit_key' => 'marginType' ] ),
				]
			),
			new Kadence_Blocks_Css_Custom_Section( '.kadence-column{id}', 'kadenceBlockCSS' ),
		];
	}
}
