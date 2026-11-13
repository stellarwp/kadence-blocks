<?php
/**
 * Builds the CSS for the navigation link block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/navigation-link/loader.php';

/**
 * Builds the CSS for the navigation link block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Link_Css {

	/**
	 * The selector of the link.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BASE = '.kb-nav-link-{id}';

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
			[ 'ratio' => new Kadence_Blocks_Navigation_Link_Media_Ratio( $attributes ) ]
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
			[ new Kadence_Blocks_Navigation_Link_Sized_Styles() ],
			$this->dropdown_sections(),
			$this->spacing_sections(),
			$this->link_sections(),
			$this->media_sections(),
			$this->text_sections(),
			$this->detail_sections()
		);
	}

	/**
	 * The sections of the shadow, the radius and the border of the dropdown, and the padding of the media.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function dropdown_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::BASE ),
			new Kadence_Blocks_Css_Scoped_Section( 'dropdownShadow', [ new Kadence_Blocks_Css_Enabled_Section( 'enable', [ new Kadence_Blocks_Navigation_Link_Dropdown_Shadow() ] ) ] ),
			new Kadence_Blocks_Css_Measure_Section(
				'border-radius',
				'dropdownBorderRadius',
				[
					'desktop_key' => 'dropdownBorderRadius',
					'tablet_key'  => 'dropdownBorderRadiusTablet',
					'mobile_key'  => 'dropdownBorderRadiusMobile',
					'first_prop'  => '--kb-nav-dropdown-border-top-left-radius',
					'second_prop' => '--kb-nav-dropdown-border-top-right-radius',
					'third_prop'  => '--kb-nav-dropdown-border-bottom-right-radius',
					'fourth_prop' => '--kb-nav-dropdown-border-bottom-left-radius',
				]
			),
			new Kadence_Blocks_Css_Border_Styles_Section(
				'dropdownBorder',
				false,
				[
					'renderAsVars' => true,
					'varBase'      => '--kb-nav-dropdown-',
				]
			),
			new Kadence_Blocks_Navigation_Link_Media_Padding(),
		];
	}

	/**
	 * The sections of the margins and the paddings of the dropdown, its links and the link.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function spacing_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::BASE . ' > .sub-menu.sub-menu.sub-menu.sub-menu.sub-menu' ),
			new Kadence_Blocks_Css_Measure_Section( '--kb-nav-dropdown-margin', 'marginDropdown', [ 'unit_key' => 'marginDropdownUnit' ] ),
			new Kadence_Blocks_Css_Measure_Section( '--kb-nav-dropdown-padding', 'paddingDropdown', [ 'unit_key' => 'paddingDropdownUnit' ] ),
			new Kadence_Blocks_Css_Measure_Section( '--kb-nav-dropdown-link-margin', 'marginDropdownLink', [ 'unit_key' => 'marginDropdownLinkUnit' ] ),
			new Kadence_Blocks_Css_Measure_Section( '--kb-nav-dropdown-link-padding', 'paddingDropdownLink', [ 'unit_key' => 'paddingDropdownLinkUnit' ] ),
			new Kadence_Blocks_Css_Selector_Section( self::BASE . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap' ),
			new Kadence_Blocks_Css_Measure_Section( '--kb-nav-link-margin', 'margin', [ 'unit_key' => 'marginUnit' ] ),
			new Kadence_Blocks_Css_Measure_Section( '--kb-nav-link-padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
		];
	}

	/**
	 * The sections of the container of the link and of its highlight.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function link_sections(): array {
		return [
			new Kadence_Blocks_Css_Button_States_Section(
				[
					'colorBase'              => 'linkColor',
					'backgroundBase'         => 'background',
					'backgroundTypeBase'     => 'backgroundType',
					'backgroundGradientBase' => 'backgroundGradient',
					'borderBase'             => 'border',
					'borderRadiusBase'       => 'borderRadius',
					'borderRadiusUnitBase'   => 'borderRadiusUnit',
					'shadowBase'             => 'shadow',
					'renderAsVars'           => true,
					'varBase'                => '--kb-nav-link-',
				]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Navigation_Link_Highlight_Condition(),
				[ new Kadence_Blocks_Css_Scoped_Section( 'highlightSpacing', $this->highlight_sections() ) ],
				[]
			),
		];
	}

	/**
	 * The sections of the spacing, the border and the gaps of the highlight.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function highlight_sections(): array {
		return [
			new Kadence_Blocks_Css_Measure_Section( '--kb-nav-link-highlight-padding', 'padding' ),
			new Kadence_Blocks_Css_Border_Styles_Section(
				'border',
				false,
				[
					'renderAsVars' => true,
					'varBase'      => '--kb-nav-link-highlight-',
				]
			),
			new Kadence_Blocks_Css_Measure_Section(
				'border-radius',
				'borderRadius',
				[
					'first_prop'  => '--kb-nav-link-highlight-border-top-left-radius',
					'second_prop' => '--kb-nav-link-highlight-border-top-right-radius',
					'third_prop'  => '--kb-nav-link-highlight-border-bottom-right-radius',
					'fourth_prop' => '--kb-nav-link-highlight-border-bottom-left-radius',
				]
			),
			new Kadence_Blocks_Css_Gap_Section(
				'gap',
				'gap',
				'gapUnit',
				[
					'renderAsVars' => true,
					'varBase'      => '--kb-nav-link-highlight-',
				]
			),
			new Kadence_Blocks_Css_Gap_Section(
				'textGap',
				'gap',
				'gapUnit',
				[
					'renderAsVars' => true,
					'varBase'      => '--kb-nav-link-highlight-text-',
				]
			),
		];
	}

	/**
	 * The sections of the media container, the size of the media and the overlay of an image.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function media_sections(): array {
		return [
			new Kadence_Blocks_Css_Button_States_Section(
				[
					'colorBase'              => 'mediaColor',
					'backgroundBase'         => 'mediaBackground',
					'backgroundTypeBase'     => 'mediaBackgroundType',
					'backgroundGradientBase' => 'mediaBackgroundGradient',
					'borderBase'             => 'mediaBorder',
					'borderRadiusBase'       => 'mediaBorderRadius',
					'borderRadiusUnitBase'   => 'mediaBorderRadiusUnit',
					'renderAsVars'           => true,
					'varBase'                => '--kb-nav-link-media-container-',
				]
			),
			new Kadence_Blocks_Navigation_Link_Media_Max_Width(),
			new Kadence_Blocks_Navigation_Link_Media_Intrinsic(),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Css_Strict_Condition( 'mediaType', 'image' ), $this->overlay_sections(), [] ),
		];
	}

	/**
	 * The sections of the overlay of an image. The background of the container is hidden so that only the overlay shows it.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function overlay_sections(): array {
		$overlay = self::BASE . ' .kb-nav-link-image-overlay';

		return [
			new Kadence_Blocks_Css_Rule_Section( self::BASE . '.kb-menu-has-image .link-media-container', [ 'background' => 'transparent' ] ),
			new Kadence_Blocks_Css_Rule_Section( self::BASE . ' .link-media-container .kadence-navigation-link-image-intrinsic', [ 'position' => 'relative' ] ),
			new Kadence_Blocks_Css_Rule_Section(
				$overlay,
				[
					'position'         => 'absolute',
					'inset'            => '0',
					'background-color' => 'var(--kb-nav-link-media-container-background, transparent)',
					'opacity'          => '0.5',
					'pointer-events'   => 'none',
				]
			),
			new Kadence_Blocks_Css_Rule_Section( self::BASE . ' .kb-link-wrap:hover .kb-nav-link-image-overlay', [ 'background-color' => 'var(--kb-nav-link-media-container-background-hover, var(--kb-nav-link-media-container-background, transparent))' ] ),
			new Kadence_Blocks_Css_Rule_Section( self::BASE . ' .kb-link-wrap:active .kb-nav-link-image-overlay', [ 'background-color' => 'var(--kb-nav-link-media-container-background-active, var(--kb-nav-link-media-container-background-hover, var(--kb-nav-link-media-container-background, transparent)))' ] ),
			new Kadence_Blocks_Css_Rule_Section( self::BASE . '.current-menu-item .kb-nav-link-image-overlay', [ 'background-color' => 'var(--kb-nav-link-media-container-background-active, var(--kb-nav-link-media-container-background, transparent))' ] ),
		];
	}

	/**
	 * The sections of the typography of the label, the dropdown, the highlight and the descriptions.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function text_sections(): array {
		$description = '.wp-block-kadence-navigation .navigation .menu-container ul ' . self::BASE;

		return [
			new Kadence_Blocks_Css_Selector_Section( self::BASE . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap > .kb-nav-link-content' ),
			new Kadence_Blocks_Css_Typography_Section( 'typography' ),
			new Kadence_Blocks_Css_Selector_Section( self::BASE . ' .sub-menu li.menu-item > .kb-link-wrap > .kb-nav-link-content' ),
			new Kadence_Blocks_Css_Typography_Section( 'dropdownTypography' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Navigation_Link_Highlight_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( self::BASE . ' > .kb-link-wrap > .kb-nav-link-content .link-highlight-label' ),
					new Kadence_Blocks_Css_Typography_Section( 'highlightTypography' ),
				],
				[]
			),
			new Kadence_Blocks_Css_Selector_Section( $description . ' .kb-nav-label-description' ),
			new Kadence_Blocks_Css_Typography_Section( 'descriptionTypography' ),
			new Kadence_Blocks_Css_Selector_Section( $description . ' .sub-menu .kb-nav-label-description' ),
			new Kadence_Blocks_Css_Typography_Section( 'dropdownDescriptionTypography' ),
		];
	}

	/**
	 * The sections of the size of the highlight icon and of the cursor of a disabled link.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function detail_sections(): array {
		return [
			new Kadence_Blocks_Css_Scoped_Section( 'highlightIcon', [ new Kadence_Blocks_Css_Enabled_Section( 'icon', [ new Kadence_Blocks_Css_Enabled_Section( 'size', $this->icon_size_sections() ) ] ) ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Navigation_Link_Disabled_Link_Condition(),
				[ new Kadence_Blocks_Css_Rule_Section( self::BASE . ' > .kb-link-wrap > .kb-nav-link-content', [ 'cursor' => 'default' ] ) ],
				[]
			),
		];
	}

	/**
	 * The sections that size the highlight icon.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function icon_size_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::BASE . ' .link-highlight-label .link-highlight-icon-wrap svg' ),
			new Kadence_Blocks_Css_Suffixed_Section( 'height', 'size', 'px' ),
			new Kadence_Blocks_Css_Suffixed_Section( 'width', 'size', 'px' ),
		];
	}
}
