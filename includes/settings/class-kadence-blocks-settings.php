<?php
/**
 * Build Welcome Page With settings.
 *
 * @package Kadence Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_disconnect_url;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\build_auth_url;

/**
 * Build Welcome Page class
 *
 * @category class
 */
class Kadence_Blocks_Settings {

	/**
	 * Settings of this class
	 *
	 * @var array
	 */
	public static $settings = [];

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $editor_width = null;

	/**
	 * Used to cache token authorization to prevent multiple
	 * remote requests to the licensing server in the same
	 * request lifecycle.
	 *
	 * @var null|bool
	 */
	private static $authorized_cache = null;

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
		// only load if admin.
		if ( is_admin() ) {
			add_action( 'admin_menu', [ $this, 'add_menu' ] );
			add_action( 'network_admin_menu', [ $this, 'add_network_menu' ], 1 );
			add_filter( 'plugin_action_links_kadence-blocks/kadence-blocks.php', [ $this, 'add_settings_link' ] );
			add_action( 'in_plugin_update_message-kadence-blocks/kadence-blocks.php', [ $this, 'plugin_update_message' ], 10, 2 );
		}
		add_action( 'wp_ajax_kadence_blocks_activate_deactivate', [ $this, 'ajax_blocks_activate_deactivate' ], 10, 0 );
		add_action( 'wp_ajax_kadence_blocks_save_config', [ $this, 'ajax_blocks_save_config' ], 10, 0 );
		add_action( 'wp_ajax_kadence_post_default_width', [ $this, 'ajax_default_editor_width' ], 10, 0 );
		add_action( 'enqueue_block_editor_assets', [ $this, 'deregister_blocks' ] );
		add_action( 'admin_init', [ $this, 'activation_redirect' ] );
		add_action( 'admin_init', [ $this, 'load_settings' ] );
		add_action( 'init', [ $this, 'load_api_settings' ] );
		add_action( 'after_setup_theme', [ $this, 'load_color_palette' ], 999 );
		add_filter( 'block_editor_settings_all', [ $this, 'load_color_palette_editor_settings' ], 999 );
		add_action( 'init', [ $this, 'init_post_meta' ] );
		add_action( 'admin_head-post.php', [ $this, 'admin_editor_width' ], 100 );
		add_action( 'admin_head-post-new.php', [ $this, 'admin_editor_width' ], 100 );
		add_action( 'kadence_blocks_dash_side_panel_pro', [ $this, 'admin_pro_kadence_notice' ], 10 );
		add_filter( 'stellarwp/telemetry/kadence-blocks/optin_args', [ $this, 'optin_notice_args' ], 10 );
		add_filter( 'stellarwp/telemetry/kadence-blocks/exit_interview_args', [ $this, 'exit_interview_args' ], 10 );
	}
	/**
	 * Add an update message if in the readme.txt
	 *
	 * @param array  $data An array of plugin metadata.
	 * @param object $response An object of metadata about the available plugin update.
	 */
	public function plugin_update_message( $data, $response ) {
		$upgrade_notice = $this->get_upgrade_notice( '3.0.9' );
		echo apply_filters( 'kadence_blocks_in_plugin_update_message', $upgrade_notice ? wp_kses_post( $upgrade_notice ) . '<p style="display:none" class="dummy">' : '' ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
	}
	/**
	 * Get the upgrade notice from WordPress.org.
	 *
	 * @param  string $version WooCommerce new version.
	 * @return string
	 */
	protected function get_upgrade_notice( $version ) {
		$transient_name = 'kb_upgrade_notice_' . $version;
		$upgrade_notice = get_transient( $transient_name );

		if ( false === $upgrade_notice ) {
			$response = wp_safe_remote_get( 'https://plugins.svn.wordpress.org/kadence-blocks/trunk/readme.txt' );
			if ( ! is_wp_error( $response ) && ! empty( $response['body'] ) ) {
				$upgrade_notice = $this->parse_update_notice( $response['body'], $version );
				set_transient( $transient_name, $upgrade_notice, DAY_IN_SECONDS );
			}
		}
		return $upgrade_notice;
	}
	/**
	 * Parse update notice from readme file.
	 *
	 * @param  string $content WooCommerce readme file content.
	 * @param  string $new_version WooCommerce new version.
	 * @return string
	 */
	private function parse_update_notice( $content, $new_version ) {
		$version_parts     = explode( '.', $new_version );
		$check_for_notices = [
			$version_parts[0] . '.' . $version_parts[1] . '.0', // Major.
			$version_parts[0] . '.' . $version_parts[1] . '.' . $version_parts[2], // Patch.
		];
		$upgrade_notice    = '';
		$notice_regexp     = '~==\s*Upgrade Notice\s*==\s*=\s*(.*)\s*=(.*)(=\s*' . preg_quote( $new_version ) . '\s*=|$)~Uis';
		foreach ( $check_for_notices as $check_version ) {
			if ( version_compare( KADENCE_BLOCKS_VERSION, $check_version, '>' ) ) {
				continue;
			}
			$matches = null;
			if ( preg_match( $notice_regexp, $content, $matches ) ) {
				$notices = (array) preg_split( '~[\r\n]+~', trim( $matches[2] ) );
				if ( ! empty( $notices[0] ) ) {
					$upgrade_notice .= '<div class="update-message"><strong>';
					$upgrade_notice .= preg_replace( '~\[([^\]]*)\]\(([^\)]*)\)~', '<a href="${2}">${1}</a>', $notices[0] );
					$upgrade_notice .= '</strong></div>';
					break;
				}
			}
		}
		return wp_kses_post( $upgrade_notice );
	}
	/**
	 * Filter the exit_interview notice args.
	 *
	 * @param array $default_args the exit_interview args.
	 */
	public function exit_interview_args( $default_args ) {
		$args = [
			'plugin_logo'        => KADENCE_BLOCKS_URL . 'includes/settings/img/kadence-logo.png',
			'plugin_logo_width'  => 50,
			'plugin_logo_height' => 50,
			'plugin_logo_alt'    => 'KadenceWP Logo',
			'uninstall_reasons'  => [
				[
					'uninstall_reason_id' => 'confusing',
					'uninstall_reason'    => __( 'I couldn\'t understand how to make it work.', 'kadence-blocks' ),
					'show_comment'        => false,
				],
				[
					'uninstall_reason_id' => 'better-plugin',
					'uninstall_reason'    => __( 'I found a better plugin.', 'kadence-blocks' ),
					'show_comment'        => false,
				],
				[
					'uninstall_reason_id' => 'no-feature',
					'uninstall_reason'    => __( 'I need a specific feature kadence blocks doesn\'t provide.', 'kadence-blocks' ),
					'show_comment'        => true,
				],
				[
					'uninstall_reason_id' => 'broken',
					'uninstall_reason'    => __( 'Something is broken.', 'kadence-blocks' ),
					'show_comment'        => false,
				],
				[
					'uninstall_reason_id' => 'other',
					'uninstall_reason'    => __( 'Other', 'kadence-blocks' ),
					'show_comment'        => true,
				],
			],
		];
		$args = wp_parse_args( $args, $default_args );
		return $args;
	}
	/**
	 * Filter the optin notice args.
	 *
	 * @param array $default_args the optin args.
	 */
	public function optin_notice_args( $default_args ) {
		$args = [
			'plugin_logo'        => KADENCE_BLOCKS_URL . 'includes/settings/img/kadence-logo.png',
			'plugin_logo_width'  => 50,
			'plugin_logo_height' => 50,
			'plugin_logo_alt'    => 'KadenceWP Logo',
			'plugin_name'        => 'Kadence Blocks',
			'plugin_slug'        => 'kadence-blocks',
			'permissions_url'    => 'https://www.kadencewp.com/in-app-telemetry/',
			'tos_url'            => 'https://www.kadencewp.com/terms-and-conditions/',
			'privacy_url'        => 'https://www.kadencewp.com/privacy-policy/',
			'heading'            => __( 'Help us make Kadence Blocks even better.', 'kadence-blocks' ),
			'intro'              => sprintf(
				// translators: placeholder: username.
				esc_html__(
					'Hi, %1$s! At KadenceWP, we\'re always looking for more ways to make our products better for you. If you opt into sharing some data on your usage of Kadence Blocks, it helps us identify key areas where we can improve. In return, we\'ll also email helpful articles and guides to get more out of Kadence, WordPress, and more. If you skip this, that\'s okay. Kadence Blocks will work just fine. We hope you love building with Kadence.',
					'kadence-blocks'
				),
				$default_args['user_name']
			),
		];
		$args = wp_parse_args( $args, $default_args );
		return $args;
	}
	/**
	 * Add inline css editor width
	 */
	public function admin_editor_width() {
		if ( apply_filters( 'kadence_blocks_editor_width', $this->show_editor_width() ) ) {
			$editor_widths = get_option( 'kt_blocks_editor_width', [] );
			if ( ( ! isset( $editor_widths['enable_editor_width'] ) || 'true' === $editor_widths['enable_editor_width'] ) && apply_filters( 'kadence_blocks_editor_width', true ) ) {
				if ( isset( $editor_widths['limited_margins'] ) && 'true' === $editor_widths['limited_margins'] ) {
					$add_size = 10;
				} else {
					$add_size = 30;
				}
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
				echo '<style id="kt-block-editor-width">';
				echo 'body.gutenberg-editor-page.kt-editor-width-default .editor-post-title__block,
				body.gutenberg-editor-page.kt-editor-width-default .editor-default-block-appender,
				body.gutenberg-editor-page.kt-editor-width-default .block-editor-block-list__block,
				body.block-editor-page.kt-editor-width-default .wp-block {
					max-width: ' . esc_attr( $default_size ) . ( is_numeric( $default_size ) ? 'px' : '' ) . ';
				}';
				echo 'body.gutenberg-editor-page.kt-editor-width-sidebar .editor-post-title__block,
				body.gutenberg-editor-page.kt-editor-width-sidebar .editor-default-block-appender,
				body.gutenberg-editor-page.kt-editor-width-sidebar .block-editor-block-list__block,
				body.block-editor-page.kt-editor-width-sidebar .wp-block {
					max-width: ' . esc_attr( $sidebar_size ) . 'px;
				}';
				echo 'body.gutenberg-editor-page.kt-editor-width-nosidebar .editor-post-title__block,
				body.gutenberg-editor-page.kt-editor-width-nosidebar .editor-default-block-appender,
				body.gutenberg-editor-page.kt-editor-width-nosidebar .block-editor-block-list__block,
				body.block-editor-page.kt-editor-width-nosidebar .wp-block {
					max-width: ' . esc_attr( $nosidebar_size ) . 'px;
				}';
				echo 'body.gutenberg-editor-page.kt-editor-width-fullwidth .editor-post-title__block,
				body.gutenberg-editor-page.kt-editor-width-fullwidth .editor-default-block-appender,
				body.gutenberg-editor-page.kt-editor-width-fullwidth .block-editor-block-list__block,
				body.block-editor-page.kt-editor-width-fullwidth .wp-block {
					max-width: none;
				}';
				echo 'body.gutenberg-editor-page .block-editor-block-list__layout .block-editor-block-list__block[data-align=wide],
				body.block-editor-page .block-editor-block-list__layout .wp-block[data-align=wide] {
					width: auto;
					max-width: ' . esc_attr( $nosidebar_size + 200 ) . 'px;
				}';

				echo 'body.gutenberg-editor-page .block-editor-block-list__layout .block-editor-block-list__block[data-align=full],
				body.block-editor-page .block-editor-block-list__layout .wp-block[data-align=full] {
					max-width: none;
				}';
				echo '</style>';
				echo '<script> var kt_blocks_sidebar_size = ' . esc_attr( $sidebar_size ) . '; var kt_blocks_nosidebar_size = ' . esc_attr( $nosidebar_size ) . '; var kt_blocks_default_size = ' . esc_attr( $jssize ) . ';</script>';
			}
		}
	}
	/**
	 * Register Meta for blocks width
	 */
	public function init_post_meta() {
		if ( apply_filters( 'kadence_blocks_editor_width', $this->show_editor_width() ) ) {
			register_post_meta(
				'',
				'kt_blocks_editor_width',
				[
					'show_in_rest' => true,
					'single'       => true,
					'type'         => 'string',
				]
			);
		}
	}
	/**
	 * Load Gutenberg Palette in editor.
	 *
	 * @param array $settings The settings.
	 */
	public function load_color_palette_editor_settings( $settings ) {

		$palette = json_decode( get_option( 'kadence_blocks_colors' ), true );
		if ( isset( $palette['palette'] ) && is_array( $palette['palette'] ) ) {
			$san_palette = [];
			foreach ( $palette['palette'] as $item ) {
				$san_palette[] = [
					'color' => $item['color'],
					'name'  => $item['name'],
					'slug'  => $item['slug'],
				];
			}
			if ( isset( $san_palette[0] ) ) {
				if ( ( isset( $palette['override'] ) && true !== $palette['override'] ) || ! isset( $palette['override'] ) ) {
					$theme_palette = get_theme_support( 'editor-color-palette' );
					if ( isset( $settings['colors'] ) && is_array( $settings['colors'] ) ) {
						$newpalette = array_merge( $settings['colors'], $san_palette );
						$newpalette = array_values( array_map( 'unserialize', array_unique( array_map( 'serialize', $newpalette ) ) ) );
					} else {
						$default_palette = [
							[
								'name'  => __( 'Pale pink', 'kadence-blocks' ),
								'slug'  => 'pale-pink',
								'color' => '#f78da7',
							],
							[
								'name'  => __( 'Vivid red', 'kadence-blocks' ),
								'slug'  => 'vivid-red',
								'color' => '#cf2e2e',
							],
							[
								'name'  => __( 'Luminous vivid orange', 'kadence-blocks' ),
								'slug'  => 'luminous-vivid-orange',
								'color' => '#ff6900',
							],
							[
								'name'  => __( 'Luminous vivid amber', 'kadence-blocks' ),
								'slug'  => 'luminous-vivid-amber',
								'color' => '#fcb900',
							],
							[
								'name'  => __( 'Light green cyan', 'kadence-blocks' ),
								'slug'  => 'light-green-cyan',
								'color' => '#7bdcb5',
							],
							[
								'name'  => __( 'Vivid green cyan', 'kadence-blocks' ),
								'slug'  => 'vivid-green-cyan',
								'color' => '#00d084',
							],
							[
								'name'  => __( 'Pale cyan blue', 'kadence-blocks' ),
								'slug'  => 'pale-cyan-blue',
								'color' => '#8ed1fc',
							],
							[
								'name'  => __( 'Vivid cyan blue', 'kadence-blocks' ),
								'slug'  => 'vivid-cyan-blue',
								'color' => '#0693e3',
							],
							[
								'name'  => __( 'Very light gray', 'kadence-blocks' ),
								'slug'  => 'very-light-gray',
								'color' => '#eeeeee',
							],
							[
								'name'  => __( 'Cyan bluish gray', 'kadence-blocks' ),
								'slug'  => 'cyan-bluish-gray',
								'color' => '#abb8c3',
							],
							[
								'name'  => __( 'Very dark gray', 'kadence-blocks' ),
								'slug'  => 'very-dark-gray',
								'color' => '#313131',
							],
						];
						$newpalette      = array_values( array_merge( $default_palette, $san_palette ) );
					}
				} else {
					$newpalette = array_values( $san_palette );
				}
				$settings['colors'] = $newpalette;
				if ( function_exists( 'get_block_editor_settings' ) ) {
					if ( isset( $settings['__experimentalFeatures']['color']['palette']['theme'] ) && is_array( $settings['__experimentalFeatures']['color']['palette']['theme'] ) ) {
						$newpalette = array_merge( $settings['__experimentalFeatures']['color']['palette']['theme'], $san_palette );
						$newpalette = array_values( array_map( 'unserialize', array_unique( array_map( 'serialize', $newpalette ) ) ) );
					}
					$settings['__experimentalFeatures']['color']['palette']['theme'] = $newpalette;
				}
			}
		}

		return $settings;
	}
	/**
	 * Load Gutenberg Palette
	 */
	public function load_color_palette() {
		$palette = json_decode( get_option( 'kadence_blocks_colors' ) );
		if ( $palette && is_object( $palette ) && isset( $palette->palette ) && is_array( $palette->palette ) ) {
			$san_palette = [];
			foreach ( $palette->palette as $item ) {
				$san_palette[] = [
					'color' => $item->color,
					'name'  => $item->name,
					'slug'  => $item->slug,
				];
			}
			if ( isset( $san_palette[0] ) ) {
				if ( ( isset( $palette->override ) && true !== $palette->override ) || ! isset( $palette->override ) ) {
					$theme_palette = get_theme_support( 'editor-color-palette' );
					if ( is_array( $theme_palette ) ) {
						$newpalette = array_merge( reset( $theme_palette ), $san_palette );
					} else {
						$default_palette = [
							[
								'name'  => __( 'Pale pink', 'kadence-blocks' ),
								'slug'  => 'pale-pink',
								'color' => '#f78da7',
							],
							[
								'name'  => __( 'Vivid red', 'kadence-blocks' ),
								'slug'  => 'vivid-red',
								'color' => '#cf2e2e',
							],
							[
								'name'  => __( 'Luminous vivid orange', 'kadence-blocks' ),
								'slug'  => 'luminous-vivid-orange',
								'color' => '#ff6900',
							],
							[
								'name'  => __( 'Luminous vivid amber', 'kadence-blocks' ),
								'slug'  => 'luminous-vivid-amber',
								'color' => '#fcb900',
							],
							[
								'name'  => __( 'Light green cyan', 'kadence-blocks' ),
								'slug'  => 'light-green-cyan',
								'color' => '#7bdcb5',
							],
							[
								'name'  => __( 'Vivid green cyan', 'kadence-blocks' ),
								'slug'  => 'vivid-green-cyan',
								'color' => '#00d084',
							],
							[
								'name'  => __( 'Pale cyan blue', 'kadence-blocks' ),
								'slug'  => 'pale-cyan-blue',
								'color' => '#8ed1fc',
							],
							[
								'name'  => __( 'Vivid cyan blue', 'kadence-blocks' ),
								'slug'  => 'vivid-cyan-blue',
								'color' => '#0693e3',
							],
							[
								'name'  => __( 'Very light gray', 'kadence-blocks' ),
								'slug'  => 'very-light-gray',
								'color' => '#eeeeee',
							],
							[
								'name'  => __( 'Cyan bluish gray', 'kadence-blocks' ),
								'slug'  => 'cyan-bluish-gray',
								'color' => '#abb8c3',
							],
							[
								'name'  => __( 'Very dark gray', 'kadence-blocks' ),
								'slug'  => 'very-dark-gray',
								'color' => '#313131',
							],
						];
						$newpalette      = array_merge( $default_palette, $san_palette );
					}
				} else {
					$newpalette = $san_palette;
				}
				add_theme_support( 'editor-color-palette', $newpalette );
				add_action( 'wp_head', [ $this, 'print_gutenberg_style' ], 8 );
				add_action( 'admin_print_styles', [ $this, 'print_gutenberg_style' ], 21 );
			}
		}
	}
	/**
	 * Print Gutenberg Palette Styles
	 */
	public function print_gutenberg_style() {
		if ( is_admin() ) {
			$screen = get_current_screen();
			if ( ! $screen || ! $screen->is_block_editor() ) {
				return;
			}
		}
		$palette = json_decode( get_option( 'kadence_blocks_colors' ) );
		if ( $palette && is_object( $palette ) && isset( $palette->palette ) && is_array( $palette->palette ) ) {
			$san_palette = [];
			foreach ( $palette->palette as $item ) {
				$san_palette[] = [
					'color' => $item->color,
					'name'  => $item->name,
					'slug'  => $item->slug,
				];
			}
			if ( isset( $san_palette[0] ) ) {
				echo '<style id="kadence_blocks_palette_css">';
				foreach ( $san_palette as $set ) {
					$slug  = $set['slug'];
					$color = $set['color'];
					echo ':root .has-' . esc_attr( $slug ) . '-color{color:' . esc_attr( $color ) . '}:root .has-' . esc_attr( $slug ) . '-background-color{background-color:' . esc_attr( $color ) . '}';
				}
				echo '</style>';
			}
		}
	}
	/**
	 * Redirect to the settings page on activation
	 */
	public function activation_redirect() {
		if ( get_option( 'kadence_blocks_redirect_on_activation', false ) ) {
			delete_option( 'kadence_blocks_redirect_on_activation' );
			// @todo add admin notice for optional data share.
		}
	}
	/**
	 * Redirect to the settings page on activation.
	 *
	 * @param string $key setting key.
	 */
	public static function get_data_options( $key ) {
		if ( ! isset( self::$settings[ $key ] ) ) {
			self::$settings[ $key ] = get_option( $key, [] );
		}
		return self::$settings[ $key ];
	}
	/**
	 * Deregister Blocks.
	 */
	public function deregister_blocks() {
		// Scripts.
		$options = get_option( 'kt_blocks_unregistered_blocks' );
		if ( isset( $options['kadence/advnacedgallery'] ) ) {
			unset( $options['kadence/advnacedgallery'] );
			update_option( 'kt_blocks_unregistered_blocks', $options );
		}
		// Don't need to unregister a block that is not loaded.
		if ( ! class_exists( 'woocommerce' ) && is_array( $options ) ) {
			if ( in_array( 'kadence/productcarousel', $options, true ) ) {
				foreach ( $options as $key => $block ) {
					if ( $block === 'kadence/productcarousel' ) {
						unset( $options[ $key ] );
					}
				}
			}
		}
		if ( $options ) {
			wp_enqueue_script( 'kadence-blocks-deregister-js', KADENCE_BLOCKS_URL . 'includes/assets/js/admin-blocks-deregister.min.js', [ 'wp-blocks' ], KADENCE_BLOCKS_VERSION, true );
			wp_localize_script(
				'kadence-blocks-deregister-js',
				'kt_deregister_params',
				[
					'deregister' => $options,
				]
			);
		}
	}
	/**
	 * Returns a base64 URL for the SVG for use in the menu.
	 *
	 * @param  bool $base64 Whether or not to return base64-encoded SVG.
	 * @return string
	 */
	private function get_icon_svg( $base64 = true ) {
		$svg = apply_filters( 'kadence_blocks_admin_svg_icon', '<svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#a7aaad" d="M14.678,2.315l1.322,-0l0,11.941l-14.678,0l0,-1.282l-1.322,0l0,-11.942l14.678,0l0,1.283Zm-12.789,0.566l-0,10.809l13.545,-0l-0,-10.809l-13.545,0Zm12.222,-0.566l-12.789,-0l-0,10.092l-0.756,0l-0,-10.809l13.545,0l0,0.717Zm-0.624,9.564l-4.389,0c-0.22,0 -0.398,-0.177 -0.398,-0.394c0,-0.218 0.178,-0.395 0.398,-0.395l1.324,0c0.207,-0.014 0.37,-0.185 0.37,-0.393c0,-0.218 -0.178,-0.395 -0.397,-0.395l-2.073,0c-0.219,0 -0.397,-0.176 -0.397,-0.394c0,-0.217 0.178,-0.394 0.397,-0.394l0.622,0c0.219,0 0.397,-0.176 0.397,-0.394c0,-0.217 -0.178,-0.393 -0.397,-0.393l-2.898,-0.001c-0.219,0 -0.397,-0.176 -0.397,-0.394c0,-0.217 0.178,-0.393 0.397,-0.393l1.962,0l0,-0.001l0.768,0c0.219,0 0.397,-0.177 0.397,-0.394c0,-0.217 -0.178,-0.393 -0.397,-0.393l-0.991,0c-0.219,0 -0.397,-0.177 -0.397,-0.394c0,-0.218 0.178,-0.394 0.397,-0.394l1.884,0c0.01,0 0.019,0 0.028,0.001l0.673,0c0.22,0 0.398,-0.177 0.398,-0.395c0,-0.217 -0.178,-0.394 -0.398,-0.394l-0.989,0c-0.206,-0.015 -0.369,-0.185 -0.369,-0.393c0,-0.218 0.178,-0.395 0.398,-0.395l3.402,0l-3.221,3.488l3.896,3.604Zm-6.178,-0.789c0.219,0 0.396,0.176 0.396,0.393c0,0.217 -0.177,0.393 -0.396,0.393l-1.455,0c-0.218,0 -0.396,-0.176 -0.396,-0.393c0,-0.217 0.178,-0.393 0.396,-0.393l1.455,0Zm-0.576,-1.576c0.219,0 0.398,0.177 0.398,0.395c0,0.217 -0.179,0.394 -0.398,0.394c-0.219,0 -0.398,-0.177 -0.398,-0.394c0,-0.218 0.179,-0.395 0.398,-0.395Zm-2.077,-1.575c0.219,0 0.397,0.176 0.397,0.394c0,0.218 -0.178,0.394 -0.397,0.394c-0.22,0 -0.398,-0.176 -0.398,-0.394c0,-0.218 0.178,-0.394 0.398,-0.394Zm1.54,-1.576c0.22,0 0.398,0.177 0.398,0.394c0,0.218 -0.178,0.394 -0.398,0.394c-0.219,0 -0.397,-0.176 -0.397,-0.394c0,-0.217 0.178,-0.394 0.397,-0.394Zm1.426,-1.576c0.219,0 0.397,0.176 0.397,0.393c0,0.217 -0.178,0.393 -0.397,0.393l-0.919,0c-0.219,0 -0.397,-0.176 -0.397,-0.393c0,-0.217 0.178,-0.393 0.397,-0.393l0.919,0Z"/></svg>' );

		if ( $base64 ) {
			return 'data:image/svg+xml;base64,' . base64_encode( $svg );
		}

		return $svg;
	}
	/**
	 * Allow settings visibility to be changed.
	 */
	public function settings_user_capabilities() {
		return apply_filters( 'kadence_blocks_admin_settings_capability', 'edit_pages' );
	}
	/**
	 * Add option page menu
	 */
	public function add_network_menu() {
		$network_enabled = kadence_blocks_is_network_authorize_enabled();
		if ( $network_enabled && function_exists( 'is_plugin_active_for_network' ) && is_plugin_active_for_network( 'kadence-blocks/kadence-blocks.php' ) ) {
			add_menu_page( __( 'Kadence Blocks - Gutenberg Page Builder Blocks', 'kadence-blocks' ), __( 'Kadence', 'kadence-blocks' ), $this->settings_user_capabilities(), 'kadence-blocks-home', null, $this->get_icon_svg() );
			$home_page = add_submenu_page( 'kadence-blocks', __( 'Kadence Blocks', 'kadence-blocks' ), __( 'Home', 'kadence-blocks' ), $this->settings_user_capabilities(), 'kadence-blocks-home', [ $this, 'home_page' ], 0 );
			add_action( 'admin_print_styles-' . $home_page, [ $this, 'home_scripts' ] );
		}
	}
	/**
	 * Add option page menu
	 */
	public function add_menu() {
		add_menu_page( __( 'Kadence Blocks - Gutenberg Page Builder Blocks', 'kadence-blocks' ), __( 'Kadence', 'kadence-blocks' ), $this->settings_user_capabilities(), 'kadence-blocks', null, $this->get_icon_svg() );
		$home_page = add_submenu_page( 'kadence-blocks', __( 'Kadence Blocks', 'kadence-blocks' ), __( 'Home', 'kadence-blocks' ), $this->settings_user_capabilities(), 'kadence-blocks-home', [ $this, 'home_page' ], 0 );
		$page      = add_submenu_page( 'kadence-blocks', __( 'Kadence Blocks -  Gutenberg Page Builder Blocks', 'kadence-blocks' ), __( 'Settings', 'kadence-blocks' ), $this->settings_user_capabilities(), 'kadence-blocks', [ $this, 'config_page' ], 1 );
		add_action( 'admin_print_styles-' . $home_page, [ $this, 'home_scripts' ] );
		add_action( 'admin_print_styles-' . $page, [ $this, 'scripts' ] );
	}
	/**
	 * Loads admin style sheets and scripts
	 */
	public function scripts() {
		$texts    = [
			'close'    => __( 'Close', 'kadence-blocks' ),
			'save'     => __( 'Save', 'kadence-blocks' ),
			'updating' => __( 'Updating', 'kadence-blocks' ),
			'updated'  => __( 'Updated', 'kadence-blocks' ),
			'config'   => __( 'Config', 'kadence-blocks' ),
			'settings' => __( 'Default Settings', 'kadence-blocks' ),
		];
		$settings = [
			'kadence/spacer'          => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/rowlayout'       => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/advancedbtn'     => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/infobox'         => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/accordion'       => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/tabs'            => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/iconlist'        => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/testimonials'    => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/advancedheading' => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
			'kadence/icon'            => [
				'moved' => [
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				],
			],
		];
		wp_enqueue_style( 'kadence-blocks-admin-css', KADENCE_BLOCKS_URL . 'includes/assets/css/admin-dashboard.min.css', [ 'wp-jquery-ui-dialog', 'wp-color-picker' ], KADENCE_BLOCKS_VERSION, 'all' );
		wp_enqueue_script( 'kadence-blocks-admin-js', KADENCE_BLOCKS_URL . 'includes/assets/js/admin-scripts.min.js', [ 'jquery', 'jquery-ui-dialog', 'wp-color-picker' ], KADENCE_BLOCKS_VERSION, true );
		wp_localize_script(
			'kadence-blocks-admin-js',
			'kt_blocks_params',
			[
				'ajaxurl'             => admin_url( 'admin-ajax.php' ),
				'wpnonce'             => wp_create_nonce( 'kadence-blocks-manage' ),
				'blockConfig'         => get_option( 'kt_blocks_config_blocks' ),
				'blockConfigSettings' => $settings,
				'texts'               => $texts,
			]
		);
	}
	/**
	 * Loads admin style sheets and scripts
	 */
	public function home_scripts() {
		$using_network_enabled = false;
		$is_network_admin      = is_multisite() && is_network_admin() ? true : false;
		$network_enabled       = kadence_blocks_is_network_authorize_enabled();
		if ( $network_enabled && function_exists( 'is_plugin_active_for_network' ) && is_plugin_active_for_network( 'kadence-blocks/kadence-blocks.php' ) ) {
			$using_network_enabled = true;
		}
		$token          = get_authorization_token( 'kadence-blocks' );
		$auth_url       = build_auth_url( apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ), get_license_domain() );
		$license_key    = kadence_blocks_get_current_license_key();
		$disconnect_url = '';
		$is_authorized  = false;
		if ( ! empty( $license_key ) && ! kadence_blocks_is_ai_disabled() ) {
			$is_authorized = is_authorized( $license_key, 'kadence-blocks', ( ! empty( $token ) ? $token : '' ), get_license_domain() );
		}

		if ( $is_authorized ) {
			$disconnect_url = get_disconnect_url( 'kadence-blocks' );
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
		$kadence_home_meta = kadence_blocks_get_asset_file( 'dist/admin-kadence-home' );
		wp_enqueue_script( 'admin-kadence-home', KADENCE_BLOCKS_URL . 'dist/admin-kadence-home.js', $kadence_home_meta['dependencies'], $kadence_home_meta['version'], true );
		wp_enqueue_style( 'admin-kadence-home', KADENCE_BLOCKS_URL . 'dist/admin-kadence-home.css', [ 'wp-edit-blocks', 'kadence-components' ], $kadence_home_meta['version'] );
		wp_localize_script(
			'admin-kadence-home',
			'kadenceHomeParams',
			[
				'ajaxurl'          => admin_url( 'admin-ajax.php' ),
				'wpnonce'          => wp_create_nonce( 'kadence-blocks-manage' ),
				'site_name'        => sanitize_title( get_bloginfo( 'name' ) ),
				'pSlug'            => apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ),
				'isAIDisabled'     => kadence_blocks_is_ai_disabled(),
				'pVersion'         => KADENCE_BLOCKS_VERSION,
				'isAuthorized'     => $is_authorized,
				'licenseKey'       => $license_key,
				'authUrl'          => esc_url( $auth_url ),
				'disconnectUrl'    => esc_url( $disconnect_url ),
				'pro'              => ( class_exists( 'Kadence_Blocks_Pro' ) ? 'true' : 'false' ),
				'apiKey'           => $license_key,
				'isNetworkAdmin'   => $is_network_admin,
				'isNetworkEnabled' => $using_network_enabled,
			]
		);
		wp_set_script_translations( 'admin-kadence-home', 'kadence-blocks' );
		wp_enqueue_style( 'kadence-blocks-admin-css', KADENCE_BLOCKS_URL . 'includes/assets/css/admin-dashboard.min.css', [ 'wp-jquery-ui-dialog', 'wp-color-picker' ], KADENCE_BLOCKS_VERSION, 'all' );
		wp_enqueue_media();
	}
	/**
	 * Register settings
	 */
	public function load_api_settings() {

		register_setting(
			'kadence_blocks_config_blocks',
			'kadence_blocks_config_blocks',
			[
				'type'              => 'string',
				'description'       => __( 'Config Kadence Block Defaults', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_settings_blocks',
			'kadence_blocks_settings_blocks',
			[
				'type'              => 'string',
				'description'       => __( 'Config Kadence Block visibility settings', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_settings',
			'kadence_blocks_settings',
			[
				'type'              => 'string',
				'description'       => __( 'Config Kadence Block Settings', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_prophecy',
			'kadence_blocks_prophecy',
			[
				'type'              => 'string',
				'description'       => __( 'Config Kadence Block Prophecy AI', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_colors',
			'kadence_blocks_colors',
			[
				'type'              => 'string',
				'description'       => __( 'Config Kadence Blocks Color Palette', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_global',
			'kadence_blocks_global',
			[
				'type'              => 'string',
				'description'       => __( 'Config Kadence Blocks Global Settings', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_recaptcha_site_key',
			'kadence_blocks_recaptcha_site_key',
			[
				'type'              => 'string',
				'description'       => __( 'Google reCaptcha Site Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_recaptcha_secret_key',
			'kadence_blocks_recaptcha_secret_key',
			[
				'type'              => 'string',
				'description'       => __( 'Google reCaptcha Secret Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_recaptcha_language',
			'kadence_blocks_recaptcha_language',
			[
				'type'              => 'string',
				'description'       => __( 'Google reCaptcha Language', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_turnstile_site_key',
			'kadence_blocks_turnstile_site_key',
			[
				'type'              => 'string',
				'description'       => __( 'Cloudflare Turnstile Site Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_turnstile_secret_key',
			'kadence_blocks_turnstile_secret_key',
			[
				'type'              => 'string',
				'description'       => __( 'Cloudflare Turnstile Secret Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_hcaptcha_site_key',
			'kadence_blocks_hcaptcha_site_key',
			[
				'type'              => 'string',
				'description'       => __( 'hCaptcha Turnstile Site Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_hcaptcha_secret_key',
			'kadence_blocks_hcaptcha_secret_key',
			[
				'type'              => 'string',
				'description'       => __( 'hCaptcha Secret Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_mailerlite_api',
			'kadence_blocks_mailerlite_api',
			[
				'type'              => 'string',
				'description'       => __( 'MailerLite API Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_google_maps_api',
			'kadence_blocks_google_maps_api',
			[
				'type'              => 'string',
				'description'       => __( 'Google Maps API Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_cloud',
			'kadence_blocks_cloud',
			[
				'type'              => 'string',
				'description'       => __( 'Config Kadence Blocks Cloud', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_header_notice_dismissed',
			'kadence_blocks_header_notice_dismissed',
			[
				'type'              => 'boolean',
				'description'       => __( 'Is Kadence header notice dismissed', 'kadence-blocks' ),
				'sanitize_callback' => 'rest_sanitize_boolean',
				'show_in_rest'      => true,
				'default'           => false,
			]
		);
		register_setting(
			'kadence_blocks_wire_subscribe',
			'kadence_blocks_wire_subscribe',
			[
				'type'              => 'boolean',
				'description'       => __( 'Subscribe to Wireframe library', 'kadence-blocks' ),
				'sanitize_callback' => 'rest_sanitize_boolean',
				'show_in_rest'      => true,
				'default'           => false,
			]
		);
		register_setting(
			'kadence_blocks_convertkit_api',
			'kadence_blocks_convertkit_api',
			[
				'type'              => 'string',
				'description'       => __( 'ConvertKit API Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_activecampaign_api_key',
			'kadence_blocks_activecampaign_api_key',
			[
				'type'              => 'string',
				'description'       => __( 'ConvertKit API Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_activecampaign_api_base',
			'kadence_blocks_activecampaign_api_base',
			[
				'type'              => 'string',
				'description'       => __( 'ConvertKit API Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			]
		);
		register_setting(
			'kadence_blocks_header_popover_tutorial_complete',
			'kadence_blocks_header_popover_tutorial_complete',
			[
				'type'              => 'boolean',
				'description'       => __( 'Mark the Header popover tutorial Complete', 'kadence-blocks' ),
				'sanitize_callback' => 'rest_sanitize_boolean',
				'show_in_rest'      => true,
				'default'           => false,
			]
		);
	}
	/**
	 * Register settings
	 */
	public function load_settings() {

		register_setting( 'kt_blocks_editor_width', 'kt_blocks_editor_width', [ $this, 'validate_options' ] );

		// Sidebar and No sidebar Max widths.
		add_settings_section( 'kt_blocks_editor_width_sec', '', [ $this, 'maxwidths_callback' ], 'kt_blocks_editor_width_section' );
		add_settings_field( 'sidebar', __( 'Small Template', 'kadence-blocks' ), [ $this, 'sidebar_callback' ], 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		add_settings_field( 'nosidebar', __( 'Large Template', 'kadence-blocks' ), [ $this, 'nosidebar_callback' ], 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		// Defaults for Pages and posts.
		add_settings_field( 'post_default', __( 'Post default', 'kadence-blocks' ), [ $this, 'post_default_callback' ], 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		add_settings_field( 'page_default', __( 'Page Default', 'kadence-blocks' ), [ $this, 'page_default_callback' ], 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		// add_settings_field( 'limited_margins', __( 'Enable Less Margin CSS', 'kadence-blocks' ), array( $this, 'limited_margins_callback' ), 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		add_settings_field( 'enable_editor_width', __( 'Enable Editor Width', 'kadence-blocks' ), [ $this, 'enabled_editor_width_callback' ], 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );

		if ( ! defined( 'KADENCE_VERSION' ) ) {
			register_setting( 'kadence_blocks_font_settings', 'kadence_blocks_font_settings', [ $this, 'validate_options' ] );
			add_settings_section( 'kt_blocks_fonts_sec', '', [ $this, 'fonts_local_callback' ], 'kt_blocks_fonts_section' );
			add_settings_field( 'load_fonts_local', __( 'Load Google Fonts Locally', 'kadence-blocks' ), [ $this, 'load_fonts_local_callback' ], 'kt_blocks_fonts_section', 'kt_blocks_fonts_sec' );
		}
	}
	/**
	 * Outputs Sidebar number field
	 */
	public function enabled_editor_width_callback() {
		$data            = self::get_data_options( 'kt_blocks_editor_width' );
		$default_enabled = ( $data['enable_editor_width'] ?? 'true' );
		echo '<p>' . esc_html__( 'Allows for changes to the editor width on per page/post basis with preset defaults.', 'kadence-blocks' ) . '<p>';
		echo '<select class="kt-blocks-enable-editor-width kt-editor-width-defaults-select" name="kt_blocks_editor_width[enable_editor_width]">';
			echo '<option value="false" ' . ( 'false' === $default_enabled ? 'selected' : '' ) . '>' . esc_html__( 'False', 'kadence-blocks' ) . '</option>';
			echo '<option value="true" ' . ( 'true' === $default_enabled ? 'selected' : '' ) . '>' . esc_html__( 'True', 'kadence-blocks' ) . '</option>';
		echo '</select>';
	}

	/**
	 * Outputs Limited Margins Field
	 */
	public function limited_margins_callback() {
		$data            = self::get_data_options( 'kt_blocks_editor_width' );
		$default_limited = ( $data['limited_margins'] ?? 'false' );
		echo '<p>' . esc_html__( 'Experimental editor CSS for less excess margins in Gutenberg in an attempt to get a closer WYSIWYG editing experience.', 'kadence-blocks' ) . '<p>';
		echo '<select class="kt-blocks-limited-margins kt-editor-width-defaults-select" name="kt_blocks_editor_width[limited_margins]">';
			echo '<option value="false" ' . ( 'false' === $default_limited ? 'selected' : '' ) . '>' . esc_html__( 'False', 'kadence-blocks' ) . '</option>';
			echo '<option value="true" ' . ( 'true' === $default_limited ? 'selected' : '' ) . '>' . esc_html__( 'True', 'kadence-blocks' ) . '</option>';
		echo '</select>';
	}

	/**
	 * Outputs Sidebar number field
	 */
	public function sidebar_callback() {
		$data    = self::get_data_options( 'kt_blocks_editor_width' );
		$default = apply_filters( 'kadence_blocks_default_small_editor_width', '750' );
		echo "<input id='kt-sidebar-max' name='kt_blocks_editor_width[sidebar]' size='25' type='number' value='" . ( isset( $data['sidebar'] ) ? esc_attr( $data['sidebar'] ) : esc_attr( $default ) ) . "' />";
		echo '<span class="kt-sub-input-description">' . esc_html__( 'px', 'kadence-blocks' ) . '</span>';
	}

	/**
	 * Outputs no sidebar number field
	 */
	public function nosidebar_callback() {
		$data    = self::get_data_options( 'kt_blocks_editor_width' );
		$default = apply_filters( 'kadence_blocks_default_large_editor_width', '1140' );
		echo "<input id='kt-sidebar-max' name='kt_blocks_editor_width[nosidebar]' size='25' type='number' value='" . ( isset( $data['nosidebar'] ) ? esc_attr( $data['nosidebar'] ) : esc_attr( $default ) ) . "' />";
		echo '<span class="kt-sub-input-description">' . esc_html__( 'px', 'kadence-blocks' ) . '</span>';
	}

	/**
	 * Outputs post default select feild
	 */
	public function post_default_callback() {
		$data              = self::get_data_options( 'kt_blocks_editor_width' );
		$default_post_type = ( $data['post_default'] ?? 'sidebar' );
		echo '<select class="kt-blocks-posts-defaults kt-editor-width-defaults-select" name="kt_blocks_editor_width[post_default]">';
			echo '<option value="sidebar" ' . ( 'sidebar' === $default_post_type ? 'selected' : '' ) . '>' . esc_html__( 'Small', 'kadence-blocks' ) . '</option>';
			echo '<option value="nosidebar" ' . ( 'nosidebar' === $default_post_type ? 'selected' : '' ) . '>' . esc_html__( 'Large', 'kadence-blocks' ) . '</option>';
			echo '<option value="fullwidth" ' . ( 'fullwidth' === $default_post_type ? 'selected' : '' ) . '>' . esc_html__( 'Fullwidth', 'kadence-blocks' ) . '</option>';
		echo '</select>';
	}

	/**
	 * Outputs post default select feild
	 */
	public function page_default_callback() {
		$data              = self::get_data_options( 'kt_blocks_editor_width' );
		$default_page_type = ( $data['page_default'] ?? 'sidebar' );
		echo '<select class="kt-blocks-posts-defaults kt-editor-width-defaults-select" name="kt_blocks_editor_width[page_default]">';
			echo '<option value="sidebar" ' . ( 'sidebar' === $default_page_type ? 'selected' : '' ) . '>' . esc_html__( 'Small', 'kadence-blocks' ) . '</option>';
			echo '<option value="nosidebar" ' . ( 'nosidebar' === $default_page_type ? 'selected' : '' ) . '>' . esc_html__( 'Large', 'kadence-blocks' ) . '</option>';
			echo '<option value="fullwidth" ' . ( 'fullwidth' === $default_page_type ? 'selected' : '' ) . '>' . esc_html__( 'Fullwidth', 'kadence-blocks' ) . '</option>';
		echo '</select>';
	}

	/**
	 * Outputs font settings field
	 */
	public function load_fonts_local_callback() {
		$data    = self::get_data_options( 'kadence_blocks_font_settings' );
		$default = ( $data['load_fonts_local'] ?? 'false' );
		echo '<select class="kt-blocks-limited-margins kt-editor-width-defaults-select" name="kadence_blocks_font_settings[load_fonts_local]">';
			echo '<option value="false" ' . ( 'false' === $default ? 'selected' : '' ) . '>' . esc_html__( 'False', 'kadence-blocks' ) . '</option>';
			echo '<option value="true" ' . ( 'true' === $default ? 'selected' : '' ) . '>' . esc_html__( 'True', 'kadence-blocks' ) . '</option>';
		echo '</select>';
	}

	/**
	 * Outputs title for content width.
	 */
	public function maxwidths_callback() {
		// global $content_width;
		// echo '<h5 class="kt-main-subtitle">' . esc_html__( 'Assign Editor Template Max Widths', 'kadence-blocks' ) . '</h5>';
		// echo '<div class="kt-main-description-notice">' . esc_html__( 'Note: The current active themes "$content_width" is set to:', 'kadence-blocks' ) . ' ' . esc_html( $content_width ) . 'px</div>';
	}

	/**
	 * Outputs title for fonts local.
	 */
	public function fonts_local_callback() {
	}
	/**
	 * Sanitizes and validates all input and output for Dashboard.
	 *
	 * @param array $input settings input.
	 */
	public function validate_options( $input ) {
		return $input;
	}

	/**
	 * Checks for kadence classic themes when returning defualt.
	 */
	public function show_editor_width() {
		if ( is_null( self::$editor_width ) ) {
			$show                   = false;
			$current_theme          = wp_get_theme();
			$current_theme_name     = $current_theme->get( 'Name' );
			$current_theme_template = $current_theme->get( 'Template' );
			// Check for a kadence classic theme support.
			if ( 'Pinnacle' == $current_theme_name || 'pinnacle' == $current_theme_template || 'Pinnacle Premium' == $current_theme_name || 'pinnacle_premium' == $current_theme_template || 'Ascend - Premium' == $current_theme_name || 'ascend_premium' == $current_theme_template || 'Ascend' == $current_theme_name || 'ascend' == $current_theme_template || 'Virtue - Premium' == $current_theme_name || 'virtue_premium' == $current_theme_template || 'Virtue' == $current_theme_name || 'virtue' == $current_theme_template ) {
				$show = true;
			}
			self::$editor_width = $show;
		}
		return self::$editor_width;
	}
	/**
	 * Loads config page
	 */
	public function home_page() {
		do_action( 'stellarwp/telemetry/kadence-blocks/optin' );
		?>
		<div class="wrap kadence_blocks_dash">
			<div class="kadence_blocks_dash_head_container">
				<h2 class="notices" style="display:none;"></h2>
				<div class="kadence_blocks_dash_wrap">
					<?php do_action( 'kadence_blocks_admin_before_home' ); ?>
					<div class="kadence_blocks_home_main">
					</div>
					<?php do_action( 'kadence_blocks_admin_after_home' ); ?>
				</div>
			</div>
		</div>
		<?php
	}
	/**
	 * Loads config page
	 */
	public function config_page() {
		do_action( 'stellarwp/telemetry/kadence-blocks/optin' );
		?>
		<div class="kadence_blocks_dash_head">
			<div class="kadence_blocks_dash_head_container">
				<div class="kadence_blocks_dash_logo">
					<img src="<?php echo esc_url( apply_filters( 'kadence_blocks_dash_logo', KADENCE_BLOCKS_URL . 'includes/settings/img/kadence-logo.png' ) ); ?>" alt="Kadence WP">
				</div>
				<div class="kadence_blocks_dash_version">
					<span>
						<?php echo esc_html( apply_filters( 'kadence_blocks_brand_name', 'Kadence Blocks' ) ) . ' ' . esc_html( KADENCE_BLOCKS_VERSION ); ?>
					</span>
				</div>
			</div>
		</div>
		<div class="wrap kadence_blocks_dash">
			<div class="kadence_blocks_dashboard">
				<h2 class="notices" style="display:none;"></h2>
				<?php settings_errors(); ?>
				<div class="page-grid">
					<div class="kadence_blocks_dashboard_main">
						<h2 class="section-header"><?php echo esc_html( apply_filters( 'kadence_blocks_brand_name', 'Kadence Blocks' ) ); ?></h2>
						<div class="three-col-grid">
							<?php
							$blocks              = $this->blocks_array();
							$unregistered_blocks = get_option( 'kt_blocks_unregistered_blocks', [] );
							if ( ! is_array( $unregistered_blocks ) ) {
								$unregistered_blocks = [];
							}
							foreach ( $blocks as $block_key => $block ) {
								if ( in_array( $block['slug'], $unregistered_blocks ) ) {
									$btn_enabled_class = 'button-primary kt-block-inactive';
									$enabled_class     = 'kt-block-inactive';
								} else {
									$btn_enabled_class = 'kt-block-active';
									$enabled_class     = 'kt-block-active';
								}
								echo '<div class="kadence_blocks_item ' . esc_attr( $enabled_class ) . '">';
								echo '<h3>' . esc_html( $block['name'] ) . '</h3>';
								echo '<p>' . wp_kses_post( $block['desc'] ) . '</p>';
								echo '<div class="kadence_blocks_item_footer">';
								if ( in_array( $block['slug'], $unregistered_blocks ) ) {
									$btntitle = __( 'Activate', 'kadence-blocks' );
									echo '<a class="kt_block_button button ' . esc_attr( $btn_enabled_class ) . '" data-inactive-label="' . esc_attr__( 'Activate', 'kadence-blocks' ) . '" data-active-label="' . esc_attr__( 'Deactivate', 'kadence-blocks' ) . '" data-activating-label="' . esc_attr__( 'Activating…', 'kadence-blocks' ) . '" data-activated-label="' . esc_attr__( 'Activated', 'kadence-blocks' ) . '"  data-deactivating-label="' . esc_attr__( 'Deactivating…', 'kadence-blocks' ) . '"  data-deactivated-label="' . esc_attr__( 'Deactivated', 'kadence-blocks' ) . '" data-block-slug="' . esc_attr( $block['slug'] ) . '" href="#">' . esc_html( $btntitle ) . '</a>';
								} else {
									$btntitle = __( 'Deactivate', 'kadence-blocks' );
									// echo '<a class="kt_block_button button ' . esc_attr( $btn_enabled_class ) . '" data-inactive-label="' . esc_attr__( 'Activate', 'kadence-blocks' ) . '" data-active-label="' . esc_attr__( 'Deactivate', 'kadence-blocks' ) . '" data-activating-label="' . esc_attr__( 'Activating…', 'kadence-blocks' ) . '" data-activated-label="' . esc_attr__( 'Activated', 'kadence-blocks' ) . '"  data-deactivating-label="' . esc_attr__( 'Deactivating…', 'kadence-blocks' ) . '"  data-deactivated-label="' . esc_attr__( 'Deactivated', 'kadence-blocks' ) . '" data-block-slug="' . esc_attr( $block['slug'] ) . '" href="#">' . esc_html( $btntitle ) . '</a>';
								}
								if ( ! empty( $block['link'] ) && ! empty( $block['linkText'] ) ) {
									echo '<a class="button" href="' . esc_attr( $block['link'] ) . '">' . esc_html( $block['linkText'] ) . '</a>';
								}

								echo '</div>';
								echo '</div>';
							}
							?>
						</div>
						<div class="kt-dashboard-spacer"></div>
						<?php if ( apply_filters( 'kadence_blocks_editor_width', $this->show_editor_width() ) ) { ?>
							<h2><?php echo esc_html__( 'Editor Max Widths', 'kadence-blocks' ); ?></br><small class="kt-main-subtitle"><?php echo esc_html__( 'Match the editor width to your sites width.', 'kadence-blocks' ); ?></small></h2>
							<?php global $content_width; ?>
							<div class="kt-main-description-notice"><?php echo esc_html__( 'Note: The current active themes "content_width" is set to:', 'kadence-blocks' ) . ' ' . esc_html( $content_width ); ?>px</div>
							<div class="kt-promo-row-area">
								<?php
								echo '<form action="options.php" method="post">';
									settings_fields( 'kt_blocks_editor_width' );
									do_settings_sections( 'kt_blocks_editor_width_section' );
									do_settings_sections( 'kt_blocks_editor_defaults_section' );
									submit_button( __( 'Save Changes', 'kadence-blocks' ) );
								echo '</form>';
								?>
							</div>
							<div class="kt-dashboard-spacer"></div>
						<?php } ?>
						<?php if ( apply_filters( 'kadence_blocks_show_local_fonts', ! defined( 'KADENCE_VERSION' ) ) ) { ?>
								<h2><?php echo esc_html__( 'Google Fonts', 'kadence-blocks' ); ?></h2>
								<div class="kt-promo-row-area">
								<?php
								echo '<form action="options.php" method="post">';
									settings_fields( 'kadence_blocks_font_settings' );
									do_settings_sections( 'kt_blocks_fonts_section' );
									submit_button( __( 'Save Changes', 'kadence-blocks' ) );
								echo '</form>';
								?>
							</div>
							<div class="kt-dashboard-spacer"></div>
						<?php } ?>
					</div>
					<div class="side-panel">
						<?php do_action( 'kadence_blocks_dash_side_panel' ); ?>
						<?php if ( apply_filters( 'kadence_blocks_dash_brand_sidebar', true ) ) { ?>
							<?php do_action( 'kadence_blocks_dash_side_panel_pro' ); ?>
							<div class="community-section sidebar-section components-panel">
								<div class="components-panel__body is-opened">
									<h2><?php esc_html_e( 'Web Creators Community', 'kadence-blocks' ); ?></h2>
									<p><?php esc_html_e( 'Join our community of fellow kadence users creating effective websites! Share your site, ask a question and help others.', 'kadence-blocks' ); ?></p>
									<a href="https://www.facebook.com/groups/webcreatorcommunity" target="_blank" class="sidebar-link"><?php esc_html_e( 'Join our Facebook Group', 'kadence-blocks' ); ?></a>
								</div>
							</div>
							<div class="support-section sidebar-section components-panel">
								<div class="components-panel__body is-opened">
									<h2><?php esc_html_e( 'Documentation', 'kadence-blocks' ); ?></h2>
									<p><?php esc_html_e( 'Need help? We have a knowledge base full of articles to get you started.', 'kadence-blocks' ); ?></p>
									<a href="https://www.kadencewp.com/kadence-blocks/documentation/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=dashboard" target="_blank" class="sidebar-link"><?php esc_html_e( 'Browse Docs', 'kadence-blocks' ); ?></a>
								</div>
							</div>
							<div class="support-section sidebar-section components-panel">
								<div class="components-panel__body is-opened">
									<h2><?php esc_html_e( 'Support', 'kadence-blocks' ); ?></h2>
									<p><?php esc_html_e( 'Have a question, we are happy to help! Get in touch with our support team.', 'kadence-blocks' ); ?></p>
									<a href="https://www.kadencewp.com/free-support/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=dashboard" target="_blank" class="sidebar-link"><?php esc_html_e( 'Submit a Ticket', 'kadence-blocks' ); ?></a>
								</div>
							</div>
						<?php } ?>
						<?php do_action( 'kadence_blocks_dash_below_side_panel' ); ?>
					</div>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Admin Pro Kadence Notice.
	 */
	public function admin_pro_kadence_notice() {
		if ( ! class_exists( 'Kadence_Blocks_Pro' ) ) {
			?>
			<div class="pro-section sidebar-section components-panel">
				<div class="components-panel__body is-opened">
					<h2><?php esc_html_e( 'Kadence Blocks Pro', 'kadence-blocks' ); ?></h2>
					<ul>
						<li><?php esc_html_e( '10 Pro Blocks', 'kadence-blocks' ); ?></li>
						<li><?php esc_html_e( 'Pro Block Addons', 'kadence-blocks' ); ?></li>
						<li><?php esc_html_e( 'Dynamic Content', 'kadence-blocks' ); ?></li>
						<li><?php esc_html_e( 'Custom Icons', 'kadence-blocks' ); ?></li>
						<li><?php esc_html_e( 'Custom Fonts', 'kadence-blocks' ); ?></li>
						<li><?php esc_html_e( 'Premium Design Library', 'kadence-blocks' ); ?></li>
					</ul>
					<a href="https://www.kadencewp.com/kadence-blocks/pro/?utm_source=in-app&utm_medium=kadence-blocks&utm_campaign=dashboard" target="_blank" class="sidebar-btn-link"><?php esc_html_e( 'Upgrade Kadence Blocks', 'kadence-blocks' ); ?></a>
				</div>
			</div>
			<?php
		}
	}
	/**
	 * Get array of Kadence Blocks.
	 */
	public function blocks_array() {
		$blocks = [
			'kadence/rowlayout'       => [
				'slug' => 'kadence/rowlayout',
				'name' => __( 'Row Layout', 'kadence-blocks' ),
				'desc' => __( 'Create rows with nested blocks either in columns or as a container. Give style to your rows with background, overlay, padding, etc.', 'kadence-blocks' ),
			],
			'kadence/form'            => [
				'slug' => 'kadence/form',
				'name' => __( 'Form', 'kadence-blocks' ),
				'desc' => __( 'Create a contact form or marketing form and style it within the block editor.', 'kadence-blocks' ),
			],
			'kadence/advancedgallery' => [
				'slug' => 'kadence/advancedgallery',
				'name' => __( 'Advanced Gallery', 'kadence-blocks' ),
				'desc' => __( 'Photo galleries, carousels, and sliders! Enable custom links, captions, and more. Plus, you can select image sizes.', 'kadence-blocks' ),
			],
			'kadence/advancedbtn'     => [
				'slug' => 'kadence/advancedbtn',
				'name' => __( 'Advanced Button', 'kadence-blocks' ),
				'desc' => __( 'Create an advanced button or a row of buttons. Style each one including hover controls plus you can use an icon and display them side by side', 'kadence-blocks' ),
			],
			'kadence/lottie'          => [
				'slug'     => 'kadence/lottie',
				'name'     => __( 'Lottie Animations', 'kadence-blocks' ),
				'desc'     => __( 'Add an extra "wow" factor to your site with engaging Lottie animations.', 'kadence-blocks' ),
				'link'     => admin_url( 'edit.php?post_type=kadence_lottie' ),
				'linkText' => __( 'Manage Lottie Animations', 'kadence-blocks' ),
			],
			'kadence/vector'          => [
				'slug'     => 'kadence/vector', 
				'name'     => __( 'Vector Graphics', 'kadence-blocks' ),
				'desc'     => __( 'Add custom vector icons and SVGs to enhance your site design.', 'kadence-blocks' ),
				'link'     => admin_url( 'edit.php?post_type=kadence_vector' ),
				'linkText' => __( 'Manage Vector Graphics', 'kadence-blocks' ),
			],
			'kadence/header'          => [
				'slug'     => 'kadence/header',
				'name'     => __( 'Advanced Header', 'kadence-blocks' ),
				'desc'     => __( 'Build custom headers in the block editor and full site editing.', 'kadence-blocks' ),
				'link'     => admin_url( 'edit.php?post_type=kadence_header' ),
				'linkText' => __( 'Manage Headers', 'kadence-blocks' ),
			],
			'kadence/navigation'      => [
				'slug'     => 'kadence/navigation',
				'name'     => __( 'Advanced Navigation', 'kadence-blocks' ),
				'desc'     => __( 'Build custom navigation menus', 'kadence-blocks' ),
				'link'     => admin_url( 'edit.php?post_type=kadence_navigation' ),
				'linkText' => __( 'Manage Navigation Menus', 'kadence-blocks' ),
			],
			'kadence/icon'            => [
				'slug' => 'kadence/icon',
				'name' => __( 'Icon', 'kadence-blocks' ),
				'desc' => __( 'Choose from over 1500+ SVG Icons to add into your page and style the size, colors, background, border, etc.', 'kadence-blocks' ),
			],
			'kadence/spacer'          => [
				'slug' => 'kadence/spacer',
				'name' => __( 'Spacer/Divider', 'kadence-blocks' ),
				'desc' => __( 'Easily create a divider and determine the space around it or just create some space in your content.', 'kadence-blocks' ),
			],
			'kadence/advancedheading' => [
				'slug' => 'kadence/advancedheading',
				'name' => __( 'Advanced Text', 'kadence-blocks' ),
				'desc' => __( 'Create a heading or paragraph and define sizes for desktop, tablet and mobile along with font family, colors, etc.', 'kadence-blocks' ),
			],
			'kadence/tabs'            => [
				'slug' => 'kadence/tabs',
				'name' => __( 'Tabs', 'kadence-blocks' ),
				'desc' => __( 'Create custom vertical or horizontal tabs with advanced styling controls. Each tab content is an empty canvas able to contain any other blocks.', 'kadence-blocks' ),
			],
			'kadence/infobox'         => [
				'slug' => 'kadence/infobox',
				'name' => __( 'Info Box', 'kadence-blocks' ),
				'desc' => __( 'Create a box containing an icon or image and, optionally, a title, description, and learn more text. Style static and hover separately.', 'kadence-blocks' ),
			],
			'kadence/accordion'       => [
				'slug' => 'kadence/accordion',
				'name' => __( 'Accordion', 'kadence-blocks' ),
				'desc' => __( 'Create beautiful accordions! Each pane can contain any other block, customize title styles, content background, and borders.', 'kadence-blocks' ),
			],
			'kadence/iconlist'        => [
				'slug' => 'kadence/iconlist',
				'name' => __( 'Icon List', 'kadence-blocks' ),
				'desc' => __( 'Add beautiful icons to your lists and make them more engaging. Over 1500 icons to choose from and unlimited styles.', 'kadence-blocks' ),
			],
			'kadence/tableofcontents' => [
				'slug' => 'kadence/tableofcontents',
				'name' => __( 'Table of Contents', 'kadence-blocks' ),
				'desc' => __( 'Allow your readers to navigate your content easily with a table of contents block. Includes smooth scroll to anchor.', 'kadence-blocks' ),
			],
			'kadence/posts'           => [
				'slug' => 'kadence/posts',
				'name' => __( 'Posts', 'kadence-blocks' ),
				'desc' => __( 'Display a clean grid of posts anywhere on your site, great for your home page where you want to tease your blog.', 'kadence-blocks' ),
			],
			'kadence/countdown'       => [
				'slug' => 'kadence/countdown',
				'name' => __( 'Countdown', 'kadence-blocks' ),
				'desc' => __( 'Increase your conversions by adding a sense of urgency to your offering. Pro includes evergreen campaigns as well.', 'kadence-blocks' ),
			],
			'kadence/testimonials'    => [
				'slug' => 'kadence/testimonials',
				'name' => __( 'Testimonials', 'kadence-blocks' ),
				'desc' => __( 'Create confidence in your brand or product by showing off beautiful unique testimonials, add as a carousel or a grid.', 'kadence-blocks' ),
			],
		];

		// for blocks moved from pro to free
		if ( ! defined( 'KBP_VERSION' ) || ( defined( 'KBP_VERSION' ) && version_compare( KBP_VERSION, '2.6.0', '>' ) ) ) {
			$blocks['kadence/videopopup'] = [
				'slug'  => 'kadence/videopopup',
				'name'  => __( 'Video Popup', 'kadence-blocks' ),
				'desc'  => __( 'Beautifully display a thumbnail with overlay and hover effect that links to a video popup on click. Works with local or external videos!', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'includes/settings/img/block-video-pop.jpg',
			];
		}

		return apply_filters( 'kadence_blocks_enable_disable_array', $blocks );
	}
	/**
	 * Ajax Save blocks Config
	 */
	public function ajax_blocks_save_config() {
		if ( ! check_ajax_referer( 'kadence-blocks-manage', 'wpnonce' ) ) {
			wp_send_json_error( __( 'Invalid nonce', 'kadence-blocks' ) );
		}
		if ( ! isset( $_POST['kt_block'] ) && ! isset( $_POST['config'] ) ) {
			return wp_send_json_error( __( 'Missing Content', 'kadence-blocks' ) );
		}
		// Get settings.
		$current_settings = get_option( 'kt_blocks_config_blocks' );
		$new_settings     = wp_unslash( $_POST['config'] );
		if ( ! is_array( $new_settings ) ) {
			return wp_send_json_error( __( 'Nothing to Save', 'kadence-blocks' ) );
		}
		foreach ( $new_settings as $block_key => $settings ) {
			foreach ( $settings as $attribute_key => $value ) {
				if ( is_array( $value ) ) {
					foreach ( $value as $array_attribute_index => $array_value ) {
						if ( is_array( $array_value ) ) {
							foreach ( $array_value as $array_attribute_key => $array_attribute_value ) {
								$array_attribute_value = sanitize_text_field( $array_attribute_value );
								if ( is_numeric( $array_attribute_value ) ) {
									$array_attribute_value = floatval( $array_attribute_value );
								}
								if ( 'true' === $array_attribute_value ) {
									$array_attribute_value = true;
								}
								if ( 'false' === $array_attribute_value ) {
									$array_attribute_value = false;
								}
								$new_settings[ $block_key ][ $attribute_key ][ $array_attribute_index ][ $array_attribute_key ] = $array_attribute_value;
							}
						} else {
							$array_value = sanitize_text_field( $array_value );
							if ( is_numeric( $array_value ) ) {
								$array_value = floatval( $array_value );
							}
							$new_settings[ $block_key ][ $attribute_key ][ $array_attribute_index ] = $array_value;
						}
					}
				} else {
					$value = sanitize_text_field( $value );
					if ( is_numeric( $value ) ) {
						$value = floatval( $value );
					}
					if ( 'true' === $value ) {
						$value = true;
					}
					if ( 'false' === $value ) {
						$value = false;
					}
					$new_settings[ $block_key ][ $attribute_key ] = $value;
				}
			}
		}
		$block = sanitize_text_field( wp_unslash( $_POST['kt_block'] ) );

		if ( ! is_array( $current_settings ) ) {
			$current_settings = [];
		}
		$current_settings[ $block ] = $new_settings[ $block ];
		update_option( 'kt_blocks_config_blocks', $current_settings );
		return wp_send_json_success();
	}
	/**
	 * Ajax activate/deactivate blocks
	 */
	public function ajax_blocks_activate_deactivate() {
		if ( ! check_ajax_referer( 'kadence-blocks-manage', 'wpnonce' ) ) {
			wp_send_json_error();
		}
		if ( ! isset( $_POST['kt_block'] ) ) {
			return wp_send_json_error();
		}
		// Get variables.
		$unregistered_blocks = get_option( 'kt_blocks_unregistered_blocks' );
		$block               = sanitize_text_field( wp_unslash( $_POST['kt_block'] ) );

		if ( ! is_array( $unregistered_blocks ) ) {
			$unregistered_blocks = [];
		}

		// If current block is in the array - remove it.
		if ( in_array( $block, $unregistered_blocks ) ) {
			$index = array_search( $block, $unregistered_blocks );
			if ( false !== $index ) {
				unset( $unregistered_blocks[ $index ] );
			}
			// if current block is not in the array - add it.
		} else {
			array_push( $unregistered_blocks, $block );
		}

		update_option( 'kt_blocks_unregistered_blocks', $unregistered_blocks );
		return wp_send_json_success();
	}
	/**
	 * Ajax default posts width
	 */
	public function ajax_default_editor_width() {
		if ( ! check_ajax_referer( 'kadence-blocks-manage', 'wpnonce' ) ) {
			wp_send_json_error();
		}
		if ( ! isset( $_POST['post_default'] ) ) {
			return wp_send_json_error();
		}
		// Get variables.
		$editor_widths = get_option( 'kt_blocks_editor_width' );
		$default       = sanitize_text_field( wp_unslash( $_POST['post_default'] ) );

		if ( ! is_array( $editor_widths ) ) {
			$editor_widths = [];
		}
		$editor_widths['post_default'] = $default;

		update_option( 'kt_blocks_editor_width', $editor_widths );
		return wp_send_json_success();
	}
	/**
	 * Add settings link
	 */
	public function settings_link() {
		return apply_filters( 'kadence-blocks-settings-url', admin_url( 'admin.php?page=kadence-blocks' ) );
	}
	/**
	 * Add settings link
	 *
	 * @param array $links plugin activate/deactivate links array.
	 */
	public function add_settings_link( $links ) {
		$settings_link = '<a href="' . esc_url( $this->settings_link() ) . '">' . __( 'Settings', 'kadence-blocks' ) . '</a>';
		array_push( $links, $settings_link );
		return $links;
	}
}
Kadence_Blocks_Settings::get_instance();
