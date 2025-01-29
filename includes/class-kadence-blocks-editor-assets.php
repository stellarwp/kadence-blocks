<?php
/**
 * Class to Enqueue editor script assets of all the blocks.
 *
 * @since   1.0.0
 * @package Kadence Blocks
 */
namespace KadenceWP\KadenceBlocks;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;
use function kadence_blocks_get_asset_file;
use function kadence_blocks_get_current_license_data;
use function kadence_blocks_get_post_types;
use function kadence_blocks_is_ai_disabled;
use function rcp_get_membership_levels;
use function rcp_get_access_levels;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Enqueue editor script assets of all the blocks.
 *
 * @category class
 */
class Editor_Assets {
	/**
	 * Google fonts array.
	 *
	 * @var array
	 */
	public static $google_fonts = null;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

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
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'on_init_editor_assets' ], 10 );
		add_action( 'enqueue_block_editor_assets', [ $this, 'editor_assets_variables' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'editor_plugin_enqueue' ] );
		add_action( 'current_screen', [ $this, 'early_editor_assets' ] );
	}
	/**
	 * Enqueue block assets for backend editor.
	 *
	 * @since 1.0.0
	 */
	public function on_init_editor_assets() {
		// If in the frontend, bail out.
		if ( ! is_admin() ) {
			return;
		}
		// Icons Scripts & Styles.
		$kadence_icons_meta = kadence_blocks_get_asset_file( 'dist/icons' );
		wp_register_script( 'kadence-icons', KADENCE_BLOCKS_URL . 'dist/icons.js', array_merge( $kadence_icons_meta['dependencies'], [ 'wp-api' ] ), $kadence_icons_meta['version'], true );
		wp_set_script_translations( 'kadence-icons', 'kadence-blocks' );

		$kadence_base = kadence_blocks_get_asset_file( 'dist/extension-kadence-base' );
		wp_register_script( 'kadence-blocks-js', KADENCE_BLOCKS_URL . 'dist/extension-kadence-base.js', array_merge( $kadence_base['dependencies'], [ 'wp-api' ] ), $kadence_base['version'], true );
		// Block CSS Scripts & Styles.
		$kadence_stores_meta = kadence_blocks_get_asset_file( 'dist/extension-stores' );
		wp_register_script( 'kadence-extension-stores', KADENCE_BLOCKS_URL . 'dist/extension-stores.js', array_merge( $kadence_stores_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_stores_meta['version'], true );
		// wp_register_style( 'kadence-extension-stores', KADENCE_BLOCKS_URL . 'dist/extension/stores.css', array( 'wp-edit-blocks' ), $kadence_stores_meta['version'] );
		wp_set_script_translations( 'kadence-extension-stores', 'kadence-blocks' );

		// Helpers Scripts & Styles.
		$kadence_helpers_meta = kadence_blocks_get_asset_file( 'dist/helpers' );
		wp_register_script( 'kadence-helpers', KADENCE_BLOCKS_URL . 'dist/helpers.js', array_merge( $kadence_helpers_meta['dependencies'], [ 'wp-api' ] ), $kadence_helpers_meta['version'], true );
		wp_set_script_translations( 'kadence-helpers', 'kadence-blocks' );

		// Components Scripts & Styles.
		$kadence_components_meta = kadence_blocks_get_asset_file( 'dist/components' );
		wp_register_script( 'kadence-components', KADENCE_BLOCKS_URL . 'dist/components.js', array_merge( $kadence_components_meta['dependencies'], [ 'wp-api', 'kadence-extension-stores', 'kadence-blocks-js' ] ), $kadence_components_meta['version'], true );
		wp_register_style( 'kadence-components', KADENCE_BLOCKS_URL . 'dist/components.css', [ 'wp-edit-blocks' ], $kadence_components_meta['version'] );
		wp_set_script_translations( 'kadence-components', 'kadence-blocks' );

		// Block CSS Scripts & Styles.
		$kadence_block_css_meta = kadence_blocks_get_asset_file( 'dist/extension-block-css' );
		wp_register_script( 'kadence-extension-block-css', KADENCE_BLOCKS_URL . 'dist/extension-block-css.js', array_merge( $kadence_block_css_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_block_css_meta['version'], true );
		// wp_register_style( 'kadence-extension-block-css', KADENCE_BLOCKS_URL . 'dist/extension/block-css.css', array( 'wp-edit-blocks' ), $kadence_block_css_meta['version'] );
		wp_set_script_translations( 'kadence-extension-block-css', 'kadence-blocks' );

		// Plugin Scripts & Styles.
		$kadence_control_meta = kadence_blocks_get_asset_file( 'dist/plugin-kadence-control' );
		wp_register_script( 'kadence-blocks-plugin-js', KADENCE_BLOCKS_URL . 'dist/plugin-kadence-control.js', array_merge( $kadence_control_meta['dependencies'], [ 'wp-api', 'kadence-blocks-js' ] ), $kadence_control_meta['version'], true );
		wp_register_style( 'kadence-blocks-plugin-css', KADENCE_BLOCKS_URL . 'dist/plugin-kadence-control.css', [ 'wp-edit-blocks', 'kadence-components' ], $kadence_control_meta['version'] );
		wp_set_script_translations( 'kadence-blocks-plugin-js', 'kadence-blocks' );

		wp_set_script_translations( 'kadence-blocks-vendor', 'kadence-blocks' );

		$blocks = [
			'accordion',
			'advancedbtn',
			'advancedgallery',
			'advancedheading',
			'column',
			'countup',
			'countdown',
			'form',
			'googlemaps',
			'icon',
			'iconlist',
			'image',
			'infobox',
			'lottie',
			'identity',
			'posts',
			'rowlayout',
			'progress-bar',
			'search',
			'show-more',
			'spacer',
			'table',
			'tableofcontents',
			'tabs',
			'testimonials',
			'advanced-form',
			'header',
			'navigation',
			'navigation-link',
		];

		// for blocks moved from pro to free
		if ( ! defined( 'KBP_VERSION' ) || ( defined( 'KBP_VERSION' ) && version_compare( KBP_VERSION, '2.6.0', '>' ) ) ) {
			$blocks[] = 'videopopup';
		}

		foreach ( $blocks as $block ) {
			$meta   = kadence_blocks_get_asset_file( sprintf( 'dist/blocks-%s', $block ) );
			$handle = sprintf( 'kadence-blocks-%s', $block );

			$item = wp_register_script( $handle, sprintf( '%sdist/blocks-%s.js', KADENCE_BLOCKS_URL, $block ), array_merge( $meta['dependencies'], [ 'wp-api', 'kadence-blocks-js', 'kadence-extension-stores', 'kadence-extension-block-css' ] ), $meta['version'], true );
			wp_register_style( $handle, sprintf( '%sdist/blocks-%s.css', KADENCE_BLOCKS_URL, $block ), [ 'wp-edit-blocks', 'kadence-components' ], $meta['version'] );
			wp_set_script_translations( $handle, 'kadence-blocks' );
		}
	}
	/**
	 * Checks for kadence classic themes when returning default.
	 */
	public function show_editor_width() {
		$show                   = false;
		$current_theme          = wp_get_theme();
		$current_theme_name     = $current_theme->get( 'Name' );
		$current_theme_template = $current_theme->get( 'Template' );
		// Check for a kadence classic theme support.
		if ( 'Pinnacle' == $current_theme_name || 'pinnacle' == $current_theme_template || 'Pinnacle Premium' == $current_theme_name || 'pinnacle_premium' == $current_theme_template || 'Ascend - Premium' == $current_theme_name || 'ascend_premium' == $current_theme_template || 'Ascend' == $current_theme_name || 'ascend' == $current_theme_template || 'Virtue - Premium' == $current_theme_name || 'virtue_premium' == $current_theme_template || 'Virtue' == $current_theme_name || 'virtue' == $current_theme_template ) {
			$show = true;
		}
		return $show;
	}
	/**
	 * Enqueue block settings for backend editor.
	 */
	public function editor_assets_variables() {
		$sidebar_size   = 750;
		$nosidebar_size = 1140;
		$jssize         = 2000;
		if ( apply_filters( 'kadence_blocks_editor_width', $this->show_editor_width() ) ) {
			$editor_widths = get_option( 'kt_blocks_editor_width', [] );
			if ( ! isset( $editor_widths['enable_editor_width'] ) || 'true' === $editor_widths['enable_editor_width'] ) {
				$add_size  = 30;
				$post_type = get_post_type();
				if ( isset( $editor_widths['page_default'] ) && ! empty( $editor_widths['page_default'] ) && isset( $editor_widths['post_default'] ) && ! empty( $editor_widths['post_default'] ) ) {
					if ( isset( $post_type ) && 'page' === $post_type ) {
						$defualt_size_type = $editor_widths['page_default'];
					} else {
						$defualt_size_type = $editor_widths['post_default'];
					}
				} else {
					$defualt_size_type = 'sidebar';
				}
				if ( isset( $editor_widths['sidebar'] ) && ! empty( $editor_widths['sidebar'] ) ) {
					$sidebar_size = $editor_widths['sidebar'] + $add_size;
				} else {
					$sidebar_size = 750;
				}
				if ( isset( $editor_widths['nosidebar'] ) && ! empty( $editor_widths['nosidebar'] ) ) {
					$nosidebar_size = $editor_widths['nosidebar'] + $add_size;
				} else {
					$nosidebar_size = 1140 + $add_size;
				}
				if ( 'sidebar' == $defualt_size_type ) {
					$default_size = $sidebar_size;
				} elseif ( 'fullwidth' == $defualt_size_type ) {
					$default_size = 'none';
				} else {
					$default_size = $nosidebar_size;
				}
				if ( 'none' === $default_size ) {
					$jssize = 2000;
				} else {
					$jssize = $default_size;
				}
			}
			if ( isset( $editor_widths['enable_editor_width'] ) && 'false' === $editor_widths['enable_editor_width'] ) {
				$enable_editor_width = false;
			} else {
				$enable_editor_width = true;
			}
		} else {
			$enable_editor_width = false;
		}
		$userrole = 'none';
		if ( current_user_can( apply_filters( 'kadence_blocks_admin_role', 'manage_options' ) ) ) {
			$userrole = 'admin';
		} elseif ( current_user_can( apply_filters( 'kadence_blocks_editor_role', 'delete_others_pages' ) ) ) {
			$userrole = 'editor';
		} elseif ( current_user_can( apply_filters( 'kadence_blocks_author_role', 'publish_posts' ) ) ) {
			$userrole = 'author';
		} elseif ( current_user_can( apply_filters( 'kadence_blocks_contributor_role', 'edit_posts' ) ) ) {
			$userrole = 'contributor';
		}
		$access_levels = [];
		$level_ids     = false;
		if ( function_exists( 'rcp_get_access_levels' ) ) {
			foreach ( rcp_get_access_levels() as $key => $access_level_label ) {
				$access_levels[] = [
					'value' => $key,
					/* translators: %s is the access level name. */
					'label' => sprintf( __( '%s and higher', 'kadence-blocks' ), $key ),
				];
			}
			foreach ( rcp_get_membership_levels( [ 'number' => 999 ] ) as $level ) {
				$level_ids[] = [
					'value' => $level->get_id(),
					'label' => esc_attr( $level->get_name() ),
				];
			}
		}
		if ( ! class_exists( 'Kadence\Theme' ) ) {
			$global_colors = [
				'--global-palette1' => '#3182CE',
				'--global-palette2' => '#2B6CB0',
				'--global-palette3' => '#1A202C',
				'--global-palette4' => '#2D3748',
				'--global-palette5' => '#4A5568',
				'--global-palette6' => '#718096',
				'--global-palette7' => '#EDF2F7',
				'--global-palette8' => '#F7FAFC',
				'--global-palette9' => '#ffffff',
			];
		} else {
			$global_colors = [
				'--global-palette1' => \Kadence\kadence()->palette_option( 'palette1' ),
				'--global-palette2' => \Kadence\kadence()->palette_option( 'palette2' ),
				'--global-palette3' => \Kadence\kadence()->palette_option( 'palette3' ),
				'--global-palette4' => \Kadence\kadence()->palette_option( 'palette4' ),
				'--global-palette5' => \Kadence\kadence()->palette_option( 'palette5' ),
				'--global-palette6' => \Kadence\kadence()->palette_option( 'palette6' ),
				'--global-palette7' => \Kadence\kadence()->palette_option( 'palette7' ),
				'--global-palette8' => \Kadence\kadence()->palette_option( 'palette8' ),
				'--global-palette9' => \Kadence\kadence()->palette_option( 'palette9' ),
			];
		}
		$global_colors = apply_filters( 'kadence_blocks_pattern_global_colors', $global_colors );
		$font_sizes    = [
			'sm'   => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)',
			'md'   => 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
			'lg'   => 'clamp(1.75rem, 1.576rem + 0.543vw, 2rem)',
			'xl'   => 'clamp(2.25rem, 1.728rem + 1.63vw, 3rem)',
			'xxl'  => 'clamp(2.5rem, 1.456rem + 3.26vw, 4rem)',
			'xxxl' => 'clamp(2.75rem, 0.489rem + 7.065vw, 6rem)',
		];
		$pro_data      = kadence_blocks_get_current_license_data();
		if ( ! empty( $pro_data['key'] ) ) {
			$pro_data['api_key'] = $pro_data['key'];
		}
		if ( ! empty( $pro_data['email'] ) ) {
			$pro_data['api_email'] = $pro_data['email'];
		}
		$token         = ! kadence_blocks_is_ai_disabled() ? get_authorization_token( 'kadence-blocks' ) : '';
		$is_authorized = false;
		if ( ! empty( $pro_data['key'] ) && ! kadence_blocks_is_ai_disabled() ) {
			$is_authorized = is_authorized( $pro_data['key'], 'kadence-blocks', ( ! empty( $token ) ? $token : '' ), get_license_domain() );
		}
		if ( empty( $pro_data['domain'] ) ) {
			$pro_data['domain'] = get_license_domain();
		}
		$font_sizes       = apply_filters( 'kadence_blocks_variable_font_sizes', $font_sizes );
		$subscribed       = class_exists( 'Kadence_Blocks_Pro' ) || class_exists( 'KadenceWP\CreativeKit' ) ? true : get_option( 'kadence_blocks_wire_subscribe' );
		$gfont_names_path = KADENCE_BLOCKS_PATH . 'includes/gfonts-names-array.php';
		$icon_names_path  = KADENCE_BLOCKS_PATH . 'includes/icon-names-array.php';
		$icon_ico_path    = KADENCE_BLOCKS_PATH . 'includes/icons-ico-array.php';
		$icons_path       = KADENCE_BLOCKS_PATH . 'includes/icons-array.php';
		$current_user     = wp_get_current_user();
		$user_email       = $current_user->user_email;
		$recent_posts     = wp_get_recent_posts( [ 'numberposts' => '1' ] );
		$products         = get_posts(
			[
				'numberposts' => 4,
				'post_type'   => 'product',
				'fields'      => 'ids',
			] 
		);
		$prophecy_data    = json_decode( get_option( 'kadence_blocks_prophecy' ), true );
		wp_localize_script(
			'kadence-blocks-js',
			'kadence_blocks_params',
			[
				'ajax_url'               => admin_url( 'admin-ajax.php' ),
				'ajax_nonce'             => wp_create_nonce( 'kadence-blocks-ajax-verification' ),
				'ajax_loader'            => KADENCE_BLOCKS_URL . 'includes/assets/images/ajax-loader.gif',
				'site_name'              => sanitize_title( get_bloginfo( 'name' ) ),
				'pSlug'                  => apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ),
				'pVersion'               => KADENCE_BLOCKS_VERSION,
				'sidebar_size'           => $sidebar_size,
				'nosidebar_size'         => $nosidebar_size,
				'default_size'           => $jssize,
				'config'                 => get_option( 'kt_blocks_config_blocks' ),
				'configuration'          => get_option( 'kadence_blocks_config_blocks' ),
				'settings'               => get_option( 'kadence_blocks_settings_blocks' ),
				'userrole'               => $userrole,
				'proData'                => $pro_data,
				'isAuthorized'           => $is_authorized,
				'isAIDisabled'           => kadence_blocks_is_ai_disabled(),
				'homeLink'               => admin_url( 'admin.php?page=kadence-blocks-home' ),
				'pro'                    => ( class_exists( 'Kadence_Blocks_Pro' ) ? 'true' : 'false' ),
				'creativeKit'            => ( class_exists( 'KadenceWP\CreativeKit' ) ? 'true' : 'false' ),
				'colors'                 => get_option( 'kadence_blocks_colors' ),
				'global'                 => get_option( 'kadence_blocks_global' ),
				'globalSettings'         => get_option( 'kadence_blocks_settings' ),
				'gutenberg'              => ( function_exists( 'gutenberg_menu' ) ? 'true' : 'false' ),
				'privacy_link'           => get_privacy_policy_url(),
				'privacy_title'          => ( get_option( 'wp_page_for_privacy_policy' ) ? get_the_title( get_option( 'wp_page_for_privacy_policy' ) ) : '' ),
				'editor_width'           => $enable_editor_width,
				'isKadenceT'             => class_exists( 'Kadence\Theme' ),
				'headingWeights'         => apply_filters( 'kadence_blocks_default_heading_font_weights', ( class_exists( 'Kadence\Theme' ) ? $this->get_headings_weights() : null ) ),
				'bodyWeights'            => apply_filters( 'kadence_blocks_default_body_font_weights', ( class_exists( 'Kadence\Theme' ) ? $this->get_body_weights() : null ) ),
				'buttonWeights'          => apply_filters( 'kadence_blocks_default_button_font_weights', ( class_exists( 'Kadence\Theme' ) ? $this->get_button_weights() : null ) ),
				'termEndpoint'           => '/kbp/v1/term-select',
				'taxonomiesEndpoint'     => '/kbp/v1/taxonomies-select',
				'postTypes'              => kadence_blocks_get_post_types(),
				'postTypesSearchable'    => kadence_blocks_get_post_types( [ 'exclude_from_search' => false ] ),
				'taxonomies'             => [],
				'g_fonts'                => $this->get_all_google_fonts(),
				'g_font_names'           => file_exists( $gfont_names_path ) ? include $gfont_names_path : [],
				'c_fonts'                => apply_filters( 'kadence_blocks_custom_fonts', [] ),
				'fluentCRM'              => defined( 'FLUENTCRM' ),
				'cloud_enabled'          => apply_filters( 'kadence_blocks_cloud_enabled', true ),
				'dynamic_enabled'        => apply_filters( 'kadence_blocks_dynamic_enabled', true ),
				'cloud_settings'         => get_option( 'kadence_blocks_cloud' ),
				'subscribed'             => $subscribed,
				'showWire'               => apply_filters( 'kadence_blocks_wireframe_library_enabled', true ),
				'wireImage'              => KADENCE_BLOCKS_URL . 'includes/assets/images/graphy.png',
				'user_email'             => $user_email,
				'prebuilt_libraries'     => apply_filters( 'kadence_blocks_custom_prebuilt_libraries', [] ),
				'showDesignLibrary'      => apply_filters( 'kadence_blocks_design_library_enabled', true ),
				'postQueryEndpoint'      => '/kbp/v1/post-query',
				'icon_names'             => file_exists( $icon_names_path ) ? include $icon_names_path : [],
				'rest_url'               => get_rest_url(),
				'wp_version'             => get_bloginfo( 'version' ),
				'rcp_levels'             => $level_ids,
				'rcp_access'             => ! empty( $access_levels ) ? $access_levels : false,
				'svgMaskPath'            => KADENCE_BLOCKS_URL . 'includes/assets/images/masks/',
				'wp_max_upload_size'     => wp_max_upload_size(),
				'get_allowed_mime_types' => get_allowed_mime_types(),
				'global_colors'          => $global_colors,
				'font_sizes'             => $font_sizes,
				'livePreviewStyles'      => apply_filters( 'kadence_blocks_design_library_iframe_styles', KADENCE_BLOCKS_URL . 'includes/assets/css/live-preview-base.min.css?ver=' . KADENCE_BLOCKS_VERSION ),
				'hasPosts'               => ( ! empty( $recent_posts[0]['ID'] ) ? true : false ),
				'addPostsLink'           => admin_url( 'post-new.php' ),
				'hasWoocommerce'         => ( class_exists( 'woocommerce' ) ? true : false ),
				'hasProducts'            => ( class_exists( 'woocommerce' ) && ! empty( $products ) ? true : false ),
				'replaceProducts'        => ( class_exists( 'woocommerce' ) && ! empty( $products ) ? $products : '' ),
				'addProductsLink'        => ( class_exists( 'woocommerce' ) ? admin_url( 'product-new.php' ) : 'https://wordpress.org/plugins/woocommerce/' ),
				'hasKadenceCaptcha'      => ( is_plugin_active( 'kadence-recaptcha/kadence-recaptcha.php' ) ? true : false ),
				'hasKadencePro'          => ( is_plugin_active( 'kadence-pro/kadence-pro.php' ) ? true : false ),
				'adminUrl'               => get_admin_url(),
				'aiLang'                 => ( ! empty( $prophecy_data['lang'] ) ? $prophecy_data['lang'] : '' ),
				'kadenceBlocksUrl'       => KADENCE_BLOCKS_URL,
			]
		);
		wp_localize_script(
			'kadence-blocks-js',
			'kadence_blocks_params_ico',
			[
				'icons' => file_exists( $icon_ico_path ) ? include $icon_ico_path : [],
			]
		);
		wp_localize_script(
			'kadence-blocks-js',
			'kadence_blocks_params_fa',
			[
				'icons' => file_exists( $icons_path ) ? include $icons_path : [],
			]
		);
		$fast_load_patterns = class_exists( 'GFForms' ) ? false : true;
		if ( apply_filters( 'kadence_blocks_preload_design_library', $fast_load_patterns ) ) {
			$design_library_controller_upload = new \Kadence_Blocks_Prebuilt_Library_REST_Controller();
			wp_localize_script(
				'kadence-blocks-js',
				'kadence_blocks_params_library',
				[
					'library_sections' => apply_filters( 'kadence_blocks_preload_design_library_data', $design_library_controller_upload->get_local_library_data() ),
				]
			);
			wp_localize_script(
				'kadence-blocks-js',
				'kadence_blocks_params_wizard',
				[
					'settings' => $prophecy_data,
				]
			);
		}
	}

	/**
	 * Enqueue block plugin for backend editor.
	 */
	public function editor_plugin_enqueue() {
		global $pagenow;
		if ( $pagenow !== 'widgets.php' ) {
			wp_enqueue_script( 'kadence-blocks-plugin-js' );
			wp_enqueue_style( 'kadence-blocks-plugin-css' );
		}

		$asset_meta = kadence_blocks_get_asset_file( 'dist/early-filters' );
		wp_enqueue_script( 'kadence-blocks-early-filters-js', KADENCE_BLOCKS_URL . 'dist/early-filters.js', array_merge( $asset_meta['dependencies'], [ 'wp-blocks', 'wp-i18n', 'wp-element' ] ), $asset_meta['version'], true );
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_headings_weights() {
		$weights = [];
		if ( function_exists( 'Kadence\kadence' ) ) {
			$heading_font = \Kadence\kadence()->option( 'heading_font' );
			$is_body      = false;
			$body_font    = [];
			if ( is_array( $heading_font ) ) {
				if ( ! empty( $heading_font['family'] ) && 'inherit' === $heading_font['family'] ) {
					// Inherit from Body.
					$is_body      = true;
					$body_font    = \Kadence\kadence()->option( 'base_font' );
					$heading_font = $body_font;
				}
				if ( isset( $heading_font['google'] ) && $heading_font['google'] ) {
					// Google font.
					$variants = $this->get_google_font_weights( $heading_font['family'] );
					if ( is_array( $variants ) ) {
						if ( $is_body ) {
							$new_weight_variant = [ $body_font['variant'] ];
						} else {
							$new_weight_variant = [];
						}
						foreach ( [ 'h1_font', 'h2_font', 'h3_font', 'h4_font', 'h5_font', 'h6_font' ] as $option ) {
							$h_font = \Kadence\kadence()->option( $option );
							if ( ! empty( $h_font['family'] ) && ( 'inherit' === $h_font['family'] || $heading_font['family'] === $h_font['family'] ) ) {
								if ( ! in_array( $h_font['variant'], $new_weight_variant, true ) ) {
									array_push( $new_weight_variant, $h_font['variant'] );
								}
							}
						}
						$weights[] = [
							'value' => '',
							'label' => __( 'Inherit', 'kadence-blocks' ),
						];
						foreach ( $variants as $key => $value ) {
							$label = $this->get_weight_label( $value );
							if ( in_array( $value, $new_weight_variant ) ) {
								$weights[] = [
									'value' => ( $value === 'regular' ? '400' : $value ),
									'label' => $label,
								];
							} else {
								// For now, don't add until we smart load when used.
								// $weights[] = array( 'value' => $value, 'label' => $label . ' ' . __( '(Not Globally Used)', 'kadence-blocks' ) );
							}
						}
					}
				} elseif ( isset( $heading_font['family'] ) && ! empty( $heading_font['family'] ) && substr( $heading_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
					// System Font.
					$weights = [
						[
							'value' => '',
							'label' => __( 'Inherit', 'kadence-blocks' ),
						],
						[
							'value' => '100',
							'label' => __( 'Thin 100', 'kadence-blocks' ),
						],
						[
							'value' => '200',
							'label' => __( 'Extra-Light 200', 'kadence-blocks' ),
						],
						[
							'value' => '300',
							'label' => __( 'Light 300', 'kadence-blocks' ),
						],
						[
							'value' => '400',
							'label' => __( 'Regular', 'kadence-blocks' ),
						],
						[
							'value' => '500',
							'label' => __( 'Medium 500', 'kadence-blocks' ),
						],
						[
							'value' => '600',
							'label' => __( 'Semi-Bold 600', 'kadence-blocks' ),
						],
						[
							'value' => '700',
							'label' => __( 'Bold 700', 'kadence-blocks' ),
						],
						[
							'value' => '800',
							'label' => __( 'Extra-Bold 800', 'kadence-blocks' ),
						],
						[
							'value' => '900',
							'label' => __( 'Ultra-Bold 900', 'kadence-blocks' ),
						],
					];
				}
			}
		}
		return apply_filters( 'kadence_blocks_heading_weight_options', $weights );
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_all_google_fonts() {
		if ( is_null( self::$google_fonts ) ) {
			self::$google_fonts = file_exists( KADENCE_BLOCKS_PATH . 'includes/gfonts-array.php' ) ? include KADENCE_BLOCKS_PATH . 'includes/gfonts-array.php' : [];
		}
		return self::$google_fonts;
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_google_font_weights( $font ) {
		$google_fonts = $this->get_all_google_fonts();
		if ( isset( $google_fonts[ $font ]['w'] ) ) {
			return $google_fonts[ $font ]['w'];
		}
		return '';
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_body_weights() {
		$weights = [];
		if ( function_exists( 'Kadence\kadence' ) ) {
			$base_font = \Kadence\kadence()->option( 'base_font' );
			if ( ! empty( $base_font['family'] ) ) {
				if ( isset( $base_font['google'] ) && $base_font['google'] ) {
					$variants = $this->get_google_font_weights( $base_font['family'] );
					if ( is_array( $variants ) ) {
						$new_weight_variant = [ $base_font['variant'] ];
						$heading_font       = \Kadence\kadence()->option( 'heading_font' );
						foreach ( [ 'h1_font', 'h2_font', 'h3_font', 'h4_font', 'h5_font', 'h6_font' ] as $option ) {
							$h_font = \Kadence\kadence()->option( $option );
							if ( ! empty( $h_font['family'] ) && ( ( 'inherit' === $heading_font['family'] && 'inherit' === $h_font['family'] ) || $base_font['family'] === $h_font['family'] ) ) {
								if ( ! in_array( $h_font['variant'], $new_weight_variant, true ) ) {
									array_push( $new_weight_variant, $h_font['variant'] );
								}
							}
						}
						$weights[] = [
							'value' => '',
							'label' => __( 'Inherit', 'kadence-blocks' ),
						];
						foreach ( $variants as $key => $value ) {
							$label = $this->get_weight_label( $value );
							if ( in_array( $value, $new_weight_variant ) ) {
								$weights[] = [
									'value' => ( $value === 'regular' ? '400' : $value ),
									'label' => $label,
								];
							} else {
								// For now, don't add until we smart load when used.
								// $weights[] = array( 'value' => $value, 'label' => $label . ' ' . __( '(Not Globally Used)', 'kadence-blocks' ) );
							}
						}
					}
				} elseif ( isset( $base_font['family'] ) && ! empty( $base_font['family'] ) && substr( $base_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
					// System Font.
					$weights = [
						[
							'value' => '',
							'label' => __( 'Inherit', 'kadence-blocks' ),
						],
						[
							'value' => '100',
							'label' => __( 'Thin 100', 'kadence-blocks' ),
						],
						[
							'value' => '200',
							'label' => __( 'Extra-Light 200', 'kadence-blocks' ),
						],
						[
							'value' => '300',
							'label' => __( 'Light 300', 'kadence-blocks' ),
						],
						[
							'value' => '400',
							'label' => __( 'Regular', 'kadence-blocks' ),
						],
						[
							'value' => '500',
							'label' => __( 'Medium 500', 'kadence-blocks' ),
						],
						[
							'value' => '600',
							'label' => __( 'Semi-Bold 600', 'kadence-blocks' ),
						],
						[
							'value' => '700',
							'label' => __( 'Bold 700', 'kadence-blocks' ),
						],
						[
							'value' => '800',
							'label' => __( 'Extra-Bold 800', 'kadence-blocks' ),
						],
						[
							'value' => '900',
							'label' => __( 'Ultra-Bold 900', 'kadence-blocks' ),
						],
					];
				}
			}
		}
		return apply_filters( 'kadence_blocks_body_weight_options', $weights );
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_weight_label( $value ) {
		$label = $value;
		switch ( $value ) {
			case '100':
				$label = __( 'Thin 100', 'kadence-blocks' );
				break;
			case '200':
				$label = __( 'Extra-Light 200', 'kadence-blocks' );
				break;
			case '300':
				$label = __( 'Light 300', 'kadence-blocks' );
				break;
			case 'regular':
				$label = __( 'Regular', 'kadence-blocks' );
				break;
			case '400':
				$label = __( 'Regular', 'kadence-blocks' );
				break;
			case '500':
				$label = __( 'Medium 500', 'kadence-blocks' );
				break;
			case '600':
				$label = __( 'Semi-Bold 600', 'kadence-blocks' );
				break;
			case '700':
				$label = __( 'Extra-Bold 800', 'kadence-blocks' );
				break;
			case '800':
				$label = __( 'Extra-Bold 800', 'kadence-blocks' );
				break;
			case '900':
				$label = __( 'Ultra-Bold 900', 'kadence-blocks' );
				break;
		}
		return $label;
	}
	/**
	 * Get an array font weight options.
	 */
	public function get_button_weights() {
		$weights = [];
		if ( function_exists( 'Kadence\kadence' ) ) {
			$button_font = \Kadence\kadence()->option( 'buttons_typography' );
			if ( ! empty( $button_font['family'] ) ) {
				$button_is_inherit = false;
				if ( ! empty( $button_font['family'] ) && 'inherit' === $button_font['family'] ) {
					// Inherit from Body.
					$button_is_inherit = true;
					$button_font       = \Kadence\kadence()->option( 'base_font' );
				}
				if ( isset( $button_font['google'] ) && $button_font['google'] ) {
					$variants = $this->get_google_font_weights( $button_font['family'] );
					if ( is_array( $variants ) ) {
						$new_weight_variant = [ $button_font['variant'] ];
						$heading_font       = \Kadence\kadence()->option( 'heading_font' );
						foreach ( [ 'h1_font', 'h2_font', 'h3_font', 'h4_font', 'h5_font', 'h6_font' ] as $option ) {
							$h_font = \Kadence\kadence()->option( $option );
							if ( ! empty( $h_font['family'] ) && ( ( 'inherit' === $heading_font['family'] && 'inherit' === $h_font['family'] && $button_is_inherit ) || $button_font['family'] === $h_font['family'] ) ) {
								if ( ! in_array( $h_font['variant'], $new_weight_variant, true ) ) {
									array_push( $new_weight_variant, $h_font['variant'] );
								}
							}
						}
						$weights[] = [
							'value' => '',
							'label' => __( 'Inherit', 'kadence-blocks' ),
						];
						foreach ( $variants as $key => $value ) {
							$label = $this->get_weight_label( $value );
							if ( in_array( $value, $new_weight_variant ) ) {
								$weights[] = [
									'value' => ( $value === 'regular' ? '400' : $value ),
									'label' => $label,
								];
							} else {
								// For now, don't add until we smart load when used.
								// $weights[] = array( 'value' => $value, 'label' => $label . ' ' . __( '(Not Globally Used)', 'kadence-blocks' ) );
							}
						}
					}
				} elseif ( isset( $button_font['family'] ) && ! empty( $button_font['family'] ) && substr( $button_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
					// System Font.
					$weights = [
						[
							'value' => '',
							'label' => __( 'Inherit', 'kadence-blocks' ),
						],
						[
							'value' => '100',
							'label' => __( 'Thin 100', 'kadence-blocks' ),
						],
						[
							'value' => '200',
							'label' => __( 'Extra-Light 200', 'kadence-blocks' ),
						],
						[
							'value' => '300',
							'label' => __( 'Light 300', 'kadence-blocks' ),
						],
						[
							'value' => '400',
							'label' => __( 'Regular', 'kadence-blocks' ),
						],
						[
							'value' => '500',
							'label' => __( 'Medium 500', 'kadence-blocks' ),
						],
						[
							'value' => '600',
							'label' => __( 'Semi-Bold 600', 'kadence-blocks' ),
						],
						[
							'value' => '700',
							'label' => __( 'Bold 700', 'kadence-blocks' ),
						],
						[
							'value' => '800',
							'label' => __( 'Extra-Bold 800', 'kadence-blocks' ),
						],
						[
							'value' => '900',
							'label' => __( 'Ultra-Bold 900', 'kadence-blocks' ),
						],
					];
				}
			}
		}
		return apply_filters( 'kadence_blocks_button_weight_options', $weights );
	}
	/**
	 * Get an array of visibility options.
	 */
	public function get_user_visibility_options() {
		$specific_roles = [];
		if ( function_exists( 'get_editable_roles' ) ) {
			foreach ( get_editable_roles() as $role_slug => $role_info ) {
				$specific_roles[] = [
					'value' => $role_slug,
					'label' => $role_info['name'],
				];
			}
		}
		return apply_filters( 'kadence_blocks_user_visibility_options', $specific_roles );
	}
	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 */
	public function early_editor_assets() {
		if ( ! is_admin() ) {
			return;
		}
		global $pagenow;
		if ( 'post.php' === $pagenow || 'post-new.php' === $pagenow || 'widgets.php' === $pagenow ) {
			wp_localize_script(
				'kadence-blocks-js',
				'kadence_blocks_user_params',
				[
					'userVisibility' => $this->get_user_visibility_options(),
				]
			);
		}
	}
}
Editor_Assets::get_instance();
