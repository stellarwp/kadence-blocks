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
 * Class to Enqueue CSS/JS of all the blocks.
 *
 * @category class
 */
class Kadence_Blocks_Frontend {

	/**
	 * Google fonts to enqueue
	 *
	 * @var array
	 */
	public static $gfonts = array();

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
		add_action( 'init', array( $this, 'on_init' ) );
		add_action( 'enqueue_block_assets', array( $this, 'blocks_assets' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_inline_css' ), 20 );
		add_action( 'wp_head', array( $this, 'frontend_gfonts' ), 90 );
	}
	/**
	 * On init startup.
	 */
	public function on_init() {
		// Only load if Gutenberg is available.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}
		register_block_type( 'kadence/rowlayout', array(
			'render_callback' => array( $this, 'render_row_layout_css' ),
		) );
		register_block_type( 'kadence/column', array(
			'render_callback' => array( $this, 'render_column_layout_css' ),
		) );
		register_block_type( 'kadence/advancedbtn', array(
			'render_callback' => array( $this, 'render_advanced_btn_css' ),
		) );
		register_block_type( 'kadence/advancedheading', array(
			'render_callback' => array( $this, 'render_advanced_heading_css' ),
		) );
		register_block_type( 'kadence/tabs', array(
			'render_callback' => array( $this, 'render_tabs_css' ),
		) );
		register_block_type( 'kadence/spacer', array(
			'render_callback' => array( $this, 'render_spacer_css' ),
		) );
		register_block_type( 'kadence/infobox', array(
			'render_callback' => array( $this, 'render_infobox_css' ),
		) );
		register_block_type( 'kadence/accordion', array(
			'render_callback' => array( $this, 'render_accordion_css' ),
		) );
	}
	/**
	 * Render Inline CSS helper function
	 *
	 * @param array  $css the css for each rendered block.
	 * @param string $style_id the unique id for the rendered style
	 */
	public function render_inline_css( $css, $style_id, $in_content = false ) {
		if ( ! is_admin() ) {
			wp_register_style( $style_id, false );
			wp_enqueue_style( $style_id );
			wp_add_inline_style( $style_id, $css );
			if ( 1 === did_action( 'wp_head' ) && $in_content ) {
				wp_print_styles( $style_id );
			}
		}
	}
	/**
	 * Render Row Block CSS In Head
	 *
	 * @param array  $attributes the blocks attribtues.
	 */
	public function render_row_layout_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->row_layout_array_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Row Block CSS Inline
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_row_layout_css( $attributes, $content ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->row_layout_array_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Render Column Block CSS Head
	 *
	 * @param array  $attributes the blocks attribtues.
	 */
	public function render_column_layout_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) && ! empty( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->column_layout_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Column Block CSS Inline
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_column_layout_css( $attributes, $content ) {
		if ( isset( $attributes['uniqueID'] ) && ! empty( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
		} else {
			$unique_id = rand( 100, 10000 );
			$pos       = strpos( $content, 'inner-column-' );
			if ( false !== $pos ) {
				$content = substr_replace( $content, 'kadence-column' . $unique_id . ' inner-column-', $pos, strlen( 'inner-column-' ) );
			}
		}
		$style_id = 'kt-blocks' . esc_attr( $unique_id );
		if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
			$css = $this->column_layout_css( $attributes, $unique_id );
			if ( ! empty( $css ) ) {
				if ( doing_filter( 'the_content' ) ) {
					$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
				} else {
					$this->render_inline_css( $css, $style_id, true );
				}
			}
		};
		return $content;
	}
	/**
	 * Render Advanced Btn Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 */
	public function render_advanced_btn_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_advanced_btn_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Advanced Btn Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_advanced_btn_css( $attributes, $content ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_advanced_btn_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					// This only runs if the content if loaded via the rest API. Normally the css would already be added in the head.
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Render Advanced Heading Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 */
	public function render_advanced_heading_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_advanced_heading_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Advanced Heading Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_advanced_heading_css( $attributes, $content ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_advanced_heading_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Render Tabs Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 */
	public function render_tabs_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_tabs_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Tabs Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_tabs_css( $attributes, $content ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_tabs_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Render Spacing Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 */
	public function render_spacer_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) && ( ( isset( $attributes['tabletSpacerHeight'] ) && ! empty( $attributes['tabletSpacerHeight'] ) ) || isset( $attributes['mobileSpacerHeight'] ) && ! empty( $attributes['mobileSpacerHeight'] ) ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_spacer_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Spacing Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_spacer_css( $attributes, $content ) {
		if ( isset( $attributes['uniqueID'] ) && ( ( isset( $attributes['tabletSpacerHeight'] ) && ! empty( $attributes['tabletSpacerHeight'] ) ) || isset( $attributes['mobileSpacerHeight'] ) && ! empty( $attributes['mobileSpacerHeight'] ) ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_spacer_array( $attributes, $unique_id );
				if ( doing_filter( 'the_content' ) ) {
					$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
				} else {
					$this->render_inline_css( $css, $style_id, true );
				}
			}
		}
		return $content;
	}
	/**
	 * Render Info Block CSS in Head
	 *
	 * @param array  $attributes the blocks attribtues.
	 */
	public function render_infobox_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_infobox_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Info Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_infobox_css( $attributes, $content ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_infobox_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Render Accordion CSS in Head
	 *
	 * @param array  $attributes the blocks attribtues.
	 */
	public function render_accordion_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_accordion_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Accordion CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_accordion_css( $attributes, $content ) {
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_accordion_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Enqueue Gutenberg block assets
	 *
	 * @since 1.0.0
	 */
	public function blocks_assets() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		wp_register_script( 'kadence-blocks-accordion-js', KT_BLOCKS_URL . 'dist/kt-accordion.js', array(), KT_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tabs-js', KT_BLOCKS_URL . 'dist/kt-tabs.js', array( 'jquery' ), KT_BLOCKS_VERSION, true );
		wp_register_script( 'jarallax', KT_BLOCKS_URL . 'dist/jarallax.min.js', array( ), KT_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-parallax-js', KT_BLOCKS_URL . 'dist/kt-init-parallax.js', array( 'jquery', 'jarallax' ), KT_BLOCKS_VERSION, true );
		wp_enqueue_style( 'kadence-blocks-style-css', KT_BLOCKS_URL . 'dist/blocks.style.build.css', array(), KT_BLOCKS_VERSION );
	}
	/**
	 * Hex to RGBA
	 *
	 * @param string $hex string hex code.
	 * @param number $alpha alpha number.
	 */
	public function hex2rgba( $hex, $alpha ) {
		$hex = str_replace( '#', '', $hex );

		if ( strlen( $hex ) == 3 ) {
			$r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
			$g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
			$b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
		} else {
			$r = hexdec( substr( $hex, 0, 2 ) );
			$g = hexdec( substr( $hex, 2, 2 ) );
			$b = hexdec( substr( $hex, 4, 2 ) );
		}
		$rgba = 'rgba(' . $r . ', ' . $g . ', ' . $b . ', ' . $alpha . ')';
		return $rgba;
	}
	/**
	 * Load the front end Google Fonts
	 */
	public function frontend_gfonts() {
		if ( empty( self::$gfonts ) ) {
			return;
		}
		$print_google_fonts = apply_filters( 'kadence_blocks_print_google_fonts', true );
		if ( ! $print_google_fonts ) {
			return;
		}
		$link    = '';
		$subsets = array();
		foreach ( self::$gfonts as $key => $gfont_values ) {
			if ( ! empty( $link ) ) {
				$link .= '%7C'; // Append a new font to the string.
			}
			$link .= $gfont_values['fontfamily'];
			if ( ! empty( $gfont_values['fontvariants'] ) ) {
				$link .= ':';
				$link .= implode( ',', $gfont_values['fontvariants'] );
			}
			if ( ! empty( $gfont_values['fontsubsets'] ) ) {
				foreach ( $gfont_values['fontsubsets'] as $subset ) {
					if ( ! in_array( $subset, $subsets ) ) {
						array_push( $subsets, $subset );
					}
				}
			}
		}
		if ( ! empty( $subsets ) ) {
			$link .= '&amp;subset=' . implode( ',', $subsets );
		}
		echo '<link href="//fonts.googleapis.com/css?family=' . esc_attr( str_replace( '|', '%7C', $link ) ) . '" rel="stylesheet">';

	}
	/**
	 * Gets the parsed blocks, need to use this becuase wordpress 5 doesn't seem to include gutenberg_parse_blocks
	 *
	 * @param string $content string of page/post content.
	 */
	public function kadence_parse_blocks( $content ) {
		$parser_class = apply_filters( 'block_parser_class', 'WP_Block_Parser' );
		if ( class_exists( $parser_class ) ) {
			$parser = new $parser_class();
			return $parser->parse( $content );
		} elseif ( function_exists( 'gutenberg_parse_blocks' ) ) {
			return gutenberg_parse_blocks( $content );
		} else {
			return false;
		}
	}
	/**
	 * Outputs extra css for blocks.
	 */
	public function frontend_inline_css() {
		if ( function_exists( 'has_blocks' ) && has_blocks( get_the_ID() ) ) {
			global $post;
			if ( ! is_object( $post ) ) {
				return;
			}
			$blocks = $this->kadence_parse_blocks( $post->post_content );
			// print_r( $blocks );
			if ( ! is_array( $blocks ) || empty( $blocks ) ) {
				return;
			}
			foreach ( $blocks as $indexkey => $block ) {
				if ( ! is_object( $block ) && is_array( $block ) && isset( $block['blockName'] ) ) {
					if ( 'kadence/rowlayout' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_row_layout_css_head( $blockattr );
							$this->render_row_layout_scripts( $blockattr );
						}
					}
					if ( 'kadence/column' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_column_layout_css_head( $blockattr );
						}
					}
					if ( 'kadence/advancedheading' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_advanced_heading_css_head( $blockattr );
							$this->blocks_advanced_heading_gfont( $blockattr );
						}
					}
					if ( 'kadence/advancedbtn' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_advanced_btn_css_head( $blockattr );
							$this->blocks_advanced_btn_gfont( $blockattr );
						}
					}
					if ( 'kadence/accordion' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_accordion_css_head( $blockattr );
							$this->blocks_accordion_scripts_gfonts( $blockattr );
						}
					}
					if ( 'kadence/tabs' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_tabs_css_head( $blockattr );
							$this->blocks_tabs_scripts_gfonts( $blockattr );
						}
					}
					if ( 'kadence/infobox' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_infobox_css_head( $blockattr );
							$this->blocks_infobox_scripts_gfonts( $blockattr );
						}
					}
					if ( 'kadence/spacer' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_spacer_css_head( $blockattr );
						}
					}
					if ( 'core/block' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							if ( isset( $blockattr['ref'] ) ) {
								$reusable_block = get_post( $blockattr['ref'] );
								if ( $reusable_block && 'wp_block' == $reusable_block->post_type ) {
									$reuse_data_block = $this->kadence_parse_blocks( $reusable_block->post_content );
									$this->blocks_cycle_through( $reuse_data_block );
								}
							}
						}
					}
					if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
						$this->blocks_cycle_through( $block['innerBlocks'] );
					}
				}
			}
		}
	}
	/**
	 * Builds css for inner blocks
	 *
	 * @param array $inner_blocks array of inner blocks.
	 */
	public function blocks_cycle_through( $inner_blocks ) {
		foreach ( $inner_blocks as $in_indexkey => $inner_block ) {
			if ( ! is_object( $inner_block ) && is_array( $inner_block ) && isset( $inner_block['blockName'] ) ) {
				if ( 'kadence/rowlayout' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_row_layout_css_head( $blockattr );
					}
				}
				if ( 'kadence/column' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_column_layout_css_head( $blockattr );
					}
				}
				if ( 'kadence/advancedheading' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_advanced_heading_css_head( $blockattr );
						$this->blocks_advanced_heading_gfont( $blockattr );
					}
				}
				if ( 'kadence/accordion' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_accordion_css_head( $blockattr );
						$this->blocks_accordion_scripts_gfonts( $blockattr );
					}
				}
				if ( 'kadence/advancedbtn' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_advanced_btn_css_head( $blockattr );
						$this->blocks_advanced_btn_gfont( $blockattr );
					}
				}
				if ( 'kadence/tabs' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_tabs_css_head( $blockattr );
						$this->blocks_tabs_scripts_gfonts( $blockattr );
					}
				}
				if ( 'kadence/infobox' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_infobox_css_head( $blockattr );
						$this->blocks_infobox_scripts_gfonts( $blockattr );
					}
				}
				if ( 'kadence/spacer' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_spacer_css_head( $blockattr );
					}
				}
				if ( 'core/block' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						if ( isset( $blockattr['ref'] ) ) {
							$reusable_block = get_post( $blockattr['ref'] );
							if ( $reusable_block && 'wp_block' == $reusable_block->post_type ) {
								$reuse_data_block = $this->kadence_parse_blocks( $reusable_block->post_content );
								$this->blocks_cycle_through( $reuse_data_block );
							}
						}
					}
				}
				if ( isset( $inner_block['innerBlocks'] ) && ! empty( $inner_block['innerBlocks'] ) && is_array( $inner_block['innerBlocks'] ) ) {
					$this->blocks_cycle_through( $inner_block['innerBlocks'] );
				}
			}
		}
	}
	/**
	 * Builds CSS for InfoBox block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_infobox_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['containerBorder'] ) || isset( $attr['containerBackground'] ) || isset( $attr['containerPadding'] ) || isset( $attr['containerBorderRadius'] ) || isset( $attr['containerBorderWidth'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap {';
			if ( isset( $attr['containerBorder'] ) && ! empty( $attr['containerBorder'] ) ) {
				$css .= 'border-color:' . $attr['containerBorder'] . ';';
			}
			if ( isset( $attr['containerBorderRadius'] ) && ! empty( $attr['containerBorderRadius'] ) ) {
				$css .= 'border-radius:' . $attr['containerBorderRadius'] . 'px;';
			}
			if ( isset( $attr['containerBackground'] ) && ! empty( $attr['containerBackground'] ) ) {
				$css .= 'background:' . $attr['containerBackground'] . ';';
			}
			if ( isset( $attr['containerPadding'] ) && is_array( $attr['containerPadding'] ) ) {
				$css .= 'padding:' . $attr['containerPadding'][ 0 ] . 'px ' . $attr['containerPadding'][ 1 ] . 'px ' . $attr['containerPadding'][ 2 ] . 'px ' . $attr['containerPadding'][ 3 ] . 'px;';
			}
			if ( isset( $attr['containerBorderWidth'] ) && is_array( $attr['containerBorderWidth'] ) ) {
				$css .= 'border-width:' . $attr['containerBorderWidth'][ 0 ] . 'px ' . $attr['containerBorderWidth'][ 1 ] . 'px ' . $attr['containerBorderWidth'][ 2 ] . 'px ' . $attr['containerBorderWidth'][ 3 ] . 'px;';
			}
			$css .= '}';
		}
		$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover {';
			$css .= 'border-color:' . ( isset( $attr['containerHoverBorder'] ) && ! empty( $attr['containerHoverBorder'] ) ? $attr['containerHoverBorder'] : '#eeeeee' ) . ';';
			$css .= 'background:' . ( isset( $attr['containerHoverBackground'] ) && ! empty( $attr['containerHoverBackground'] ) ? $attr['containerHoverBackground'] : '#f2f2f2' ) . ';';
		$css .= '}';
		if ( isset( $attr['mediaIcon'] ) && is_array( $attr['mediaIcon'] ) && is_array( $attr['mediaIcon'][ 0 ] ) ) {
			$media_icon = $attr['mediaIcon'][ 0 ];
		} else {
			$media_icon = array();
		}
		if ( isset( $attr['mediaStyle'] ) && is_array( $attr['mediaStyle'] ) && is_array( $attr['mediaStyle'][ 0 ] ) ) {
			$media_style = $attr['mediaStyle'][ 0 ];
		} else {
			$media_style = array();
		}
		if ( isset( $attr['mediaImage'] ) && is_array( $attr['mediaImage'] ) && is_array( $attr['mediaImage'][ 0 ] ) ) {
			$media_image = $attr['mediaImage'][ 0 ];
		} else {
			$media_image = array();
		}
		$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media {';
		if ( isset( $media_icon['color'] ) && ! empty( $media_icon['color'] ) ) {
			$css .= 'color:' . $media_icon['color'] . ';';
		}
		if ( isset( $media_style['background'] ) && ! empty( $media_style['background'] ) ) {
			$css .= 'background:' . $media_style['background'] . ';';
		}
		if ( isset( $media_style['border'] ) && ! empty( $media_style['border'] ) ) {
			$css .= 'border-color:' . $media_style['border'] . ';';
		}
		if ( isset( $media_style['borderRadius'] ) && ! empty( $media_style['borderRadius'] ) ) {
			$css .= 'border-radius:' . $media_style['borderRadius'] . 'px;';
		}
		if ( isset( $media_style['borderWidth'] ) && is_array( $media_style['borderWidth'] ) ) {
			$css .= 'border-width:' . ( empty( $media_style['borderWidth'][ 0 ] ) ? '0' : $media_style['borderWidth'][ 0 ] ) . 'px ' . ( empty( $media_style['borderWidth'][ 1 ] ) ? '0' : $media_style['borderWidth'][ 1 ] ) . 'px ' . ( empty( $media_style['borderWidth'][ 2 ] ) ? '0' : $media_style['borderWidth'][ 2 ] ) . 'px ' . ( empty( $media_style['borderWidth'][ 3 ] ) ? '0' : $media_style['borderWidth'][ 3 ] ) . 'px;';
		}
		if ( isset( $media_style['padding'] ) && is_array( $media_style['padding'] ) ) {
			$css .= 'padding:' . ( empty( $media_style['padding'][ 0 ] ) ? '0' : $media_style['padding'][ 0 ] ) . 'px ' . ( empty( $media_style['padding'][ 1 ] ) ? '0' : $media_style['padding'][ 1 ] ) . 'px ' . ( empty( $media_style['padding'][ 2 ] ) ? '0' : $media_style['padding'][ 2 ] ) . 'px ' . ( empty( $media_style['padding'][ 3 ] ) ? '0' : $media_style['padding'][ 3 ] ) . 'px;';
		}
		if ( isset( $media_style['margin'] ) && is_array( $media_style['margin'] ) ) {
			$css .= 'margin:' . ( empty( $media_style['margin'][ 0 ] ) ? '0' : $media_style['margin'][ 0 ] ) . 'px ' . ( empty( $media_style['margin'][ 1 ] ) ? '0' : $media_style['margin'][ 1 ] ) . 'px ' . ( empty( $media_style['margin'][ 2 ] ) ? '0' : $media_style['margin'][ 2 ] ) . 'px ' . ( empty( $media_style['margin'][ 3 ] ) ? '0' : $media_style['margin'][ 3 ] ) . 'px;';
		}
		$css .= '}';
		if ( isset( $media_style['borderRadius'] ) && ! empty( $media_style['borderRadius'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media img {';
			$css .= 'border-radius:' . $media_style['borderRadius'] . 'px;';
			$css .= '}';
		}
		$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media {';
		if ( isset( $media_icon['hoverColor'] ) && ! empty( $media_icon['hoverColor'] ) ) {
			$css .= 'color:' . $media_icon['hoverColor'] . ';';
		}
		if ( isset( $media_style['hoverBackground'] ) && ! empty( $media_style['hoverBackground'] ) ) {
			$css .= 'background:' . $media_style['hoverBackground'] . ';';
		}
		if ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ) {
			$css .= 'border-color:' . $media_style['hoverBorder'] . ';';
		}
		$css .= '}';
		if ( ( ( isset( $attr['mediaType'] ) && 'icon' === $attr['mediaType'] || ! isset( $attr['mediaType'] ) ) && isset( $media_icon['hoverAnimation'] ) && 'drawborder' === $media_icon['hoverAnimation'] ) || ( isset( $attr['mediaType'] ) && 'image' === $attr['mediaType'] && isset( $media_image['hoverAnimation'] ) && ( 'drawborder' === $media_image['hoverAnimation'] || 'grayscale-border-draw' === $media_image['hoverAnimation'] ) ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media {';
			$css .= 'border-width:0;';
			if ( isset( $media_style['borderWidth'] ) && is_array( $media_style['borderWidth'] ) ) {
				$css .= 'box-shadow: inset 0 0 0 ' . $media_style['borderWidth'][ 0 ] . 'px ' . ( isset( $media_style['border'] ) && ! empty( $media_style['border'] ) ? $media_style['border'] : '#444444' ) . ';';
			}
			$css .= '}';
			if ( isset( $media_style['borderRadius'] ) && ! empty( $media_style['borderRadius'] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after {';
					$css .= 'border-radius:' . $media_style['borderRadius'] . 'px;';
				$css .= '}';
			}
			if ( isset( $media_style['borderWidth'] ) && is_array( $media_style['borderWidth'] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before {';
					$css .= ' border-width:' . $media_style['borderWidth'][ 0 ] . 'px;';
				$css .= '}';
			}
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after {';
				$css .= ' border-width:0;';
			$css .= '}';
			if ( isset( $media_style['borderWidth'] ) && is_array( $media_style['borderWidth'] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after {';
					$css .= 'border-right-color:' . ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $media_style['hoverBorder'] : '#444444' ) . ';';
					$css .= 'border-right-width:' . $media_style['borderWidth'][ 0 ] . 'px;';
					$css .= 'border-top-width:' . $media_style['borderWidth'][ 0 ] . 'px;';
					$css .= 'border-bottom-width:' . $media_style['borderWidth'][ 0 ] . 'px;';
				$css .= '}';
			}
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before {';
				$css .= 'border-top-color:' . ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $media_style['hoverBorder'] : '#444444' ) . ';';
				$css .= 'border-right-color:' . ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $media_style['hoverBorder'] : '#444444' ) . ';';
				$css .= 'border-bottom-color:' . ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $media_style['hoverBorder'] : '#444444' ) . ';';
			$css .= '}';
		}
		if ( isset( $attr['titleColor'] ) || isset( $attr['titleFont'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title {';
			if ( isset( $attr['titleColor'] ) && ! empty( $attr['titleColor'] ) ) {
				$css .= 'color:' . $attr['titleColor'] . ';';
			}
			if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && is_array( $attr['titleFont'][ 0 ] ) ) {
				$title_font = $attr['titleFont'][ 0 ];
				if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && ! empty( $title_font['size'][0] ) ) {
					$css .= 'font-size:' . $title_font['size'][0] . ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) . ';';
				}
				if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && ! empty( $title_font['lineHeight'][0] ) ) {
					$css .= 'line-height:' . $title_font['lineHeight'][0] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) . ';';
				}
				if ( isset( $title_font['letterSpacing'] ) && ! empty( $title_font['letterSpacing'] ) ) {
					$css .= 'letter-spacing:' . $title_font['letterSpacing'] .  'px;';
				}
				if ( isset( $title_font['textTransform'] ) && ! empty( $title_font['textTransform'] ) ) {
					$css .= 'text-transform:' . $title_font['textTransform'] .  ';';
				}
				if ( isset( $title_font['family'] ) && ! empty( $title_font['family'] ) ) {
					$css .= 'font-family:' . $title_font['family'] .  ';';
				}
				if ( isset( $title_font['style'] ) && ! empty( $title_font['style'] ) ) {
					$css .= 'font-style:' . $title_font['style'] .  ';';
				}
				if ( isset( $title_font['weight'] ) && ! empty( $title_font['weight'] ) ) {
					$css .= 'font-weight:' . $title_font['weight'] .  ';';
				}
				if ( isset( $title_font['padding'] ) && is_array( $title_font['padding'] ) ) {
					$css .= 'padding:' . $title_font['padding'][0] . 'px ' . $title_font['padding'][1] . 'px ' . $title_font['padding'][2] . 'px ' . $title_font['padding'][3] . 'px;';
				}
				if ( isset( $title_font['margin'] ) && is_array( $title_font['margin'] ) ) {
					$css .= 'margin:' . $title_font['margin'][0] . 'px ' . $title_font['margin'][1] . 'px ' . $title_font['margin'][2] . 'px ' . $title_font['margin'][3] . 'px;';
				}
			}
			$css .= '}';
		}
		if ( isset( $attr['titleHoverColor'] ) && ! empty( $attr['titleHoverColor'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-title {';
				$css .= 'color:' . $attr['titleHoverColor'] . ';';
			$css .= '}';
		}
		if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && ( ( isset( $attr['titleFont'][0]['size'] ) && is_array( $attr['titleFont'][0]['size'] ) && isset( $attr['titleFont'][0]['size'][1] ) && ! empty( $attr['titleFont'][0]['size'][1] ) ) || ( isset( $attr['titleFont'][0]['lineHeight'] ) && is_array( $attr['titleFont'][0]['lineHeight'] ) && isset( $attr['titleFont'][0]['lineHeight'][1] ) && ! empty( $attr['titleFont'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title {';
			if ( isset( $attr['titleFont'][0]['size'][1] ) && ! empty( $attr['titleFont'][0]['size'][1] ) ) {
				$css .= 'font-size:' . $attr['titleFont'][0]['size'][1] . ( ! isset( $attr['titleFont'][0]['sizeType'] ) ? 'px' : $attr['titleFont'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['titleFont'][0]['lineHeight'][1] ) && ! empty( $attr['titleFont'][0]['lineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['titleFont'][0]['lineHeight'][1] . ( ! isset( $attr['titleFont'][0]['lineType'] ) ? 'px' : $attr['titleFont'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && ( ( isset( $attr['titleFont'][0]['size'] ) && is_array( $attr['titleFont'][0]['size'] ) && isset( $attr['titleFont'][0]['size'][2] ) && ! empty( $attr['titleFont'][0]['size'][2] ) ) || ( isset( $attr['titleFont'][0]['lineHeight'] ) && is_array( $attr['titleFont'][0]['lineHeight'] ) && isset( $attr['titleFont'][0]['lineHeight'][2] ) && ! empty( $attr['titleFont'][0]['lineHeight'][2] ) ) ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title {';
				if ( isset( $attr['titleFont'][0]['size'][2] ) && ! empty( $attr['titleFont'][0]['size'][2] ) ) {
					$css .= 'font-size:' . $attr['titleFont'][0]['size'][2] . ( ! isset( $attr['titleFont'][0]['sizeType'] ) ? 'px' : $attr['titleFont'][0]['sizeType'] ) . ';';
				}
				if ( isset( $attr['titleFont'][0]['lineHeight'][2] ) && ! empty( $attr['titleFont'][0]['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $attr['titleFont'][0]['lineHeight'][2] . ( ! isset( $attr['titleFont'][0]['lineType'] ) ? 'px' : $attr['titleFont'][0]['lineType'] ) . ';';
				}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['textColor'] ) || isset( $attr['textFont'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text {';
			if ( isset( $attr['textColor'] ) && ! empty( $attr['textColor'] ) ) {
				$css .= 'color:' . $attr['textColor'] . ';';
			}
			if ( isset( $attr['textFont'] ) && is_array( $attr['textFont'] ) && is_array( $attr['textFont'][ 0 ] ) ) {
				$text_font = $attr['textFont'][ 0 ];
				if ( isset( $text_font['size'] ) && is_array( $text_font['size'] ) && ! empty( $text_font['size'][0] ) ) {
					$css .= 'font-size:' . $text_font['size'][0] . ( ! isset( $text_font['sizeType'] ) ? 'px' : $text_font['sizeType'] ) . ';';
				}
				if ( isset( $text_font['lineHeight'] ) && is_array( $text_font['lineHeight'] ) && ! empty( $text_font['lineHeight'][0] ) ) {
					$css .= 'line-height:' . $text_font['lineHeight'][0] . ( ! isset( $text_font['lineType'] ) ? 'px' : $text_font['lineType'] ) . ';';
				}
				if ( isset( $text_font['letterSpacing'] ) && ! empty( $text_font['letterSpacing'] ) ) {
					$css .= 'letter-spacing:' . $text_font['letterSpacing'] .  'px;';
				}
				if ( isset( $text_font['family'] ) && ! empty( $text_font['family'] ) ) {
					$css .= 'font-family:' . $text_font['family'] .  ';';
				}
				if ( isset( $text_font['style'] ) && ! empty( $text_font['style'] ) ) {
					$css .= 'font-style:' . $text_font['style'] .  ';';
				}
				if ( isset( $text_font['weight'] ) && ! empty( $text_font['weight'] ) ) {
					$css .= 'font-weight:' . $text_font['weight'] .  ';';
				}
			}
			$css .= '}';
		}
		if ( isset( $attr['textHoverColor'] ) && ! empty( $attr['textHoverColor'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-text {';
				$css .= 'color:' . $attr['textHoverColor'] . ';';
			$css .= '}';
		}
		if ( isset( $attr['textFont'] ) && is_array( $attr['textFont'] ) && isset( $attr['textFont'][0] ) && is_array( $attr['textFont'][0] ) && ( ( isset( $attr['textFont'][0]['size'] ) && is_array( $attr['textFont'][0]['size'] ) && isset( $attr['textFont'][0]['size'][1] ) && ! empty( $attr['textFont'][0]['size'][1] ) ) || ( isset( $attr['textFont'][0]['lineHeight'] ) && is_array( $attr['textFont'][0]['lineHeight'] ) && isset( $attr['textFont'][0]['lineHeight'][1] ) && ! empty( $attr['textFont'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text {';
			if ( isset( $attr['textFont'][0]['size'][1] ) && ! empty( $attr['textFont'][0]['size'][1] ) ) {
				$css .= 'font-size:' . $attr['textFont'][0]['size'][1] . ( ! isset( $attr['textFont'][0]['sizeType'] ) ? 'px' : $attr['textFont'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['textFont'][0]['lineHeight'][1] ) && ! empty( $attr['textFont'][0]['lineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['textFont'][0]['lineHeight'][1] . ( ! isset( $attr['textFont'][0]['lineType'] ) ? 'px' : $attr['textFont'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['textFont'] ) && is_array( $attr['textFont'] ) && isset( $attr['textFont'][0] ) && is_array( $attr['textFont'][0] ) && ( ( isset( $attr['textFont'][0]['size'] ) && is_array( $attr['textFont'][0]['size'] ) && isset( $attr['textFont'][0]['size'][2] ) && ! empty( $attr['textFont'][0]['size'][2] ) ) || ( isset( $attr['textFont'][0]['lineHeight'] ) && is_array( $attr['textFont'][0]['lineHeight'] ) && isset( $attr['textFont'][0]['lineHeight'][2] ) && ! empty( $attr['textFont'][0]['lineHeight'][2] ) ) ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text {';
				if ( isset( $attr['textFont'][0]['size'][2] ) && ! empty( $attr['textFont'][0]['size'][2] ) ) {
					$css .= 'font-size:' . $attr['textFont'][0]['size'][2] . ( ! isset( $attr['textFont'][0]['sizeType'] ) ? 'px' : $attr['textFont'][0]['sizeType'] ) . ';';
				}
				if ( isset( $attr['textFont'][0]['lineHeight'][2] ) && ! empty( $attr['textFont'][0]['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $attr['textFont'][0]['lineHeight'][2] . ( ! isset( $attr['textFont'][0]['lineType'] ) ? 'px' : $attr['textFont'][0]['lineType'] ) . ';';
				}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'][ 0 ] ) ) {
			$learn_more_styles = $attr['learnMoreStyles'][ 0 ];
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-learnmore {';
			if ( isset( $learn_more_styles['color'] ) && ! empty( $learn_more_styles['color'] ) ) {
				$css .= 'color:' . $learn_more_styles['color'] . ';';
			}
			if ( isset( $learn_more_styles['background'] ) && ! empty( $learn_more_styles['background'] ) ) {
				$css .= 'background:' . $learn_more_styles['background'] . ';';
			}
			if ( isset( $learn_more_styles['border'] ) && ! empty( $learn_more_styles['border'] ) ) {
				$css .= 'border-color:' . $learn_more_styles['border'] . ';';
			}
			if ( isset( $learn_more_styles['borderRadius'] ) && ! empty( $learn_more_styles['borderRadius'] ) ) {
				$css .= 'border-radius:' . $learn_more_styles['borderRadius'] . 'px;';
			}
			if ( isset( $learn_more_styles['size'] ) && is_array( $learn_more_styles['size'] ) && ! empty( $learn_more_styles['size'][0] ) ) {
				$css .= 'font-size:' . $learn_more_styles['size'][0] . ( ! isset( $learn_more_styles['sizeType'] ) ? 'px' : $learn_more_styles['sizeType'] ) . ';';
			}
			if ( isset( $learn_more_styles['lineHeight'] ) && is_array( $learn_more_styles['lineHeight'] ) && ! empty( $learn_more_styles['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $learn_more_styles['lineHeight'][0] . ( ! isset( $learn_more_styles['lineType'] ) ? 'px' : $learn_more_styles['lineType'] ) . ';';
			}
			if ( isset( $learn_more_styles['letterSpacing'] ) && ! empty( $learn_more_styles['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $learn_more_styles['letterSpacing'] .  'px;';
			}
			if ( isset( $learn_more_styles['family'] ) && ! empty( $learn_more_styles['family'] ) ) {
				$css .= 'font-family:' . $learn_more_styles['family'] .  ';';
			}
			if ( isset( $learn_more_styles['style'] ) && ! empty( $learn_more_styles['style'] ) ) {
				$css .= 'font-style:' . $learn_more_styles['style'] .  ';';
			}
			if ( isset( $learn_more_styles['weight'] ) && ! empty( $learn_more_styles['weight'] ) ) {
				$css .= 'font-weight:' . $learn_more_styles['weight'] .  ';';
			}
			if ( isset( $learn_more_styles['borderWidth'] ) && is_array( $learn_more_styles['borderWidth'] ) ) {
				$css .= 'border-width:' . $learn_more_styles['borderWidth'][0] . 'px ' . $learn_more_styles['borderWidth'][1] . 'px ' . $learn_more_styles['borderWidth'][2] . 'px ' . $learn_more_styles['borderWidth'][3] . 'px;';
			}
			if ( isset( $learn_more_styles['padding'] ) && is_array( $learn_more_styles['padding'] ) ) {
				$css .= 'padding:' . $learn_more_styles['padding'][0] . 'px ' . $learn_more_styles['padding'][1] . 'px ' . $learn_more_styles['padding'][2] . 'px ' . $learn_more_styles['padding'][3] . 'px;';
			}
			if ( isset( $learn_more_styles['margin'] ) && is_array( $learn_more_styles['margin'] ) ) {
				$css .= 'margin:' . $learn_more_styles['margin'][0] . 'px ' . $learn_more_styles['margin'][1] . 'px ' . $learn_more_styles['margin'][2] . 'px ' . $learn_more_styles['margin'][3] . 'px;';
			}
			$css .= '}';
			if ( isset( $learn_more_styles['colorHover'] ) || isset( $learn_more_styles['colorHover'] ) || isset( $learn_more_styles['borderHover'] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore {';
					if ( isset( $learn_more_styles['colorHover'] ) && ! empty( $learn_more_styles['colorHover'] ) ) {
						$css .= 'color:' . $learn_more_styles['colorHover'] . ';';
					}
					if ( isset( $learn_more_styles['backgroundHover'] ) && ! empty( $learn_more_styles['backgroundHover'] ) ) {
						$css .= 'background:' . $learn_more_styles['backgroundHover'] . ';';
					}
					if ( isset( $learn_more_styles['borderHover'] ) && ! empty( $learn_more_styles['borderHover'] ) ) {
						$css .= 'border-color:' . $learn_more_styles['borderHover'] . ';';
					}
				$css .= '}';
			}
		}
		if ( isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && isset( $attr['learnMoreStyles'][0] ) && is_array( $attr['learnMoreStyles'][0] ) && ( ( isset( $attr['learnMoreStyles'][0]['size'] ) && is_array( $attr['learnMoreStyles'][0]['size'] ) && isset( $attr['learnMoreStyles'][0]['size'][1] ) && ! empty( $attr['learnMoreStyles'][0]['size'][1] ) ) || ( isset( $attr['learnMoreStyles'][0]['lineHeight'] ) && is_array( $attr['learnMoreStyles'][0]['lineHeight'] ) && isset( $attr['learnMoreStyles'][0]['lineHeight'][1] ) && ! empty( $attr['learnMoreStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-learnmore {';
			if ( isset( $attr['learnMoreStyles'][0]['size'][1] ) && ! empty( $attr['learnMoreStyles'][0]['size'][1] ) ) {
				$css .= 'font-size:' . $attr['learnMoreStyles'][0]['size'][1] . ( ! isset( $attr['learnMoreStyles'][0]['sizeType'] ) ? 'px' : $attr['learnMoreStyles'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['learnMoreStyles'][0]['lineHeight'][1] ) && ! empty( $attr['learnMoreStyles'][0]['lineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['learnMoreStyles'][0]['lineHeight'][1] . ( ! isset( $attr['learnMoreStyles'][0]['lineType'] ) ? 'px' : $attr['learnMoreStyles'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && isset( $attr['learnMoreStyles'][0] ) && is_array( $attr['learnMoreStyles'][0] ) && ( ( isset( $attr['learnMoreStyles'][0]['size'] ) && is_array( $attr['learnMoreStyles'][0]['size'] ) && isset( $attr['learnMoreStyles'][0]['size'][2] ) && ! empty( $attr['learnMoreStyles'][0]['size'][2] ) ) || ( isset( $attr['learnMoreStyles'][0]['lineHeight'] ) && is_array( $attr['learnMoreStyles'][0]['lineHeight'] ) && isset( $attr['learnMoreStyles'][0]['lineHeight'][2] ) && ! empty( $attr['learnMoreStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-learnmore {';
				if ( isset( $attr['learnMoreStyles'][0]['size'][2] ) && ! empty( $attr['learnMoreStyles'][0]['size'][2] ) ) {
					$css .= 'font-size:' . $attr['learnMoreStyles'][0]['size'][2] . ( ! isset( $attr['learnMoreStyles'][0]['sizeType'] ) ? 'px' : $attr['learnMoreStyles'][0]['sizeType'] ) . ';';
				}
				if ( isset( $attr['learnMoreStyles'][0]['lineHeight'][2] ) && ! empty( $attr['learnMoreStyles'][0]['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $attr['learnMoreStyles'][0]['lineHeight'][2] . ( ! isset( $attr['learnMoreStyles'][0]['lineType'] ) ? 'px' : $attr['learnMoreStyles'][0]['lineType'] ) . ';';
				}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['displayShadow'] ) && ! empty( $attr['displayShadow'] ) && true === $attr['displayShadow'] ) {
			if ( isset( $attr['shadow'] ) && is_array( $attr['shadow'] ) && is_array( $attr['shadow'][ 0 ] ) ) {
				$shadow = $attr['shadow'][ 0 ];
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap {';
				$css .= 'box-shadow:' . $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $this->hex2rgba( $shadow['color'], $shadow['opacity'] ) . ';';
				$css .= '}';
			}
			if ( isset( $attr['shadowHover'] ) && is_array( $attr['shadowHover'] ) && is_array( $attr['shadowHover'][ 0 ] ) ) {
				$shadow_hover = $attr['shadowHover'][ 0 ];
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover {';
				$css .= 'box-shadow:' . $shadow_hover['hOffset'] . 'px ' . $shadow_hover['vOffset'] . 'px ' . $shadow_hover['blur'] . 'px ' . $shadow_hover['spread'] . 'px ' . $this->hex2rgba( $shadow_hover['color'], $shadow_hover['opacity'] ) . ';';
				$css .= '}';
			} else {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover {';
				$css .= 'box-shadow:0px 0px 14px 0px rgba(0,0,0,0.2);';
				$css .= '}';
			}
		}
		return $css;
	}
	/**
	 * Builds CSS for Spacer block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_spacer_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['tabletSpacerHeight'] ) && ! empty( $attr['tabletSpacerHeight'] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.kt-block-spacer-' . $unique_id . ' .kt-block-spacer {';
			$css .= 'height:' . $attr['tabletSpacerHeight'] . 'px !important;';
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['mobileSpacerHeight'] ) && ! empty( $attr['mobileSpacerHeight'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-block-spacer-' . $unique_id . ' .kt-block-spacer {';
			$css .= 'height:' . $attr['mobileSpacerHeight'] . 'px !important;';
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}

	/**
	 * Builds CSS for Tabs block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_tabs_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['contentBorder'] ) || isset( $attr['innerPadding'] ) || isset( $attr['minHeight'] ) || isset( $attr['contentBorderColor'] ) || isset( $attr['contentBgColor'] ) ) {
			$css .= '.kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .wp-block-kadence-tab {';
			if ( isset( $attr['contentBorder'] ) && ! empty( $attr['contentBorder'] ) && is_array( $attr['contentBorder'] ) ) {
				$css .= 'border-width:' . $attr['contentBorder'][0] . 'px ' . $attr['contentBorder'][1] . 'px ' . $attr['contentBorder'][2] . 'px ' . $attr['contentBorder'][3] . 'px;';
			}
			if ( isset( $attr['innerPadding'] ) && ! empty( $attr['innerPadding'] ) && is_array( $attr['innerPadding'] ) ) {
				$css .= 'padding:' . $attr['innerPadding'][0] . 'px ' . $attr['innerPadding'][1] . 'px ' . $attr['innerPadding'][2] . 'px ' . $attr['innerPadding'][3] . 'px;';
			}
			if ( isset( $attr['minHeight'] ) && ! empty( $attr['minHeight'] ) ) {
				$css .= 'min-height:' . $attr['minHeight'] . 'px;';
			}
			if ( isset( $attr['contentBorderColor'] ) && ! empty( $attr['contentBorderColor'] ) ) {
				$css .= 'border-color:' . $attr['contentBorderColor'] . ';';
			}
			if ( isset( $attr['contentBgColor'] ) && ! empty( $attr['contentBgColor'] ) ) {
				$css .= 'background:' . $attr['contentBgColor'] . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['titleMargin'] ) ) {
			$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li {';
			if ( isset( $attr['titleMargin'] ) && ! empty( $attr['titleMargin'] ) && is_array( $attr['titleMargin'] ) ) {
				$css .= 'margin:' . $attr['titleMargin'][0] . 'px ' . $attr['titleMargin'][1] . 'px ' . $attr['titleMargin'][2] . 'px ' . $attr['titleMargin'][3] . 'px;';
			}
			$css .= '}';
		}
		if ( isset( $attr['size'] ) || isset( $attr['lineHeight'] ) || isset( $attr['typography'] ) || isset( $attr['titleBorderWidth'] ) || isset( $attr['titleBorderRadius'] ) || isset( $attr['titlePadding'] ) || isset( $attr['titleBorder'] ) || isset( $attr['titleColor'] ) || isset( $attr['titleBg'] ) ) {
			$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title {';
			if ( isset( $attr['size'] ) && ! empty( $attr['size'] ) ) {
				$css .= 'font-size:' . $attr['size'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
			}
			if ( isset( $attr['lineHeight'] ) && ! empty( $attr['lineHeight'] ) ) {
				$css .= 'line-height:' . $attr['lineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
			}
			if ( isset( $attr['typography'] ) && ! empty( $attr['typography'] ) ) {
				$css .= 'font-family:' . $attr['typography'] . ';';
			}
			if ( isset( $attr['titleBorderWidth'] ) && ! empty( $attr['titleBorderWidth'] ) && is_array( $attr['titleBorderWidth'] ) ) {
				$css .= 'border-width:' . $attr['titleBorderWidth'][0] . 'px ' . $attr['titleBorderWidth'][1] . 'px ' . $attr['titleBorderWidth'][2] . 'px ' . $attr['titleBorderWidth'][3] . 'px ;';
			}
			if ( isset( $attr['titleBorderRadius'] ) && ! empty( $attr['titleBorderRadius'] ) && is_array( $attr['titleBorderRadius'] ) ) {
				$css .= 'border-radius:' . $attr['titleBorderRadius'][0] . 'px ' . $attr['titleBorderRadius'][1] . 'px ' . $attr['titleBorderRadius'][2] . 'px ' . $attr['titleBorderRadius'][3] . 'px ;';
			}
			if ( isset( $attr['titlePadding'] ) && ! empty( $attr['titlePadding'] ) && is_array( $attr['titlePadding'] ) ) {
				$css .= 'padding:' . $attr['titlePadding'][0] . 'px ' . $attr['titlePadding'][1] . 'px ' . $attr['titlePadding'][2] . 'px ' . $attr['titlePadding'][3] . 'px ;';
			}
			if ( isset( $attr['titleBorder'] ) && ! empty( $attr['titleBorder'] ) ) {
				$css .= 'border-color:' . $attr['titleBorder'] . ';';
			}
			if ( isset( $attr['titleColor'] ) && ! empty( $attr['titleColor'] ) ) {
				$css .= 'color:' . $attr['titleColor'] . ';';
			}
			if ( isset( $attr['titleBg'] ) && ! empty( $attr['titleBg'] ) ) {
				$css .= 'background:' . $attr['titleBg'] . ';';
			}
			$css .= '}';
		}
		// Hover.
		if ( isset( $attr['titleBorderHover'] ) || isset( $attr['titleColorHover'] ) || isset( $attr['titleBgHover'] ) ) {
			$css .= '.kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title:hover, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title:hover {';
			if ( isset( $attr['titleBorderHover'] ) && ! empty( $attr['titleBorderHover'] ) ) {
				$css .= 'border-color:' . $attr['titleBorderHover'] . ';';
			}
			if ( isset( $attr['titleColorHover'] ) && ! empty( $attr['titleColorHover'] ) ) {
				$css .= 'color:' . $attr['titleColorHover'] . ';';
			}
			if ( isset( $attr['titleBgHover'] ) && ! empty( $attr['titleBgHover'] ) ) {
				$css .= 'background:' . $attr['titleBgHover'] . ';';
			}
			$css .= '}';
		}
		// Active.
		if ( isset( $attr['titleBorderActive'] ) || isset( $attr['titleColorActive'] ) || isset( $attr['titleBgActive'] ) ) {
			$css .= '.kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tab-title-active .kt-tab-title  {';
			if ( isset( $attr['titleBorderActive'] ) && ! empty( $attr['titleBorderActive'] ) ) {
				$css .= 'border-color:' . $attr['titleBorderActive'] . ';';
			}
			if ( isset( $attr['titleColorActive'] ) && ! empty( $attr['titleColorActive'] ) ) {
				$css .= 'color:' . $attr['titleColorActive'] . ';';
			}
			if ( isset( $attr['titleBgActive'] ) && ! empty( $attr['titleBgActive'] ) ) {
				$css .= 'background:' . $attr['titleBgActive'] . ';';
			} else {
				$css .= 'background:#ffffff;';
			}
			$css .= '}';
		}
		if ( isset( $attr['tabSize'] ) || isset( $attr['tabLineHeight'] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.kt-tabs-id_' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title {';
			if ( isset( $attr['tabSize'] ) ) {
				$css .= 'font-size:' . $attr['tabSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
			}
			if ( isset( $attr['tabLineHeight'] ) ) {
				$css .= 'line-height:' . $attr['tabLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['mobileSize'] ) || isset( $attr['mobileLineHeight'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-tabs-id_' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title  {';
			if ( isset( $attr['mobileSize'] ) ) {
				$css .= 'font-size:' . $attr['mobileSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
			}
			if ( isset( $attr['mobileLineHeight'] ) ) {
				$css .= 'line-height:' . $attr['mobileLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}
	/**
	 * Adds Google fonts for infobox block.
	 *
	 * @param array  $attr the blocks attr.
	 */
	public function blocks_infobox_scripts_gfonts( $attr ) {
		if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && isset( $attr['titleFont'][0]['google'] ) && $attr['titleFont'][0]['google'] && ( ! isset( $attr['titleFont'][0]['loadGoogle'] ) || true === $attr['titleFont'][0]['loadGoogle'] ) &&  isset( $attr['titleFont'][0]['family'] ) ) {
			$title_font = $attr['titleFont'][0];
			// Check if the font has been added yet
			if ( ! array_key_exists( $title_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $title_font['family'],
					'fontvariants' => ( isset( $title_font['variant'] ) && ! empty( $title_font['variant'] ) ? array( $title_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $title_font['subset'] ) && !empty( $title_font['subset'] ) ? array( $title_font['subset'] ) : array() ),
				);
				self::$gfonts[ $title_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $title_font['variant'], self::$gfonts[ $title_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $title_font['family'] ]['fontvariants'], $title_font['variant'] );
				}
				if ( ! in_array( $title_font['subset'], self::$gfonts[ $title_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $title_font['family'] ]['fontsubsets'], $title_font['subset'] );
				}
			}
		}
		if ( isset( $attr['textFont'] ) && is_array( $attr['textFont'] ) && isset( $attr['textFont'][0] ) && is_array( $attr['textFont'][0] ) && isset( $attr['textFont'][0]['google'] ) && $attr['textFont'][0]['google'] && ( ! isset( $attr['textFont'][0]['loadGoogle'] ) || true === $attr['textFont'][0]['loadGoogle'] ) &&  isset( $attr['textFont'][0]['family'] ) ) {
			$text_font = $attr['textFont'][0];
			// Check if the font has been added yet
			if ( ! array_key_exists( $text_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $text_font['family'],
					'fontvariants' => ( isset( $text_font['variant'] ) && ! empty( $text_font['variant'] ) ? array( $text_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $text_font['subset'] ) && !empty( $text_font['subset'] ) ? array( $text_font['subset'] ) : array() ),
				);
				self::$gfonts[ $text_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $text_font['variant'], self::$gfonts[ $text_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $text_font['family'] ]['fontvariants'], $text_font['variant'] );
				}
				if ( ! in_array( $text_font['subset'], self::$gfonts[ $text_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $text_font['family'] ]['fontsubsets'], $text_font['subset'] );
				}
			}
		}
		if ( isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && isset( $attr['learnMoreStyles'][0] ) && is_array( $attr['learnMoreStyles'][0] ) && isset( $attr['learnMoreStyles'][0]['google'] ) && $attr['learnMoreStyles'][0]['google'] && ( ! isset( $attr['learnMoreStyles'][0]['loadGoogle'] ) || true === $attr['learnMoreStyles'][0]['loadGoogle'] ) &&  isset( $attr['learnMoreStyles'][0]['family'] ) ) {
			$learn_more_font = $attr['learnMoreStyles'][0];
			// Check if the font has been added yet
			if ( ! array_key_exists( $learn_more_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $learn_more_font['family'],
					'fontvariants' => ( isset( $learn_more_font['variant'] ) && ! empty( $learn_more_font['variant'] ) ? array( $learn_more_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $learn_more_font['subset'] ) && !empty( $learn_more_font['subset'] ) ? array( $learn_more_font['subset'] ) : array() ),
				);
				self::$gfonts[ $learn_more_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $learn_more_font['variant'], self::$gfonts[ $learn_more_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $learn_more_font['family'] ]['fontvariants'], $learn_more_font['variant'] );
				}
				if ( ! in_array( $learn_more_font['subset'], self::$gfonts[ $learn_more_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $learn_more_font['family'] ]['fontsubsets'], $learn_more_font['subset'] );
				}
			}
		}
	}
	/**
	 * Adds Scripts for row block.
	 *
	 * @param array  $attr the blocks attr.
	 */
	public function render_row_layout_scripts( $attr ) {
		if ( ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] ) || ( isset( $attr['overlayBgImg'] ) && ! empty( $attr['overlayBgImg']) && isset( $attr['overlayBgImgAttachment'] ) && 'parallax' === $attr['overlayBgImgAttachment'] ) ) {
			wp_enqueue_script( 'kadence-blocks-parallax-js' );
		}
	}
	/**
	 * Adds Scripts and Google fonts for Tabs block.
	 *
	 * @param array  $attr the blocks attr.
	 */
	public function blocks_tabs_scripts_gfonts( $attr ) {
		wp_enqueue_script( 'kadence-blocks-tabs-js' );
		if ( isset( $attr['googleFont'] ) && $attr['googleFont'] && ( ! isset( $attr['loadGoogleFont'] ) || true == $attr['loadGoogleFont'] ) && isset( $attr['typography'] ) ) {
			// Check if the font has been added yet.
			if ( ! array_key_exists( $attr['typography'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $attr['typography'],
					'fontvariants' => ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ? array( $attr['fontVariant'] ) : array() ),
					'fontsubsets' => ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ? array( $attr['fontSubset'] ) : array() ),
				);
				self::$gfonts[ $attr['typography'] ] = $add_font;
			} else {
				if ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ) {
					if ( ! in_array( $attr['fontVariant'], self::$gfonts[ $attr['typography'] ]['fontvariants'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontvariants'], $attr['fontVariant'] );
					}
				}
				if ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ) {
					if ( ! in_array( $attr['fontSubset'], self::$gfonts[ $attr['typography'] ]['fontsubsets'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontsubsets'], $attr['fontSubset'] );
					}
				}
			}
		}
	}
	/**
	 * Adds Scripts and Google fonts for Accordion block.
	 *
	 * @param array  $attr the blocks attr.
	 */
	public function blocks_accordion_scripts_gfonts( $attr ) {
		wp_enqueue_script( 'kadence-blocks-accordion-js' );
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && isset( $attr['titleStyles'][0] ) && is_array( $attr['titleStyles'][0] ) && isset( $attr['titleStyles'][0]['google'] ) && $attr['titleStyles'][0]['google'] && ( ! isset( $attr['titleStyles'][0]['loadGoogle'] ) || true === $attr['titleStyles'][0]['loadGoogle'] ) &&  isset( $attr['titleStyles'][0]['family'] ) ) {
			$title_styles = $attr['titleStyles'][0];
			// Check if the font has been added yet
			if ( ! array_key_exists( $title_styles['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $title_styles['family'],
					'fontvariants' => ( isset( $title_styles['variant'] ) && ! empty( $title_styles['variant'] ) ? array( $title_styles['variant'] ) : array() ),
					'fontsubsets' => ( isset( $title_styles['subset'] ) && !empty( $title_styles['subset'] ) ? array( $title_styles['subset'] ) : array() ),
				);
				self::$gfonts[ $title_styles['family'] ] = $add_font;
			} else {
				if ( ! in_array( $title_styles['variant'], self::$gfonts[ $title_styles['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $title_styles['family'] ]['fontvariants'], $title_styles['variant'] );
				}
				if ( ! in_array( $title_styles['subset'], self::$gfonts[ $title_styles['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $title_styles['family'] ]['fontsubsets'], $title_styles['subset'] );
				}
			}
		}
	}
	/**
	 * Builds CSS for Accordion block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_accordion_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['contentBorderColor'] ) || isset( $attr['contentBgColor'] ) || isset( $attr['contentPadding'] ) || isset( $attr['contentBorderRadius'] ) || isset( $attr['contentBorder'] ) ) {
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner {';
			if ( isset( $attr['contentBorderColor'] ) && ! empty( $attr['contentBorderColor'] ) ) {
				$css .= 'border-color:' . $attr['contentBorderColor'] . ';';
			}
			if ( isset( $attr['contentBorderRadius'] ) && ! empty( $attr['contentBorderRadius'] ) ) {
				$css .= 'border-radius:' . $attr['contentBorderRadius'][ 0 ] . 'px ' . $attr['contentBorderRadius'][ 1 ] . 'px ' . $attr['contentBorderRadius'][ 2 ] . 'px ' . $attr['contentBorderRadius'][ 3 ] . 'px;';
			}
			if ( isset( $attr['contentBgColor'] ) && ! empty( $attr['contentBgColor'] ) ) {
				$css .= 'background:' . $attr['contentBgColor'] . ';';
			}
			if ( isset( $attr['contentPadding'] ) && is_array( $attr['contentPadding'] ) ) {
				$css .= 'padding:' . $attr['contentPadding'][ 0 ] . 'px ' . $attr['contentPadding'][ 1 ] . 'px ' . $attr['contentPadding'][ 2 ] . 'px ' . $attr['contentPadding'][ 3 ] . 'px;';
			}
			if ( isset( $attr['contentBorder'] ) && is_array( $attr['contentBorder'] ) ) {
				$css .= 'border-width:' . $attr['contentBorder'][ 0 ] . 'px ' . $attr['contentBorder'][ 1 ] . 'px ' . $attr['contentBorder'][ 2 ] . 'px ' . $attr['contentBorder'][ 3 ] . 'px;';
			}
			$css .= '}';
		}
		
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && is_array( $attr['titleStyles'][ 0 ] ) ) {
			$title_styles = $attr['titleStyles'][ 0 ];
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header {';
			if ( isset( $title_styles['color'] ) && ! empty( $title_styles['color'] ) ) {
				$css .= 'color:' . $title_styles['color'] .  ';';
			}
			if ( isset( $title_styles['background'] ) && ! empty( $title_styles['background'] ) ) {
				$css .= 'background:' . $title_styles['background'] .  ';';
			}
			if ( isset( $title_styles['border'] ) && is_array( $title_styles['border'] ) && ! empty( $title_styles['border'][ 0 ] ) ) {
				$css .= 'border-color:' . $title_styles['border'][0] . ' ' . $title_styles['border'][1] . ' ' . $title_styles['border'][2] . ' ' . $title_styles['border'][3] . ';';
			}
			if ( isset( $title_styles['size'] ) && is_array( $title_styles['size'] ) && ! empty( $title_styles['size'][0] ) ) {
				$css .= 'font-size:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
			}
			if ( isset( $title_styles['lineHeight'] ) && is_array( $title_styles['lineHeight'] ) && ! empty( $title_styles['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $title_styles['lineHeight'][0] . ( ! isset( $title_styles['lineType'] ) ? 'px' : $title_styles['lineType'] ) . ';';
			}
			if ( isset( $title_styles['letterSpacing'] ) && ! empty( $title_styles['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $title_styles['letterSpacing'] .  'px;';
			}
			if ( isset( $title_styles['family'] ) && ! empty( $title_styles['family'] ) ) {
				$css .= 'font-family:' . $title_styles['family'] .  ';';
			}
			if ( isset( $title_styles['style'] ) && ! empty( $title_styles['style'] ) ) {
				$css .= 'font-style:' . $title_styles['style'] .  ';';
			}
			if ( isset( $title_styles['weight'] ) && ! empty( $title_styles['weight'] ) ) {
				$css .= 'font-weight:' . $title_styles['weight'] .  ';';
			}
			if ( isset( $title_styles['borderRadius'] ) && is_array( $title_styles['borderRadius'] ) ) {
				$css .= 'border-radius:' . $title_styles['borderRadius'][0] . 'px ' . $title_styles['borderRadius'][1] . 'px ' . $title_styles['borderRadius'][2] . 'px ' . $title_styles['borderRadius'][3] . 'px;';
			}
			if ( isset( $title_styles['borderWidth'] ) && is_array( $title_styles['borderWidth'] ) ) {
				$css .= 'border-width:' . $title_styles['borderWidth'][0] . 'px ' . $title_styles['borderWidth'][1] . 'px ' . $title_styles['borderWidth'][2] . 'px ' . $title_styles['borderWidth'][3] . 'px;';
			}
			if ( isset( $title_styles['padding'] ) && is_array( $title_styles['padding'] ) ) {
				$css .= 'padding:' . $title_styles['padding'][0] . 'px ' . $title_styles['padding'][1] . 'px ' . $title_styles['padding'][2] . 'px ' . $title_styles['padding'][3] . 'px;';
			}
			if ( isset( $title_styles['marginTop'] ) && ! empty( $title_styles['marginTop'] ) ) {
				$css .= 'margin-top:' . $title_styles['marginTop'] . 'px;';
			}
			$css .= '}';
			if ( isset( $title_styles['size'] ) && is_array( $title_styles['size'] ) && ! empty( $title_styles['size'][0] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
					$css .= 'width:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
					$css .= 'height:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
				$css .= '}';
			}
			if ( isset( $title_styles['color'] ) && ! empty( $title_styles['color'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['color'] .  ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger {';
					$css .= 'background:' . $title_styles['color'] .  ';';
				$css .= '}';
			}
			if ( isset( $title_styles['background'] ) && ! empty( $title_styles['background'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:before {';
					$css .= 'background:' . $title_styles['background'] .  ';';
				$css .= '}';
			}
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header:hover {';
				if ( isset( $title_styles['colorHover'] ) && ! empty( $title_styles['colorHover'] ) ) {
					$css .= 'color:' . $title_styles['colorHover'] .  ';';
				}
				if ( isset( $title_styles['backgroundHover'] ) && ! empty( $title_styles['backgroundHover'] ) ) {
					$css .= 'background:' . $title_styles['backgroundHover'] .  ';';
				}
				if ( isset( $title_styles['borderHover'] ) && is_array( $title_styles['borderHover'] ) && ! empty( $title_styles['borderHover'][0] ) ) {
					$css .= 'border-color:' . $title_styles['borderHover'][0] . ' ' . $title_styles['borderHover'][1] . ' ' . $title_styles['borderHover'][2] . ' ' . $title_styles['borderHover'][3] . ';';
				}
			$css .= '}';
			if ( isset( $title_styles['colorHover'] ) && ! empty( $title_styles['colorHover'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['colorHover'] .  ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger {';
					$css .= 'background:' . $title_styles['colorHover'] .  ';';
				$css .= '}';
			}
			if ( isset( $title_styles['backgroundHover'] ) && ! empty( $title_styles['backgroundHover'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before {';
					$css .= 'background:' . $title_styles['backgroundHover'] .  ';';
				$css .= '}';
			}
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header.kt-accordion-panel-active {';
				if ( isset( $title_styles['colorActive'] ) && ! empty( $title_styles['colorActive'] ) ) {
					$css .= 'color:' . $title_styles['colorActive'] .  ';';
				}
				if ( isset( $title_styles['backgroundActive'] ) && ! empty( $title_styles['backgroundActive'] ) ) {
					$css .= 'background:' . $title_styles['backgroundActive'] .  ';';
				}
				if ( isset( $title_styles['borderActive'] ) && is_array( $title_styles['borderActive'] ) && ! empty( $title_styles['borderActive'][0] ) ) {
					$css .= 'border-color:' . $title_styles['borderActive'][0] . ' ' . $title_styles['borderActive'][1] . ' ' . $title_styles['borderActive'][2] . ' ' . $title_styles['borderActive'][3] . ';';
				}
			$css .= '}';
			if ( isset( $title_styles['colorActive'] ) && ! empty( $title_styles['colorActive'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $title_styles['colorActive'] .  ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger {';
					$css .= 'background:' . $title_styles['colorActive'] .  ';';
				$css .= '}';
			}
			if ( isset( $title_styles['backgroundActive'] ) && ! empty( $title_styles['backgroundActive'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before {';
					$css .= 'background:' . $title_styles['backgroundActive'] .  ';';
				$css .= '}';
			}
		}
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && isset( $attr['titleStyles'][0] ) && is_array( $attr['titleStyles'][0] ) && ( ( isset( $attr['titleStyles'][0]['size'] ) && is_array( $attr['titleStyles'][0]['size'] ) && isset( $attr['titleStyles'][0]['size'][1] ) && ! empty( $attr['titleStyles'][0]['size'][1] ) ) || ( isset( $attr['titleStyles'][0]['lineHeight'] ) && is_array( $attr['titleStyles'][0]['lineHeight'] ) && isset( $attr['titleStyles'][0]['lineHeight'][1] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header {';
			if ( isset( $attr['titleStyles'][0]['size'][1] ) && ! empty( $attr['titleStyles'][0]['size'][1] ) ) {
				$css .= 'font-size:' . $attr['titleStyles'][0]['size'][1] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['titleStyles'][0]['lineHeight'][1] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['titleStyles'][0]['lineHeight'][1] . ( ! isset( $attr['titleStyles'][0]['lineType'] ) ? 'px' : $attr['titleStyles'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
				$css .= 'width:' . $attr['titleStyles'][0]['size'][1] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
				$css .= 'height:' . $attr['titleStyles'][0]['size'][1] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && isset( $attr['titleStyles'][0] ) && is_array( $attr['titleStyles'][0] ) && ( ( isset( $attr['titleStyles'][0]['size'] ) && is_array( $attr['titleStyles'][0]['size'] ) && isset( $attr['titleStyles'][0]['size'][2] ) && ! empty( $attr['titleStyles'][0]['size'][2] ) ) || ( isset( $attr['titleStyles'][0]['lineHeight'] ) && is_array( $attr['titleStyles'][0]['lineHeight'] ) && isset( $attr['titleStyles'][0]['lineHeight'][2] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header {';
				if ( isset( $attr['titleStyles'][0]['size'][2] ) && ! empty( $attr['titleStyles'][0]['size'][2] ) ) {
					$css .= 'font-size:' . $attr['titleStyles'][0]['size'][2] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
				}
				if ( isset( $attr['titleStyles'][0]['lineHeight'][2] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $attr['titleStyles'][0]['lineHeight'][2] . ( ! isset( $attr['titleStyles'][0]['lineType'] ) ? 'px' : $attr['titleStyles'][0]['lineType'] ) . ';';
				}
			$css .= '}';
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
				$css .= 'width:' . $attr['titleStyles'][0]['size'][2] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
				$css .= 'height:' . $attr['titleStyles'][0]['size'][2] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}
	/**
	 * Builds CSS for Advanced Heading block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_advanced_heading_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['size'] ) || isset( $attr['lineHeight'] ) || isset( $attr['typography'] ) || isset( $attr['fontWeight'] ) || isset( $attr['fontStyle'] ) ) {
			$css .= '#kt-adv-heading' . $unique_id . ' {';
			if ( isset( $attr['size'] ) && ! empty( $attr['size'] ) ) {
				$css .= 'font-size:' . $attr['size'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
			}
			if ( isset( $attr['lineHeight'] ) && ! empty( $attr['lineHeight'] ) ) {
				$css .= 'line-height:' . $attr['lineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
			}
			if ( isset( $attr['fontWeight'] ) && ! empty( $attr['fontWeight'] ) ) {
				$css .= 'font-weight:' . $attr['fontWeight'] . ';';
			}
			if ( isset( $attr['fontStyle'] ) && ! empty( $attr['fontStyle'] ) ) {
				$css .= 'font-style:' . $attr['fontStyle'] . ';';
			}
			if ( isset( $attr['typography'] ) && ! empty( $attr['typography'] ) ) {
				$css .= 'font-family:' . $attr['typography'] . ';';
			}
			$css .= '}';
		}
		// Highlight.
		if ( isset( $attr['markBorder'] ) || isset( $attr['markBorderWidth'] ) || isset( $attr['markBorderStyle'] ) || isset( $attr['markPadding'] ) || isset( $attr['markLetterSpacing'] ) || isset( $attr['markSize'] ) || isset( $attr['markLineHeight'] ) || isset( $attr['markTypography'] ) || isset( $attr['markColor'] ) || isset( $attr['markBG'] ) ) {
			$css .= '#kt-adv-heading' . $unique_id . ' mark {';
			if ( isset( $attr['markLetterSpacing'] ) && ! empty( $attr['markLetterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $attr['markLetterSpacing'] . 'px;';
			}
			if ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][0] ) ) {
				$css .= 'font-size:' . $attr['markSize'][0] . ( ! isset( $attr['markSizeType'] ) ? 'px' : $attr['markSizeType'] ) . ';';
			}
			if ( isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][0] ) ) {
				$css .= 'line-height:' . $attr['markLineHeight'][0] . ( ! isset( $attr['markLineType'] ) ? 'px' : $attr['markLineType'] ) . ';';
			}
			if ( isset( $attr['markTypography'] ) && ! empty( $attr['markTypography'] ) ) {
				$css .= 'font-family:' . $attr['markTypography'] . ';';
			}
			if ( isset( $attr['markFontWeight'] ) && ! empty( $attr['markFontWeight'] ) ) {
				$css .= 'font-weight:' . $attr['markFontWeight'] . ';';
			}
			if ( isset( $attr['markFontStyle'] ) && ! empty( $attr['markFontStyle'] ) ) {
				$css .= 'font-style:' . $attr['markFontStyle'] . ';';
			}
			if ( isset( $attr['markColor'] ) && ! empty( $attr['markColor'] ) ) {
				$css .= 'color:' . $attr['markColor'] . ';';
			}
			if ( isset( $attr['markBG'] ) && ! empty( $attr['markBG'] ) ) {
				$alpha = ( isset( $attr['markBGOpacity'] ) && ! empty( $attr['markBGOpacity'] ) ? $attr['markBGOpacity'] : 1 );
				$css .= 'background:' . $this->hex2rgba( $attr['markBG'], $alpha ) . ';';
			}
			if ( isset( $attr['markBorder'] ) && ! empty( $attr['markBorder'] ) ) {
				$alpha = ( isset( $attr['markBorderOpacity'] ) && ! empty( $attr['markBorderOpacity'] ) ? $attr['markBorderOpacity'] : 1 );
				$css .= 'border-color:' . $this->hex2rgba( $attr['markBorder'], $alpha ) . ';';
			}
			if ( isset( $attr['markBorderWidth'] ) && ! empty( $attr['markBorderWidth'] ) ) {
				$css .= 'border-width:' . $attr['markBorderWidth'] . 'px;';
			}
			if ( isset( $attr['markBorderStyle'] ) && ! empty( $attr['markBorderStyle'] ) ) {
				$css .= 'border-style:' . $attr['markBorderStyle'] . ';';
			}
			if ( isset( $attr['markPadding'] ) && is_array( $attr['markPadding'] ) ) {
				$css .= 'padding:' . ( isset( $attr['markPadding'][0] ) ? $attr['markPadding'][0] . 'px' : 0 ) . ' ' . ( isset( $attr['markPadding'][1] ) ? $attr['markPadding'][1] . 'px' : 0 ) . ' ' . ( isset( $attr['markPadding'][2] ) ? $attr['markPadding'][2] . 'px' : 0 ) . ' ' . ( isset( $attr['markPadding'][3] ) ? $attr['markPadding'][3] . 'px' : 0 ) . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['tabSize'] ) || isset( $attr['tabLineHeight'] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#kt-adv-heading' . $unique_id . ' {';
			if ( isset( $attr['tabSize'] ) ) {
				$css .= 'font-size:' . $attr['tabSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
			}
			if ( isset( $attr['tabLineHeight'] ) ) {
				$css .= 'line-height:' . $attr['tabLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][1] ) ) || isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][1] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#kt-adv-heading' . $unique_id . ' mark {';
			if ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][1] ) ) {
				$css .= 'font-size:' . $attr['markSize'][1] . ( ! isset( $attr['markSizeType'] ) ? 'px' : $attr['markSizeType'] ) . ';';
			}
			if ( isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['markLineHeight'][1] . ( ! isset( $attr['markLineType'] ) ? 'px' : $attr['markLineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['mobileSize'] ) || isset( $attr['mobileLineHeight'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#kt-adv-heading' . $unique_id . ' {';
			if ( isset( $attr['mobileSize'] ) ) {
				$css .= 'font-size:' . $attr['mobileSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
			}
			if ( isset( $attr['mobileLineHeight'] ) ) {
				$css .= 'line-height:' . $attr['mobileLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][2] ) ) || isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][2] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#kt-adv-heading' . $unique_id . ' mark {';
			if ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][2] ) ) {
				$css .= 'font-size:' . $attr['markSize'][2] . ( ! isset( $attr['markSizeType'] ) ? 'px' : $attr['markSizeType'] ) . ';';
			}
			if ( isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][2] ) ) {
				$css .= 'line-height:' . $attr['markLineHeight'][2] . ( ! isset( $attr['markLineType'] ) ? 'px' : $attr['markLineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}
	/**
	 * Adds Google fonts for Advanced Heading block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_advanced_heading_gfont( $attr ) {
		if ( isset( $attr['googleFont'] ) && $attr['googleFont'] && ( ! isset( $attr['loadGoogleFont'] ) || true == $attr['loadGoogleFont'] ) && isset( $attr['typography'] ) ) {
			// Check if the font has been added yet.
			if ( ! array_key_exists( $attr['typography'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $attr['typography'],
					'fontvariants' => ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ? array( $attr['fontVariant'] ) : array() ),
					'fontsubsets' => ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ? array( $attr['fontSubset'] ) : array() ),
				);
				self::$gfonts[ $attr['typography'] ] = $add_font;
			} else {
				if ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ) {
					if ( ! in_array( $attr['fontVariant'], self::$gfonts[ $attr['typography'] ]['fontvariants'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontvariants'], $attr['fontVariant'] );
					}
				}
				if ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ) {
					if ( ! in_array( $attr['fontSubset'], self::$gfonts[ $attr['typography'] ]['fontsubsets'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontsubsets'], $attr['fontSubset'] );
					}
				}
			}
		}
		if ( isset( $attr['markGoogleFont'] ) && $attr['markGoogleFont'] && ( ! isset( $attr['markLoadGoogleFont'] ) || true == $attr['markLoadGoogleFont'] ) && isset( $attr['markTypography'] ) ) {
			// Check if the font has been added yet.
			if ( ! array_key_exists( $attr['markTypography'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $attr['markTypography'],
					'fontvariants' => ( isset( $attr['markFontVariant'] ) && ! empty( $attr['markFontVariant'] ) ? array( $attr['markFontVariant'] ) : array() ),
					'fontsubsets' => ( isset( $attr['markFontSubset'] ) && ! empty( $attr['markFontSubset'] ) ? array( $attr['markFontSubset'] ) : array() ),
				);
				self::$gfonts[ $attr['markTypography'] ] = $add_font;
			} else {
				if ( isset( $attr['markFontVariant'] ) && ! empty( $attr['markFontVariant'] ) ) {
					if ( ! in_array( $attr['markFontVariant'], self::$gfonts[ $attr['markTypography'] ]['fontvariants'], true ) ) {
						array_push( self::$gfonts[ $attr['markTypography'] ]['fontvariants'], $attr['markFontVariant'] );
					}
				}
				if ( isset( $attr['markFontSubset'] ) && ! empty( $attr['markFontSubset'] ) ) {
					if ( ! in_array( $attr['markFontSubset'], self::$gfonts[ $attr['markTypography'] ]['fontsubsets'], true ) ) {
						array_push( self::$gfonts[ $attr['markTypography'] ]['fontsubsets'], $attr['markFontSubset'] );
					}
				}
			}
		}
	}
	/**
	 * Builds CSS for Advanced Button block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_advanced_btn_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['typography'] ) ) {
			$css .= '.kt-btns' . $unique_id . ' {';
			if ( isset( $attr['typography'] ) && ! empty( $attr['typography'] ) ) {
				$css .= 'font-family:' . $attr['typography'] . ';';
			}
			if ( isset( $attr['fontWeight'] ) && ! empty( $attr['fontWeight'] ) ) {
				$css .= 'font-weight:' . $attr['fontWeight'] . ';';
			}
			if ( isset( $attr['fontStyle'] ) && ! empty( $attr['fontStyle'] ) ) {
				$css .= 'font-style:' . $attr['fontStyle'] . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['btns'] ) && is_array( $attr['btns'] ) ) {
			foreach ( $attr['btns'] as $btnkey => $btnvalue ) {
				if ( is_array( $btnvalue ) ) {
					$css .= '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button {';
					if ( isset( $btnvalue['color'] ) && ! empty( $btnvalue['color'] ) ) {
						$css .= 'color:' . $btnvalue['color'] . ';';
					}
					if ( isset( $btnvalue['background'] ) && ! empty( $btnvalue['background'] ) ) {
						$css .= 'background:' . $btnvalue['background'] . ';';
					}
					if ( isset( $btnvalue['border'] ) && ! empty( $btnvalue['border'] ) ) {
						$css .= 'border-color:' . $btnvalue['border'] . ';';
					}
					$css .= '}';
					$css .= '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:hover, .kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:focus {';
					if ( isset( $btnvalue['colorHover'] ) && ! empty( $btnvalue['colorHover'] ) ) {
						$css .= 'color:' . $btnvalue['colorHover'] . ';';
					}
					if ( isset( $btnvalue['backgroundHover'] ) && ! empty( $btnvalue['backgroundHover'] ) ) {
						$css .= 'background:' . $btnvalue['backgroundHover'] . ';';
					}
					if ( isset( $btnvalue['borderHover'] ) && ! empty( $btnvalue['borderHover'] ) ) {
						$css .= 'border-color:' . $btnvalue['borderHover'] . ';';
					}
					$css .= '}';
				}
			}
		}
		return $css;
	}
	/**
	 * Builds CSS for Advanced Button block.
	 *
	 * @param array  $attr the blocks attr.
	 */
	public function blocks_advanced_btn_gfont( $attr ) {
		if ( isset( $attr['googleFont'] ) && $attr['googleFont'] && ( ! isset( $attr['loadGoogleFont'] ) || true == $attr['loadGoogleFont'] ) && isset( $attr['typography'] ) ) {
			// Check if the font has been added yet.
			if ( ! array_key_exists( $attr['typography'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $attr['typography'],
					'fontvariants' => ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ? array( $attr['fontVariant'] ) : array() ),
					'fontsubsets' => ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ? array( $attr['fontSubset'] ) : array() ),
				);
				self::$gfonts[ $attr['typography'] ] = $add_font;
			} else {
				if ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ) {
					if ( ! in_array( $attr['fontVariant'], self::$gfonts[ $attr['typography'] ]['fontvariants'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontvariants'], $attr['fontVariant'] );
					}
				}
				if ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ) {
					if ( ! in_array( $attr['fontSubset'], self::$gfonts[ $attr['typography'] ]['fontsubsets'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontsubsets'], $attr['fontSubset'] );
					}
				}
			}
		}
	}
	/**
	 * Builds Css for row layout block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function row_layout_array_css( $attr, $unique_id ) {
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
				if ( isset( $attr['bgImgAttachment'] ) ) {
					if ( 'parallax' === $attr['bgImgAttachment'] ) {
						$bg_attach = 'fixed';
					} else {
						$bg_attach = $attr['bgImgAttachment'];
					}
				} else {
					$bg_attach = 'scroll';
				}
				$css .= 'background-image:url(' . $attr['bgImg'] . ');';
				$css .= 'background-size:' . ( isset( $attr['bgImgSize'] ) ? $attr['bgImgSize'] : 'cover' ) . ';';
				$css .= 'background-position:' . ( isset( $attr['bgImgPosition'] ) ? $attr['bgImgPosition'] : 'center center' ) . ';';
				$css .= 'background-attachment:' . $bg_attach . ';';
				$css .= 'background-repeat:' . ( isset( $attr['bgImgRepeat'] ) ? $attr['bgImgRepeat'] : 'no-repeat' ) . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['textColor'] ) ) {
			$css .= '.kt-layout-id' . $unique_id . ', .kt-layout-id' . $unique_id . ' h1, .kt-layout-id' . $unique_id . ' h2, .kt-layout-id' . $unique_id . ' h3, .kt-layout-id' . $unique_id . ' h4, .kt-layout-id' . $unique_id . ' h5, .kt-layout-id' . $unique_id . ' h6 {';
				$css .= 'color:' . $attr['textColor'] . ';';
			$css .= '}';
		}
		if ( isset( $attr['linkColor'] ) ) {
			$css .= '.kt-layout-id' . $unique_id . ' a {';
				$css .= 'color:' . $attr['linkColor'] . ';';
			$css .= '}';
		}
		if ( isset( $attr['linkHoverColor'] ) ) {
			$css .= '.kt-layout-id' . $unique_id . ' a:hover {';
				$css .= 'color:' . $attr['linkHoverColor'] . ';';
			$css .= '}';
		}
		if ( isset( $attr['bottomSep'] ) && 'none' != $attr['bottomSep'] ) {
			if ( isset( $attr['bottomSepHeight'] ) || isset( $attr['bottomSepWidth'] ) ) {
				if ( isset( $attr['bottomSepHeight'] ) ) {
					$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep {';
						$css .= 'height:' . $attr['bottomSepHeight'] . 'px;';
					$css .= '}';
				}
				if ( isset( $attr['bottomSepWidth'] ) ) {
					$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg {';
						$css .= 'width:' . $attr['bottomSepWidth'] . '%;';
					$css .= '}';
				}
			}
			if ( isset( $attr['bottomSepHeightTablet'] ) || isset( $attr['bottomSepWidthTablet'] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
					if ( isset( $attr['bottomSepHeightTablet'] ) ) {
						$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep {';
							$css .= 'height:' . $attr['bottomSepHeightTablet'] . 'px;';
						$css .= '}';
					}
					if ( isset( $attr['bottomSepWidthTablet'] ) ) {
						$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg {';
							$css .= 'width:' . $attr['bottomSepWidthTablet'] . '%;';
						$css .= '}';
					}
				$css .= '}';
			}
			if ( isset( $attr['bottomSepHeightMobile'] ) || isset( $attr['bottomSepWidthMobile'] ) ) {
				$css .= '@media (max-width: 767px) {';
					if ( isset( $attr['bottomSepHeightMobile'] ) ) {
						$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep {';
							$css .= 'height:' . $attr['bottomSepHeightMobile'] . 'px;';
						$css .= '}';
					}
					if ( isset( $attr['bottomSepWidthMobile'] ) ) {
						$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg {';
							$css .= 'width:' . $attr['bottomSepWidthMobile'] . '%;';
						$css .= '}';
					}
				$css .= '}';
			}
		}
		if ( isset( $attr['topSep'] ) && 'none' != $attr['topSep'] ) {
			if ( isset( $attr['topSepHeight'] ) || isset( $attr['topSepWidth'] ) ) {
				if ( isset( $attr['topSepHeight'] ) ) {
					$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep {';
						$css .= 'height:' . $attr['topSepHeight'] . 'px;';
					$css .= '}';
				}
				if ( isset( $attr['topSepWidth'] ) ) {
					$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg {';
						$css .= 'width:' . $attr['topSepWidth'] . '%;';
					$css .= '}';
				}
			}
			if ( isset( $attr['topSepHeightTablet'] ) || isset( $attr['topSepWidthTablet'] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
					if ( isset( $attr['topSepHeightTablet'] ) ) {
						$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep {';
							$css .= 'height:' . $attr['topSepHeightTablet'] . 'px;';
						$css .= '}';
					}
					if ( isset( $attr['topSepWidthTablet'] ) ) {
						$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg {';
							$css .= 'width:' . $attr['topSepWidthTablet'] . '%;';
						$css .= '}';
					}
				$css .= '}';
			}
			if ( isset( $attr['topSepHeightMobile'] ) || isset( $attr['topSepWidthMobile'] ) ) {
				$css .= '@media (max-width: 767px) {';
					if ( isset( $attr['topSepHeightMobile'] ) ) {
						$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep {';
							$css .= 'height:' . $attr['topSepHeightMobile'] . 'px;';
						$css .= '}';
					}
					if ( isset( $attr['topSepWidthMobile'] ) ) {
						$css .= '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg {';
							$css .= 'width:' . $attr['topSepWidthMobile'] . '%;';
						$css .= '}';
					}
				$css .= '}';
			}
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
						if ( isset( $attr['overlayBgImgAttachment'] ) ) {
							if ( 'parallax' === $attr['overlayBgImgAttachment'] ) {
								$overbg_attach = 'fixed';
							} else {
								$overbg_attach = $attr['overlayBgImgAttachment'];
							}
						} else {
							$overbg_attach = 'scroll';
						}
						$css .= 'background-image:url(' . $attr['overlayBgImg'] . ');';
						$css .= 'background-size:' . ( isset( $attr['overlayBgImgSize'] ) ? $attr['overlayBgImgSize'] : 'cover' ) . ';';
						$css .= 'background-position:' . ( isset( $attr['overlayBgImgPosition'] ) ? $attr['overlayBgImgPosition'] : 'center center' ) . ';';
						$css .= 'background-attachment:' . $overbg_attach . ';';
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
	 * @param object $attr the blocks attr.
	 * @param string $unique_id the blocks parent attr ID.
	 */
	public function column_layout_css( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) || isset( $attr['rightMargin'] ) || isset( $attr['leftMargin'] ) || isset( $attr['border'] ) || isset( $attr['borderWidth'] ) ) {
			$css .= '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id . ' > .kt-inside-inner-col {';
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
			if ( isset( $attr['rightMargin'] ) ) {
				$css .= 'margin-right:' . $attr['rightMargin'] . 'px;';
			}
			if ( isset( $attr['leftMargin'] ) ) {
				$css .= 'margin-left:' . $attr['leftMargin'] . 'px;';
			}
			if ( isset( $attr['border'] ) ) {
				$alpha = ( isset( $attr['borderOpacity'] ) && ! empty( $attr['borderOpacity'] ) ? $attr['borderOpacity'] : 1 );
				$css .= 'border-color:' . $this->hex2rgba( $attr['border'], $alpha ) . ';';
			}
			if ( isset( $attr['borderWidth'] ) && ! empty( $attr['borderWidth'] ) && is_array( $attr['borderWidth'] ) ) {
				$css .= 'border-width:' . $attr['borderWidth'][0] . 'px ' . $attr['borderWidth'][1] . 'px ' . $attr['borderWidth'][2] . 'px ' . $attr['borderWidth'][3] . 'px ;';
			}
			if ( isset( $attr['borderRadius'] ) && ! empty( $attr['borderRadius'] ) && is_array( $attr['borderRadius'] ) ) {
				$css .= 'border-radius:' . $attr['borderRadius'][0] . 'px ' . $attr['borderRadius'][1] . 'px ' . $attr['borderRadius'][2] . 'px ' . $attr['borderRadius'][3] . 'px ;';
			}
			$css .= '}';
		}
		if ( isset( $attr['zIndex'] ) ) {
			$css .= '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id . ' {';
			if ( isset( $attr['zIndex'] ) ) {
				$css .= 'z-index:' . $attr['zIndex'] . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) || isset( $attr['rightMarginM'] ) || isset( $attr['leftMarginM'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id . ' > .kt-inside-inner-col {';
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
			if ( isset( $attr['rightMarginM'] ) ) {
				$css .= 'margin-right:' . $attr['rightMarginM'] . 'px;';
			}
			if ( isset( $attr['leftMarginM'] ) ) {
				$css .= 'margin-left:' . $attr['leftMarginM'] . 'px;';
			}
			$css .= '}';
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
	public function column_layout_array_css( $attr, $unique_id, $column_key ) {
		$css = '';
		if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) || isset( $attr['rightMargin'] ) || isset( $attr['leftMargin'] ) ) {
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
			if ( isset( $attr['rightMargin'] ) ) {
				$css .= 'margin-right:' . $attr['rightMargin'] . 'px;';
			}
			if ( isset( $attr['leftMargin'] ) ) {
				$css .= 'margin-left:' . $attr['leftMargin'] . 'px;';
			}
			$css .= '}';
		}
		if ( isset( $attr['zIndex'] ) ) {
			$css .= '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-' . $column_key . ' {';
			if ( isset( $attr['zIndex'] ) ) {
				$css .= 'z-index:' . $attr['zIndex'] . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) || isset( $attr['rightMarginM'] ) || isset( $attr['leftMarginM'] ) ) {
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
			if ( isset( $attr['rightMarginM'] ) ) {
				$css .= 'margin-right:' . $attr['rightMarginM'] . 'px;';
			}
			if ( isset( $attr['leftMarginM'] ) ) {
				$css .= 'margin-left:' . $attr['leftMarginM'] . 'px;';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}
}
Kadence_Blocks_Frontend::get_instance();
