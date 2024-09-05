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
		$css->render_measure_output( $nav_attributes, 'marginDropdown', '--kb-nav-dropdown-margin', [ 'unit_key' => 'marginDropdownUnit' ] );
		$css->render_measure_output( $nav_attributes, 'paddingDropdown', '--kb-nav-dropdown-padding', [ 'unit_key' => 'paddingDropdownUnit' ] );
		if ( isset( $nav_attributes['dropdownShadow'][0]['enable'] ) && $nav_attributes['dropdownShadow'][0]['enable'] ) {
			$css->add_property( '--kb-nav-dropdown-box-shadow', $css->render_shadow( $nav_attributes['dropdownShadow'][0] ) );
		}

		//main container (don't apply to children)
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' > .navigation > .menu-container > .menu');
		$css->render_measure_output( $nav_attributes, 'margin', '--kb-nav-margin', ['unit_key' => 'marginUnit']);
		$css->render_measure_output( $nav_attributes, 'padding', '--kb-nav-padding', ['unit_key' => 'paddingUnit']);

		//container styles
		$container_active_selector = $nav_attributes['parentActive'] ? 
			'.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap, 
			.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .kb-link-wrap' 
			: '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap';
		$css->render_button_styles_with_states(
			array(
				'backgroundBase' => 'background',
				'backgroundTypeBase' => 'backgroundType',
				'backgroundGradientBase' => 'backgroundGradient',
				'borderBase' => 'border',
				'borderRadiusBase' => 'borderRadius',
				'borderRadiusUnitBase' => 'borderRadiusUnit',
				'shadowBase' => 'shadow',
				'selector' => '.wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap',
				'selectorHover' => '.wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap:hover',
				'selectorActive' => $container_active_selector,
			),
			$nav_attributes
		);

		//nav item (top level only)
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' > .navigation > .menu-container > .menu > .wp-block-kadence-navigation-link > .kb-link-wrap > .kb-nav-link-content' );
		$css->render_typography( $nav_attributes );
		$css->render_measure_output( $nav_attributes, 'marginLink', '--kb-nav-link-margin', ['unit_key' => 'marginLinkUnit']);
		$css->render_measure_output( $nav_attributes, 'paddingLink', '--kb-nav-link-padding', ['unit_key' => 'paddingLinkUnit']);

		//dropdown links (only this nav's dropdowns, exclude embedded navigations in mega menus, etc)
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .sub-menu > .wp-block-kadence-navigation-link > .kb-link-wrap > .kb-nav-link-content' );
		$css->render_typography( $nav_attributes, 'dropdownTypography' );
		$css->render_measure_output( $nav_attributes, 'marginDropdownLink', '--kb-nav-link-margin', ['unit_key' => 'marginDropdownLinkUnit']);
		$css->render_measure_output( $nav_attributes, 'paddingDropdownLink', '--kb-nav-link-padding', ['unit_key' => 'paddingDropdownLinkUnit']);

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
		$navigation_horizontal_spacing = $sized_attributes['spacing'][1];
		$navigation_vertical_spacing = $sized_attributes['spacing'][0];

		$css->set_media_state( strtolower( $size ) );

		//no added specificty needed for these variables
		//these variable will slot into selectors found in the static stylesheet.
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id );
		$css->add_property( '--kb-nav-link-padding-left', $css->render_half_size( $navigation_horizontal_spacing, $attributes['spacingUnit'] ) );
		$css->add_property( '--kb-nav-link-padding-right', $css->render_half_size( $navigation_horizontal_spacing, $attributes['spacingUnit'] ) );
		$css->add_property( '--kb-nav-link-underline-width', 'calc( 100% - ' . $css->render_size( $navigation_horizontal_spacing, $attributes['spacingUnit'] ) . ' )', $navigation_horizontal_spacing );
		$css->add_property( '--kb-nav-top-link-color', $css->render_color( $sized_attributes['linkColor'] ) );		
		$css->add_property( '--kb-nav-top-link-color-hover', $css->render_color( $sized_attributes['linkColorHover'] ) );
		$css->add_property( '--kb-nav-top-link-color-active', $css->render_color( $sized_attributes['linkColorActive']) );
		$css->add_property( '--kb-nav-top-link-color-active-ancestor', $css->render_color( $sized_attributes['linkColorActive']), $sized_attributes['parentActive'] );
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
		$css->render_measure_range( $sized_attributes, ( 'Desktop' === $size ? 'dropdownBorderRadius' : 'dropdownBorderRadius' . $size ), '--kb-nav-dropdown-border-radius', '', ['unit_key' => 'dropdownBorderRadiusUnit']);
		
		//additional dynamic logic, but still lands in a slot in the static stylesheet
		if (
			( $sized_attributes_inherit['orientation'] == 'vertical' ||
			$sized_attributes_inherit['style'] === 'standard' ||
			$sized_attributes_inherit['style'] === 'underline' ||
			$sized_attributes_inherit['style'] === '' ) &&
			is_numeric( $navigation_vertical_spacing )
		) {
			$css->add_property( '--kb-nav-link-padding-top', $css->render_half_size( $navigation_vertical_spacing, $attributes['spacingUnit'] ) );
			$css->add_property( '--kb-nav-link-padding-bottom', $css->render_half_size( $navigation_vertical_spacing, $attributes['spacingUnit'] ) );
		}

		if ( $sized_attributes['orientation'] != 'vertical' ) {
			$css->add_property( '--kb-nav-dropdown-link-width', $css->render_size( $sized_attributes['dropdownWidth'], $sized_attributes['dropdownWidthUnit'] ) );
			$css->add_property( '--kb-nav-top-not-last-link-border-right', $css->render_border( $sized_attributes['divider'], 'bottom' ) );

			if ( $sized_attributes['dropdownHorizontalAlignment'] == 'center' ) {
				$css->add_property( '--kb-nav-dropdown-show-left', '50%' );
				$css->add_property( '--kb-nav-dropdown-show-transform', 'translate(-50%, 0)' );
			} else if ( $sized_attributes['dropdownHorizontalAlignment'] == 'right' ) {
				$css->add_property( '--kb-nav-dropdown-show-right', '0' );
			}
		} else {
			$css->add_property( '--kb-nav-link-border-bottom', $css->render_border( $sized_attributes['divider'], 'bottom' ) );
			$css->add_property( '--kb-nav-dropdown-toggle-border-left', $css->render_border( $sized_attributes['divider'], 'bottom' ) );
		}

		//placement logic where an additional selector is needed
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .menu > .menu-item.kadence-menu-mega-enabled > .sub-menu > .menu-item:not(:last-of-type), .wp-block-kadence-navigation' . $unique_id . ' .menu > .menu-item.kadence-menu-mega-enabled > .sub-menu > .menu-item' );
		$css->add_property( '--kb-nav-menu-item-border-bottom', $css->render_border( $sized_attributes['dropdownDivider'], 'bottom' ) );		

		//can't do a slot/css var with this one. "right" messes with the margin-inline positioning.
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > .menu > .menu-item .kb-nav-dropdown-toggle-btn' );
		$css->add_property( 'right', $css->render_half_size( $navigation_horizontal_spacing, $attributes['spacingUnit']), $navigation_horizontal_spacing );


		//transparent styles
		$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap > a, .header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorTransparent'] ), $sized_attributes['linkColorTransparent'] );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundTransparent'] ), $sized_attributes['backgroundTransparent'] );
		$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap:hover > a, .header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap:hover' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorTransparentHover'] ) );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundTransparentHover'] ) );
		if ( $sized_attributes['parentActive'] ) {
			$css->set_selector(	'.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap > a,
			.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap, 
			.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .kb-link-wrap > a,
			.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .kb-link-wrap' );
		} else {
			$css->set_selector(	'.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap > a,
			.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap' );
		}
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorTransparentActive']) );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundTransparentActive']) );
		//transparent divider
		if ( $sized_attributes['orientation'] == 'vertical' ) {
			$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul li .kb-link-wrap' );
			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['transparentDivider'], 'bottom' ) );
			$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation:not(.drawer-navigation-parent-toggle-true) ul li .kb-link-wrap button' );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['transparentDivider'], 'bottom' ) );
		} else {
			$css->set_selector( '.header-' . strtolower( $size ) . '-transparent .wp-block-kadence-navigation' . $unique_id . ' .navigation > .menu-container > ul > li:not(:last-of-type) > .kb-link-wrap' );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['transparentDivider'], 'bottom' ) );
		}

		//sticky styles
		$css->set_selector( '.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap > a, .item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorSticky'] ), $sized_attributes['linkColorSticky'] );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundSticky'] ), $sized_attributes['backgroundSticky'] );
		$css->set_selector( '.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap:hover > a, .item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .kb-link-wrap:hover' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorStickyHover'] ) );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundStickyHover'] ) );
		if ( $sized_attributes['parentActive'] ) {
			$css->set_selector(	'.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap > a,
			.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap, 
			.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .kb-link-wrap > a,
			.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .kb-link-wrap' );
		} else {
			$css->set_selector(	'.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap > a,
			.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .kb-link-wrap' );
		}
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorStickyActive']) );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundStickyActive']) );
		//sticky divider
		if ( $sized_attributes['orientation'] == 'vertical' ) {
			$css->set_selector( '.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul li .kb-link-wrap' );
			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['stickyDivider'], 'bottom' ) );
			$css->set_selector( '.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation:not(.drawer-navigation-parent-toggle-true) ul li .kb-link-wrap button' );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['stickyDivider'], 'bottom' ) );
		} else {
			$css->set_selector( '.item-is-stuck .wp-block-kadence-navigation' . $unique_id . ' .navigation > .menu-container > ul > li:not(:last-of-type) > .kb-link-wrap' );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['stickyDivider'], 'bottom' ) );
		}

		if ( str_contains( $sized_attributes['style'], 'fullheight' ) ) {
			$css->set_selector( '.wp-block-kadence-header .wp-block-kadence-navigation' . $unique_id );
			$css->add_property( 'height', '100%' );
		}
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
		$stretch = $css->get_inherited_value( $nav_attributes['stretch'], $nav_attributes['stretchTablet'], $nav_attributes['stretchMobile'], 'Desktop' );
		$stretch_tablet = $css->get_inherited_value( $nav_attributes['stretch'], $nav_attributes['stretchTablet'], $nav_attributes['stretchMobile'], 'Tablet' );
		$stretch_mobile = $css->get_inherited_value( $nav_attributes['stretch'], $nav_attributes['stretchTablet'], $nav_attributes['stretchMobile'], 'Mobile' );
		$fill_stretch = $css->get_inherited_value( $nav_attributes['fillStretch'], $nav_attributes['fillStretchTablet'], $nav_attributes['fillStretchMobile'], 'Desktop' );
		$fill_stretch_tablet = $css->get_inherited_value( $nav_attributes['fillStretch'], $nav_attributes['fillStretchTablet'], $nav_attributes['fillStretchMobile'], 'Tablet' );
		$fill_stretch_mobile = $css->get_inherited_value( $nav_attributes['fillStretch'], $nav_attributes['fillStretchTablet'], $nav_attributes['fillStretchMobile'], 'Mobile' );
		$orientation = $css->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Desktop' );
		$orientation_tablet = $css->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Tablet' );
		$orientation_mobile = $css->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Mobile' );
		$collapse_sub_menus = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $nav_attributes['collapseSubMenusTablet'], $nav_attributes['collapseSubMenusMobile'], 'Desktop' );
		$collapse_sub_menus_tablet = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $nav_attributes['collapseSubMenusTablet'], $nav_attributes['collapseSubMenusMobile'], 'Tablet' );
		$collapse_sub_menus_mobile = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $nav_attributes['collapseSubMenusTablet'], $nav_attributes['collapseSubMenusMobile'], 'Mobile' );
		$dropdown_reveal = $css->get_inherited_value( $nav_attributes['dropdownReveal'], $nav_attributes['dropdownRevealTablet'], $nav_attributes['dropdownRevealMobile'], 'Desktop' );
		$dropdown_reveal_tablet = $css->get_inherited_value( $nav_attributes['dropdownReveal'], $nav_attributes['dropdownRevealTablet'], $nav_attributes['dropdownRevealMobile'], 'Tablet' );
		$dropdown_reveal_mobile = $css->get_inherited_value( $nav_attributes['dropdownReveal'], $nav_attributes['dropdownRevealTablet'], $nav_attributes['dropdownRevealMobile'], 'Mobile' );
		$style = $css->get_inherited_value( $nav_attributes['style'], $nav_attributes['styleTablet'], $nav_attributes['styleMobile'], 'Desktop' );
		$style_tablet = $css->get_inherited_value( $nav_attributes['style'], $nav_attributes['styleTablet'], $nav_attributes['styleMobile'], 'Tablet' );
		$style_mobile = $css->get_inherited_value( $nav_attributes['style'], $nav_attributes['styleTablet'], $nav_attributes['styleMobile'], 'Mobile' );
		$parent_toggles_menus = $css->get_inherited_value( $nav_attributes['parentTogglesMenus'], $nav_attributes['parentTogglesMenusTablet'], $nav_attributes['parentTogglesMenusMobile'], 'Desktop' );
		$parent_toggles_menus_tablet = $css->get_inherited_value( $nav_attributes['parentTogglesMenus'], $nav_attributes['parentTogglesMenusTablet'], $nav_attributes['parentTogglesMenusMobile'], 'Tablet' );
		$parent_toggles_menus_mobile = $css->get_inherited_value( $nav_attributes['parentTogglesMenus'], $nav_attributes['parentTogglesMenusTablet'], $nav_attributes['parentTogglesMenusMobile'], 'Mobile' );
		$collapse_sub_menus = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $nav_attributes['collapseSubMenusTablet'], $nav_attributes['collapseSubMenusMobile'], 'Desktop' );
		$collapse_sub_menus_tablet = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $nav_attributes['collapseSubMenusTablet'], $nav_attributes['collapseSubMenusMobile'], 'Tablet' );
		$collapse_sub_menus_mobile = $css->get_inherited_value( $nav_attributes['collapseSubMenus'], $nav_attributes['collapseSubMenusTablet'], $nav_attributes['collapseSubMenusMobile'], 'Mobile' );
		$parent_active = $css->get_inherited_value( $nav_attributes['parentActive'], $nav_attributes['parentActiveTablet'], $nav_attributes['parentActiveMobile'], 'Desktop' );
		$parent_active_tablet = $css->get_inherited_value( $nav_attributes['parentActive'], $nav_attributes['parentActiveTablet'], $nav_attributes['parentActiveMobile'], 'Tablet' );
		$parent_active_mobile = $css->get_inherited_value( $nav_attributes['parentActive'], $nav_attributes['parentActiveTablet'], $nav_attributes['parentActiveMobile'], 'Mobile' );

		// Wrapper Attributes.
		$wrapper_classes = array();
		$wrapper_classes[] = 'wp-block-kadence-navigation' . $unique_id;
		$wrapper_classes[] = 'navigation-desktop-layout-stretch-' . ( $stretch ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-tablet-layout-stretch-' . ( $stretch_tablet ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-mobile-layout-stretch-' . ( $stretch_mobile ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-desktop-layout-fill-stretch-' . ( $fill_stretch ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-tablet-layout-fill-stretch-' . ( $fill_stretch ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-mobile-layout-fill-stretch-' . ( $fill_stretch ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-desktop-orientation-' . ( $orientation ? $orientation : 'horizontal' );
		$wrapper_classes[] = 'navigation-tablet-orientation-' . ( $orientation_tablet ? $orientation_tablet : 'horizontal' );
		$wrapper_classes[] = 'navigation-mobile-orientation-' . ( $orientation_mobile ? $orientation_mobile : 'horizontal' );

		$name = ! empty( $attributes['name'] ) ? $attributes['name'] : '';

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'      => implode( ' ', $wrapper_classes ),
				'aria-label' => $name,
			)
		);

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
					'expand'     => __( 'Child menu', 'kadence' ),
					'expandOf'   => __( 'Child menu of', 'kadence' ),
					'collapse'   => __( 'Child menu', 'kadence' ),
					'collapseOf' => __( 'Child menu of', 'kadence' ),
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
