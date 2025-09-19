<?php
/**
 * Class to Build the Header Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Header Block.
 *
 * @category class
 */
class Kadence_Blocks_Header_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'header';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

	/**
	 * Reference to the ids so we don't render inside of a render.
	 *
	 * @var array
	 */
	private static $seen_refs = [];
	/**
	 * Array of responsive transparent settings.
	 *
	 * @var array
	 */
	protected $responsive_transparent_settings = [];

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
		if ( empty( $attributes['id'] ) ) {
			return;
		}
		$header_attributes = $this->get_attributes_with_defaults_cpt( $attributes['id'], 'kadence_header', '_kad_header_' );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$sizes = array( 'Desktop', 'Tablet', 'Mobile' );

		foreach ( $sizes as $size ) {
			$this->sized_dynamic_styles( $css, $header_attributes, $unique_id, $size );
		}
		$css->set_media_state( 'desktop' );

		// Normal state styles.-cpt-id .kb-header-container
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container' );
		$css->render_measure_output( $header_attributes, 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] );
		$css->render_measure_output( $header_attributes, 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] );
		$css->render_typography( $header_attributes );

		if ( ! empty( $header_attributes['pro_backdropFilterString'] ) && class_exists( 'Kadence_Blocks_Pro' ) ) {
			$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container:not(:has(.item-is-stuck)), .wp-block-kadence-header' . $unique_id . ' .item-is-stuck' );
			$css->add_property( 'position', 'relative' );
			$css->add_property( 'z-index', '10' );
			$css->add_property( 'backdrop-filter', $header_attributes['pro_backdropFilterString'] );
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
		$sized_attributes = $css->get_sized_attributes_auto( $attributes, $size, false );
		$sized_attributes_inherit = $css->get_sized_attributes_auto( $attributes, $size );

		$bg = $sized_attributes['background'];
		$bg_transparent = $sized_attributes['backgroundTransparent'];
		$bg_sticky = $sized_attributes['backgroundSticky'];
		$border = $sized_attributes['border'];
		$typography = $sized_attributes['typography'];
		$min_height = $css->get_inherited_value($sized_attributes['height'][0], $sized_attributes['height'][1], $sized_attributes['height'][2], $size);
		$max_width = $css->get_inherited_value($sized_attributes['width'][0], $sized_attributes['width'][1], $sized_attributes['width'][2], $size);

		$css->set_media_state( strtolower( $size ) );
		// Normal state styles
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container' );
		$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['border'], 'bottom' ) );
		$css->add_property( 'border-top', $css->render_border( $sized_attributes['border'], 'top' ) );
		$css->add_property( 'border-left', $css->render_border( $sized_attributes['border'], 'left' ) );
		$css->add_property( 'border-right', $css->render_border( $sized_attributes['border'], 'right' ) );
		if ( $min_height ) {
			$css->add_property( 'min-height', $min_height . $sized_attributes['heightUnit'] );
		}
		if ( $max_width ) {
			$css->add_property( 'max-width', $max_width . $sized_attributes['widthUnit'] );
			$css->add_property( 'margin', '0 auto' );
		}
		// Only output the border radius if it's not 0.
		if ( ! empty( $sized_attributes[( 'Desktop' === $size ? 'borderRadius' : 'borderRadius' . $size )][0] ) || ! empty( $sized_attributes[( 'Desktop' === $size ? 'borderRadius' : 'borderRadius' . $size )][1] ) || ! empty( $sized_attributes[( 'Desktop' === $size ? 'borderRadius' : 'borderRadius' . $size )][2] ) || ! empty( $sized_attributes[( 'Desktop' === $size ? 'borderRadius' : 'borderRadius' . $size )][3] ) ) {
			$css->render_measure_range( $sized_attributes, ( 'Desktop' === $size ? 'borderRadius' : 'borderRadius' . $size ), 'border-radius', '', ['unit_key' => 'borderRadiusUnit']);
		}

		if ( $sized_attributes['shadow'] && isset( $sized_attributes['shadow'][0] ) && $sized_attributes['shadow'][0]['enable'] ) {
			$css->add_property( 'box-shadow', $css->render_shadow( $sized_attributes['shadow'][0] ) );
		}
		if ( ! $this->is_header_transparent( $attributes, $unique_id, $size ) ) {
			$css->render_background( $bg, $css );
		}

		//transparent normal
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . '.header-' . strtolower( $size ) . '-transparent' );
		if ( $this->is_header_transparent( $attributes, $unique_id, $size ) ) {
			$css->render_background( $bg_transparent, $css, '--kb-transparent-header-bg' );
		}
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . '.header-' . strtolower( $size ) . '-transparent .kb-header-container' );
		if ( $this->is_header_transparent( $attributes, $unique_id, $size ) ) {
			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['borderTransparent'], 'bottom' ) );
			$css->add_property( 'border-top', $css->render_border( $sized_attributes['borderTransparent'], 'top' ) );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['borderTransparent'], 'left' ) );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['borderTransparent'], 'right' ) );

			// Only output the border radius if it's not 0.
			if ( $sized_attributes['borderRadiusTransparent'][0] != 0 || ! empty( $sized_attributes['borderRadiusTransparent'][1] ) || ! empty( $sized_attributes['borderRadiusTransparent'][2] ) || ! empty( $sized_attributes['borderRadiusTransparent'][3] ) ) {
				$css->render_measure_range( $attributes, ( 'Desktop' === $size ? 'borderRadiusTransparent' : 'borderRadiusTransparent' . $size ), 'border-radius', '', ['unit_key' => 'borderRadiusTransparentUnit']);
			}
		}

		// Sticky normal
		$css->set_selector( '.wp-block-kadence-header' . $unique_id );
		if ( $sized_attributes['isSticky'] == '1' ) {
			$css->render_background( $bg_sticky, $css, '--kb-stuck-header-bg' );
		}
		$css->set_selector( '.wp-block-kadence-header' . $unique_id . ' .kb-header-container.item-is-stuck' );
		if ( $sized_attributes['isSticky'] == '1' ) {
			$css->add_property( 'border-bottom', $css->render_border( $sized_attributes['borderSticky'], 'bottom' ) );
			$css->add_property( 'border-top', $css->render_border( $sized_attributes['borderSticky'], 'top' ) );
			$css->add_property( 'border-left', $css->render_border( $sized_attributes['borderSticky'], 'left' ) );
			$css->add_property( 'border-right', $css->render_border( $sized_attributes['borderSticky'], 'right' ) );

			// Only output the border radius if it's not 0.
			if ( $sized_attributes['borderRadiusSticky'][0] != 0 || ! empty( $sized_attributes['borderRadiusSticky'][1] ) || ! empty( $sized_attributes['borderRadiusSticky'][2] ) || ! empty( $sized_attributes['borderRadiusSticky'][3] ) ) {
				$css->render_measure_range( $attributes, ( 'Desktop' === $size ? 'borderRadiusSticky' : 'borderRadiusSticky' . $size ), 'border-radius', '', ['unit_key' => 'borderRadiusStickyUnit']);
			}
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
		if ( empty( $attributes['id'] ) ) {
			return '';
		}
		$header_block = get_post( $attributes['id'] );

		if ( ! $header_block || 'kadence_header' !== $header_block->post_type ) {
			return '';
		}

		if ( 'publish' !== $header_block->post_status || ! empty( $header_block->post_password ) ) {
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


		$header_attributes = $this->get_attributes_with_defaults_cpt( $attributes['id'], 'kadence_header', '_kad_header_' );
		$header_attributes = json_decode( json_encode( $header_attributes ), true );
		// Remove the advanced Header block so it doesn't try and re-render.
		$content = preg_replace( '/<!-- wp:kadence\/header {.*?} -->/', '', $header_block->post_content );
		$content = str_replace( '<!-- wp:kadence/header  -->', '', $content );
		$content = str_replace( '<!-- wp:kadence/header -->', '', $content );
		$content = str_replace( '<!-- /wp:kadence/header -->', '', $content );


		// Handle embeds for header block.
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $content );
		$content = $wp_embed->autoembed( $content );
		$content = do_blocks( $content );

		unset( self::$seen_refs[ $attributes['id'] ] );

		// Inherit values.
		// Just getting a css class for access to methods.
		$css = Kadence_Blocks_CSS::get_instance();
		$is_sticky = $css->get_inherited_value( $header_attributes['isSticky'], $header_attributes['isStickyTablet'], $header_attributes['isStickyMobile'], 'Desktop' );
		$is_sticky_tablet = $css->get_inherited_value( $header_attributes['isSticky'], $header_attributes['isStickyTablet'], $header_attributes['isStickyMobile'], 'Tablet' );
		$is_sticky_mobile = $css->get_inherited_value( $header_attributes['isSticky'], $header_attributes['isStickyTablet'], $header_attributes['isStickyMobile'], 'Mobile' );
		$is_transparent        = $this->is_header_transparent( $header_attributes, $unique_id, 'desktop' );
		$is_transparent_tablet = $this->is_header_transparent( $header_attributes, $unique_id, 'tablet' );
		$is_transparent_mobile = $this->is_header_transparent( $header_attributes, $unique_id, 'mobile' );

		$wrapper_classes = array( 'wp-block-kadence-header' . $unique_id );
		if ( $is_sticky ) {
			$wrapper_classes[] = 'header-desktop-sticky';
		}
		if ( $is_sticky_tablet ) {
			$wrapper_classes[] = 'header-tablet-sticky';
		}
		if ( $is_sticky_mobile ) {
			$wrapper_classes[] = 'header-mobile-sticky';
		}
		if ( $is_transparent ) {
			$wrapper_classes[] = 'header-desktop-transparent';
		}
		if ( $is_transparent_tablet ) {
			$wrapper_classes[] = 'header-tablet-transparent';
		}
		if ( $is_transparent_mobile ) {
			$wrapper_classes[] = 'header-mobile-transparent';
		}
		if ( $header_attributes['className'] ) {
			$wrapper_classes[] = $header_attributes['className'];
		}
		$wrapper_args = array(
				'class' => implode( ' ', $wrapper_classes ),
				'role'  => 'banner',
		);
		if ( $header_attributes['anchor'] ) {
			$wrapper_args['id'] = $header_attributes['anchor'];
		}
		if ( $header_attributes['autoTransparentSpacing'] ) {
			$wrapper_args['data-auto-transparent-spacing'] = $header_attributes['autoTransparentSpacing'];
		}
		if ( $is_transparent ) {
			$wrapper_args['data-transparent'] = $is_transparent;
		}
		if ( $is_transparent_tablet ) {
			$wrapper_args['data-transparent-tablet'] = $is_transparent_tablet;
		}
		if ( $is_transparent_mobile ) {
			$wrapper_args['data-transparent-mobile'] = $is_transparent_mobile;
		}
		if ( $header_attributes['shrinkMain'] ) {
			$wrapper_args['data-shrink-main'] = $header_attributes['shrinkMain'];
		}
		if ( $header_attributes['shrinkMainHeight'] ) {
			$wrapper_args['data-shrink-main-height'] = $header_attributes['shrinkMainHeight'];
		}
		if ( $header_attributes['shrinkMainHeightTablet'] ) {
			$wrapper_args['data-shrink-main-height-tablet'] = $header_attributes['shrinkMainHeightTablet'];
		}
		if ( $header_attributes['shrinkMainHeightMobile'] ) {
			$wrapper_args['data-shrink-main-height-mobile'] = $header_attributes['shrinkMainHeightMobile'];
		}
		if ( $header_attributes['revealScrollUp'] ) {
			$wrapper_args['data-reveal-scroll-up'] = $header_attributes['revealScrollUp'];
		}
		if ( $is_sticky ) {
			$wrapper_args['data-sticky'] = $is_sticky;
			$wrapper_args['data-sticky-section'] = $header_attributes['stickySection'] ?: '';
		}
		if ( $is_sticky_tablet ) {
			$wrapper_args['data-sticky-tablet'] = $is_sticky_tablet;
			$wrapper_args['data-sticky-section-tablet'] = $header_attributes['stickySectionTablet'] ?: '';
		}
		if ( $is_sticky_mobile ) {
			$wrapper_args['data-sticky-mobile'] = $is_sticky_mobile;
			$wrapper_args['data-sticky-section-mobile'] = $header_attributes['stickySectionMobile'] ?: '';
		}
		if ( $header_attributes['mobileBreakpoint'] && $header_attributes['mobileBreakpoint'] !== 0 ) {
			$wrapper_args['data-mobile-breakpoint'] = $header_attributes['mobileBreakpoint'];
		}

		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$allowed_tags = [ 'header', 'div'];
		$header_tag = $this->get_html_tag( $header_attributes, 'headerTag', 'header', $allowed_tags);

		return sprintf(
			'<%1$s %2$s>%3$s</%1$s>',
			$header_tag,
			$wrapper_attributes,
			$content
		);
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

		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-header-block.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_localize_script(
			'kadence-blocks-' . $this->block_name,
			'kadenceHeaderConfig',
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
	 * Check if the header is transparent.
	 *
	 * @param array  $header_attributes The block attributes.
	 * @param string $size The size.
	 * @return bool
	 */
	private function is_header_transparent( $header_attributes, $unique_id = 'id', $size = 'desktop' ) {
		if ( ! empty( $this->responsive_transparent_settings[ $unique_id ] ) && isset( $this->responsive_transparent_settings[ $unique_id ][ strtolower( $size ) ] ) ) {
			return $this->responsive_transparent_settings[ $unique_id ][ strtolower( $size ) ];
		}
		$css = Kadence_Blocks_CSS::get_instance();
		$block_settings = [
			'desktop' => $css->get_inherited_value( $header_attributes['isTransparent'], $header_attributes['isTransparentTablet'], $header_attributes['isTransparentMobile'], 'Desktop' ),
			'tablet' => $css->get_inherited_value( $header_attributes['isTransparent'], $header_attributes['isTransparentTablet'], $header_attributes['isTransparentMobile'], 'Tablet' ),
			'mobile' => $css->get_inherited_value( $header_attributes['isTransparent'], $header_attributes['isTransparentTablet'], $header_attributes['isTransparentMobile'], 'Mobile' ),
		];

		$transparent_postmeta_setting = $this->transparent_postmeta_setting( $header_attributes );
		if ( $transparent_postmeta_setting === 'enable' ) {
			$block_settings = [
				'desktop' => true,
				'tablet'  => $block_settings['tablet'],
				'mobile'  => $block_settings['mobile'],
			];
		} elseif ( $transparent_postmeta_setting === 'disable' || ! $this->transparent_allowed_on_post_type( $header_attributes ) ) {
			$block_settings = [
				'desktop' => false,
				'tablet'  => false,
				'mobile'  => false,
			];
		}

		$this->responsive_transparent_settings = $block_settings;
		return $this->responsive_transparent_settings[ strtolower( $size ) ];
	}
	/**
	 * Check if the transparent header is allowed on the current post type.
	 *
	 * @param array $attributes The block attributes.
	 * @param int   $post_id The post ID.
	 * @return string/null
	 */
	private function transparent_postmeta_setting( $attributes, $post_id = null ) {
		if ( class_exists( 'Kadence\Theme' ) && ! empty( $attributes['inheritPostTransparent'] ) && $post_id !== false ) {
			$post_id = $post_id ?? get_the_ID();
			$posttrans = get_post_meta( $post_id, '_kad_post_transparent', true );

			return ( $posttrans === 'enable' || $posttrans === 'disable' ) ? $posttrans : null;
		}

		return null;
	}
	/**
	 * Check if the transparent header is allowed on the current post type.
	 *
	 * @param array $attributes The block attributes.
	 * @return bool
	 */
	private function transparent_allowed_on_post_type( $attributes ) {
		$transparent = 'enable';
		if ( empty( $attributes['disableTransparentOverrides'] ) || ! is_array( $attributes['disableTransparentOverrides'] ) ) {
			// return true if no post types are disabled.
			return true;
		}

		$disabled_post_types = array_fill_keys( $attributes['disableTransparentOverrides'], true );

		if ( is_singular() || is_front_page() ) {
			$post_type = is_front_page() ? 'page' : get_post_type();
			if ( !empty( $disabled_post_types[ $post_type ] ) ) {
				$transparent = 'disable';
			}
		} elseif( is_archive() || is_search() || is_home() || is_404() ) {
			if ( is_home() && ! is_front_page() ) {
				if ( get_query_var( 'tribe_events_front_page' ) ) {
//					$tribe_option_trans = \Kadence\kadence()->option('transparent_header_tribe_events_archive', true);
//					$transparent = $tribe_option_trans ? 'disable' : 'enable';
					$transparent = apply_filters('kadence_tribe_events_archive_transparent', 'enable');
				} else if( !empty( $attributes['inheritPostTransparent'] ) ) {
					$post_id = get_option('page_for_posts');
					$transparent_postmeta_setting = $this->transparent_postmeta_setting( $attributes, $post_id );
					if( $transparent_postmeta_setting === 'enable' || $transparent_postmeta_setting === 'disable' ) {
						$archivetrans = $transparent_postmeta_setting;
					}
				}
			} elseif (class_exists('woocommerce') && is_shop() && !is_search() && !empty( $attributes['inheritPostTransparent'] )) {
				$post_id = wc_get_page_id('shop');
				$transparent_postmeta_setting = $this->transparent_postmeta_setting( $attributes, $post_id );
				if( $transparent_postmeta_setting === 'enable' || $transparent_postmeta_setting === 'disable' ) {
					$archivetrans = $transparent_postmeta_setting;
				}
			} elseif (is_post_type_archive('tribe_events')) {
//				$tribe_option_trans = \Kadence\kadence()->option('transparent_header_tribe_events_archive', true);
//				$transparent = $tribe_option_trans ? 'disable' : 'enable';
				$transparent = apply_filters('kadence_tribe_events_archive_transparent', 'enable');
			} elseif (is_404()) {
				$transparent = 'disable';
			}

			if (isset($archivetrans) && ( ( 'enable' === $archivetrans  && class_exists( 'Kadence\Theme' ) )|| 'disable' === $archivetrans)) {
				$transparent = $archivetrans;
			} else {
				if ( !empty( $disabled_post_types['searchAndArchive'] ) ) {
					$transparent = 'disable';
				}
			}
		}

		// Keeping support of  enable/disable strings for backwards compatability with the filters.
		return isset( $transparent ) && ( $transparent === true || $transparent === 'enable' );
	}
}

Kadence_Blocks_Header_Block::get_instance();
