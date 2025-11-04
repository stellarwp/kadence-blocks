<?php
/**
 * Class to Build the Navigation Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Navigation Block.
 *
 * @category class
 */
class Kadence_Blocks_Navigation_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'navigation';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var boolean
	 */
	protected $has_script = true;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $seen_refs = array();

	protected $nav_attributes = array();
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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		if ( ! isset( $attributes['id'] ) ) {
			return;
		}

		$nav_attributes = $this->get_attributes_with_defaults_cpt( $attributes['id'], 'kadence_navigation', '_kad_navigation_' );
		$nav_attributes = json_decode( json_encode( $nav_attributes ), true );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $nav_attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		// No added specificty needed for these variables.
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id );
		$css->render_measure_output( $nav_attributes, 'marginLink', '--kb-nav-top-link-margin', ['unit_key' => 'marginLinkUnit']);
		$css->render_measure_output( $nav_attributes, 'paddingLink', '--kb-nav-top-link-padding', ['unit_key' => 'paddingLinkUnit']);
		$css->render_measure_output( $nav_attributes, 'marginDropdown', '--kb-nav-dropdown-margin', ['unit_key' => 'marginDropdownUnit']);
		$css->render_measure_output( $nav_attributes, 'paddingDropdown', '--kb-nav-dropdown-padding', ['unit_key' => 'paddingDropdownUnit']);
		$css->render_measure_output( $nav_attributes, 'marginDropdownLink', '--kb-nav-dropdown-link-margin', ['unit_key' => 'marginDropdownLinkUnit']);
		$css->render_measure_output( $nav_attributes, 'paddingDropdownLink', '--kb-nav-dropdown-link-padding', ['unit_key' => 'paddingDropdownLinkUnit']);
		if ( isset( $nav_attributes['dropdownShadow'][0]['enable'] ) && $nav_attributes['dropdownShadow'][0]['enable'] ) {
			$css->add_property( '--kb-nav-dropdown-box-shadow', $css->render_shadow( $nav_attributes['dropdownShadow'][0] ) );
		}
		$css->render_button_styles_with_states(
			array(
				'colorBase' => 'linkColor',
				'backgroundBase' => 'background',
				'backgroundTypeBase' => 'backgroundType',
				'backgroundGradientBase' => 'backgroundGradient',
				'borderBase' => 'border',
				'borderRadiusBase' => 'borderRadius',
				'borderRadiusUnitBase' => 'borderRadiusUnit',
				'shadowBase' => 'shadow',
				'renderAsVars' => true,
				'varBase' => '--kb-nav-top-link-'
			),
			$nav_attributes
		);

		//main container (don't apply to children)
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' > .navigation > .menu-container > .menu');
		$css->render_measure_output( $nav_attributes, 'margin', '--kb-nav-margin', ['unit_key' => 'marginUnit']);
		$css->render_measure_output( $nav_attributes, 'padding', '--kb-nav-padding', ['unit_key' => 'paddingUnit']);

		//nav item (top level only)
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' > .navigation > .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap' );
		$css->render_typography( $nav_attributes );

		//dropdown links (only this nav's dropdowns, exclude embedded navigations in mega menus, etc)
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .sub-menu > .wp-block-kadence-navigation-link > .kb-link-wrap > .kb-nav-link-content' );
		$css->render_typography( $nav_attributes, 'dropdownTypography' );

		//nav item (top level only) descriptions
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap .kb-nav-label-description' );
		$css->render_typography( $nav_attributes, 'descriptionTypography' );

		//submenu link descriptions only, do not bleed
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .sub-menu > .menu-item > .kb-link-wrap .kb-nav-label-description' );
		$css->render_typography( $nav_attributes, 'dropdownDescriptionTypography' );

		return $css->css_output();
	}

	/**
	 * Build up the dynamic styles for a size.
	 *
	 * @param string $size The size.
	 * @return array
	 */
	public function sized_dynamic_styles( $css, $attributes, $unique_id, $size = 'Desktop' ) {
		$sized_attributes = $css->get_sized_attributes_auto( $attributes, $size, false );
		$sized_attributes_inherit = $css->get_sized_attributes_auto( $attributes, $size );
		$navigation_horizontal_spacing = isset( $sized_attributes['spacing'][1] ) ? $sized_attributes['spacing'][1] : '';
		$navigation_vertical_spacing = isset( $sized_attributes['spacing'][0] ) ? $sized_attributes['spacing'][0] : '';

		$css->set_media_state( strtolower( $size ) );

		//no added specificty needed for these variables
		//these variable will slot into selectors found in the static stylesheet.
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id );
		$css->add_property( '--kb-nav-top-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorActive']), $sized_attributes['parentActive'] );
		$css->add_property( '--kb-nav-top-link-background-active-ancestor', $css->render_color( $sized_attributes['backgroundActive']), $sized_attributes['parentActive'] );
		$css->add_property( '--kb-nav-dropdown-link-color', $css->render_color( $sized_attributes['linkColorDropdown'] ));
		$css->add_property( '--kb-nav-dropdown-link-color-hover', $css->render_color( $sized_attributes['linkColorDropdownHover'] ) );
		$css->add_property( '--kb-nav-dropdown-link-color-active', $css->render_color( $sized_attributes['linkColorDropdownActive']) );
		$css->add_property( '--kb-nav-dropdown-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorDropdownActive']), $sized_attributes['parentActive'] );
		$css->add_property( '--kb-nav-dropdown-background', $css->render_color( $sized_attributes['backgroundDropdown'] ) );
		$css->add_property( '--kb-nav-dropdown-link-background-hover', $css->render_color( $sized_attributes['backgroundDropdownHover'] ));
		$css->add_property( '--kb-nav-dropdown-link-background-active', $css->render_color( $sized_attributes['backgroundDropdownActive']));
		$css->add_property( '--kb-nav-dropdown-border-bottom', $css->render_border( $sized_attributes['dropdownBorder'], 'bottom' ) );
		$css->add_property( '--kb-nav-dropdown-border-top', $css->render_border( $sized_attributes['dropdownBorder'], 'top' ) );
		$css->add_property( '--kb-nav-dropdown-border-left', $css->render_border( $sized_attributes['dropdownBorder'], 'left' ) );
		$css->add_property( '--kb-nav-dropdown-border-right', $css->render_border( $sized_attributes['dropdownBorder'], 'right' ) );
		$css->add_property( '--kb-nav-dropdown-link-padding-top', $css->render_size( $sized_attributes['dropdownVerticalSpacing'], $attributes['dropdownVerticalSpacingUnit'] ), $sized_attributes['dropdownVerticalSpacing'] );
		$css->add_property( '--kb-nav-dropdown-link-padding-bottom', $css->render_size( $sized_attributes['dropdownVerticalSpacing'], $attributes['dropdownVerticalSpacingUnit'] ), $sized_attributes['dropdownVerticalSpacing'] );
		$css->render_measure_range(
			$sized_attributes,
			( 'Desktop' === $size ? 'dropdownBorderRadius' : 'dropdownBorderRadius' . $size ),
			'--kb-nav-dropdown-border-radius',
			'',
			[
				'unit_key' => 'dropdownBorderRadiusUnit',
				'first_prop' => '--kb-nav-dropdown-border-top-left-radius',
				'second_prop' => '--kb-nav-dropdown-border-top-right-radius',
				'third_prop' => '--kb-nav-dropdown-border-bottom-right-radius',
				'fourth_prop' => '--kb-nav-dropdown-border-bottom-left-radius'
			]
		);
		$css->render_measure_range( $sized_attributes, ( 'Desktop' === $size ? 'dropdownBorderRadius' : 'dropdownBorderRadius' . $size ), '--kb-nav-dropdown-border-radius', '', ['unit_key' => 'dropdownBorderRadiusUnit']);
		$css->add_property( '--kb-nav-top-link-description-color', $css->render_color( $sized_attributes['descriptionColor'] ));
		$css->add_property( '--kb-nav-top-link-description-color-hover', $css->render_color( $sized_attributes['descriptionColorHover'] ) );
		$css->add_property( '--kb-nav-top-link-description-color-active', $css->render_color( $sized_attributes['descriptionColorActive']) );
		$css->add_property( '--kb-nav-top-link-description-color-active-ancestor', $css->render_color( $sized_attributes['descriptionColorActive']), $sized_attributes['parentActive'] );
		$css->add_property( '--kb-nav-top-link-description-padding-top', $css->render_size( $sized_attributes['descriptionSpacing'], $sized_attributes['descriptionSpacingUnit'] ?? 'px' ) );
		$css->add_property( '--kb-nav-dropdown-link-description-color', $css->render_color( $sized_attributes['dropdownDescriptionColor'] ));
		$css->add_property( '--kb-nav-dropdown-link-description-color-hover', $css->render_color( $sized_attributes['dropdownDescriptionColorHover'] ) );
		$css->add_property( '--kb-nav-dropdown-link-description-color-active', $css->render_color( $sized_attributes['dropdownDescriptionColorActive']) );
		$css->add_property( '--kb-nav-dropdown-link-description-color-active-ancestor', $css->render_color( $sized_attributes['dropdownDescriptionColorActive']), $sized_attributes['parentActive'] );
		$css->add_property( '--kb-nav-dropdown-link-description-padding-top', $css->render_size( $sized_attributes['dropdownDescriptionSpacing'], $sized_attributes['dropdownDescriptionSpacingUnit'] ?? 'px' ) );

		//additional dynamic logic, but still lands in a slot in the static stylesheet
		if ( isset( $navigation_vertical_spacing ) && is_numeric( $navigation_vertical_spacing ) ) {
			$css->add_property( '--kb-nav-row-gap', $css->render_size( $navigation_vertical_spacing, $attributes['spacingUnit'] ) );
		}
		if ( isset( $navigation_horizontal_spacing ) && is_numeric( $navigation_horizontal_spacing ) ) {
			$css->add_property( '--kb-nav-column-gap', $css->render_size( $navigation_horizontal_spacing, $attributes['spacingUnit'] ) );
		}
		if ( $sized_attributes_inherit['orientation'] != 'vertical' ) {
			if ( ! empty( $sized_attributes['horizontalGrid'] ) ) {
				$css->add_property( '--kb-nav-grid-columns', 'repeat(' . $sized_attributes['horizontalGrid'] . ', 1fr)');
			}
			$css->add_property( '--kb-nav-dropdown-link-width', $css->render_size( $sized_attributes['dropdownWidth'], $sized_attributes['dropdownWidthUnit'] ) );
			$css->add_property( '--kb-nav-top-not-last-link-border-right', $css->render_border( $sized_attributes['divider'], 'bottom' ) );
			$css->add_property( '--kb-nav-dropdown-toggle-border-left', 'var(--kb-nav-link-border-left)' );
			$css->add_property( '--kb-nav-top-not-last-link-border-bottom', 'var(--kb-nav-link-border-bottom)' );

			if ( $sized_attributes['dropdownHorizontalAlignment'] == 'center') {
				$css->add_property( '--kb-nav-dropdown-show-left', '50%' );
				$css->add_property( '--kb-nav-dropdown-show-right', 'unset' );
				$css->add_property( '--kb-nav-dropdown-show-transform-x', '-50%' );
				$css->add_property( '--kb-nav-dropdown-hide-transform-x', '-50%' );
			} else if ( $sized_attributes['dropdownHorizontalAlignment'] == 'right' ) {
				$css->add_property( '--kb-nav-dropdown-show-right', '0px' );
				$css->add_property( '--kb-nav-dropdown-show-left', 'unset' );
				$css->add_property( '--kb-nav-dropdown-show-transform-x', '0px' );
				$css->add_property( '--kb-nav-dropdown-hide-transform-x', '0px' );
			} else if ( $sized_attributes['dropdownHorizontalAlignment'] == 'left' ) {
				$css->add_property( '--kb-nav-dropdown-show-left', '0px' );
				$css->add_property( '--kb-nav-dropdown-show-right', 'unset' );
				$css->add_property( '--kb-nav-dropdown-show-transform-x', '0px' );
				$css->add_property( '--kb-nav-dropdown-hide-transform-x', '0px' );
			}
		} else {
			$css->add_property( '--kb-nav-dropdown-toggle-border-left', $css->render_border( $sized_attributes['divider'], 'bottom' ) );
			$css->add_property( '--kb-nav-top-not-last-link-border-bottom', $css->render_border( $sized_attributes['divider'], 'bottom' ) );
			$css->add_property( '--kb-nav-top-not-last-link-border-right', 'var(--kb-nav-link-border-right)' );
		}

		//link, description, and media alignment
		if ($sized_attributes['linkHorizontalAlignment']) {
			$css->add_property('--kb-nav-top-link-align', $sized_attributes['linkHorizontalAlignment']);
			$link_flex_align = $sized_attributes['linkHorizontalAlignment'] == 'right' ? 'end' : ( $sized_attributes['linkHorizontalAlignment'] == 'center' ? 'center' : 'start' );
			$css->add_property('--kb-nav-top-link-flex-justify', $link_flex_align);
			$css->add_property('--kb-nav-top-link-media-container-align-self', $link_flex_align);
		}

		//dropdown link, description, and media alignment
		if ($sized_attributes['dropdownLinkHorizontalAlignment']) {
			$css->add_property('--kb-nav-dropdown-link-align', $sized_attributes['dropdownLinkHorizontalAlignment']);
			$link_flex_align = $sized_attributes['dropdownLinkHorizontalAlignment'] == 'right' ? 'end' : ( $sized_attributes['dropdownLinkHorizontalAlignment'] == 'center' ? 'center' : 'start' );
			$css->add_property('--kb-nav-dropdown-link-flex-justify', $link_flex_align);
			$css->add_property('--kb-nav-dropdown-link-media-container-align-self', $link_flex_align);
		}

		if ( str_contains( $sized_attributes['style'], 'fullheight' ) ) {
			$css->add_property( '--kb-nav-height', '100%' );
		}

		//placement logic where an additional selector is needed
		//transparent styles
		$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id );
		$css->add_property( '--kb-nav-top-link-color', $css->render_color( $sized_attributes['linkColorTransparent'] ), $sized_attributes['linkColorTransparent'] );
		$css->add_property( '--kb-nav-top-link-color-hover', $css->render_color( $sized_attributes['linkColorTransparentHover'] ) );
		$css->add_property( '--kb-nav-top-link-color-active', $css->render_color( $sized_attributes['linkColorTransparentActive']) );
		$css->add_property( '--kb-nav-top-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorTransparentActive']), $sized_attributes['parentActive'] );
		$css->add_property( '--kb-nav-top-link-background', $css->render_color( $sized_attributes['backgroundTransparent'] ), $sized_attributes['backgroundTransparent'] );
		$css->add_property( '--kb-nav-top-link-background-hover', $css->render_color( $sized_attributes['backgroundTransparentHover'] ) );
		$css->add_property( '--kb-nav-top-link-background-active', $css->render_color( $sized_attributes['backgroundTransparentActive']) );
		$css->add_property( '--kb-nav-top-link-background-active-ancestor', $css->render_color( $sized_attributes['backgroundTransparentActive']), $sized_attributes['parentActive'] );

		if ( $sized_attributes_inherit['orientation'] != 'vertical' ) {
			$css->add_property( '--kb-nav-top-not-last-link-border-right', $css->render_border( $sized_attributes['transparentDivider'], 'bottom' ) );
			$css->add_property( '--kb-nav-dropdown-toggle-border-left', 'var(--kb-nav-link-border-left)' );
			$css->add_property( '--kb-nav-top-not-last-link-border-bottom', 'var(--kb-nav-link-border-bottom)' );
		} else {
			$css->add_property( '--kb-nav-link-wrap-border-bottom', $css->render_border( $sized_attributes['transparentDivider'], 'bottom' ) );
			$css->add_property( '--kb-nav-dropdown-toggle-border-left', $css->render_border( $sized_attributes['transparentDivider'], 'bottom' ) );
			$css->add_property( '--kb-nav-top-not-last-link-border-right', 'var(--kb-nav-link-border-right)' );
		}

		//sticky styles
		$css->set_selector( '.item-is-stuck .wp-block-kadence-navigation' . $unique_id );
		$css->add_property( '--kb-nav-top-link-color', $css->render_color( $sized_attributes['linkColorSticky'] ), $sized_attributes['linkColorSticky'] );
		$css->add_property( '--kb-nav-top-link-color-hover', $css->render_color( $sized_attributes['linkColorStickyHover'] ) );
		$css->add_property( '--kb-nav-top-link-color-active', $css->render_color( $sized_attributes['linkColorStickyActive']) );
		$css->add_property( '--kb-nav-top-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorStickyActive']), $sized_attributes['parentActive'] );
		$css->add_property( '--kb-nav-top-link-background', $css->render_color( $sized_attributes['backgroundSticky'] ), $sized_attributes['backgroundSticky'] );
		$css->add_property( '--kb-nav-top-link-background-hover', $css->render_color( $sized_attributes['backgroundStickyHover'] ) );
		$css->add_property( '--kb-nav-top-link-background-active', $css->render_color( $sized_attributes['backgroundStickyActive']) );
		$css->add_property( '--kb-nav-top-link-background-active-ancestor', $css->render_color( $sized_attributes['backgroundStickyActive']), $sized_attributes['parentActive'] );

		if ( $sized_attributes_inherit['orientation'] != 'vertical' ) {
			$css->add_property( '--kb-nav-top-not-last-link-border-right', $css->render_border( $sized_attributes['stickyDivider'], 'bottom' ) );
			$css->add_property( '--kb-nav-dropdown-toggle-border-left', 'var(--kb-nav-link-border-left)' );
			$css->add_property( '--kb-nav-top-not-last-link-border-bottom', 'var(--kb-nav-link-border-bottom)' );
		} else {
			$css->add_property( '--kb-nav-link-wrap-border-bottom', $css->render_border( $sized_attributes['stickyDivider'], 'bottom' ) );
			$css->add_property( '--kb-nav-dropdown-toggle-border-left', $css->render_border( $sized_attributes['stickyDivider'], 'bottom' ) );
			$css->add_property( '--kb-nav-top-not-last-link-border-right', 'var(--kb-nav-link-border-right)' );
		}

		//not last submenu items and mega menu nav links
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .sub-menu > .menu-item:not(:last-of-type), .wp-block-kadence-navigation' . $unique_id . ' .sub-menu.mega-menu > .menu-item > .kb-link-wrap > .kb-nav-link-content' );
		$css->add_property( '--kb-nav-menu-item-border-bottom', $css->render_border( $sized_attributes['dropdownDivider'], 'bottom' ) );
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param          $attributes
	 * @param          $unique_id
	 * @param          $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$nav_block = null;
		$in_template_preview = isset( $attributes['templateKey'] ) && $attributes['templateKey'] && ( ! isset( $attributes['id'] ) || ! $attributes['id'] );

		//If this is a templated navigation placeholder, we're going to skip a bunch of the normal logic and checks
		if ( ! $in_template_preview ) {
			$nav_block = get_post( $attributes['id'] );

			if ( ! $nav_block || 'kadence_navigation' !== $nav_block->post_type ) {
				return '';
			}

			if ( 'publish' !== $nav_block->post_status || ! empty( $nav_block->post_password ) ) {
				return '';
			}
		}

		// Prevent a nav block from being rendered inside itself.
		if ( isset( self::$seen_refs[ $attributes['id'] ] ) && ! $attributes['templateKey'] ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]', 'kadence-blocks' ) :
				'';
		}
		self::$seen_refs[ $attributes['id'] ] = true;

		$nav_attributes = $this->get_attributes_with_defaults_cpt( $attributes['id'], 'kadence_navigation', '_kad_navigation_' );
		$nav_attributes = json_decode( json_encode( $nav_attributes ), true );

		if ( ! $in_template_preview ) {
			// Remove the advanced nav block so it doesn't try and render.
			$content = preg_replace( '/<!-- wp:kadence\/navigation {.*?} -->/', '', $nav_block->post_content );
		} else {
			$content = $this->applyTemplateKeyBlocks($attributes);
			$nav_attributes['orientation'] = str_contains( $attributes['templateKey'], 'vertical' ) ? 'vertical' : 'horizontal';
			$nav_attributes['orientationTablet'] = str_contains( $attributes['templateKey'], 'vertical' ) ? 'vertical' : 'horizontal';
			$nav_attributes['orientationMobile'] = str_contains( $attributes['templateKey'], 'vertical' ) ? 'vertical' : 'horizontal';
		}
		$content = str_replace( '<!-- wp:kadence/navigation  -->', '', $content );
		$content = str_replace( '<!-- wp:kadence/navigation -->', '', $content );
		$content = str_replace( '<!-- /wp:kadence/navigation -->', '', $content );

		// Handle embeds for nav block.
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $content );
		$content = $wp_embed->autoembed( $content );
		$content = do_blocks( $content );

		unset( self::$seen_refs[ $attributes['id'] ] );

		// Inherit values.
		// Just getting a css class for access to methods.
		$css = Kadence_Blocks_CSS::get_instance();
		$horizontal_layout = $css->get_inherited_value( $nav_attributes['horizontalLayout'], $nav_attributes['horizontalLayoutTablet'], $nav_attributes['horizontalLayoutMobile'], 'Desktop' );
		$horizontal_layout_tablet = $css->get_inherited_value( $nav_attributes['horizontalLayout'], $nav_attributes['horizontalLayoutTablet'], $nav_attributes['horizontalLayoutMobile'], 'Tablet' );
		$horizontal_layout_mobile = $css->get_inherited_value( $nav_attributes['horizontalLayout'], $nav_attributes['horizontalLayoutTablet'], $nav_attributes['horizontalLayoutMobile'], 'Mobile' );

		$fill_stretch = $css->get_inherited_value( $nav_attributes['stretchFill'], $nav_attributes['stretchFillTablet'], $nav_attributes['stretchFillMobile'], 'Desktop' );
		$fill_stretch_tablet = $css->get_inherited_value( $nav_attributes['stretchFill'], $nav_attributes['stretchFillTablet'], $nav_attributes['stretchFillMobile'], 'Tablet' );
		$fill_stretch_mobile = $css->get_inherited_value( $nav_attributes['stretchFill'], $nav_attributes['stretchFillTablet'], $nav_attributes['stretchFillMobile'], 'Mobile' );
		$orientation = $css->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Desktop' );
		$orientation_tablet = $css->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Tablet' );
		$orientation_mobile = $css->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Mobile' );

		// Wrapper Attributes.
		$wrapper_classes = array();
		$wrapper_classes[] = 'wp-block-kadence-navigation' . $unique_id;
		$wrapper_classes[] = 'kb-nav-desktop-horizontal-layout-' . ( $horizontal_layout );
		$wrapper_classes[] = 'kb-nav-tablet-horizontal-layout-' . ( $horizontal_layout_tablet );
		$wrapper_classes[] = 'kb-nav-mobile-horizontal-layout-' . ( $horizontal_layout_mobile );
		$wrapper_classes[] = 'navigation-desktop-layout-fill-stretch-' . ( 'fill' === $fill_stretch ? 'true' : 'false' );
		$orientation_tablet_bool = isset( $nav_attributes['collapseSubMenusTablet'] )
			? ( $nav_attributes['collapseSubMenusTablet'] === '' ? false : $nav_attributes['collapseSubMenusTablet'] )
			: '';
		$orientation_mobile_bool = isset( $nav_attributes['collapseSubMenusMobile'] )
			? ( $nav_attributes['collapseSubMenusMobile'] === '' ? false : $nav_attributes['collapseSubMenusMobile'] )
			: '';
		$collapse_sub_menus = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $orientation_tablet_bool, $orientation_mobile_bool, 'Desktop' );
		$collapse_sub_menus_tablet = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $orientation_tablet_bool, $orientation_mobile_bool, 'Tablet' );
		$collapse_sub_menus_mobile = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $orientation_tablet_bool, $orientation_mobile_bool, 'Mobile' );
		$dropdown_reveal = $css->get_inherited_value( $nav_attributes['dropdownReveal'], $nav_attributes['dropdownRevealTablet'], $nav_attributes['dropdownRevealMobile'], 'Desktop' );
		$dropdown_reveal_tablet = $css->get_inherited_value( $nav_attributes['dropdownReveal'], $nav_attributes['dropdownRevealTablet'], $nav_attributes['dropdownRevealMobile'], 'Tablet' );
		$dropdown_reveal_mobile = $css->get_inherited_value( $nav_attributes['dropdownReveal'], $nav_attributes['dropdownRevealTablet'], $nav_attributes['dropdownRevealMobile'], 'Mobile' );
		$style = $css->get_inherited_value( $nav_attributes['style'], $nav_attributes['styleTablet'], $nav_attributes['styleMobile'], 'Desktop' );
		$style_tablet = $css->get_inherited_value( $nav_attributes['style'], $nav_attributes['styleTablet'], $nav_attributes['styleMobile'], 'Tablet' );
		$style_mobile = $css->get_inherited_value( $nav_attributes['style'], $nav_attributes['styleTablet'], $nav_attributes['styleMobile'], 'Mobile' );
		$parent_toggles_menus_tablet_bool = isset( $nav_attributes['parentTogglesMenusTablet'] )
			? ( $nav_attributes['parentTogglesMenusTablet'] === '' ? false : $nav_attributes['parentTogglesMenusTablet'] )
			: '';
		$parent_toggles_menus_mobile_bool = isset( $nav_attributes['parentTogglesMenusMobile'] )
			? ( $nav_attributes['parentTogglesMenusMobile'] === '' ? false : $nav_attributes['parentTogglesMenusMobile'] )
			: '';
		$parent_toggles_menus = $css->get_inherited_value( $nav_attributes['parentTogglesMenus'], $parent_toggles_menus_tablet_bool, $parent_toggles_menus_mobile_bool, 'Desktop' );
		$parent_toggles_menus_tablet = $css->get_inherited_value( $nav_attributes['parentTogglesMenus'], $parent_toggles_menus_tablet_bool, $parent_toggles_menus_mobile_bool, 'Tablet' );
		$parent_toggles_menus_mobile = $css->get_inherited_value( $nav_attributes['parentTogglesMenus'], $parent_toggles_menus_tablet_bool, $parent_toggles_menus_mobile_bool, 'Mobile' );
		$parent_active_tablet_bool = isset( $nav_attributes['parentActiveTablet'] )
			? ( $nav_attributes['parentActiveTablet'] === '' ? false : $nav_attributes['parentActiveTablet'] )
			: '';
		$parent_active_mobile_bool = isset( $nav_attributes['parentActiveMobile'] )
			? ( $nav_attributes['parentActiveMobile'] === '' ? false : $nav_attributes['parentActiveMobile'] )
			: '';
		$parent_active = $css->get_inherited_value( $nav_attributes['parentActive'], $parent_active_tablet_bool, $parent_active_mobile_bool, 'Desktop' );
		$parent_active_tablet = $css->get_inherited_value( $nav_attributes['parentActive'], $parent_active_tablet_bool, $parent_active_mobile_bool, 'Tablet' );
		$parent_active_mobile = $css->get_inherited_value( $nav_attributes['parentActive'], $parent_active_tablet_bool, $parent_active_mobile_bool, 'Mobile' );
		$wrapper_classes[] = 'navigation-tablet-layout-fill-stretch-' . ( 'fill' === $fill_stretch_tablet ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-mobile-layout-fill-stretch-' . ( 'fill' === $fill_stretch_mobile ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-desktop-orientation-' . ( $orientation ? $orientation : 'horizontal' );
		$wrapper_classes[] = 'navigation-tablet-orientation-' . ( $orientation_tablet ? $orientation_tablet : 'horizontal' );
		$wrapper_classes[] = 'navigation-mobile-orientation-' . ( $orientation_mobile ? $orientation_mobile : 'horizontal' );
		if ( ! empty( $nav_attributes['className'] ) ) {
			$wrapper_classes[] = $nav_attributes['className'];
		}

		$name = ! empty( $attributes['name'] ) ? $attributes['name'] : '';

		$wrapper_attribute_items = array(
			'class'      => implode( ' ', $wrapper_classes ),
			'aria-label' => $name,
			'data-scroll-spy' => $nav_attributes['enableScrollSpy'],
		);

		if ( ! empty( $nav_attributes['anchor'] ) ) {
			$wrapper_attribute_items['id'] = $nav_attributes['anchor'];
		}

		if ( $nav_attributes['enableScrollSpy'] ) {
			$wrapper_attribute_items['data-scroll-spy-offset'] = isset( $nav_attributes['scrollSpyOffsetManual'] ) && $nav_attributes['scrollSpyOffsetManual'] ? $nav_attributes['scrollSpyOffset'] : false;
			$wrapper_attribute_items['data-scroll-spy-id'] = uniqid();
		}

		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_attribute_items );

		// Navigation Attributes.
		$navigation_classes = array();

		// Update animation classes with responsive actual animation stuff.
		$navigation_classes[] = 'navigation';
		$navigation_classes[] = 'navigation-desktop-style-' . ( $style ? $style : 'standard' );
		$navigation_classes[] = 'navigation-tablet-style-' . ( $style_tablet ? $style_tablet : 'standard' );
		$navigation_classes[] = 'navigation-mobile-style-' . ( $style_mobile ? $style_mobile : 'standard' );
		$navigation_classes[] = 'navigation-desktop-dropdown-animation-' . ( $dropdown_reveal ? $dropdown_reveal : 'none' );
		$navigation_classes[] = 'navigation-tablet-dropdown-animation-' . ( $dropdown_reveal_tablet ? $dropdown_reveal_tablet : 'none' );
		$navigation_classes[] = 'navigation-mobile-dropdown-animation-' . ( $dropdown_reveal_mobile ? $dropdown_reveal_mobile : 'none' );
		$navigation_classes[] = 'navigation-desktop-collapse-sub-menus-' . ( $collapse_sub_menus ? 'true' : 'false' );
		$navigation_classes[] = 'navigation-tablet-collapse-sub-menus-' . ( $collapse_sub_menus_tablet ? 'true' : 'false' );
		$navigation_classes[] = 'navigation-mobile-collapse-sub-menus-' . ( $collapse_sub_menus_mobile ? 'true' : 'false' );
		$navigation_classes[] = 'navigation-desktop-parent-toggles-menus-' . ( $parent_toggles_menus ? 'true' : 'false' );
		$navigation_classes[] = 'navigation-tablet-parent-toggles-menus-' . ( $parent_toggles_menus_tablet ? 'true' : 'false' );
		$navigation_classes[] = 'navigation-mobile-parent-toggles-menus-' . ( $parent_toggles_menus_mobile ? 'true' : 'false' );
		$navigation_classes[] = 'navigation-desktop-parent-active-' . ( $parent_active ? 'true' : 'false' );
		$navigation_classes[] = 'navigation-tablet-parent-active-' . ( $parent_active_tablet ? 'true' : 'false' );
		$navigation_classes[] = 'navigation-mobile-parent-active-' . ( $parent_active_mobile ? 'true' : 'false' );
		$navigation_attributes = $this->build_html_attributes(
			array(
				'class' => implode( ' ', $navigation_classes ),
			)
		);

		// Menu Attributes.
		$menu_classes = array();
		$menu_classes[] = 'kb-navigation';
		$menu_classes[] = 'menu';
		$menu_classes[] = 'collapse-sub-nav-desktop-' . ( $collapse_sub_menus ? 'true' : 'false' );
		$menu_classes[] = 'collapse-sub-nav-tablet-' . ( $collapse_sub_menus_tablet ? 'true' : 'false' );
		$menu_classes[] = 'collapse-sub-nav-mobile-' . ( $collapse_sub_menus_mobile ? 'true' : 'false' );
		$menu_attributes = $this->build_html_attributes(
			array(
				'class' => implode( ' ', $menu_classes ),
			)
		);

		if ( $nav_attributes['enableScrollSpy'] ) {
			wp_enqueue_script( 'kadence-blocks-gumshoe', KADENCE_BLOCKS_URL . 'includes/assets/js/gumshoe.min.js', array(), KADENCE_BLOCKS_VERSION, true );
			//need to load this script with the gumshoe dependency if scrollspy is enabled
			wp_dequeue_script( 'kadence-blocks-' . $this->block_name );
			wp_deregister_script( 'kadence-blocks-' . $this->block_name );
			wp_enqueue_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-navigation-block.min.js', array('kadence-blocks-gumshoe'), KADENCE_BLOCKS_VERSION, true );
		}

		return sprintf(
			'<div %1$s><nav %2$s><div class="menu-container"><ul %3$s>%4$s</ul></div></nav></div>',
			$wrapper_attributes,
			$navigation_attributes,
			$menu_attributes,
			$content
		);
	}

	/**
	 * Generates content to replace actual blocks for templated navigation placeholders.
	 * This should match the templated blocks created in the editor for the same template keys
	 *
	 * @param array $attributes The database attribtues.
	 */
	public function applyTemplateKeyBlocks( $attributes ) {
		if ( isset($attributes['templateKey']) && $attributes['templateKey'] ) {
			switch ($attributes['templateKey']) {
				case 'long':
					return '
						<!-- wp:kadence/navigation -->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_d2e014-e0","label":"about","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_a59d22-g7","label":"blog","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_0ee46f-b7","label":"contact","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_321f15-sb","label":"resources","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_321f15-qb","label":"locations","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_321f15-zb","label":"shop","url":"#"} /-->
						<!-- /wp:kadence/navigation -->
					';
					break;
				case 'long-vertical':
					return '
						<!-- wp:kadence/navigation -->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_d2e014-e0","label":"about","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_a59d22-g7","label":"blog","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_0ee46f-b7","label":"contact","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_321f15-sb","label":"resources","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_321f15-qb","label":"locations","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_321f15-zb","label":"shop","url":"#"} /-->
						<!-- /wp:kadence/navigation -->
					';
					break;
				case 'short':
					return '
						<!-- wp:kadence/navigation -->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_d2e014-e0","label":"about","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_a59d22-g7","label":"blog","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_0ee46f-b7","label":"contact","url":"#"} /-->
						<!-- /wp:kadence/navigation -->
					';
					break;

				default:
					return '
						<!-- wp:kadence/navigation -->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_d2e014-e0","label":"about","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_a59d22-g7","label":"blog","url":"#"} /-->
							<!-- wp:kadence/navigation-link {"uniqueID":"494_0ee46f-b7","label":"contact","url":"#"} /-->
						<!-- /wp:kadence/navigation -->
					';
					break;
			}
		}
		return '';
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		parent::register_scripts();
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-navigation-block.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_localize_script(
			'kadence-blocks-' . $this->block_name,
			'kadenceNavigationConfig',
			array(
				'screenReader' => array(
					'expand'     => __( 'Child menu', 'kadence-blocks' ),
					'expandOf'   => __( 'Child menu of', 'kadence-blocks' ),
					'collapse'   => __( 'Child menu', 'kadence-blocks' ),
					'collapseOf' => __( 'Child menu of', 'kadence-blocks' ),
				),
				'breakPoints' => array(
					'desktop' => 1024,
					'tablet' => 768,
				),
				'scrollOffset' => apply_filters( 'kadence_scroll_to_id_additional_offset', 0 ),
			),
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

		$normalized_attributes = array();
		foreach ( $attributes as $key => $value ) {
			$normalized_attributes[] = $key . '="' . esc_attr( $value ) . '"';
		}

		return implode( ' ', $normalized_attributes );
	}
}

Kadence_Blocks_Navigation_Block::get_instance();
