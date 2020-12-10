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

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function kadence_gutenberg_editor_assets() {
	// If in the frontend, bail out.
	if ( ! is_admin() ) {
		return;
	}

	// Scripts.
	wp_register_script( 'kadence-blocks-js', KADENCE_BLOCKS_URL . 'dist/build/blocks.js', array( 'lodash', 'react', 'react-dom', 'wp-element', 'wp-polyfill', 'wp-primitives', 'wp-api' ), KADENCE_BLOCKS_VERSION, true );
	//'wp-api-fetch', 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-api', 'wp-edit-post'
	$editor_widths  = get_option( 'kt_blocks_editor_width', array() );
	$sidebar_size   = 750;
	$nosidebar_size = 1140;
	$jssize         = 2000;
	if ( ! isset( $editor_widths['enable_editor_width'] ) || 'true' === $editor_widths['enable_editor_width'] ) {
		$add_size = 30;
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
	if ( current_user_can( apply_filters( 'kadence_blocks_admin_role', 'manage_options' ) ) ) {
		$userrole = 'admin';
	} else if ( current_user_can( apply_filters( 'kadence_blocks_editor_role', 'delete_others_pages' ) ) ) {
		$userrole = 'editor';
	} else if ( current_user_can( apply_filters( 'kadence_blocks_author_role', 'publish_posts' ) ) ) {
		$userrole = 'author';
	} else if ( current_user_can( apply_filters( 'kadence_blocks_contributor_role', 'edit_posts' ) ) ) {
		$userrole = 'contributor';
	} else {
		$userrole = 'none';
	}
	if ( isset( $editor_widths['enable_editor_width'] ) && 'false' === $editor_widths['enable_editor_width'] ) {
		$enable_editor_width = false;
	} else {
		$enable_editor_width = true;
	}
	$gfonts_path      = KADENCE_BLOCKS_PATH . 'dist/gfonts-array.php';
	$gfont_names_path = KADENCE_BLOCKS_PATH . 'dist/gfonts-names-array.php';
	$icon_names_path  = KADENCE_BLOCKS_PATH . 'dist/icon-names-array.php';
	$icon_ico_path    = KADENCE_BLOCKS_PATH . 'dist/icon-ico-array.php';
	$icons_path       = KADENCE_BLOCKS_PATH . 'dist/icons-array.php';
	wp_localize_script(
		'kadence-blocks-js',
		'kadence_blocks_params',
		array(
			'sidebar_size'   => $sidebar_size,
			'nosidebar_size' => $nosidebar_size,
			'default_size'   => $jssize,
			'config'         => get_option( 'kt_blocks_config_blocks' ),
			'configuration'  => get_option( 'kadence_blocks_config_blocks' ),
			'settings'       => get_option( 'kadence_blocks_settings_blocks' ),
			'userrole'       => $userrole,
			'pro'            => ( class_exists( 'Kadence_Blocks_Pro' ) ? 'true' : 'false' ),
			'colors'         => get_option( 'kadence_blocks_colors' ),
			'global'         => get_option( 'kadence_blocks_global' ),
			'gutenberg'      => ( function_exists( 'gutenberg_menu' ) ? 'true' : 'false' ),
			'privacy_link'   => get_privacy_policy_url(),
			'privacy_title'  => ( get_option( 'wp_page_for_privacy_policy' ) ? get_the_title( get_option( 'wp_page_for_privacy_policy' ) ) : '' ),
			'editor_width'   => apply_filters( 'kadence_blocks_editor_width', $enable_editor_width ),
			'isKadenceT'     => class_exists( 'Kadence\Theme' ),
			'headingWeights' => class_exists( 'Kadence\Theme' ) ? kadence_blocks_get_headings_weights() : null,
			'buttonWeights'  => class_exists( 'Kadence\Theme' ) ? kadence_blocks_get_button_weights() : null,
			// 'g_fonts'        => file_exists( $gfonts_path ) ? include $gfonts_path : array(),
			// 'g_font_names'   => file_exists( $gfont_names_path ) ? include $gfont_names_path : array(),
			// 'icon_names'     => file_exists( $icon_names_path ) ? include $icon_names_path : array(),
			// 'icons_ico'      => file_exists( $icon_ico_path ) ? include $icon_ico_path : array(),
			// 'icons_fa'       => file_exists( $icons_path ) ? include $icons_path : array(),
		)
	);
	// Styles.
	wp_register_style( 'kadence-blocks-editor-css', KADENCE_BLOCKS_URL . 'dist/build/blocks.css', array( 'wp-edit-blocks' ), KADENCE_BLOCKS_VERSION );
	// Limited Margins removed
	// $editor_widths = get_option( 'kt_blocks_editor_width', array() );
	// if ( isset( $editor_widths['limited_margins'] ) && 'true' === $editor_widths['limited_margins'] ) {
	// 	wp_enqueue_style( 'kadence-blocks-limited-margins-css', KADENCE_BLOCKS_URL . 'dist/limited-margins.css', array( 'wp-edit-blocks' ), KADENCE_BLOCKS_VERSION );
	// }
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'kadence-blocks-js', 'kadence-blocks' );
	}
}
add_action( 'init', 'kadence_gutenberg_editor_assets' );

/**
 * Get an array font weight options.
 */
function kadence_blocks_get_headings_weights() {
	$weights = array();
	if ( function_exists( 'Kadence\kadence' ) ) {
		$heading_font = \Kadence\kadence()->option( 'heading_font' );
		if ( is_array( $heading_font ) ) {
			if ( isset( $heading_font['family'] ) && ! empty( $heading_font['family'] ) && 'inherit' === $heading_font['family'] ) {
				// Inherit from Body.
				$heading_font = \Kadence\kadence()->option( 'base_font' );
			}
			if ( isset( $heading_font['google'] ) && $heading_font['google'] ) {
				// Google font.
				if ( isset( $heading_font['variant'] ) && is_array( $heading_font['variant'] ) ) {
					$new_weight_variant = array();
					foreach ( array( 'h1_font', 'h2_font', 'h3_font', 'h4_font', 'h5_font', 'h6_font' ) as $option ) {
						$variant = \Kadence\kadence()->sub_option( $option, 'weight' );
						if ( ! in_array( $variant, $new_weight_variant, true ) ) {
							array_push( $new_weight_variant, $variant );
						}
					}
					$weights[] = array( 'value' => '', 'label' => __( 'Inherit', 'kadence-blocks' ) );
					foreach ( $heading_font['variant'] as $key => $value ) {
						if ( $value === '100' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '100', 'label' => __( 'Thin 100', 'kadence-blocks' ) );
						} elseif ( $value === '200' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '200', 'label' => __( 'Extra-Light 200', 'kadence-blocks' ) );
						} elseif ( $value === '300' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '300', 'label' => __( 'Light 300', 'kadence-blocks' ) );
						} elseif ( $value === '400' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '400', 'label' => __( 'Regular', 'kadence-blocks' ) );
						} elseif ( $value === 'regular' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '400', 'label' => __( 'Regular', 'kadence-blocks' ) );
						} elseif ( $value === '500' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '500', 'label' => __( 'Medium 500', 'kadence-blocks' ) );
						} elseif ( $value === '600' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '600', 'label' => __( 'Semi-Bold 600', 'kadence-blocks' ) );
						} elseif ( $value === '700' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '700', 'label' => __( 'Bold 700', 'kadence-blocks' ) );
						} elseif ( $value === '800' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '800', 'label' => __( 'Extra-Bold 800', 'kadence-blocks' ) );
						} elseif ( $value === '900' && in_array( $value, $new_weight_variant ) ) {
							$weights[] = array( 'value' => '900', 'label' => __( 'Ultra-Bold 900', 'kadence-blocks' ) );
						}
					}
				}
			} elseif ( isset( $heading_font['family'] ) && ! empty( $heading_font['family'] ) && substr( $heading_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
				// System Font.
				$weights = array(
					array( 'value' => '', 'label' => __( 'Inherit', 'kadence-blocks' ) ),
					array( 'value' => '100', 'label' => __( 'Thin 100', 'kadence-blocks' ) ),
					array( 'value' => '200', 'label' => __( 'Extra-Light 200', 'kadence-blocks' ) ),
					array( 'value' => '300', 'label' => __( 'Light 300', 'kadence-blocks' ) ),
					array( 'value' => '400', 'label' => __( 'Regular', 'kadence-blocks' ) ),
					array( 'value' => '500', 'label' => __( 'Medium 500', 'kadence-blocks' ) ),
					array( 'value' => '600', 'label' => __( 'Semi-Bold 600', 'kadence-blocks' ) ),
					array( 'value' => '700', 'label' => __( 'Bold 700', 'kadence-blocks' ) ),
					array( 'value' => '800', 'label' => __( 'Extra-Bold 800', 'kadence-blocks' ) ),
					array( 'value' => '900', 'label' => __( 'Ultra-Bold 900', 'kadence-blocks' ) ),
				);
			}
		}
	}
	return apply_filters( 'kadence_blocks_heading_weight_options', $weights );
}
/**
 * Get an array font weight options.
 */
function kadence_blocks_get_button_weights() {
	$weights = array();
	if ( function_exists( 'Kadence\kadence' ) ) {
		$button_font = \Kadence\kadence()->option( 'buttons_typography' );
		if ( is_array( $button_font ) ) {
			if ( isset( $button_font['family'] ) && ! empty( $button_font['family'] ) && 'inherit' === $button_font['family'] ) {
				// Inherit from Body.
				$button_font = \Kadence\kadence()->option( 'base_font' );
			}
			if ( isset( $button_font['google'] ) && $button_font['google'] ) {
				$heading_font = \Kadence\kadence()->option( 'heading_font' );
				if ( isset( $heading_font['family'] ) && ! empty( $heading_font['family'] ) && $button_font['family'] === $heading_font['family'] ) {
					// Google font.
					if ( isset( $heading_font['variant'] ) && is_array( $heading_font['variant'] ) ) {
						if ( isset( $button_font['weight'] ) && ! empty( $button_font['weight'] ) ) {
							$new_weight_variant = array( $button_font['weight'] );
						} else {
							$new_weight_variant = array();
						}
						foreach ( array( 'h1_font', 'h2_font', 'h3_font', 'h4_font', 'h5_font', 'h6_font' ) as $option ) {
							$variant = \Kadence\kadence()->sub_option( $option, 'weight' );
							if ( ! in_array( $variant, $new_weight_variant, true ) ) {
								array_push( $new_weight_variant, $variant );
							}
						}
						$weights[] = array( 'value' => '', 'label' => __( 'Inherit', 'kadence-blocks' ) );
						foreach ( $heading_font['variant'] as $key => $value ) {
							if ( $value === '100' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '100', 'label' => __( 'Thin 100', 'kadence-blocks' ) );
							} elseif ( $value === '200' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '200', 'label' => __( 'Extra-Light 200', 'kadence-blocks' ) );
							} elseif ( $value === '300' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '300', 'label' => __( 'Light 300', 'kadence-blocks' ) );
							} elseif ( $value === '400' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '400', 'label' => __( 'Regular', 'kadence-blocks' ) );
							} elseif ( $value === 'regular' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '400', 'label' => __( 'Regular', 'kadence-blocks' ) );
							} elseif ( $value === '500' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '500', 'label' => __( 'Medium 500', 'kadence-blocks' ) );
							} elseif ( $value === '600' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '600', 'label' => __( 'Semi-Bold 600', 'kadence-blocks' ) );
							} elseif ( $value === '700' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '700', 'label' => __( 'Bold 700', 'kadence-blocks' ) );
							} elseif ( $value === '800' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '800', 'label' => __( 'Extra-Bold 800', 'kadence-blocks' ) );
							} elseif ( $value === '900' && in_array( $value, $new_weight_variant ) ) {
								$weights[] = array( 'value' => '900', 'label' => __( 'Ultra-Bold 900', 'kadence-blocks' ) );
							}
						}
					}
				}
			} elseif ( isset( $button_font['family'] ) && ! empty( $button_font['family'] ) && substr( $button_font['family'], 0, strlen( '-apple-system' ) ) === '-apple-system' ) {
				// System Font.
				$weights = array(
					array( 'value' => '', 'label' => __( 'Inherit', 'kadence-blocks' ) ),
					array( 'value' => '100', 'label' => __( 'Thin 100', 'kadence-blocks' ) ),
					array( 'value' => '200', 'label' => __( 'Extra-Light 200', 'kadence-blocks' ) ),
					array( 'value' => '300', 'label' => __( 'Light 300', 'kadence-blocks' ) ),
					array( 'value' => '400', 'label' => __( 'Regular', 'kadence-blocks' ) ),
					array( 'value' => '500', 'label' => __( 'Medium 500', 'kadence-blocks' ) ),
					array( 'value' => '600', 'label' => __( 'Semi-Bold 600', 'kadence-blocks' ) ),
					array( 'value' => '700', 'label' => __( 'Bold 700', 'kadence-blocks' ) ),
					array( 'value' => '800', 'label' => __( 'Extra-Bold 800', 'kadence-blocks' ) ),
					array( 'value' => '900', 'label' => __( 'Ultra-Bold 900', 'kadence-blocks' ) ),
				);
			}
		}
		//print_r( $button_font );
	}
	return apply_filters( 'kadence_blocks_button_weight_options', $weights );
}
/**
 * Get an array of visibility options.
 */
function kadence_blocks_get_user_visibility_options() {
	$specific_roles = array();
	if ( function_exists( 'get_editable_roles' ) ) {
		foreach ( get_editable_roles() as $role_slug => $role_info ) {
			$specific_roles[] = array(
				'value' => $role_slug,
				'label' => $role_info['name'],
			);
		}
	}
	return apply_filters( 'kadence_blocks_user_visibility_options', $specific_roles );
}
/**
 * Enqueue Gutenberg block assets for backend editor.
 */
function kadence_blocks_early_editor_assets() {
	if ( ! is_admin() ) {
		return;
	}
	global $pagenow;
	if ( 'post.php' === $pagenow || 'post-new.php' === $pagenow ) {
		$current_screen = get_current_screen();
		if ( method_exists( $current_screen, 'is_block_editor' ) && $current_screen->is_block_editor() ) {
			wp_localize_script(
				'kadence-blocks-js',
				'kadence_blocks_user_params',
				array(
					'userVisibility'  => kadence_blocks_get_user_visibility_options(),
				)
			);
		}
	}
}
add_action( 'current_screen', 'kadence_blocks_early_editor_assets' );
/**
 * Register Meta for blocks width
 */
function kt_blocks_init_post_meta() {

	register_post_meta(
		'',
		'kt_blocks_editor_width',
		array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'string',
		)
	);
}
add_action( 'init', 'kt_blocks_init_post_meta' );

/**
 * Add inline css editor width
 */
function kadence_blocks_admin_theme_content_width() {
	global $content_width;
	if ( isset( $content_width ) ) {
		echo '<style type="text/css" id="kt-block-content-width">';
		echo '.wp-block-kadence-rowlayout > .innerblocks-wrap.kb-theme-content-width {
			max-width:' . esc_attr( $content_width ) . 'px;
		}';
		echo '</style>';
	}
}
add_action( 'admin_head-post.php', 'kadence_blocks_admin_theme_content_width', 100 );
add_action( 'admin_head-post-new.php', 'kadence_blocks_admin_theme_content_width', 100 );
/**
 * Add inline css editor width
 */
function kadence_blocks_admin_editor_width() {
	$editor_widths = get_option( 'kt_blocks_editor_width', array() );
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
		echo '<style type="text/css" id="kt-block-editor-width">';
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
add_action( 'admin_head-post.php', 'kadence_blocks_admin_editor_width', 100 );
add_action( 'admin_head-post-new.php', 'kadence_blocks_admin_editor_width', 100 );

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
add_filter( 'block_categories', 'kadence_blocks_block_category', 10, 2 );

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

	do_action( 'kadence_blocks_before_template_part', $action_args['template_name'], $action_args['template_path'], $action_args['located'], $action_args['args'] );
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
		$template_path = apply_filters( 'kadence_blocks_template_path', 'kadenceblocks/' );
	}

	if ( ! $default_path ) {
		$default_path = KADENCE_BLOCKS_PATH . 'dist/templates/';
	}

	// Look within passed path within the theme - this is priority.
	$template = locate_template(
		array(
			trailingslashit( $template_path ) . $template_name,
			$template_name,
		)
	);

	// Get default template/.
	if ( ! $template ) {
		$template = $default_path . $template_name;
	}

	// Return what we found.
	return apply_filters( 'kadence_blocks_locate_template', $template, $template_name, $template_path );
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
	$mailerlite_controller = new Kadence_MailerLite_REST_Controller;
	$mailerlite_controller->register_routes();
}
add_action( 'rest_api_init', 'kadence_blocks_register_api_endpoints' );