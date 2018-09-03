<?php
/**
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets
 *
 * @since 1.0.0
 */
function kadence_gutenberg_blocks_assets() {
	// If in the backend, bail out.
	if ( is_admin() ) {
		return;
	}
	wp_enqueue_style( 'kadence-blocks-style-css', KT_BLOCKS_URL . 'dist/blocks.style.build.css', array( 'wp-blocks' ), KT_BLOCKS_VERSION );
}
add_action( 'enqueue_block_assets', 'kadence_gutenberg_blocks_assets' );

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
	// Scripts.
	wp_enqueue_script( 'kadence-blocks-js', KT_BLOCKS_URL . 'dist/blocks.build.js', array( 'wp-blocks', 'wp-i18n', 'wp-element' ), KT_BLOCKS_VERSION, true );

	// Styles.
	wp_enqueue_style( 'kadence-blocks-editor-css', KT_BLOCKS_URL . 'dist/blocks.editor.build.css', array( 'wp-edit-blocks' ), KT_BLOCKS_VERSION );
}
add_action( 'enqueue_block_editor_assets', 'kadence_gutenberg_editor_assets' );

/**
 * Outputs extra css for blocks.
 */
function kadence_blocks_frontend_css() {
	if ( function_exists( 'the_gutenberg_project' ) && has_blocks( get_the_ID() ) ) {
		global $post;
		if ( ! is_object( $post ) ) {
			return;
		}
		$blocks = gutenberg_parse_blocks( $post->post_content );
		//print_r($blocks );
		if ( ! is_array( $blocks ) || empty( $blocks ) ) {
			return;
		}
		$css  = '<style type="text/css" media="all" id="kadence-blocks-frontend">';
		foreach ( $blocks as $indexkey => $block ) {
			if ( isset( $block['blockName'] ) ) {
				if ( 'kadence/rowlayout' === $block['blockName'] ) {
					if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
						$blockattr = $block['attrs'];
						if ( isset( $blockattr['uniqueID'] ) ) {
							// Create CSS for Row/Layout.
							$unique_id = $blockattr['uniqueID'];
							$css .= kadence_row_layout_css( $blockattr, $unique_id );
							if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
								$css .= kadence_column_layout_cycle( $block['innerBlocks'] , $unique_id );
							}
						}
					}
				}
			}
			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$css .= kadence_blocks_cycle_through( $block['innerBlocks'] );
			}
		}
		$css .= '</style>';
		echo $css;
	}
}
add_action( 'wp_head', 'kadence_blocks_frontend_css', 80 );

/**
 * Builds css for inner columns
 * 
 * @param array $inner_blocks array of inner blocks.
 */
function kadence_column_layout_cycle( $inner_blocks, $unique_id ) {
	$css = '';
	foreach ( $inner_blocks as $in_indexkey => $inner_block ) {
		if ( isset( $inner_block['blockName'] ) ) {
			if ( 'kadence/column' === $inner_block['blockName'] ) {
				if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
					$blockattr = $inner_block['attrs'];
					$csskey = $in_indexkey + 1;
					$css .= kadence_column_layout_css( $blockattr, $unique_id, $csskey );
				}
			}
		}
	}
	return $css;
}
/**
 * Builds css for inner blocks
 * 
 * @param array $inner_blocks array of inner blocks.
 */
function kadence_blocks_cycle_through( $inner_blocks ) {
	$css = '';
	foreach ( $inner_blocks as $in_indexkey => $inner_block ) {
		if ( isset( $inner_block['blockName'] ) ) {
			if ( 'kadence/rowlayout' === $inner_block['blockName'] ) {
				if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
					$blockattr = $inner_block['attrs'];
					if ( isset( $blockattr['uniqueID'] ) ) {
						// Create CSS for Row/Layout.
						$unique_id = $blockattr['uniqueID'];
						$css .= kadence_row_layout_css( $blockattr, $unique_id );
					}
				}
			}
		}
		if ( isset( $inner_block['innerBlocks'] ) && ! empty( $inner_block['innerBlocks'] ) && is_array( $inner_block['innerBlocks'] ) ) {
			$css .= kadence_blocks_cycle_through( $inner_block['innerBlocks'] );
		}
	}
	return $css;
}

/**
 * Builds Css for row layout block.
 * 
 * @param array  $attr the blocks attr.
 * @param string $unique_id the blocks attr ID.
 */
function kadence_row_layout_css( $attr, $unique_id ) {
	$css = '';
	if ( isset( $attr['bgColor'] ) || isset( $attr['bgImg'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) ) {
		$css .= '#kt-layout-id' . $unique_id . ' {';
		if ( isset( $attr['topMargin'] ) ) {
			$css .= 'margin-top:' . $attr['topMargin'] . 'px;';
		}
		if ( isset( $attr['bottomMargin'] ) ) {
			$css .= 'margin-bottom:' . $attr['bottomMargin'] . 'px;';
		}
		if ( isset( $attr['bgColor'] ) ) {
			$css .= 'background-color:' . $attr['bgColor'] . ';';
		}
		if ( isset( $attr['bgImg'] ) ) {
			$css .= 'background-image:url(' . $attr['bgImg'] . ');';
			$css .= 'background-size:' . ( isset( $attr['bgImgSize'] ) ? $attr['bgImgSize'] : 'cover' ) . ';';
			$css .= 'background-position:' . ( isset( $attr['bgImgPosition'] ) ? $attr['bgImgPosition'] : 'center center' ) . ';';
			$css .= 'background-attachment:' . ( isset( $attr['bgImgAttachment'] ) ? $attr['bgImgAttachment'] : 'scroll' ) . ';';
			$css .= 'background-repeat:' . ( isset( $attr['bgImgRepeat'] ) ? $attr['bgImgRepeat'] : 'no-repeat' ) . ';';
		}
		$css .= '}';
	}
	if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['minHeight'] ) ||  isset( $attr['maxWidth'] ) ) {
		$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap {';
			if ( isset( $attr['topPadding'] ) ) {
				$css .= 'padding-top:' . $attr['topPadding'] . 'px;';
			}
			if ( isset( $attr['bottomPadding'] ) ) {
				$css .= 'padding-bottom:' . $attr['bottomPadding'] . 'px;';
			}
			if ( isset( $attr['leftPadding'] ) ) {
				$css .= 'padding-left:' . $attr['leftPadding'] . 'px;';
			}
			if ( isset( $attr['rightPadding'] ) ) {
				$css .= 'padding-right:' . $attr['rightPadding'] . 'px;';
			}
			if ( isset( $attr['minHeight'] ) ) {
				$css .= 'min-height:' . $attr['minHeight'] . 'px;';
			}
			if ( isset( $attr['maxWidth'] ) ) {
				$css .= 'max-width:' . $attr['maxWidth'] . 'px;';
				$css .= 'margin-left:auto;';
				$css .= 'margin-right:auto;';
			}
		$css .= '}';
	}
	if ( isset( $attr['overlay'] ) || isset( $attr['overlayBgImg'] ) || isset( $attr['overlaySecond'] ) ) {
		$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-layout-overlay {';
			if ( isset( $attr['overlayOpacity'] ) ) {
				if ( $attr['overlayOpacity'] < 10 ) {
					$css .= 'opacity:0.0' . $attr['overlayOpacity'] . ';';
				} else if ( $attr['overlayOpacity'] >= 100 ) {
					$css .= 'opacity:1;';
				} else {
					$css .= 'opacity:0.' . $attr['overlayOpacity'] . ';';
				}
			}
			if ( isset( $attr['currentOverlayTab'] ) && 'grad' == $attr['currentOverlayTab'] ) {
				$type = ( isset( $attr['overlayGradType'] ) ? $attr['overlayGradType'] : 'linear');
				if ( 'radial' === $type ) {
					$angle = ( isset( $attr['overlayBgImgPosition'] ) ? 'at ' . $attr['overlayBgImgPosition'] : 'at center center' );
				} else {
					$angle = ( isset( $attr['overlayGradAngle'] ) ? $attr['overlayGradAngle'] . 'deg' : '180deg');
				}
				$loc = ( isset( $attr['overlayGradLoc'] ) ? $attr['overlayGradLoc'] : '0');
				$color = ( isset( $attr['overlay'] ) ? $attr['overlay'] : 'transparent');
				$locsecond = ( isset( $attr['overlayGradLocSecond'] ) ? $attr['overlayGradLocSecond'] : '100');
				$colorsecond = ( isset( $attr['overlaySecond'] ) ? $attr['overlaySecond'] : '#00B5E2');
				$css .= 'background-image: ' . $type . '-gradient(' . $angle. ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%);';
			} else {
				if ( isset( $attr['overlay'] ) ) {
					$css .= 'background-color:' . $attr['overlay'] . ';';
				}
				if ( isset( $attr['overlayBgImg'] ) ) {
					$css .= 'background-image:url(' . $attr['overlayBgImg'] . ');';
					$css .= 'background-size:' . ( isset( $attr['overlayBgImgSize'] ) ? $attr['overlayBgImgSize'] : 'cover' ) . ';';
					$css .= 'background-position:' . ( isset( $attr['overlayBgImgPosition'] ) ? $attr['overlayBgImgPosition'] : 'center center' ) . ';';
					$css .= 'background-attachment:' . ( isset( $attr['overlayBgImgAttachment'] ) ? $attr['overlayBgImgAttachment'] : 'scroll' ) . ';';
					$css .= 'background-repeat:' . ( isset( $attr['overlayBgImgRepeat'] ) ? $attr['overlayBgImgRepeat'] : 'no-repeat' ) . ';';
				}
			}
			if ( isset( $attr['overlayBlendMode'] ) ) {
				$css .= 'mix-blend-mode:' . $attr['overlayBlendMode'] . ';';
			}
		$css .= '}';
	}
	if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) ) {
		$css .= '@media (max-width: 767px) {';
			if ( isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) ) {
				$css .= '#kt-layout-id' . $unique_id . ' {';
					if ( isset( $attr['topMarginM'] ) ) {
						$css .= 'margin-top:' . $attr['topMarginM'] . 'px;';
					}
					if ( isset( $attr['bottomMarginM'] ) ) {
						$css .= 'margin-bottom:' . $attr['bottomMarginM'] . 'px;';
					}
				$css .= '}';
			}
			if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) ) {
				$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap {';
				if ( isset( $attr['topPaddingM'] ) ) {
					$css .= 'padding-top:' . $attr['topPaddingM'] . 'px;';
				}
				if ( isset( $attr['bottomPaddingM'] ) ) {
					$css .= 'padding-bottom:' . $attr['bottomPaddingM'] . 'px;';
				}
				if ( isset( $attr['leftPaddingM'] ) ) {
					$css .= 'padding-left:' . $attr['leftPaddingM'] . 'px;';
				}
				if ( isset( $attr['rightPaddingM'] ) ) {
					$css .= 'padding-right:' . $attr['rightPaddingM'] . 'px;';
				}
				$css .= '}';
			}
		
		$css .= '}';
	}
	return $css;
}
/**
 * Builds CSS for column layout block.
 * 
 * @param array  $attr the blocks attr.
 * @param string $unique_id the blocks parent attr ID.
 * @param number $column_key the blocks key.
 */
function kadence_column_layout_css( $attr, $unique_id, $column_key ) {
	$css = '';
	if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) ) {
		$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-' . $column_key . ' > .kt-inside-inner-col {';
			if ( isset( $attr['topPadding'] ) ) {
				$css .= 'padding-top:' . $attr['topPadding'] . 'px;';
			}
			if ( isset( $attr['bottomPadding'] ) ) {
				$css .= 'padding-bottom:' . $attr['bottomPadding'] . 'px;';
			}
			if ( isset( $attr['leftPadding'] ) ) {
				$css .= 'padding-left:' . $attr['leftPadding'] . 'px;';
			}
			if ( isset( $attr['rightPadding'] ) ) {
				$css .= 'padding-right:' . $attr['rightPadding'] . 'px;';
			}
			if ( isset( $attr['topMargin'] ) ) {
				$css .= 'margin-top:' . $attr['topMargin'] . 'px;';
			}
			if ( isset( $attr['bottomMargin'] ) ) {
				$css .= 'margin-bottom:' . $attr['bottomMargin'] . 'px;';
			}
		$css .= '}';
	}
	if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) ) {
		$css .= '@media (max-width: 767px) {';
			$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-' . $column_key . ' > .kt-inside-inner-col {';
			if ( isset( $attr['topPaddingM'] ) ) {
				$css .= 'padding-top:' . $attr['topPaddingM'] . 'px;';
			}
			if ( isset( $attr['bottomPaddingM'] ) ) {
				$css .= 'padding-bottom:' . $attr['bottomPaddingM'] . 'px;';
			}
			if ( isset( $attr['leftPaddingM'] ) ) {
				$css .= 'padding-left:' . $attr['leftPaddingM'] . 'px;';
			}
			if ( isset( $attr['rightPaddingM'] ) ) {
				$css .= 'padding-right:' . $attr['rightPaddingM'] . 'px;';
			}
			if ( isset( $attr['topMarginM'] ) ) {
				$css .= 'margin-top:' . $attr['topMarginM'] . 'px;';
			}
			if ( isset( $attr['bottomMarginM'] ) ) {
				$css .= 'margin-bottom:' . $attr['bottomMarginM'] . 'px;';
			}
			$css .= '}';		
		$css .= '}';
	}
	return $css;
}
/**
 * Register Meta for blocks width
 */
function kt_blocks_init_post_meta() {

	register_post_meta('', 'kt_blocks_editor_width', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'string',
        ));
}
add_action('init', 'kt_blocks_init_post_meta' );

/**
 * Add inline css editor width
 */
function kadence_blocks_admin_editor_width() {
	$editor_widths = get_option( 'kt_blocks_editor_width', array() );
	$post_type = get_post_type();
	if( isset( $editor_widths['page_default'] ) && ! empty( $editor_widths['page_default'] ) && isset( $editor_widths['post_default'] ) && ! empty( $editor_widths['post_default'] ) ) {
		if ( isset( $post_type ) &&  'page' === $post_type ) {
			$defualt_size_type = $editor_widths['page_default'];
		} else {
			$defualt_size_type = $editor_widths['post_default'];
		}
	} else {
		$defualt_size_type = 'sidebar';
	}
	if ( isset( $editor_widths['sidebar'] ) && ! empty( $editor_widths['sidebar'] ) ) {
		$sidebar_size = $editor_widths['sidebar'];
	} else {
		$sidebar_size = 750;
	}
	if ( isset( $editor_widths['nosidebar'] ) && ! empty( $editor_widths['nosidebar'] ) ) {
		$nosidebar_size = $editor_widths['nosidebar'];
	} else {
		$nosidebar_size = 1140;
	}
	if ( 'sidebar' == $defualt_size_type ) {
		$default_size = $sidebar_size;
	} elseif ( 'fullwidth' == $defualt_size_type ) {
		$default_size = none;
	} else {
		$default_size = $nosidebar_size;
	}
	echo '<style type="text/css" id="kt-block-editor-width">';
	echo 'body.gutenberg-editor-page.kt-editor-width-default .editor-post-title__block,
	body.gutenberg-editor-page.kt-editor-width-default .editor-default-block-appender,
	body.gutenberg-editor-page.kt-editor-width-default .editor-block-list__block {
		max-width: ' . esc_attr( $default_size ) . 'px;
	}';
	echo 'body.gutenberg-editor-page.kt-editor-width-sidebar .editor-post-title__block,
	body.gutenberg-editor-page.kt-editor-width-sidebar .editor-default-block-appender,
	body.gutenberg-editor-page.kt-editor-width-sidebar .editor-block-list__block {
		max-width: ' . esc_attr( $sidebar_size ) . 'px;
	}';
	echo 'body.gutenberg-editor-page.kt-editor-width-nosidebar .editor-post-title__block,
	body.gutenberg-editor-page.kt-editor-width-nosidebar .editor-default-block-appender,
	body.gutenberg-editor-page.kt-editor-width-nosidebar .editor-block-list__block {
		max-width: ' . esc_attr( $nosidebar_size ) . 'px;
	}';
	echo 'body.gutenberg-editor-page.kt-editor-width-fullwidth .editor-post-title__block,
	body.gutenberg-editor-page.kt-editor-width-fullwidth .editor-default-block-appender,
	body.gutenberg-editor-page.kt-editor-width-fullwidth .editor-block-list__block {
		max-width: none;
	}';
	echo 'body.gutenberg-editor-page .editor-block-list__layout .editor-block-list__block[data-align=wide] {
		width: auto;
		max-width: ' . esc_attr( $nosidebar_size + 200 ) . 'px;
	}';
	echo 'body.gutenberg-editor-page .editor-block-list__layout .editor-block-list__block[data-align=full] {
		max-width: none;
	}';
	echo '</style>';
}
add_action( 'admin_head-post.php', 'kadence_blocks_admin_editor_width', 100 );
add_action( 'admin_head-post-new.php', 'kadence_blocks_admin_editor_width', 100 );
add_action( 'admin_head-edit.php', 'kadence_blocks_admin_editor_width', 100 );

/**
 * Add class to match editor width.
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