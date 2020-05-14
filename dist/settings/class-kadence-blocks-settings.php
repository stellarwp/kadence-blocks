<?php
/**
 * Build Welcome Page With settings.
 *
 * @package Kadence Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


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
	public static $settings = array();

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
		// only load if admin.
		if ( is_admin() ) {
			add_action( 'admin_menu', array( $this, 'add_menu' ) );
			add_filter( 'plugin_action_links_kadence-blocks/kadence-blocks.php', array( $this, 'add_settings_link' ) );
		}
		add_action( 'wp_ajax_kadence_blocks_activate_deactivate', array( $this, 'ajax_blocks_activate_deactivate' ), 10, 0 );
		add_action( 'wp_ajax_kadence_blocks_save_config', array( $this, 'ajax_blocks_save_config' ), 10, 0 );
		add_action( 'wp_ajax_kadence_post_default_width', array( $this, 'ajax_default_editor_width' ), 10, 0 );
		add_action( 'enqueue_block_editor_assets', array( $this, 'deregister_blocks' ) );
		add_action( 'admin_init', array( $this, 'activation_redirect' ) );
		add_action( 'admin_init', array( $this, 'load_settings' ) );
		add_action( 'init', array( $this, 'load_api_settings' ) );
		add_action( 'after_setup_theme', array( $this, 'load_color_palette' ), 999 );

	}
	/**
	 * Load Gutenberg Palette
	 */
	public function load_color_palette() {
		$palette = json_decode( get_option( 'kadence_blocks_colors' ) );
		if ( $palette && is_object( $palette ) && isset( $palette->palette ) && is_array( $palette->palette ) ) {
			$san_palette = array();
			foreach ( $palette->palette as $item ) {
				$san_palette[] = array(
					'color' => $item->color,
					'name'  => $item->name,
					'slug'  => $item->slug,
				);
			}
			if ( isset( $san_palette[0] ) ) {
				if ( ( isset( $palette->override ) && true !== $palette->override ) || ! isset( $palette->override ) ) {
					$theme_palette = get_theme_support( 'editor-color-palette' );
					if ( is_array( $theme_palette ) ) {
						$newpalette = array_merge( reset( $theme_palette ), $san_palette );
					} else {
						$default_palette = array(
							array(
								'name' => __( 'Pale pink', 'kadence-blocks' ),
								'slug' => 'pale-pink',
								'color' => '#f78da7',
							),
							array(
								'name' => __( 'Vivid red', 'kadence-blocks' ),
								'slug' => 'vivid-red',
								'color' => '#cf2e2e',
							),
							array(
								'name' => __( 'Luminous vivid orange', 'kadence-blocks' ),
								'slug' => 'luminous-vivid-orange',
								'color' => '#ff6900',
							),
							array(
								'name' => __( 'Luminous vivid amber', 'kadence-blocks' ),
								'slug' => 'luminous-vivid-amber',
								'color' => '#fcb900',
							),
							array(
								'name' => __( 'Light green cyan', 'kadence-blocks' ),
								'slug' => 'light-green-cyan',
								'color' => '#7bdcb5',
							),
							array(
								'name' => __( 'Vivid green cyan', 'kadence-blocks' ),
								'slug' => 'vivid-green-cyan',
								'color' => '#00d084',
							),
							array(
								'name' => __( 'Pale cyan blue', 'kadence-blocks' ),
								'slug' => 'pale-cyan-blue',
								'color' => '#8ed1fc',
							),
							array(
								'name' => __( 'Vivid cyan blue', 'kadence-blocks' ),
								'slug' => 'vivid-cyan-blue',
								'color' => '#0693e3',
							),
							array(
								'name' => __( 'Very light gray', 'kadence-blocks' ),
								'slug' => 'very-light-gray',
								'color' => '#eeeeee',
							),
							array(
								'name' => __( 'Cyan bluish gray', 'kadence-blocks' ),
								'slug' => 'cyan-bluish-gray',
								'color' => '#abb8c3',
							),
							array(
								'name' => __( 'Very dark gray', 'kadence-blocks' ),
								'slug' => 'very-dark-gray',
								'color' => '#313131',
							),
						);
						$newpalette = array_merge( $default_palette, $san_palette );
					}
				} else {
					$newpalette = $san_palette;
				}
				add_theme_support( 'editor-color-palette', $newpalette );
				add_action( 'wp_head', array( $this, 'print_gutenberg_style' ), 8 );
				add_action( 'admin_print_styles', array( $this, 'print_gutenberg_style' ), 21 );
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
			$san_palette = array();
			foreach ( $palette->palette as $item ) {
				$san_palette[] = array(
					'color' => $item->color,
					'name' => $item->name,
					'slug' => $item->slug,
				);
			}
			if ( isset( $san_palette[0] ) ) {
				echo '<style id="kadence_blocks_palette_css" type="text/css">';
				foreach ( $san_palette as $set ) {
					$slug = $set['slug'];
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
			if ( ! isset( $_GET['activate-multi'] ) ) {
				wp_safe_redirect( $this->settings_link() );
			}
		}
	}
	/**
	 * Redirect to the settings page on activation.
	 *
	 * @param string $key setting key.
	 */
	public static function get_data_options( $key ) {
		if ( ! isset( self::$settings[ $key ] ) ) {
			self::$settings[ $key ] = get_option( $key, array() );
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
		if ( $options ) {
			wp_enqueue_script( 'kadence-blocks-deregister-js', KADENCE_BLOCKS_URL . 'dist/settings/blocks-deregister.js', array( 'wp-blocks' ), KADENCE_BLOCKS_VERSION, true );
			wp_localize_script(
				'kadence-blocks-deregister-js',
				'kt_deregister_params',
				array(
					'deregister'       => $options,
				)
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
		$svg = '<svg viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg"><g><path d="M172.918,180.559l-145.836,-161.118l0,161.118l145.836,0Z" style="fill:#fff;fill-rule:nonzero;"/><path d="M172.918,19.441l-68.198,75.345l-68.311,-75.345l136.509,0Z" style="fill:#fff;fill-rule:nonzero;"/></g></svg>';

		if ( $base64 ) {
			return 'data:image/svg+xml;base64,' . base64_encode( $svg );
		}

		return $svg;
	}
	/**
	 * Allow settings visibility to be changed.
	 */
	public function settings_user_capabilities() {
		$cap = apply_filters( 'kadence_blocks_admin_settings_capability', 'edit_pages' );
		return $cap;
	}
	/**
	 * Add option page menu
	 */
	public function add_menu() {
		if ( apply_filters( 'kadence_blocks_admin_menu_options', true ) ) {
			$page = add_options_page( __( 'Kadence Blocks -  Gutenberg Page Builder Blocks', 'kadence-blocks' ), __( 'Kadence Blocks' ), $this->settings_user_capabilities(), 'kadence_blocks', array( $this, 'config_page' ) );
		} else {
			add_menu_page( __( 'Kadence Blocks -  Gutenberg Page Builder Blocks', 'kadence-blocks' ), __( 'Kadence Blocks', 'kadence-blocks' ), $this->settings_user_capabilities(), 'kadence-blocks', null, $this->get_icon_svg() );
			$page = add_submenu_page( 'kadence-blocks', __( 'Kadence Blocks -  Gutenberg Page Builder Blocks', 'kadence-blocks' ), __( 'Settings' ), $this->settings_user_capabilities(), 'kadence-blocks', array( $this, 'config_page' ) );
		}
		add_action( 'admin_print_styles-' . $page, array( $this, 'scripts' ) );
	}
	/**
	 * Loads admin style sheets and scripts
	 */
	public function scripts() {
		$texts = array(
			'close'    => __( 'Close', 'kadence-blocks' ),
			'save'     => __( 'Save', 'kadence-blocks' ),
			'updating' => __( 'Updating', 'kadence-blocks' ),
			'updated'  => __( 'Updated', 'kadence-blocks' ),
			'config'   => __( 'Config', 'kadence-blocks' ),
			'settings' => __( 'Default Settings', 'kadence-blocks' ),
		);
		$settings = array(
			'kadence/spacer' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/rowlayout' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/advancedbtn' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/infobox' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/accordion' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/tabs' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/iconlist' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/testimonials' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/advancedheading' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
			'kadence/icon' => array(
				'moved' => array(
					'type' => 'info',
					'name' => __( 'Setting defaults has moved into Gutenberg, click on the top right corner settings and go to Kadence Blocks Controls', 'kadence-blocks' ),
				),
			),
		);
		wp_enqueue_style( 'kadence-blocks-admin-css', KADENCE_BLOCKS_URL . '/dist/settings/styles.css', array( 'wp-jquery-ui-dialog', 'wp-color-picker' ), KADENCE_BLOCKS_VERSION, 'all' );
		wp_enqueue_script( 'kadence-blocks-admin-js', KADENCE_BLOCKS_URL . '/dist/settings/scripts.js', array( 'jquery', 'jquery-ui-dialog', 'wp-color-picker' ), KADENCE_BLOCKS_VERSION, true );
		wp_localize_script(
			'kadence-blocks-admin-js',
			'kt_blocks_params',
			array(
				'ajaxurl'             => admin_url( 'admin-ajax.php' ),
				'wpnonce'             => wp_create_nonce( 'kadence-blocks-manage' ),
				'blockConfig'         => get_option( 'kt_blocks_config_blocks' ),
				'blockConfigSettings' => $settings,
				'texts'               => $texts,
			)
		);
	}
	/**
	 * Register settings
	 */
	public function load_api_settings() {

		register_setting(
			'kadence_blocks_config_blocks',
			'kadence_blocks_config_blocks',
			array(
				'type'              => 'string',
				'description'       => __( 'Config Kadence Block Defaults', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			)
		);
		register_setting(
			'kadence_blocks_settings_blocks',
			'kadence_blocks_settings_blocks',
			array(
				'type'              => 'string',
				'description'       => __( 'Config Kadence Block Settings View', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			)
		);
		register_setting(
			'kadence_blocks_colors',
			'kadence_blocks_colors',
			array(
				'type'              => 'string',
				'description'       => __( 'Config Kadence Blocks Color Palette', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			)
		);
		register_setting(
			'kadence_blocks_global',
			'kadence_blocks_global',
			array(
				'type'              => 'string',
				'description'       => __( 'Config Kadence Blocks Global Settings', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			)
		);
		register_setting(
			'kadence_blocks_recaptcha_site_key',
			'kadence_blocks_recaptcha_site_key',
			array(
				'type'              => 'string',
				'description'       => __( 'Google reCaptcha Site Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			)
		);
		register_setting(
			'kadence_blocks_recaptcha_secret_key',
			'kadence_blocks_recaptcha_secret_key',
			array(
				'type'              => 'string',
				'description'       => __( 'Google reCaptcha Secret Key', 'kadence-blocks' ),
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => true,
				'default'           => '',
			)
		);
	}
	/**
	 * Register settings
	 */
	public function load_settings() {

		register_setting( 'kt_blocks_editor_width', 'kt_blocks_editor_width', array( $this, 'validate_options' ) );

		// Sidebar and No sidebar Max widths.
		add_settings_section( 'kt_blocks_editor_width_sec', '', array( $this, 'maxwidths_callback' ), 'kt_blocks_editor_width_section' );
		add_settings_field( 'sidebar', __( 'Small Template', 'kadence-blocks' ), array( $this, 'sidebar_callback' ), 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		add_settings_field( 'nosidebar', __( 'Large Template', 'kadence-blocks' ), array( $this, 'nosidebar_callback' ), 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		// Defaults for Pages and posts.
		add_settings_field( 'post_default', __( 'Post default', 'kadence-blocks' ), array( $this, 'post_default_callback' ), 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		add_settings_field( 'page_default', __( 'Page Default', 'kadence-blocks' ), array( $this, 'page_default_callback' ), 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		//add_settings_field( 'limited_margins', __( 'Enable Less Margin CSS', 'kadence-blocks' ), array( $this, 'limited_margins_callback' ), 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );
		add_settings_field( 'enable_editor_width', __( 'Enable Editor Width', 'kadence-blocks' ), array( $this, 'enabled_editor_width_callback' ), 'kt_blocks_editor_width_section', 'kt_blocks_editor_width_sec' );

	}
	/**
	 * Outputs Sidebar number field
	 */
	public function enabled_editor_width_callback() {
		$data = self::get_data_options( 'kt_blocks_editor_width' );
		$default_enabled = ( isset( $data['enable_editor_width'] ) ? $data['enable_editor_width'] : 'true' );
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
		$data = self::get_data_options( 'kt_blocks_editor_width' );
		$default_limited = ( isset( $data['limited_margins'] ) ? $data['limited_margins'] : 'false' );
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
		$data = self::get_data_options( 'kt_blocks_editor_width' );
		$default_post_type = ( isset( $data['post_default'] ) ? $data['post_default'] : 'sidebar' );
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
		$data = self::get_data_options( 'kt_blocks_editor_width' );
		$default_page_type = ( isset( $data['page_default'] ) ? $data['page_default'] : 'sidebar' );
		echo '<select class="kt-blocks-posts-defaults kt-editor-width-defaults-select" name="kt_blocks_editor_width[page_default]">';
			echo '<option value="sidebar" ' . ( 'sidebar' === $default_page_type ? 'selected' : '' ) . '>' . esc_html__( 'Small', 'kadence-blocks' ) . '</option>';
			echo '<option value="nosidebar" ' . ( 'nosidebar' === $default_page_type ? 'selected' : '' ) . '>' . esc_html__( 'Large', 'kadence-blocks' ) . '</option>';
			echo '<option value="fullwidth" ' . ( 'fullwidth' === $default_page_type ? 'selected' : '' ) . '>' . esc_html__( 'Fullwidth', 'kadence-blocks' ) . '</option>';
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
	 * Sanitizes and validates all input and output for Dashboard.
	 *
	 * @param array $input settings input.
	 */
	public function validate_options( $input ) {
		return $input;
	}
	/**
	 * Loads config page
	 */
	public function config_page() {
		?>
		<div class="kt_plugin_welcome_title_head">
			<div class="kt_plugin_welcome_head_container">
				<a href="https://www.kadenceblocks.com/" class="kt_plugin_welcome_logo_area">
					<div class="kt_plugin_welcome_logo">
						<img src="<?php echo KADENCE_BLOCKS_URL . 'dist/settings/img/kadence-logo.png'; ?>">
					</div>
					<div class="kt_plugin_welcome_logo_title">
						<h1>
							<?php echo esc_html__( 'Kadence Blocks', 'kadence-blocks' ); ?>
						</h1>
						<h4>
							<?php echo esc_html__( 'Page Builder Toolkit', 'kadence-blocks' ); ?>
						</h4>
					</div>
				</a>
			</div>
		</div>
		<div class="wrap kt_plugin_welcome">
<svg aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<symbol id="kt-svg-icon-envelope" viewBox="0 0 38 32">
<title>envelope</title>
<path d="M20.060 0.413c-0.58-0.533-1.539-0.533-2.119 0l-17.688 10.671c-0.15 0.091-0.242 0.253-0.242 0.428v18.922c0 0.863 0.706 1.566 1.574 1.566h34.83c0.868 0 1.574-0.703 1.574-1.566v-18.922c0-0.175-0.092-0.337-0.242-0.428l-17.687-10.671zM18.504 1.24c0.035-0.021 0.066-0.046 0.095-0.074 0.108-0.107 0.25-0.166 0.401-0.166s0.293 0.059 0.4 0.166c0.029 0.028 0.061 0.053 0.095 0.074l17.227 10.394-12.478 7.436c-0.237 0.142-0.315 0.448-0.174 0.686 0.094 0.157 0.26 0.244 0.43 0.244 0.087 0 0.175-0.022 0.255-0.070l12.245-7.29v17.757l-16.935-11.266c-0.538-0.429-1.594-0.429-2.096-0.025l-16.969 11.286v-17.752l12.244 7.29c0.080 0.048 0.169 0.070 0.256 0.070 0.17 0 0.336-0.087 0.43-0.244 0.141-0.237 0.063-0.544-0.174-0.686l-12.479-7.436 17.227-10.394zM36.090 31h-34.188l16.656-11.086c0.173-0.138 0.712-0.137 0.919 0.025l16.613 11.061zM6.5 13h25c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-25c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5z"></path>
</symbol>
<symbol id="kt-svg-icon-presentation" viewBox="0 0 31 32">
<title>presentation</title>
<path d="M0.5 3c-0.276 0-0.5 0.224-0.5 0.5v17c0 0.827 0.673 1.5 1.5 1.5h28c0.827 0 1.5-0.673 1.5-1.5v-17c0-0.276-0.224-0.5-0.5-0.5s-0.5 0.224-0.5 0.5v17c0 0.276-0.224 0.5-0.5 0.5h-28c-0.276 0-0.5-0.224-0.5-0.5v-17c0-0.276-0.224-0.5-0.5-0.5zM32.5 0h-34c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h34c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5zM11.854 8.146c-0.183-0.183-0.475-0.196-0.674-0.031l-6 5c-0.212 0.177-0.241 0.492-0.064 0.705 0.177 0.212 0.491 0.241 0.705 0.064l5.649-4.708 5.677 5.677c0.097 0.098 0.225 0.147 0.353 0.147s0.256-0.049 0.354-0.146l7.146-7.147v3.793c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-5c0-0.065-0.013-0.13-0.038-0.191-0.051-0.122-0.148-0.22-0.271-0.271-0.061-0.025-0.126-0.038-0.191-0.038h-5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h3.793l-6.793 6.793-5.646-5.647zM8.057 31.732c0.128 0.245 0.43 0.339 0.675 0.211l6.768-3.545 6.768 3.545c0.074 0.039 0.153 0.057 0.232 0.057 0.18 0 0.354-0.098 0.443-0.268 0.128-0.245 0.034-0.547-0.211-0.675l-6.893-3.61c0.098-0.091 0.161-0.219 0.161-0.364v-2.583c0-0.276-0.224-0.5-0.5-0.5s-0.5 0.224-0.5 0.5v2.583c0 0.144 0.063 0.272 0.161 0.363l-6.893 3.61c-0.245 0.129-0.339 0.431-0.211 0.676z"></path>
</symbol>
<symbol id="kt-svg-icon-lifesaver" viewBox="0 0 32 32">
<title>lifesaver</title>
<path d="M5.738 2.796l-2.943 2.942c-0.195 0.196-0.195 0.512 0 0.707 0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146l2.943-2.942c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.708 0zM28.496 25.553l-2.943 2.942c-0.195 0.195-0.195 0.512 0 0.707 0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146l2.943-2.942c0.195-0.195 0.195-0.512 0-0.707s-0.513-0.196-0.708 0zM26.652 2.992c-0.195-0.195-0.512-0.195-0.707 0s-0.195 0.512 0 0.707l2.747 2.746c0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146c0.195-0.195 0.195-0.512 0-0.707l-2.748-2.746zM2.992 25.945c-0.195 0.195-0.195 0.512 0 0.707l2.747 2.746c0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146c0.195-0.195 0.195-0.512 0-0.707l-2.747-2.746c-0.197-0.195-0.513-0.195-0.708 0zM4.532 9.86c-0.204 0.38-0.381 0.771-0.544 1.164-1.309 3.164-1.31 6.791-0.001 9.952 0.202 0.487 0.427 0.953 0.668 1.383 0.583 1.041 1.306 1.996 2.148 2.838 0.964 0.965 2.069 1.769 3.284 2.389 0.308 0.157 0.621 0.296 0.938 0.427 1.582 0.655 3.256 0.987 4.975 0.987s3.393-0.332 4.976-0.987c0.001 0 0.001-0.001 0.002-0.002 0.393-0.162 0.782-0.34 1.161-0.543 1.125-0.602 2.154-1.366 3.058-2.271 0.904-0.903 1.668-1.932 2.271-3.059 0.203-0.38 0.382-0.769 0.545-1.164 0 0 0-0.001 0-0.001 1.307-3.163 1.307-6.789-0.001-9.949-0.131-0.316-0.271-0.631-0.427-0.938-0.619-1.214-1.423-2.318-2.389-3.284-0.841-0.841-1.795-1.563-2.837-2.147-0.429-0.241-0.895-0.467-1.384-0.669-3.163-1.309-6.783-1.309-9.951 0.001 0 0-0.001 0-0.001 0-0.395 0.164-0.784 0.341-1.164 0.545-1.124 0.602-2.152 1.366-3.056 2.271-0.904 0.903-1.669 1.931-2.271 3.057zM14.1 11.414c0 0 0 0 0 0 0.432-0.178 0.877-0.295 1.322-0.347 0.466-0.055 0.939-0.043 1.402 0.035 0.368 0.061 0.73 0.165 1.077 0.307 0 0 0 0 0.001 0 0.604 0.25 1.146 0.612 1.611 1.077 0.461 0.461 0.822 1.003 1.073 1.612 0 0 0 0 0 0.001s0 0 0 0c0.211 0.511 0.335 1.042 0.37 1.58 0.019 0.297 0.011 0.599-0.023 0.896-0.052 0.446-0.168 0.891-0.347 1.322 0 0 0 0 0 0s0 0 0 0.001c-0.251 0.609-0.612 1.151-1.073 1.612-0.46 0.46-1.003 0.821-1.613 1.073 0 0 0 0 0 0-0.432 0.177-0.877 0.295-1.322 0.346-0.297 0.035-0.596 0.043-0.897 0.023-0.537-0.034-1.069-0.159-1.581-0.37-0.61-0.252-1.153-0.613-1.613-1.073-0.465-0.465-0.827-1.006-1.077-1.611-0.143-0.346-0.247-0.709-0.309-1.078-0.078-0.465-0.089-0.937-0.035-1.401 0.052-0.446 0.168-0.891 0.347-1.322 0 0 0 0 0 0s0 0 0-0.001c0.251-0.609 0.612-1.151 1.073-1.612 0.461-0.457 1.004-0.818 1.614-1.070zM27.271 11.873c0.966 2.648 0.966 5.604 0 8.254l-5.588-2.314c0.119-0.368 0.2-0.743 0.244-1.12 0.042-0.356 0.051-0.719 0.028-1.076-0.031-0.483-0.122-0.962-0.272-1.429l5.588-2.315zM10.116 16.989c0.047 0.279 0.114 0.555 0.199 0.824l-5.586 2.315c-0.966-2.648-0.965-5.604 0.001-8.254l5.587 2.314c-0.119 0.368-0.2 0.743-0.244 1.119-0.064 0.558-0.051 1.124 0.043 1.682zM7.51 24.49c-0.777-0.777-1.444-1.658-1.983-2.62-0.146-0.26-0.285-0.533-0.416-0.818l5.586-2.313c0.281 0.546 0.645 1.042 1.083 1.481 0.436 0.437 0.934 0.799 1.483 1.080l-2.316 5.591c-0.136-0.062-0.271-0.127-0.406-0.195-1.121-0.574-2.141-1.315-3.031-2.206zM11.873 27.271l2.315-5.589c0.467 0.15 0.946 0.241 1.428 0.272 0.358 0.021 0.718 0.015 1.078-0.028 0.376-0.044 0.75-0.126 1.118-0.244l2.315 5.589c-2.643 0.968-5.611 0.968-8.254 0zM24.49 24.49c-0.834 0.835-1.784 1.54-2.824 2.097-0.202 0.108-0.407 0.209-0.614 0.304l-2.316-5.591c0.55-0.281 1.047-0.643 1.483-1.080 0.437-0.436 0.799-0.934 1.080-1.483l5.59 2.315c-0.095 0.208-0.195 0.413-0.304 0.615-0.555 1.040-1.26 1.989-2.095 2.823zM24.49 7.51c0.892 0.892 1.633 1.911 2.205 3.032 0.069 0.134 0.133 0.269 0.196 0.406l-5.591 2.315c-0.282-0.549-0.643-1.047-1.080-1.483-0.439-0.439-0.936-0.803-1.482-1.084l2.315-5.586c0.286 0.132 0.56 0.271 0.819 0.417 0.961 0.539 1.842 1.206 2.618 1.983zM20.128 4.729l-2.315 5.587c-0.27-0.086-0.546-0.152-0.824-0.199-0.553-0.094-1.12-0.108-1.683-0.042-0.376 0.044-0.75 0.126-1.118 0.244l-2.315-5.589c2.645-0.969 5.612-0.969 8.255-0.001zM10.333 5.413c0.202-0.108 0.407-0.209 0.615-0.303l2.315 5.59c-0.55 0.281-1.047 0.644-1.483 1.080s-0.799 0.934-1.080 1.483l-5.59-2.315c0.094-0.208 0.194-0.413 0.303-0.615 0.557-1.040 1.262-1.989 2.097-2.823 0.834-0.835 1.784-1.54 2.823-2.097zM23.418 29.041c-4.576 2.607-10.261 2.607-14.837 0-0.241-0.136-0.546-0.054-0.682 0.188-0.137 0.239-0.053 0.545 0.187 0.682 2.441 1.391 5.177 2.085 7.914 2.085s5.473-0.694 7.914-2.085c0.24-0.137 0.324-0.442 0.187-0.682-0.138-0.242-0.443-0.324-0.683-0.188zM2.090 8.087c-2.781 4.881-2.781 10.945 0 15.826 0.092 0.162 0.261 0.253 0.435 0.253 0.084 0 0.169-0.021 0.247-0.065 0.24-0.137 0.324-0.442 0.187-0.682-2.607-4.576-2.607-10.262 0-14.838 0.137-0.239 0.053-0.545-0.187-0.682-0.241-0.135-0.546-0.052-0.682 0.188zM29.91 23.913c2.781-4.881 2.781-10.945 0-15.826-0.137-0.24-0.444-0.323-0.682-0.188-0.24 0.137-0.324 0.442-0.187 0.682 2.607 4.576 2.607 10.262 0 14.838-0.137 0.239-0.053 0.545 0.187 0.682 0.078 0.044 0.163 0.065 0.247 0.065 0.174 0 0.343-0.091 0.435-0.253zM8.582 2.959c4.576-2.607 10.261-2.607 14.837 0 0.078 0.044 0.163 0.065 0.247 0.065 0.174 0 0.343-0.091 0.435-0.253 0.137-0.239 0.053-0.545-0.187-0.682-4.882-2.781-10.945-2.781-15.827 0-0.24 0.137-0.324 0.442-0.187 0.682 0.136 0.241 0.441 0.322 0.682 0.188z"></path>
</symbol>
<symbol id="kt-svg-icon-documents" viewBox="0 0 34 32">
<title>documents</title>
<path d="M1.512 28h17.988c0.827 0 1.5-0.673 1.5-1.5v-19c0-0.023-0.010-0.043-0.013-0.065s-0.007-0.041-0.013-0.062c-0.023-0.086-0.060-0.166-0.122-0.227l-6.999-6.999c-0.061-0.061-0.141-0.098-0.227-0.122-0.021-0.006-0.040-0.010-0.062-0.013s-0.041-0.012-0.064-0.012h-11.994c-0.83 0-1.506 0.673-1.506 1.5v25c0 0.827 0.678 1.5 1.512 1.5zM14 1.707l5.293 5.293h-4.793c-0.275 0-0.5-0.224-0.5-0.5v-4.793zM1 1.5c0-0.276 0.227-0.5 0.506-0.5h11.494v5.5c0 0.827 0.673 1.5 1.5 1.5h5.5v18.5c0 0.276-0.225 0.5-0.5 0.5h-17.988c-0.283 0-0.512-0.224-0.512-0.5v-25zM4.5 12h12c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-12c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM4.5 16h12c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-12c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM4.5 8h5c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM4.5 20h12c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-12c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM4.5 24h12c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-12c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM21.5 5h4.5v5.5c0 0.827 0.673 1.5 1.5 1.5h5.5v18.5c0 0.276-0.225 0.5-0.5 0.5h-17.988c-0.283 0-0.512-0.224-0.512-0.5v-1c0-0.276-0.224-0.5-0.5-0.5s-0.5 0.224-0.5 0.5v1c0 0.827 0.678 1.5 1.512 1.5h17.988c0.827 0 1.5-0.673 1.5-1.5v-19c0-0.023-0.010-0.043-0.013-0.065s-0.007-0.041-0.013-0.062c-0.023-0.086-0.060-0.166-0.122-0.227l-6.999-6.999c-0.061-0.062-0.142-0.099-0.228-0.122-0.021-0.006-0.039-0.009-0.061-0.012s-0.041-0.013-0.064-0.013h-5c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM27.5 11c-0.275 0-0.5-0.224-0.5-0.5v-4.793l5.293 5.293h-4.793zM23.5 16h6c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-6c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM23.5 20h6c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-6c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM23.5 24h6c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-6c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5zM23.5 28h6c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-6c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5z"></path>
</symbol>
</defs>
</svg>
				<h2 class="notices"></h2>
				<div class="kad-panel-left kt-admin-clearfix">
					<div class="kad-panel-contain">
						<h2 class="nav-tab-wrapper">
							<a class="nav-tab nav-tab-active nav-tab-link" data-tab-id="kt-dashboard" href="#"><?php echo esc_html__( 'Dashboard', 'kadence-blocks' ); ?></a>
							<a class="nav-tab nav-tab-link" data-tab-id="kt-help" href="#"><?php echo esc_html__( 'Help / Tutorials', 'kadence-blocks' ); ?></a>
							<?php if ( ! class_exists( 'Kadence_Blocks_Pro' ) ) { ?>
								<a class="nav-tab go-pro-tab" target="_blank" href="https://www.kadenceblocks.com/pro/?utm_source=kadence-blocks&utm_medium=dashboard&utm_campaign=settings"><?php echo esc_html__( 'Pro', 'kadence-blocks' ); ?> <i class="dashicons dashicons-external"></i></a>
							<?php } ?>
						</h2>
						<div id="kt-dashboard" class="nav-tab-content panel_open kt-admin-clearfix">
							<div class="kad-helpful-links kt-main">
								<h2><?php echo esc_html__( 'Blocks', 'kadence-blocks' ); ?><span class="kt-main-subtitle"><?php echo esc_html__( 'Disable/Enable Blocks', 'kadence-blocks' ); ?></span></h2>

								<div class="kt-promo-row">
									<?php
									$blocks = $this->blocks_array();
									$unregistered_blocks = get_option( 'kt_blocks_unregistered_blocks', array() );
									if ( ! is_array( $unregistered_blocks ) ) {
										$unregistered_blocks = array();
									}
									foreach ( $blocks as $block_key => $block ) {
										if ( in_array( $block['slug'], $unregistered_blocks ) ) {
											$enabled_class = 'kt-block-inactive';
										} else {
											$enabled_class = 'kt-block-active';
										}
										echo '<div class="kt_plugin_box ' . esc_attr( $enabled_class ) . '">';
										echo '<img src="' . esc_url( $block['image'] ) . '">';
										echo '<h3>' . esc_html( $block['name'] ) . '</h3>';
										echo '<p>' . wp_kses_post( $block['desc'] ) . '</p>';
										if ( in_array( $block['slug'], $unregistered_blocks ) ) {
											$btntitle = __( 'Activate', 'kadence-blocks' );
										} else {
											$btntitle = __( 'Deactivate', 'kadence-blocks' );
										}
										echo '<a class="kt_block_button button button-primary ' . esc_attr( $enabled_class ) . '" data-inactive-label="' . esc_attr__( 'Activate', 'kadence-blocks' ) . '" data-active-label="' . esc_attr__( 'Deactivate', 'kadence-blocks' ) . '" data-activating-label="' . esc_attr__( 'Activating...', 'kadence-blocks' ) . '" data-activated-label="' . esc_attr__( 'Activated', 'kadence-blocks' ) . '"  data-deactivating-label="' . esc_attr__( 'Deactivating...', 'kadence-blocks' ) . '"  data-deactivated-label="' . esc_attr__( 'Deactivated', 'kadence-blocks' ) . '" data-block-slug="' . esc_attr( $block['slug'] ) . '" href="#">' . esc_html( $btntitle ) . '</a>';
										if ( ! in_array( $block['slug'], $unregistered_blocks ) ) {
											echo '<button class="button kt-blocks-config-settings" data-name="' . esc_attr( $block['name'] ) . '" value="' . esc_attr( $block['slug'] ) . '"><i class="dashicons dashicons-admin-generic"></i></button>';
										}
										echo '</div>';
									}
									?>
								</div>
								<div class="kt-dashboard-spacer"></div>
								<?php if ( apply_filters( 'kadence_blocks_editor_width', true ) ) { ?>
									<h2><?php echo esc_html__( 'Editor Max Widths', 'kadence-blocks' ); ?><span class="kt-main-subtitle"><?php echo esc_html__( 'Match the editor width to your sites width.', 'kadence-blocks' ); ?></span></h2>
									<?php global $content_width; ?>
										<div class="kt-main-description-notice"><?php echo esc_html__( 'Note: The current active themes "$content_width" is set to:', 'kadence-blocks' ) . ' ' . esc_html( $content_width ); ?>px</div>
										<div class="kt-promo-row">
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
							</div>
						</div>
						<div id="kt-help" class="nav-tab-content kt-admin-clearfix">
							<div class="kad-helpful-links kt-main">
								<h2><?php echo esc_html__( 'Helpful Links and Resources', 'kadence-blocks' ); ?></h2>
								<div class="kt-promo-row">
									<div class="kt-promo-box-contain kt-promo-three">
										<div class="kt-tutorials-promo kt-promo-box">
											<div class="kt-welcome-clearfix kt-promo-icon-container">
												<svg class="kt-svg-icon kt-svg-icon-lifesaver"><use xlink:href="#kt-svg-icon-lifesaver"></use></svg>
											</div>
											<div class="kt-content-promo">
												<h3><?php echo esc_html__( 'Support', 'kadence-blocks' ); ?></h3>
												<p><?php echo esc_html__( 'Are you having trouble getting things to look how you want? Or are you stuck and not sure what to do? We can help!', 'kadence-blocks' ); ?></p>
												<a href="https://wordpress.org/support/plugin/kadence-blocks" target="_blank"><?php echo esc_html__( 'Ask a question', 'kadence-blocks' ); ?></a>
											</div>
										</div>
									</div>
									<div class="kt-promo-box-contain kt-promo-three">
										<div class="kt-tutorials-promo kt-promo-box">
											<div class="kt-welcome-clearfix kt-promo-icon-container">
												<svg class="kt-svg-icon kt-svg-icon-presentation"><use xlink:href="#kt-svg-icon-presentation"></use></svg>
											</div>
											<div class="kt-content-promo">
												<h3><?php echo esc_html__( 'Changelog Blog', 'kadence-blocks' ); ?></h3>
												<p><?php echo esc_html__( 'Read through highlights of recent changes made to Kadence Blocks.', 'kadence-blocks' ); ?></p>
												<a href="https://www.kadenceblocks.com/blog/?utm_source=blocks-settings&utm_medium=dashboard&utm_campaign=kadence-blocks" target="_blank"><?php echo esc_html__( 'View', 'kadence-blocks' ); ?></a>
											</div>
										</div>
									</div>
									<div class="kt-promo-box-contain kt-promo-three">
										<div class="kt-tutorials-promo kt-promo-box">
											<div class="kt-welcome-clearfix kt-promo-icon-container">
												<svg class="kt-svg-icon kt-svg-icon-documents"><use xlink:href="#kt-svg-icon-documents"></use></svg>
											</div>
											<div class="kt-content-promo">
												<h3><?php echo esc_html__( 'Plugin Tutorials & Documentation', 'kadence-blocks' ); ?></h3>
												<p><?php echo esc_html__( 'Kadence Blocks documentation is set up to help you create amazing content.', 'kadence-blocks' ); ?></p>
												<?php echo '<a href="https://www.kadenceblocks.com/docs/?utm_source=blocks-settings&utm_medium=dashboard&utm_campaign=kadence-blocks">' . esc_html__( 'Browse Docs', 'kadence-blocks' ) . '</a>'; ?>
											</div>
										</div>
									</div>
								</div>
								<div class="kt-promo-row">
									<div class="kt-promo-box-contain kt-promo-full">
										<div class="kt-newsletter-promo kt-promo-box">
											<div class="kt-welcome-clearfix kt-promo-icon-container">
												<svg class="kt-svg-icon kt-svg-icon-envelope"><use xlink:href="#kt-svg-icon-envelope"></use></svg>
											</div>
											<div class="kt-content-promo">
												<h3><?php echo esc_html__( 'Kadence WP Newsletter', 'kadence-blocks' ); ?></h3>
												<p><?php echo esc_html__( 'Get the latest news about product updates and new plugins right to your inbox.', 'kadence-blocks' ); ?></p>
												<a href="https://www.kadencewp.com/newsletter-subscribe/?utm_source=kadence-blocks&utm_medium=dashboard&utm_campaign=settings" target="_blank"><?php echo esc_html__( 'Subscribe', 'kadence-blocks' ); ?></a>
											</div>
										</div>
									</div>
								</div>
								<div class="kt-dashboard-spacer"></div>
							</div>
						</div>
					</div>
					<div id="js-settings-modal-content"></div>
				</div>
			</div>
		<?php
	}
	/**
	 * Get array of Kadence Blocks.
	 */
	public function blocks_array() {
		$blocks = array(
			'kadence/rowlayout'   => array(
				'slug'  => 'kadence/rowlayout',
				'name'  => __( 'Row Layout', 'kadence-blocks' ),
				'desc'  => __( 'Create rows with nested blocks either in columns or as a container. Give style to your rows with background, overlay, padding, etc.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/rowlayout.jpg',
			),
			'kadence/form'        => array(
				'slug'  => 'kadence/form',
				'name'  => __( 'Form', 'kadence-blocks' ),
				'desc'  => __( 'Create a contact form or marketing form and style it within the block editor.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/form-block.jpg',
			),
			'kadence/advancedgallery' => array(
				'slug'  => 'kadence/advancedgallery',
				'name'  => __( 'Advanced Gallery', 'kadence-blocks' ),
				'desc'  => __( 'Photo galleries, carousels, and sliders! Enable custom links, captions, and more. Plus, you can select image sizes.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/gallery-block.jpg',
			),
			'kadence/advancedbtn' => array(
				'slug'  => 'kadence/advancedbtn',
				'name'  => __( 'Advanced Button', 'kadence-blocks' ),
				'desc'  => __( 'Create an advanced button or a row of buttons. Style each one including hover controls plus you can use an icon and display them side by side', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/btn.jpg',
			),
			'kadence/icon'        => array(
				'slug'  => 'kadence/icon',
				'name'  => __( 'Icon', 'kadence-blocks' ),
				'desc'  => __( 'Choose from over 1500+ SVG Icons to add into your page and style the size, colors, background, border, etc.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/icon.jpg',
			),
			'kadence/spacer'      => array(
				'slug'  => 'kadence/spacer',
				'name'  => __( 'Spacer/Divider', 'kadence-blocks' ),
				'desc'  => __( 'Easily create a divider and determine the space around it or just create some space in your content.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/spacer.jpg',
			),
			'kadence/advancedheading'      => array(
				'slug'  => 'kadence/advancedheading',
				'name'  => __( 'Advanced Heading', 'kadence-blocks' ),
				'desc'  => __( 'Transform your headings to Advanced Headings and customize the font family (even google fonts), color, and size.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/heading.jpg',
			),
			'kadence/tabs'      => array(
				'slug'  => 'kadence/tabs',
				'name'  => __( 'Tabs', 'kadence-blocks' ),
				'desc'  => __( 'Create custom vertical or horizontal tabs with advanced styling controls. Each tab content is an empty canvas able to contain any other blocks.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/tabs.jpg',
			),
			'kadence/infobox'      => array(
				'slug'  => 'kadence/infobox',
				'name'  => __( 'Info Box', 'kadence-blocks' ),
				'desc'  => __( 'Create a box link containing an icon or image and optionally a title, description, and learn more text. Style static and hover colors even show a box-shadow.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/infobox.jpg',
			),
			'kadence/accordion'      => array(
				'slug'  => 'kadence/accordion',
				'name'  => __( 'Accordion', 'kadence-blocks' ),
				'desc'  => __( 'Create beautiful accordions! Each pane can contain any other block, customize title styles, content background, and borders.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/accordion.jpg',
			),
			'kadence/iconlist'      => array(
				'slug'  => 'kadence/iconlist',
				'name'  => __( 'Icon List', 'kadence-blocks' ),
				'desc'  => __( 'Add beautiful icons to your lists and make them more engaging. Over 1500 icons to choose from and unlimited styles.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/iconlist.jpg',
			),
			'kadence/testimonials'      => array(
				'slug'  => 'kadence/testimonials',
				'name'  => __( 'Testimonials', 'kadence-blocks' ),
				'desc'  => __( 'Create confidence in your brand or product by showing off beautiful unique testimonials, add as a carousel or a grid.', 'kadence-blocks' ),
				'image' => KADENCE_BLOCKS_URL . 'dist/settings/img/testimonials.jpg',
			),
		);
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
			$current_settings = array();
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
			$unregistered_blocks = array();
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
			$editor_widths = array();
		}
		$editor_widths['post_default'] = $default;

		update_option( 'kt_blocks_editor_width', $editor_widths );
		return wp_send_json_success();
	}
	/**
	 * Add settings link
	 */
	public function settings_link() {
		return apply_filters( 'kadence-blocks-settings-url', admin_url( 'options-general.php?page=kadence_blocks' ) );
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
