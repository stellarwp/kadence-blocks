<?php
/**
 * Class to Build the Navigation Link Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Navigation Link Block.
 *
 * @category class
 */
class Kadence_Blocks_Navigation_Link_Block extends Kadence_Blocks_Abstract_Block {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'navigation-link';

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $seen_refs = [];

	/**
	 * Block determines if style needs to be loaded for block.
	 * This block doesn't because it's stylesheet is merged with the parent nav block's
	 *
	 * @var string
	 */
	protected $has_style = false;

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string             $unique_id the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = [ 'Desktop', 'Tablet', 'Mobile' ];

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		$image_ratio_padding = ! is_numeric( $attributes['mediaImage'][0]['height'] )
			? null
			: ( $attributes['mediaImage'][0]['height'] / $attributes['mediaImage'][0]['width'] ) * 100 . '%';
		$image_ratio_height  = ! is_numeric( $attributes['mediaImage'][0]['height'] ) ? null : 0;
		$has_ratio           = false;
		if ( $attributes['imageRatio'] && 'inherit' !== $attributes['imageRatio'] ) {
			$has_ratio          = true;
			$image_ratio_height = 0;
			switch ( $attributes['imageRatio'] ) {
				case 'land43':
					$image_ratio_padding = '75%';
					break;
				case 'land32':
					$image_ratio_padding = '66.67%';
					break;
				case 'land169':
					$image_ratio_padding = '56.25%';
					break;
				case 'land21':
					$image_ratio_padding = '50%';
					break;
				case 'land31':
					$image_ratio_padding = '33%';
					break;
				case 'land41':
					$image_ratio_padding = '25%';
					break;
				case 'port34':
					$image_ratio_padding = '133.33%';
					break;
				case 'port23':
					$image_ratio_padding = '150%';
					break;
				default:
					$image_ratio_padding = '100%';
					break;
			}
		}

		// non specific syles / variables
		$css->set_selector( '.kb-nav-link-' . $unique_id );
		if ( isset( $attributes['dropdownShadow'][0]['enable'] ) && $attributes['dropdownShadow'][0]['enable'] ) {
			$css->add_property( '--kb-nav-dropdown-box-shadow', $css->render_shadow( $attributes['dropdownShadow'][0] ) );
		}
		$css->render_measure_output(
			$attributes,
			'dropdownBorderRadius',
			'border-radius',
			[
				'desktop_key' => 'dropdownBorderRadius',
				'tablet_key'  => 'dropdownBorderRadiusTablet',
				'mobile_key'  => 'dropdownBorderRadiusMobile',
				'first_prop'  => '--kb-nav-dropdown-border-top-left-radius',
				'second_prop' => '--kb-nav-dropdown-border-top-right-radius',
				'third_prop'  => '--kb-nav-dropdown-border-bottom-right-radius',
				'fourth_prop' => '--kb-nav-dropdown-border-bottom-left-radius',
			]
		);
		$css->render_border_styles(
			$attributes,
			'dropdownBorder',
			false,
			[
				'renderAsVars' => true,
				'varBase'      => '--kb-nav-dropdown-',
			]
		);
		if ( ! empty( $attributes['mediaStyle'][0] ) ) {
			$css->render_measure_output(
				$attributes['mediaStyle'][0],
				'padding',
				'padding',
				[
					'desktop_key' => 'padding',
					'tablet_key'  => 'paddingTablet',
					'mobile_key'  => 'paddingMobile',
					'unit_key'    => 'paddingType',
					'first_prop'  => '--kb-nav-link-media-container-padding-top',
					'second_prop' => '--kb-nav-link-media-container-padding-right',
					'third_prop'  => '--kb-nav-link-media-container-padding-bottom',
					'fourth_prop' => '--kb-nav-link-media-container-padding-left',
				]
			);
		}
		$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .sub-menu.sub-menu.sub-menu.sub-menu.sub-menu' );
		$css->render_measure_output( $attributes, 'marginDropdown', '--kb-nav-dropdown-margin', [ 'unit_key' => 'marginDropdownUnit' ] );
		$css->render_measure_output( $attributes, 'paddingDropdown', '--kb-nav-dropdown-padding', [ 'unit_key' => 'paddingDropdownUnit' ] );
		$css->render_measure_output( $attributes, 'marginDropdownLink', '--kb-nav-dropdown-link-margin', [ 'unit_key' => 'marginDropdownLinkUnit' ] );
		$css->render_measure_output( $attributes, 'paddingDropdownLink', '--kb-nav-dropdown-link-padding', [ 'unit_key' => 'paddingDropdownLinkUnit' ] );

		// no bleed variables (extra specific to beat things like dropdown or top level styling)
		$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap' );
		$css->render_measure_output( $attributes, 'margin', '--kb-nav-link-margin', [ 'unit_key' => 'marginUnit' ] );
		$css->render_measure_output( $attributes, 'padding', '--kb-nav-link-padding', [ 'unit_key' => 'paddingUnit' ] );

		// container styles
		$css->render_button_styles_with_states(
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
			],
			$attributes
		);
		if ( ! empty( $attributes['highlightLabel'] ) || ! empty( $attributes['highlightIcon']['icon'] ) ) {
			if ( isset( $attributes['highlightSpacing'][0] ) && is_array( $attributes['highlightSpacing'][0] ) ) {
				// $css->render_measure_output( $attributes['highlightSpacing'][0], 'margin', '--kb-nav-link-highlight-margin' );
				$css->render_measure_output( $attributes['highlightSpacing'][0], 'padding', '--kb-nav-link-highlight-padding' );
				$css->render_border_styles(
					$attributes['highlightSpacing'][0],
					'border',
					false,
					[
						'renderAsVars' => true,
						'varBase'      => '--kb-nav-link-highlight-',
					]
				);
				$css->render_measure_output(
					$attributes['highlightSpacing'][0],
					'borderRadius',
					'border-radius',
					[
						'first_prop'  => '--kb-nav-link-highlight-border-top-left-radius',
						'second_prop' => '--kb-nav-link-highlight-border-top-right-radius',
						'third_prop'  => '--kb-nav-link-highlight-border-bottom-right-radius',
						'fourth_prop' => '--kb-nav-link-highlight-border-bottom-left-radius',
					]
				);
				$css->render_gap(
					$attributes['highlightSpacing'][0],
					'gap',
					'gap',
					'gapUnit',
					[
						'renderAsVars' => true,
						'varBase'      => '--kb-nav-link-highlight-',
					]
				);
				$css->render_gap(
					$attributes['highlightSpacing'][0],
					'textGap',
					'gap',
					'gapUnit',
					[
						'renderAsVars' => true,
						'varBase'      => '--kb-nav-link-highlight-text-',
					]
				);
			}
		}
		$css->render_button_styles_with_states(
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
			],
			$attributes
		);
		$css->add_property( '--kb-nav-link-media-max-width', $attributes['mediaImage'][0]['maxWidth'] . 'px' );
		if ( $has_ratio ) {
			// next level container
			$css->add_property( '--kb-nav-link-media-intrinsic-padding-bottom', $image_ratio_padding );
			$css->add_property( '--kb-nav-link-media-intrinsic-height', $image_ratio_height == 0 ? '0px' : $image_ratio_height, null, true );
			$css->add_property( '--kb-nav-link-media-intrinsic-width', ! is_numeric( $attributes['mediaImage'][0]['width'] ) ? null : $attributes['mediaImage'][0]['width'] . 'px' );
		}

		// Image overlay: uses imageOverlayBackground* (Overlay Color) when media type is image. For image, the
		// container must not show background (it would appear as a box); only the overlay shows it.
		// Variables --kb-nav-link-media-container-background{, -hover, -active} are set in sized_dynamic_styles
		// from imageOverlayBackground* attributes (separate from mediaBackground* used for icon).
		if ( ! empty( $attributes['mediaType'] ) && 'image' === $attributes['mediaType'] ) {
			$css->set_selector( '.kb-nav-link-' . $unique_id . '.kb-menu-has-image .link-media-container' );
			$css->add_property( 'background', 'transparent' );

			$css->set_selector( '.kb-nav-link-' . $unique_id . ' .link-media-container .kadence-navigation-link-image-intrinsic' );
			$css->add_property( 'position', 'relative' );

			$css->set_selector( '.kb-nav-link-' . $unique_id . ' .kb-nav-link-image-overlay' );
			$css->add_property( 'position', 'absolute' );
			$css->add_property( 'inset', '0' );
			$css->add_property( 'background-color', 'var(--kb-nav-link-media-container-background, transparent)' );
			$css->add_property( 'opacity', '0.5' );
			$css->add_property( 'pointer-events', 'none' );

			$css->set_selector( '.kb-nav-link-' . $unique_id . ' .kb-link-wrap:hover .kb-nav-link-image-overlay' );
			$css->add_property( 'background-color', 'var(--kb-nav-link-media-container-background-hover, var(--kb-nav-link-media-container-background, transparent))' );

			$css->set_selector( '.kb-nav-link-' . $unique_id . ' .kb-link-wrap:active .kb-nav-link-image-overlay' );
			$css->add_property( 'background-color', 'var(--kb-nav-link-media-container-background-active, var(--kb-nav-link-media-container-background-hover, var(--kb-nav-link-media-container-background, transparent)))' );

			$css->set_selector( '.kb-nav-link-' . $unique_id . '.current-menu-item .kb-nav-link-image-overlay' );
			$css->add_property( 'background-color', 'var(--kb-nav-link-media-container-background-active, var(--kb-nav-link-media-container-background, transparent))' );
		}

		// styles that need a more speicifc selector
		$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap > .kb-nav-link-content' );
		$css->render_typography( $attributes );

		$css->set_selector( '.kb-nav-link-' . $unique_id . ' .sub-menu li.menu-item > .kb-link-wrap > .kb-nav-link-content' );
		$css->render_typography( $attributes, 'dropdownTypography' );

		if ( ! empty( $attributes['highlightLabel'] ) || ! empty( $attributes['highlightIcon']['icon'] ) ) {
			$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .kb-link-wrap > .kb-nav-link-content .link-highlight-label' );
			$css->render_typography( $attributes, 'highlightTypography' );
		}

		// description styles
		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-' . $unique_id . ' .kb-nav-label-description' );
		$css->render_typography( $attributes, 'descriptionTypography' );

		// dropdown description styles
		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-' . $unique_id . ' .sub-menu .kb-nav-label-description' );
		$css->render_typography( $attributes, 'dropdownDescriptionTypography' );

		// navigation highlight icon size
		if ( ! empty( $attributes['highlightIcon'][0]['icon'] ) && ! empty( $attributes['highlightIcon'][0]['size'] ) ) {
			$css->set_selector( '.kb-nav-link-' . $unique_id . ' .link-highlight-label .link-highlight-icon-wrap svg' );
			$css->add_property( 'height', $attributes['highlightIcon'][0]['size'] . 'px' );
			$css->add_property( 'width', $attributes['highlightIcon'][0]['size'] . 'px' );
		}

		if ( ! empty( $attributes['disableLink'] ) && true === $attributes['disableLink'] && ! $attributes['dropdownClick'] ) {
			$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .kb-link-wrap > .kb-nav-link-content' );
			$css->add_property( 'cursor', 'default' );
		}

		return $css->css_output();
	}

	/**
	 * Build up the dynamic styles for a size.
	 *
	 * @param string $size The size.
	 * @return array
	 */
	public function sized_dynamic_styles( $css, $attributes, $unique_id, $size = 'Desktop' ) {
		$sized_attributes         = $css->get_sized_attributes_auto( $attributes, $size, false );
		$sized_attributes_inherit = $css->get_sized_attributes_auto( $attributes, $size );

		$media_style_background        = $css->get_inherited_value( $attributes['mediaStyle'][0]['background'], $attributes['mediaStyle'][0]['backgroundTablet'], $attributes['mediaStyle'][0]['backgroundMobile'], $size, true );
		$media_style_background_hover  = $css->get_inherited_value( $attributes['mediaStyle'][0]['backgroundHover'], $attributes['mediaStyle'][0]['backgroundHoverTablet'], $attributes['mediaStyle'][0]['backgroundHoverMobile'], $size, true );
		$media_style_background_active = $css->get_inherited_value( $attributes['mediaStyle'][0]['backgroundActive'], $attributes['mediaStyle'][0]['backgroundActiveTablet'], $attributes['mediaStyle'][0]['backgroundActiveMobile'], $size, true );
		$media_style_color             = $css->get_inherited_value( $attributes['mediaStyle'][0]['color'], $attributes['mediaStyle'][0]['colorTablet'], $attributes['mediaStyle'][0]['colorMobile'], $size, true );
		$media_style_color_hover       = $css->get_inherited_value( $attributes['mediaStyle'][0]['colorHover'], $attributes['mediaStyle'][0]['colorHoverTablet'], $attributes['mediaStyle'][0]['colorHoverMobile'], $size, true );
		$media_style_color_active      = $css->get_inherited_value( $attributes['mediaStyle'][0]['colorActive'], $attributes['mediaStyle'][0]['colorActiveTablet'], $attributes['mediaStyle'][0]['colorActiveMobile'], $size, true );

		$media_style_border_radius = $css->get_inherited_value( $attributes['mediaStyle'][0]['borderRadius'], $attributes['mediaStyle'][0]['borderRadiusTablet'], $attributes['mediaStyle'][0]['borderRadiusMobile'], $size, true );
		$media_style_margin        = $css->get_inherited_value( $attributes['mediaStyle'][0]['margin'], $attributes['mediaStyle'][0]['marginTablet'], $attributes['mediaStyle'][0]['marginMobile'], $size, true );
		$media_icon_size           = $css->get_inherited_value( $attributes['mediaIcon'][0]['size'], $attributes['mediaIcon'][0]['sizeTablet'], $attributes['mediaIcon'][0]['sizeMobile'], $size, true );

		$is_fe_icon = 'fe' === substr( $attributes['mediaIcon'][0]['icon'], 0, 2 );

		$is_mega_menu = ! empty( $attributes['isMegaMenu'] );

		$css->set_media_state( strtolower( $size ) );

		// no added specificty needed for these variables
		// these variable will slot into selectors found in the static stylesheet.
		$css->set_selector( '.kb-nav-link-' . $unique_id );
		$css->add_property( '--kb-nav-dropdown-link-color', $css->render_color( $sized_attributes['linkColorDropdown'] ), $sized_attributes['linkColorDropdown'] );
		$css->add_property( '--kb-nav-dropdown-link-color-hover', $css->render_color( $sized_attributes['linkColorDropdownHover'] ), $sized_attributes['linkColorDropdownHover'] );
		$css->add_property( '--kb-nav-dropdown-link-color-active', $css->render_color( $sized_attributes['linkColorDropdownActive'] ), $sized_attributes['linkColorDropdownActive'] );
		$css->add_property( '--kb-nav-dropdown-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorDropdownActive'] ), $sized_attributes['linkColorDropdownActive'] );
		$css->add_property( '--kb-nav-dropdown-background', $css->render_color( $sized_attributes['backgroundDropdown'] ) );
		$css->add_property( '--kb-nav-dropdown-link-background-hover', $css->render_color( $sized_attributes['backgroundDropdownHover'] ) );
		$css->add_property( '--kb-nav-dropdown-link-background-active', $css->render_color( $sized_attributes['backgroundDropdownActive'] ) );
		$css->add_property( '--kb-nav-dropdown-link-width', $css->render_size( $sized_attributes['dropdownWidth'], $sized_attributes['dropdownWidthUnit'] ) );
		$css->add_property( '--kb-nav-dropdown-link-padding-top', $css->render_size( $sized_attributes['dropdownVerticalSpacing'], $attributes['dropdownVerticalSpacingUnit'] ) );
		$css->add_property( '--kb-nav-dropdown-link-padding-bottom', $css->render_size( $sized_attributes['dropdownVerticalSpacing'], $attributes['dropdownVerticalSpacingUnit'] ) );
		if ( isset( $sized_attributes['dropdownDescriptionSpacing'] ) ) {
			$css->add_property( '--kb-nav-dropdown-link-description-padding-top', $css->render_size( $sized_attributes['dropdownDescriptionSpacing'], $sized_attributes['dropdownDescriptionSpacingUnit'] ?? 'px' ) );
		}
		if ( isset( $sized_attributes['dropdownDescriptionColor'] ) ) {
			$css->add_property( '--kb-nav-dropdown-link-description-color', $css->render_color( $sized_attributes['dropdownDescriptionColor'] ) );
		}
		if ( isset( $sized_attributes['dropdownDescriptionColorHover'] ) ) {
			$css->add_property( '--kb-nav-dropdown-link-description-color-hover', $css->render_color( $sized_attributes['dropdownDescriptionColorHover'] ) );
		}
		if ( isset( $sized_attributes['dropdownDescriptionColorActive'] ) ) {
			$css->add_property( '--kb-nav-dropdown-link-description-color-active', $css->render_color( $sized_attributes['dropdownDescriptionColorActive'] ) );
			$css->add_property( '--kb-nav-dropdown-link-description-color-active-ancestor', $css->render_color( $sized_attributes['dropdownDescriptionColorActive'] ) );
		}
		if ( $is_mega_menu ) {
			if ( $sized_attributes['megaMenuWidth'] === 'container' ) {
				$css->add_property( '--kb-nav-link-has-children-position', 'static' );
			}
		}

		// no bleed variables (extra specific to beat things like dropdown or top level styling)
		$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap' );
		$css->add_property( '--kb-nav-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorActive'] ), $sized_attributes['linkColorActive'] );
		$css->add_property( '--kb-nav-link-background-active-ancestor', $css->render_color( $sized_attributes['backgroundActive'] ), $sized_attributes['backgroundActive'] );
		$css->add_property( '--kb-nav-link-highlight-color', $css->render_color( $sized_attributes['labelColor'] ), $sized_attributes['labelColor'] );
		$css->add_property( '--kb-nav-link-highlight-color-hover', $css->render_color( $sized_attributes['labelColorHover'] ), $sized_attributes['labelColorHover'] );
		$css->add_property( '--kb-nav-link-highlight-color-active', $css->render_color( $sized_attributes['labelColorActive'] ), $sized_attributes['labelColorActive'] );
		$css->add_property( '--kb-nav-link-highlight-color-active-ancestor', $css->render_color( $sized_attributes['labelColorActive'] ), $sized_attributes['labelColorActive'] );
		$css->add_property( '--kb-nav-link-highlight-background', $css->render_color( $sized_attributes['labelBackground'] ), $sized_attributes['labelBackground'] );
		$css->add_property( '--kb-nav-link-highlight-background-hover', $css->render_color( $sized_attributes['labelBackgroundHover'] ), $sized_attributes['labelBackgroundHover'] );
		$css->add_property( '--kb-nav-link-highlight-background-active', $css->render_color( $sized_attributes['labelBackgroundActive'] ), $sized_attributes['labelBackgroundActive'] );
		$css->add_property( '--kb-nav-link-highlight-background-active-ancestor', $css->render_color( $sized_attributes['labelBackgroundActive'] ), $sized_attributes['labelBackgroundActive'] );

		// additional dynamic logic, but still lands in a slot in the static stylesheet
		if ( 'left' === $sized_attributes['highlightSide'] ) {
			$css->add_property( '--kb-nav-link-highlight-order', '-1' );
		} elseif ( 'right' === $sized_attributes['highlightSide'] ) {
			$css->add_property( '--kb-nav-link-highlight-order', '3' );
		}
		if ( 'left' === $sized_attributes['iconSide'] ) {
			$css->add_property( '--kb-nav-link-highlight-icon-order', '-1' );
		} elseif ( 'right' === $sized_attributes['iconSide'] ) {
			$css->add_property( '--kb-nav-link-highlight-icon-order', '3' );
		}


		// Icon and description placement.
		if ( $sized_attributes['description'] ) {
			$css->add_property( '--kb-nav-link-title-wrap-display', 'grid' );
			$css->add_property( '--kb-nav-link-title-wrap-grid-template-columns', '1fr' );
		}
		if ( $sized_attributes['description'] && ( $sized_attributes['mediaType'] == 'icon' || $sized_attributes['mediaType'] == 'image' ) && ( $sized_attributes['mediaAlign'] == 'left' || $sized_attributes['mediaAlign'] == 'right' ) ) {
			$css->add_property( '--kb-nav-link-title-wrap-display', 'grid' );
			$css->add_property( '--kb-nav-link-title-wrap-grid-template-columns', '1fr auto' );

			if ( $sized_attributes['descriptionPositioning'] == 'icon' ) {
				$css->add_property( '--kb-nav-link-description-grid-column', 'span 2' );
			} elseif ( $sized_attributes['mediaAlign'] == 'right' ) {
					$css->add_property( '--kb-nav-link-description-grid-column', '1' );
			} else {
				$css->add_property( '--kb-nav-link-description-grid-column', '2' );
			}
		}

		// Media styles.
		if ( $attributes['mediaType'] && 'none' !== $attributes['mediaType'] ) {
			$css->add_property( '--kb-nav-link-icon-font-size', $css->render_size( $media_icon_size, 'px' ) );
			// $css->add_property( '--kb-nav-link-icon-height', $css->render_size( $media_icon_size, 'px' ) );

			// Image overlay: set overlay color variables on .link-media-container so the overlay can use them.
			// Uses imageOverlayBackground* attributes (separate from mediaBackground used for icon).
			if ( 'image' === $attributes['mediaType'] ) {
				$css->set_selector( '.kb-nav-link-' . $unique_id . '.kb-menu-has-image .link-media-container' );
				$overlay_bg = $css->render_color( $css->get_inherited_value( $attributes['imageOverlayBackground'] ?? '', $attributes['imageOverlayBackgroundTablet'] ?? '', $attributes['imageOverlayBackgroundMobile'] ?? '', $size, true ) );
				$overlay_bg_hover = $css->render_color( $css->get_inherited_value( $attributes['imageOverlayBackgroundHover'] ?? '', $attributes['imageOverlayBackgroundHoverTablet'] ?? '', $attributes['imageOverlayBackgroundHoverMobile'] ?? '', $size, true ) );
				$overlay_bg_active = $css->render_color( $css->get_inherited_value( $attributes['imageOverlayBackgroundActive'] ?? '', $attributes['imageOverlayBackgroundActiveTablet'] ?? '', $attributes['imageOverlayBackgroundActiveMobile'] ?? '', $size, true ) );
				if ( '' !== $overlay_bg ) {
					$css->add_property( '--kb-nav-link-media-container-background', $overlay_bg );
				}
				if ( '' !== $overlay_bg_hover ) {
					$css->add_property( '--kb-nav-link-media-container-background-hover', $overlay_bg_hover );
				}
				if ( '' !== $overlay_bg_active ) {
					$css->add_property( '--kb-nav-link-media-container-background-active', $overlay_bg_active );
				}
				$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap' );
			}

			if ( $sized_attributes['mediaAlign'] == 'left' ) {
				$css->add_property( '--kb-nav-link-media-container-order', '-1' );
				$css->add_property( '--kb-nav-link-media-container-margin-right', $css->render_size( $media_style_margin[0], 'px' ) );
				$css->add_property( '--kb-nav-link-title-wrap-has-media-grid-template-columns', 'auto 1fr' );

			} elseif ( $sized_attributes['mediaAlign'] == 'top' ) {
				$css->add_property( '--kb-nav-link-title-wrap-display', 'flex' );
				$css->add_property( '--kb-nav-link-media-container-order', '-1' );
				$css->add_property( '--kb-nav-link-title-wrap-flex-direction', 'column' );
				$css->add_property( '--kb-nav-link-media-container-justify-content', 'center' );
				$css->add_property( '--kb-nav-link-media-container-align-self', 'center' );
				$css->add_property( '--kb-nav-link-media-container-margin-bottom', $css->render_size( $media_style_margin[0], 'px' ) );
			} elseif ( $sized_attributes['mediaAlign'] == 'bottom' ) {
				$css->add_property( '--kb-nav-link-title-wrap-display', 'flex' );
				$css->add_property( '--kb-nav-link-media-container-order', '1' );
				$css->add_property( '--kb-nav-link-title-wrap-flex-direction', 'column' );
				$css->add_property( '--kb-nav-link-media-container-justify-content', 'center' );
				$css->add_property( '--kb-nav-link-media-container-align-self', 'center' );
				$css->add_property( '--kb-nav-link-media-container-margin-top', $css->render_size( $media_style_margin[0], 'px' ) );
			} else {
				$css->add_property( '--kb-nav-link-media-container-margin-left', $css->render_size( $media_style_margin[0], 'px' ) );
			}
		}

		// Description styles.
		if ( isset( $sized_attributes['descriptionSpacing'] ) ) {
			$css->add_property( '--kb-nav-link-description-padding-top', $css->render_size( $sized_attributes['descriptionSpacing'], $sized_attributes['descriptionSpacingUnit'] ?? 'px' ) );
		}
		if ( isset( $sized_attributes['descriptionColor'] ) ) {
			$css->add_property( '--kb-nav-link-description-color', $css->render_color( $sized_attributes['descriptionColor'] ) );
		}
		if ( isset( $sized_attributes['descriptionColorHover'] ) ) {
			$css->add_property( '--kb-nav-link-description-color-hover', $css->render_color( $sized_attributes['descriptionColorHover'] ) );
		}
		if ( isset( $sized_attributes['descriptionColorActive'] ) ) {
			$css->add_property( '--kb-nav-link-description-color-active', $css->render_color( $sized_attributes['descriptionColorActive'] ) );
			$css->add_property( '--kb-nav-link-description-color-active-ancestor', $css->render_color( $sized_attributes['descriptionColorActive'] ) );
		}

		// link, description, and media alignment
		if ( $sized_attributes['align'] ) {
			$css->add_property( '--kb-nav-link-align', $sized_attributes['align'] );
			$sized_flex_align = $sized_attributes['align'] == 'right' ? 'end' : ( $sized_attributes['align'] == 'center' ? 'center' : 'start' );
			$css->add_property( '--kb-nav-link-flex-justify', $sized_flex_align );
			$css->add_property( '--kb-nav-link-media-container-align-self', $sized_flex_align );
			if ( $sized_attributes['mediaAlign'] == 'top' || $sized_attributes['mediaAlign'] ) {
				$css->add_property( '--kb-nav-link-flex-align', $sized_flex_align );
			}
		}

		// placement logic where an additional selector is needed
		// Mega menu width styles.
		if ( $is_mega_menu ) {
			if ( $sized_attributes['megaMenuWidth'] === 'custom' ) {
				// first sub menu only, no bleed
				$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .sub-menu.sub-menu.sub-menu.sub-menu.sub-menu' );
				$css->add_property( '--kb-nav-dropdown-width', $css->render_size( $sized_attributes['megaMenuCustomWidth'], $sized_attributes['megaMenuCustomWidthUnit'] ) );
				if ( ! empty( $sized_attributes['dropdownHorizontalAlignment'] ) ) {
					if ( $sized_attributes['dropdownHorizontalAlignment'] == 'center' ) {
						$css->add_property( '--kb-nav-dropdown-show-left', '50%' );
						$css->add_property( '--kb-nav-dropdown-show-right', 'unset' );
						$css->add_property( '--kb-nav-dropdown-show-transform-x', '-50%' );
						$css->add_property( '--kb-nav-dropdown-hide-transform-x', '-50%' );
					} elseif ( $sized_attributes['dropdownHorizontalAlignment'] == 'right' ) {
						$css->add_property( '--kb-nav-dropdown-show-right', '0px' );
						$css->add_property( '--kb-nav-dropdown-show-left', 'unset' );
						$css->add_property( '--kb-nav-dropdown-show-transform-x', '0px' );
						$css->add_property( '--kb-nav-dropdown-hide-transform-x', '0px' );
					} elseif ( $sized_attributes['dropdownHorizontalAlignment'] == 'left' ) {
						$css->add_property( '--kb-nav-dropdown-show-left', '0px' );
						$css->add_property( '--kb-nav-dropdown-show-right', 'unset' );
						$css->add_property( '--kb-nav-dropdown-show-transform-x', '0px' );
						$css->add_property( '--kb-nav-dropdown-hide-transform-x', '0px' );
					}
				}
			} elseif ( $sized_attributes['megaMenuWidth'] === 'full' || $sized_attributes['megaMenuWidth'] === '' ) {
				// this is handled by a seperate js file
			} elseif ( $sized_attributes['megaMenuWidth'] === 'container' || $sized_attributes['megaMenuWidth'] === 'content' ) {
				// first sub menu only, no bleed
				$css->set_selector( '.kb-nav-link-' . $unique_id . ' > .sub-menu.sub-menu.sub-menu.sub-menu.sub-menu' );
				$css->add_property( '--kb-nav-dropdown-width', '100%' );
				$css->add_property( '--kb-nav-dropdown-show-left', '0' );
				$css->add_property( '--kb-nav-dropdown-show-transform-x', '0' );
			}
		}

		// transparent styles
		$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .kb-nav-link-' . $unique_id . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap' );
		$css->add_property( '--kb-nav-link-color', $css->render_color( $sized_attributes['linkColorTransparent'] ), $sized_attributes['linkColorTransparent'] );
		$css->add_property( '--kb-nav-link-color-hover', $css->render_color( $sized_attributes['linkColorTransparentHover'] ), $sized_attributes['linkColorTransparentHover'] );
		$css->add_property( '--kb-nav-link-color-active', $css->render_color( $sized_attributes['linkColorTransparentActive'] ), $sized_attributes['linkColorTransparentActive'] );
		$css->add_property( '--kb-nav-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorTransparentActive'] ), $sized_attributes['linkColorTransparentActive'] );
		$css->add_property( '--kb-nav-link-background', $css->render_color( $sized_attributes['backgroundTransparent'] ), $sized_attributes['backgroundTransparent'] );
		$css->add_property( '--kb-nav-link-background-hover', $css->render_color( $sized_attributes['backgroundTransparentHover'] ), $sized_attributes['backgroundTransparentHover'] );
		$css->add_property( '--kb-nav-link-background-active', $css->render_color( $sized_attributes['backgroundTransparentActive'] ), $sized_attributes['backgroundTransparentActive'] );
		$css->add_property( '--kb-nav-link-background-active-ancestor', $css->render_color( $sized_attributes['backgroundTransparentActive'] ), $sized_attributes['backgroundTransparentActive'] );

		// sticky styles
		$css->set_selector( '.item-is-stuck .kb-nav-link-' . $unique_id . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap' );
		$css->add_property( '--kb-nav-link-color', $css->render_color( $sized_attributes['linkColorSticky'] ), $sized_attributes['linkColorSticky'] );
		$css->add_property( '--kb-nav-link-color-hover', $css->render_color( $sized_attributes['linkColorStickyHover'] ), $sized_attributes['linkColorStickyHover'] );
		$css->add_property( '--kb-nav-link-color-active', $css->render_color( $sized_attributes['linkColorStickyActive'] ), $sized_attributes['linkColorStickyActive'] );
		$css->add_property( '--kb-nav-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorStickyActive'] ), $sized_attributes['linkColorStickyActive'] );
		$css->add_property( '--kb-nav-link-background', $css->render_color( $sized_attributes['backgroundSticky'] ), $sized_attributes['backgroundSticky'] );
		$css->add_property( '--kb-nav-link-background-hover', $css->render_color( $sized_attributes['backgroundStickyHover'] ), $sized_attributes['backgroundStickyHover'] );
		$css->add_property( '--kb-nav-link-background-active', $css->render_color( $sized_attributes['backgroundStickyActive'] ), $sized_attributes['backgroundStickyActive'] );
		$css->add_property( '--kb-nav-link-background-active-ancestor', $css->render_color( $sized_attributes['backgroundStickyActive'] ), $sized_attributes['backgroundStickyActive'] );

		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container ul .kb-nav-link-' . $unique_id . ' ul li:not(:last-of-type), .wp-block-kadence-navigation .menu-container ul.menu > li.kb-nav-link-' . $unique_id . '.kadence-menu-mega-enabled > ul > li.menu-item > a' );
		$css->add_property( '--kb-nav-menu-item-border-bottom', $css->render_border( $sized_attributes['dropdownDivider'], 'bottom' ) );
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		// Prevent a nav block from being rendered inside itself.
		if ( isset( $attributes['id'] ) && isset( self::$seen_refs[ $attributes['id'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in 'wp_debug_mode()'.
			$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]', 'kadence-blocks' ) :
				'';
		}
		if ( isset( $attributes['id'] ) ) {
			self::$seen_refs[ $attributes['id'] ] = true;
		}

		$child_info = $this->get_child_info( $block_instance );

		// Handle embeds for nav block.
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $content );
		$content = $wp_embed->autoembed( $content );
		$content = do_blocks( $content );

		if ( isset( $attributes['id'] ) ) {
			unset( self::$seen_refs[ $attributes['id'] ] );
		}

		$label               = ! empty( $attributes['label'] ) ? $attributes['label'] : '';
		$url                 = $this->get_url( $attributes );
		$has_children        = ! empty( $content );
		$has_highlight_label = ! empty( $attributes['highlightLabel'] ) || ! empty( $attributes['highlightIcon'][0]['icon'] );
		$kind                = ! empty( $attributes['kind'] ) ? str_replace( '-', '_', $attributes['kind'] ) : 'post_type';
		$is_active_ancestor  = $child_info['has_active_child'];
		$is_active           = $this->is_current( $attributes );
		$is_mega_menu        = ! empty( $attributes['isMegaMenu'] );
		$has_icon            = $attributes['mediaType'] == 'icon' && ! empty( $attributes['mediaIcon'][0]['icon'] );
		$has_image           = $attributes['mediaType'] == 'image' && ! empty( $attributes['mediaImage'][0]['url'] );

		$desktop_width = ! empty( $attributes['megaMenuWidth'] ) ? $attributes['megaMenuWidth'] : 'full';
		$tablet_width  = ! empty( $attributes['megaMenuWidthTablet'] ) ? $attributes['megaMenuWidthTablet'] : $desktop_width;
		$mobile_width  = ! empty( $attributes['megaMenuWidthMobile'] ) ? $attributes['megaMenuWidthMobile'] : $tablet_width;

		$mega_menu_width_class        = 'kb-menu-mega-width-' . $desktop_width;
		$mega_menu_width_class_tablet = 'kb-menu-mega-width-tablet-' . $tablet_width;
		$mega_menu_width_class_mobile = 'kb-menu-mega-width-mobile-' . $mobile_width;

		$wrapper_classes   = [];
		$wrapper_classes[] = 'wp-block-kadence-navigation-link';
		$wrapper_classes[] = 'kb-nav-link-' . $unique_id;
		$wrapper_classes[] = 'menu-item';
		if ( $has_children ) {
			$wrapper_classes[] = 'menu-item-has-children';
		}
		if ( $has_children && isset( $attributes['dropdownClick'] ) && true === $attributes['dropdownClick'] ) {
			$wrapper_classes[] = 'kb-nav-link-sub-click';
		}
		if ( $is_active ) {
			$wrapper_classes[] = 'current-menu-item';
		}
		if ( $is_active_ancestor ) {
			$wrapper_classes[] = 'current-menu-ancestor';
		}
		if ( $is_mega_menu ) {
			$wrapper_classes[] = 'kadence-menu-mega-enabled';
			$wrapper_classes[] = $mega_menu_width_class;
			$wrapper_classes[] = $mega_menu_width_class_tablet;
			$wrapper_classes[] = $mega_menu_width_class_mobile;
		}
		if ( ! empty( $attributes['description'] ) ) {
			$wrapper_classes[] = 'kb-menu-has-description';
		}
		if ( $has_icon ) {
			$wrapper_classes[] = 'kb-menu-has-icon';
		}
		if ( $has_image ) {
			$wrapper_classes[] = 'kb-menu-has-image';
		}
		if ( $has_icon || $has_image ) {
			$wrapper_classes[] = 'kb-menu-has-media';
		}
		$wrapper_args       = [ 'class' => implode( ' ', $wrapper_classes ) ];
		if ( ! empty( $attributes['anchor'] ) ) {
			$wrapper_args['id'] = $attributes['anchor'];
		}
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$down_arrow_icon  = '<svg aria-hidden="true" class="kb-nav-arrow-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">';
		$down_arrow_icon .= '<path d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>';
		$down_arrow_icon .= '</svg>';
		$down_arrow_icon  = apply_filters( 'kadence_blocks_navigation_link_down_arrow_icon', $down_arrow_icon );

		$sub_menu_classes   = [];
		$sub_menu_classes[] = 'sub-menu';
		$sub_menu_classes[] = 'kb-nav-sub-menu';
		if ( $is_mega_menu ) {
			$sub_menu_classes[] = 'mega-menu';
		}
		$sub_menu_attributes = $this->build_html_attributes(
			[
				'class' => implode( ' ', $sub_menu_classes ),
			]
		);
		$title               = ! empty( $attributes['hideLabel'] ) && true === $attributes['hideLabel'] ? '' : wp_kses_post( $label );
		$sub_menu_content    = $has_children ? '<ul ' . $sub_menu_attributes . '>' . $content . '</ul>' : '';
		$sub_menu_btn        = $has_children ? '<button aria-label="' . esc_attr__( 'Toggle child menu of', 'kadence-blocks' ) . ' ' . esc_attr( $title ) . '" class="kb-nav-dropdown-toggle-btn" aria-expanded="false">' . $down_arrow_icon . '</button>' : '';
		$media               = '';
		$svg_icon            = '';
		if ( $has_icon ) {
			$type = substr( $attributes['mediaIcon'][0]['icon'], 0, 2 );

			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;

			if ( $line_icon ) {
				$stroke_width = ( ! empty( $attributes['mediaIcon'][0]['width'] ) ? $attributes['mediaIcon'][0]['width'] : 2 );
			}
			$icon_title = ( ! empty( $attributes['mediaIcon'][0]['title'] ) ? $attributes['mediaIcon'][0]['title'] : '' );
			$hidden     = ( empty( $icon_title ) ? true : false );
			$svg_icon   = Kadence_Blocks_Svg_Render::render( $attributes['mediaIcon'][0]['icon'], $fill, $stroke_width, $icon_title, $hidden );

			$media = ! empty( $svg_icon ) ? '<div class="link-media-container"><span class="link-media-icon-wrap link-svg-icon link-svg-icon-' . esc_attr( $attributes['mediaIcon'][0]['icon'] ) . '">' . $svg_icon . '</span></div>' : '';
		} elseif ( $has_image ) {
			$has_ratio = false;
			if ( $attributes['imageRatio'] && 'inherit' !== $attributes['imageRatio'] ) {
				$has_ratio = true;
			}
			$image = wp_get_attachment_image( $attributes['mediaImage'][0]['id'], [ $attributes['mediaImage'][0]['width'], $attributes['mediaImage'][0]['height'] ] );

			$overlay_html    = '<div class="kb-nav-link-image-overlay" aria-hidden="true"></div>';
			$container_start = '<div class="kadence-navigation-link-image-inner-intrinsic-container">
				<div class="kadence-navigation-link-image-intrinsic' . ( 'svg+xml' == $attributes['mediaImage'][0]['subtype'] ? ' kb-navigation-link-image-type-svg' : '' ) . ( $has_ratio ? ' kb-navigation-link-image-ratio kb-navigation-link-image-ratio-' . $attributes['imageRatio'] : '' ) . '">
					<div class="kadence-navigation-link-image-inner-intrinsic">';
			$container_end   = '</div>' . $overlay_html . '</div></div>';

			$media = $image ? '<div class="link-media-container">' . $container_start . $image . $container_end . '</div>' : '';
		}
		$highlight_icon = '';
		if ( ! empty( $attributes['highlightIcon'][0]['icon'] ) ) {
			$type      = substr( $attributes['highlightIcon'][0]['icon'], 0, 2 );
			$icon_size = isset( $attributes['highlightIcon'][0]['size'] ) && is_numeric( $attributes['highlightIcon'][0]['size'] ) ? $attributes['highlightIcon'][0]['size'] : '';
			$line_icon = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill      = ( $line_icon ? 'none' : 'currentColor' );

			$stroke_width = false;

			if ( $line_icon ) {
				$stroke_width = ( ! empty( $attributes['highlightIcon'][0]['width'] ) ? $attributes['highlightIcon'][0]['width'] : 2 );
			}
			$high_icon_title = ( ! empty( $attributes['highlightIcon'][0]['title'] ) ? $attributes['highlightIcon'][0]['title'] : '' );
			$hidden          = ( empty( $high_icon_title ) ? true : false );
			$highlight_icon  = Kadence_Blocks_Svg_Render::render( $attributes['highlightIcon'][0]['icon'], $fill, $stroke_width, $high_icon_title, $hidden );
		}
		$hl_icon              = ! empty( $highlight_icon ) && $has_highlight_label ? '<span class="link-highlight-icon-wrap link-svg-icon link-svg-icon-' . esc_attr( $attributes['highlightIcon'][0]['icon'] ) . '">' . $highlight_icon . '</span>' : '';
		$highlight_label      = '';
		$link_classes         = [ 'kb-nav-link-content' ];
		$highlight_with_title = ! empty( $attributes['highlightPosition'] ) && $attributes['highlightPosition'] === 'title' ? true : false;
		if ( $has_highlight_label ) {
			$link_classes[] = 'has-highlight-label';
			if ( $highlight_with_title ) {
				$link_classes[] = 'highlight-with-title';
			}
			$highlight_label = '<span class="link-highlight-label"><span class="link-highlight-label-text">' . $attributes['highlightLabel'] . '</span>' . $hl_icon . '</span>';
		}

		$title_html = ! empty( $media ) || ! empty( $attributes['description'] ) ? '<span class="kb-nav-item-title-wrap">' : '';
		if ( $has_highlight_label && $highlight_with_title ) {
			$title .= $highlight_label;
		}
		$title_html .= ! empty( $attributes['description'] ) || ! empty( $media ) || ( $has_highlight_label && $highlight_with_title ) ? '<span class="kb-nav-label-content">' . $title . '</span>' : $title;
		$title_html .= $media;
		$title_html .= ! empty( $attributes['description'] ) ? '<span class="kb-nav-label-description">' . $attributes['description'] . '</span>' : '';
		// $title_html .= $has_children ? '<span class="kb-nav-dropdown-toggle">' . $down_arrow_icon . '</span>' : '';
		$title_html .= ! empty( $media ) || ! empty( $attributes['description'] ) ? '</span>' : '';
		if ( ! $highlight_with_title ) {
			$title_html .= $highlight_label;
		}
		$link_tag  = 'a';
		$link_args = [
			'class' => implode( ' ', $link_classes ),
			'href'  => $url,
		];

		if ( ! empty( $attributes['name'] ) ) {
			$link_args['aria-label'] = $attributes['name'];
		}
		if ( ! empty( $attributes['target'] ) ) {
			$link_args['target'] = $attributes['target'];
		}
		if ( ! empty( $attributes['rel'] ) ) {
			$link_args['rel'] = $attributes['rel'];
		}
		// Link with disabled link and no children or dropdown click.
		if ( ! empty( $attributes['disableLink'] ) && true === $attributes['disableLink'] && ! $has_children && ! ( isset( $attributes['dropdownClick'] ) && true === $attributes['dropdownClick'] ) ) {
			$link_tag = 'span';
			unset( $link_args['href'] );
			unset( $link_args['aria-label'] );
			unset( $link_args['target'] );
			unset( $link_args['rel'] );
		}
		// Link with disabled link and children but no dropdown click.
		if ( ! empty( $attributes['disableLink'] ) && true === $attributes['disableLink'] && $has_children && ! ( isset( $attributes['dropdownClick'] ) && true === $attributes['dropdownClick'] ) ) {
			unset( $link_args['href'] );
			unset( $link_args['aria-label'] );
			unset( $link_args['target'] );
			unset( $link_args['rel'] );
			$link_args['role'] = 'button';
		}
		if ( $has_children && isset( $attributes['dropdownClick'] ) && true === $attributes['dropdownClick'] ) {
			$link_args['role'] = 'button';
			unset( $link_args['href'] );
			unset( $link_args['target'] );
			unset( $link_args['rel'] );
		}

		$link_args             = apply_filters( 'kadence_blocks_navigation_link_args', $link_args, $attributes );
		$inner_link_attributes = [];
		foreach ( $link_args as $key => $value ) {
			$inner_link_attributes[] = $key . '="' . ( 'href' === $key ? esc_url( $value ) : esc_attr( $value ) ) . '"';
		}
		$inner_attributes = implode( ' ', $inner_link_attributes );
		return sprintf(
			'<li %1$s><div class="kb-link-wrap"><%2$s %3$s>%4$s</%2$s>%5$s</div>%6$s</li>',
			$wrapper_attributes,
			$link_tag,
			$inner_attributes,
			$title_html,
			$sub_menu_btn,
			$sub_menu_content,
		);
	}

	/**
	 * Builds an html attribute string from an array of keys and values.
	 *
	 * @param array $attributes The database attribtues.
	 * @return array
	 */
	public function build_html_attributes( $attributes ) {
		if ( empty( $attributes ) ) {
			return '';
		}

		$normalized_attributes = [];
		foreach ( $attributes as $key => $value ) {
			$normalized_attributes[] = $key . '="' . esc_attr( $value ) . '"';
		}

		return implode( ' ', $normalized_attributes );
	}

	/**
	 * Parse content data, looking for data about child nav links.
	 *
	 * @param stdObject $block_instance This blocks instance object.
	 * @return array
	 */
	public function get_child_info( $block_instance ) {
		$child_info = [
			'has_active_child' => false,
		];
		if ( property_exists( $block_instance, 'inner_blocks' ) && $block_instance->inner_blocks ) {
			foreach ( $block_instance->inner_blocks as $inner_block ) {
				if ( $inner_block->name == 'kadence/navigation-link' ) {
					if ( isset( $inner_block->attributes ) ) {
						if ( $this->is_current( $inner_block->attributes ) ) {
							$child_info['has_active_child'] = true;
						}
					}
				}

				$inner_child_info = $this->get_child_info( $inner_block );

				if ( $inner_child_info['has_active_child'] ) {
					$child_info['has_active_child'] = true;
				}
			}
		}

		return $child_info;
	}

	/**
	 * Checks if a nav link item is current.
	 *
	 * @param array $attributes an attributes array.
	 * @return boolean
	 */
	public function is_current( $attributes ) {
		global $wp;

		$link_matches = untrailingslashit( $attributes['url'] ) === untrailingslashit( home_url( $wp->request ) );
		return ( ! empty( $attributes['id'] ) && get_queried_object_id() === (int) $attributes['id'] && ! empty( get_queried_object()->post_type ) ) || $link_matches;
	}

	/**
	 * Gets the url from the post id if available, otherwise use the url in attributes.
	 *
	 * @param array $attributes an attributes array.
	 * @return string
	 */
	public function get_url( $attributes ) {
		$kind            = ! empty( $attributes['kind'] ) ? $attributes['kind'] : '';
		$type            = ! empty( $attributes['type'] ) ? $attributes['type'] : '';
		$is_post_type    = $kind === 'post-type' || $type === 'post' || $type === 'page';
		$has_synced_link = $is_post_type && $kind === 'post-type' && ! empty( $attributes['id'] ) && ( isset( $attributes['disableLink'] ) && ! $attributes['disableLink'] );

		if ( $has_synced_link && ! empty( $attributes['id'] ) ) {
			$permalink = get_permalink( $attributes['id'] );
			if ( $permalink ) {
				return $permalink;
			}
		}

		return ! empty( $attributes['url'] ) ? $attributes['url'] : '';
	}
}

Kadence_Blocks_Navigation_Link_Block::get_instance();
