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
		register_setting(
			'kadence_blocks_mailerlite_api',
			'kadence_blocks_mailerlite_api',
			array(
				'type'              => 'string',
				'description'       => __( 'MailerLite API Key', 'kadence-blocks-pro' ),
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
		<div class="kadence_blocks_dash_head">
			<div class="kadence_blocks_dash_head_container">
				<div class="kadence_blocks_dash_logo">
					<img src="<?php echo esc_url( KADENCE_BLOCKS_URL . 'dist/settings/img/kadence-logo.png' ); ?>" alt="Kadence WP">
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
							$blocks = $this->blocks_array();
							$unregistered_blocks = get_option( 'kt_blocks_unregistered_blocks', array() );
							if ( ! is_array( $unregistered_blocks ) ) {
								$unregistered_blocks = array();
							}
							foreach ( $blocks as $block_key => $block ) {
								if ( in_array( $block['slug'], $unregistered_blocks ) ) {
									$btn_enabled_class = 'button-primary kt-block-inactive';
									$enabled_class = 'kt-block-inactive';
								} else {
									$btn_enabled_class = 'kt-block-active';
									$enabled_class = 'kt-block-active';
								}
								echo '<div class="kadence_blocks_item ' . esc_attr( $enabled_class ) . '">';
								echo '<h3>' . esc_html( $block['name'] ) . '</h3>';
								echo '<p>' . wp_kses_post( $block['desc'] ) . '</p>';
								if ( in_array( $block['slug'], $unregistered_blocks ) ) {
									$btntitle = __( 'Activate', 'kadence-blocks' );
								} else {
									$btntitle = __( 'Deactivate', 'kadence-blocks' );
								}
								echo '<div class="kadence_blocks_item_footer">';
								echo '<a class="kt_block_button button ' . esc_attr( $btn_enabled_class ) . '" data-inactive-label="' . esc_attr__( 'Activate', 'kadence-blocks' ) . '" data-active-label="' . esc_attr__( 'Deactivate', 'kadence-blocks' ) . '" data-activating-label="' . esc_attr__( 'Activating...', 'kadence-blocks' ) . '" data-activated-label="' . esc_attr__( 'Activated', 'kadence-blocks' ) . '"  data-deactivating-label="' . esc_attr__( 'Deactivating...', 'kadence-blocks' ) . '"  data-deactivated-label="' . esc_attr__( 'Deactivated', 'kadence-blocks' ) . '" data-block-slug="' . esc_attr( $block['slug'] ) . '" href="#">' . esc_html( $btntitle ) . '</a>';
								echo '</div>';
								echo '</div>';
							}
							?>
						</div>
						<div class="kt-dashboard-spacer"></div>
						<?php if ( apply_filters( 'kadence_blocks_editor_width', true ) ) { ?>
							<h2><?php echo esc_html__( 'Editor Max Widths', 'kadence-blocks' ); ?><span class="kt-main-subtitle"><?php echo esc_html__( 'Match the editor width to your sites width.', 'kadence-blocks' ); ?></span></h2>
							<?php global $content_width; ?>
								<div class="kt-main-description-notice"><?php echo esc_html__( 'Note: The current active themes "content_width" is set to:', 'kadence-blocks' ) . ' ' . esc_html( $content_width ); ?>px</div>
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
					<div class="side-panel">
						<?php do_action( 'kadence_blocks_dash_side_panel' ); ?>
						<div class="community-section sidebar-section components-panel">
							<div class="components-panel__body is-opened">
								<h2><?php esc_html_e( 'Web Creators Community', 'kadence' ); ?></h2>
								<p><?php esc_html_e( 'Join our community of fellow kadence users creating effective websites! Share your site, ask a question and help others.', 'kadence' ); ?></p>
								<a href="https://www.facebook.com/groups/webcreatorcommunity" target="_blank" class="sidebar-link"><?php esc_html_e( 'Join our Facebook Group', 'kadence' ); ?></a>
							</div>
						</div>
						<div class="support-section sidebar-section components-panel">
							<div class="components-panel__body is-opened">
								<h2><?php esc_html_e( 'Documentation', 'kadence' ); ?></h2>
								<p><?php esc_html_e( 'Need help? We have a knowledge base full of articles to get you started.', 'kadence' ); ?></p>
								<a href="https://www.kadenceblocks.com/docs/" target="_blank" class="sidebar-link"><?php esc_html_e( 'Browse Docs', 'kadence' ); ?></a>
							</div>
						</div>
						<div class="support-section sidebar-section components-panel">
							<div class="components-panel__body is-opened">
								<h2><?php esc_html_e( 'Support', 'kadence' ); ?></h2>
								<p><?php esc_html_e( 'Have a question, we are happy to help! Get in touch with our support team.', 'kadence' ); ?></p>
								<a href="https://www.kadencewp.com/free-support/" target="_blank" class="sidebar-link"><?php esc_html_e( 'Submit a Ticket', 'kadence' ); ?></a>
							</div>
						</div>
						<?php do_action( 'kadence_blocks_dash_below_side_panel' ); ?>
					</div>
				</div>
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
