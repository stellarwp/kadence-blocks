<?php
/**
 * Enqueue admin CSS/JS and edit width functions
 *
 * @since   1.0.0
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;


/**
 * Setup the post type options for post blocks.
 *
 * @return array
 */
function kadence_blocks_get_post_types( $other_args = array() ) {
	$args = array(
		'public'       => true,
		'show_in_rest' => true,
	);
	if ( ! empty( $other_args ) ) {
		$args = array_merge( $args, $other_args );
	}
	$post_types = get_post_types( $args, 'objects' );
	$output = array();
	foreach ( $post_types as $post_type ) {
		// if ( 'product' == $post_type->name || 'attachment' == $post_type->name ) {
		// 	continue;
		// }
		if ( 'attachment' == $post_type->name ) {
			continue;
		}
		$output[] = array(
			'value' => $post_type->name,
			'label' => $post_type->label,
		);
	}
	return apply_filters( 'kadence_blocks_post_types', $output );
}

/**
 * Add a filter that matches for custom font filter.
 */
function kadence_blocks_convert_custom_fonts() {
	if ( ! is_admin() ) {
		return;
	}
	$convert_fonts = apply_filters( 'kadence_blocks_add_custom_fonts', [] );
	if ( ! empty( $convert_fonts ) && is_array( $convert_fonts ) ) {
		add_filter(
			'kadence_blocks_custom_fonts',
			function( $custom_fonts ) use( $convert_fonts ) {
				foreach ( $convert_fonts as $font_name => $args ) {
					$weights_arg = [];
					if ( is_array( $args ) && isset( $args['weights'] ) && is_array( $args['weights'] ) ) {
						$weights_arg = $args['weights'];
					}
					$font_slug = ( is_array( $args ) && isset( $args['fallback'] ) && ! empty( $args['fallback'] ) ? '"' . $font_name . '", ' . $args['fallback'] : $font_name );

					$font_entry = [
						'name'    => $font_slug,
						'weights' => $weights_arg,
						'styles'  => [],
					];
					if ( is_array( $args ) && isset( $args['label'] ) && ! empty( $args['label'] ) ) {
						$font_entry['label'] = $args['label'];
					}
					$custom_fonts[ $font_slug ] = $font_entry;
				}
				return $custom_fonts;
			},
			10
		);
	}
}
add_filter( 'init', 'kadence_blocks_convert_custom_fonts', 11 );

/**
 * Callback for the excerpt_length filter used by
 * the Latest Posts block at render time.
 *
 * @return int Returns the global $kadence_blocks_post_block_get_excerpt_length variable
 *             to allow the excerpt_length filter respect the Latest Block setting.
 */
function kadence_blocks_post_block_get_excerpt_length() {
	global $kadence_blocks_post_block_get_excerpt_length;
	return $kadence_blocks_post_block_get_excerpt_length;
}
/**
 * Add global styles into the backend editor.
 */
function kadence_blocks_add_global_gutenberg_inline_styles() {
	global $content_width;
	$font_sizes = array(
		'sm' => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)',
		'md' => 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
		'lg' => 'clamp(1.75rem, 1.576rem + 0.543vw, 2rem)',
		'xl' => 'clamp(2.25rem, 1.728rem + 1.63vw, 3rem)',
		'xxl' => 'clamp(2.5rem, 1.456rem + 3.26vw, 4rem)',
		'xxxl' => 'clamp(2.75rem, 0.489rem + 7.065vw, 6rem)',
	);
	$font_sizes = apply_filters( 'kadence_blocks_variable_font_sizes', $font_sizes );
	$css = ':root {';
	foreach ( $font_sizes as $key => $value ) {
		$css .= '--global-kb-font-size-' . $key . ':' . $value . ';';
	}
	$css .= '}';
	if ( isset( $content_width ) ) {
		if ( class_exists( 'Kadence\Theme' ) ) {
			$css .= '.kb-header-container, .wp-block-kadence-navigation-link { --global-content-width:' . \Kadence\kadence()->sub_option( 'content_width', 'size' ) . \Kadence\kadence()->sub_option( 'content_width', 'unit' ) . ';}';
			$css .= '.editor-styles-wrapper{ --kb-global-content-width:' . \Kadence\kadence()->sub_option( 'content_width', 'size' ) . \Kadence\kadence()->sub_option( 'content_width', 'unit' ) . ';}';
			$css .= '.wp-block-kadence-rowlayout > .kb-theme-content-width {
				max-width:' . \Kadence\kadence()->sub_option( 'content_width', 'size' ) . \Kadence\kadence()->sub_option( 'content_width', 'unit' ) . ';
			}';
		} else {
			$css .= '.kb-header-container, .wp-block-kadence-navigation-link { --global-content-width: ' . absint( $content_width ) . 'px;}';
			$css .= '.editor-styles-wrapper{ --kb-global-content-width:' . absint( $content_width ) . 'px;}';
			$css .= '.wp-block-kadence-rowlayout > .kb-theme-content-width {
				max-width:' . esc_attr( $content_width ) . 'px;
			}';
		}
	} else {
		$css .= '.editor-styles-wrapper{ --kb-global-content-width:var(--wp--style--global--content-size);}';
		$css .= '.wp-block-kadence-rowlayout > .kb-theme-content-width {
			max-width:var(--wp--style--global--content-size);
		}';
		$css .= '.kb-header-container { --global-content-width: var(--wp--style--global--wide-size, var(--wp--style--global--content-size)) }';
	}
	$css .= ':root {
		--global-kb-spacing-xxs: 0.5rem;
		--global-kb-spacing-xs: 1rem;
		--global-kb-spacing-sm: 1.5rem;
		--global-kb-spacing-md: 2rem;
		--global-kb-spacing-lg: 3rem;
		--global-kb-spacing-xl: 4rem;
		--global-kb-spacing-xxl: 5rem;
		--global-kb-spacing-3xl: 6.5rem;
		--global-kb-spacing-4xl: 8rem;
		--global-kb-spacing-5xl: 10rem;
		--global-row-edge-sm: 15px;
		--global-row-edge-theme: var(--global-content-edge-padding);
		--global-kb-gutter-sm: 1rem;
		--global-kb-gutter-md: 2rem;
		--global-kb-gutter-lg: 3rem;
		--global-kb-gutter-xl: 5rem;
		--global-kb-editor-admin-sidebar: 0px;
		--global-kb-editor-sidebar: 0px;
		--global-kb-editor-sidebar-secondary: 0px;
		--global-kb-editor-full-width: calc( 100vw - ( var(--global-kb-editor-sidebar) +  var(--global-kb-editor-sidebar-secondary) +  var(--global-kb-editor-admin-sidebar) ) );
	}';
	// When not using an Iframe we need to add the sidebar width.
	$css .= '.interface-interface-skeleton:has(.interface-interface-skeleton__sidebar:not(:empty)) .interface-interface-skeleton__content {
		--global-kb-editor-sidebar: 281px;
		--global-kb-editor-full-width: calc( 100vw - ( var(--global-kb-editor-sidebar) +  var(--global-kb-editor-sidebar-secondary) +  var(--global-kb-editor-admin-sidebar) ) );
	}';
	// When not using an Iframe we need to add the secondary sidebar width.
	$css .= '.interface-interface-skeleton .interface-interface-skeleton__secondary-sidebar ~ .interface-interface-skeleton__content {
		--global-kb-editor-sidebar-secondary: 351px;
		--global-kb-editor-full-width: calc( 100vw - ( var(--global-kb-editor-sidebar) +  var(--global-kb-editor-sidebar-secondary) +  var(--global-kb-editor-admin-sidebar) ) );
	}';
	$css .= 'body.block-editor-page:not(.is-fullscreen-mode) .interface-interface-skeleton .interface-interface-skeleton__content {
		--global-kb-editor-admin-sidebar: 160px;
		--global-kb-editor-full-width: calc( 100vw - ( var(--global-kb-editor-sidebar) +  var(--global-kb-editor-sidebar-secondary) +  var(--global-kb-editor-admin-sidebar) ) );
	}';
	$css .= ':root .post-content-style-boxed {
		--global-row-edge-theme: calc( var(--global-content-edge-padding) + 2rem);
	}';
	if ( ! class_exists( 'Kadence\Theme' ) ) {
		$global_colors = array(
			'--global-palette1' => '#3182CE',
			'--global-palette2' => '#2B6CB0',
			'--global-palette3' => '#1A202C',
			'--global-palette4' => '#2D3748',
			'--global-palette5' => '#4A5568',
			'--global-palette6' => '#718096',
			'--global-palette7' => '#EDF2F7',
			'--global-palette8' => '#F7FAFC',
			'--global-palette9' => '#ffffff',
		);
		$global_colors = apply_filters( 'kadence_blocks_pattern_global_colors', $global_colors );
		$css .= ':root {';
		foreach ( $global_colors as $key => $value ) {
			$css .= esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
		}
		$css .= '}';
	}
	wp_register_style( 'kadence-blocks-global-editor-styles', false );
	wp_add_inline_style( 'kadence-blocks-global-editor-styles', $css );
}
add_action( 'admin_init', 'kadence_blocks_add_global_gutenberg_inline_styles', 1 );
/**
 * Connects Block styles to core block style so it loads in full size editing context.
 * This is a workaround so dynamic css can be loaded in Iframe and FSE mode.
 */
function kadence_blocks_update_global_gutenberg_inline_styles_dependencies() {
	$wp_styles = wp_styles();
	$style     = $wp_styles->query( 'wp-block-library', 'registered' );
	if ( ! $style ) {
		return;
	}
	if (
		wp_style_is( 'kadence-blocks-global-editor-styles', 'registered' ) &&
		! in_array( 'kadence-blocks-global-editor-styles', $style->deps, true )
	) {
		$style->deps[] = 'kadence-blocks-global-editor-styles';
	}
}
add_action( 'admin_init', 'kadence_blocks_update_global_gutenberg_inline_styles_dependencies', 2 );
/**
 * Add global styles into the frontend.
 */
function kadence_blocks_add_global_gutenberg_styles_frontend() {
	$font_sizes = array(
		'sm' => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)',
		'md' => 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
		'lg' => 'clamp(1.75rem, 1.576rem + 0.543vw, 2rem)',
		'xl' => 'clamp(2.25rem, 1.728rem + 1.63vw, 3rem)',
		'xxl' => 'clamp(2.5rem, 1.456rem + 3.26vw, 4rem)',
		'xxxl' => 'clamp(2.75rem, 0.489rem + 7.065vw, 6rem)',
	);
	$font_sizes = apply_filters( 'kadence_blocks_variable_font_sizes', $font_sizes );
	$css = ':root {';
	foreach ( $font_sizes as $key => $value ) {
		$css .= '--global-kb-font-size-' . $key . ':' . $value . ';';
	}
	$css .= '}';
	if ( ! class_exists( 'Kadence\Theme' ) ) {
		$global_colors = array(
			'--global-palette1' => '#3182CE',
			'--global-palette2' => '#2B6CB0',
			'--global-palette3' => '#1A202C',
			'--global-palette4' => '#2D3748',
			'--global-palette5' => '#4A5568',
			'--global-palette6' => '#718096',
			'--global-palette7' => '#EDF2F7',
			'--global-palette8' => '#F7FAFC',
			'--global-palette9' => '#ffffff',
		);
		$global_colors = apply_filters( 'kadence_blocks_pattern_global_colors', $global_colors );
		$css .= ':root {';
		foreach ( $global_colors as $key => $value ) {
			$css .= esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
		}
		$css .= '}';
	}

	// This is a temp fix for restored316 upgrade issue.
	if ( get_option( 'stylesheet' ) === 'restored316-journey' ) {
		$css .= '.kt-blocks-carousel-init[data-slider-dots=true].is-overflow {';
		$css .= 'margin-bottom:0px';
		$css .= '}';
	}
	wp_register_style( 'kadence-blocks-global-variables', false );
	wp_enqueue_style( 'kadence-blocks-global-variables' );
	wp_add_inline_style( 'kadence-blocks-global-variables', $css );
}
add_action( 'wp_enqueue_scripts', 'kadence_blocks_add_global_gutenberg_styles_frontend', 90 );


/**
 * Add class to match editor width.
 *
 * @param string $classes string of body classes.
 */
function kadence_blocks_admin_body_class( $classes ) {
	$screen = get_current_screen();
	if ( 'post' == $screen->base ) {
		global $post;
		$editorwidth = get_post_meta( $post->ID, 'kt_blocks_editor_width', true );
		if ( isset( $editorwidth ) && ! empty( $editorwidth ) && 'default' !== $editorwidth ) {
			$classes .= ' kt-editor-width-' . esc_attr( $editorwidth );
		} else {
			$classes .= ' kt-editor-width-default';
		}
	}
	return $classes;
}
add_filter( 'admin_body_class', 'kadence_blocks_admin_body_class' );

/**
 * Add block category for Kadence Blocks.
 *
 * @param array  $categories the array of block categories.
 * @param object $post the post object.
 */
function kadence_blocks_block_category( $categories, $post ) {
	return array_merge(
		array(
			array(
				'slug'  => 'kadence-blocks',
				'title' => __( 'Kadence Blocks', 'kadence-blocks' ),
			),
		),
		$categories
	);
}

/**
 * Add old categories filter if needed.
 */
function kadence_blocks_check_for_old_wp_block_category_filter() {
	if ( version_compare( get_bloginfo( 'version' ), '5.8', '<' ) ) {
		add_filter( 'block_categories', 'kadence_blocks_block_category', 10, 2 );
	}
}
add_action( 'init', 'kadence_blocks_check_for_old_wp_block_category_filter' );
/**
 * Add block category for Kadence Blocks.
 *
 * @param array  $categories the array of block categories.
 * @param WP_Block_Editor_Context $block_editor_context The current block editor context.
 */
function kadence_blocks_block_category_all( $categories, $block_editor_context ) {
	return array_merge(
		array(
			array(
				'slug'  => 'kadence-blocks',
				'title' => __( 'Kadence Blocks', 'kadence-blocks' ),
			),
		),
		$categories
	);
}
add_filter( 'block_categories_all', 'kadence_blocks_block_category_all', 10, 2 );

/**
 * Get other templates (e.g. product attributes) passing attributes and including the file.
 *
 * @param string $template_name Template name.
 * @param array  $args          Arguments. (default: array).
 * @param string $template_path Template path. (default: '').
 * @param string $default_path  Default path. (default: '').
 */
function kadence_blocks_get_template( $template_name, $args = array(), $template_path = '', $default_path = '' ) {
	$cache_key = sanitize_key( implode( '-', array( 'template', $template_name, $template_path, $default_path, KADENCE_BLOCKS_VERSION ) ) );
	$template  = (string) wp_cache_get( $cache_key, 'kadence-blocks' );

	if ( ! $template ) {
		$template = kadence_blocks_locate_template( $template_name, $template_path, $default_path );
		wp_cache_set( $cache_key, $template, 'kadence-blocks' );
	}

	// Allow 3rd party plugin filter template file from their plugin.
	$filter_template = apply_filters( 'kadence_blocks_get_template', $template, $template_name, $args, $template_path, $default_path );

	if ( $filter_template !== $template ) {
		if ( ! file_exists( $filter_template ) ) {
			return;
		}
		$template = $filter_template;
	}

	$action_args = array(
		'template_name' => $template_name,
		'template_path' => $template_path,
		'located'       => $template,
		'args'          => $args,
	);

	if ( ! empty( $args ) && is_array( $args ) ) {
		if ( isset( $args['action_args'] ) ) {
			unset( $args['action_args'] );
		}
		extract( $args ); // @codingStandardsIgnoreLine
	}

	do_action( 'kadence_blocks_before_template_part', $action_args['template_name'], $action_args['template_path'], $action_args['located'], $action_args['args'] );

	include $action_args['located'];

	do_action( 'kadence_blocks_after_template_part', $action_args['template_name'], $action_args['template_path'], $action_args['located'], $action_args['args'] );
}
/**
 * Like kadence_blocks_get_template, but returns the HTML instead of outputting.
 *
 * @see kadence_blocks_get_template
 * @param string $template_name Template name.
 * @param array  $args          Arguments. (default: array).
 * @param string $template_path Template path. (default: '').
 * @param string $default_path  Default path. (default: '').
 *
 * @return string
 */
function kadence_blocks_get_template_html( $template_name, $args = array(), $template_path = '', $default_path = '' ) {
	ob_start();
	kadence_blocks_get_template( $template_name, $args, $template_path, $default_path );
	return ob_get_clean();
}
/**
 * Locate a template and return the path for inclusion.
 *
 * This is the load order:
 *
 * yourtheme/$template_path/$template_name
 * yourtheme/$template_name
 * $default_path/$template_name
 *
 * @param string $template_name Template name.
 * @param string $template_path Template path. (default: '').
 * @param string $default_path  Default path. (default: '').
 * @return string
 */
function kadence_blocks_locate_template( $template_name, $template_path = '', $default_path = '' ) {
	if ( ! $template_path ) {
		$template_path = apply_filters( 'kadence_blocks_template_path', 'kadence-blocks/' );
	}

	if ( ! $default_path ) {
		$default_path = KADENCE_BLOCKS_PATH . 'includes/templates/';
	}

	// Look within passed path within the theme - this is priority.
	$template = locate_template(
		array(
			trailingslashit( $template_path ) . $template_name,
			$template_name,
		)
	);
	// Check depreciated path template.
	if ( ! $template ) {
		$template_path = 'kadenceblocks/';
		$template = locate_template(
			array(
				trailingslashit( $template_path ) . $template_name,
				$template_name,
			)
		);
	}
	// Get default template/.
	if ( ! $template ) {
		$template = $default_path . $template_name;
	}

	// Return what we found.
	return apply_filters( 'kadence_blocks_locate_template', $template, $template_name, $template_path );
}
/**
 * Print an SVG Icon
 *
 * @param string $icon the icon name.
 * @param string $icon_title the icon title for screen readers.
 * @param bool   $base if the baseline class should be added.
 */
function kadence_blocks_print_icon( $icon = 'arrow-right-alt', $icon_title = '', $base = true ) {
	echo kadence_blocks_get_icon( $icon, $icon_title, $base ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
/**
 * Get an SVG Icon
 *
 * @param string $icon the icon name.
 * @param string $icon_title the icon title for screen readers.
 * @param bool   $base if the baseline class should be added.
 */
function kadence_blocks_get_icon( $icon = 'arrow-right-alt', $icon_title = '', $base = true, $aria = false ) {
	$display_title = apply_filters( 'kadence_svg_icons_have_title', true );
	$output = '<span class="kadence-svg-iconset' . ( $base ? ' svg-baseline' : '' ) . '">';
	switch ( $icon ) {
		case 'arrow-right-alt':
			$output .= '<svg' . ( ! $aria ? ' aria-hidden="true"' : '' ) . ' class="kadence-svg-icon kadence-arrow-right-alt-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28">';
			if ( $display_title ) {
				$output .= '<title>' . ( ! empty( $icon_title ) ? $icon_title : esc_html__( 'Continue', 'kadence-blocks' ) ) . '</title>';
			}
			$output .= '<path d="M27 13.953c0 0.141-0.063 0.281-0.156 0.375l-6 5.531c-0.156 0.141-0.359 0.172-0.547 0.094-0.172-0.078-0.297-0.25-0.297-0.453v-3.5h-19.5c-0.281 0-0.5-0.219-0.5-0.5v-3c0-0.281 0.219-0.5 0.5-0.5h19.5v-3.5c0-0.203 0.109-0.375 0.297-0.453s0.391-0.047 0.547 0.078l6 5.469c0.094 0.094 0.156 0.219 0.156 0.359v0z"></path>
			</svg>';
			break;
		default:
			$output .= '';
			break;
	}
	$output .= '</span>';

	$output = apply_filters( 'kadence_svg_icon', $output, $icon, $icon_title, $base );

	return $output;
}
/**
 * Convert the post ID in Kadence Form's block.
 *
 * @see https://onthegosystems.myjetbrains.com/youtrack/issue/wpmlcore-7207
 *
 * @param array $block the filtered block.
 */
function wpmlcore_7207_fix_kadence_form_block( array $block ) {
	if ( 'kadence/form' === $block['blockName'] && class_exists( 'WPML\PB\Gutenberg\ConvertIdsInBlock\Composite' ) && class_exists( 'WPML\PB\Gutenberg\ConvertIdsInBlock\TagAttributes' ) && class_exists( 'WPML\PB\Gutenberg\ConvertIdsInBlock\BlockAttributes' ) ) {
		$slug      = get_post_type();
		$converter = new WPML\PB\Gutenberg\ConvertIdsInBlock\Composite(
			array(
				new WPML\PB\Gutenberg\ConvertIdsInBlock\TagAttributes(
					array(
						array(
							'xpath' => '//*[@name="_kb_form_post_id"]/@value',
							'slug' => $slug,
							'type' => 'post',
						),
					)
				),
				new WPML\PB\Gutenberg\ConvertIdsInBlock\BlockAttributes(
					array(
						array(
							'name' => 'postID',
							'slug' => $slug,
							'type' => 'post',
						),
					)
				),
			)
		);
		return $converter->convert( $block );
	}
	return $block;
}
add_filter( 'render_block_data', 'wpmlcore_7207_fix_kadence_form_block' );

/**
 * Setup the post select API endpoint.
 *
 * @return void
 */
function kadence_blocks_register_api_endpoints() {
	$mailerlite_controller = new Kadence_MailerLite_REST_Controller();
	$mailerlite_controller->register_routes();
	$getresponse_controller = new Kadence_GetResponse_REST_Controller();
	$getresponse_controller->register_routes();
	$fluentcrm_controller = new Kadence_FluentCRM_REST_Controller();
	$fluentcrm_controller->register_routes();
	$posts_controller = new Kadence_Blocks_Post_Rest_Controller();
	$posts_controller->register_routes();
	$lottieanimation_controller_get = new Kadence_LottieAnimation_get_REST_Controller();
	$lottieanimation_controller_get->register_routes();
	$lottieanimation_controller_upload = new Kadence_LottieAnimation_post_REST_Controller();
	$lottieanimation_controller_upload->register_routes();
	$vector_controller_upload = new Kadence_Vector_post_REST_Controller();
	$vector_controller_upload->register_routes();
	$design_library_controller_upload = new Kadence_Blocks_Prebuilt_Library_REST_Controller();
	$design_library_controller_upload->register_routes();
	$image_picker_controller_upload = new Kadence_Blocks_Image_Picker_REST_Controller();
	$image_picker_controller_upload->register_routes();
}
add_action( 'rest_api_init', 'kadence_blocks_register_api_endpoints' );

/**
 * Register the lotte post type.
 */
function kadence_blocks_register_lottie_custom_post_type() {
	register_post_type(
		'kadence_lottie',
		array(
			'label'        => _x( 'Lottie Animations', 'Lottie animation', 'kadence-blocks' ),
			'description'  => __( 'Lottie Animations imported in Kadence', 'kadence-blocks' ),
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => false,
			'show_in_rest' => true,
			'rewrite'      => false,
			'capabilities' => array(
				'read'                   => 'edit_theme_options',
				'create_posts'           => 'edit_theme_options',
				'edit_posts'             => 'edit_theme_options',
				'edit_published_posts'   => 'edit_theme_options',
				'delete_published_posts' => 'edit_theme_options',
				'edit_others_posts'      => 'edit_theme_options',
				'delete_others_posts'    => 'edit_theme_options',
			),
			'map_meta_cap' => true,
			'supports'     => array(
				'title',
				'editor',
				'revisions',
			),
		)
	);
}

add_action( 'init', 'kadence_blocks_register_lottie_custom_post_type' );

/**
 * Register the vector post type.
 */
function kadence_blocks_register_vector_custom_post_type() {
	register_post_type(
		'kadence_vector',
		array(
			'label'        => _x( 'Vector SVGs', 'post type for kadence vector svg block', 'kadence-blocks' ),
			'description'  => __( 'Vector SVGs imported in Kadence', 'kadence-blocks' ),
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => false,
			'show_in_rest' => true,
			'rewrite'      => false,
			'capabilities' => array(
				'read'                   => 'edit_theme_options',
				'create_posts'           => 'edit_theme_options',
				'edit_posts'             => 'edit_theme_options',
				'edit_published_posts'   => 'edit_theme_options',
				'delete_published_posts' => 'edit_theme_options',
				'edit_others_posts'      => 'edit_theme_options',
				'delete_others_posts'    => 'edit_theme_options',
			),
			'map_meta_cap' => true,
			'supports'     => array(
				'title',
				'editor',
				'revisions',
			),
		)
	);
}

add_action( 'init', 'kadence_blocks_register_vector_custom_post_type' );

/* Sashicons are not enqueue by default when iFraming in block editor
   https://github.com/WordPress/gutenberg/issues/53528
*/
add_action('enqueue_block_assets', function (): void {
	if( is_admin() ) {
		wp_enqueue_style( 'dashicons' );
	}
});


/**
 * Filter core to remove loading = lazy if class is present.
 */
function kadence_blocks_skip_lazy_load( $value, $image, $context ) {
	if ( 'the_content' === $context ) {
		if ( false !== strpos( $image, 'kb-skip-lazy' ) ) {
			return false; // Set to false so lazy loading attribute is omitted.
		}
	}
	return $value;
}
add_filter( 'wp_img_tag_add_loading_attr', 'kadence_blocks_skip_lazy_load', 10, 3 );


/**
 * Filter to remove block rendering when events builds their custom excerpts.
 *
 * @param bool   $enabled Whether build css or not.
 * @param string $name The block name.
 * @param string $unique_id The block unique id.
 */
function kadence_blocks_events_custom_excerpt_stop_style_output( $enabled, $name, $unique_id ) {
	return false;
}
/**
 * Filter to remove block rendering when events builds their custom excerpts.
 *
 * @param bool $remove_blocks Whether to remove blocks or not.
 * @param WP_Post $post The post object.
 */
function kadence_blocks_events_custom_excerpt_fix( $remove_blocks, $post ) {
	if ( $remove_blocks && ! is_singular() ) {
		add_filter( 'kadence_blocks_render_inline_css', 'kadence_blocks_events_custom_excerpt_stop_style_output', 10, 3 );
	}
	return $remove_blocks;
}

add_filter( 'tribe_events_excerpt_blocks_removal', 'kadence_blocks_events_custom_excerpt_fix', 99, 2 );

/**
 * Remove Filter to remove block rendering when events builds their custom excerpts.
 *
 * @param bool $remove_blocks Whether to remove blocks or not.
 * @param WP_Post $post The post object.
 */
function kadence_blocks_events_custom_excerpt_remove_fix( $html, $post ) {
	if ( ! is_singular() ) {
		remove_filter( 'kadence_blocks_render_inline_css', 'kadence_blocks_events_custom_excerpt_stop_style_output', 10, 3 );
	}
	return $html;
}
add_filter( 'tribe_events_get_the_excerpt', 'kadence_blocks_events_custom_excerpt_remove_fix', 10, 2 );
/**
 * The Kadence Blocks Application Container.
 *
 * @see kadence_blocks_init()
 *
 * @note kadence_blocks_init() must be called before this one.
 *
 * @return ContainerInterface
 * @throws InvalidArgumentException
 */
function kadence_blocks(): ContainerInterface {
	return App::instance()->container();
}
