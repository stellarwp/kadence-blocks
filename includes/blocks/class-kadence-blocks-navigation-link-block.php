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
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	protected $has_style = false;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $seen_refs = array();

	protected $nav_link_attributes = array();

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
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$nav_link_attributes = $this->get_nav_link_attributes( $unique_id, $attributes );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $nav_link_attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container > ul li.wp-block-kadence-navigation-link' . $unique_id . ' > .link-drop-wrap > a' );
		$css->render_typography( $nav_link_attributes );

		if ( 'custom' === $nav_link_attributes['megaMenuWidth'] ) {
			$css->set_selector(
				'.wp-block-kadence-navigation .menu-container ul.menu .wp-block-kadence-navigation-link' . $unique_id . '.kadence-menu-mega-width-custom > ul.sub-menu'
			);
			$css->add_property( 'width', $css->render_size( $nav_link_attributes['megaMenuCustomWidth'], $nav_link_attributes['megaMenuCustomWidthUnit'] ) );
			// $css->set_selector( '.header-navigation[class*="header-navigation-dropdown-animation-fade"] #menu-item-' . $item->ID . '.kadence-menu-mega-enabled > .sub-menu' );
			// $css->add_property( 'margin-left', '-' . ( $data['mega_menu_custom_width'] ? floor( $data['mega_menu_custom_width'] / 2 ) : '400' ) . 'px' );
		}

		$css->set_selector( '.wp-block-kadence-navigation-link' . $unique_id . ' > .link-drop-wrap > a' );
		$css->render_measure_output( $nav_link_attributes, 'padding' );
		$css->render_measure_output( $nav_link_attributes, 'margin' );
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

		$css->set_media_state( strtolower( $size ) );

		$css->set_selector( '.wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link' . $unique_id . ' > .link-drop-wrap > a, .wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link' . $unique_id . ' > .link-drop-wrap' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColor'] ), $sized_attributes['linkColor'] );
		$css->add_property( 'background', $css->render_color( $sized_attributes['background'] ), $sized_attributes['background'] );
		$css->set_selector( '.wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link' . $unique_id . ' > .link-drop-wrap:hover > a, .wp-block-kadence-navigation .menu-container > ul > li.menu-item.wp-block-kadence-navigation-link' . $unique_id . ' > .link-drop-wrap:hover' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorHover'] ) );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundHover'] ) );
		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.wp-block-kadence-navigation-link' . $unique_id . ' > .link-drop-wrap > a, .wp-block-kadence-navigation .navigation .menu-container > ul > li.menu-item.current-menu-item.wp-block-kadence-navigation-link' . $unique_id . ' > .link-drop-wrap' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorActive'] ) );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundActive'] ) );

		//Dropdown logic from theme Styles Component
		// Dropdown.
		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link' . $unique_id . ' ul.sub-menu, .wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link' . $unique_id . ' ul.submenu' );
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundDropdown'] ) );

		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link' . $unique_id . ' ul li:not(:last-of-type), .wp-block-kadence-navigation .menu-container ul.menu > li.wp-block-kadence-navigation-link' . $unique_id . '.kadence-menu-mega-enabled > ul > li.menu-item > a' );
		$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['dropdownDivider'], 'bottom' ) );

		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link' . $unique_id . ' ul li.menu-item > .link-drop-wrap > a' );
		$css->add_property( 'padding-top', $css->render_size( $sized_attributes['dropdownVerticalSpacing'], $attributes['dropdownVerticalSpacingUnit'] ) );
		$css->add_property( 'padding-bottom', $css->render_size( $sized_attributes['dropdownVerticalSpacing'], $attributes['dropdownVerticalSpacingUnit'] ) );
		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link' . $unique_id . ' ul li.menu-item > .link-drop-wrap > a, .wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link' . $unique_id . ' ul.sub-menu ' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorDropdown']));

		$css->set_selector( '.wp-block-kadence-navigation .navigation .menu-container ul .wp-block-kadence-navigation-link' . $unique_id . ' ul li.menu-item > .link-drop-wrap > a:hover' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorDropdownHover'] ));
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundDropdownHover'] ));
		$css->set_selector( '.wp-block-kadence-navigation.navigation .menu-container ul .wp-block-kadence-navigation-link' . $unique_id . ' ul li.menu-item.current-menu-item > .link-drop-wrap > a' );
		$css->add_property( 'color', $css->render_color( $sized_attributes['linkColorDropdownActive'] ));
		$css->add_property( 'background', $css->render_color( $sized_attributes['backgroundDropdownActive']));
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

		$nav_link_attributes = $this->get_nav_link_attributes( $unique_id, $attributes );

		// Handle embeds for nav block.
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $content );
		$content = $wp_embed->autoembed( $content );
		$content = do_blocks( $content );

		unset( self::$seen_refs[ $attributes['id'] ] );

		$label = $nav_link_attributes['label'];
		$url = $nav_link_attributes['url'];

		$has_children = ! empty( $content );
		$temp = get_queried_object_id();
		$kind        = empty( $attributes['kind'] ) ? 'post_type' : str_replace( '-', '_', $attributes['kind'] );
		$is_active   = ! empty( $attributes['id'] ) && get_queried_object_id() === (int) $attributes['id'] && ! empty( get_queried_object()->post_type );
		$is_mega_menu = $nav_link_attributes['isMegaMenu'];
		$mega_menu_width_class = 'kadence-menu-mega-width-' . ( $nav_link_attributes['megaMenuWidth'] ? $nav_link_attributes['megaMenuWidth'] : 'container' );

		$wrapper_classes = array();
		$wrapper_classes[] = 'wp-block-kadence-navigation-link' . $unique_id;
		$wrapper_classes[] = 'menu-item';
		$wrapper_classes[] = $has_children ? 'menu-item-has-children' : '';
		$wrapper_classes[] = $is_active ? 'current-menu-item' : '';

		$wrapper_classes[] = $is_mega_menu ? 'kadence-menu-mega-enabled' : '';
		$wrapper_classes[] = $is_mega_menu ? $mega_menu_width_class : '';

		$name = $nav_link_attributes['name'];

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'      => implode( ' ', $wrapper_classes ),
				'aria-label' => $name,
			)
		);

		$down_arrow_icon = '<svg class="kadence-svg-icon kadence-arrow-down-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">';
		$down_arrow_icon .= '<title>' . esc_html__( 'Expand', 'kadence' ) . '</title>';
		$down_arrow_icon .= '<path d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>';
		$down_arrow_icon .= '</svg>';

		$sub_menu_classes = array();
		$sub_menu_classes[] = 'sub-menu';
		$sub_menu_classes[] = $is_mega_menu ? 'mega-menu' : '';
		$sub_menu_attributes = $this->build_html_attributes(
			array(
				'class' => implode( ' ', $sub_menu_classes ),
			)
		);

		$sub_menu_content = $has_children ? '<ul ' . $sub_menu_attributes . '>' . $content . '</ul>' : '';

		return sprintf(
			'<li %1$s><div class="link-drop-wrap"><a class="wp-block-navigation-item__content" href="' . esc_url( $url ) . '"><span class="link-drop-title-wrap">' . esc_html( $label ) . '<span class="title-dropdown-navigation-toggle">%2$s</span></span></a></div>%3$s</li>',
			$wrapper_attributes,
			$has_children ? $down_arrow_icon : '',
			$sub_menu_content
		);
	}

	/**
	 * Get Navigation Link attributes.
	 *
	 * @param int $unique_id The unique id.
	 * @return array
	 */
	private function get_nav_link_attributes( $unique_id, $attributes ) {
		global $wp_meta_keys;

		if ( ! empty( $this->nav_link_attributes[ $unique_id ] ) ) {
			return $this->nav_link_attributes[ $unique_id ];
		}

		$nav_link_attrs = $this->merge_defaults( $attributes );

		if ( $this->nav_link_attributes[ $unique_id ] = $nav_link_attrs ) {
			return $this->nav_link_attributes[ $unique_id ];
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
		$registry = WP_Block_Type_Registry::get_instance()->get_registered( 'kadence/navigation-link' );
		$default_attributes = array();

		if ( $registry && property_exists( $registry, 'attributes' ) && ! empty( $registry->attributes ) ) {
			foreach ( $registry->attributes as $key => $value ) {
				if ( isset( $value['default'] ) ) {
					$default_attributes[ $key ] = $value['default'];
				}
			}
		}

		return array_merge( $default_attributes, $attributes );
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

Kadence_Blocks_Navigation_Link_Block::get_instance();
