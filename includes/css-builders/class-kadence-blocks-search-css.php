<?php
/**
 * Builds the CSS for the search block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/search/loader.php';

/**
 * Builds the CSS for the search block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Search_Css {

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
			$this->container_sections(),
			$this->modal_sections(),
			$this->input_sections(),
			$this->input_icon_sections(),
			$this->close_sections(),
			$this->width_sections()
		);
	}

	/**
	 * The sections of the margin and the padding of the block.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-search{id}' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding' ),
		];
	}

	/**
	 * The sections of the background of the modal.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function modal_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-modal' ),
			$this->background_section( '--kb-search-modal-background', 'modalBackgroundType', 'modalGradientActive', 'modalBackgroundColor' ),
		];
	}

	/**
	 * The sections of the text input, its placeholder and its wrapper.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function input_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-input[type="text"]' ),
			new Kadence_Blocks_Css_Typography_Section( 'inputTypography' ),
			new Kadence_Blocks_Css_Unit_Measure_Range_Section( 'inputBorderRadius', 'border-radius', 'inputBorderRadiusUnit' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'inputPadding' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'inputBorderStyles' ),
			new Kadence_Blocks_Css_Rendered_Color_Section( 'color', 'inputColor' ),
			$this->background_section( 'background', 'inputBackgroundType', 'inputGradient', 'inputBackgroundColor' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-input[type="text"]::placeholder' ),
			new Kadence_Blocks_Css_Rendered_Color_Section( 'color', 'inputPlaceholderColor' ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-input-wrapper' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'inputMargin' ),
		];
	}

	/**
	 * The sections of the colors of the search icon, normal and hovered.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function input_icon_sections(): array {
		return array_merge(
			[ new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-icon svg' ) ],
			$this->icon_color_sections( 'inputIcon', 'inputIconColor' ),
			[
				new Kadence_Blocks_Css_Choice_Section(
					new Kadence_Blocks_Css_Strict_Condition( 'displayStyle', 'modal' ),
					[ new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-input-wrapper:hover .kb-search-icon svg' ) ],
					[ new Kadence_Blocks_Css_Selector_Section( '.kb-search{id}:hover .kb-search-icon svg' ) ]
				),
			],
			$this->icon_color_sections( 'inputIcon', 'inputIconHoverColor' )
		);
	}

	/**
	 * The sections of the close button: the colors of its icon, normal and hovered, and its size.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function close_sections(): array {
		return array_merge(
			[ new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-close-btn svg' ) ],
			$this->icon_color_sections( 'closeIcon', 'closeIconColor' ),
			[
				new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-close-btn' ),
				new Kadence_Blocks_Css_Item_Value_Section( 'font-size', 'closeIconSize', 0, 'px' ),
				new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Css_Item_Value_Section( 'font-size', 'closeIconSize', 1, 'px' ) ] ),
				new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Css_Item_Value_Section( 'font-size', 'closeIconSize', 2, 'px' ) ] ),
				new Kadence_Blocks_Css_Selector_Section( '.kb-search{id} .kb-search-close-btn:hover svg' ),
			],
			$this->icon_color_sections( 'closeIcon', 'closeIconHoverColor' )
		);
	}

	/**
	 * The sections of the maximum and the minimum width of the form.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function width_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( [ '.kb-search.kb-search{id} form', '.kb-search.kb-search{id} .kb-search-modal-content form form' ] ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'inputMaxWidth', 'max-width', 'inputMaxWidthType' ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'inputMinWidth', 'min-width', 'inputMinWidthType' ),
		];
	}

	/**
	 * The section of a background that is a gradient or a color.
	 *
	 * @since TBD
	 *
	 * @param string $property       The CSS property.
	 * @param string $type_attribute The attribute that stores the type of the background.
	 * @param string $gradient       The attribute that stores the gradient.
	 * @param string $color          The attribute that stores the color.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function background_section( string $property, string $type_attribute, string $gradient, string $color ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Strict_Condition( $type_attribute, 'gradient' ),
			[ new Kadence_Blocks_Css_Attribute_Section( $property, $gradient ) ],
			[ new Kadence_Blocks_Css_Rendered_Color_Section( $property, $color ) ]
		);
	}

	/**
	 * The sections of the color of an icon: a Feather icon is stroked, any other one is filled.
	 *
	 * @since TBD
	 *
	 * @param string $icon  The attribute that stores the icon name.
	 * @param string $color The attribute that stores the color.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function icon_color_sections( string $icon, string $color ): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Search_Feather_Condition( $icon ),
				[
					new Kadence_Blocks_Css_Rendered_Color_Section( 'stroke', $color ),
					new Kadence_Blocks_Css_Static_Section( 'fill', 'none' ),
				],
				[
					new Kadence_Blocks_Css_Rendered_Color_Section( 'fill', $color ),
					new Kadence_Blocks_Css_Static_Section( 'stroke', 'none' ),
				]
			),
		];
	}
}
