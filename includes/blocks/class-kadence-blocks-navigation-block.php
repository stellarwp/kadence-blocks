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
		$nav_attributes = $this->get_nav_attributes( $attributes['id'] );
		$nav_attributes = json_decode( json_encode( $nav_attributes ), true );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		return $css->css_output();
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

		// Wrapper Attributes.
		$stretch = $this->get_inherited_value( $nav_attributes['stretch'], $nav_attributes['stretchTablet'], $nav_attributes['stretchMobile'], 'Desktop' );
		$stretch_tablet = $this->get_inherited_value( $nav_attributes['stretch'], $nav_attributes['stretchTablet'], $nav_attributes['stretchMobile'], 'Tablet' );
		$stretch_mobile = $this->get_inherited_value( $nav_attributes['stretch'], $nav_attributes['stretchTablet'], $nav_attributes['stretchMobile'], 'Mobile' );
		$fill_stretch = $this->get_inherited_value( $nav_attributes['fillStretch'], $nav_attributes['fillStretchTablet'], $nav_attributes['fillStretchMobile'], 'Desktop' );
		$fill_stretch_tablet = $this->get_inherited_value( $nav_attributes['fillStretch'], $nav_attributes['fillStretchTablet'], $nav_attributes['fillStretchMobile'], 'Tablet' );
		$fill_stretch_mobile = $this->get_inherited_value( $nav_attributes['fillStretch'], $nav_attributes['fillStretchTablet'], $nav_attributes['fillStretchMobile'], 'Mobile' );
		$orientation = $this->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Desktop' );
		$orientation_tablet = $this->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Tablet' );
		$orientation_mobile = $this->get_inherited_value( $nav_attributes['orientation'], $nav_attributes['orientationTablet'], $nav_attributes['orientationMobile'], 'Mobile' );

		$wrapper_classes = array();
		$wrapper_classes[] = 'wp-block-kadence-navigation' . $unique_id;
		$wrapper_classes[] = 'navigation-desktop-layout-stretch-' . ( $stretch ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-tablet-layout-stretch-' . ( $stretch_tablet ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-mobile-layout-stretch-' . ( $stretch_mobile ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-desktop-layout-fill-stretch-' . ( $fill_stretch ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-tablet-layout-fill-stretch-' . ( $fill_stretch ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-mobile-layout-fill-stretch-' . ( $fill_stretch ? 'true' : 'false' );
		$wrapper_classes[] = 'navigation-desktop-orientation-' . ( $orientation ?? 'horizontal' );
		$wrapper_classes[] = 'navigation-tablet-orientation-' . ( $orientation_tablet ?? 'horizontal' );
		$wrapper_classes[] = 'navigation-mobile-orientation-' . ( $orientation_mobile ?? 'horizontal' );

		$name = ! empty( $attributes['name'] ) ? $attributes['name'] : '';

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'      => implode( ' ', $wrapper_classes ),
				'aria-label' => $name,
			)
		);

		// Navigation Attributes.
		$navigation_classes = array();
		$navigation_attributes = $this->build_html_attributes(
			array(
				'class' => implode( ' ', $navigation_classes ),
			)
		);

		// Menu Attributes.
		$menu_classes = array();
		$menu_attributes = $this->build_html_attributes(
			array(
				'class' => implode( ' ', $menu_classes ),
			)
		);

		return sprintf(
			'<div %1$s><nav %2$s><div class="menu-container"><ul %3$s>%4$s</ul><div></nav></div>',
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
	 * Get the value for a responsive attribute considering inheritance.
	 *
	 * @param mixed  $value The desktop value.
	 * @param mixed  $value_tablet The tablet value.
	 * @param mixed  $value_mobile The mobile value.
	 * @param string $size The mobile value.
	 * @return mixed
	 */
	public function get_inherited_value( $value, $value_tablet, $value_mobile, $size = 'Desktop' ) {
		if ( $size === 'Mobile' ) {
			if ( ! empty( $value_mobile ) ) {
				return $value_mobile;
			} else if ( ! empty( $value_tablet ) ) {
				return $value_tablet;
			}
		} else if ( $size === 'Tablet' ) {
			if ( ! empty( $value_tablet ) ) {
				return $value_tablet;
			}
		}
		return $value;
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
