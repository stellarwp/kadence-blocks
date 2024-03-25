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

		$nav_attributes = $this->get_nav_attributes( $attributes['id'] );
		$nav_attributes = json_decode( json_encode( $nav_attributes ), true );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $nav_attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul li.menu-item > .link-drop-wrap > a' );
		$css->render_typography( $nav_attributes );

		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul ul li.menu-item > .link-drop-wrap > a' );
		$css->render_typography( $nav_attributes, 'dropdownTypography' );

		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' > .navigation > .menu-container > .menu' );
		$css->render_measure_output( $nav_attributes, 'padding' );
		$css->render_measure_output( $nav_attributes, 'margin' );
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
		$navigation_horizontal_spacing = $sized_attributes['spacing'][0];
		$navigation_vertical_spacing = $sized_attributes['spacing'][1];

		$css->set_media_state( strtolower( $size ) );
		// Navigation logic from theme styles component.
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation[class*="navigation-style-underline"] .menu-container>ul>li>a:after' );
		$css->add_property( 'width', 'calc( 100% - ' . $css->render_size( $navigation_horizontal_spacing, $attributes['spacingUnit'] ) . ' )', $navigation_horizontal_spacing );
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .link-drop-wrap >a' );
		$css->add_property( 'padding-left', $css->render_half_size( $navigation_horizontal_spacing, $attributes['spacingUnit'] ), $navigation_horizontal_spacing );
		$css->add_property( 'padding-right', $css->render_half_size( $navigation_horizontal_spacing, $attributes['spacingUnit'] ), $navigation_horizontal_spacing );
		if (
			( $sized_attributes_inherit['orientation'] == 'vertical' ||
			$sized_attributes_inherit['style'] === 'standard' ||
			$sized_attributes_inherit['style'] === 'underline' ||
			$sized_attributes_inherit['style'] === '' ) &&
			is_numeric( $navigation_vertical_spacing )
		) {
			$css->add_property( 'padding-top', $css->render_half_size( $navigation_vertical_spacing, $attributes['spacingUnit'] ) );
			$css->add_property( 'padding-bottom', $css->render_half_size( $navigation_vertical_spacing, $attributes['spacingUnit'] ) );
		}

		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .link-drop-wrap > a, .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .link-drop-wrap' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColor'] ), $sized_attributes['linkColor'] );
		$css->add_property( 'background', $css->render_color( $sized_attributes['background'] ), $sized_attributes['background'] );
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .link-drop-wrap:hover > a, .wp-block-kadence-navigation' . $unique_id . ' .menu-container > ul > li.menu-item > .link-drop-wrap:hover' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorHover'] ) );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundHover'] ) );
		if ( $sized_attributes['parentActive'] ) {
			$css->set_selector(	'.wp-block-kadence-navigation' . $unique_id . ' .navigation[class*="navigation-style-underline"] .menu-container.menu-container>ul>li.current-menu-ancestor>a:after' );
			$css->add_property( 'transform', 'scale(1, 1) translate(50%, 0)' );
			$css->set_selector(	'.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap > a,
				.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap 
				.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .link-drop-wrap > a,
				.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-ancestor > .link-drop-wrap' );
		} else {
			$css->set_selector(	'.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap > a,
				.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item.current-menu-item > .link-drop-wrap' );
		}
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorActive']) );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundActive']) );

		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container > ul > li.menu-item .dropdown-navigation-toggle' );
		$css->add_property( 'right', $css->render_half_size( $navigation_horizontal_spacing, $attributes['spacingUnit']) );

		//Dropdown logic from theme Styles Component
		// Dropdown.
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul ul.sub-menu, .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul ul.submenu' );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundDropdown'] ) );
		if ( $sized_attributes['orientation'] == 'horizontal' ) {
			if ( $sized_attributes['dropdownShadow'] && isset( $sized_attributes['dropdownShadow'][0] ) && $sized_attributes['dropdownShadow'][0]['enable'] ) {
				$css->add_property( 'box-shadow', $css->render_shadow( $sized_attributes['dropdownShadow'][0] ) );
			}
		}
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul ul li:not(:last-of-type), .wp-block-kadence-navigation' . $unique_id . ' .menu-container ul.menu > li.kadence-menu-mega-enabled > ul > li.menu-item > a' );
		$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['dropdownDivider'], 'bottom' ) );

		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul ul li.menu-item > .link-drop-wrap > a' );
		if ( $sized_attributes['orientation'] == 'horizontal' ) {
			$css->add_property( 'width', $sized_attributes['dropdownWidth'] . $sized_attributes['dropdownWidthUnit'] );
		}
		$css->add_property( 'padding-top', $css->render_size( $sized_attributes['dropdownVerticalSpacing'], $attributes['dropdownVerticalSpacingUnit'] ) );
		$css->add_property( 'padding-bottom', $css->render_size( $sized_attributes['dropdownVerticalSpacing'], $attributes['dropdownVerticalSpacingUnit'] ) );
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul ul li.menu-item > .link-drop-wrap > a, .wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul ul.sub-menu ' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorDropdown']));
		// $css->render_font( kadence()->option( 'dropdown_navigation_typography' ), $css );
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation .menu-container ul ul li.menu-item > .link-drop-wrap > a:hover' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorDropdownHover'] ));
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundDropdownHover'] ));
		$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . '.navigation .menu-container ul ul li.menu-item.current-menu-item > .link-drop-wrap > a' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorDropdownActive'] ));
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundDropdownActive']));

		if ( $sized_attributes['orientation'] == 'vertical' ) {
			$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation > .menu-container > ul > li.menu-item-has-children > .link-drop-wrap' );
			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['divider'], 'bottom' ) );
			$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation:not(.drawer-navigation-parent-toggle-true) ul li.menu-item-has-children .link-drop-wrap button' );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['divider'], 'bottom' ) );
		} else {
			$css->set_selector( '.wp-block-kadence-navigation' . $unique_id . ' .navigation > .menu-container > ul > li:not(:last-of-type) > .link-drop-wrap' );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['divider'], 'bottom' ) );
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
		$nav_block = get_post( $attributes['id'] );

		if ( ! $nav_block || 'kadence_navigation' !== $nav_block->post_type ) {
			return '';
		}

		if ( 'publish' !== $nav_block->post_status || ! empty( $nav_block->post_password ) ) {
			return '';
		}

		// Prevent a nav block from being rendered inside itself.
		if ( isset( self::$seen_refs[ $attributes['id'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]', 'kadence-blocks' ) :
				'';
		}
		self::$seen_refs[ $attributes['id'] ] = true;

		$nav_attributes = $this->get_nav_attributes( $attributes['id'] );
		$nav_attributes = json_decode( json_encode( $nav_attributes ), true );

		// Remove the advanced nav block so it doesn't try and render.
		$content = preg_replace( '/<!-- wp:kadence\/navigation {.*?} -->/', '', $nav_block->post_content );
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
		$navigation_classes[] = 'nav--toggle-sub';
		$navigation_classes[] = 'navigation-desktop-style-' . ( $style ? $style : 'standard' );
		$navigation_classes[] = 'navigation-tablet-style-' . ( $style_tablet ? $style_tablet : 'standard' );
		$navigation_classes[] = 'navigation-mobile-style-' . ( $style_mobile ? $style_mobile : 'standard' );
		$navigation_classes[] = 'navigation-desktop-dropdown-animation-' . ( $dropdown_reveal ? $dropdown_reveal : 'none' );
		$navigation_classes[] = 'navigation-tablet-dropdown-animation-' . ( $dropdown_reveal_tablet ? $dropdown_reveal_tablet : 'none' );
		$navigation_classes[] = 'navigation-mobile-dropdown-animation-' . ( $dropdown_reveal_mobile ? $dropdown_reveal_mobile : 'none' );
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
	 * Get Navigation attributes.
	 *
	 * @param int $post_id Post ID.
	 * @return array
	 */
	private function get_nav_attributes( $post_id ) {
		global $wp_meta_keys;

		$temp = WP_Block_Type_Registry::get_instance()->get_registered( 'kadence/navigation' );

		if ( ! empty( $this->nav_attributes[ $post_id ] ) ) {
			return $this->nav_attributes[ $post_id ];
		}

		$post_meta = get_post_meta( $post_id );
		$nav_meta = array();
		if ( is_array( $post_meta ) ) {
			foreach ( $post_meta as $meta_key => $meta_value ) {
				if ( strpos( $meta_key, '_kad_navigation_' ) === 0 && isset( $meta_value[0] ) ) {
					$nav_meta[ str_replace( '_kad_navigation_', '', $meta_key ) ] = maybe_unserialize( $meta_value[0] );
				}
			}
		}

		$nav_meta = $this->merge_defaults( $nav_meta );

		if ( $this->nav_attributes[ $post_id ] = $nav_meta ) {
			return $this->nav_attributes[ $post_id ];
		}

		return array();
	}

	/**
	 * Merges in default values from the cpt registration to the meta attributes from the database.
	 *
	 * @param array $attributes The database attribtues.
	 * @return array
	 */
	private function merge_defaults( $attributes ) {
		$meta_keys = get_registered_meta_keys( 'post', 'kadence_navigation' );
		$meta_prefix = '_kad_navigation_';
		$default_attributes = array();

		foreach ( $meta_keys as $key => $value ) {
			if ( str_starts_with( $key, $meta_prefix ) && array_key_exists( 'default', $value ) ) {
				$attr_name = str_replace( $meta_prefix, '', $key );
				$default_attributes[ $attr_name ] = $value['default'];
			}
		}

		return array_merge( $default_attributes, $attributes );
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
