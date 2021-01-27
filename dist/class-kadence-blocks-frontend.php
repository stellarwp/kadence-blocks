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
	 * Google schema to add to head
	 *
	 * @var null
	 */
	public static $faq_schema = null;

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
		add_action( 'init', array( $this, 'on_init' ), 20 );
		add_action( 'enqueue_block_assets', array( $this, 'blocks_assets' ) );
		//add_action( 'wp_enqueue_scripts', array( $this, 'global_inline_css' ), 101 );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_inline_css' ), 20 );
		add_action( 'wp_head', array( $this, 'frontend_gfonts' ), 90 );
		add_action( 'wp_head', array( $this, 'faq_schema' ), 91 );
		if ( ! is_admin() ) {
			add_action( 'render_block', array( $this, 'conditionally_render_block' ), 6, 2 );
		}
	}
	/**
	 * Check for logged in, logged out visibility settings.
	 *
	 * @param mixed $block_content The block content.
	 * @param array $block The block data.
	 *
	 * @return mixed Returns the block content.
	 */
	public function conditionally_render_block( $block_content, $block ) {
		if ( 'kadence/rowlayout' === $block['blockName'] && isset( $block['attrs'] ) ) {
			if ( isset( $block['attrs']['loggedIn'] ) && $block['attrs']['loggedIn'] && is_user_logged_in() ) {
				$hide = true;
				if ( isset( $block['attrs']['loggedInUser'] ) && is_array( $block['attrs']['loggedInUser'] ) && ! empty( $block['attrs']['loggedInUser'] ) ) {
					$user = wp_get_current_user();
					foreach( $block['attrs']['loggedInUser'] as $key => $role ) {
						if ( in_array( $role['value'], (array) $user->roles ) ) {
							return '';
						} else {
							$hide = false;
						}
					}
				}
				if ( isset( $block['attrs']['loggedInShow'] ) && is_array( $block['attrs']['loggedInShow'] ) && ! empty( $block['attrs']['loggedInShow'] ) ) {
					$user = wp_get_current_user();
					$show_roles = array();
					foreach ( $block['attrs']['loggedInShow'] as $key => $user_rule ) {
						if ( isset( $user_rule['value'] ) && ! empty( $user_rule['value'] ) ) {
							$show_roles[] = $user_rule['value'];
						}
					}
					//print_r( $show_roles );
					//print_r( $user->roles );
					$match = array_intersect( $show_roles, (array) $user->roles );
					if ( count( $match ) === 0 ) {
						return '';
					} else {
						$hide = false;
					}
				}
				if ( $hide ) {
					return '';
				}
			}
			if ( isset( $block['attrs']['loggedOut'] ) && $block['attrs']['loggedOut'] && ! is_user_logged_in() ) {
				return '';
			}
		}

		return $block_content;
	}
	/**
	 * On init startup.
	 */
	public function on_init() {
		// Only load if Gutenberg is available.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}
		register_block_type(
			'kadence/rowlayout',
			array(
				'render_callback' => array( $this, 'render_row_layout_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/column',
			array(
				'render_callback' => array( $this, 'render_column_layout_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/advancedbtn',
			array(
				'render_callback' => array( $this, 'render_advanced_btn_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/advancedheading',
			array(
				'render_callback' => array( $this, 'render_advanced_heading_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/tabs',
			array(
				'render_callback' => array( $this, 'render_tabs_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/spacer',
			array(
				'render_callback' => array( $this, 'render_spacer_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/infobox',
			array(
				'render_callback' => array( $this, 'render_infobox_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/icon',
			array(
				'render_callback' => array( $this, 'render_icon_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/accordion',
			array(
				'render_callback' => array( $this, 'render_accordion_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/iconlist',
			array(
				'render_callback' => array( $this, 'render_iconlist_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/testimonials',
			array(
				'render_callback' => array( $this, 'render_testimonials_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/advancedgallery',
			array(
				'render_callback' => array( $this, 'render_advancedgallery_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		register_block_type(
			'kadence/form',
			array(
				'render_callback' => array( $this, 'render_form_css' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
		add_filter( 'excerpt_allowed_blocks', array( $this, 'add_blocks_to_excerpt' ), 20 );
	}
	/**
	 * Allow Columns to be looked at for inner content.
	 *
	 * @param array $allowed inner blocks.
	 */
	public function add_blocks_to_excerpt( $allowed ) {
		$allowed = array_merge( $allowed, apply_filters( 'kadence_blocks_allowed_excerpt_blocks', array( 'kadence/advancedheading' ) ) );
		return $allowed;
	}

	/**
	 * Render Inline CSS helper function
	 *
	 * @param array  $css the css for each rendered block.
	 * @param string $style_id the unique id for the rendered style.
	 * @param bool   $in_content the bool for whether or not it should run in content.
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
	 * Render Row  Block
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_row_layout_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-rowlayout', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-rowlayout' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'rowlayout', $unique_id ) ) {
				$css = $this->row_layout_array_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$css = apply_filters( 'as3cf_filter_post_local_to_provider', $css );
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
		if ( ! wp_style_is( 'kadence-blocks-rowlayout', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-rowlayout' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'rowlayout', $unique_id ) ) {
				$this->render_row_layout_scripts( $attributes );
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! wp_style_is( 'kadence-blocks-rowlayout', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-rowlayout' );
					}
				}
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
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_column_layout_css_head( $attributes ) {
		if ( isset( $attributes['uniqueID'] ) && ! empty( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'column', $unique_id ) ) {
				$css = $this->column_layout_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$css = apply_filters( 'as3cf_filter_post_local_to_provider', $css );
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
		if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'column', $unique_id ) ) {
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
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_advanced_btn_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-btn', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-btn' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'advancedbtn', $unique_id ) ) {
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
		if ( ! wp_style_is( 'kadence-blocks-btn', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-btn' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'advancedbtn', $unique_id ) ) {
				if ( $this->it_is_not_amp() ) {
					if ( isset( $attributes['btns'] ) && is_array( $attributes['btns'] ) ) {
						foreach ( $attributes['btns'] as $btnkey => $btnvalue ) {
							if ( is_array( $btnvalue ) ) {
								if ( isset( $btnvalue['target'] ) && ! empty( $btnvalue['target'] ) && 'video' == $btnvalue['target'] ) {
									wp_enqueue_style( 'kadence-blocks-magnific-css' );
									wp_enqueue_script( 'kadence-blocks-magnific-js' );
								}
							}
						}
					}
				}
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! wp_style_is( 'kadence-blocks-btn', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-btn' );
					}
				}
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
		if ( ! wp_style_is( 'kadence-blocks-heading', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-heading' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'advancedheading', $unique_id ) ) {
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
		if ( ! wp_style_is( 'kadence-blocks-heading', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-heading' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'advancedheading', $unique_id ) ) {
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
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_tabs_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-tabs', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-tabs' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'tabs', $unique_id ) ) {
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
	public function it_is_not_amp() {
		$not_amp = true;
		if ( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() ) {
			$not_amp = false;
		}
		return $not_amp;
	}
	/**
	 * Render Tabs Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_tabs_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-tabs', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-tabs' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'tabs', $unique_id ) ) {
				if ( $this->it_is_not_amp() ) {
					wp_enqueue_script( 'kadence-blocks-tabs-js' );
				}
				$css = $this->blocks_tabs_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '" type="text/css">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! wp_style_is( 'kadence-blocks-tabs', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-tabs' );
					}
				} else {
					if ( ! wp_style_is( 'kadence-blocks-tabs', 'done' ) ) {
						ob_start();
							wp_print_styles( 'kadence-blocks-tabs' );
						$content = ob_get_clean() . $content;
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Render Spacing Block CSS
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_spacer_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-spacer', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-spacer' );
		}
		if ( isset( $attributes['uniqueID'] ) && ( ( isset( $attributes['tabletSpacerHeight'] ) && ! empty( $attributes['tabletSpacerHeight'] ) ) || isset( $attributes['mobileSpacerHeight'] ) && ! empty( $attributes['mobileSpacerHeight'] ) ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'spacer', $unique_id ) ) {
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
		if ( ! wp_style_is( 'kadence-blocks-spacer', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-spacer' );
		}
		if ( isset( $attributes['uniqueID'] ) && ( ( isset( $attributes['tabletSpacerHeight'] ) && ! empty( $attributes['tabletSpacerHeight'] ) ) || isset( $attributes['mobileSpacerHeight'] ) && ! empty( $attributes['mobileSpacerHeight'] ) ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'spacer', $unique_id ) ) {
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
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_icon_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-icon', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-icon' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'icon', $unique_id ) ) {
				$css = $this->blocks_icon_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Icon CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_icon_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-icon', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-icon' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'icon', $unique_id ) ) {
				$css = $this->blocks_icon_array( $attributes, $unique_id );
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
	 * Render Info Block CSS in Head
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_infobox_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-infobox', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-infobox' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'infobox', $unique_id ) ) {
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
		if ( ! wp_style_is( 'kadence-blocks-infobox', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-infobox' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'infobox', $unique_id ) ) {
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! wp_style_is( 'kadence-blocks-infobox', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-infobox' );
					}
				}
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
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_accordion_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-accordion', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-accordion' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			if ( isset( $attributes['faqSchema'] ) && $attributes['faqSchema'] ) {
				$faq_script_id = 'kb-faq' . esc_attr( $unique_id );
				if ( is_null( self::$faq_schema ) ) {
					self::$faq_schema = '<script type="application/ld+json" class="kadence-faq-schema-graph kadence-faq-schema-graph--' . $faq_script_id . '">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[]}</script>';
				}
			}
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'accordion', $unique_id ) ) {
				$css = $this->blocks_accordion_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Pane Schema in Head
	 *
	 * @param array $block the blocks object.
	 */
	public function render_pane_scheme_head( $block ) {
		if ( ! is_null( self::$faq_schema ) ) {
			if ( is_array( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) ) {
				$answer = '';
				foreach ( $block['innerBlocks'] as $inner_key => $inner_block ) {
					$answer .= strip_tags( $inner_block['innerHTML'], '<a><strong><br><h2><h3><h4><h5><ul><li><ol><p>' );
				}
				preg_match( '/<span class="kt-blocks-accordion-title">(.*?)<\/span>/s', $block['innerHTML'], $match );
				$question = ( $match && isset( $match[1] ) && ! empty( $match[1] ) ? $match[1] : '' );
				if ( strpos( self::$faq_schema, '}]}</script>' ) !== false ) {
					$schema = ',';
				} else {
					$schema = '';
				}
				$schema .= '{"@type":"Question","name": "' . esc_attr( $question ) . '","acceptedAnswer":{"@type": "Answer","text": "' . str_replace( '"', '&quot;', $answer ) . '"}}';
				$question_schema = ( ! empty( $question ) && ! empty( $answer ) ? $schema .']}</script>' : ']}</script>' );
				self::$faq_schema = str_replace( "]}</script>", $question_schema, self::$faq_schema );
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
		if ( ! wp_style_is( 'kadence-blocks-accordion', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-accordion' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'accordion', $unique_id ) ) {
				if ( $this->it_is_not_amp() ) {
					wp_enqueue_script( 'kadence-blocks-accordion-js' );
				}
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! wp_style_is( 'kadence-blocks-accordion', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-accordion' );
					}
				}
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
	 * Render Testimonials CSS in Head
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_testimonials_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-testimonials', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-testimonials' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'testimonials', $unique_id ) ) {
				$css = $this->blocks_testimonials_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Testimonials CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_testimonials_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-testimonials', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-testimonials' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'testimonials', $unique_id ) ) {
				if ( isset( $attributes['layout'] ) && 'carousel' === $attributes['layout'] ) {
					if ( $this->it_is_not_amp() ) {
						wp_enqueue_style( 'kadence-blocks-pro-slick' );
						if ( ! doing_filter( 'the_content' ) ) {
							if ( ! wp_style_is( 'kadence-blocks-pro-slick', 'done' ) ) {
								wp_print_styles( 'kadence-blocks-pro-slick' );
							}
						}
						wp_enqueue_script( 'kadence-blocks-slick-init' );
					}
				}
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! wp_style_is( 'kadence-blocks-testimonials', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-testimonials' );
					}
				}
				$css = $this->blocks_testimonials_array( $attributes, $unique_id );
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
	 * Render form CSS In Head
	 *
	 * @param array $attributes the blocks attributes.
	 */
	public function render_form_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-form', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-form' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $this->blocks_form_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render form CSS Inline
	 *
	 * @param array  $attributes the blocks attributes.
	 * @param string $content the blocks content.
	 */
	public function render_form_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-form', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-form' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				wp_enqueue_script( 'kadence-blocks-form' );
				if ( isset( $attributes['recaptcha'] ) && $attributes['recaptcha'] ) {
					if ( isset( $attributes['recaptchaVersion'] ) && 'v2' === $attributes['recaptchaVersion'] ) {
						wp_enqueue_script( 'kadence-blocks-google-recaptcha-v2' );
					} else {
						wp_enqueue_script( 'kadence-blocks-google-recaptcha-v3' );
					}
				}
				$css = $this->blocks_form_array( $attributes, $unique_id );
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
	 * Render Gallery CSS in Head
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_advancedgallery_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-gallery', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-gallery' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'advancedgallery', $unique_id ) ) {
				$css = $this->blocks_advancedgallery_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Gallery CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_advancedgallery_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-gallery', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-gallery' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'advancedgallery', $unique_id ) ) {
				if ( $this->it_is_not_amp() ) {
					if ( isset( $attributes['type'] ) && ( 'carousel' === $attributes['type'] || 'fluidcarousel' === $attributes['type'] || 'slider' === $attributes['type'] || 'thumbslider' === $attributes['type'] ) ) {
						wp_enqueue_style( 'kadence-blocks-pro-slick' );
						if ( ! doing_filter( 'the_content' ) ) {
							if ( ! wp_style_is( 'kadence-blocks-pro-slick', 'done' ) ) {
								wp_print_styles( 'kadence-blocks-pro-slick' );
							}
						}
						wp_enqueue_script( 'kadence-blocks-slick-init' );
					} elseif ( ! isset( $attributes['type'] ) || ( isset( $attributes['type'] ) && 'masonry' === $attributes['type'] ) ) {
						wp_enqueue_script( 'kadence-blocks-masonry-init' );
					}
					if ( isset( $attributes['linkTo'] ) && 'media' == isset( $attributes['linkTo'] ) && isset( $attributes['lightbox'] ) && 'magnific' === $attributes['lightbox'] ) {
						wp_enqueue_style( 'kadence-simplelightbox-css' );
						if ( ! doing_filter( 'the_content' ) ) {
							if ( ! wp_style_is( 'kadence-simplelightbox-css', 'done' ) ) {
								wp_print_styles( 'kadence-simplelightbox-css' );
							}
						}
						wp_enqueue_script( 'kadence-blocks-simplelightbox-init' );
					}
				}
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! wp_style_is( 'kadence-blocks-gallery', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-gallery' );
					}
				}
				$css = $this->blocks_advancedgallery_array( $attributes, $unique_id );
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
	 * Render Icon List CSS in Head
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_iconlist_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-iconlist', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-iconlist' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'iconlist', $unique_id ) ) {
				$css = $this->blocks_iconlist_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}
	/**
	 * Render Icon list CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_iconlist_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-iconlist', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-iconlist' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'iconlist', $unique_id ) ) {
				$css = $this->blocks_iconlist_array( $attributes, $unique_id );
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
	 * Checks if the current request is a WP REST API request.
	 *
	 * Case #1: After WP_REST_Request initialisation
	 * Case #2: Support "plain" permalink settings
	 * Case #3: It can happen that WP_Rewrite is not yet initialized,
	 *          so do this (wp-settings.php)
	 * Case #4: URL Path begins with wp-json/ (your REST prefix)
	 *          Also supports WP installations in subfolders
	 *
	 * @returns boolean
	 * @author matzeeable
	 */
	public function is_rest() {
		$prefix = rest_get_url_prefix( );
		if (defined('REST_REQUEST') && REST_REQUEST // (#1)
				|| isset($_GET['rest_route']) // (#2)
						&& strpos( trim( $_GET['rest_route'], '\\/' ), $prefix , 0 ) === 0)
				return true;
		// (#3)
		global $wp_rewrite;
		if ($wp_rewrite === null) $wp_rewrite = new WP_Rewrite();

		// (#4)
		$rest_url = wp_parse_url( trailingslashit( rest_url( ) ) );
		$current_url = wp_parse_url( add_query_arg( array( ) ) );
		return strpos( $current_url['path'], $rest_url['path'], 0 ) === 0;
	}
	/**
	 *
	 * Register and Enqueue block assets
	 *
	 * @since 1.0.0
	 */
	public function blocks_assets() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		$this->register_scripts();
	}
	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		// If in the backend, bail out.
		if ( is_admin() || $this->is_rest() ) {
			return;
		}
		// Lets register all the block styles.
		wp_register_style( 'kadence-blocks-rowlayout', KADENCE_BLOCKS_URL . 'dist/blocks/row.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-accordion', KADENCE_BLOCKS_URL . 'dist/blocks/accordion.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-btn', KADENCE_BLOCKS_URL . 'dist/blocks/btn.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-gallery', KADENCE_BLOCKS_URL . 'dist/blocks/gallery.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		//wp_register_style( 'kadence-blocks-icon', KADENCE_BLOCKS_URL . 'dist/blocks/icon.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-icon', false );
		$icon_css = '.kt-svg-style-stacked .kt-svg-icon{border:0px solid #444444;-webkit-transition:all .3s ease-in-out;-o-transition:all .3s ease-in-out;transition:all .3s ease-in-out}.kt-svg-icon-wrap{display:inline-block}.kt-svg-icon-wrap a.kt-svg-icon-link{display:block;border:0;text-decoration:none;-webkit-box-shadow:none;box-shadow:none}.kt-svg-icon-wrap a.kt-svg-icon-link:hover{-webkit-box-shadow:none;box-shadow:none}';
		wp_add_inline_style( 'kadence-blocks-icon', $icon_css );
		wp_register_style( 'kadence-blocks-iconlist', KADENCE_BLOCKS_URL . 'dist/blocks/iconlist.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-tabs', KADENCE_BLOCKS_URL . 'dist/blocks/tabs.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-spacer', KADENCE_BLOCKS_URL . 'dist/blocks/spacer.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-infobox', KADENCE_BLOCKS_URL . 'dist/blocks/infobox.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		//wp_register_style( 'kadence-blocks-heading', KADENCE_BLOCKS_URL . 'dist/blocks/heading.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-heading', false );
		$heading_css = '.wp-block-kadence-advancedheading mark{color:#f76a0c;background:transparent;border-style:solid;border-width:0}';
		// Short term fix for an issue with heading wrapping.
		if ( class_exists( '\Kadence\Theme' ) ) {
			$heading_css .= '.single-content .kadence-advanced-heading-wrapper h1, .single-content .kadence-advanced-heading-wrapper h2, .single-content .kadence-advanced-heading-wrapper
 h3, .single-content .kadence-advanced-heading-wrapper h4, .single-content .kadence-advanced-heading-wrapper h5, .single-content .kadence-advanced-heading-wrapper h6 {margin: 1.5em 0 .5em;}.single-content .kadence-advanced-heading-wrapper+* { margin-top:0;}';
		}
		wp_add_inline_style( 'kadence-blocks-heading', $heading_css );
		wp_register_style( 'kadence-blocks-form', KADENCE_BLOCKS_URL . 'dist/blocks/form.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-testimonials', KADENCE_BLOCKS_URL . 'dist/blocks/testimonials.style.build.css', array(), KADENCE_BLOCKS_VERSION );

		//wp_enqueue_style( 'kadence-blocks-style-css', KADENCE_BLOCKS_URL . 'dist/blocks.style.build.css', array(), KADENCE_BLOCKS_VERSION );

		// Next all the extras that are shared.
		wp_register_style( 'kadence-simplelightbox-css', KADENCE_BLOCKS_URL . 'dist/assets/css/simplelightbox.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-simplelightbox', KADENCE_BLOCKS_URL . 'dist/assets/js/simplelightbox.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-videolight-js', KADENCE_BLOCKS_URL . 'dist/assets/js/kb-init-video-popup.min.js', array( 'kadence-simplelightbox' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_style( 'kadence-blocks-magnific-css', KADENCE_BLOCKS_URL . 'dist/magnific.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'magnific-popup', KADENCE_BLOCKS_URL . 'dist/magnific.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-magnific-js', KADENCE_BLOCKS_URL . 'dist/kt-init-video-popup.js', array( 'jquery', 'magnific-popup' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-gallery-magnific-init', KADENCE_BLOCKS_URL . 'dist/kb-gallery-magnific-init.js', array( 'jquery', 'magnific-popup' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-simplelightbox-init', KADENCE_BLOCKS_URL . 'dist/kb-gallery-simple-init.js', array( 'kadence-simplelightbox' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-accordion-js', KADENCE_BLOCKS_URL . 'dist/kt-accordion-min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tabs-js', KADENCE_BLOCKS_URL . 'dist/kt-tabs-min.js', array( 'jquery' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'jarallax', KADENCE_BLOCKS_URL . 'dist/jarallax.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-form', KADENCE_BLOCKS_URL . 'dist/assets/js/kb-form.js', array( 'jquery' ), KADENCE_BLOCKS_VERSION, true );
		wp_localize_script(
			'kadence-blocks-form',
			'kadence_blocks_form_params',
			array(
				'ajaxurl'       => admin_url( 'admin-ajax.php' ),
				'error_message' => __( 'Please fix the errors to proceed', 'kadence-blocks' ),
				'nonce'         => wp_create_nonce( 'kb_form_nonce' ),
				'required'      => __( 'is required', 'kadence-blocks' ),
				'mismatch'      => __( 'does not match', 'kadence-blocks' ),
				'validation'    => __( 'is not valid', 'kadence-blocks' ),
				'duplicate'     => __( 'requires a unique entry and this value has already been used', 'kadence-blocks' ),
				'item'          => __( 'Item', 'kadence-blocks' ),
			)
		);
		$recaptcha_site_key = get_option( 'kadence_blocks_recaptcha_site_key' );
		if ( ! $recaptcha_site_key ) {
			$recaptcha_site_key = 'missingkey';
		}
		wp_register_script( 'kadence-blocks-google-recaptcha-v3', 'https://www.google.com/recaptcha/api.js?render=' . esc_attr( $recaptcha_site_key ), array(), KADENCE_BLOCKS_VERSION, true );
		$recaptcha_script = "grecaptcha.ready(function () { var recaptchaResponse = document.getElementById('kb_recaptcha_response'); if ( recaptchaResponse ) { grecaptcha.execute('" . esc_attr( $recaptcha_site_key ) . "', { action: 'kb_form' }).then(function (token) { recaptchaResponse.value = token; }); } var kb_recaptcha_inputs = document.getElementsByClassName('kb_recaptcha_response'); if ( ! kb_recaptcha_inputs.length ) { return; } for (var i = 0; i < kb_recaptcha_inputs.length; i++) { const e = i; grecaptcha.execute('" . esc_attr( $recaptcha_site_key ) . "', { action: 'kb_form' }).then(function (token) { kb_recaptcha_inputs[e].setAttribute('value', token); }); } });";
		wp_add_inline_script( 'kadence-blocks-google-recaptcha-v3', $recaptcha_script, 'after' );
		//?render=explicit&onload=kbOnloadV2Callback
		wp_register_script( 'kadence-blocks-google-recaptcha-v2', 'https://www.google.com/recaptcha/api.js?render=explicit&onload=kbOnloadV2Callback', array( 'jquery' ), KADENCE_BLOCKS_VERSION, true );
		//wp_register_script( 'kadence-blocks-recaptcha-v2-form', KADENCE_BLOCKS_URL . 'dist/assets/js/kb-form-recaptcha-v2.js', array( 'jquery', 'kadence-blocks-google-recaptcha-v2' ), KADENCE_BLOCKS_VERSION, true );
		// wp_localize_script(
		// 	'kadence-blocks-recaptcha-v2-form',
		// 	'kadence_blocks_recaptcha_v2_form_params',
		// 	array(
		// 		'sitekey' => $recaptcha_site_key,
		// 	)
		// );
		$recaptcha_v2_script = "var kbOnloadV2Callback = function(){jQuery( '.wp-block-kadence-form' ).find( '.kadence-blocks-g-recaptcha-v2' ).each( function() {grecaptcha.render( jQuery( this ).attr( 'id' ), {'sitekey' : '" . esc_attr( $recaptcha_site_key ) . "',});});}";
		wp_add_inline_script( 'kadence-blocks-google-recaptcha-v2', $recaptcha_v2_script, 'before' );

		wp_register_script( 'kadence-blocks-parallax-js', KADENCE_BLOCKS_URL . 'dist/kt-init-parallax.js', array( 'jarallax' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_style( 'kadence-blocks-pro-slick', KADENCE_BLOCKS_URL . 'dist/vendor/kt-blocks-slick.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-slick', KADENCE_BLOCKS_URL . 'dist/vendor/slick.min.js', array( 'jquery' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-slick-init', KADENCE_BLOCKS_URL . 'dist/kt-slick-init.js', array( 'jquery', 'kadence-slick' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-video-bg', KADENCE_BLOCKS_URL . 'dist/kb-init-html-bg-video.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-masonry-init', KADENCE_BLOCKS_URL . 'dist/kb-masonry-init.js', array( 'jquery', 'masonry' ), KADENCE_BLOCKS_VERSION, true );
	}
	/**
	 * Registers and enqueue's script.
	 *
	 * @param string  $handle the handle for the script.
	 */
	public function enqueue_script( $handle ) {
		if ( ! wp_script_is( $handle, 'registered' ) ) {
			$this->register_scripts();
		}
		wp_enqueue_script( $handle );
	}
	/**
	 * Registers and enqueue's styles.
	 *
	 * @param string  $handle the handle for the script.
	 */
	public function enqueue_style( $handle ) {
		if ( ! wp_style_is( $handle, 'registered' ) ) {
			$this->register_scripts();
		}
		wp_enqueue_style( $handle );
	}
	/**
	 * Hex to RGBA
	 *
	 * @param string $hex string hex code.
	 * @param number $alpha alpha number.
	 */
	public function hex2rgba( $hex, $alpha ) {
		if ( empty( $hex ) ) {
			return '';
		}
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
	 * Load the faq schema in head.
	 */
	public function faq_schema() {
		if ( is_null( self::$faq_schema ) ) {
			return;
		}
		$print_faq_schema = apply_filters( 'kadence_blocks_print_faq_schema', true );
		if ( ! $print_faq_schema ) {
			return;
		}
		echo self::$faq_schema;
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
		if ( apply_filters( 'kadence_display_swap_google_fonts', true ) ) {
			$link .= '&amp;display=swap';
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
	public function global_inline_css() {
		$print_global_styles = apply_filters( 'kadence_blocks_print_global_styles', true );
		if ( ! $print_global_styles ) {
			return;
		}
		$global_styles = json_decode( get_option( 'kadence_blocks_global' ) );
		if ( $global_styles && is_object( $global_styles ) && isset( $global_styles->typography ) && is_object( $global_styles->typography ) ) {
			$css = '';
			foreach ( $global_styles->typography as $fontkey => $fontarray ) {
				if ( is_array( $fontarray ) ) {
					$font = $fontarray[0];
				}
				if ( isset( $font ) && is_object( $font ) && isset( $font->enable ) && true === $font->enable && isset( $font->loadGoogle ) && true === $font->loadGoogle && isset( $font->family ) && ! empty( $font->family ) ) {
					// Check if the font has been added yet.
					if ( isset( $font->family ) && ! array_key_exists( $font->family, self::$gfonts ) ) {
						$add_font = array(
							'fontfamily'   => $font->family,
							'fontvariants' => ( isset( $font->variant ) && ! empty( $font->variant ) ? array( $font->variant ) : array() ),
							'fontsubsets'  => ( isset( $font->subset ) && ! empty( $font->subset ) ? array( $font->subset ) : array() ),
						);
						self::$gfonts[ $font->family ] = $add_font;
					} else {
						if ( ! in_array( $font->variant, self::$gfonts[ $font->family ]['fontvariants'], true ) ) {
							array_push( self::$gfonts[ $font->family ]['fontvariants'], $font->variant );
						}
						if ( ! in_array( $font->subset, self::$gfonts[ $font->family ]['fontsubsets'], true ) ) {
							array_push( self::$gfonts[ $font->family ]['fontsubsets'], $font->subset );
						}
					}
				}
				if ( isset( $font ) && is_object( $font ) && isset( $font->enable ) && true === $font->enable ) {
					$add_css = false;
					$new_css = '';
					if ( 'p' === $fontkey ) {
						$new_css .= 'body {';
					} else {
						$new_css .= $fontkey .' {';
					}
					if ( isset( $font->color ) && ! empty( $font->color ) ) {
						$add_css = true;
						$new_css .= 'color:' . $font->color . ';';
					}
					if ( isset( $font->size ) && is_array( $font->size ) && is_numeric( $font->size[0] ) ) {
						$add_css = true;
						$new_css .= 'font-size:' . $font->size[0] . ( ! isset( $font->sizeType ) ? 'px' : $font->sizeType ) . ';';
					}
					if ( isset( $font->lineHeight ) && is_array( $font->lineHeight ) && is_numeric( $font->lineHeight[0] ) ) {
						$add_css = true;
						$new_css .= 'line-height:' . $font->lineHeight[0] . ( ! isset( $font->lineType ) ? 'px' : $font->lineType ) . ';';
					}
					if ( isset( $font->letterSpacing ) && is_numeric( $font->letterSpacing ) ) {
						$add_css = true;
						$new_css .= 'letter-spacing:' . $font->letterSpacing . 'px;';
					}
					if ( isset( $font->textTransform ) && ! empty( $font->textTransform ) ) {
						$add_css = true;
						$new_css .= 'text-transform:' . $font->textTransform . ';';
					}
					if ( isset( $font->family ) && ! empty( $font->family ) ) {
						$add_css = true;
						$new_css .= 'font-family:' . $font->family . ';';
					}
					if ( isset( $font->style ) && ! empty( $font->style ) ) {
						$add_css = true;
						$new_css .= 'font-style:' . $font->style . ';';
					}
					if ( isset( $font->weight ) && ! empty( $font->weight ) ) {
						$add_css = true;
						$new_css .= 'font-weight:' . $font->weight . ';';
					}
					if ( 'p' === $fontkey ) {
						$new_css .= '}';
						$new_css .= 'p {';
					}
					if ( isset( $font->padding ) && is_array( $font->padding ) && is_numeric( $font->padding[0] ) ) {
						$add_css = true;
						$new_css .= 'padding-top:' . $font->padding[0] . ( ! isset( $font->paddingType ) ? 'px' : $font->paddingType ) . ';';
					}
					if ( isset( $font->padding ) && is_array( $font->padding ) && is_numeric( $font->padding[1] ) ) {
						$add_css = true;
						$new_css .= 'padding-right:' . $font->padding[1] . ( ! isset( $font->paddingType ) ? 'px' : $font->paddingType ) . ';';
					}
					if ( isset( $font->padding ) && is_array( $font->padding ) && is_numeric( $font->padding[2] ) ) {
						$add_css = true;
						$new_css .= 'padding-bottom:' . $font->padding[2] . ( ! isset( $font->paddingType ) ? 'px' : $font->paddingType ) . ';';
					}
					if ( isset( $font->padding ) && is_array( $font->padding ) && is_numeric( $font->padding[3] ) ) {
						$add_css = true;
						$new_css .= 'padding-left:' . $font->padding[3] . ( ! isset( $font->paddingType ) ? 'px' : $font->paddingType ) . ';';
					}
					if ( isset( $font->margin ) && is_array( $font->margin ) && is_numeric( $font->margin[0] ) ) {
						$add_css = true;
						$new_css .= 'margin-top:' . $font->margin[0] . ( ! isset( $font->marginType ) ? 'px' : $font->marginType ) . ';';
					}
					if ( isset( $font->margin ) && is_array( $font->margin ) && is_numeric( $font->margin[1] ) ) {
						$add_css = true;
						$new_css .= 'margin-right:' . $font->margin[1] . ( ! isset( $font->marginType ) ? 'px' : $font->marginType ) . ';';
					}
					if ( isset( $font->margin ) && is_array( $font->margin ) && is_numeric( $font->margin[2] ) ) {
						$add_css = true;
						$new_css .= 'margin-bottom:' . $font->margin[2] . ( ! isset( $font->marginType ) ? 'px' : $font->marginType ) . ';';
					}
					if ( isset( $font->margin ) && is_array( $font->margin ) && is_numeric( $font->margin[3] ) ) {
						$add_css = true;
						$new_css .= 'margin-left:' . $font->margin[3] . ( ! isset( $font->marginType ) ? 'px' : $font->marginType ) . ';';
					}
					$new_css .= '}';
					if ( ( isset( $font->size ) && is_array( $font->size ) && is_numeric( $font->size[1] ) ) || ( isset( $font->lineHeight ) && is_array( $font->lineHeight ) && is_numeric( $font->lineHeight[1] ) ) ) {
						$add_css = true;
						$new_css .= '@media (min-width: 767px) and (max-width: 1024px) {';
						if ( 'p' === $fontkey ) {
							$new_css .= 'body {';
						} else {
							$new_css .= $fontkey .' {';
						}
						if ( isset( $font->size ) && is_array( $font->size ) && is_numeric( $font->size[1] ) ) {
							$new_css .= 'font-size:' . $font->size[1] . ( isset( $font->sizeType ) && ! empty( $font->sizeType ) ? $font->sizeType : 'px' ) . ';';
						}
						if ( isset( $font->lineHeight ) && is_array( $font->lineHeight ) && is_numeric( $font->lineHeight[1] ) ) {
							$new_css .= 'line-height:' . $font->lineHeight[1] . ( isset( $font->lineType ) && ! empty( $font->lineType ) ? $font->lineType : 'px' ) . ';';
						}
						$new_css .= '}';
						$new_css .= '}';
					}
					if ( ( isset( $font->size ) && is_array( $font->size ) && is_numeric( $font->size[2] ) ) || ( isset( $font->lineHeight ) && is_array( $font->lineHeight ) && is_numeric( $font->lineHeight[2] ) ) ) {
						$add_css = true;
						$new_css .= '@media (max-width: 767px) {';
						if ( 'p' === $fontkey ) {
							$new_css .= 'body {';
						} else {
							$new_css .= $fontkey .' {';
						}
						if ( isset( $font->size ) && is_array( $font->size ) && is_numeric( $font->size[2] ) ) {
							$new_css .= 'font-size:' . $font->size[2] . ( isset( $font->sizeType ) && ! empty( $font->sizeType ) ? $font->sizeType : 'px' ) . ';';
						}
						if ( isset( $font->lineHeight ) && is_array( $font->lineHeight ) && is_numeric( $font->lineHeight[2] ) ) {
							$new_css .= 'line-height:' . $font->lineHeight[2] . ( isset( $font->lineType ) && ! empty( $font->lineType ) ? $font->lineType : 'px' ) . ';';
						}
						$new_css .= '}';
						$new_css .= '}';
					}
					if ( $add_css ) {
						$css .= $new_css;
					}
				}
			}
			if ( ! empty( $css ) ) {
				$this->render_inline_css( $css, 'kadence-blocks-global-styles' );
			}
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
			$this->frontend_build_css( $post );
		}
	}
	/**
	 * Outputs extra css for blocks.
	 *
	 * @param $post_object object of WP_Post.
	 */
	public function frontend_build_css( $post_object ) {
		if ( ! is_object( $post_object ) ) {
			return;
		}
		if ( ! method_exists( $post_object, 'post_content' ) ) {
			$blocks = $this->kadence_parse_blocks( $post_object->post_content );
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
					if ( 'kadence/pane' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							if ( isset( $block['attrs']['faqSchema'] ) && $block['attrs']['faqSchema'] ) {
								$this->render_pane_scheme_head( $block );
							}
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
					if ( 'kadence/iconlist' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_iconlist_css_head( $blockattr );
							$this->blocks_iconlist_scripts_gfonts( $blockattr );
						}
					}
					if ( 'kadence/icon' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_icon_css_head( $blockattr );
						}
					}
					if ( 'kadence/testimonials' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_testimonials_css_head( $blockattr );
							$this->blocks_testimonials_scripts_gfonts( $blockattr );
						}
					}
					if ( 'kadence/advancedgallery' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_advancedgallery_css_head( $blockattr );
							$this->blocks_advancedgallery_scripts_gfonts( $blockattr );
						}
					}
					if ( 'kadence/spacer' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_spacer_css_head( $blockattr );
						}
					}
					if ( 'kadence/form' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->blocks_form_scripts_check( $blockattr );
							$this->render_form_css_head( $blockattr );
						}
					}
					if ( 'kadence/tableofcontents' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->blocks_tableofcontents_scripts_check( $blockattr );
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
						$this->render_row_layout_scripts( $blockattr );
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
				if ( 'kadence/pane' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						if ( isset( $inner_block['attrs']['faqSchema'] ) && $inner_block['attrs']['faqSchema'] ) {
							$this->render_pane_scheme_head( $inner_block );
						}
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
				if ( 'kadence/iconlist' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_iconlist_css_head( $blockattr );
						$this->blocks_iconlist_scripts_gfonts( $blockattr );
					}
				}
				if ( 'kadence/icon' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_icon_css_head( $blockattr );
					}
				}
				if ( 'kadence/testimonials' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_testimonials_css_head( $blockattr );
						$this->blocks_testimonials_scripts_gfonts( $blockattr );
					}
				}
				if ( 'kadence/advancedgallery' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_advancedgallery_css_head( $blockattr );
						$this->blocks_advancedgallery_scripts_gfonts( $blockattr );
					}
				}
				if ( 'kadence/spacer' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_spacer_css_head( $blockattr );
					}
				}
				if ( 'kadence/form' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_form_css_head( $blockattr );
						$this->blocks_form_scripts_check( $blockattr );
					}
				}
				if ( 'kadence/tableofcontents' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->blocks_tableofcontents_scripts_check( $blockattr );
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
	 * Grabs the scripts that are needed so we can load in the head.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_tableofcontents_scripts_check( $attr ) {
		$toc = Kadence_Blocks_Table_Of_Contents::get_instance();
		$toc->enqueue_script( 'kadence-blocks-table-of-contents' );
		$toc->enqueue_style( 'kadence-blocks-table-of-contents' );
		if ( isset( $attr['uniqueID'] ) ) {
			$unique_id = $attr['uniqueID'];
			$style_id = 'kt-blocks' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				$css = $toc->output_css( $attr, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
		if ( isset( $attr['labelFont'] ) && is_array( $attr['labelFont'] ) && isset( $attr['labelFont'][0] ) && is_array( $attr['labelFont'][0] ) && isset( $attr['labelFont'][0]['google'] ) && $attr['labelFont'][0]['google'] && ( ! isset( $attr['labelFont'][0]['loadGoogle'] ) || true === $attr['labelFont'][0]['loadGoogle'] ) && isset( $attr['labelFont'][0]['family'] ) ) {
			$label_font = $attr['labelFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $label_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily'   => $label_font['family'],
					'fontvariants' => ( isset( $label_font['variant'] ) && ! empty( $label_font['variant'] ) ? array( $label_font['variant'] ) : array() ),
					'fontsubsets'  => ( isset( $label_font['subset'] ) && ! empty( $label_font['subset'] ) ? array( $label_font['subset'] ) : array() ),
				);
				self::$gfonts[ $label_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $label_font['variant'], self::$gfonts[ $label_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $label_font['family'] ]['fontvariants'], $label_font['variant'] );
				}
				if ( ! in_array( $label_font['subset'], self::$gfonts[ $label_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $label_font['family'] ]['fontsubsets'], $label_font['subset'] );
				}
			}
		}
		if ( isset( $attr['submitFont'] ) && is_array( $attr['submitFont'] ) && isset( $attr['submitFont'][0] ) && is_array( $attr['submitFont'][0] ) && isset( $attr['submitFont'][0]['google'] ) && $attr['submitFont'][0]['google'] && ( ! isset( $attr['submitFont'][0]['loadGoogle'] ) || true === $attr['submitFont'][0]['loadGoogle'] ) && isset( $attr['submitFont'][0]['family'] ) ) {
			$submit_font = $attr['submitFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $submit_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $submit_font['family'],
					'fontvariants' => ( isset( $submit_font['variant'] ) && ! empty( $submit_font['variant'] ) ? array( $submit_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $submit_font['subset'] ) && ! empty( $submit_font['subset'] ) ? array( $submit_font['subset'] ) : array() ),
				);
				self::$gfonts[ $submit_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $submit_font['variant'], self::$gfonts[ $submit_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $submit_font['family'] ]['fontvariants'], $submit_font['variant'] );
				}
				if ( ! in_array( $submit_font['subset'], self::$gfonts[ $submit_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $submit_font['family'] ]['fontsubsets'], $submit_font['subset'] );
				}
			}
		}
	}
	/**
	 * Grabs the scripts that are needed so we can load in the head.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_form_scripts_check( $attr ) {
		$this->enqueue_script( 'kadence-blocks-form' );
		if ( isset( $attr['recaptcha'] ) && $attr['recaptcha'] ) {
			if ( isset( $attr['recaptchaVersion'] ) && 'v2' === $attr['recaptchaVersion'] ) {
				$this->enqueue_script( 'kadence-blocks-google-recaptcha-v2' );
			} else {
				$this->enqueue_script( 'kadence-blocks-google-recaptcha-v3' );
			}
		}
		if ( isset( $attr['labelFont'] ) && is_array( $attr['labelFont'] ) && isset( $attr['labelFont'][0] ) && is_array( $attr['labelFont'][0] ) && isset( $attr['labelFont'][0]['google'] ) && $attr['labelFont'][0]['google'] && ( ! isset( $attr['labelFont'][0]['loadGoogle'] ) || true === $attr['labelFont'][0]['loadGoogle'] ) && isset( $attr['labelFont'][0]['family'] ) ) {
			$label_font = $attr['labelFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $label_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily'   => $label_font['family'],
					'fontvariants' => ( isset( $label_font['variant'] ) && ! empty( $label_font['variant'] ) ? array( $label_font['variant'] ) : array() ),
					'fontsubsets'  => ( isset( $label_font['subset'] ) && ! empty( $label_font['subset'] ) ? array( $label_font['subset'] ) : array() ),
				);
				self::$gfonts[ $label_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $label_font['variant'], self::$gfonts[ $label_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $label_font['family'] ]['fontvariants'], $label_font['variant'] );
				}
				if ( ! in_array( $label_font['subset'], self::$gfonts[ $label_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $label_font['family'] ]['fontsubsets'], $label_font['subset'] );
				}
			}
		}
		if ( isset( $attr['submitFont'] ) && is_array( $attr['submitFont'] ) && isset( $attr['submitFont'][0] ) && is_array( $attr['submitFont'][0] ) && isset( $attr['submitFont'][0]['google'] ) && $attr['submitFont'][0]['google'] && ( ! isset( $attr['submitFont'][0]['loadGoogle'] ) || true === $attr['submitFont'][0]['loadGoogle'] ) && isset( $attr['submitFont'][0]['family'] ) ) {
			$submit_font = $attr['submitFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $submit_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $submit_font['family'],
					'fontvariants' => ( isset( $submit_font['variant'] ) && ! empty( $submit_font['variant'] ) ? array( $submit_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $submit_font['subset'] ) && ! empty( $submit_font['subset'] ) ? array( $submit_font['subset'] ) : array() ),
				);
				self::$gfonts[ $submit_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $submit_font['variant'], self::$gfonts[ $submit_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $submit_font['family'] ]['fontvariants'], $submit_font['variant'] );
				}
				if ( ! in_array( $submit_font['subset'], self::$gfonts[ $submit_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $submit_font['family'] ]['fontsubsets'], $submit_font['subset'] );
				}
			}
		}
		if ( isset( $attr['messageFont'] ) && is_array( $attr['messageFont'] ) && isset( $attr['messageFont'][0] ) && is_array( $attr['messageFont'][0] ) && isset( $attr['messageFont'][0]['google'] ) && $attr['messageFont'][0]['google'] && ( ! isset( $attr['messageFont'][0]['loadGoogle'] ) || true === $attr['messageFont'][0]['loadGoogle'] ) && isset( $attr['messageFont'][0]['family'] ) ) {
			$message_font = $attr['messageFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $message_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $message_font['family'],
					'fontvariants' => ( isset( $message_font['variant'] ) && ! empty( $message_font['variant'] ) ? array( $message_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $message_font['subset'] ) && ! empty( $message_font['subset'] ) ? array( $message_font['subset'] ) : array() ),
				);
				self::$gfonts[ $message_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $message_font['variant'], self::$gfonts[ $message_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $message_font['family'] ]['fontvariants'], $message_font['variant'] );
				}
				if ( ! in_array( $message_font['subset'], self::$gfonts[ $message_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $message_font['family'] ]['fontsubsets'], $message_font['subset'] );
				}
			}
		}
	}
	/**
	 * Builds CSS for form block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_form_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) ) {
			$css .= '.wp-block-kadence-form.kadence-form-' . $unique_id . '.kb-form-wrap {';
			if ( isset( $attr['containerMargin'][0] ) && is_numeric( $attr['containerMargin'][0] ) ) {
				$css .= 'margin-top:' . $attr['containerMargin'][0] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['containerMargin'][1] ) && is_numeric( $attr['containerMargin'][1] ) ) {
				$css .= 'margin-right:' . $attr['containerMargin'][1] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['containerMargin'][2] ) && is_numeric( $attr['containerMargin'][2] ) ) {
				$css .= 'margin-bottom:' . $attr['containerMargin'][2] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['containerMargin'][3] ) && is_numeric( $attr['containerMargin'][3] ) ) {
				$css .= 'margin-left:' . $attr['containerMargin'][3] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['tabletContainerMargin'] ) && is_array( $attr['tabletContainerMargin'] ) ) {
			$css .= '@media (max-width: 1024px) {';
			$css .= '.wp-block-kadence-form.kadence-form-' . $unique_id . '.kb-form-wrap {';
			if ( isset( $attr['tabletContainerMargin'][0] ) && is_numeric( $attr['tabletContainerMargin'][0] ) ) {
				$css .= 'margin-top:' . $attr['tabletContainerMargin'][0] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['tabletContainerMargin'][1] ) && is_numeric( $attr['tabletContainerMargin'][1] ) ) {
				$css .= 'margin-right:' . $attr['tabletContainerMargin'][1] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['tabletContainerMargin'][2] ) && is_numeric( $attr['tabletContainerMargin'][2] ) ) {
				$css .= 'margin-bottom:' . $attr['tabletContainerMargin'][2] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['tabletContainerMargin'][3] ) && is_numeric( $attr['tabletContainerMargin'][3] ) ) {
				$css .= 'margin-left:' . $attr['tabletContainerMargin'][3] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['mobileContainerMargin'] ) && is_array( $attr['mobileContainerMargin'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.wp-block-kadence-form.kadence-form-' . $unique_id . '.kb-form-wrap {';
			if ( isset( $attr['mobileContainerMargin'][0] ) && is_numeric( $attr['mobileContainerMargin'][0] ) ) {
				$css .= 'margin-top:' . $attr['mobileContainerMargin'][0] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['mobileContainerMargin'][1] ) && is_numeric( $attr['mobileContainerMargin'][1] ) ) {
				$css .= 'margin-right:' . $attr['mobileContainerMargin'][1] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['mobileContainerMargin'][2] ) && is_numeric( $attr['mobileContainerMargin'][2] ) ) {
				$css .= 'margin-bottom:' . $attr['mobileContainerMargin'][2] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			if ( isset( $attr['mobileContainerMargin'][3] ) && is_numeric( $attr['mobileContainerMargin'][3] ) ) {
				$css .= 'margin-left:' . $attr['mobileContainerMargin'][3] . ( isset( $attr['containerMarginType'] ) && ! empty( $attr['containerMarginType'] ) ? $attr['containerMarginType'] : 'px' ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['style'] ) && is_array( $attr['style'] ) && isset( $attr['style'][ 0 ] ) && is_array( $attr['style'][ 0 ] ) ) {
			$style = $attr['style'][ 0 ];
			if ( isset( $style['rowGap'] ) && is_numeric( $style['rowGap'] ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field {';
				$css .= 'margin-bottom:' . $style['rowGap'] . ( isset( $style['rowGapType'] ) && ! empty( $style['rowGapType'] ) ? $style['rowGapType'] : 'px' ) . ';';
				$css .= '}';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field.kb-submit-field {';
				$css .= 'margin-bottom:0;';
				$css .= '}';
			}
			if ( isset( $style['gutter'] ) && is_numeric( $style['gutter'] ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field {';
				$css .= 'padding-right:' . floor( $style['gutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) . ';';
				$css .= 'padding-left:' . floor( $style['gutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) . ';';
				$css .= '}';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form {';
				$css .= 'margin-right:-' . floor( $style['gutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) . ';';
				$css .= 'margin-left:-' . floor( $style['gutter'] / 2 ) . ( isset( $style['gutterType'] ) && ! empty( $style['gutterType'] ) ? $style['gutterType'] : 'px' ) . ';';
				$css .= '}';
			}
			if ( isset( $style['requiredColor'] ) && ! empty( $style['requiredColor'] ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field label .required {';
				$css .= 'color:' . $this->kadence_color_output( $style['requiredColor'] ) . ';';
				$css .= '}';
			}
			if ( ( isset( $style['color'] ) && ! empty( $style['color'] ) ) || ( isset( $style['background'] ) && ! empty( $style['background'] ) ) || ( isset( $style['border'] ) && ! empty( $style['border'] ) ) || ( isset( $style['backgroundType'] ) && 'gradient' === $style['backgroundType'] ) || ( isset( $style['boxShadow'] ) && is_array( $style['boxShadow'] ) && isset( $style['boxShadow'][0] ) && true === $style['boxShadow'][0] ) || ( isset( $style['borderRadius'] ) && is_numeric( $style['borderRadius'] ) ) || ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) && is_numeric( $style['fontSize'][0] ) ) || ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][0] ) ) || ( isset( $style['borderWidth'] ) && is_array( $style['borderWidth'] ) && is_numeric( $style['borderWidth'][0] ) ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-select-style-field {';
				if ( isset( $style['color'] ) && ! empty( $style['color'] ) ) {
					$css .= 'color:' . $this->kadence_color_output( $style['color'] ) . ';';
				}
				if ( isset( $style['borderRadius'] ) && is_numeric( $style['borderRadius'] ) ) {
					$css .= 'border-radius:' . $style['borderRadius'] . 'px;';
				}
				if ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) && is_numeric( $style['fontSize'][0] ) ) {
					$css .= 'font-size:' . $style['fontSize'][0] . ( isset( $style['fontSizeType'] ) && ! empty( $style['fontSizeType'] ) ? $style['fontSizeType'] : 'px' ) . ';';
				}
				if ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][0] ) ) {
					$css .= 'line-height:' . $style['lineHeight'][0] . ( isset( $style['lineType'] ) && ! empty( $style['lineType'] ) ? $style['lineType'] : 'px' ) . ';';
				}
				if ( isset( $style['borderWidth'] ) && is_array( $style['borderWidth'] ) && is_numeric( $style['borderWidth'][0] ) ) {
					$css .= 'border-width:' . $style['borderWidth'][0] . 'px ' . $style['borderWidth'][1] . 'px ' . $style['borderWidth'][2] . 'px ' . $style['borderWidth'][3] . 'px;';
				}
				if ( isset( $style['backgroundType'] ) && 'gradient' === $style['backgroundType'] ) {
					$bg1 = ( ! isset( $style['background'] ) || 'transparent' === $style['background'] ? 'rgba(255,255,255,0)' : $this->kadence_color_output( $style['background'], ( isset( $style['backgroundOpacity'] ) && is_numeric( $style['backgroundOpacity'] ) ? $style['backgroundOpacity'] : 1 ) ) );
					$bg2 = ( isset( $style['gradient'][0] ) && ! empty( $style['gradient'][0] ) ? $this->kadence_color_output( $style['gradient'][0], ( isset( $style['gradient'][1] ) && is_numeric( $style['gradient'][1] ) ? $style['gradient'][1] : 1 ) ) : $this->kadence_color_output( '#999999', ( isset( $style['gradient'][1] ) && is_numeric( $style['gradient'][1] ) ? $style['gradient'][1] : 1 ) ) );
					if ( isset( $style['gradient'][4] ) && 'radial' === $style['gradient'][4] ) {
						$css .= 'background:radial-gradient(at ' . ( isset( $style['gradient'][6] ) && ! empty( $style['gradient'][6] ) ? $style['gradient'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $style['gradient'][2] ) && is_numeric( $style['gradient'][2] ) ? $style['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $style['gradient'][3] ) && is_numeric( $style['gradient'][3] ) ? $style['gradient'][3] : '100' ) . '%);';
					} else if ( ! isset( $style['gradient'][4] ) || 'radial' !== $style['gradient'][4] ) {
						$css .= 'background:linear-gradient(' . ( isset( $style['gradient'][5] ) && ! empty( $style['gradient'][5] ) ? $style['gradient'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $style['gradient'][2] ) && is_numeric( $style['gradient'][2] ) ? $style['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $style['gradient'][3] ) && is_numeric( $style['gradient'][3] ) ? $style['gradient'][3] : '100' ) . '%);';
					}
				} else if ( isset( $style['background'] ) && ! empty( $style['background'] ) ) {
					$alpha = ( isset( $style['backgroundOpacity'] ) && is_numeric( $style['backgroundOpacity'] ) ? $style['backgroundOpacity'] : 1 );
					$css  .= 'background:' . $this->kadence_color_output( $style['background'], $alpha ) . ';';
				}
				if ( isset( $style['border'] ) && ! empty( $style['border'] ) ) {
					$alpha = ( isset( $style['borderOpacity'] ) && is_numeric( $style['borderOpacity'] ) ? $style['borderOpacity'] : 1 );
					$css  .= 'border-color:' . $this->kadence_color_output( $style['border'], $alpha ) . ';';
				}
				if ( isset( $style['boxShadow'] ) && is_array( $style['boxShadow'] ) && isset( $style['boxShadow'][0] ) && true === $style['boxShadow'][0] ) {
					$css  .= 'box-shadow:' . ( isset( $style['boxShadow'][7] ) && true === $style['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $style['boxShadow'][3] ) && is_numeric( $style['boxShadow'][3] ) ? $style['boxShadow'][3] : '1' ) . 'px ' . ( isset( $style['boxShadow'][4] ) && is_numeric( $style['boxShadow'][4] ) ? $style['boxShadow'][4] : '1' ) . 'px ' . ( isset( $style['boxShadow'][5] ) && is_numeric( $style['boxShadow'][5] ) ? $style['boxShadow'][5] : '2' ) . 'px ' . ( isset( $style['boxShadow'][6] ) && is_numeric( $style['boxShadow'][6] ) ? $style['boxShadow'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $style['boxShadow'][1] ) && ! empty( $style['boxShadow'][1] ) ? $style['boxShadow'][1] : '#000000' ), ( isset( $style['boxShadow'][2] ) && is_numeric( $style['boxShadow'][2] ) ? $style['boxShadow'][2] : 0.2 ) ) . ';';
				}
				$css .= '}';
			}
			if ( ( isset( $style['colorActive'] ) && ! empty( $style['colorActive'] ) ) || ( isset( $style['backgroundActive'] ) && ! empty( $style['backgroundActive'] ) ) || ( isset( $style['borderActive'] ) && ! empty( $style['borderActive'] ) ) || ( isset( $style['backgroundActiveType'] ) && 'gradient' === $style['backgroundActiveType'] ) || ( isset( $style['boxShadow'] ) && is_array( $style['boxShadow'] ) && isset( $style['boxShadow'][0] ) && true === $style['boxShadow'][0] ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field:focus, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-select-style-field:focus {';
				if ( isset( $style['colorActive'] ) && ! empty( $style['colorActive'] ) ) {
					$css .= 'color:' . $this->kadence_color_output( $style['colorActive'] ) . ';';
				}
				if ( isset( $style['borderActive'] ) && ! empty( $style['borderActive'] ) ) {
					$alpha = ( isset( $style['borderActiveOpacity'] ) && is_numeric( $style['borderActiveOpacity'] ) ? $style['borderActiveOpacity'] : 1 );
					$css  .= 'border-color:' . $this->kadence_color_output( $style['borderActive'], $alpha ) . ';';
				}
				if ( isset( $style['boxShadowActive'] ) && is_array( $style['boxShadowActive'] ) && isset( $style['boxShadowActive'][0] ) && true === $style['boxShadowActive'][0] ) {
					$css  .= 'box-shadow:' . ( isset( $style['boxShadowActive'][7] ) && true === $style['boxShadowActive'][7] ? 'inset ' : '' ) . ( isset( $style['boxShadowActive'][3] ) && is_numeric( $style['boxShadowActive'][3] ) ? $style['boxShadowActive'][3] : '2' ) . 'px ' . ( isset( $style['boxShadowActive'][4] ) && is_numeric( $style['boxShadowActive'][4] ) ? $style['boxShadowActive'][4] : '2' ) . 'px ' . ( isset( $style['boxShadowActive'][5] ) && is_numeric( $style['boxShadowActive'][5] ) ? $style['boxShadowActive'][5] : '3' ) . 'px ' . ( isset( $style['boxShadowActive'][6] ) && is_numeric( $style['boxShadowActive'][6] ) ? $style['boxShadowActive'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $style['boxShadowActive'][1] ) && ! empty( $style['boxShadowActive'][1] ) ? $style['boxShadowActive'][1] : '#000000' ), ( isset( $style['boxShadowActive'][2] ) && is_numeric( $style['boxShadowActive'][2] ) ? $style['boxShadowActive'][2] : 0.4 ) ) . ';';
				}
				if ( isset( $style['backgroundActiveType'] ) && 'gradient' === $style['backgroundActiveType'] ) {
					$bg1 = ( ! isset( $style['backgroundActive'] ) ? $this->kadence_color_output( '#444444', ( isset( $style['backgroundActiveOpacity'] ) && is_numeric( $style['backgroundActiveOpacity'] ) ? $style['backgroundActiveOpacity'] : 1 ) ) : $this->kadence_color_output( $style['backgroundActive'], ( isset( $style['backgroundActiveOpacity'] ) && is_numeric( $style['backgroundActiveOpacity'] ) ? $style['backgroundActiveOpacity'] : 1 ) ) );
					$bg2 = ( isset( $style['gradientActive'][0] ) && ! empty( $style['gradientActive'][0] ) ? $this->kadence_color_output( $style['gradientActive'][0], ( isset( $style['gradientActive'][1] ) && is_numeric( $style['gradientActive'][1] ) ? $style['gradientActive'][1] : 1 ) ) : $this->kadence_color_output( '#999999', ( isset( $style['gradientActive'][1] ) && is_numeric( $style['gradientActive'][1] ) ? $style['gradientActive'][1] : 1 ) ) );
					if ( isset( $style['gradientActive'][4] ) && 'radial' === $style['gradientActive'][4] ) {
						$css .= 'background:radial-gradient(at ' . ( isset( $style['gradientActive'][6] ) && ! empty( $style['gradientActive'][6] ) ? $style['gradientActive'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $style['gradientActive'][2] ) && is_numeric( $style['gradientActive'][2] ) ? $style['gradientActive'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $style['gradientActive'][3] ) && is_numeric( $style['gradientActive'][3] ) ? $style['gradientActive'][3] : '100' ) . '%);';
					} else if ( ! isset( $style['gradientActive'][4] ) || 'radial' !== $style['gradientActive'][4] ) {
						$css .= 'background:linear-gradient(' . ( isset( $style['gradientActive'][5] ) && ! empty( $style['gradientActive'][5] ) ? $style['gradientActive'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $style['gradientActive'][2] ) && is_numeric( $style['gradientActive'][2] ) ? $style['gradientActive'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $style['gradientActive'][3] ) && is_numeric( $style['gradientActive'][3] ) ? $style['gradientActive'][3] : '100' ) . '%);';
					}
				} else if ( isset( $style['backgroundActive'] ) && ! empty( $style['backgroundActive'] ) ) {
					$alpha = ( isset( $style['backgroundActiveOpacity'] ) && is_numeric( $style['backgroundActiveOpacity'] ) ? $style['backgroundActiveOpacity'] : 1 );
					$css  .= 'background:' . $this->kadence_color_output( $style['backgroundActive'], $alpha ) . ';';
				}
				$css .= '}';
			}
			if ( ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) && is_numeric( $style['fontSize'][1] ) ) || ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][1] ) ) ) {
				$css .= '@media (max-width: 1024px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-select-style-field {';
				if ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) && is_numeric( $style['fontSize'][1] ) ) {
					$css .= 'font-size:' . $style['fontSize'][1] . ( isset( $style['fontSizeType'] ) && ! empty( $style['fontSizeType'] ) ? $style['fontSizeType'] : 'px' ) . ';';
				}
				if ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][1] ) ) {
					$css .= 'line-height:' . $style['lineHeight'][1] . ( isset( $style['lineType'] ) && ! empty( $style['lineType'] ) ? $style['lineType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) && is_numeric( $style['fontSize'][2] ) ) || ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][2] ) ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-select-style-field {';
				if ( isset( $style['fontSize'] ) && is_array( $style['fontSize'] ) && is_numeric( $style['fontSize'][2] ) ) {
					$css .= 'font-size:' . $style['fontSize'][2] . ( isset( $style['fontSizeType'] ) && ! empty( $style['fontSizeType'] ) ? $style['fontSizeType'] : 'px' ) . ';';
				}
				if ( isset( $style['lineHeight'] ) && is_array( $style['lineHeight'] ) && is_numeric( $style['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $style['lineHeight'][2] . ( isset( $style['lineType'] ) && ! empty( $style['lineType'] ) ? $style['lineType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $style['size'] ) && 'custom' && $style['size'] && isset( $style['deskPadding'] ) && is_array( $style['deskPadding'] ) && isset( $style['deskPadding'][0] ) &&is_numeric( $style['deskPadding'][0] ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field {';
				if( isset( $style['deskPadding'][0] ) && is_numeric( $style['deskPadding'][0] ) ) {
					$css .= 'padding-top:' . $style['deskPadding'][0] . 'px;';
				}
				if( isset( $style['deskPadding'][1] ) && is_numeric( $style['deskPadding'][1] ) ) {
					$css .= 'padding-right:' . $style['deskPadding'][1] . 'px;';
				}
				if( isset( $style['deskPadding'][2] ) && is_numeric( $style['deskPadding'][2] ) ) {
					$css .= 'padding-bottom:' . $style['deskPadding'][2] . 'px;';
				}
				if( isset( $style['deskPadding'][3] ) && is_numeric( $style['deskPadding'][3] ) ) {
					$css .= 'padding-left:' . $style['deskPadding'][3] . 'px;';
				}
				$css .= '}';
			}
			if ( isset( $style['size'] ) && 'custom' && $style['size'] && isset( $style['tabletPadding'] ) && is_array( $style['tabletPadding'] ) && isset( $style['tabletPadding'][0] ) && is_numeric( $style['tabletPadding'][0] ) ) {
				$css .= '@media (max-width: 1024px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field {';
				if( isset( $style['tabletPadding'][0] ) && is_numeric( $style['tabletPadding'][0] ) ) {
					$css .= 'padding-top:' . $style['tabletPadding'][0] . 'px;';
				}
				if( isset( $style['tabletPadding'][1] ) && is_numeric( $style['tabletPadding'][1] ) ) {
					$css .= 'padding-right:' . $style['tabletPadding'][1] . 'px;';
				}
				if( isset( $style['tabletPadding'][2] ) && is_numeric( $style['tabletPadding'][2] ) ) {
					$css .= 'padding-bottom:' . $style['tabletPadding'][2] . 'px;';
				}
				if( isset( $style['tabletPadding'][3] ) && is_numeric( $style['tabletPadding'][3] ) ) {
					$css .= 'padding-left:' . $style['tabletPadding'][3] . 'px;';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $style['size'] ) && 'custom' && $style['size'] && isset( $style['mobilePadding'] ) && is_array( $style['mobilePadding'] ) && isset( $style['mobilePadding'][0] ) && is_numeric( $style['mobilePadding'][0] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-text-style-field {';
				if( isset( $style['mobilePadding'][0] ) && is_numeric( $style['mobilePadding'][0] ) ) {
					$css .= 'padding-top:' . $style['mobilePadding'][0] . 'px;';
				}
				if( isset( $style['mobilePadding'][1] ) && is_numeric( $style['mobilePadding'][1] ) ) {
					$css .= 'padding-right:' . $style['mobilePadding'][1] . 'px;';
				}
				if( isset( $style['mobilePadding'][2] ) && is_numeric( $style['mobilePadding'][2] ) ) {
					$css .= 'padding-bottom:' . $style['mobilePadding'][2] . 'px;';
				}
				if( isset( $style['mobilePadding'][3] ) && is_numeric( $style['mobilePadding'][3] ) ) {
					$css .= 'padding-left:' . $style['mobilePadding'][3] . 'px;';
				}
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['labelFont'] ) && is_array( $attr['labelFont'] ) && isset( $attr['labelFont'][ 0 ] ) && is_array( $attr['labelFont'][ 0 ] ) ) {
			$label_font = $attr['labelFont'][ 0 ];
			$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field label {';
			if ( isset( $label_font['color'] ) && ! empty( $label_font['color'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $label_font['color'] ) . ';';
			}
			if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && is_numeric( $label_font['size'][0] ) ) {
				$css .= 'font-size:' . $label_font['size'][0] . ( ! isset( $label_font['sizeType'] ) ? 'px' : $label_font['sizeType'] ) . ';';
			}
			if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $label_font['lineHeight'][0] . ( ! isset( $label_font['lineType'] ) ? 'px' : $label_font['lineType'] ) . ';';
			}
			if ( isset( $label_font['letterSpacing'] ) && is_numeric( $label_font['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $label_font['letterSpacing'] . 'px;';
			}
			if ( isset( $label_font['textTransform'] ) && ! empty( $label_font['textTransform'] ) ) {
				$css .= 'text-transform:' . $label_font['textTransform'] . ';';
			}
			if ( isset( $label_font['family'] ) && ! empty( $label_font['family'] ) ) {
				$css .= 'font-family:' . $label_font['family'] . ';';
			}
			if ( isset( $label_font['style'] ) && ! empty( $label_font['style'] ) ) {
				$css .= 'font-style:' . $label_font['style'] . ';';
			}
			if ( isset( $label_font['weight'] ) && ! empty( $label_font['weight'] ) ) {
				$css .= 'font-weight:' . $label_font['weight'] . ';';
			}
			if ( isset( $label_font['padding'] ) && is_array( $label_font['padding'] ) && is_numeric( $label_font['padding'][0] ) ) {
				$css .= 'padding-top:' . $label_font['padding'][0] . 'px;';
			}
			if ( isset( $label_font['padding'] ) && is_array( $label_font['padding'] ) && is_numeric( $label_font['padding'][1] ) ) {
				$css .= 'padding-right:' . $label_font['padding'][1] . 'px;';
			}
			if ( isset( $label_font['padding'] ) && is_array( $label_font['padding'] ) && is_numeric( $label_font['padding'][2] ) ) {
				$css .= 'padding-bottom:' . $label_font['padding'][2] . 'px;';
			}
			if ( isset( $label_font['padding'] ) && is_array( $label_font['padding'] ) && is_numeric( $label_font['padding'][3] ) ) {
				$css .= 'padding-left:' . $label_font['padding'][3] . 'px;';
			}
			if ( isset( $label_font['margin'] ) && is_array( $label_font['margin'] ) && is_numeric( $label_font['margin'][0] ) ) {
				$css .= 'margin-top:' . $label_font['margin'][0] . 'px;';
			}
			if ( isset( $label_font['margin'] ) && is_array( $label_font['margin'] ) && is_numeric( $label_font['margin'][1] ) ) {
				$css .= 'margin-right:' . $label_font['margin'][1] . 'px;';
			}
			if ( isset( $label_font['margin'] ) && is_array( $label_font['margin'] ) && is_numeric( $label_font['margin'][2] ) ) {
				$css .= 'margin-bottom:' . $label_font['margin'][2] . 'px;';
			}
			if ( isset( $label_font['margin'] ) && is_array( $label_font['margin'] ) && is_numeric( $label_font['margin'][3] ) ) {
				$css .= 'margin-left:' . $label_font['margin'][3] . 'px;';
			}
			$css .= '}';
			if ( ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && is_numeric( $label_font['size'][1] ) ) || ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][1] ) ) ) {
				$css .= '@media (max-width: 1024px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field label {';
				if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && is_numeric( $label_font['size'][1] ) ) {
					$css .= 'font-size:' . $label_font['size'][1] . ( isset( $label_font['sizeType'] ) && ! empty( $label_font['sizeType'] ) ? $label_font['sizeType'] : 'px' ) . ';';
				}
				if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][1] ) ) {
					$css .= 'line-height:' . $label_font['lineHeight'][1] . ( isset( $label_font['lineType'] ) && ! empty( $label_font['lineType'] ) ? $label_font['lineType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && is_numeric( $label_font['size'][2] ) ) || ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][2] ) ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field label {';
				if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && is_numeric( $label_font['size'][2] ) ) {
					$css .= 'font-size:' . $label_font['size'][2] . ( isset( $label_font['sizeType'] ) && ! empty( $label_font['sizeType'] ) ? $label_font['sizeType'] : 'px' ) . ';';
				}
				if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && is_numeric( $label_font['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $label_font['lineHeight'][2] . ( isset( $label_font['lineType'] ) && ! empty( $label_font['lineType'] ) ? $label_font['lineType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['submit'] ) && is_array( $attr['submit'] ) && isset( $attr['submit'][ 0 ] ) && is_array( $attr['submit'][ 0 ] ) ) {
			$submit = $attr['submit'][ 0 ];
			$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
			if ( isset( $submit['widthType'] ) && 'fixed' === $submit['widthType'] && isset( $submit['fixedWidth'] ) && is_array( $submit['fixedWidth'] ) && isset( $submit['fixedWidth'][0] ) && ! empty( $submit['fixedWidth'][0] ) ) {
				$css .= 'width:' . $submit['fixedWidth'][0] . 'px;';
			}
			if ( isset( $submit['color'] ) && ! empty( $submit['color'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $submit['color'] ) . ';';
			}
			if ( isset( $submit['borderRadius'] ) && is_numeric( $submit['borderRadius'] ) ) {
				$css .= 'border-radius:' . $submit['borderRadius'] . 'px;';
			}
			if ( isset( $submit['borderWidth'] ) && is_array( $submit['borderWidth'] ) && is_numeric( $submit['borderWidth'][0] ) ) {
				$css .= 'border-width:' . $submit['borderWidth'][0] . 'px ' . $submit['borderWidth'][1] . 'px ' . $submit['borderWidth'][2] . 'px ' . $submit['borderWidth'][3] . 'px;';
			}
			if ( isset( $submit['backgroundType'] ) && 'gradient' === $submit['backgroundType'] || isset( $submit['backgroundHoverType'] ) && 'gradient' === $submit['backgroundHoverType'] ) {
				$bgtype = 'gradient';
			} else {
				$bgtype = 'solid';
			}
			if ( isset( $submit['backgroundType'] ) && 'gradient' === $submit['backgroundType'] ) {
				$bg1 = ( ! isset( $submit['background'] ) || 'transparent' === $submit['background'] ? 'rgba(255,255,255,0)' : $this->kadence_color_output( $submit['background'], ( isset( $submit['backgroundOpacity'] ) && is_numeric( $submit['backgroundOpacity'] ) ? $submit['backgroundOpacity'] : 1 ) ) );
				$bg2 = ( isset( $submit['gradient'][0] ) && ! empty( $submit['gradient'][0] ) ? $this->kadence_color_output( $submit['gradient'][0], ( isset( $submit['gradient'][1] ) && is_numeric( $submit['gradient'][1] ) ? $submit['gradient'][1] : 1 ) ) : $this->kadence_color_output( '#999999', ( isset( $submit['gradient'][1] ) && is_numeric( $submit['gradient'][1] ) ? $submit['gradient'][1] : 1 ) ) );
				if ( isset( $submit['gradient'][4] ) && 'radial' === $submit['gradient'][4] ) {
					$css .= 'background:radial-gradient(at ' . ( isset( $submit['gradient'][6] ) && ! empty( $submit['gradient'][6] ) ? $submit['gradient'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $submit['gradient'][2] ) && is_numeric( $submit['gradient'][2] ) ? $submit['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit['gradient'][3] ) && is_numeric( $submit['gradient'][3] ) ? $submit['gradient'][3] : '100' ) . '%);';
				} else if ( ! isset( $submit['gradient'][4] ) || 'radial' !== $submit['gradient'][4] ) {
					$css .= 'background:linear-gradient(' . ( isset( $submit['gradient'][5] ) && ! empty( $submit['gradient'][5] ) ? $submit['gradient'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $submit['gradient'][2] ) && is_numeric( $submit['gradient'][2] ) ? $submit['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit['gradient'][3] ) && is_numeric( $submit['gradient'][3] ) ? $submit['gradient'][3] : '100' ) . '%);';
				}
			} else if ( isset( $submit['background'] ) && ! empty( $submit['background'] ) ) {
				$alpha = ( isset( $submit['backgroundOpacity'] ) && is_numeric( $submit['backgroundOpacity'] ) ? $submit['backgroundOpacity'] : 1 );
				$css  .= 'background:' . $this->kadence_color_output( $submit['background'], $alpha ) . ';';
			}
			if ( isset( $submit['border'] ) && ! empty( $submit['border'] ) ) {
				$alpha = ( isset( $submit['borderOpacity'] ) && is_numeric( $submit['borderOpacity'] ) ? $submit['borderOpacity'] : 1 );
				$css  .= 'border-color:' . $this->kadence_color_output( $submit['border'], $alpha ) . ';';
			}
			if ( isset( $submit['boxShadow'] ) && is_array( $submit['boxShadow'] ) && isset( $submit['boxShadow'][0] ) && true === $submit['boxShadow'][0] ) {
				$css  .= 'box-shadow:' . ( isset( $submit['boxShadow'][7] ) && true === $submit['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $submit['boxShadow'][3] ) && is_numeric( $submit['boxShadow'][3] ) ? $submit['boxShadow'][3] : '1' ) . 'px ' . ( isset( $submit['boxShadow'][4] ) && is_numeric( $submit['boxShadow'][4] ) ? $submit['boxShadow'][4] : '1' ) . 'px ' . ( isset( $submit['boxShadow'][5] ) && is_numeric( $submit['boxShadow'][5] ) ? $submit['boxShadow'][5] : '2' ) . 'px ' . ( isset( $submit['boxShadow'][6] ) && is_numeric( $submit['boxShadow'][6] ) ? $submit['boxShadow'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $submit['boxShadow'][1] ) && ! empty( $submit['boxShadow'][1] ) ? $submit['boxShadow'][1] : '#000000' ), ( isset( $submit['boxShadow'][2] ) && is_numeric( $submit['boxShadow'][2] ) ? $submit['boxShadow'][2] : 0.2 ) ) . ';';
			}
			$css .= '}';
			$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit:hover, .kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit:focus  {';
			if ( isset( $submit['colorHover'] ) && ! empty( $submit['colorHover'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $submit['colorHover'] ) . ';';
			}
			if ( isset( $submit['borderHover'] ) && ! empty( $submit['borderHover'] ) ) {
				$alpha = ( isset( $submit['borderHoverOpacity'] ) && is_numeric( $submit['borderHoverOpacity'] ) ? $submit['borderHoverOpacity'] : 1 );
				$css .= 'border-color:' . $this->kadence_color_output( $submit['borderHover'], $alpha ) . ';';
			}
			if ( isset( $submit['boxShadowHover'] ) && is_array( $submit['boxShadowHover'] ) && isset( $submit['boxShadowHover'][0] ) && true === $submit['boxShadowHover'][0] && isset( $submit['boxShadowHover'][7] ) && true !== $submit['boxShadowHover'][7] ) {
				$css  .= 'box-shadow:' . ( isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $submit['boxShadowHover'][3] ) && is_numeric( $submit['boxShadowHover'][3] ) ? $submit['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][4] ) && is_numeric( $submit['boxShadowHover'][4] ) ? $submit['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][5] ) && is_numeric( $submit['boxShadowHover'][5] ) ? $submit['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $submit['boxShadowHover'][6] ) && is_numeric( $submit['boxShadowHover'][6] ) ? $submit['boxShadowHover'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $submit['boxShadowHover'][1] ) && ! empty( $submit['boxShadowHover'][1] ) ? $submit['boxShadowHover'][1] : '#000000' ), ( isset( $submit['boxShadowHover'][2] ) && is_numeric( $submit['boxShadowHover'][2] ) ? $submit['boxShadowHover'][2] : 0.4 ) ) . ';';
			}
			if ( 'gradient' !== $bgtype ) {
				if ( isset( $submit['backgroundHover'] ) && ! empty( $submit['backgroundHover'] ) ) {
					$alpha = ( isset( $submit['backgroundHoverOpacity'] ) && is_numeric( $submit['backgroundHoverOpacity'] ) ? $submit['backgroundHoverOpacity'] : 1 );
					$css  .= 'background:' . $this->kadence_color_output( $submit['backgroundHover'], $alpha ) . ';';
				}
				if ( isset( $submit['boxShadowHover'] ) && is_array( $submit['boxShadowHover'] ) && isset( $submit['boxShadowHover'][0] ) && true === $submit['boxShadowHover'][0] && isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ) {
					$css  .= 'box-shadow:' . ( isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $submit['boxShadowHover'][3] ) && is_numeric( $submit['boxShadowHover'][3] ) ? $submit['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][4] ) && is_numeric( $submit['boxShadowHover'][4] ) ? $submit['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][5] ) && is_numeric( $submit['boxShadowHover'][5] ) ? $submit['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $submit['boxShadowHover'][6] ) && is_numeric( $submit['boxShadowHover'][6] ) ? $submit['boxShadowHover'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $submit['boxShadowHover'][1] ) && ! empty( $submit['boxShadowHover'][1] ) ? $submit['boxShadowHover'][1] : '#000000' ), ( isset( $submit['boxShadowHover'][2] ) && is_numeric( $submit['boxShadowHover'][2] ) ? $submit['boxShadowHover'][2] : 0.4 ) ) . ';';
				}
			}
			$css .= '}';
			if ( 'gradient' === $bgtype ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit::before {';
				if ( isset( $submit['backgroundHoverType'] ) && 'gradient' === $submit['backgroundHoverType'] ) {
					$bg1 = ( ! isset( $submit['backgroundHover'] ) ? $this->kadence_color_output( '#444444', ( isset( $submit['backgroundHoverOpacity'] ) && is_numeric( $submit['backgroundHoverOpacity'] ) ? $submit['backgroundHoverOpacity'] : 1 ) ) : $this->kadence_color_output( $submit['backgroundHover'], ( isset( $submit['backgroundHoverOpacity'] ) && is_numeric( $submit['backgroundHoverOpacity'] ) ? $submit['backgroundHoverOpacity'] : 1 ) ) );
					$bg2 = ( isset( $submit['gradientHover'][0] ) && ! empty( $submit['gradientHover'][0] ) ? $this->kadence_color_output( $submit['gradientHover'][0], ( isset( $submit['gradientHover'][1] ) && is_numeric( $submit['gradientHover'][1] ) ? $submit['gradientHover'][1] : 1 ) ) : $this->kadence_color_output( '#999999', ( isset( $submit['gradientHover'][1] ) && is_numeric( $submit['gradientHover'][1] ) ? $submit['gradientHover'][1] : 1 ) ) );
					if ( isset( $submit['gradientHover'][4] ) && 'radial' === $submit['gradientHover'][4] ) {
						$css .= 'background:radial-gradient(at ' . ( isset( $submit['gradientHover'][6] ) && ! empty( $submit['gradientHover'][6] ) ? $submit['gradientHover'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $submit['gradientHover'][2] ) && is_numeric( $submit['gradientHover'][2] ) ? $submit['gradientHover'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit['gradientHover'][3] ) && is_numeric( $submit['gradientHover'][3] ) ? $submit['gradientHover'][3] : '100' ) . '%);';
					} else if ( ! isset( $submit['gradientHover'][4] ) || 'radial' !== $submit['gradientHover'][4] ) {
						$css .= 'background:linear-gradient(' . ( isset( $submit['gradientHover'][5] ) && ! empty( $submit['gradientHover'][5] ) ? $submit['gradientHover'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $submit['gradientHover'][2] ) && is_numeric( $submit['gradientHover'][2] ) ? $submit['gradientHover'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit['gradientHover'][3] ) && is_numeric( $submit['gradientHover'][3] ) ? $submit['gradientHover'][3] : '100' ) . '%);';
					}
				} else if ( isset( $submit['backgroundHover'] ) && ! empty( $submit['backgroundHover'] ) ) {
					$alpha = ( isset( $submit['backgroundHoverOpacity'] ) && is_numeric( $submit['backgroundHoverOpacity'] ) ? $submit['backgroundHoverOpacity'] : 1 );
					$css  .= 'background:' . $this->kadence_color_output( $submit['backgroundHover'], $alpha ) . ';';
				}
				if ( isset( $submit['boxShadowHover'] ) && is_array( $submit['boxShadowHover'] ) && isset( $submit['boxShadowHover'][0] ) && true === $submit['boxShadowHover'][0] && isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ) {
					$css  .= 'box-shadow:' . ( isset( $submit['boxShadowHover'][7] ) && true === $submit['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $submit['boxShadowHover'][3] ) && is_numeric( $submit['boxShadowHover'][3] ) ? $submit['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][4] ) && is_numeric( $submit['boxShadowHover'][4] ) ? $submit['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $submit['boxShadowHover'][5] ) && is_numeric( $submit['boxShadowHover'][5] ) ? $submit['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $submit['boxShadowHover'][6] ) && is_numeric( $submit['boxShadowHover'][6] ) ? $submit['boxShadowHover'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $submit['boxShadowHover'][1] ) && ! empty( $submit['boxShadowHover'][1] ) ? $submit['boxShadowHover'][1] : '#000000' ), ( isset( $submit['boxShadowHover'][2] ) && is_numeric( $submit['boxShadowHover'][2] ) ? $submit['boxShadowHover'][2] : 0.4 ) ) . ';';
					if ( isset( $submit['borderRadius'] ) && is_numeric( $submit['borderRadius'] ) ) {
						$css  .= 'border-radius:' . $submit['borderRadius'] . 'px;';
					}
				}
				$css .= '}';
			}
			if ( isset( $submit['size'] ) && 'custom' && $submit['size'] && isset( $submit['deskPadding'] ) && is_array( $submit['deskPadding'] ) && isset( $submit['deskPadding'][0] ) && is_numeric( $submit['deskPadding'][0] ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
				if ( isset( $submit['deskPadding'][0] ) && is_numeric( $submit['deskPadding'][0] ) ) {
					$css .= 'padding-top:' . $submit['deskPadding'][0] . 'px;';
				}
				if ( isset( $submit['deskPadding'][1] ) && is_numeric( $submit['deskPadding'][1] ) ) {
					$css .= 'padding-right:' . $submit['deskPadding'][1] . 'px;';
				}
				if ( isset( $submit['deskPadding'][2] ) && is_numeric( $submit['deskPadding'][2] ) ) {
					$css .= 'padding-bottom:' . $submit['deskPadding'][2] . 'px;';
				}
				if ( isset( $submit['deskPadding'][3] ) && is_numeric( $submit['deskPadding'][3] ) ) {
					$css .= 'padding-left:' . $submit['deskPadding'][3] . 'px;';
				}
				$css .= '}';
			}
			if ( isset( $submit['size'] ) && 'custom' && $submit['size'] && isset( $submit['tabletPadding'] ) && is_array( $submit['tabletPadding'] ) && isset( $submit['tabletPadding'][0] ) && is_numeric( $submit['tabletPadding'][0] ) ) {
				$css .= '@media (max-width: 1024px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
				if ( isset( $submit['tabletPadding'][0] ) && is_numeric( $submit['tabletPadding'][0] ) ) {
					$css .= 'padding-top:' . $submit['tabletPadding'][0] . 'px;';
				}
				if ( isset( $submit['tabletPadding'][1] ) && is_numeric( $submit['tabletPadding'][1] ) ) {
					$css .= 'padding-right:' . $submit['tabletPadding'][1] . 'px;';
				}
				if ( isset( $submit['tabletPadding'][2] ) && is_numeric( $submit['tabletPadding'][2] ) ) {
					$css .= 'padding-bottom:' . $submit['tabletPadding'][2] . 'px;';
				}
				if ( isset( $submit['tabletPadding'][3] ) && is_numeric( $submit['tabletPadding'][3] ) ) {
					$css .= 'padding-left:' . $submit['tabletPadding'][3] . 'px;';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $submit['size'] ) && 'custom' && $submit['size'] && isset( $submit['mobilePadding'] ) && is_array( $submit['mobilePadding'] ) && isset( $submit['mobilePadding'][0] ) && is_numeric( $submit['mobilePadding'][0] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
				if ( isset( $submit['mobilePadding'][0] ) && is_numeric( $submit['mobilePadding'][0] ) ) {
					$css .= 'padding-top:' . $submit['mobilePadding'][0] . 'px;';
				}
				if ( isset( $submit['mobilePadding'][1] ) && is_numeric( $submit['mobilePadding'][1] ) ) {
					$css .= 'padding-right:' . $submit['mobilePadding'][1] . 'px;';
				}
				if ( isset( $submit['mobilePadding'][2] ) && is_numeric( $submit['mobilePadding'][2] ) ) {
					$css .= 'padding-bottom:' . $submit['mobilePadding'][2] . 'px;';
				}
				if ( isset( $submit['mobilePadding'][3] ) && is_numeric( $submit['mobilePadding'][3] ) ) {
					$css .= 'padding-left:' . $submit['mobilePadding'][3] . 'px;';
				}
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['submitMargin'] ) && is_array( $attr['submitMargin'] ) && isset( $attr['submitMargin'][ 0 ] ) && is_array( $attr['submitMargin'][ 0 ] ) ) {
			$submit_margin = $attr['submitMargin'][ 0 ];
			$margin_unit = ( isset( $submit_margin['unit'] ) && ! empty( $submit_margin['unit'] ) ? $submit_margin['unit'] : 'px' );
			if ( ( isset( $submit_margin['desk'][0] ) && is_numeric( $submit_margin['desk'][0] ) ) || ( isset( $submit_margin['desk'][1] ) && is_numeric( $submit_margin['desk'][1] ) ) || ( isset( $submit_margin['desk'][2] ) && is_numeric( $submit_margin['desk'][2] ) ) || ( isset( $submit_margin['desk'][3] ) && is_numeric( $submit_margin['desk'][3] ) ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
					if ( isset( $submit_margin['desk'][0] ) && is_numeric( $submit_margin['desk'][0] ) ) {
						$css .= 'margin-top:' . $submit_margin['desk'][0] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['desk'][1] ) && is_numeric( $submit_margin['desk'][1] ) ) {
						$css .= 'margin-right:' . $submit_margin['desk'][1] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['desk'][2] ) && is_numeric( $submit_margin['desk'][2] ) ) {
						$css .= 'margin-bottom:' . $submit_margin['desk'][2] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['desk'][3] ) && is_numeric( $submit_margin['desk'][3] ) ) {
						$css .= 'margin-left:' . $submit_margin['desk'][3] . $margin_unit . ';';
					}
				$css .= '}';
			}
			if ( ( isset( $submit_margin['tablet'][0] ) && is_numeric( $submit_margin['tablet'][0] ) ) || ( isset( $submit_margin['tablet'][1] ) && is_numeric( $submit_margin['tablet'][1] ) ) || ( isset( $submit_margin['tablet'][2] ) && is_numeric( $submit_margin['tablet'][2] ) ) || ( isset( $submit_margin['tablet'][3] ) && is_numeric( $submit_margin['tablet'][3] ) ) ) {
				$css .= '@media (max-width: 1024px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
					if ( isset( $submit_margin['tablet'][0] ) && is_numeric( $submit_margin['tablet'][0] ) ) {
						$css .= 'margin-top:' . $submit_margin['tablet'][0] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['tablet'][1] ) && is_numeric( $submit_margin['tablet'][1] ) ) {
						$css .= 'margin-right:' . $submit_margin['tablet'][1] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['tablet'][2] ) && is_numeric( $submit_margin['tablet'][2] ) ) {
						$css .= 'margin-bottom:' . $submit_margin['tablet'][2] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['tablet'][3] ) && is_numeric( $submit_margin['tablet'][3] ) ) {
						$css .= 'margin-left:' . $submit_margin['tablet'][3] . $margin_unit . ';';
					}
				$css .= '}';
				$css .= '}';
			}
			if ( ( isset( $submit_margin['mobile'][0] ) && is_numeric( $submit_margin['mobile'][0] ) ) || ( isset( $submit_margin['mobile'][1] ) && is_numeric( $submit_margin['mobile'][1] ) ) || ( isset( $submit_margin['mobile'][2] ) && is_numeric( $submit_margin['mobile'][2] ) ) || ( isset( $submit_margin['mobile'][3] ) && is_numeric( $submit_margin['mobile'][3] ) ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
					if ( isset( $submit_margin['mobile'][0] ) && is_numeric( $submit_margin['mobile'][0] ) ) {
						$css .= 'margin-top:' . $submit_margin['mobile'][0] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['mobile'][1] ) && is_numeric( $submit_margin['mobile'][1] ) ) {
						$css .= 'margin-right:' . $submit_margin['mobile'][1] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['mobile'][2] ) && is_numeric( $submit_margin['mobile'][2] ) ) {
						$css .= 'margin-bottom:' . $submit_margin['mobile'][2] . $margin_unit . ';';
					}
					if ( isset( $submit_margin['mobile'][3] ) && is_numeric( $submit_margin['mobile'][3] ) ) {
						$css .= 'margin-left:' . $submit_margin['mobile'][3] . $margin_unit . ';';
					}
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['submitFont'] ) && is_array( $attr['submitFont'] ) && isset( $attr['submitFont'][ 0 ] ) && is_array( $attr['submitFont'][ 0 ] ) ) {
			$submit_font = $attr['submitFont'][ 0 ];
			$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
			if ( isset( $submit_font['size'] ) && is_array( $submit_font['size'] ) && is_numeric( $submit_font['size'][0] ) ) {
				$css .= 'font-size:' . $submit_font['size'][0] . ( ! isset( $submit_font['sizeType'] ) ? 'px' : $submit_font['sizeType'] ) . ';';
			}
			if ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $submit_font['lineHeight'][0] . ( ! isset( $submit_font['lineType'] ) ? 'px' : $submit_font['lineType'] ) . ';';
			}
			if ( isset( $submit_font['letterSpacing'] ) && is_numeric( $submit_font['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $submit_font['letterSpacing'] . 'px;';
			}
			if ( isset( $submit_font['textTransform'] ) && ! empty( $submit_font['textTransform'] ) ) {
				$css .= 'text-transform:' . $submit_font['textTransform'] . ';';
			}
			if ( isset( $submit_font['family'] ) && ! empty( $submit_font['family'] ) ) {
				$css .= 'font-family:' . $submit_font['family'] . ';';
			}
			if ( isset( $submit_font['style'] ) && ! empty( $submit_font['style'] ) ) {
				$css .= 'font-style:' . $submit_font['style'] . ';';
			}
			if ( isset( $submit_font['weight'] ) && ! empty( $submit_font['weight'] ) ) {
				$css .= 'font-weight:' . $submit_font['weight'] . ';';
			}
			$css .= '}';
			if ( ( isset( $submit_font['size'] ) && is_array( $submit_font['size'] ) && is_numeric( $submit_font['size'][1] ) ) || ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][1] ) ) ) {
				$css .= '@media (max-width: 1024px) {';
					$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
				if ( isset( $submit_font['size'] ) && is_array( $submit_font['size'] ) && is_numeric( $submit_font['size'][1] ) ) {
					$css .= 'font-size:' . $submit_font['size'][1] . ( isset( $submit_font['fontSizeType'] ) && ! empty( $submit_font['fontSizeType'] ) ? $submit_font['fontSizeType'] : 'px' ) . ';';
				}
				if ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][1] ) ) {
					$css .= 'line-height:' . $submit_font['lineHeight'][1] . ( isset( $submit_font['lineType'] ) && ! empty( $submit_font['lineType'] ) ? $submit_font['lineType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( ( isset( $submit_font['size'] ) && is_array( $submit_font['size'] ) && is_numeric( $submit_font['size'][2] ) ) || ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][2] ) ) ) {
				$css .= '@media (max-width: 767px) {';
					$css .= '.kadence-form-' . $unique_id . ' .kb-form .kadence-blocks-form-field .kb-forms-submit {';
				if ( isset( $submit_font['size'] ) && is_array( $submit_font['size'] ) && is_numeric( $submit_font['size'][2] ) ) {
					$css .= 'font-size:' . $submit_font['size'][2] . ( isset( $submit_font['fontSizeType'] ) && ! empty( $submit_font['fontSizeType'] ) ? $submit_font['fontSizeType'] : 'px' ) . ';';
				}
				if ( isset( $submit_font['lineHeight'] ) && is_array( $submit_font['lineHeight'] ) && is_numeric( $submit_font['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $submit_font['lineHeight'][2] . ( isset( $submit_font['lineType'] ) && ! empty( $submit_font['lineType'] ) ? $submit_font['lineType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['messageFont'] ) && is_array( $attr['messageFont'] ) && isset( $attr['messageFont'][ 0 ] ) && is_array( $attr['messageFont'][ 0 ] ) ) {
			$message_font = $attr['messageFont'][ 0 ];
			if ( ( isset( $message_font['colorSuccess'] ) && ! empty( $message_font['colorSuccess'] ) ) || ( isset( $message_font['backgroundSuccess'] ) && ! empty( $message_font['backgroundSuccess'] ) ) || ( isset( $message_font['backgroundSuccess'] ) && ! empty( $message_font['backgroundSuccess'] ) ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kadence-blocks-form-success {';
				if ( isset( $message_font['colorSuccess'] ) && ! empty( $message_font['colorSuccess'] ) ) {
					$css .= 'color:' . $this->kadence_color_output( $message_font['colorSuccess'] ) . ';';
				}
				if ( isset( $message_font['borderSuccess'] ) && ! empty( $message_font['borderSuccess'] ) ) {
					$css .= 'border-color:' . $this->kadence_color_output( $message_font['borderSuccess'] ) . ';';
				}
				if ( isset( $message_font['backgroundSuccess'] ) && ! empty( $message_font['backgroundSuccess'] ) ) {
					$alpha = ( isset( $message_font['backgroundSuccessOpacity'] ) && is_numeric( $message_font['backgroundSuccessOpacity'] ) ? $message_font['backgroundSuccessOpacity'] : 1 );
					$css  .= 'background:' . $this->kadence_color_output( $message_font['backgroundSuccess'], $alpha ) . ';';
				}
				$css .= '}';
			}
			if ( ( isset( $message_font['colorError'] ) && ! empty( $message_font['colorError'] ) ) || ( isset( $message_font['backgroundError'] ) && ! empty( $message_font['backgroundError'] ) ) || ( isset( $message_font['backgroundError'] ) && ! empty( $message_font['backgroundError'] ) ) ) {
				$css .= '.kadence-form-' . $unique_id . ' .kadence-blocks-form-warning {';
				if ( isset( $message_font['colorError'] ) && ! empty( $message_font['colorError'] ) ) {
					$css .= 'color:' . $this->kadence_color_output( $message_font['colorError'] ) . ';';
				}
				if ( isset( $message_font['borderError'] ) && ! empty( $message_font['borderError'] ) ) {
					$css .= 'border-color:' . $this->kadence_color_output( $message_font['borderError'] ) . ';';
				}
				if ( isset( $message_font['backgroundError'] ) && ! empty( $message_font['backgroundError'] ) ) {
					$alpha = ( isset( $message_font['backgroundErrorOpacity'] ) && is_numeric( $message_font['backgroundErrorOpacity'] ) ? $message_font['backgroundErrorOpacity'] : 1 );
					$css  .= 'background:' . $this->kadence_color_output( $message_font['backgroundError'], $alpha ) . ';';
				}
				$css .= '}';
			}
			$css .= '.kadence-form-' . $unique_id . ' .kadence-blocks-form-message {';
			if ( isset( $message_font['borderRadius'] ) && ! empty( $message_font['borderRadius'] ) ) {
				$css .= 'border-radius:' . $message_font['borderRadius'] . 'px;';
			}
			if ( isset( $message_font['borderWidth'] ) && is_array( $message_font['borderWidth'] ) && is_numeric( $message_font['borderWidth'][0] ) ) {
				$css .= 'border-width:' . $message_font['borderWidth'][0] . 'px ' . $message_font['borderWidth'][1] . 'px ' . $message_font['borderWidth'][2] . 'px ' . $message_font['borderWidth'][3] . 'px;';
			}
			if ( isset( $message_font['size'] ) && is_array( $message_font['size'] ) && is_numeric( $message_font['size'][0] ) ) {
				$css .= 'font-size:' . $message_font['size'][0] . ( ! isset( $message_font['sizeType'] ) ? 'px' : $message_font['sizeType'] ) . ';';
			}
			if ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $message_font['lineHeight'][0] . ( ! isset( $message_font['lineType'] ) ? 'px' : $message_font['lineType'] ) . ';';
			}
			if ( isset( $message_font['letterSpacing'] ) && is_numeric( $message_font['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $message_font['letterSpacing'] . 'px;';
			}
			if ( isset( $message_font['textTransform'] ) && ! empty( $message_font['textTransform'] ) ) {
				$css .= 'text-transform:' . $message_font['textTransform'] . ';';
			}
			if ( isset( $message_font['family'] ) && ! empty( $message_font['family'] ) ) {
				$css .= 'font-family:' . $message_font['family'] . ';';
			}
			if ( isset( $message_font['style'] ) && ! empty( $message_font['style'] ) ) {
				$css .= 'font-style:' . $message_font['style'] . ';';
			}
			if ( isset( $message_font['weight'] ) && ! empty( $message_font['weight'] ) ) {
				$css .= 'font-weight:' . $message_font['weight'] . ';';
			}
			if ( isset( $message_font['padding'] ) && is_array( $message_font['padding'] ) && is_numeric( $message_font['padding'][0] ) ) {
				$css .= 'padding-top:' . $message_font['padding'][0] . 'px;';
			}
			if ( isset( $message_font['padding'] ) && is_array( $message_font['padding'] ) && is_numeric( $message_font['padding'][1] ) ) {
				$css .= 'padding-right:' . $message_font['padding'][1] . 'px;';
			}
			if ( isset( $message_font['padding'] ) && is_array( $message_font['padding'] ) && is_numeric( $message_font['padding'][2] ) ) {
				$css .= 'padding-bottom:' . $message_font['padding'][2] . 'px;';
			}
			if ( isset( $message_font['padding'] ) && is_array( $message_font['padding'] ) && is_numeric( $message_font['padding'][3] ) ) {
				$css .= 'padding-left:' . $message_font['padding'][3] . 'px;';
			}
			if ( isset( $message_font['margin'] ) && is_array( $message_font['margin'] ) && is_numeric( $message_font['margin'][0] ) ) {
				$css .= 'margin-top:' . $message_font['margin'][0] . 'px;';
			}
			if ( isset( $message_font['margin'] ) && is_array( $message_font['margin'] ) && is_numeric( $message_font['margin'][1] ) ) {
				$css .= 'margin-right:' . $message_font['margin'][1] . 'px;';
			}
			if ( isset( $message_font['margin'] ) && is_array( $message_font['margin'] ) && is_numeric( $message_font['margin'][2] ) ) {
				$css .= 'margin-bottom:' . $message_font['margin'][2] . 'px;';
			}
			if ( isset( $message_font['margin'] ) && is_array( $message_font['margin'] ) && is_numeric( $message_font['margin'][3] ) ) {
				$css .= 'margin-left:' . $message_font['margin'][3] . 'px;';
			}
			$css .= '}';
			if ( ( isset( $message_font['size'] ) && is_array( $message_font['size'] ) && is_numeric( $message_font['size'][1] ) ) || ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][1] ) ) ) {
				$css .= '@media (max-width: 1024px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kadence-blocks-form-message {';
				if ( isset( $message_font['size'] ) && is_array( $message_font['size'] ) && is_numeric( $message_font['size'][1] ) ) {
					$css .= 'font-size:' . $message_font['size'][1] . ( isset( $message_font['fontSizeType'] ) && ! empty( $message_font['fontSizeType'] ) ? $message_font['fontSizeType'] : 'px' ) . ';';
				}
				if ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][1] ) ) {
					$css .= 'line-height:' . $message_font['lineHeight'][1] . ( isset( $message_font['lineType'] ) && ! empty( $message_font['lineType'] ) ? $message_font['lineType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( ( isset( $message_font['size'] ) && is_array( $message_font['size'] ) && is_numeric( $message_font['size'][2] ) ) || ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][2] ) ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kadence-form-' . $unique_id . ' .kadence-blocks-form-message {';
				if ( isset( $message_font['size'] ) && is_array( $message_font['size'] ) && is_numeric( $message_font['size'][2] ) ) {
					$css .= 'font-size:' . $message_font['size'][2] . ( isset( $message_font['fontSizeType'] ) && ! empty( $message_font['fontSizeType'] ) ? $message_font['fontSizeType'] : 'px' ) . ';';
				}
				if ( isset( $message_font['lineHeight'] ) && is_array( $message_font['lineHeight'] ) && is_numeric( $message_font['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $message_font['lineHeight'][2] . ( isset( $message_font['lineType'] ) && ! empty( $message_font['lineType'] ) ? $message_font['lineType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
		}

		return $css;
	}
	/**
	 * Builds CSS for Icon block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_icon_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['icons'] ) && is_array( $attr['icons'] ) ) {
			foreach ( $attr['icons'] as $icon_key => $icon_value ) {
				if ( is_array( $icon_value ) ) {
					if ( ( isset( $icon_value['hColor'] ) && ! empty( $icon_value['hColor'] ) ) || ( isset( $icon_value['hBackground'] ) && ! empty( $icon_value['hBackground'] ) ) || ( isset( $icon_value['hBorder'] ) && ! empty( $icon_value['hBorder'] ) ) ) {
						$css .= '.kt-svg-icons' . $unique_id . ' .kt-svg-item-' . $icon_key . ':hover .kt-svg-icon {';
						if ( isset( $icon_value['hColor'] ) && ! empty( $icon_value['hColor'] ) ) {
							$css .= 'color:' . $this->kadence_color_output( $icon_value['hColor'] ) . '!important;';
						}
						if ( isset( $icon_value['hBackground'] ) && ! empty( $icon_value['hBackground'] ) ) {
							$css .= 'background:' . $this->kadence_color_output( $icon_value['hBackground'] ) . '!important;';
						}
						if ( isset( $icon_value['hBorder'] ) && ! empty( $icon_value['hBorder'] ) ) {
							$css .= 'border-color:' . $this->kadence_color_output( $icon_value['hBorder'] ) . '!important;';
						}
						$css .= '}';
					}
				}
			}
		}
		if ( isset( $attr['tabletTextAlignment'] ) && ! empty( $attr['tabletTextAlignment'] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.wp-block-kadence-icon.kt-svg-icons' . $unique_id . ' {';
			if ( isset( $attr['tabletTextAlignment'] ) ) {
				$css .= 'text-align:' . $attr['tabletTextAlignment'] . '!important;';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['mobileTextAlignment'] ) && ! empty( $attr['mobileTextAlignment'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.wp-block-kadence-icon.kt-svg-icons' . $unique_id . ' {';
			if ( isset( $attr['mobileTextAlignment'] ) ) {
				$css .= 'text-align:' . $attr['mobileTextAlignment'] . '!important;';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}
	/**
	 * Builds CSS for InfoBox block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_infobox_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['containerBorder'] ) || isset( $attr['containerBackground'] ) || isset( $attr['containerBackgroundOpacity'] ) || isset( $attr['containerPadding'] ) || isset( $attr['containerMargin'] ) || isset( $attr['containerBorderRadius'] ) || isset( $attr['containerBorderWidth'] ) || isset( $attr['maxWidth'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap {';
			if ( isset( $attr['containerBorder'] ) && ! empty( $attr['containerBorder'] ) ) {
				$alpha = ( isset( $attr['containerBorderOpacity'] ) && is_numeric( $attr['containerBorderOpacity'] ) ? $attr['containerBorderOpacity'] : 1 );
				$css .= 'border-color:' . $this->kadence_color_output( $attr['containerBorder'], $alpha ) . ';';
			}
			if ( isset( $attr['containerBorderRadius'] ) && ! empty( $attr['containerBorderRadius'] ) ) {
				$css .= 'border-radius:' . $attr['containerBorderRadius'] . 'px;';
			}
			if ( isset( $attr['containerBackground'] ) && ! empty( $attr['containerBackground'] ) ) {
				$alpha = ( isset( $attr['containerBackgroundOpacity'] ) && is_numeric( $attr['containerBackgroundOpacity'] ) ? $attr['containerBackgroundOpacity'] : 1 );
				$css .= 'background:' . $this->kadence_color_output( $attr['containerBackground'], $alpha ) . ';';
			} elseif ( isset( $attr['containerBackgroundOpacity'] ) && is_numeric( $attr['containerBackgroundOpacity'] ) ) {
				$alpha = ( isset( $attr['containerBackgroundOpacity'] ) && is_numeric( $attr['containerBackgroundOpacity'] ) ? $attr['containerBackgroundOpacity'] : 1 );
				$css .= 'background:' . $this->kadence_color_output( '#f2f2f2', $alpha ) . ';';
			}
			if ( isset( $attr['containerPadding'] ) && is_array( $attr['containerPadding'] ) ) {
				$css .= 'padding:' . $attr['containerPadding'][ 0 ] . 'px ' . $attr['containerPadding'][ 1 ] . 'px ' . $attr['containerPadding'][ 2 ] . 'px ' . $attr['containerPadding'][ 3 ] . 'px;';
			}
			if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) && isset( $attr['containerMargin'][0] ) && is_numeric( $attr['containerMargin'][0] ) ) {
				$unit = ( isset( $attr['containerMarginUnit'] ) && ! empty( $attr['containerMarginUnit'] ) ? $attr['containerMarginUnit'] : 'px' );
				$css .= 'margin-top:' . $attr['containerMargin'][0] . $unit . ';';
			}
			if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) && isset( $attr['containerMargin'][1] ) && is_numeric( $attr['containerMargin'][1] ) ) {
				$unit = ( isset( $attr['containerMarginUnit'] ) && ! empty( $attr['containerMarginUnit'] ) ? $attr['containerMarginUnit'] : 'px' );
				$css .= 'margin-right:' . $attr['containerMargin'][1] . $unit . ';';
			}
			if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) && isset( $attr['containerMargin'][2] ) && is_numeric( $attr['containerMargin'][2] ) ) {
				$unit = ( isset( $attr['containerMarginUnit'] ) && ! empty( $attr['containerMarginUnit'] ) ? $attr['containerMarginUnit'] : 'px' );
				$css .= 'margin-bottom:' . $attr['containerMargin'][2] . $unit . ';';
			}
			if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) && isset( $attr['containerMargin'][3] ) && is_numeric( $attr['containerMargin'][3] ) ) {
				$unit = ( isset( $attr['containerMarginUnit'] ) && ! empty( $attr['containerMarginUnit'] ) ? $attr['containerMarginUnit'] : 'px' );
				$css .= 'margin-left:' . $attr['containerMargin'][3] . $unit . ';';
			}
			if ( isset( $attr['containerBorderWidth'] ) && is_array( $attr['containerBorderWidth'] ) ) {
				$css .= 'border-width:' . $attr['containerBorderWidth'][ 0 ] . 'px ' . $attr['containerBorderWidth'][ 1 ] . 'px ' . $attr['containerBorderWidth'][ 2 ] . 'px ' . $attr['containerBorderWidth'][ 3 ] . 'px;';
			}
			if ( isset( $attr['maxWidth'] ) && ! empty( $attr['maxWidth'] ) ) {
				$unit = ( isset( $attr['maxWidthUnit'] ) && ! empty( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' );
				$css .= 'max-width:' . $attr['maxWidth'] . $unit . ';';
			}
			$css .= '}';
		}
		$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover {';
			$border_hover = ( isset( $attr['containerHoverBorder'] ) && ! empty( $attr['containerHoverBorder'] ) ? $attr['containerHoverBorder'] : '#eeeeee' );
			$alpha = ( isset( $attr['containerHoverBorderOpacity'] ) && is_numeric( $attr['containerHoverBorderOpacity'] ) ? $attr['containerHoverBorderOpacity'] : 1 );
			$bg_hover = ( isset( $attr['containerHoverBackground'] ) && ! empty( $attr['containerHoverBackground'] ) ? $attr['containerHoverBackground'] : '#f2f2f2' );
			$bg_alpha = ( isset( $attr['containerHoverBackgroundOpacity'] ) && is_numeric( $attr['containerHoverBackgroundOpacity'] ) ? $attr['containerHoverBackgroundOpacity'] : 1 );
			$css .= 'border-color:' . $this->kadence_color_output( $border_hover, $alpha ) . ';';
			$css .= 'background:' . $this->kadence_color_output( $bg_hover, $bg_alpha ) . ';';
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
		if ( isset( $attr['mediaNumber'] ) && is_array( $attr['mediaNumber'] ) && is_array( $attr['mediaNumber'][ 0 ] ) ) {
			$media_number = $attr['mediaNumber'][ 0 ];
		} else {
			$media_number = array();
		}
		if ( isset( $media_image['subtype'] ) && 'svg+xml' === $media_image['subtype'] ) {
			if ( isset( $media_image['maxWidth'] ) && ! empty( $media_image['maxWidth'] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media .kt-info-box-image {';
				$css .= 'width:' . $media_image['maxWidth'] . 'px;';
				$css .= 'height:auto;';
				$css .= '}';
			}
			if ( isset( $media_icon['color'] ) && ! empty( $media_icon['color'] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media .kt-info-box-image {';
				$css .= 'fill:' . $media_icon['color'] . ';';
				$css .= '}';
			}
			if ( isset( $media_icon['hoverColor'] ) && ! empty( $media_icon['hoverColor'] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media .kt-info-box-image {';
				$css .= 'fill:' . $media_icon['hoverColor'] . ';';
				$css .= '}';
			}
		}
		if ( isset( $media_icon['size'] ) && ! empty( $media_icon['size'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-info-svg-icon, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-number {';
			$css .= 'font-size:' . $media_icon['size'] . 'px;';
			$css .= '}';
		}
		if ( isset( $media_icon['tabletSize'] ) && is_numeric( $media_icon['tabletSize'] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-info-svg-icon, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-number {';
			$css .= 'font-size:' . $media_icon['tabletSize'] . 'px;';
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $media_icon['mobileSize'] ) && is_numeric( $media_icon['mobileSize'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-info-svg-icon, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-number {';
			$css .= 'font-size:' . $media_icon['mobileSize'] . 'px;';
			$css .= '}';
			$css .= '}';
		}
		if ( ( isset( $media_number['family'] ) && ! empty( $media_number['family'] ) ) || ( isset( $media_number['style'] ) && ! empty( $media_number['style'] ) ) || ( isset( $media_number['weight'] ) && ! empty( $media_number['weight'] ) ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-number {';
			if ( isset( $media_number['family'] ) && ! empty( $media_number['family'] ) ) {
				$css .= 'font-family:' . $media_number['family'] .  ';';
			}
			if ( isset( $media_number['style'] ) && ! empty( $media_number['style'] ) ) {
				$css .= 'font-style:' . $media_number['style'] .  ';';
			}
			if ( isset( $media_number['weight'] ) && ! empty( $media_number['weight'] ) ) {
				$css .= 'font-weight:' . $media_number['weight'] .  ';';
			}
			$css .= '}';
		}
		$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media {';
		if ( isset( $media_icon['color'] ) && ! empty( $media_icon['color'] ) ) {
			$css .= 'color:' . $this->kadence_color_output( $media_icon['color'] ) . ';';
		}
		if ( isset( $media_style['background'] ) && ! empty( $media_style['background'] ) ) {
			$css .= 'background:' . $this->kadence_color_output( $media_style['background'] ) . ';';
		}
		if ( isset( $media_style['border'] ) && ! empty( $media_style['border'] ) ) {
			$css .= 'border-color:' . $this->kadence_color_output( $media_style['border'] ) . ';';
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
		if ( isset( $media_style['margin'] ) && is_array( $media_style['margin'] ) && isset( $attr['mediaAlign'] ) && 'top' !== $attr['mediaAlign'] ) {
			$css .= 'margin:' . ( empty( $media_style['margin'][ 0 ] ) ? '0' : $media_style['margin'][ 0 ] ) . 'px ' . ( empty( $media_style['margin'][ 1 ] ) ? '0' : $media_style['margin'][ 1 ] ) . 'px ' . ( empty( $media_style['margin'][ 2 ] ) ? '0' : $media_style['margin'][ 2 ] ) . 'px ' . ( empty( $media_style['margin'][ 3 ] ) ? '0' : $media_style['margin'][ 3 ] ) . 'px;';
		}
		$css .= '}';
		if ( isset( $media_style['margin'] ) && is_array( $media_style['margin'] ) && ( ! isset( $attr['mediaAlign'] ) || 'top' === $attr['mediaAlign'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media-container {';
			$css .= 'margin:' . ( empty( $media_style['margin'][ 0 ] ) ? '0' : $media_style['margin'][ 0 ] ) . 'px ' . ( empty( $media_style['margin'][ 1 ] ) ? '0' : $media_style['margin'][ 1 ] ) . 'px ' . ( empty( $media_style['margin'][ 2 ] ) ? '0' : $media_style['margin'][ 2 ] ) . 'px ' . ( empty( $media_style['margin'][ 3 ] ) ? '0' : $media_style['margin'][ 3 ] ) . 'px;';
			$css .= '}';
		}
		if ( isset( $media_style['borderRadius'] ) && ! empty( $media_style['borderRadius'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media img {';
			$css .= 'border-radius:' . $media_style['borderRadius'] . 'px;';
			$css .= '}';
		}
		$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media {';
		if ( isset( $media_icon['hoverColor'] ) && ! empty( $media_icon['hoverColor'] ) ) {
			$css .= 'color:' . $this->kadence_color_output( $media_icon['hoverColor'] ) . ';';
		}
		if ( isset( $media_style['hoverBackground'] ) && ! empty( $media_style['hoverBackground'] ) ) {
			$css .= 'background:' . $this->kadence_color_output( $media_style['hoverBackground'] ) . ';';
		}
		if ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ) {
			$css .= 'border-color:' . $this->kadence_color_output( $media_style['hoverBorder'] ) . ';';
		}
		$css .= '}';
		if ( ( ( isset( $attr['mediaType'] ) && 'icon' === $attr['mediaType'] || ! isset( $attr['mediaType'] ) ) && isset( $media_icon['hoverAnimation'] ) && 'drawborder' === $media_icon['hoverAnimation'] ) || ( isset( $attr['mediaType'] ) && 'number' === $attr['mediaType'] && isset( $media_number['hoverAnimation'] ) && 'drawborder' === $media_number['hoverAnimation'] ) || ( isset( $attr['mediaType'] ) && 'image' === $attr['mediaType'] && isset( $media_image['hoverAnimation'] ) && ( 'drawborder' === $media_image['hoverAnimation'] || 'grayscale-border-draw' === $media_image['hoverAnimation'] ) ) ) {
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
					$css .= 'border-right-color:' . ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $this->kadence_color_output( $media_style['hoverBorder'] ) : '#444444' ) . ';';
					$css .= 'border-right-width:' . $media_style['borderWidth'][ 0 ] . 'px;';
					$css .= 'border-top-width:' . $media_style['borderWidth'][ 0 ] . 'px;';
					$css .= 'border-bottom-width:' . $media_style['borderWidth'][ 0 ] . 'px;';
				$css .= '}';
			}
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before {';
				$css .= 'border-top-color:' . ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $this->kadence_color_output( $media_style['hoverBorder'] ) : '#444444' ) . ';';
				$css .= 'border-right-color:' . ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $this->kadence_color_output( $media_style['hoverBorder'] ) : '#444444' ) . ';';
				$css .= 'border-bottom-color:' . ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $this->kadence_color_output( $media_style['hoverBorder'] ) : '#444444' ) . ';';
			$css .= '}';
		}
		if ( isset( $attr['titleColor'] ) || isset( $attr['titleFont'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title {';
			if ( isset( $attr['titleColor'] ) && ! empty( $attr['titleColor'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $attr['titleColor'] ) . ';';
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
				$css .= 'color:' . $this->kadence_color_output( $attr['titleHoverColor'] ) . ';';
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
		if ( isset( $attr['titleMinHeight'] ) && is_array( $attr['titleMinHeight'] ) && isset( $attr['titleMinHeight'][0] ) ) {
			if ( is_numeric( $attr['titleMinHeight'][0] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title {';
				$css .= 'min-height:' . $attr['titleMinHeight'][0] . 'px;';
				$css .= '}';
			}
			if ( isset( $attr['titleMinHeight'][1] ) && is_numeric( $attr['titleMinHeight'][1] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title {';
				$css .= 'min-height:' . $attr['titleMinHeight'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $attr['titleMinHeight'][2] ) && is_numeric( $attr['titleMinHeight'][2] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title {';
				$css .= 'min-height:' . $attr['titleMinHeight'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['mediaAlignTablet'] ) && ! empty( $attr['mediaAlignTablet'] ) ) {
			if ( 'top' === $attr['mediaAlignTablet'] ) {
				$display = 'block';
				$align = '';
				$ms_content = '';
				$content = '';
			} elseif ( 'left' === $attr['mediaAlignTablet'] ) {
				$display = 'flex';
				$align = 'center';
				$ms_content = 'start';
				$content = 'flex-start';
			} else {
				$display = 'flex';
				$align = 'center';
				$ms_content = 'end';
				$content = 'flex-end';
			}
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap {';
			$css .= 'display: ' . $display . ';';
			if ( ! empty( $align ) ) {
				$css .= '-ms-flex-align:' . $align . ';';
				$css .= 'align-items: ' . $align . ';';
			}
			if ( ! empty( $ms_content ) ) {
				$css .= '-ms-flex-pack: ' . $ms_content . ';';
			}
			if ( ! empty( $content ) ) {
				$css .= 'justify-content: ' . $content . ';';
			}
			$css .= '}';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media {';
			$css .= 'display: block;';
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['mediaAlignMobile'] ) && ! empty( $attr['mediaAlignMobile'] ) ) {
			if ( 'top' === $attr['mediaAlignMobile'] ) {
				$display = 'block';
				$ms_content = '';
				$content = '';
			} elseif ( 'left' === $attr['mediaAlignMobile'] ) {
				$display = 'flex';
				$ms_content = 'start';
				$content = 'flex-start';
				$direction = 'row';
			} else {
				$display = 'flex';
				$ms_content = 'end';
				$content = 'flex-end';
				$direction = 'row-reverse';
			}
			$css .= '@media (max-width: 767px) {';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap {';
			$css .= 'display: ' . $display . ';';
			if ( ! empty( $ms_content ) ) {
				$css .= '-ms-flex-pack: ' . $ms_content . ';';
			}
			if ( ! empty( $content ) ) {
				$css .= 'justify-content: ' . $content . ';';
			}
			if ( ! empty( $direction ) ) {
				$css .= '-ms-flex-direction: ' . $direction . ';';
				$css .= 'flex-direction: ' . $direction . ';';
			}
			$css .= '}';
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media {';
			$css .= 'display: inline-block;';
			$css .= 'max-width: 100%;';
			$css .= '}';
			// $css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media-align-left.kt-blocks-info-box-link-wrap .kt-blocks-info-box-media {';
			// $css .= 'display: block;';
			// $css .= '}';
			// .kt-blocks-info-box-media-container {
			// 	width: 100%;
			// }
			$css .= '}';
		}
		if ( isset( $attr['textColor'] ) || isset( $attr['textFont'] ) || isset( $attr['textSpacing'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text {';
			if ( isset( $attr['textColor'] ) && ! empty( $attr['textColor'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $attr['textColor'] ) . ';';
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
			if ( isset( $attr['textSpacing'] ) && is_array( $attr['textSpacing'] ) && is_array( $attr['textSpacing'][ 0 ] ) ) {
				$text_spacing = $attr['textSpacing'][ 0 ];
				if ( isset( $text_spacing['padding'] ) && is_array( $text_spacing['padding'] ) ) {
					$css .= 'padding:' . $text_spacing['padding'][0] . 'px ' . $text_spacing['padding'][1] . 'px ' . $text_spacing['padding'][2] . 'px ' . $text_spacing['padding'][3] . 'px;';
				}
				if ( isset( $text_spacing['margin'] ) && is_array( $text_spacing['margin'] ) ) {
					$css .= 'margin:' . $text_spacing['margin'][0] . 'px ' . $text_spacing['margin'][1] . 'px ' . $text_spacing['margin'][2] . 'px ' . $text_spacing['margin'][3] . 'px;';
				}
			}
			$css .= '}';
		}
		if ( isset( $attr['textHoverColor'] ) && ! empty( $attr['textHoverColor'] ) ) {
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-text {';
				$css .= 'color:' . $this->kadence_color_output( $attr['textHoverColor'] ) . ';';
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
		if ( isset( $attr['textMinHeight'] ) && is_array( $attr['textMinHeight'] ) && isset( $attr['textMinHeight'][0] ) ) {
			if ( is_numeric( $attr['textMinHeight'][0] ) ) {
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text {';
				$css .= 'min-height:' . $attr['textMinHeight'][0] . 'px;';
				$css .= '}';
			}
			if ( isset( $attr['textMinHeight'][1] ) && is_numeric( $attr['textMinHeight'][1] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text {';
				$css .= 'min-height:' . $attr['textMinHeight'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $attr['textMinHeight'][2] ) && is_numeric( $attr['textMinHeight'][2] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text {';
				$css .= 'min-height:' . $attr['textMinHeight'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'][ 0 ] ) ) {
			$learn_more_styles = $attr['learnMoreStyles'][ 0 ];
			$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-learnmore {';
			if ( isset( $learn_more_styles['color'] ) && ! empty( $learn_more_styles['color'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $learn_more_styles['color'] ) . ';';
			}
			if ( isset( $learn_more_styles['background'] ) && ! empty( $learn_more_styles['background'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $learn_more_styles['background'] ) . ';';
			}
			if ( isset( $learn_more_styles['border'] ) && ! empty( $learn_more_styles['border'] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $learn_more_styles['border'] ) . ';';
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
				$css .= 'letter-spacing:' . $learn_more_styles['letterSpacing'] . 'px;';
			}
			if ( isset( $learn_more_styles['family'] ) && ! empty( $learn_more_styles['family'] ) ) {
				$css .= 'font-family:' . $learn_more_styles['family'] . ';';
			}
			if ( isset( $learn_more_styles['style'] ) && ! empty( $learn_more_styles['style'] ) ) {
				$css .= 'font-style:' . $learn_more_styles['style'] . ';';
			}
			if ( isset( $learn_more_styles['weight'] ) && ! empty( $learn_more_styles['weight'] ) ) {
				$css .= 'font-weight:' . $learn_more_styles['weight'] . ';';
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
					$css .= 'color:' . $this->kadence_color_output( $learn_more_styles['colorHover'] ) . ';';
				}
				if ( isset( $learn_more_styles['backgroundHover'] ) && ! empty( $learn_more_styles['backgroundHover'] ) ) {
					$css .= 'background:' . $this->kadence_color_output( $learn_more_styles['backgroundHover'] ) . ';';
				}
				if ( isset( $learn_more_styles['borderHover'] ) && ! empty( $learn_more_styles['borderHover'] ) ) {
					$css .= 'border-color:' . $this->kadence_color_output( $learn_more_styles['borderHover'] ) . ';';
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
				$css .= 'box-shadow:' . $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $this->kadence_color_output( $shadow['color'], $shadow['opacity'] ) . ';';
				$css .= '}';
			}
			if ( isset( $attr['shadowHover'] ) && is_array( $attr['shadowHover'] ) && is_array( $attr['shadowHover'][ 0 ] ) ) {
				$shadow_hover = $attr['shadowHover'][ 0 ];
				$css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover {';
				$css .= 'box-shadow:' . $shadow_hover['hOffset'] . 'px ' . $shadow_hover['vOffset'] . 'px ' . $shadow_hover['blur'] . 'px ' . $shadow_hover['spread'] . 'px ' . $this->kadence_color_output( $shadow_hover['color'], $shadow_hover['opacity'] ) . ';';
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
			$css .= 'height:' . $attr['tabletSpacerHeight'] . ( isset( $attr['spacerHeightUnits'] ) ? $attr['spacerHeightUnits'] : 'px' ) . ' !important;';
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['mobileSpacerHeight'] ) && ! empty( $attr['mobileSpacerHeight'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-block-spacer-' . $unique_id . ' .kt-block-spacer {';
			$css .= 'height:' . $attr['mobileSpacerHeight'] . ( isset( $attr['spacerHeightUnits'] ) ? $attr['spacerHeightUnits'] : 'px' ) . ' !important;';
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
				$css .= 'border-color:' . $this->kadence_color_output( $attr['contentBorderColor'] ) . ';';
			}
			if ( isset( $attr['contentBgColor'] ) && ! empty( $attr['contentBgColor'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $attr['contentBgColor'] ) . ';';
			}
			$css .= '}';
		}
		$layout = isset( $attr['layout'] ) ? $attr['layout'] : 'tabs';
		$widthType = isset( $attr['widthType'] ) ? $attr['widthType'] : 'normal';
		if ( isset( $attr['titleMargin'] ) ) {
			$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li {';
			if ( isset( $attr['titleMargin'] ) && ! empty( $attr['titleMargin'] ) && is_array( $attr['titleMargin'] ) ) {
				$css .= 'margin:' . $attr['titleMargin'][0] . 'px ' . ( 'vtabs' !== $layout && 'percent' === $widthType ? '0px ' : $attr['titleMargin'][1] . 'px ' ) . $attr['titleMargin'][2] . 'px ' . ( 'vtabs' !== $layout && 'percent' === $widthType ? '0px;' : $attr['titleMargin'][3] . 'px;' );
			}
			$css .= '}';
		}
		if ( 'vtabs' !== $layout && 'percent' === $widthType ) {
			if ( isset( $attr['gutter'] ) && ! empty( $attr['gutter'] ) && is_array( $attr['gutter'] ) ) {
				$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title {';
					$css .= 'margin-right:' . $attr['gutter'][0] . 'px;';
				$css .= '}';
			}
			if ( isset( $attr['tabWidth'] ) && ! empty( $attr['tabWidth'] ) && is_array( $attr['tabWidth'] ) && ! empty( $attr['tabWidth'][1] ) && '' !== $attr['tabWidth'][1] ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list.kb-tabs-list-columns > li {';
				$css .= 'flex: 0 1 ' . round( 100 / $attr['tabWidth'][1], 2 ) . '%;';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $attr['gutter'] ) && ! empty( $attr['gutter'] ) && is_array( $attr['gutter'] ) && isset( $attr['gutter'][1] ) && is_numeric( $attr['gutter'][1] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title {';
				$css .= 'margin-right:' . $attr['gutter'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $attr['tabWidth'] ) && ! empty( $attr['tabWidth'] ) && is_array( $attr['tabWidth'] ) && ! empty( $attr['tabWidth'][2] ) && '' !== $attr['tabWidth'][2] ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list.kb-tabs-list-columns > li {';
				$css .= 'flex: 0 1 ' . round( 100 / $attr['tabWidth'][2], 2 ) . '%;';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $attr['gutter'] ) && ! empty( $attr['gutter'] ) && is_array( $attr['gutter'] ) && isset( $attr['gutter'][2] ) && is_numeric( $attr['gutter'][2] ) ) {
				$css .= '@media (max-width: 767px) {';
					$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title {';
						$css .= 'margin-right:' . $attr['gutter'][2] . 'px;';
					$css .= '}';
				$css .= '}';
			}
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
			if ( isset( $attr['fontWeight'] ) && ! empty( $attr['fontWeight'] ) ) {
				$css .= 'font-weight:' . $attr['fontWeight'] . ';';
			}
			if ( isset( $attr['fontStyle'] ) && ! empty( $attr['fontStyle'] ) ) {
				$css .= 'font-style:' . $attr['fontStyle'] . ';';
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
				$css .= 'border-color:' . $this->kadence_color_output( $attr['titleBorder'] ) . ';';
			}
			if ( isset( $attr['titleColor'] ) && ! empty( $attr['titleColor'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $attr['titleColor'] ) . ';';
			}
			if ( isset( $attr['titleBg'] ) && ! empty( $attr['titleBg'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $attr['titleBg'] ) . ';';
			}
			$css .= '}';
		}
		// Hover.
		if ( isset( $attr['titleBorderHover'] ) || isset( $attr['titleColorHover'] ) || isset( $attr['titleBgHover'] ) ) {
			$css .= '.kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title:hover, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title:hover {';
			if ( isset( $attr['titleBorderHover'] ) && ! empty( $attr['titleBorderHover'] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $attr['titleBorderHover'] ) . ';';
			}
			if ( isset( $attr['titleColorHover'] ) && ! empty( $attr['titleColorHover'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $attr['titleColorHover'] ) . ';';
			}
			if ( isset( $attr['titleBgHover'] ) && ! empty( $attr['titleBgHover'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $attr['titleBgHover'] ) . ';';
			}
			$css .= '}';
		}
		// Active.
		if ( isset( $attr['titleBorderActive'] ) || isset( $attr['titleColorActive'] ) || isset( $attr['titleBgActive'] ) ) {
			$css .= '.kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tab-title-active .kt-tab-title  {';
			if ( isset( $attr['titleBorderActive'] ) && ! empty( $attr['titleBorderActive'] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $attr['titleBorderActive'] ) . ';';
			}
			if ( isset( $attr['titleColorActive'] ) && ! empty( $attr['titleColorActive'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $attr['titleColorActive'] ) . ';';
			}
			if ( isset( $attr['titleBgActive'] ) && ! empty( $attr['titleBgActive'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $attr['titleBgActive'] ) . ';';
			} else {
				$css .= 'background:#ffffff;';
			}
			$css .= '}';
		}
		if ( isset( $attr['tabSize'] ) || isset( $attr['tabLineHeight'] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title {';
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
			$css .= '.wp-block-kadence-tabs .kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-tab-title, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title {';
			if ( isset( $attr['mobileSize'] ) ) {
				$css .= 'font-size:' . $attr['mobileSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) . ';';
			}
			if ( isset( $attr['mobileLineHeight'] ) ) {
				$css .= 'line-height:' . $attr['mobileLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['enableSubtitle'] ) && true == $attr['enableSubtitle'] && isset( $attr['subtitleFont'] ) && is_array( $attr['subtitleFont'] ) && is_array( $attr['subtitleFont'][0] ) ) {
			$css .= '.kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-title-sub-text, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-title-sub-text {';
			$subtitle_font = $attr['subtitleFont'][0];
			if ( isset( $subtitle_font['size'] ) && is_array( $subtitle_font['size'] ) && ! empty( $subtitle_font['size'][0] ) ) {
				$css .= 'font-size:' . $subtitle_font['size'][0] . ( ! isset( $subtitle_font['sizeType'] ) ? 'px' : $subtitle_font['sizeType'] ) . ';';
			}
			if ( isset( $subtitle_font['lineHeight'] ) && is_array( $subtitle_font['lineHeight'] ) && ! empty( $subtitle_font['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $subtitle_font['lineHeight'][0] . ( ! isset( $subtitle_font['lineType'] ) ? 'px' : $subtitle_font['lineType'] ) . ';';
			}
			if ( isset( $subtitle_font['letterSpacing'] ) && ! empty( $subtitle_font['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $subtitle_font['letterSpacing'] .  'px;';
			}
			if ( isset( $subtitle_font['textTransform'] ) && ! empty( $subtitle_font['textTransform'] ) ) {
				$css .= 'text-transform:' . $subtitle_font['textTransform'] .  ';';
			}
			if ( isset( $subtitle_font['family'] ) && ! empty( $subtitle_font['family'] ) ) {
				$css .= 'font-family:' . $subtitle_font['family'] .  ';';
			}
			if ( isset( $subtitle_font['style'] ) && ! empty( $subtitle_font['style'] ) ) {
				$css .= 'font-style:' . $subtitle_font['style'] .  ';';
			}
			if ( isset( $subtitle_font['weight'] ) && ! empty( $subtitle_font['weight'] ) ) {
				$css .= 'font-weight:' . $subtitle_font['weight'] .  ';';
			}
			if ( isset( $subtitle_font['padding'] ) && is_array( $subtitle_font['padding'] ) ) {
				$css .= 'padding:' . $subtitle_font['padding'][0] . 'px ' . $subtitle_font['padding'][1] . 'px ' . $subtitle_font['padding'][2] . 'px ' . $subtitle_font['padding'][3] . 'px;';
			}
			if ( isset( $subtitle_font['margin'] ) && is_array( $subtitle_font['margin'] ) ) {
				$css .= 'margin:' . $subtitle_font['margin'][0] . 'px ' . $subtitle_font['margin'][1] . 'px ' . $subtitle_font['margin'][2] . 'px ' . $subtitle_font['margin'][3] . 'px;';
			}
			$css .= '}';
		}
		if ( isset( $attr['subtitleFont'] ) && is_array( $attr['subtitleFont'] ) && isset( $attr['subtitleFont'][0] ) && is_array( $attr['subtitleFont'][0] ) && ( ( isset( $attr['subtitleFont'][0]['size'] ) && is_array( $attr['subtitleFont'][0]['size'] ) && isset( $attr['subtitleFont'][0]['size'][1] ) && ! empty( $attr['subtitleFont'][0]['size'][1] ) ) || ( isset( $attr['subtitleFont'][0]['lineHeight'] ) && is_array( $attr['subtitleFont'][0]['lineHeight'] ) && isset( $attr['subtitleFont'][0]['lineHeight'][1] ) && ! empty( $attr['subtitleFont'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-title-sub-text, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-title-sub-text {';
			if ( isset( $attr['subtitleFont'][0]['size'][1] ) && ! empty( $attr['subtitleFont'][0]['size'][1] ) ) {
				$css .= 'font-size:' . $attr['subtitleFont'][0]['size'][1] . ( ! isset( $attr['subtitleFont'][0]['sizeType'] ) ? 'px' : $attr['subtitleFont'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['subtitleFont'][0]['lineHeight'][1] ) && ! empty( $attr['subtitleFont'][0]['lineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['subtitleFont'][0]['lineHeight'][1] . ( ! isset( $attr['subtitleFont'][0]['lineType'] ) ? 'px' : $attr['subtitleFont'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['subtitleFont'] ) && is_array( $attr['subtitleFont'] ) && isset( $attr['subtitleFont'][0] ) && is_array( $attr['subtitleFont'][0] ) && ( ( isset( $attr['subtitleFont'][0]['size'] ) && is_array( $attr['subtitleFont'][0]['size'] ) && isset( $attr['subtitleFont'][0]['size'][2] ) && ! empty( $attr['subtitleFont'][0]['size'][2] ) ) || ( isset( $attr['subtitleFont'][0]['lineHeight'] ) && is_array( $attr['subtitleFont'][0]['lineHeight'] ) && isset( $attr['subtitleFont'][0]['lineHeight'][2] ) && ! empty( $attr['subtitleFont'][0]['lineHeight'][2] ) ) ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-tabs-id' . $unique_id . ' > .kt-tabs-title-list li .kt-title-sub-text, .kt-tabs-id' . $unique_id . ' > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-title-sub-text {';
			if ( isset( $attr['subtitleFont'][0]['size'][2] ) && ! empty( $attr['subtitleFont'][0]['size'][2] ) ) {
				$css .= 'font-size:' . $attr['subtitleFont'][0]['size'][2] . ( ! isset( $attr['subtitleFont'][0]['sizeType'] ) ? 'px' : $attr['subtitleFont'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['subtitleFont'][0]['lineHeight'][2] ) && ! empty( $attr['subtitleFont'][0]['lineHeight'][2] ) ) {
				$css .= 'line-height:' . $attr['subtitleFont'][0]['lineHeight'][2] . ( ! isset( $attr['subtitleFont'][0]['lineType'] ) ? 'px' : $attr['subtitleFont'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}
	/**
	 * Adds Google fonts for infobox block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_infobox_scripts_gfonts( $attr ) {
		if ( isset( $attr['mediaType'] ) && 'number' === $attr['mediaType'] && isset( $attr['mediaNumber'] ) && is_array( $attr['mediaNumber'] ) && isset( $attr['mediaNumber'][0] ) && is_array( $attr['mediaNumber'][0] ) && isset( $attr['mediaNumber'][0]['google'] ) && $attr['mediaNumber'][0]['google'] && ( ! isset( $attr['mediaNumber'][0]['loadGoogle'] ) || true === $attr['mediaNumber'][0]['loadGoogle'] ) && isset( $attr['mediaNumber'][0]['family'] ) ) {
			$number_font = $attr['mediaNumber'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $number_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily'   => $number_font['family'],
					'fontvariants' => ( isset( $number_font['variant'] ) && ! empty( $number_font['variant'] ) ? array( $number_font['variant'] ) : array() ),
					'fontsubsets'  => ( isset( $number_font['subset'] ) && ! empty( $number_font['subset'] ) ? array( $number_font['subset'] ) : array() ),
				);
				self::$gfonts[ $number_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $number_font['variant'], self::$gfonts[ $number_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $number_font['family'] ]['fontvariants'], $number_font['variant'] );
				}
				if ( ! in_array( $number_font['subset'], self::$gfonts[ $number_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $number_font['family'] ]['fontsubsets'], $number_font['subset'] );
				}
			}
		}
		if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && isset( $attr['titleFont'][0]['google'] ) && $attr['titleFont'][0]['google'] && ( ! isset( $attr['titleFont'][0]['loadGoogle'] ) || true === $attr['titleFont'][0]['loadGoogle'] ) &&  isset( $attr['titleFont'][0]['family'] ) ) {
			$title_font = $attr['titleFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $title_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily'   => $title_font['family'],
					'fontvariants' => ( isset( $title_font['variant'] ) && ! empty( $title_font['variant'] ) ? array( $title_font['variant'] ) : array() ),
					'fontsubsets'  => ( isset( $title_font['subset'] ) && ! empty( $title_font['subset'] ) ? array( $title_font['subset'] ) : array() ),
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
			// Check if the font has been added yet.
			if ( ! array_key_exists( $text_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $text_font['family'],
					'fontvariants' => ( isset( $text_font['variant'] ) && ! empty( $text_font['variant'] ) ? array( $text_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $text_font['subset'] ) && ! empty( $text_font['subset'] ) ? array( $text_font['subset'] ) : array() ),
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
			// Check if the font has been added yet.
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
	 * Adds Google fonts for iconlist block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_iconlist_scripts_gfonts( $attr ) {
		if ( isset( $attr['listStyles'] ) && is_array( $attr['listStyles'] ) && isset( $attr['listStyles'][0] ) && is_array( $attr['listStyles'][0] ) && isset( $attr['listStyles'][0]['google'] ) && $attr['listStyles'][0]['google'] && ( ! isset( $attr['listStyles'][0]['loadGoogle'] ) || true === $attr['listStyles'][0]['loadGoogle'] ) &&  isset( $attr['listStyles'][0]['family'] ) ) {
			$list_font = $attr['listStyles'][0];
			// Check if the font has been added yet
			if ( ! array_key_exists( $list_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $list_font['family'],
					'fontvariants' => ( isset( $list_font['variant'] ) && ! empty( $list_font['variant'] ) ? array( $list_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $list_font['subset'] ) && !empty( $list_font['subset'] ) ? array( $list_font['subset'] ) : array() ),
				);
				self::$gfonts[ $list_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $list_font['variant'], self::$gfonts[ $list_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $list_font['family'] ]['fontvariants'], $list_font['variant'] );
				}
				if ( ! in_array( $list_font['subset'], self::$gfonts[ $list_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $list_font['family'] ]['fontsubsets'], $list_font['subset'] );
				}
			}
		}
	}
	/**
	 * Grabs the Google Fonts that are needed so we can load in the head.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_testimonials_scripts_gfonts( $attr ) {
		if ( isset( $attr['layout'] ) && 'carousel' === $attr['layout'] ) {
			$this->enqueue_style( 'kadence-blocks-pro-slick' );
			$this->enqueue_script( 'kadence-blocks-slick-init' );
		}
		if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && isset( $attr['titleFont'][0]['google'] ) && $attr['titleFont'][0]['google'] && ( ! isset( $attr['titleFont'][0]['loadGoogle'] ) || true === $attr['titleFont'][0]['loadGoogle'] ) && isset( $attr['titleFont'][0]['family'] ) ) {
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
		if ( isset( $attr['contentFont'] ) && is_array( $attr['contentFont'] ) && isset( $attr['contentFont'][0] ) && is_array( $attr['contentFont'][0] ) && isset( $attr['contentFont'][0]['google'] ) && $attr['contentFont'][0]['google'] && ( ! isset( $attr['contentFont'][0]['loadGoogle'] ) || true === $attr['contentFont'][0]['loadGoogle'] ) && isset( $attr['contentFont'][0]['family'] ) ) {
			$content_font = $attr['contentFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $content_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $content_font['family'],
					'fontvariants' => ( isset( $content_font['variant'] ) && ! empty( $content_font['variant'] ) ? array( $content_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $content_font['subset'] ) && ! empty( $content_font['subset'] ) ? array( $content_font['subset'] ) : array() ),
				);
				self::$gfonts[ $content_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $content_font['variant'], self::$gfonts[ $content_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $content_font['family'] ]['fontvariants'], $content_font['variant'] );
				}
				if ( ! in_array( $content_font['subset'], self::$gfonts[ $content_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $content_font['family'] ]['fontsubsets'], $content_font['subset'] );
				}
			}
		}
		if ( isset( $attr['nameFont'] ) && is_array( $attr['nameFont'] ) && isset( $attr['nameFont'][0] ) && is_array( $attr['nameFont'][0] ) && isset( $attr['nameFont'][0]['google'] ) && $attr['nameFont'][0]['google'] && ( ! isset( $attr['nameFont'][0]['loadGoogle'] ) || true === $attr['nameFont'][0]['loadGoogle'] ) && isset( $attr['nameFont'][0]['family'] ) ) {
			$name_font = $attr['nameFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $name_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $name_font['family'],
					'fontvariants' => ( isset( $name_font['variant'] ) && ! empty( $name_font['variant'] ) ? array( $name_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $name_font['subset'] ) && ! empty( $name_font['subset'] ) ? array( $name_font['subset'] ) : array() ),
				);
				self::$gfonts[ $name_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $name_font['variant'], self::$gfonts[ $name_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $name_font['family'] ]['fontvariants'], $name_font['variant'] );
				}
				if ( ! in_array( $name_font['subset'], self::$gfonts[ $name_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $name_font['family'] ]['fontsubsets'], $name_font['subset'] );
				}
			}
		}
		if ( isset( $attr['occupationFont'] ) && is_array( $attr['occupationFont'] ) && isset( $attr['occupationFont'][0] ) && is_array( $attr['occupationFont'][0] ) && isset( $attr['occupationFont'][0]['google'] ) && $attr['occupationFont'][0]['google'] && ( ! isset( $attr['occupationFont'][0]['loadGoogle'] ) || true === $attr['occupationFont'][0]['loadGoogle'] ) && isset( $attr['occupationFont'][0]['family'] ) ) {
			$occupation_font = $attr['occupationFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $occupation_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $occupation_font['family'],
					'fontvariants' => ( isset( $occupation_font['variant'] ) && ! empty( $occupation_font['variant'] ) ? array( $occupation_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $occupation_font['subset'] ) && ! empty( $occupation_font['subset'] ) ? array( $occupation_font['subset'] ) : array() ),
				);
				self::$gfonts[ $occupation_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $occupation_font['variant'], self::$gfonts[ $occupation_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $occupation_font['family'] ]['fontvariants'], $occupation_font['variant'] );
				}
				if ( ! in_array( $occupation_font['subset'], self::$gfonts[ $occupation_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $occupation_font['family'] ]['fontsubsets'], $occupation_font['subset'] );
				}
			}
		}
	}
	/**
	 * Builds CSS for Testimonial block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_testimonials_array( $attr, $unique_id ) {
		$css                          = new Kadence_Blocks_CSS();
		$media_query                  = array();
		$media_query['mobile']        = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['mobileReverse'] = apply_filters( 'kadence_mobile_reverse_media_query', '(min-width: 768px)' );
		$media_query['tablet']        = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['tabletOnly']    = apply_filters( 'kadence_tablet_only_media_query', '@media (min-width: 768px) and (max-width: 1024px)' );
		$media_query['desktop']       = apply_filters( 'kadence_tablet_media_query', '(min-width: 1025px)' );
		//$css = '';
		if ( isset( $attr['layout'] ) && 'carousel' === $attr['layout'] && isset( $attr['columnGap'] ) && ! empty( $attr['columnGap'] ) ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-carousel .kt-blocks-testimonial-carousel-item' );
			$css->add_property( 'padding', '0 ' . ( $attr['columnGap'] / 2 ) . 'px' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init' );
			$css->add_property( 'margin', '0 -' . ( $attr['columnGap'] / 2 ) . 'px' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-carousel .slick-prev' );
			$css->add_property( 'left', ( $attr['columnGap'] / 2 ) . 'px' );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-blocks-carousel .slick-next' );
			$css->add_property( 'right', ( $attr['columnGap'] / 2 ) . 'px' );
		}
		if ( isset( $attr['style'] ) && ( 'bubble' === $attr['style'] || 'inlineimage' === $attr['style'] ) ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-text-wrap:after' );
			if ( isset( $attr['containerBorderWidth'] ) && is_array( $attr['containerBorderWidth'] ) && ! empty( $attr['containerBorderWidth'][2] ) ) {
				$css->add_property( 'margin-top',  $attr['containerBorderWidth'][2] . 'px' );
			}
			if ( isset( $attr['containerBorder'] ) && ! empty( $attr['containerBorder'] ) ) {
				$alpha = ( isset( $attr['containerBorderOpacity'] ) && is_numeric( $attr['containerBorderOpacity'] ) ? $attr['containerBorderOpacity'] : 1 );
				$css->add_property( 'border-top-color', $css->render_color( $attr['containerBorder'], $alpha ) );
			}
		}
		if ( isset( $attr['containerMinHeight'] ) && is_array( $attr['containerMinHeight'] ) && isset( $attr['containerMinHeight'][0] ) && is_numeric( $attr['containerMinHeight'][0] ) ) {
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap' );
			$css->add_property( 'min-height', $attr['containerMinHeight'][0] . 'px' );
		}
		if ( isset( $attr['containerMinHeight'] ) && is_array( $attr['containerMinHeight'] ) && isset( $attr['containerMinHeight'][1] ) && is_numeric( $attr['containerMinHeight'][1] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap' );
			$css->add_property( 'min-height', $attr['containerMinHeight'][1] . 'px' );
			$css->stop_media_query();
		}
		if ( isset( $attr['containerMinHeight'] ) && is_array( $attr['containerMinHeight'] ) && isset( $attr['containerMinHeight'][2] ) && is_numeric( $attr['containerMinHeight'][2] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-item-wrap' );
			$css->add_property( 'min-height', $attr['containerMinHeight'][2] . 'px' );
			$css->stop_media_query();
		}
		if ( ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && is_array( $attr['titleFont'][0] ) ) || ( isset( $attr['titleMinHeight'] ) && is_array( $attr['titleMinHeight'] ) && isset( $attr['titleMinHeight'][0] ) && is_numeric( $attr['titleMinHeight'][0] ) ) ) {
			$title_font = $attr['titleFont'][0];
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-title' );
			if ( isset( $title_font['color'] ) && ! empty( $title_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $title_font['color'] ) );
			}
			if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && ! empty( $title_font['size'][0] ) ) {
				$css->add_property( 'font-size', $title_font['size'][0] . ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) );
			}
			if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && ! empty( $title_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $title_font['lineHeight'][0] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
			}
			if ( isset( $title_font['letterSpacing'] ) && ! empty( $title_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $title_font['letterSpacing'] . 'px' );
			}
			if ( isset( $title_font['textTransform'] ) && ! empty( $title_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $title_font['textTransform'] );
			}
			if ( isset( $title_font['family'] ) && ! empty( $title_font['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $title_font['family'] ) );
			}
			if ( isset( $title_font['style'] ) && ! empty( $title_font['style'] ) ) {
				$css->add_property( 'font-style', $title_font['style'] );
			}
			if ( isset( $title_font['weight'] ) && ! empty( $title_font['weight'] ) && 'regular' !== $title_font['weight'] ) {
				$css->add_property( 'font-weight', $title_font['weight'] );
			}
			if ( isset( $attr['titleMinHeight'] ) && is_array( $attr['titleMinHeight'] ) && isset( $attr['titleMinHeight'][0] ) && is_numeric( $attr['titleMinHeight'][0] ) ) {
				$css->add_property( 'min-height', $attr['titleMinHeight'][0] . 'px' );
			}
		}
		if ( ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && ( ( isset( $attr['titleFont'][0]['size'] ) && is_array( $attr['titleFont'][0]['size'] ) && isset( $attr['titleFont'][0]['size'][1] ) && ! empty( $attr['titleFont'][0]['size'][1] ) ) || ( isset( $attr['titleFont'][0]['lineHeight'] ) && is_array( $attr['titleFont'][0]['lineHeight'] ) && isset( $attr['titleFont'][0]['lineHeight'][1] ) && ! empty( $attr['titleFont'][0]['lineHeight'][1] ) ) ) ) || ( isset( $attr['titleMinHeight'] ) && is_array( $attr['titleMinHeight'] ) && isset( $attr['titleMinHeight'][1] ) && is_numeric( $attr['titleMinHeight'][1] ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-title' );
			if ( isset( $attr['titleFont'][0]['size'][1] ) && ! empty( $attr['titleFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attr['titleFont'][0]['size'][1] . ( ! isset( $attr['titleFont'][0]['sizeType'] ) ? 'px' : $attr['titleFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['titleFont'][0]['lineHeight'][1] ) && ! empty( $attr['titleFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['titleFont'][0]['lineHeight'][1] . ( ! isset( $attr['titleFont'][0]['lineType'] ) ? 'px' : $attr['titleFont'][0]['lineType'] ) );
			}
			if ( isset( $attr['titleMinHeight'] ) && is_array( $attr['titleMinHeight'] ) && isset( $attr['titleMinHeight'][1] ) && is_numeric( $attr['titleMinHeight'][1] ) ) {
				$css->add_property( 'min-height', $attr['titleMinHeight'][1] . 'px' );
			}
			$css->stop_media_query();
		}
		if ( ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && ( ( isset( $attr['titleFont'][0]['size'] ) && is_array( $attr['titleFont'][0]['size'] ) && isset( $attr['titleFont'][0]['size'][2] ) && ! empty( $attr['titleFont'][0]['size'][2] ) ) || ( isset( $attr['titleFont'][0]['lineHeight'] ) && is_array( $attr['titleFont'][0]['lineHeight'] ) && isset( $attr['titleFont'][0]['lineHeight'][2] ) && ! empty( $attr['titleFont'][0]['lineHeight'][2] ) ) ) ) || ( isset( $attr['titleMinHeight'] ) && is_array( $attr['titleMinHeight'] ) && isset( $attr['titleMinHeight'][1] ) && is_numeric( $attr['titleMinHeight'][1] ) ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-title' );
			if ( isset( $attr['titleFont'][0]['size'][2] ) && ! empty( $attr['titleFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attr['titleFont'][0]['size'][2] . ( ! isset( $attr['titleFont'][0]['sizeType'] ) ? 'px' : $attr['titleFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['titleFont'][0]['lineHeight'][2] ) && ! empty( $attr['titleFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['titleFont'][0]['lineHeight'][2] . ( ! isset( $attr['titleFont'][0]['lineType'] ) ? 'px' : $attr['titleFont'][0]['lineType'] ) );
			}
			if ( isset( $attr['titleMinHeight'] ) && is_array( $attr['titleMinHeight'] ) && isset( $attr['titleMinHeight'][2] ) && is_numeric( $attr['titleMinHeight'][2] ) ) {
				$css->add_property( 'min-height', $attr['titleMinHeight'][2] . 'px' );
			}
			$css->stop_media_query();
		}
		if ( ( isset( $attr['contentFont'] ) && is_array( $attr['contentFont'] ) && is_array( $attr['contentFont'][0] ) ) || ( isset( $attr['contentMinHeight'] ) && is_array( $attr['contentMinHeight'] ) && isset( $attr['contentMinHeight'][0] ) && is_numeric( $attr['contentMinHeight'][0] ) ) ) {
			$content_font = $attr['contentFont'][0];
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-content' );
			if ( isset( $content_font['color'] ) && ! empty( $content_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $content_font['color'] ) );
			}
			if ( isset( $content_font['size'] ) && is_array( $content_font['size'] ) && ! empty( $content_font['size'][0] ) ) {
				$css->add_property( 'font-size', $content_font['size'][0] . ( ! isset( $content_font['sizeType'] ) ? 'px' : $content_font['sizeType'] ) );
			}
			if ( isset( $content_font['lineHeight'] ) && is_array( $content_font['lineHeight'] ) && ! empty( $content_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $content_font['lineHeight'][0] . ( ! isset( $content_font['lineType'] ) ? 'px' : $content_font['lineType'] ) );
			}
			if ( isset( $content_font['letterSpacing'] ) && ! empty( $content_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $content_font['letterSpacing'] . 'px' );
			}
			if ( isset( $content_font['textTransform'] ) && ! empty( $content_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $content_font['textTransform'] );
			}
			if ( isset( $content_font['family'] ) && ! empty( $content_font['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $content_font['family'] ) );
			}
			if ( isset( $content_font['style'] ) && ! empty( $content_font['style'] ) ) {
				$css->add_property( 'font-style', $content_font['style'] );
			}
			if ( isset( $content_font['weight'] ) && ! empty( $content_font['weight'] ) && 'regular' !== $content_font['weight'] ) {
				$css->add_property( 'font-weight', $content_font['weight'] );
			}
			if ( isset( $attr['contentMinHeight'] ) && is_array( $attr['contentMinHeight'] ) && isset( $attr['contentMinHeight'][0] ) && is_numeric( $attr['contentMinHeight'][0] ) ) {
				$css->add_property( 'min-height', $attr['contentMinHeight'][0] . 'px' );
			}
		}
		if ( ( isset( $attr['contentFont'] ) && is_array( $attr['contentFont'] ) && isset( $attr['contentFont'][0] ) && is_array( $attr['contentFont'][0] ) && ( ( isset( $attr['contentFont'][0]['size'] ) && is_array( $attr['contentFont'][0]['size'] ) && isset( $attr['contentFont'][0]['size'][1] ) && ! empty( $attr['contentFont'][0]['size'][1] ) ) || ( isset( $attr['contentFont'][0]['lineHeight'] ) && is_array( $attr['contentFont'][0]['lineHeight'] ) && isset( $attr['contentFont'][0]['lineHeight'][1] ) && ! empty( $attr['contentFont'][0]['lineHeight'][1] ) ) ) ) || ( isset( $attr['contentMinHeight'] ) && is_array( $attr['contentMinHeight'] ) && isset( $attr['contentMinHeight'][1] ) && is_numeric( $attr['contentMinHeight'][1] ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-content' );
			if ( isset( $attr['contentFont'][0]['size'][1] ) && ! empty( $attr['contentFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attr['contentFont'][0]['size'][1] . ( ! isset( $attr['contentFont'][0]['sizeType'] ) ? 'px' : $attr['contentFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['contentFont'][0]['lineHeight'][1] ) && ! empty( $attr['contentFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['contentFont'][0]['lineHeight'][1] . ( ! isset( $attr['contentFont'][0]['lineType'] ) ? 'px' : $attr['contentFont'][0]['lineType'] ) );
			}
			if ( isset( $attr['contentMinHeight'] ) && is_array( $attr['contentMinHeight'] ) && isset( $attr['contentMinHeight'][1] ) && is_numeric( $attr['contentMinHeight'][1] ) ) {
				$css->add_property( 'min-height', $attr['contentMinHeight'][1] . 'px' );
			}
			$css->stop_media_query();
		}
		if ( ( isset( $attr['contentFont'] ) && is_array( $attr['contentFont'] ) && isset( $attr['contentFont'][0] ) && is_array( $attr['contentFont'][0] ) && ( ( isset( $attr['contentFont'][0]['size'] ) && is_array( $attr['contentFont'][0]['size'] ) && isset( $attr['contentFont'][0]['size'][2] ) && ! empty( $attr['contentFont'][0]['size'][2] ) ) || ( isset( $attr['contentFont'][0]['lineHeight'] ) && is_array( $attr['contentFont'][0]['lineHeight'] ) && isset( $attr['contentFont'][0]['lineHeight'][2] ) && ! empty( $attr['contentFont'][0]['lineHeight'][2] ) ) ) ) || ( isset( $attr['contentMinHeight'] ) && is_array( $attr['contentMinHeight'] ) && isset( $attr['contentMinHeight'][2] ) && is_numeric( $attr['contentMinHeight'][2] ) ) ) {
			$css->start_media_query( $media_query['mobile'] );
				$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-content' );
			if ( isset( $attr['contentFont'][0]['size'][2] ) && ! empty( $attr['contentFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attr['contentFont'][0]['size'][2] . ( ! isset( $attr['contentFont'][0]['sizeType'] ) ? 'px' : $attr['contentFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['contentFont'][0]['lineHeight'][2] ) && ! empty( $attr['contentFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['contentFont'][0]['lineHeight'][2] . ( ! isset( $attr['contentFont'][0]['lineType'] ) ? 'px' : $attr['contentFont'][0]['lineType'] ) );
			}
			if ( isset( $attr['contentMinHeight'] ) && is_array( $attr['contentMinHeight'] ) && isset( $attr['contentMinHeight'][2] ) && is_numeric( $attr['contentMinHeight'][2] ) ) {
				$css->add_property( 'min-height', $attr['contentMinHeight'][2] . 'px' );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['nameFont'] ) && is_array( $attr['nameFont'] ) && is_array( $attr['nameFont'][0] ) ) {
			$name_font = $attr['nameFont'][0];
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-name' );
			if ( isset( $name_font['color'] ) && ! empty( $name_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $name_font['color'] ) );
			}
			if ( isset( $name_font['size'] ) && is_array( $name_font['size'] ) && ! empty( $name_font['size'][0] ) ) {
				$css->add_property( 'font-size', $name_font['size'][0] . ( ! isset( $name_font['sizeType'] ) ? 'px' : $name_font['sizeType'] ) );
			}
			if ( isset( $name_font['lineHeight'] ) && is_array( $name_font['lineHeight'] ) && ! empty( $name_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $name_font['lineHeight'][0] . ( ! isset( $name_font['lineType'] ) ? 'px' : $name_font['lineType'] ) );
			}
			if ( isset( $name_font['letterSpacing'] ) && ! empty( $name_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $name_font['letterSpacing'] . 'px' );
			}
			if ( isset( $name_font['textTransform'] ) && ! empty( $name_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $name_font['textTransform'] );
			}
			if ( isset( $name_font['family'] ) && ! empty( $name_font['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $name_font['family'] ) );
			}
			if ( isset( $name_font['style'] ) && ! empty( $name_font['style'] ) ) {
				$css->add_property( 'font-style', $name_font['style'] );
			}
			if ( isset( $name_font['weight'] ) && ! empty( $name_font['weight'] ) && 'regular' !== $name_font['weight'] ) {
				$css->add_property( 'font-weight', $name_font['weight'] );
			}
		}
		if ( isset( $attr['nameFont'] ) && is_array( $attr['nameFont'] ) && isset( $attr['nameFont'][0] ) && is_array( $attr['nameFont'][0] ) && ( ( isset( $attr['nameFont'][0]['size'] ) && is_array( $attr['nameFont'][0]['size'] ) && isset( $attr['nameFont'][0]['size'][1] ) && ! empty( $attr['nameFont'][0]['size'][1] ) ) || ( isset( $attr['nameFont'][0]['lineHeight'] ) && is_array( $attr['nameFont'][0]['lineHeight'] ) && isset( $attr['nameFont'][0]['lineHeight'][1] ) && ! empty( $attr['nameFont'][0]['lineHeight'][1] ) ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-name' );
			if ( isset( $attr['nameFont'][0]['size'][1] ) && ! empty( $attr['nameFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attr['nameFont'][0]['size'][1] . ( ! isset( $attr['nameFont'][0]['sizeType'] ) ? 'px' : $attr['nameFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['nameFont'][0]['lineHeight'][1] ) && ! empty( $attr['nameFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['nameFont'][0]['lineHeight'][1] . ( ! isset( $attr['nameFont'][0]['lineType'] ) ? 'px' : $attr['nameFont'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['nameFont'] ) && is_array( $attr['nameFont'] ) && isset( $attr['nameFont'][0] ) && is_array( $attr['nameFont'][0] ) && ( ( isset( $attr['nameFont'][0]['size'] ) && is_array( $attr['nameFont'][0]['size'] ) && isset( $attr['nameFont'][0]['size'][2] ) && ! empty( $attr['nameFont'][0]['size'][2] ) ) || ( isset( $attr['nameFont'][0]['lineHeight'] ) && is_array( $attr['nameFont'][0]['lineHeight'] ) && isset( $attr['nameFont'][0]['lineHeight'][2] ) && ! empty( $attr['nameFont'][0]['lineHeight'][2] ) ) ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-name' );
			if ( isset( $attr['nameFont'][0]['size'][2] ) && ! empty( $attr['nameFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attr['nameFont'][0]['size'][2] . ( ! isset( $attr['nameFont'][0]['sizeType'] ) ? 'px' : $attr['nameFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['nameFont'][0]['lineHeight'][2] ) && ! empty( $attr['nameFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['nameFont'][0]['lineHeight'][2] . ( ! isset( $attr['nameFont'][0]['lineType'] ) ? 'px' : $attr['nameFont'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['occupationFont'] ) && is_array( $attr['occupationFont'] ) && is_array( $attr['occupationFont'][0] ) ) {
			$occupation_font = $attr['occupationFont'][0];
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-occupation' );
			if ( isset( $occupation_font['color'] ) && ! empty( $occupation_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $occupation_font['color'] ) );
			}
			if ( isset( $occupation_font['size'] ) && is_array( $occupation_font['size'] ) && ! empty( $occupation_font['size'][0] ) ) {
				$css->add_property( 'font-size', $occupation_font['size'][0] . ( ! isset( $occupation_font['sizeType'] ) ? 'px' : $occupation_font['sizeType'] ) );
			}
			if ( isset( $occupation_font['lineHeight'] ) && is_array( $occupation_font['lineHeight'] ) && ! empty( $occupation_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $occupation_font['lineHeight'][0] . ( ! isset( $occupation_font['lineType'] ) ? 'px' : $occupation_font['lineType'] ) );
			}
			if ( isset( $occupation_font['letterSpacing'] ) && ! empty( $occupation_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $occupation_font['letterSpacing'] . 'px' );
			}
			if ( isset( $occupation_font['textTransform'] ) && ! empty( $occupation_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $occupation_font['textTransform'] );
			}
			if ( isset( $occupation_font['family'] ) && ! empty( $occupation_font['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $occupation_font['family'] ) );
			}
			if ( isset( $occupation_font['style'] ) && ! empty( $occupation_font['style'] ) ) {
				$css->add_property( 'font-style', $occupation_font['style'] );
			}
			if ( isset( $occupation_font['weight'] ) && ! empty( $occupation_font['weight'] ) && 'regular' !== $occupation_font['weight'] ) {
				$css->add_property( 'font-weight', $occupation_font['weight'] );
			}
		}
		if ( isset( $attr['occupationFont'] ) && is_array( $attr['occupationFont'] ) && isset( $attr['occupationFont'][0] ) && is_array( $attr['occupationFont'][0] ) && ( ( isset( $attr['occupationFont'][0]['size'] ) && is_array( $attr['occupationFont'][0]['size'] ) && isset( $attr['occupationFont'][0]['size'][1] ) && ! empty( $attr['occupationFont'][0]['size'][1] ) ) || ( isset( $attr['occupationFont'][0]['lineHeight'] ) && is_array( $attr['occupationFont'][0]['lineHeight'] ) && isset( $attr['occupationFont'][0]['lineHeight'][1] ) && ! empty( $attr['occupationFont'][0]['lineHeight'][1] ) ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-occupation' );
			if ( isset( $attr['occupationFont'][0]['size'][1] ) && ! empty( $attr['occupationFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attr['occupationFont'][0]['size'][1] . ( ! isset( $attr['occupationFont'][0]['sizeType'] ) ? 'px' : $attr['occupationFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['occupationFont'][0]['lineHeight'][1] ) && ! empty( $attr['occupationFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['occupationFont'][0]['lineHeight'][1] . ( ! isset( $attr['occupationFont'][0]['lineType'] ) ? 'px' : $attr['occupationFont'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['occupationFont'] ) && is_array( $attr['occupationFont'] ) && isset( $attr['occupationFont'][0] ) && is_array( $attr['occupationFont'][0] ) && ( ( isset( $attr['occupationFont'][0]['size'] ) && is_array( $attr['occupationFont'][0]['size'] ) && isset( $attr['occupationFont'][0]['size'][2] ) && ! empty( $attr['occupationFont'][0]['size'][2] ) ) || ( isset( $attr['occupationFont'][0]['lineHeight'] ) && is_array( $attr['occupationFont'][0]['lineHeight'] ) && isset( $attr['occupationFont'][0]['lineHeight'][2] ) && ! empty( $attr['occupationFont'][0]['lineHeight'][2] ) ) ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kt-blocks-testimonials-wrap' . $unique_id . ' .kt-testimonial-occupation' );
			if ( isset( $attr['occupationFont'][0]['size'][2] ) && ! empty( $attr['occupationFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attr['occupationFont'][0]['size'][2] . ( ! isset( $attr['occupationFont'][0]['sizeType'] ) ? 'px' : $attr['occupationFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['occupationFont'][0]['lineHeight'][2] ) && ! empty( $attr['occupationFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['occupationFont'][0]['lineHeight'][2] . ( ! isset( $attr['occupationFont'][0]['lineType'] ) ? 'px' : $attr['occupationFont'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		return $css->css_output();
	}

	/**
	 * Grabs the Google Fonts that are needed so we can load in the head.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_advancedgallery_scripts_gfonts( $attr ) {
		if ( $this->it_is_not_amp() ) {
			if ( isset( $attr['type'] ) && ( 'carousel' === $attr['type'] || 'fluidcarousel' === $attr['type'] || 'slider' === $attr['type'] || 'thumbslider' === $attr['type'] ) ) {
				$this->enqueue_style( 'kadence-blocks-pro-slick' );
				$this->enqueue_script( 'kadence-blocks-slick-init' );
			} elseif ( ! isset( $attr['type'] ) || ( isset( $attr['type'] ) && 'masonry' === $attr['type'] ) ) {
				$this->enqueue_script( 'kadence-blocks-masonry-init' );
			}
			if ( isset( $attr['linkTo'] ) && 'media' === $attr['linkTo'] && isset( $attr['lightbox'] ) && ! empty( $attr['lightbox'] ) && 'magnific' === $attr['lightbox'] ) {
				// $this->enqueue_style( 'kadence-blocks-magnific-css' );
				// $this->enqueue_script( 'kadence-blocks-gallery-magnific-init' );
				$this->enqueue_style( 'kadence-simplelightbox-css' );
				$this->enqueue_script( 'kadence-blocks-simplelightbox-init' );
			}
		}
		if ( isset( $attr['captionStyles'] ) && is_array( $attr['captionStyles'] ) && isset( $attr['captionStyles'][0] ) && is_array( $attr['captionStyles'][0] ) && isset( $attr['captionStyles'][0]['google'] ) && $attr['captionStyles'][0]['google'] && ( ! isset( $attr['captionStyles'][0]['loadGoogle'] ) || true === $attr['captionStyles'][0]['loadGoogle'] ) && isset( $attr['captionStyles'][0]['family'] ) ) {
			$caption_font = $attr['captionStyles'][0];
			// Check if the font has been added yet
			if ( ! array_key_exists( $caption_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily' => $caption_font['family'],
					'fontvariants' => ( isset( $caption_font['variant'] ) && ! empty( $caption_font['variant'] ) ? array( $caption_font['variant'] ) : array() ),
					'fontsubsets' => ( isset( $caption_font['subset'] ) && ! empty( $caption_font['subset'] ) ? array( $caption_font['subset'] ) : array() ),
				);
				self::$gfonts[ $caption_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $caption_font['variant'], self::$gfonts[ $caption_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $caption_font['family'] ]['fontvariants'], $caption_font['variant'] );
				}
				if ( ! in_array( $caption_font['subset'], self::$gfonts[ $caption_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $caption_font['family'] ]['fontsubsets'], $caption_font['subset'] );
				}
			}
		}
	}
	/**
	 * Builds CSS for Gallery block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_advancedgallery_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['type'] ) && 'grid' === $attr['type'] && isset( $attr['displayShadow'] ) && ! empty( $attr['displayShadow'] ) && true === $attr['displayShadow'] ) {
			$css .= '.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id . ' {';
				$css .= 'overflow: visible;';
			$css .= '}';
		}
		if ( isset( $attr['gutter'] ) && is_array( $attr['gutter'] ) && isset( $attr['gutter'][0] ) && is_numeric( $attr['gutter'][0] ) ) {
			$css .= '.wp-block-kadence-advancedgallery ul.kb-gallery-id-' . $unique_id . ' {';
				$css .= 'margin: -' . ( $attr['gutter'][0] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item {';
				$css .= 'padding:' . ( $attr['gutter'][0] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init {';
				$css .= 'margin: 0 -' . ( $attr['gutter'][0] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kt-blocks-carousel-init:not(.slick-initialized) .kb-slide-item {';
				$css .= 'padding: 4px ' . ( $attr['gutter'][0] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item {';
				$css .= 'padding: 4px ' . ( $attr['gutter'][0] ) . 'px 4px 0;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev {';
				$css .= 'left:' . ( $attr['gutter'][0] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next {';
				$css .= 'right:' . ( $attr['gutter'][0] / 2 ) . 'px;';
			$css .= '}';
		}
		if ( isset( $attr['gutter'] ) && is_array( $attr['gutter'] ) && isset( $attr['gutter'][1] ) && is_numeric( $attr['gutter'][1] ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.wp-block-kadence-advancedgallery ul.kb-gallery-id-' . $unique_id . ' {';
				$css .= 'margin: -' . ( $attr['gutter'][1] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item {';
				$css .= 'padding:' . ( $attr['gutter'][1] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init {';
				$css .= 'margin: 0 -' . ( $attr['gutter'][1] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kt-blocks-carousel-init:not(.slick-initialized) .kb-slide-item {';
				$css .= 'padding: 4px ' . ( $attr['gutter'][1] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item {';
				$css .= 'padding: 4px ' . ( $attr['gutter'][1] ) . 'px 4px 0;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev {';
				$css .= 'left:' . ( $attr['gutter'][1] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next {';
				$css .= 'right:' . ( $attr['gutter'][1] / 2 ) . 'px;';
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['gutter'] ) && is_array( $attr['gutter'] ) && isset( $attr['gutter'][2] ) && is_numeric( $attr['gutter'][2] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.wp-block-kadence-advancedgallery ul.kb-gallery-id-' . $unique_id . ' {';
				$css .= 'margin: -' . ( $attr['gutter'][2] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item {';
				$css .= 'padding:' . ( $attr['gutter'][2] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init {';
				$css .= 'margin: 0 -' . ( $attr['gutter'][2] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .kb-slide-item, .kt-blocks-carousel-init:not(.slick-initialized) .kb-slide-item {';
				$css .= 'padding: 4px ' . ( $attr['gutter'][2] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-fluidcarousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init.kb-carousel-mode-align-left .kb-slide-item {';
				$css .= 'padding: 4px ' . ( $attr['gutter'][2] ) . 'px 4px 0;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-prev {';
				$css .= 'left:' . ( $attr['gutter'][2] / 2 ) . 'px;';
			$css .= '}';
			$css .= '.kb-gallery-type-carousel.kb-gallery-id-' . $unique_id . ' .kt-blocks-carousel .kt-blocks-carousel-init .slick-next {';
				$css .= 'right:' . ( $attr['gutter'][2] / 2 ) . 'px;';
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['type'] ) && 'fluidcarousel' === $attr['type'] && isset( $attr['carouselHeight'] ) && is_array( $attr['carouselHeight'] ) ) {
			if ( isset( $attr['carouselHeight'][0] ) && is_numeric( $attr['carouselHeight'][0] ) ) {
				$css .= '.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius img {';
				$css .= 'height:' . $attr['carouselHeight'][0] . 'px;';
				$css .= '}';
			}
			if ( isset( $attr['carouselHeight'][1] ) && is_numeric( $attr['carouselHeight'][1] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius img {';
				$css .= 'height:' . $attr['carouselHeight'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $attr['carouselHeight'][2] ) && is_numeric( $attr['carouselHeight'][2] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius img {';
				$css .= 'height:' . $attr['carouselHeight'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['type'] ) && 'tiles' === $attr['type'] && isset( $attr['carouselHeight'] ) && is_array( $attr['carouselHeight'] ) ) {
			if ( isset( $attr['carouselHeight'][0] ) && is_numeric( $attr['carouselHeight'][0] ) ) {
				$css .= '.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles > .kadence-blocks-gallery-item {';
				$css .= 'height:' . $attr['carouselHeight'][0] . 'px;';
				$css .= '}';
			}
			if ( isset( $attr['carouselHeight'][1] ) && is_numeric( $attr['carouselHeight'][1] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles > .kadence-blocks-gallery-item {';
				$css .= 'height:' . $attr['carouselHeight'][1] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $attr['carouselHeight'][2] ) && is_numeric( $attr['carouselHeight'][2] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img, .kb-gallery-id-' . $unique_id . '.kb-gallery-ul.kb-gallery-type-tiles > .kadence-blocks-gallery-item {';
				$css .= 'height:' . $attr['carouselHeight'][2] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['margin'] ) && is_array( $attr['margin'] ) && is_array( $attr['margin'][0] ) ) {
			$margin = $attr['margin'][0];
			if ( isset( $margin['desk'] ) && is_array( $margin['desk'] ) && is_numeric( $margin['desk'][0] ) ) {
				$css .= '.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id . ' {';
				$css .= 'margin:' . $margin['desk'][0] . 'px ' . $margin['desk'][1] . 'px ' . $margin['desk'][2] . 'px ' . $margin['desk'][3] . 'px;';
				$css .= '}';
			}
			if ( isset( $margin['tablet'] ) && is_array( $margin['tablet'] ) && is_numeric( $margin['tablet'][0] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id . ' {';
				$css .= 'margin:' . $margin['tablet'][0] . 'px ' . $margin['tablet'][1] . 'px ' . $margin['tablet'][2] . 'px ' . $margin['tablet'][3] . 'px;';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $margin['mobile'] ) && is_array( $margin['mobile'] ) && is_numeric( $margin['mobile'][0] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-' . $unique_id . ' {';
				$css .= 'margin:' . $margin['mobile'][0] . 'px ' . $margin['mobile'][1] . 'px ' . $margin['mobile'][2] . 'px ' . $margin['mobile'][3] . 'px;';
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['imageRadius'] ) && is_array( $attr['imageRadius'] ) && isset( $attr['imageRadius'][0] ) && is_numeric( $attr['imageRadius'][0] ) ) {
			$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kb-gal-image-radius {';
			$css .= 'border-radius: ' . $attr['imageRadius'][0] . 'px ' . ( is_numeric( $attr['imageRadius'][1] ) ? $attr['imageRadius'][1] : 0 ) . 'px ' . ( is_numeric( $attr['imageRadius'][2] ) ? $attr['imageRadius'][2] : 0 ) . 'px ' . ( is_numeric( $attr['imageRadius'][3] ) ? $attr['imageRadius'][3] : 0 ) . 'px;';
			$css .= '}';
		}
		if ( isset( $attr['displayShadow'] ) && ! empty( $attr['displayShadow'] ) && true === $attr['displayShadow'] ) {
			if ( isset( $attr['shadow'] ) && is_array( $attr['shadow'] ) && is_array( $attr['shadow'][ 0 ] ) ) {
				$shadow = $attr['shadow'][ 0 ];
				$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kb-gal-image-radius {';
				$css .= 'box-shadow:' . $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $this->hex2rgba( $shadow['color'], $shadow['opacity'] ) . ';';
				$css .= '}';
			}
			if ( isset( $attr['shadowHover'] ) && is_array( $attr['shadowHover'] ) && is_array( $attr['shadowHover'][ 0 ] ) ) {
				$shadow_hover = $attr['shadowHover'][ 0 ];
				$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item:hover .kb-gal-image-radius {';
				$css .= 'box-shadow:' . $shadow_hover['hOffset'] . 'px ' . $shadow_hover['vOffset'] . 'px ' . $shadow_hover['blur'] . 'px ' . $shadow_hover['spread'] . 'px ' . $this->hex2rgba( $shadow_hover['color'], $shadow_hover['opacity'] ) . ';';
				$css .= '}';
			} else {
				$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item:hover .kb-gal-image-radius {';
				$css .= 'box-shadow:4px 2px 14px 0px rgba(0,0,0,0.2);';
				$css .= '}';
			}
		}
		if ( isset( $attr['showCaption'] ) && true === $attr['showCaption'] && isset( $attr['captionStyles'] ) && is_array( $attr['captionStyles'] ) && is_array( $attr['captionStyles'][0] ) ) {
			$caption_font = $attr['captionStyles'][0];
			$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption {';
			if ( isset( $caption_font['color'] ) && ! empty( $caption_font['color'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $caption_font['color'] ) . ';';
			}
			if ( isset( $caption_font['background'] ) && ! empty( $caption_font['background'] ) ) {
				$css .= 'background:linear-gradient( 0deg, ' . $this->kadence_color_output( $caption_font['background'], ( isset( $caption_font['backgroundOpacity'] ) && is_numeric(  $caption_font['backgroundOpacity'] ) ) ?  $caption_font['backgroundOpacity'] : '0.5' ) . ' 0, ' . $this->kadence_color_output( $caption_font['background'], 0 ) . ' 100% );';
			}
			if ( isset( $caption_font['size'] ) && is_array( $caption_font['size'] ) && ! empty( $caption_font['size'][0] ) ) {
				$css .= 'font-size:' . $caption_font['size'][0] . ( ! isset( $caption_font['sizeType'] ) ? 'px' : $caption_font['sizeType'] ) . ';';
			}
			if ( isset( $caption_font['lineHeight'] ) && is_array( $caption_font['lineHeight'] ) && ! empty( $caption_font['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $caption_font['lineHeight'][0] . ( ! isset( $caption_font['lineType'] ) ? 'px' : $caption_font['lineType'] ) . ';';
			}
			if ( isset( $caption_font['letterSpacing'] ) && ! empty( $caption_font['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $caption_font['letterSpacing'] . 'px;';
			}
			if ( isset( $caption_font['textTransform'] ) && ! empty( $caption_font['textTransform'] ) ) {
				$css .= 'text-transform:' . $caption_font['textTransform'] . ';';
			}
			if ( isset( $caption_font['family'] ) && ! empty( $caption_font['family'] ) ) {
				$css .= 'font-family:' . $caption_font['family'] . ';';
			}
			if ( isset( $caption_font['style'] ) && ! empty( $caption_font['style'] ) ) {
				$css .= 'font-style:' . $caption_font['style'] . ';';
			}
			if ( isset( $caption_font['weight'] ) && ! empty( $caption_font['weight'] ) ) {
				$css .= 'font-weight:' . $caption_font['weight'] . ';';
			}
			$css .= '}';
			if ( isset( $caption_font['background'] ) && ! empty( $caption_font['background'] ) ) {
				$css .= '.kb-gallery-caption-style-cover-hover.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption, .kb-gallery-caption-style-below.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption {';
				$css .= 'background:' . $this->kadence_color_output( $caption_font['background'], ( isset( $caption_font['backgroundOpacity'] ) && is_numeric(  $caption_font['backgroundOpacity'] ) ) ?  $caption_font['backgroundOpacity'] : '0.5' ) . ';';
				$css .= '}';
			}
		}
		if ( isset( $attr['showCaption'] ) && true === $attr['showCaption'] && isset( $attr['captionStyles'] ) && is_array( $attr['captionStyles'] ) && isset( $attr['captionStyles'][0] ) && is_array( $attr['captionStyles'][0] ) && ( ( isset( $attr['captionStyles'][0]['size'] ) && is_array( $attr['captionStyles'][0]['size'] ) && isset( $attr['captionStyles'][0]['size'][1] ) && ! empty( $attr['captionStyles'][0]['size'][1] ) ) || ( isset( $attr['captionStyles'][0]['lineHeight'] ) && is_array( $attr['captionStyles'][0]['lineHeight'] ) && isset( $attr['captionStyles'][0]['lineHeight'][1] ) && ! empty( $attr['captionStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption {';
			if ( isset( $attr['captionStyles'][0]['size'][1] ) && ! empty( $attr['captionStyles'][0]['size'][1] ) ) {
				$css .= 'font-size:' . $attr['captionStyles'][0]['size'][1] . ( ! isset( $attr['captionStyles'][0]['sizeType'] ) ? 'px' : $attr['captionStyles'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['captionStyles'][0]['lineHeight'][1] ) && ! empty( $attr['captionStyles'][0]['lineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['captionStyles'][0]['lineHeight'][1] . ( ! isset( $attr['captionStyles'][0]['lineType'] ) ? 'px' : $attr['captionStyles'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['showCaption'] ) && true === $attr['showCaption'] && isset( $attr['captionStyles'] ) && is_array( $attr['captionStyles'] ) && isset( $attr['captionStyles'][0] ) && is_array( $attr['captionStyles'][0] ) && ( ( isset( $attr['captionStyles'][0]['size'] ) && is_array( $attr['captionStyles'][0]['size'] ) && isset( $attr['captionStyles'][0]['size'][2] ) && ! empty( $attr['captionStyles'][0]['size'][2] ) ) || ( isset( $attr['captionStyles'][0]['lineHeight'] ) && is_array( $attr['captionStyles'][0]['lineHeight'] ) && isset( $attr['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attr['captionStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kb-gallery-id-' . $unique_id . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption {';
			if ( isset( $attr['captionStyles'][0]['size'][2] ) && ! empty( $attr['captionStyles'][0]['size'][2] ) ) {
				$css .= 'font-size:' . $attr['captionStyles'][0]['size'][2] . ( ! isset( $attr['captionStyles'][0]['sizeType'] ) ? 'px' : $attr['captionStyles'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attr['captionStyles'][0]['lineHeight'][2] ) ) {
				$css .= 'line-height:' . $attr['captionStyles'][0]['lineHeight'][2] . ( ! isset( $attr['captionStyles'][0]['lineType'] ) ? 'px' : $attr['captionStyles'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}

		return $css;
	}
	/**
	 * Builds CSS for Icon List block.
	 *
	 * @param array  $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_iconlist_array( $attr, $unique_id ) {
		$css = '';
		if ( isset( $attr['listMargin'] ) && is_array( $attr['listMargin'] ) && isset( $attr['listMargin'][0] ) ) {
			$css .= '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ':not(.this-stops-third-party-issues) {';
				$css .= 'margin-top:0';
			$css .= '}';
			$css .= '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list {';
				$css .= 'margin:' . $attr['listMargin'][0] . 'px ' . $attr['listMargin'][1] . 'px ' . $attr['listMargin'][2] . 'px ' . $attr['listMargin'][3] . 'px;';
			$css .= '}';
		}
		if ( isset( $attr['listGap'] ) && ! empty( $attr['listGap'] ) ) {
			$css .= '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap:not(:last-child) {';
				$css .= 'margin-bottom:' . $attr['listGap'] . 'px;';
			$css .= '}';
			$css .= '.kt-svg-icon-list-columns-2.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list {';
				$css .= 'grid-row-gap:' . $attr['listGap'] . 'px;';
			$css .= '}';
			$css .= '.kt-svg-icon-list-columns-2.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap {';
				$css .= 'margin:0px;';
			$css .= '}';
		}
		if ( isset( $attr['listLabelGap'] ) && ! empty( $attr['listLabelGap'] ) ) {
			$css .= '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap .kt-svg-icon-list-single {';
				$css .= 'margin-right:' . $attr['listLabelGap'] . 'px;';
			$css .= '}';
		}
		if ( isset( $attr['listStyles'] ) && is_array( $attr['listStyles'] ) && is_array( $attr['listStyles'][ 0 ] ) ) {
			$list_styles = $attr['listStyles'][ 0 ];
			$css .= '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap, .kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap a {';
			if ( isset( $list_styles['color'] ) && ! empty( $list_styles['color'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $list_styles['color'] ) .  ';';
			}
			if ( isset( $list_styles['size'] ) && is_array( $list_styles['size'] ) && ! empty( $list_styles['size'][0] ) ) {
				$css .= 'font-size:' . $list_styles['size'][0] . ( ! isset( $list_styles['sizeType'] ) ? 'px' : $list_styles['sizeType'] ) . ';';
			}
			if ( isset( $list_styles['lineHeight'] ) && is_array( $list_styles['lineHeight'] ) && ! empty( $list_styles['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $list_styles['lineHeight'][0] . ( ! isset( $list_styles['lineType'] ) ? 'px' : $list_styles['lineType'] ) . ';';
			}
			if ( isset( $list_styles['letterSpacing'] ) && ! empty( $list_styles['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $list_styles['letterSpacing'] .  'px;';
			}
			if ( isset( $list_styles['textTransform'] ) && ! empty( $list_styles['textTransform'] ) ) {
				$css .= 'text-transform:' . $list_styles['textTransform'] .  ';';
			}
			if ( isset( $list_styles['family'] ) && ! empty( $list_styles['family'] ) ) {
				$css .= 'font-family:' . $list_styles['family'] .  ';';
			}
			if ( isset( $list_styles['style'] ) && ! empty( $list_styles['style'] ) ) {
				$css .= 'font-style:' . $list_styles['style'] .  ';';
			}
			if ( isset( $list_styles['weight'] ) && ! empty( $list_styles['weight'] ) ) {
				$css .= 'font-weight:' . $list_styles['weight'] .  ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['listStyles'] ) && is_array( $attr['listStyles'] ) && isset( $attr['listStyles'][0] ) && is_array( $attr['listStyles'][0] ) && ( ( isset( $attr['listStyles'][0]['size'] ) && is_array( $attr['listStyles'][0]['size'] ) && isset( $attr['listStyles'][0]['size'][1] ) && ! empty( $attr['listStyles'][0]['size'][1] ) ) || ( isset( $attr['listStyles'][0]['lineHeight'] ) && is_array( $attr['listStyles'][0]['lineHeight'] ) && isset( $attr['listStyles'][0]['lineHeight'][1] ) && ! empty( $attr['listStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap {';
			if ( isset( $attr['listStyles'][0]['size'][1] ) && ! empty( $attr['listStyles'][0]['size'][1] ) ) {
				$css .= 'font-size:' . $attr['listStyles'][0]['size'][1] . ( ! isset( $attr['listStyles'][0]['sizeType'] ) ? 'px' : $attr['listStyles'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['listStyles'][0]['lineHeight'][1] ) && ! empty( $attr['listStyles'][0]['lineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['listStyles'][0]['lineHeight'][1] . ( ! isset( $attr['listStyles'][0]['lineType'] ) ? 'px' : $attr['listStyles'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['listStyles'] ) && is_array( $attr['listStyles'] ) && isset( $attr['listStyles'][0] ) && is_array( $attr['listStyles'][0] ) && ( ( isset( $attr['listStyles'][0]['size'] ) && is_array( $attr['listStyles'][0]['size'] ) && isset( $attr['listStyles'][0]['size'][2] ) && ! empty( $attr['listStyles'][0]['size'][2] ) ) || ( isset( $attr['listStyles'][0]['lineHeight'] ) && is_array( $attr['listStyles'][0]['lineHeight'] ) && isset( $attr['listStyles'][0]['lineHeight'][2] ) && ! empty( $attr['listStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap {';
				if ( isset( $attr['listStyles'][0]['size'][2] ) && ! empty( $attr['listStyles'][0]['size'][2] ) ) {
					$css .= 'font-size:' . $attr['listStyles'][0]['size'][2] . ( ! isset( $attr['listStyles'][0]['sizeType'] ) ? 'px' : $attr['listStyles'][0]['sizeType'] ) . ';';
				}
				if ( isset( $attr['listStyles'][0]['lineHeight'][2] ) && ! empty( $attr['listStyles'][0]['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $attr['listStyles'][0]['lineHeight'][2] . ( ! isset( $attr['listStyles'][0]['lineType'] ) ? 'px' : $attr['listStyles'][0]['lineType'] ) . ';';
				}
			$css .= '}';
			$css .= '}';
		}
		return $css;
	}
	/**
	 * Adds Scripts for row block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function render_row_layout_scripts( $attr ) {
		if ( ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] ) || ( isset( $attr['overlayBgImg'] ) && ! empty( $attr['overlayBgImg']) && isset( $attr['overlayBgImgAttachment'] ) && 'parallax' === $attr['overlayBgImgAttachment'] ) ) {
			$this->enqueue_script( 'kadence-blocks-parallax-js' );
		}
		if ( isset( $attr['backgroundSettingTab'] ) && 'slider' === $attr['backgroundSettingTab'] ) {
			$this->enqueue_style( 'kadence-blocks-pro-slick' );
			$this->enqueue_script( 'kadence-blocks-slick-init' );
		}
		if ( isset( $attr['backgroundSettingTab'] ) && 'video' === $attr['backgroundSettingTab'] && isset( $attr['backgroundVideo'] ) && isset( $attr['backgroundVideo'][0] ) && isset( $attr['backgroundVideo'][0]['btns'] ) && true === $attr['backgroundVideo'][0]['btns'] ) {
			$this->enqueue_script( 'kadence-blocks-video-bg' );
		}
	}
	/**
	 * Adds Scripts and Google fonts for Tabs block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_tabs_scripts_gfonts( $attr ) {
		if ( $this->it_is_not_amp() ) {
			$this->enqueue_script( 'kadence-blocks-tabs-js' );
		}
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
		if ( isset( $attr['subtitleFont'] ) && is_array( $attr['subtitleFont'] ) && isset( $attr['subtitleFont'][0] ) && is_array( $attr['subtitleFont'][0] ) && isset( $attr['subtitleFont'][0]['google'] ) && $attr['subtitleFont'][0]['google'] && ( ! isset( $attr['subtitleFont'][0]['loadGoogle'] ) || true === $attr['subtitleFont'][0]['loadGoogle'] ) && isset( $attr['subtitleFont'][0]['family'] ) ) {
			$subtitle_font = $attr['subtitleFont'][0];
			// Check if the font has been added yet.
			if ( ! array_key_exists( $subtitle_font['family'], self::$gfonts ) ) {
				$add_font = array(
					'fontfamily'   => $subtitle_font['family'],
					'fontvariants' => ( isset( $subtitle_font['variant'] ) && ! empty( $subtitle_font['variant'] ) ? array( $subtitle_font['variant'] ) : array() ),
					'fontsubsets'  => ( isset( $subtitle_font['subset'] ) && ! empty( $subtitle_font['subset'] ) ? array( $subtitle_font['subset'] ) : array() ),
				);
				self::$gfonts[ $subtitle_font['family'] ] = $add_font;
			} else {
				if ( ! in_array( $subtitle_font['variant'], self::$gfonts[ $subtitle_font['family'] ]['fontvariants'], true ) ) {
					array_push( self::$gfonts[ $subtitle_font['family'] ]['fontvariants'], $subtitle_font['variant'] );
				}
				if ( ! in_array( $subtitle_font['subset'], self::$gfonts[ $subtitle_font['family'] ]['fontsubsets'], true ) ) {
					array_push( self::$gfonts[ $subtitle_font['family'] ]['fontsubsets'], $subtitle_font['subset'] );
				}
			}
		}
	}
	/**
	 * Adds Scripts and Google fonts for Accordion block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_accordion_scripts_gfonts( $attr ) {
		$this->enqueue_script( 'kadence-blocks-accordion-js' );
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
				$css .= 'border-color:' . $this->kadence_color_output( $attr['contentBorderColor'] ) . ';';
			}
			if ( isset( $attr['contentBorderRadius'] ) && ! empty( $attr['contentBorderRadius'] ) ) {
				$css .= 'border-radius:' . $attr['contentBorderRadius'][ 0 ] . 'px ' . $attr['contentBorderRadius'][ 1 ] . 'px ' . $attr['contentBorderRadius'][ 2 ] . 'px ' . $attr['contentBorderRadius'][ 3 ] . 'px;';
			}
			if ( isset( $attr['contentBgColor'] ) && ! empty( $attr['contentBgColor'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $attr['contentBgColor'] ) . ';';
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
			$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-blocks-accordion-header {';
			if ( isset( $title_styles['color'] ) && ! empty( $title_styles['color'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $title_styles['color'] ) .  ';';
			}
			if ( isset( $title_styles['background'] ) && ! empty( $title_styles['background'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $title_styles['background'] ) .  ';';
			}
			if ( isset( $title_styles['border'] ) && is_array( $title_styles['border'] ) && ! empty( $title_styles['border'][ 0 ] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $title_styles['border'][0] ) . ' ' . $this->kadence_color_output( $title_styles['border'][1] ) . ' ' . $this->kadence_color_output( $title_styles['border'][2] ) . ' ' . $this->kadence_color_output( $title_styles['border'][3] ) . ';';
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
			if ( isset( $title_styles['textTransform'] ) && ! empty( $title_styles['textTransform'] ) ) {
				$css .= 'text-transform:' . $title_styles['textTransform'] .  ';';
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
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( $title_styles['color'] ) .  ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger {';
					$css .= 'background:' . $this->kadence_color_output( $title_styles['color'] ) .  ';';
				$css .= '}';
			}
			if ( isset( $title_styles['background'] ) && ! empty( $title_styles['background'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:before {';
					$css .= 'background:' . $this->kadence_color_output( $title_styles['background'] ) .  ';';
				$css .= '}';
			}
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header:hover, .kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header:focus {';
			if ( isset( $title_styles['colorHover'] ) && ! empty( $title_styles['colorHover'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $title_styles['colorHover'] ) .  ';';
			}
			if ( isset( $title_styles['backgroundHover'] ) && ! empty( $title_styles['backgroundHover'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundHover'] ) .  ';';
			}
			if ( isset( $title_styles['borderHover'] ) && is_array( $title_styles['borderHover'] ) && ! empty( $title_styles['borderHover'][0] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $title_styles['borderHover'][0] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][1] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][2] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][3] ) . ';';
			}
			$css .= '}';
			if ( isset( $title_styles['colorHover'] ) && ! empty( $title_styles['colorHover'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( $title_styles['colorHover'] ) .  ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger {';
					$css .= 'background:' . $this->kadence_color_output( $title_styles['colorHover'] ) .  ';';
				$css .= '}';
			}
			if ( isset( $title_styles['backgroundHover'] ) && ! empty( $title_styles['backgroundHover'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:before {';
					$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundHover'] ) .  ';';
				$css .= '}';
			}
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header.kt-accordion-panel-active {';
			if ( isset( $title_styles['colorActive'] ) && ! empty( $title_styles['colorActive'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $title_styles['colorActive'] ) .  ';';
			}
			if ( isset( $title_styles['backgroundActive'] ) && ! empty( $title_styles['backgroundActive'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundActive'] ) .  ';';
			}
			if ( isset( $title_styles['borderActive'] ) && is_array( $title_styles['borderActive'] ) && ! empty( $title_styles['borderActive'][0] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $title_styles['borderActive'][0] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][1] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][2] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][3] ) . ';';
			}
			$css .= '}';
			if ( isset( $title_styles['colorActive'] ) && ! empty( $title_styles['colorActive'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( $title_styles['colorActive'] ) .  ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger {';
					$css .= 'background:' . $this->kadence_color_output( $title_styles['colorActive'] ) .  ';';
				$css .= '}';
			}
			if ( isset( $title_styles['backgroundActive'] ) && ! empty( $title_styles['backgroundActive'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before {';
					$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundActive'] ) .  ';';
				$css .= '}';
			}
		}
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && isset( $attr['titleStyles'][0] ) && is_array( $attr['titleStyles'][0] ) && ( ( isset( $attr['titleStyles'][0]['size'] ) && is_array( $attr['titleStyles'][0]['size'] ) && isset( $attr['titleStyles'][0]['size'][1] ) && ! empty( $attr['titleStyles'][0]['size'][1] ) ) || ( isset( $attr['titleStyles'][0]['lineHeight'] ) && is_array( $attr['titleStyles'][0]['lineHeight'] ) && isset( $attr['titleStyles'][0]['lineHeight'][1] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
			$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-blocks-accordion-header {';
			if ( isset( $attr['titleStyles'][0]['size'][1] ) && ! empty( $attr['titleStyles'][0]['size'][1] ) ) {
				$css .= 'font-size:' . $attr['titleStyles'][0]['size'][1] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
			}
			if ( isset( $attr['titleStyles'][0]['lineHeight'][1] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][1] ) ) {
				$css .= 'line-height:' . $attr['titleStyles'][0]['lineHeight'][1] . ( ! isset( $attr['titleStyles'][0]['lineType'] ) ? 'px' : $attr['titleStyles'][0]['lineType'] ) . ';';
			}
			$css .= '}';
			$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
				$css .= 'width:' . $attr['titleStyles'][0]['size'][1] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
				$css .= 'height:' . $attr['titleStyles'][0]['size'][1] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && isset( $attr['titleStyles'][0] ) && is_array( $attr['titleStyles'][0] ) && ( ( isset( $attr['titleStyles'][0]['size'] ) && is_array( $attr['titleStyles'][0]['size'] ) && isset( $attr['titleStyles'][0]['size'][2] ) && ! empty( $attr['titleStyles'][0]['size'][2] ) ) || ( isset( $attr['titleStyles'][0]['lineHeight'] ) && is_array( $attr['titleStyles'][0]['lineHeight'] ) && isset( $attr['titleStyles'][0]['lineHeight'][2] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-blocks-accordion-header {';
				if ( isset( $attr['titleStyles'][0]['size'][2] ) && ! empty( $attr['titleStyles'][0]['size'][2] ) ) {
					$css .= 'font-size:' . $attr['titleStyles'][0]['size'][2] . ( ! isset( $attr['titleStyles'][0]['sizeType'] ) ? 'px' : $attr['titleStyles'][0]['sizeType'] ) . ';';
				}
				if ( isset( $attr['titleStyles'][0]['lineHeight'][2] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][2] ) ) {
					$css .= 'line-height:' . $attr['titleStyles'][0]['lineHeight'][2] . ( ! isset( $attr['titleStyles'][0]['lineType'] ) ? 'px' : $attr['titleStyles'][0]['lineType'] ) . ';';
				}
			$css .= '}';
			$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
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
		$css                    = new Kadence_Blocks_CSS();
		$media_query            = array();
		$media_query['mobile']  = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['tablet']  = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['desktop'] = apply_filters( 'kadence_tablet_media_query', '(min-width: 1025px)' );
		// Style.
		if ( isset( $attr['size'] ) || isset( $attr['lineHeight'] ) || isset( $attr['typography'] ) || isset( $attr['fontWeight'] ) || isset( $attr['fontStyle'] ) || isset( $attr['textTransform'] ) || isset( $attr['letterSpacing'] ) || isset( $attr['color'] ) || isset( $attr['topMargin'] ) || isset( $attr['rightMargin'] ) || isset( $attr['bottomMargin'] ) || isset( $attr['leftMargin'] ) || isset( $attr['textShadow'] ) || isset( $attr['align'] ) || isset( $attr['padding'] ) ) {
			$css->set_selector( '#kt-adv-heading' . $unique_id . ', #kt-adv-heading' . $unique_id . ' .wp-block-kadence-advancedheading, .wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"], .kadence-advanced-heading-wrapper .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );
			if ( isset( $attr['align'] ) && ! empty( $attr['align'] ) ) {
				$css->add_property( 'text-align', $attr['align'] );
			}
			if ( isset( $attr['size'] ) && ! empty( $attr['size'] ) ) {
				$css->add_property( 'font-size', $attr['size'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) );
			}
			if ( isset( $attr['lineHeight'] ) && ! empty( $attr['lineHeight'] ) ) {
				$css->add_property( 'line-height', $attr['lineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) );
			}
			if ( isset( $attr['fontWeight'] ) && ! empty( $attr['fontWeight'] ) ) {
				$css->add_property( 'font-weight', $attr['fontWeight'] );
			}
			if ( isset( $attr['fontStyle'] ) && ! empty( $attr['fontStyle'] ) ) {
				$css->add_property( 'font-style', $attr['fontStyle'] );
			}
			if ( isset( $attr['typography'] ) && ! empty( $attr['typography'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $attr['typography'] ) );
			}
			if ( isset( $attr['textTransform'] ) && ! empty( $attr['textTransform'] ) ) {
				$css->add_property( 'text-transform', $attr['textTransform'] );
			}
			if ( isset( $attr['letterSpacing'] ) && ! empty( $attr['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $attr['letterSpacing'] . ( ! isset( $attr['letterType'] ) ? 'px' : $attr['letterType'] ) );
			}
			if ( isset( $attr['color'] ) && ! empty( $attr['color'] ) ) {
				if ( isset( $attr['colorClass'] ) && empty( $attr['colorClass'] ) || ! isset( $attr['colorClass'] ) ) {
					$css->add_property( 'color', $css->render_color( $attr['color'] ) );
				}
			}
			if ( isset( $attr['textShadow'] ) && is_array( $attr['textShadow'] ) && isset( $attr['textShadow'][0] ) && is_array( $attr['textShadow'][0] ) && isset( $attr['textShadow'][0]['enable'] ) && $attr['textShadow'][0]['enable'] ) {
				$css->add_property( 'text-shadow', ( isset( $attr['textShadow'][0]['hOffset'] ) ? $attr['textShadow'][0]['hOffset'] : 1 ) . 'px ' . ( isset( $attr['textShadow'][0]['vOffset'] ) ? $attr['textShadow'][0]['vOffset'] : 1 ) . 'px ' . ( isset( $attr['textShadow'][0]['blur'] ) ? $attr['textShadow'][0]['blur'] : 1 ) . 'px ' . ( isset( $attr['textShadow'][0]['color'] ) ? $this->kadence_color_output( $attr['textShadow'][0]['color'] ) : 'rgba(0,0,0,0.2)' ) );
			}
			if ( isset( $attr['topMargin'] ) && is_numeric( $attr['topMargin'] ) ) {
				$css->add_property( 'margin-top', $attr['topMargin'] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['rightMargin'] ) && is_numeric( $attr['rightMargin'] ) ) {
				$css->add_property( 'margin-right', $attr['rightMargin'] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['bottomMargin'] ) && is_numeric( $attr['bottomMargin'] ) ) {
				$css->add_property( 'margin-bottom', $attr['bottomMargin'] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['leftMargin'] ) && is_numeric( $attr['leftMargin'] ) ) {
				$css->add_property( 'margin-left', $attr['leftMargin'] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['padding'] ) && is_array( $attr['padding'] ) && isset( $attr['padding'][0] ) && is_numeric( $attr['padding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['padding'][0] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['padding'] ) && is_array( $attr['padding'] ) && isset( $attr['padding'][1] ) && is_numeric( $attr['padding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['padding'][1] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['padding'] ) && is_array( $attr['padding'] ) && isset( $attr['padding'][2] ) && is_numeric( $attr['padding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['padding'][2] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['padding'] ) && is_array( $attr['padding'] ) && isset( $attr['padding'][3] ) && is_numeric( $attr['padding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['padding'][3] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
		}
		// Highlight.
		if ( isset( $attr['markBorder'] ) || isset( $attr['markBorderWidth'] ) || isset( $attr['markBorderStyle'] ) || isset( $attr['markPadding'] ) || isset( $attr['markLetterSpacing'] ) || isset( $attr['markSize'] ) || isset( $attr['markLineHeight'] ) || isset( $attr['markTypography'] ) || isset( $attr['markColor'] ) || isset( $attr['markBG'] ) || isset( $attr['markTextTransform'] ) ) {
			$css->set_selector( '#kt-adv-heading' . $unique_id . ' mark, #kt-adv-heading' . $unique_id . ' .wp-block-kadence-advancedheading mark, .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] mark' );
			if ( isset( $attr['markLetterSpacing'] ) && ! empty( $attr['markLetterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $attr['markLetterSpacing'] . ( ! isset( $attr['markLetterType'] ) ? 'px' : $attr['markLetterType'] ) );
			}
			if ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][0] ) ) {
				$css->add_property( 'font-size', $attr['markSize'][0] . ( ! isset( $attr['markSizeType'] ) ? 'px' : $attr['markSizeType'] ) );
			}
			if ( isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][0] ) ) {
				$css->add_property( 'line-height', $attr['markLineHeight'][0] . ( ! isset( $attr['markLineType'] ) ? 'px' : $attr['markLineType'] ) );
			}
			if ( isset( $attr['markTypography'] ) && ! empty( $attr['markTypography'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $attr['markTypography'] ) );
			}
			if ( isset( $attr['markFontWeight'] ) && ! empty( $attr['markFontWeight'] ) ) {
				$css->add_property( 'font-weight', $attr['markFontWeight'] );
			}
			if ( isset( $attr['markFontStyle'] ) && ! empty( $attr['markFontStyle'] ) ) {
				$css->add_property( 'font-style', $attr['markFontStyle'] );
			}
			if ( isset( $attr['markColor'] ) && ! empty( $attr['markColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attr['markColor'] ) );
			}
			if ( isset( $attr['markTextTransform'] ) && ! empty( $attr['markTextTransform'] ) ) {
				$css->add_property( 'text-transform', $attr['markTextTransform'] );
			}
			if ( isset( $attr['markBG'] ) && ! empty( $attr['markBG'] ) ) {
				$alpha = ( isset( $attr['markBGOpacity'] ) && ! empty( $attr['markBGOpacity'] ) ? $attr['markBGOpacity'] : 1 );
				$css->add_property( 'background', $css->render_color( $attr['markBG'], $alpha ) );
			}
			if ( isset( $attr['markBorder'] ) && ! empty( $attr['markBorder'] ) ) {
				$alpha = ( isset( $attr['markBorderOpacity'] ) && ! empty( $attr['markBorderOpacity'] ) ? $attr['markBorderOpacity'] : 1 );
				$css->add_property( 'border-color', $css->render_color( $attr['markBorder'], $alpha ) );
			}
			if ( isset( $attr['markBorderWidth'] ) && ! empty( $attr['markBorderWidth'] ) ) {
				$css->add_property( 'border-width', $attr['markBorderWidth'] . 'px' );
			}
			if ( isset( $attr['markBorderStyle'] ) && ! empty( $attr['markBorderStyle'] ) ) {
				$css->add_property( 'border-style', $attr['markBorderStyle'] );
			}
			if ( isset( $attr['markPadding'] ) && is_array( $attr['markPadding'] ) ) {
				$css->add_property( 'padding', ( isset( $attr['markPadding'][0] ) ? $attr['markPadding'][0] . 'px' : 0 ) . ' ' . ( isset( $attr['markPadding'][1] ) ? $attr['markPadding'][1] . 'px' : 0 ) . ' ' . ( isset( $attr['markPadding'][2] ) ? $attr['markPadding'][2] . 'px' : 0 ) . ' ' . ( isset( $attr['markPadding'][3] ) ? $attr['markPadding'][3] . 'px' : 0 ) );
			}
		}
		if ( isset( $attr['tabSize'] ) || isset( $attr['tabLineHeight'] ) || isset( $attr['tabletAlign'] ) || isset( $attr['tabletMargin'] ) || isset( $attr['tabletPadding'] ) ) {
			// Tablet.
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '#kt-adv-heading' . $unique_id . ', #kt-adv-heading' . $unique_id . ' .wp-block-kadence-advancedheading, .wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"], .kadence-advanced-heading-wrapper .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );
			if ( isset( $attr['tabSize'] ) && is_numeric( $attr['tabSize'] ) ) {
				$css->add_property( 'font-size', $attr['tabSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) );
			}
			if ( isset( $attr['tabLineHeight'] ) && is_numeric( $attr['tabLineHeight'] ) ) {
				$css->add_property( 'line-height', $attr['tabLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) );
			}
			if ( isset( $attr['tabletAlign'] ) && ! empty( $attr['tabletAlign'] ) ) {
				$css->add_property( 'text-align', $attr['tabletAlign'] . '!important' );
			}
			if ( isset( $attr['tabletPadding'] ) && is_array( $attr['tabletPadding'] ) && isset( $attr['tabletPadding'][0] ) && is_numeric( $attr['tabletPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['tabletPadding'][0] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['tabletPadding'] ) && is_array( $attr['tabletPadding'] ) && isset( $attr['tabletPadding'][1] ) && is_numeric( $attr['tabletPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['tabletPadding'][1] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['tabletPadding'] ) && is_array( $attr['tabletPadding'] ) && isset( $attr['tabletPadding'][2] ) && is_numeric( $attr['tabletPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['tabletPadding'][2] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['tabletPadding'] ) && is_array( $attr['tabletPadding'] ) && isset( $attr['tabletPadding'][3] ) && is_numeric( $attr['tabletPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['tabletPadding'][3] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['tabletMargin'] ) && is_array( $attr['tabletMargin'] ) && isset( $attr['tabletMargin'][0] ) && is_numeric( $attr['tabletMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attr['tabletMargin'][0] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['tabletMargin'] ) && is_array( $attr['tabletMargin'] ) && isset( $attr['tabletMargin'][1] ) && is_numeric( $attr['tabletMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attr['tabletMargin'][1] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['tabletMargin'] ) && is_array( $attr['tabletMargin'] ) && isset( $attr['tabletMargin'][2] ) && is_numeric( $attr['tabletMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attr['tabletMargin'][2] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['tabletMargin'] ) && is_array( $attr['tabletMargin'] ) && isset( $attr['tabletMargin'][3] ) && is_numeric( $attr['tabletMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attr['tabletMargin'][3] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			$css->stop_media_query();
		}
		if ( ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][1] ) ) || isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][1] ) ) {
			// Tablet.
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '#kt-adv-heading' . $unique_id . ' mark, #kt-adv-heading' . $unique_id . ' .wp-block-kadence-advancedheading mark, .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] mark' );
			if ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][1] ) ) {
				$css->add_property( 'font-size', $attr['markSize'][1] . ( ! isset( $attr['markSizeType'] ) ? 'px' : $attr['markSizeType'] ) );
			}
			if ( isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['markLineHeight'][1] . ( ! isset( $attr['markLineType'] ) ? 'px' : $attr['markLineType'] ) );
			}
			if ( isset( $attr['markTabletPadding'] ) && is_array( $attr['markTabletPadding'] ) && isset( $attr['markTabletPadding'][0] ) && is_numeric( $attr['markTabletPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['markTabletPadding'][0] . ( ! isset( $attr['markPaddingType'] ) ? 'px' : $attr['markPaddingType'] ) );
			}
			if ( isset( $attr['markTabletPadding'] ) && is_array( $attr['markTabletPadding'] ) && isset( $attr['markTabletPadding'][1] ) && is_numeric( $attr['markTabletPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['markTabletPadding'][1] . ( ! isset( $attr['markPaddingType'] ) ? 'px' : $attr['markPaddingType'] ) );
			}
			if ( isset( $attr['markTabletPadding'] ) && is_array( $attr['markTabletPadding'] ) && isset( $attr['markTabletPadding'][2] ) && is_numeric( $attr['markTabletPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['markTabletPadding'][2] . ( ! isset( $attr['markPaddingType'] ) ? 'px' : $attr['markPaddingType'] ) );
			}
			if ( isset( $attr['markTabletPadding'] ) && is_array( $attr['markTabletPadding'] ) && isset( $attr['markTabletPadding'][3] ) && is_numeric( $attr['markTabletPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['markTabletPadding'][3] . ( ! isset( $attr['markPaddingType'] ) ? 'px' : $attr['markPaddingType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['mobileSize'] ) || isset( $attr['mobileLineHeight'] ) || isset( $attr['mobileAlign'] ) || isset( $attr['mobileMargin'] ) || isset( $attr['mobilePadding'] ) ) {
			// Mobile.
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '#kt-adv-heading' . $unique_id . ', #kt-adv-heading' . $unique_id . ' .wp-block-kadence-advancedheading, .wp-block-kadence-advancedheading.kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"], .kadence-advanced-heading-wrapper .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"]' );
			if ( isset( $attr['mobileSize'] ) && is_numeric( $attr['mobileSize'] ) ) {
				$css->add_property( 'font-size', $attr['mobileSize'] . ( ! isset( $attr['sizeType'] ) ? 'px' : $attr['sizeType'] ) );
			}
			if ( isset( $attr['mobileLineHeight'] ) && is_numeric( $attr['mobileLineHeight'] ) ) {
				$css->add_property( 'line-height', $attr['mobileLineHeight'] . ( ! isset( $attr['lineType'] ) ? 'px' : $attr['lineType'] ) );
			}
			if ( isset( $attr['mobileAlign'] ) && ! empty( $attr['mobileAlign'] ) ) {
				$css->add_property( 'text-align', $attr['mobileAlign'] . '!important' );
			}
			if ( isset( $attr['mobilePadding'] ) && is_array( $attr['mobilePadding'] ) && isset( $attr['mobilePadding'][0] ) && is_numeric( $attr['mobilePadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['mobilePadding'][0] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['mobilePadding'] ) && is_array( $attr['mobilePadding'] ) && isset( $attr['mobilePadding'][1] ) && is_numeric( $attr['mobilePadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['mobilePadding'][1] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['mobilePadding'] ) && is_array( $attr['mobilePadding'] ) && isset( $attr['mobilePadding'][2] ) && is_numeric( $attr['mobilePadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['mobilePadding'][2] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['mobilePadding'] ) && is_array( $attr['mobilePadding'] ) && isset( $attr['mobilePadding'][3] ) && is_numeric( $attr['mobilePadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['mobilePadding'][3] . ( ! isset( $attr['paddingType'] ) ? 'px' : $attr['paddingType'] ) );
			}
			if ( isset( $attr['mobileMargin'] ) && is_array( $attr['mobileMargin'] ) && isset( $attr['mobileMargin'][0] ) && is_numeric( $attr['mobileMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attr['mobileMargin'][0] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['mobileMargin'] ) && is_array( $attr['mobileMargin'] ) && isset( $attr['mobileMargin'][1] ) && is_numeric( $attr['mobileMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attr['mobileMargin'][1] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['mobileMargin'] ) && is_array( $attr['mobileMargin'] ) && isset( $attr['mobileMargin'][2] ) && is_numeric( $attr['mobileMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attr['mobileMargin'][2] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			if ( isset( $attr['mobileMargin'] ) && is_array( $attr['mobileMargin'] ) && isset( $attr['mobileMargin'][3] ) && is_numeric( $attr['mobileMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attr['mobileMargin'][3] . ( ! isset( $attr['marginType'] ) ? 'px' : $attr['marginType'] ) );
			}
			$css->stop_media_query();
		}
		if ( ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][2] ) ) || isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][2] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '#kt-adv-heading' . $unique_id . ' mark, #kt-adv-heading' . $unique_id . ' .wp-block-kadence-advancedheading mark, .kt-adv-heading' . $unique_id . '[data-kb-block="kb-adv-heading' . $unique_id . '"] mark' );
			if ( isset( $attr['markSize'] ) && is_array( $attr['markSize'] ) && ! empty( $attr['markSize'][2] ) ) {
				$css->add_property( 'font-size', $attr['markSize'][2] . ( ! isset( $attr['markSizeType'] ) ? 'px' : $attr['markSizeType'] ) );
			}
			if ( isset( $attr['markLineHeight'] ) && is_array( $attr['markLineHeight'] ) && ! empty( $attr['markLineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['markLineHeight'][2] . ( ! isset( $attr['markLineType'] ) ? 'px' : $attr['markLineType'] ) );
			}
			if ( isset( $attr['markMobilePadding'] ) && is_array( $attr['markMobilePadding'] ) && isset( $attr['markMobilePadding'][0] ) && is_numeric( $attr['markMobilePadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['markMobilePadding'][0] . ( ! isset( $attr['markPaddingType'] ) ? 'px' : $attr['markPaddingType'] ) );
			}
			if ( isset( $attr['markMobilePadding'] ) && is_array( $attr['markMobilePadding'] ) && isset( $attr['markMobilePadding'][1] ) && is_numeric( $attr['markMobilePadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['markMobilePadding'][1] . ( ! isset( $attr['markPaddingType'] ) ? 'px' : $attr['markPaddingType'] ) );
			}
			if ( isset( $attr['markMobilePadding'] ) && is_array( $attr['markMobilePadding'] ) && isset( $attr['markMobilePadding'][2] ) && is_numeric( $attr['markMobilePadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['markMobilePadding'][2] . ( ! isset( $attr['markPaddingType'] ) ? 'px' : $attr['markPaddingType'] ) );
			}
			if ( isset( $attr['markMobilePadding'] ) && is_array( $attr['markMobilePadding'] ) && isset( $attr['markMobilePadding'][3] ) && is_numeric( $attr['markMobilePadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['markMobilePadding'][3] . ( ! isset( $attr['markPaddingType'] ) ? 'px' : $attr['markPaddingType'] ) );
			}
			$css->stop_media_query();
		}
		return $css->css_output();
	}
	/**
	 * Adds Google fonts for Advanced Heading block.
	 *
	 * @param array $attr the blocks attr.
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
			if ( isset( $attr['loadItalic'] ) && true == $attr['loadItalic'] ) {
				if ( isset( $attr['fontVariant'] ) && strpos( $attr['fontVariant'], 'italic' ) === false ) {
					$italicVersion = ( $attr['fontVariant'] === 'regular' ? 'italic' : $attr['fontVariant'] . 'italic' );
					if ( ! in_array( $italicVersion, self::$gfonts[ $attr['typography'] ]['fontvariants'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontvariants'], $italicVersion );
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
		if ( isset( $attr['btns'] ) && is_array( $attr['btns'] ) ) {
			foreach ( $attr['btns'] as $btnkey => $btnvalue ) {
				if ( is_array( $btnvalue ) ) {
					if ( isset( $btnvalue['target'] ) && ! empty( $btnvalue['target'] ) && 'video' == $btnvalue['target'] ) {
						$this->enqueue_style( 'kadence-simplelightbox-css' );
						$this->enqueue_script( 'kadence-blocks-videolight-js' );

						// wp_enqueue_style( 'kadence-blocks-magnific-css' );
						// wp_enqueue_script( 'kadence-blocks-magnific-js' );
					}
				}
			}
		}
		$css = '';
		if ( isset( $attr['typography'] ) || isset( $attr['textTransform'] ) ) {
			$css .= '.kt-btns' . $unique_id . ' .kt-button {';
			if ( isset( $attr['typography'] ) && ! empty( $attr['typography'] ) ) {
				$css .= 'font-family:' . $attr['typography'] . ';';
			}
			if ( isset( $attr['fontWeight'] ) && ! empty( $attr['fontWeight'] ) ) {
				$css .= 'font-weight:' . $attr['fontWeight'] . ';';
			}
			if ( isset( $attr['fontStyle'] ) && ! empty( $attr['fontStyle'] ) ) {
				$css .= 'font-style:' . $attr['fontStyle'] . ';';
			}
			if ( isset( $attr['textTransform'] ) && ! empty( $attr['textTransform'] ) ) {
				$css .= 'text-transform:' . $attr['textTransform'] . ';';
			}
			$css .= '}';
		}
		if ( isset( $attr['margin'] ) && is_array( $attr['margin'] ) && is_array( $attr['margin'][0] ) ) {
			$margin = $attr['margin'][0];
			$unit = ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' );
			if ( isset( $margin['desk'] ) && is_array( $margin['desk'] ) && is_numeric( $margin['desk'][0] ) ) {
				$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ', .site .entry-content .wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' {';
				$css .= 'margin:' . $margin['desk'][0] . $unit . ' ' . $margin['desk'][1] . $unit . ' ' . $margin['desk'][2] . $unit . ' ' . $margin['desk'][3] . $unit . ';';
				$css .= '}';
			}
			if ( isset( $margin['tablet'] ) && is_array( $margin['tablet'] ) && is_numeric( $margin['tablet'][0] ) ) {
				$css .= '@media (min-width: 767px) and (max-width: 1024px) {';
				$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ', .site .entry-content .wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' {';
				$css .= 'margin:' . $margin['tablet'][0] . $unit . ' ' . $margin['tablet'][1] . $unit . ' ' . $margin['tablet'][2] . $unit . ' ' . $margin['tablet'][3] . $unit . ';';
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $margin['mobile'] ) && is_array( $margin['mobile'] ) && is_numeric( $margin['mobile'][0] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ', .site .entry-content .wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' {';
				$css .= 'margin:' . $margin['mobile'][0] . $unit . ' ' . $margin['mobile'][1] . $unit . ' ' . $margin['mobile'][2] . $unit . ' ' . $margin['mobile'][3] . $unit . ';';
				$css .= '}';
				$css .= '}';
			}
		}
		if ( isset( $attr['btns'] ) && is_array( $attr['btns'] ) ) {
			foreach ( $attr['btns'] as $btnkey => $btnvalue ) {
				if ( is_array( $btnvalue ) ) {
					if ( isset( $btnvalue['gap'] ) && is_numeric( $btnvalue['gap'] ) ) {
						$css .= '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' {';
						$css .= 'margin-right:' . $btnvalue['gap'] . 'px;';
						$css .= '}';
						$css .= '.rtl .kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' {';
						$css .= 'margin-left:' . $btnvalue['gap'] . 'px;';
						$css .= 'margin-right:0px;';
						$css .= '}';
					}
					if ( isset( $btnvalue['backgroundType'] ) && 'gradient' === $btnvalue['backgroundType'] || isset( $btnvalue['backgroundHoverType'] ) && 'gradient' === $btnvalue['backgroundHoverType'] ) {
						$bgtype = 'gradient';
					} else {
						$bgtype = 'solid';
					}
					$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button {';
					if ( isset( $attr['widthType'] ) && 'fixed' === $attr['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][0] ) && ! empty( $btnvalue['width'][0] ) ) {
						$css .= 'width:' . $btnvalue['width'][0] . 'px;';
					}
					if ( ! isset( $btnvalue['btnSize'] ) || ( isset( $btnvalue['btnSize'] ) && 'custom' === $btnvalue['btnSize'] ) ) {
						if ( isset( $btnvalue['paddingLR'] ) && is_numeric( $btnvalue['paddingLR'] ) ) {
							$css .= 'padding-left:' . $btnvalue['paddingLR'] . 'px;';
							$css .= 'padding-right:' . $btnvalue['paddingLR'] . 'px;';
						}
						if ( isset( $btnvalue['paddingBT'] ) && is_numeric( $btnvalue['paddingBT'] ) ) {
							$css .= 'padding-top:' . $btnvalue['paddingBT'] . 'px;';
							$css .= 'padding-bottom:' . $btnvalue['paddingBT'] . 'px;';
						}
					}
					if ( isset( $btnvalue['color'] ) && ! empty( $btnvalue['color'] ) ) {
						$css .= 'color:' . $this->kadence_color_output( $btnvalue['color'] ) . ';';
					}
					if ( isset( $btnvalue['size'] ) && ! empty( $btnvalue['size'] ) ) {
						$css .= 'font-size:' . $btnvalue['size'] . 'px;';
					}
					if ( isset( $btnvalue['backgroundType'] ) && 'gradient' === $btnvalue['backgroundType'] ) {
						$bg1 = ( ! isset( $btnvalue['background'] ) || 'transparent' === $btnvalue['background'] ? 'rgba(255,255,255,0)' : $this->kadence_color_output( $btnvalue['background'], ( isset( $btnvalue['backgroundOpacity'] ) && is_numeric( $btnvalue['backgroundOpacity'] ) ? $btnvalue['backgroundOpacity'] : 1 ) ) );
						$bg2 = ( isset( $btnvalue['gradient'][0] ) && ! empty( $btnvalue['gradient'][0] ) ? $this->kadence_color_output( $btnvalue['gradient'][0], ( isset( $btnvalue['gradient'][1] ) && is_numeric( $btnvalue['gradient'][1] ) ? $btnvalue['gradient'][1] : 1 ) ) : $this->hex2rgba( '#999999', ( isset( $btnvalue['gradient'][1] ) && is_numeric( $btnvalue['gradient'][1] ) ? $btnvalue['gradient'][1] : 1 ) ) );
						if ( isset( $btnvalue['gradient'][4] ) && 'radial' === $btnvalue['gradient'][4] ) {
							$css .= 'background:radial-gradient(at ' . ( isset( $btnvalue['gradient'][6] ) && ! empty( $btnvalue['gradient'][6] ) ? $btnvalue['gradient'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $btnvalue['gradient'][2] ) && is_numeric( $btnvalue['gradient'][2] ) ? $btnvalue['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $btnvalue['gradient'][3] ) && is_numeric( $btnvalue['gradient'][3] ) ? $btnvalue['gradient'][3] : '100' ) . '%);';
						} else if ( ! isset( $btnvalue['gradient'][4] ) || 'radial' !== $btnvalue['gradient'][4] ) {
							$css .= 'background:linear-gradient(' . ( isset( $btnvalue['gradient'][5] ) && ! empty( $btnvalue['gradient'][5] ) ? $btnvalue['gradient'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $btnvalue['gradient'][2] ) && is_numeric( $btnvalue['gradient'][2] ) ? $btnvalue['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $btnvalue['gradient'][3] ) && is_numeric( $btnvalue['gradient'][3] ) ? $btnvalue['gradient'][3] : '100' ) . '%);';
						}
					} else if ( isset( $btnvalue['background'] ) && ! empty( $btnvalue['background'] ) && 'transparent' === $btnvalue['background'] ) {
						$css .= 'background:transparent;';
					} else if ( isset( $btnvalue['background'] ) && ! empty( $btnvalue['background'] ) ) {
						$alpha = ( isset( $btnvalue['backgroundOpacity'] ) && is_numeric( $btnvalue['backgroundOpacity'] ) ? $btnvalue['backgroundOpacity'] : 1 );
						$css  .= 'background:' . $this->kadence_color_output( $btnvalue['background'], $alpha ) . ';';
					}
					if ( isset( $btnvalue['border'] ) && ! empty( $btnvalue['border'] ) ) {
						$alpha = ( isset( $btnvalue['borderOpacity'] ) && is_numeric( $btnvalue['borderOpacity'] ) ? $btnvalue['borderOpacity'] : 1 );
						$css  .= 'border-color:' . $this->kadence_color_output( $btnvalue['border'], $alpha ) . ';';
					}
					if ( isset( $btnvalue['boxShadow'] ) && is_array( $btnvalue['boxShadow'] ) && isset( $btnvalue['boxShadow'][0] ) && true === $btnvalue['boxShadow'][0] ) {
						$css  .= 'box-shadow:' . ( isset( $btnvalue['boxShadow'][7] ) && true === $btnvalue['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $btnvalue['boxShadow'][3] ) && is_numeric( $btnvalue['boxShadow'][3] ) ? $btnvalue['boxShadow'][3] : '1' ) . 'px ' . ( isset( $btnvalue['boxShadow'][4] ) && is_numeric( $btnvalue['boxShadow'][4] ) ? $btnvalue['boxShadow'][4] : '1' ) . 'px ' . ( isset( $btnvalue['boxShadow'][5] ) && is_numeric( $btnvalue['boxShadow'][5] ) ? $btnvalue['boxShadow'][5] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadow'][6] ) && is_numeric( $btnvalue['boxShadow'][6] ) ? $btnvalue['boxShadow'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $btnvalue['boxShadow'][1] ) && ! empty( $btnvalue['boxShadow'][1] ) ? $btnvalue['boxShadow'][1] : '#000000' ), ( isset( $btnvalue['boxShadow'][2] ) && is_numeric( $btnvalue['boxShadow'][2] ) ? $btnvalue['boxShadow'][2] : 0.2 ) ) . ';';
					}
					$css .= '}';
					$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:hover, .wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:focus {';
					if ( isset( $btnvalue['colorHover'] ) && ! empty( $btnvalue['colorHover'] ) ) {
						$css .= 'color:' . $this->kadence_color_output( $btnvalue['colorHover'] ) . ';';
					}
					if ( isset( $btnvalue['borderHover'] ) && ! empty( $btnvalue['borderHover'] ) ) {
						$alpha = ( isset( $btnvalue['borderHoverOpacity'] ) && is_numeric( $btnvalue['borderHoverOpacity'] ) ? $btnvalue['borderHoverOpacity'] : 1 );
						$css .= 'border-color:' . $this->kadence_color_output( $btnvalue['borderHover'], $alpha ) . ';';
					}
					if ( isset( $btnvalue['boxShadowHover'] ) && is_array( $btnvalue['boxShadowHover'] ) && isset( $btnvalue['boxShadowHover'][0] ) && true === $btnvalue['boxShadowHover'][0] && isset( $btnvalue['boxShadowHover'][7] ) && true !== $btnvalue['boxShadowHover'][7] ) {
						$css  .= 'box-shadow:' . ( isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $btnvalue['boxShadowHover'][3] ) && is_numeric( $btnvalue['boxShadowHover'][3] ) ? $btnvalue['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][4] ) && is_numeric( $btnvalue['boxShadowHover'][4] ) ? $btnvalue['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][5] ) && is_numeric( $btnvalue['boxShadowHover'][5] ) ? $btnvalue['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][6] ) && is_numeric( $btnvalue['boxShadowHover'][6] ) ? $btnvalue['boxShadowHover'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $btnvalue['boxShadowHover'][1] ) && ! empty( $btnvalue['boxShadowHover'][1] ) ? $btnvalue['boxShadowHover'][1] : '#000000' ), ( isset( $btnvalue['boxShadowHover'][2] ) && is_numeric( $btnvalue['boxShadowHover'][2] ) ? $btnvalue['boxShadowHover'][2] : 0.4 ) ) . ';';
					}
					$css .= '}';
					if ( 'gradient' === $bgtype ) {
						$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button::before {';
						if ( isset( $btnvalue['backgroundHoverType'] ) && 'gradient' === $btnvalue['backgroundHoverType'] ) {
							$bg1 = ( ! isset( $btnvalue['backgroundHover'] ) ? $this->hex2rgba( '#444444', ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 ) ) : $this->kadence_color_output( $btnvalue['backgroundHover'], ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 ) ) );
							$bg2 = ( isset( $btnvalue['gradientHover'][0] ) && ! empty( $btnvalue['gradientHover'][0] ) ? $this->kadence_color_output( $btnvalue['gradientHover'][0], ( isset( $btnvalue['gradientHover'][1] ) && is_numeric( $btnvalue['gradientHover'][1] ) ? $btnvalue['gradientHover'][1] : 1 ) ) : $this->hex2rgba( '#999999', ( isset( $btnvalue['gradientHover'][1] ) && is_numeric( $btnvalue['gradientHover'][1] ) ? $btnvalue['gradientHover'][1] : 1 ) ) );
							if ( isset( $btnvalue['gradientHover'][4] ) && 'radial' === $btnvalue['gradientHover'][4] ) {
								$css .= 'background:radial-gradient(at ' . ( isset( $btnvalue['gradientHover'][6] ) && ! empty( $btnvalue['gradientHover'][6] ) ? $btnvalue['gradientHover'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $btnvalue['gradientHover'][2] ) && is_numeric( $btnvalue['gradientHover'][2] ) ? $btnvalue['gradientHover'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $btnvalue['gradientHover'][3] ) && is_numeric( $btnvalue['gradientHover'][3] ) ? $btnvalue['gradientHover'][3] : '100' ) . '%);';
							} else if ( ! isset( $btnvalue['gradientHover'][4] ) || 'radial' !== $btnvalue['gradientHover'][4] ) {
								$css .= 'background:linear-gradient(' . ( isset( $btnvalue['gradientHover'][5] ) && ! empty( $btnvalue['gradientHover'][5] ) ? $btnvalue['gradientHover'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $btnvalue['gradientHover'][2] ) && is_numeric( $btnvalue['gradientHover'][2] ) ? $btnvalue['gradientHover'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $btnvalue['gradientHover'][3] ) && is_numeric( $btnvalue['gradientHover'][3] ) ? $btnvalue['gradientHover'][3] : '100' ) . '%);';
							}
						} else if ( isset( $btnvalue['backgroundHover'] ) && ! empty( $btnvalue['backgroundHover'] ) ) {
							$alpha = ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 );
							$css  .= 'background:' . $this->kadence_color_output( $btnvalue['backgroundHover'], $alpha ) . ';';
						}
						if ( isset( $btnvalue['boxShadowHover'] ) && is_array( $btnvalue['boxShadowHover'] ) && isset( $btnvalue['boxShadowHover'][0] ) && true === $btnvalue['boxShadowHover'][0] && isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ) {
							$css  .= 'box-shadow:' . ( isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $btnvalue['boxShadowHover'][3] ) && is_numeric( $btnvalue['boxShadowHover'][3] ) ? $btnvalue['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][4] ) && is_numeric( $btnvalue['boxShadowHover'][4] ) ? $btnvalue['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][5] ) && is_numeric( $btnvalue['boxShadowHover'][5] ) ? $btnvalue['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][6] ) && is_numeric( $btnvalue['boxShadowHover'][6] ) ? $btnvalue['boxShadowHover'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $btnvalue['boxShadowHover'][1] ) && ! empty( $btnvalue['boxShadowHover'][1] ) ? $btnvalue['boxShadowHover'][1] : '#000000' ), ( isset( $btnvalue['boxShadowHover'][2] ) && is_numeric( $btnvalue['boxShadowHover'][2] ) ? $btnvalue['boxShadowHover'][2] : 0.4 ) ) . ';';
							$css  .= 'border-radius:' . ( isset( $btnvalue['borderRadius'] ) && is_numeric( $btnvalue['borderRadius'] ) ? $btnvalue['borderRadius'] : '3' ) . 'px;';
						}
						$css .= '}';
					} else {
						$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button::before {';
						$css .= 'display:none;';
						$css .= '}';
						$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:hover, .wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:focus {';
						if ( isset( $btnvalue['backgroundHover'] ) && ! empty( $btnvalue['backgroundHover'] ) ) {
							$alpha = ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 );
							$css  .= 'background:' . $this->kadence_color_output( $btnvalue['backgroundHover'], $alpha ) . ';';
						} else {
							$alpha = ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 );
							if ( ! isset( $btnvalue['inheritStyles'] ) || ( isset( $btnvalue['inheritStyles'] ) && 'inherit' !== $btnvalue['inheritStyles'] ) ) {
								$css  .= 'background:' . $this->hex2rgba( '#444444', $alpha ) . ';';
							}
						}
						if ( isset( $btnvalue['boxShadowHover'] ) && is_array( $btnvalue['boxShadowHover'] ) && isset( $btnvalue['boxShadowHover'][0] ) && true === $btnvalue['boxShadowHover'][0] && isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ) {
							$css  .= 'box-shadow:' . ( isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $btnvalue['boxShadowHover'][3] ) && is_numeric( $btnvalue['boxShadowHover'][3] ) ? $btnvalue['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][4] ) && is_numeric( $btnvalue['boxShadowHover'][4] ) ? $btnvalue['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][5] ) && is_numeric( $btnvalue['boxShadowHover'][5] ) ? $btnvalue['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][6] ) && is_numeric( $btnvalue['boxShadowHover'][6] ) ? $btnvalue['boxShadowHover'][6] : '0' ) . 'px ' . $this->kadence_color_output( ( isset( $btnvalue['boxShadowHover'][1] ) && ! empty( $btnvalue['boxShadowHover'][1] ) ? $btnvalue['boxShadowHover'][1] : '#000000' ), ( isset( $btnvalue['boxShadowHover'][2] ) && is_numeric( $btnvalue['boxShadowHover'][2] ) ? $btnvalue['boxShadowHover'][2] : 0.4 ) ) . ';';
						}
						$css .= '}';
					}
					// Tablet CSS.
					if ( isset( $btnvalue['tabletGap'] ) && is_numeric( $btnvalue['tabletGap'] ) ) {
						$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
						$css .= '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' {';
						$css .= 'margin-right:' . $btnvalue['tabletGap'] . 'px;';
						$css .= '}';
						$css .= '}';
					}
					if ( ( isset( $btnvalue['responsiveSize'] ) && is_array( $btnvalue['responsiveSize'] ) && isset( $btnvalue['responsiveSize'][0] ) && is_numeric( $btnvalue['responsiveSize'][0] ) ) || ( isset( $attr['widthType'] ) && 'fixed' === $attr['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][1] ) && ! empty( $btnvalue['width'][1] ) ) ) {
						$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
						$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button {';
						if ( isset( $btnvalue['responsiveSize'] ) && is_array( $btnvalue['responsiveSize'] ) && isset( $btnvalue['responsiveSize'][0] ) && is_numeric( $btnvalue['responsiveSize'][0] ) ) {
							$css .= 'font-size:' . $btnvalue['responsiveSize'][0] . 'px;';
						}
						if ( isset( $attr['widthType'] ) && 'fixed' === $attr['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][1] ) && ! empty( $btnvalue['width'][1] ) ) {
							$css .= 'width:' . $btnvalue['width'][1] . 'px;';
						}
						$css .= '}';
						$css .= '}';
					}
					if ( isset( $btnvalue['btnSize'] ) && 'custom' === $btnvalue['btnSize'] && ( ( isset( $btnvalue['responsivePaddingBT'] ) && is_array( $btnvalue['responsivePaddingBT'] ) && isset( $btnvalue['responsivePaddingBT'][0] ) && is_numeric( $btnvalue['responsivePaddingBT'][0] ) ) || ( isset( $btnvalue['responsivePaddingLR'] ) && is_array( $btnvalue['responsivePaddingLR'] ) && isset( $btnvalue['responsivePaddingLR'][0] ) && is_numeric( $btnvalue['responsivePaddingLR'][0] ) ) ) ) {
						$css .= '@media (min-width: 768px) and (max-width: 1024px) {';
						$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button {';
						if ( isset( $btnvalue['responsivePaddingLR'] ) && is_array( $btnvalue['responsivePaddingLR'] ) && isset( $btnvalue['responsivePaddingLR'][0] ) && is_numeric( $btnvalue['responsivePaddingLR'][0] ) ) {
							$css .= 'padding-left:' . $btnvalue['responsivePaddingLR'][0] . 'px;';
							$css .= 'padding-right:' . $btnvalue['responsivePaddingLR'][0] . 'px;';
						}
						if ( isset( $btnvalue['responsivePaddingBT'] ) && is_array( $btnvalue['responsivePaddingBT'] ) && isset( $btnvalue['responsivePaddingBT'][0] ) && is_numeric( $btnvalue['responsivePaddingBT'][0] ) ) {
							$css .= 'padding-top:' . $btnvalue['responsivePaddingBT'][0] . 'px;';
							$css .= 'padding-bottom:' . $btnvalue['responsivePaddingBT'][0] . 'px;';
						}
						$css .= '}';
						$css .= '}';
					}
					// Mobile CSS.
					if ( isset( $btnvalue['mobileGap'] ) && is_numeric( $btnvalue['mobileGap'] ) ) {
						$css .= '@media (max-width: 767px) {';
						$css .= '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' {';
						$css .= 'margin-right:' . $btnvalue['mobileGap'] . 'px;';
						$css .= '}';
						$css .= '}';
					}
					if ( ( isset( $btnvalue['responsiveSize'] ) && is_array( $btnvalue['responsiveSize'] ) && isset( $btnvalue['responsiveSize'][1] ) && is_numeric( $btnvalue['responsiveSize'][1] ) ) || ( isset( $attr['widthType'] ) && 'fixed' === $attr['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][2] ) && ! empty( $btnvalue['width'][2] ) ) ) {
						$css .= '@media (max-width: 767px) {';
						$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button {';
						if ( isset( $btnvalue['responsiveSize'] ) && is_array( $btnvalue['responsiveSize'] ) && isset( $btnvalue['responsiveSize'][1] ) && is_numeric( $btnvalue['responsiveSize'][1] ) ) {
							$css .= 'font-size:' . $btnvalue['responsiveSize'][1] . 'px;';
						}
						if ( isset( $attr['widthType'] ) && 'fixed' === $attr['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][2] ) && ! empty( $btnvalue['width'][2] ) ) {
							$css .= 'width:' . $btnvalue['width'][2] . 'px;';
						}
						$css .= '}';
						$css .= '}';
					}
					if ( isset( $btnvalue['btnSize'] ) && 'custom' === $btnvalue['btnSize'] && ( ( isset( $btnvalue['responsivePaddingLR'] ) && is_array( $btnvalue['responsivePaddingLR'] ) && isset( $btnvalue['responsivePaddingLR'][1] ) && is_numeric( $btnvalue['responsivePaddingLR'][1] ) ) || ( isset( $btnvalue['responsivePaddingBT'] ) && is_array( $btnvalue['responsivePaddingBT'] ) && isset( $btnvalue['responsivePaddingBT'][1] ) && is_numeric( $btnvalue['responsivePaddingBT'][1] ) ) ) ) {
						$css .= '@media (max-width: 767px) {';
						$css .= '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button {';
						if ( isset( $btnvalue['responsivePaddingLR'] ) && is_array( $btnvalue['responsivePaddingLR'] ) && isset( $btnvalue['responsivePaddingLR'][1] ) && is_numeric( $btnvalue['responsivePaddingLR'][1] ) ) {
							$css .= 'padding-left:' . $btnvalue['responsivePaddingLR'][1] . 'px;';
							$css .= 'padding-right:' . $btnvalue['responsivePaddingLR'][1] . 'px;';
						}
						if ( isset( $btnvalue['responsivePaddingBT'] ) && is_array( $btnvalue['responsivePaddingBT'] ) && isset( $btnvalue['responsivePaddingBT'][1] ) && is_numeric( $btnvalue['responsivePaddingBT'][1] ) ) {
							$css .= 'padding-top:' . $btnvalue['responsivePaddingBT'][1] . 'px;';
							$css .= 'padding-bottom:' . $btnvalue['responsivePaddingBT'][1] . 'px;';
						}
						$css .= '}';
						$css .= '}';
					}
				}
			}
		}
		return $css;
	}
	/**
	 * Builds CSS for Advanced Button block.
	 *
	 * @param array $attr the blocks attr.
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
		$css                          = new Kadence_Blocks_CSS();
		$media_query                  = array();
		$media_query['mobile']        = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['mobileReverse'] = apply_filters( 'kadence_mobile_reverse_media_query', '(min-width: 768px)' );
		$media_query['tablet']        = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['tabletOnly']    = apply_filters( 'kadence_tablet_only_media_query', '@media (min-width: 768px) and (max-width: 1024px)' );
		$media_query['desktop']       = apply_filters( 'kadence_tablet_media_query', '(min-width: 1025px)' );
		if ( isset( $attr['inheritMaxWidth'] ) && $attr['inheritMaxWidth'] ) {
			global $content_width;
			if ( isset( $content_width ) ) {
				if ( class_exists( 'Kadence\Theme' ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap.kb-theme-content-width' );
					$css->add_property( 'max-width', absint( $content_width ) . 'px' );
					$css->set_selector( '.kt-layout-id' . $unique_id . ' > .kb-theme-content-width' );
					$css->add_property( 'padding-left', 'var(--global-sm-spacing)' );
					$css->add_property( 'padding-right', 'var(--global-sm-spacing)' );
				} else {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap.kb-theme-content-width' );
					$css->add_property( 'max-width', absint( $content_width ) . 'px' );
				}
			}
		}
		if ( isset( $attr['firstColumnWidth'] ) && ! empty( $attr['firstColumnWidth'] ) && ( ! isset( $attr['columns'] ) || 2 === $attr['columns'] ) ) {
			$css->start_media_query( $media_query['mobileReverse'] );
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-1' );
			$css->add_property( 'flex', '0 1 ' . $attr['firstColumnWidth'] . '%' );
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-2' );
			$css->add_property( 'flex', '0 1 ' . abs( $attr['firstColumnWidth'] - 100 ) . '%' );
			$css->stop_media_query();
			if ( isset( $attr['tabletLayout'] ) && ! empty( $attr['tabletLayout'] ) ) {
				if ( 'left-golden' === $attr['tabletLayout'] ) {
					$tabCol1 = '66.67';
					$tabCol2 = '33.33';
				} elseif ( 'right-golden' === $attr['tabletLayout'] ) {
					$tabCol1 = '33.33';
					$tabCol2 = '66.67';
				} elseif ( 'row' === $attr['tabletLayout'] ) {
					$tabCol1 = '100';
					$tabCol2 = '100';
				} else {
					$tabCol1 = '50';
					$tabCol2 = '50';
				}
				$css->start_media_query( $media_query['tabletOnly'] );
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-1' );
				$css->add_property( 'flex', '0 1 ' . $tabCol1 . '%' );
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-2' );
				$css->add_property( 'flex', '0 1 ' . $tabCol2 . '%' );
				$css->stop_media_query();
			}
		}
		if ( isset( $attr['firstColumnWidth'] ) && ! empty( $attr['firstColumnWidth'] ) &&  isset( $attr['secondColumnWidth'] ) && ! empty( $attr['secondColumnWidth'] ) && ( isset( $attr['columns'] ) && 3 === $attr['columns'] ) ) {
			$css->start_media_query( $media_query['mobileReverse'] );
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-1' );
			$css->add_property( 'flex', '0 1 ' . $attr['firstColumnWidth'] . '%' );
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-2' );
			$css->add_property( 'flex', '0 1 ' . $attr['secondColumnWidth'] . '%' );
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-3' );
			$css->add_property( 'flex', '0 1 ' . abs( ( $attr['firstColumnWidth'] + $attr['secondColumnWidth'] ) - 100 ) . '%' );
			$css->stop_media_query();
			if ( isset( $attr['tabletLayout'] ) && ! empty( $attr['tabletLayout'] ) ) {
				if ( 'left-half' === $attr['tabletLayout'] ) {
					$tabCol1 = '50';
					$tabCol2 = '25';
					$tabCol3 = '25';
				} elseif ( 'right-half' === $attr['tabletLayout'] ) {
					$tabCol1 = '25';
					$tabCol2 = '25';
					$tabCol3 = '50';
				} elseif ( 'center-half' === $attr['tabletLayout'] ) {
					$tabCol1 = '25';
					$tabCol2 = '50';
					$tabCol3 = '25';
				} elseif ( 'center-wide' === $attr['tabletLayout'] ) {
					$tabCol1 = '20';
					$tabCol2 = '60';
					$tabCol3 = '20';
				} elseif ( 'center-exwide' === $attr['tabletLayout'] ) {
					$tabCol1 = '15';
					$tabCol2 = '70';
					$tabCol3 = '15';
				} elseif ( 'row' === $attr['tabletLayout'] ) {
					$tabCol1 = '100';
					$tabCol2 = '100';
					$tabCol3 = '100';
				} else {
					$tabCol1 = '33.33';
					$tabCol2 = '33.33';
					$tabCol3 = '33.33';
				}
				$css->start_media_query( $media_query['tabletOnly'] );
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-1' );
				$css->add_property( 'flex', '0 1 ' . $tabCol1 . '%' );
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-2' );
				$css->add_property( 'flex', '0 1 ' . $tabCol2 . '%' );
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > .inner-column-3' );
				$css->add_property( 'flex', '0 1 ' . $tabCol3 . '%' );
				$css->stop_media_query();
			}
		}
		if ( isset( $attr['bgColor'] ) || isset( $attr['bgImg'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id );
			if ( isset( $attr['topMargin'] ) ) {
				$css->add_property( 'margin-top', $attr['topMargin'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
			}
			if ( isset( $attr['bottomMargin'] ) ) {
				$css->add_property( 'margin-bottom', $attr['bottomMargin'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
			}
			if ( isset( $attr['bgColor'] ) && ! empty( $attr['bgColor'] ) ) {
				if ( isset( $attr['bgColorClass'] ) && empty( $attr['bgColorClass'] ) || ! isset( $attr['bgColorClass'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $attr['bgColor'] ) );
				}
			}
			if ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && ( ! isset( $attr['backgroundSettingTab'] ) || empty( $attr['backgroundSettingTab'] ) || 'normal' === $attr['backgroundSettingTab'] ) ) {
				if ( isset( $attr['bgImgAttachment'] ) ) {
					if ( 'parallax' === $attr['bgImgAttachment'] ) {
						$bg_attach = 'fixed';
					} else {
						$bg_attach = $attr['bgImgAttachment'];
					}
				} else {
					$bg_attach = 'scroll';
				}
				$css->add_property( 'background-image', sprintf( "url('%s')", $attr['bgImg'] ) );
				$css->add_property( 'background-size', ( isset( $attr['bgImgSize'] ) ? $attr['bgImgSize'] : 'cover' ) );
				$css->add_property( 'background-position', ( isset( $attr['bgImgPosition'] ) ? $attr['bgImgPosition'] : 'center center' ) );
				$css->add_property( 'background-attachment', $bg_attach );
				$css->add_property( 'background-repeat', ( isset( $attr['bgImgRepeat'] ) ? $attr['bgImgRepeat'] : 'no-repeat' ) );
			}
		}
		if ( isset( $attr['zIndex'] ) ) {
			$css->set_selector( '.kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
			$css->add_property( 'z-index', $attr['zIndex'] );
		}
		if ( isset( $attr['textColor'] ) ) {
			$css->set_selector( '.kt-layout-id' . $unique_id . ', .kt-layout-id' . $unique_id . ' h1, .kt-layout-id' . $unique_id . ' h2, .kt-layout-id' . $unique_id . ' h3, .kt-layout-id' . $unique_id . ' h4, .kt-layout-id' . $unique_id . ' h5, .kt-layout-id' . $unique_id . ' h6' );
			$css->add_property( 'color', $css->render_color( $attr['textColor'] ) );
		}
		if ( isset( $attr['linkColor'] ) ) {
			$css->set_selector( '.kt-layout-id' . $unique_id . ' a' );
			$css->add_property( 'color', $css->render_color( $attr['linkColor'] ) );
		}
		if ( isset( $attr['linkHoverColor'] ) ) {
			$css->set_selector( '.kt-layout-id' . $unique_id . ' a:hover' );
			$css->add_property( 'color', $css->render_color( $attr['linkHoverColor'] ) );
		}
		if ( isset( $attr['bottomSep'] ) && 'none' != $attr['bottomSep'] ) {
			if ( isset( $attr['bottomSepHeight'] ) || isset( $attr['bottomSepWidth'] ) ) {
				if ( isset( $attr['bottomSepHeight'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep' );
					$css->add_property( 'height', $attr['bottomSepHeight'] . 'px' );
				}
				if ( isset( $attr['bottomSepWidth'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attr['bottomSepWidth'] . '%' );
				}
			}
			if ( isset( $attr['bottomSepHeightTab'] ) || isset( $attr['bottomSepWidthTab'] ) ) {
				$css->start_media_query( $media_query['tablet'] );
				if ( isset( $attr['bottomSepHeightTab'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep' );
					$css->add_property( 'height', $attr['bottomSepHeightTab'] . 'px' );
				}
				if ( isset( $attr['bottomSepWidthTab'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attr['bottomSepWidthTab'] . '%' );
				}
				$css->stop_media_query();
			}
			if ( isset( $attr['bottomSepHeightMobile'] ) || isset( $attr['bottomSepWidthMobile'] ) ) {
				$css->start_media_query( $media_query['mobile'] );
				if ( isset( $attr['bottomSepHeightMobile'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep' );
					$css->add_property( 'height', $attr['bottomSepHeightMobile'] . 'px' );
				}
				if ( isset( $attr['bottomSepWidthMobile'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attr['bottomSepWidthMobile'] . '%' );
				}
				$css->stop_media_query();
			}
		}
		if ( isset( $attr['topSep'] ) && 'none' != $attr['topSep'] ) {
			if ( isset( $attr['topSepHeight'] ) || isset( $attr['topSepWidth'] ) ) {
				if ( isset( $attr['topSepHeight'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep' );
					$css->add_property( 'height', $attr['topSepHeight'] . 'px' );
				}
				if ( isset( $attr['topSepWidth'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg' );
					$css->add_property( 'width', $attr['topSepWidth'] . '%' );
				}
			}
			if ( isset( $attr['topSepHeightTab'] ) || isset( $attr['topSepWidthTab'] ) ) {
				$css->start_media_query( $media_query['tablet'] );
				if ( isset( $attr['topSepHeightTab'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep' );
					$css->add_property( 'height', $attr['topSepHeightTab'] . 'px' );
				}
				if ( isset( $attr['topSepWidthTab'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg' );
					$css->add_property( 'width', $attr['topSepWidthTab'] . '%' );
				}
				$css->stop_media_query();
			}
			if ( isset( $attr['topSepHeightMobile'] ) || isset( $attr['topSepWidthMobile'] ) ) {
				$css->start_media_query( $media_query['mobile'] );
				if ( isset( $attr['topSepHeightMobile'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep' );
					$css->add_property( 'height', $attr['topSepHeightMobile'] . 'px' );
				}
				if ( isset( $attr['topSepWidthMobile'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg' );
					$css->add_property( 'width', $attr['topSepWidthMobile'] . '%' );
				}
				$css->stop_media_query();
			}
		}
		if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['minHeight'] ) ||  isset( $attr['maxWidth'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
			if ( isset( $attr['topPadding'] ) ) {
				$css->add_property( 'padding-top', $attr['topPadding'] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
			}
			if ( isset( $attr['bottomPadding'] ) ) {
				$css->add_property( 'padding-bottom', $attr['bottomPadding'] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
			}
			if ( isset( $attr['leftPadding'] ) ) {
				$css->add_property( 'padding-left', $attr['leftPadding'] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
			}
			if ( isset( $attr['rightPadding'] ) ) {
				$css->add_property( 'padding-right', $attr['rightPadding'] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
			}
			if ( isset( $attr['minHeight'] ) ) {
				$css->add_property( 'min-height', $attr['minHeight'] . ( isset( $attr['minHeightUnit'] ) && ! empty( $attr['minHeightUnit'] ) ? $attr['minHeightUnit'] : 'px' ) );
			}
			if ( isset( $attr['maxWidth'] ) ) {
				$css->add_property( 'max-width',  $attr['maxWidth'] . ( isset( $attr['maxWidthUnit'] ) && ! empty( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
				$css->add_property( 'margin-left', 'auto' );
				$css->add_property( 'margin-right', 'auto' );
			}
		}
		if ( isset( $attr['overlay'] ) || isset( $attr['overlayBgImg'] ) || isset( $attr['overlaySecond'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-layout-overlay' );
			if ( isset( $attr['overlayOpacity'] ) ) {
				if ( $attr['overlayOpacity'] < 10 ) {
					$css->add_property( 'opacity', '0.0' . $attr['overlayOpacity'] );
				} else if ( $attr['overlayOpacity'] >= 100 ) {
					$css->add_property( 'opacity', '1' );
				} else {
					$css->add_property( 'opacity', '0.' . $attr['overlayOpacity'] );
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
				$color = ( isset( $attr['overlay'] ) ? $css->render_color( $attr['overlay'], ( isset( $attr['overlayFirstOpacity'] ) && is_numeric( $attr['overlayFirstOpacity'] ) ? $attr['overlayFirstOpacity'] : 1 ) ) : 'transparent');
				$locsecond = ( isset( $attr['overlayGradLocSecond'] ) ? $attr['overlayGradLocSecond'] : '100');
				$colorsecond = ( isset( $attr['overlaySecond'] ) ? $css->render_color( $attr['overlaySecond'], ( isset( $attr['overlaySecondOpacity'] ) && is_numeric( $attr['overlaySecondOpacity'] ) ? $attr['overlaySecondOpacity'] : 1 ) ) : '#00B5E2');
				$css->add_property( 'background-image', $type . '-gradient(' . $angle. ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
			} else {
				if ( isset( $attr['overlay'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $attr['overlay'], ( isset( $attr['overlayFirstOpacity'] ) && is_numeric( $attr['overlayFirstOpacity'] ) ? $attr['overlayFirstOpacity'] : 1 ) ) );
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
					$css->add_property( 'background-image', sprintf( "url('%s')", $attr['overlayBgImg'] ) );
					$css->add_property( 'background-size', ( isset( $attr['overlayBgImgSize'] ) ? $attr['overlayBgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( isset( $attr['overlayBgImgPosition'] ) ? $attr['overlayBgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', $overbg_attach );
					$css->add_property( 'background-repeat', ( isset( $attr['overlayBgImgRepeat'] ) ? $attr['overlayBgImgRepeat'] : 'no-repeat' ) );
				}
			}
			if ( isset( $attr['overlayBlendMode'] ) ) {
				$css->add_property( 'mix-blend-mode', $attr['overlayBlendMode'] );
			}
		}
		$tablet_overlay = ( isset( $attr['tabletOverlay'] ) && is_array( $attr['tabletOverlay'] ) && isset( $attr['tabletOverlay'][0] ) && is_array( $attr['tabletOverlay'][0] ) ? $attr['tabletOverlay'][0] : array() );
		$tablet_background = ( isset( $attr['tabletBackground'] ) && is_array( $attr['tabletBackground'] ) && isset( $attr['tabletBackground'][0] ) && is_array( $attr['tabletBackground'][0] ) ? $attr['tabletBackground'][0] : array() );
		if ( isset( $attr['tabletPadding'] ) || isset( $attr['topMarginT'] ) || isset( $attr['minHeightTablet'] ) || isset( $attr['bottomMarginT'] ) || ( isset( $tablet_overlay['enable'] ) && $tablet_overlay['enable'] ) || ( isset( $tablet_background['enable'] ) && $tablet_background['enable'] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			if ( isset( $attr['topMarginT'] ) || isset( $attr['bottomMarginT'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( isset( $attr['topMarginT'] ) ) {
					$css->add_property( 'margin-top', $attr['topMarginT'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
				}
				if ( isset( $attr['bottomMarginT'] ) ) {
					$css->add_property( 'margin-bottom', $attr['bottomMarginT'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
				}
			}
			if ( ( isset( $attr['tabletPadding'] ) && is_array( $attr['tabletPadding'] ) ) || isset( $attr['minHeightTablet'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
				if ( isset( $attr['tabletPadding'][ 0 ] ) && is_numeric( $attr['tabletPadding'][ 0 ] ) ) {
					$css->add_property( 'padding-top', $attr['tabletPadding'][ 0 ] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['tabletPadding'][ 1 ] ) && is_numeric( $attr['tabletPadding'][ 1 ] ) ) {
					$css->add_property( 'padding-right', $attr['tabletPadding'][ 1 ] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['tabletPadding'][ 2 ] ) && is_numeric( $attr['tabletPadding'][ 2 ] ) ) {
					$css->add_property( 'padding-bottom', $attr['tabletPadding'][ 2 ] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['tabletPadding'][ 3 ] ) && is_numeric( $attr['tabletPadding'][ 3 ] ) ) {
					$css->add_property( 'padding-left', $attr['tabletPadding'][ 3 ] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['minHeightTablet'] ) ) {
					$css->add_property( 'min-height', $attr['minHeightTablet'] . ( isset( $attr['minHeightUnit'] ) && ! empty( $attr['minHeightUnit'] ) ? $attr['minHeightUnit'] : 'px' ) );
				}
			}
			if ( isset( $tablet_background['enable'] ) && $tablet_background['enable'] ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( ! empty( $tablet_background['bgColor'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $tablet_background['bgColor'] ) );
				}
				if ( ! empty( $tablet_background['bgImg'] ) ) {
					if ( ! empty( $tablet_background['bgImgAttachment'] ) ) {
						if ( 'parallax' === $tablet_background['bgImgAttachment'] ) {
							$bg_attach = 'fixed';
						} else {
							$bg_attach = $tablet_background['bgImgAttachment'];
						}
					} else {
						$bg_attach = 'scroll';
					}
					$css->add_property( 'background-image', sprintf( "url('%s')", $tablet_background['bgImg'] ) . ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' !== $tablet_background['bgImgAttachment'] ? '!important' : '' ) );
					$css->add_property( 'background-size', ( ! empty( $tablet_background['bgImgSize'] ) ? $tablet_background['bgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( ! empty( $tablet_background['bgImgPosition'] ) ? $tablet_background['bgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', $bg_attach );
					$css->add_property( 'background-repeat', ( ! empty( $tablet_background['bgImgRepeat'] ) ? $tablet_background['bgImgRepeat'] : 'no-repeat' ) );
				} else if ( isset( $tablet_background['forceOverDesk'] ) && $tablet_background['forceOverDesk'] ) {
					$css->add_property( 'background-image', 'none' );
				}
				if ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] &&  isset( $tablet_background['bgImg'] ) && ! empty( $tablet_background['bgImg'] ) && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' !== $tablet_background['bgImgAttachment'] ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' [id*="jarallax-container-"]' );
					$css->add_property( 'display', 'none !important' );
				}
				if ( isset( $attr['backgroundSettingTab'] ) && ! empty( $attr['backgroundSettingTab'] ) && 'normal' !== $attr['backgroundSettingTab'] ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kb-blocks-bg-video-container, #kt-layout-id' . $unique_id . ' .kb-blocks-bg-slider' );
					$css->add_property( 'display', 'none' );
				}
			}
			if ( ! empty( $tablet_overlay['enable'] ) && $tablet_overlay['enable'] ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-layout-overlay' );
				if ( ! empty( $tablet_overlay['overlayOpacity'] ) ) {
					if ( $tablet_overlay['overlayOpacity'] < 10 ) {
						$css->add_property( 'opacity', '0.0' . $tablet_overlay['overlayOpacity'] );
					} else if ( $tablet_overlay['overlayOpacity'] >= 100 ) {
						$css->add_property( 'opacity', '1' );
					} else {
						$css->add_property( 'opacity', '0.' . $tablet_overlay['overlayOpacity'] );
					}
				}
				if ( ! empty( $tablet_overlay['currentOverlayTab'] ) && 'grad' == $tablet_overlay['currentOverlayTab'] ) {
					$type = ( ! empty( $tablet_overlay['overlayGradType'] ) ? $tablet_overlay['overlayGradType'] : 'linear' );
					if ( 'radial' === $type ) {
						$angle = ( ! empty( $tablet_overlay['overlayBgImgPosition'] ) ? 'at ' . $tablet_overlay['overlayBgImgPosition'] : 'at center center' );
					} else {
						$angle = ( ! empty( $tablet_overlay['overlayGradAngle'] ) ? $tablet_overlay['overlayGradAngle'] . 'deg' : '180deg' );
					}
					$loc = ( ! empty( $tablet_overlay['overlayGradLoc'] ) ? $tablet_overlay['overlayGradLoc'] : '0' );
					$color = ( ! empty( $tablet_overlay['overlay'] ) ? $css->render_color( $tablet_overlay['overlay'] ) : 'transparent' );
					$locsecond = ( ! empty( $tablet_overlay['overlayGradLocSecond'] ) ? $tablet_overlay['overlayGradLocSecond'] : '100' );
					$colorsecond = ( ! empty( $tablet_overlay['overlaySecond'] ) ? $css->render_color( $tablet_overlay['overlaySecond'] ) : '#00B5E2' );
					$css->add_property( 'background-image', $type . '-gradient(' . $angle. ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
				} else {
					if ( ! empty( $tablet_overlay['overlay'] ) ) {
						$css->add_property( 'background-color:', $css->render_color( $tablet_overlay['overlay'] ) );
					}
					if ( ! empty( $tablet_overlay['overlayBgImg'] ) ) {
						if ( ! empty( $tablet_overlay['overlayBgImgAttachment'] ) ) {
							if ( 'parallax' === $tablet_overlay['overlayBgImgAttachment'] ) {
								$overbg_attach = 'fixed';
							} else {
								$overbg_attach = $tablet_overlay['overlayBgImgAttachment'];
							}
						} else {
							$overbg_attach = 'scroll';
						}
						$css->add_property( 'background-image', sprintf( "url('%s')", $tablet_overlay['overlayBgImg'] ) );
						$css->add_property( 'background-size', ( ! empty( $tablet_overlay['overlayBgImgSize'] ) ? $tablet_overlay['overlayBgImgSize'] : 'cover' ) );
						$css->add_property( 'background-position', ( ! empty( $tablet_overlay['overlayBgImgPosition'] ) ? $tablet_overlay['overlayBgImgPosition'] : 'center center' ) );
						$css->add_property( 'background-attachment', $overbg_attach );
						$css->add_property( 'background-repeat', ( ! empty( $tablet_overlay['overlayBgImgRepeat'] ) ? $tablet_overlay['overlayBgImgRepeat'] : 'no-repeat' ) );
					}
				}
				if ( ! empty( $tablet_overlay['overlayBlendMode'] ) ) {
					$css->add_property( 'mix-blend-mode', $tablet_overlay['overlayBlendMode'] );
				}
			}
			$css->stop_media_query();
		}
		$mobile_overlay = ( isset( $attr['mobileOverlay'] ) && is_array( $attr['mobileOverlay'] ) && isset( $attr['mobileOverlay'][0] ) && is_array( $attr['mobileOverlay'][0] ) ? $attr['mobileOverlay'][0] : array() );
		$mobile_background = ( isset( $attr['mobileBackground'] ) && is_array( $attr['mobileBackground'] ) && isset( $attr['mobileBackground'][0] ) && is_array( $attr['mobileBackground'][0] ) ? $attr['mobileBackground'][0] : array() );
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) || ( isset( $mobile_overlay['enable'] ) && $mobile_overlay['enable'] ) || isset( $attr['minHeightMobile'] ) || ( isset( $mobile_background['enable'] ) && $mobile_background['enable'] == 'true' ) ) {
			$css->start_media_query( $media_query['mobile'] );
			if ( isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( isset( $attr['topMarginM'] ) ) {
					$css->add_property( 'margin-top', $attr['topMarginM'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
				}
				if ( isset( $attr['bottomMarginM'] ) ) {
					$css->add_property( 'margin-bottom', $attr['bottomMarginM'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
				}
			}
			if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['minHeightMobile'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
				if ( isset( $attr['topPaddingM'] ) ) {
					$css->add_property( 'padding-top', $attr['topPaddingM'] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['bottomPaddingM'] ) ) {
					$css->add_property( 'padding-bottom', $attr['bottomPaddingM'] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['leftPaddingM'] ) ) {
					$css->add_property( 'padding-left', $attr['leftPaddingM'] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['rightPaddingM'] ) ) {
					$css->add_property( 'padding-right', $attr['rightPaddingM'] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['minHeightMobile'] ) ) {
					$css->add_property( 'min-height', $attr['minHeightMobile'] . ( isset( $attr['minHeightUnit'] ) && ! empty( $attr['minHeightUnit'] ) ? $attr['minHeightUnit'] : 'px' ) );
				}
			}
			if ( isset( $mobile_background['enable'] ) && $mobile_background['enable'] ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( isset( $mobile_background['bgColor'] ) && ! empty( $mobile_background['bgColor'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $mobile_background['bgColor'] ) );
				}
				if ( isset( $mobile_background['bgImg'] ) && ! empty( $mobile_background['bgImg'] ) ) {
					if ( ! empty( $mobile_background['bgImgAttachment'] ) ) {
						if ( 'parallax' === $mobile_background['bgImgAttachment'] ) {
							$bg_attach = 'fixed';
						} else {
							$bg_attach = $mobile_background['bgImgAttachment'];
						}
					} else {
						$bg_attach = 'scroll';
					}
					$css->add_property( 'background-image', sprintf( "url('%s')", $mobile_background['bgImg'] ) . ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] && isset( $mobile_background['bgImgAttachment'] ) && 'parallax' !== $mobile_background['bgImgAttachment'] ? '!important' : '' ) );
					$css->add_property( 'background-size', ( ! empty( $mobile_background['bgImgSize'] ) ? $mobile_background['bgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( ! empty( $mobile_background['bgImgPosition'] ) ? $mobile_background['bgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', $bg_attach );
					$css->add_property( 'background-repeat', ( ! empty( $mobile_background['bgImgRepeat'] ) ? $mobile_background['bgImgRepeat'] : 'no-repeat' ) );
				} else if ( isset( $mobile_background['forceOverDesk'] ) && $mobile_background['forceOverDesk'] ) {
					$css->add_property( 'background-image', 'none' );
				}
				if ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] &&  isset( $mobile_background['bgImg'] ) && ! empty( $mobile_background['bgImg'] ) && isset( $mobile_background['bgImgAttachment'] ) && 'parallax' !== $mobile_background['bgImgAttachment'] ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' [id*="jarallax-container-"]' );
					$css->add_property( 'display', 'none !important' );
				}
				if ( isset( $attr['backgroundSettingTab'] ) && ! empty( $attr['backgroundSettingTab'] ) && 'normal' !== $attr['backgroundSettingTab'] ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kb-blocks-bg-video-container, #kt-layout-id' . $unique_id . ' .kb-blocks-bg-slider' );
					$css->add_property( 'display', 'none' );
				}
			}
			if ( isset( $mobile_overlay['enable'] ) && $mobile_overlay['enable'] ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-layout-overlay' );
				if ( ! empty( $mobile_overlay['overlayOpacity'] ) ) {
					if ( $mobile_overlay['overlayOpacity'] < 10 ) {
						$css->add_property( 'opacity', '0.0' . $mobile_overlay['overlayOpacity'] );
					} else if ( $mobile_overlay['overlayOpacity'] >= 100 ) {
						$css->add_property( 'opacity', '1' );
					} else {
						$css->add_property( 'opacity', '0.' . $mobile_overlay['overlayOpacity'] );
					}
				}
				if ( ! empty( $mobile_overlay['currentOverlayTab'] ) && 'grad' == $mobile_overlay['currentOverlayTab'] ) {
					$type = ( ! empty( $mobile_overlay['overlayGradType'] ) ? $mobile_overlay['overlayGradType'] : 'linear');
					if ( 'radial' === $type ) {
						$angle = ( ! empty( $mobile_overlay['overlayBgImgPosition'] ) ? 'at ' . $mobile_overlay['overlayBgImgPosition'] : 'at center center' );
					} else {
						$angle = ( ! empty( $mobile_overlay['overlayGradAngle'] ) ? $mobile_overlay['overlayGradAngle'] . 'deg' : '180deg');
					}
					$loc = ( ! empty( $mobile_overlay['overlayGradLoc'] ) ? $mobile_overlay['overlayGradLoc'] : '0');
					$color = ( ! empty( $mobile_overlay['overlay'] ) ? $css->render_color( $mobile_overlay['overlay'] ) : 'transparent');
					$locsecond = ( ! empty( $mobile_overlay['overlayGradLocSecond'] ) ? $mobile_overlay['overlayGradLocSecond'] : '100');
					$colorsecond = ( ! empty( $mobile_overlay['overlaySecond'] ) ? $css->render_color( $mobile_overlay['overlaySecond'] ) : '#00B5E2' );
					$css->add_property( 'background-image', $type . '-gradient(' . $angle. ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
				} else {
					if ( ! empty( $mobile_overlay['overlay'] ) ) {
						$css->add_property( 'background-color', $css->render_color( $mobile_overlay['overlay'] ) );
					}
					if ( ! empty( $mobile_overlay['overlayBgImg'] ) ) {
						if ( ! empty( $mobile_overlay['overlayBgImgAttachment'] ) ) {
							if ( 'parallax' === $mobile_overlay['overlayBgImgAttachment'] ) {
								$overbg_attach = 'fixed';
							} else {
								$overbg_attach = $mobile_overlay['overlayBgImgAttachment'];
							}
						} else {
							$overbg_attach = 'scroll';
						}
						$css->add_property( 'background-image', sprintf( "url('%s')", $mobile_overlay['overlayBgImg'] ) );
						$css->add_property( 'background-size', ( ! empty( $mobile_overlay['overlayBgImgSize'] ) ? $mobile_overlay['overlayBgImgSize'] : 'cover' ) );
						$css->add_property( 'background-position', ( ! empty( $mobile_overlay['overlayBgImgPosition'] ) ? $mobile_overlay['overlayBgImgPosition'] : 'center center' ) );
						$css->add_property( 'background-attachment', $overbg_attach );
						$css->add_property( 'background-repeat', ( ! empty( $mobile_overlay['overlayBgImgRepeat'] ) ? $mobile_overlay['overlayBgImgRepeat'] : 'no-repeat' ) );
					}
				}
				if ( ! empty( $mobile_overlay['overlayBlendMode'] ) ) {
					$css->add_property( 'mix-blend-mode', $mobile_overlay['overlayBlendMode'] );
				}
			}
			$css->stop_media_query();
		}
		return $css->css_output();
	}
	/**
	 * Builds CSS for column layout block.
	 *
	 * @param object $attr the blocks attr.
	 * @param string $unique_id the blocks parent attr ID.
	 */
	public function column_layout_css( $attr, $unique_id ) {
		$css                    = new Kadence_Blocks_CSS();
		$media_query            = array();
		$media_query['mobile']  = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['tablet']  = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['desktop'] = apply_filters( 'kadence_tablet_media_query', '(min-width: 1025px)' );
		// Style.
		if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) || isset( $attr['rightMargin'] ) || isset( $attr['leftMargin'] ) || isset( $attr['border'] ) || isset( $attr['borderRadius'] ) || isset( $attr['borderWidth'] ) || ( isset( $attr['displayShadow'] ) && true == $attr['displayShadow'] ) ) {
			$css->set_selector( '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attr['topPadding'] ) ) {
				$css->add_property( 'padding-top', $attr['topPadding'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['bottomPadding'] ) ) {
				$css->add_property( 'padding-bottom', $attr['bottomPadding'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['leftPadding'] ) ) {
				$css->add_property( 'padding-left', $attr['leftPadding'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['rightPadding'] ) ) {
				$css->add_property( 'padding-right', $attr['rightPadding'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['topMargin'] ) ) {
				$css->add_property( 'margin-top', $attr['topMargin'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['bottomMargin'] ) ) {
				$css->add_property( 'margin-bottom', $attr['bottomMargin'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['rightMargin'] ) ) {
				$css->add_property( 'margin-right', $attr['rightMargin'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['leftMargin'] ) ) {
				$css->add_property( 'margin-left', $attr['leftMargin'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['border'] ) ) {
				$alpha = ( isset( $attr['borderOpacity'] ) && ! empty( $attr['borderOpacity'] ) ? $attr['borderOpacity'] : 1 );
				$css->add_property( 'border-color', $css->render_color( $attr['border'], $alpha ) );
			}
			if ( isset( $attr['borderWidth'] ) && ! empty( $attr['borderWidth'] ) && is_array( $attr['borderWidth'] ) ) {
				if ( isset( $attr['borderWidth'][0] ) && is_numeric( $attr['borderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['borderWidth'][0] . 'px' );
				}
				if ( isset( $attr['borderWidth'][1] ) && is_numeric( $attr['borderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['borderWidth'][1] . 'px' );
				}
				if ( isset( $attr['borderWidth'][2] ) && is_numeric( $attr['borderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['borderWidth'][2] . 'px' );
				}
				if ( isset( $attr['borderWidth'][3] ) && is_numeric( $attr['borderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['borderWidth'][3] . 'px' );
				}
			}
			if ( isset( $attr['borderRadius'] ) && ! empty( $attr['borderRadius'] ) && is_array( $attr['borderRadius'] ) ) {
				if ( isset( $attr['borderRadius'][0] ) && is_numeric( $attr['borderRadius'][0] ) ) {
					$css->add_property( 'border-top-left-radius', $attr['borderRadius'][0] . 'px' );
				}
				if ( isset( $attr['borderRadius'][1] ) && is_numeric( $attr['borderRadius'][1] ) ) {
					$css->add_property( 'border-top-right-radius', $attr['borderRadius'][1] . 'px' );
				}
				if ( isset( $attr['borderRadius'][2] ) && is_numeric( $attr['borderRadius'][2] ) ) {
					$css->add_property( 'border-bottom-right-radius', $attr['borderRadius'][2] . 'px' );
				}
				if ( isset( $attr['borderRadius'][3] ) && is_numeric( $attr['borderRadius'][3] ) ) {
					$css->add_property( 'border-bottom-left-radius', $attr['borderRadius'][3] . 'px' );
				}
			}
			if ( isset( $attr['displayShadow'] ) && true == $attr['displayShadow'] ) {
				if ( isset( $attr['shadow'] ) && is_array( $attr['shadow'] ) && isset( $attr['shadow'][0] ) && is_array( $attr['shadow'][0] ) ) {
					$css->add_property( 'box-shadow', ( isset( $attr['shadow'][0]['inset'] ) && true === $attr['shadow'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attr['shadow'][0]['hOffset'] ) && is_numeric( $attr['shadow'][0]['hOffset'] ) ? $attr['shadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attr['shadow'][0]['vOffset'] ) && is_numeric( $attr['shadow'][0]['vOffset'] ) ? $attr['shadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attr['shadow'][0]['blur'] ) && is_numeric( $attr['shadow'][0]['blur'] ) ? $attr['shadow'][0]['blur'] : '14' ) . 'px ' . ( isset( $attr['shadow'][0]['spread'] ) && is_numeric( $attr['shadow'][0]['spread'] ) ? $attr['shadow'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attr['shadow'][0]['color'] ) && ! empty( $attr['shadow'][0]['color'] ) ? $attr['shadow'][0]['color'] : '#000000' ), ( isset( $attr['shadow'][0]['opacity'] ) && is_numeric( $attr['shadow'][0]['opacity'] ) ? $attr['shadow'][0]['opacity'] : 0.2 ) ) );
				} else {
					$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
				}
			}
		}
		if( isset( $attr['backgroundImg'] ) && is_array( $attr['backgroundImg'] ) && isset( $attr['backgroundImg'][ 0 ] ) && is_array( $attr['backgroundImg'][0] ) && isset( $attr['backgroundImg'][0]['bgImg'] ) && ! empty( $attr['backgroundImg'][0]['bgImg'] ) ) {
			$bg_img = $attr['backgroundImg'][ 0 ];
			$css->set_selector( '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attr['background'] ) && ! empty( $attr['background'] ) ) {
				$alpha = ( isset( $attr['backgroundOpacity'] ) && ! empty( $attr['backgroundOpacity'] ) ? $attr['backgroundOpacity'] : 1 );
				$css->add_property( 'background-color', $css->render_color( $attr['background'], $alpha ) );
			}
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img['bgImgSize'] ) ? $bg_img['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img['bgImgPosition'] ) ? $bg_img['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img['bgImgAttachment'] ) ? $bg_img['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img['bgImgRepeat'] ) ? $bg_img['bgImgRepeat'] : 'no-repeat' ) );
		}
		if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && isset( $attr['textAlign'][ 0 ] ) && ! empty( $attr['textAlign'][ 0 ] ) ) {
			$css->set_selector( '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id );
			$css->add_property( 'text-align',  $attr['textAlign'][ 0 ] );
		}
		if ( isset( $attr['textColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ', .kadence-column' . $unique_id . ' h1, .kadence-column' . $unique_id . ' h2, .kadence-column' . $unique_id . ' h3, .kadence-column' . $unique_id . ' h4, .kadence-column' . $unique_id . ' h5, .kadence-column' . $unique_id . ' h6' );
			$css->add_property( 'color',  $css->render_color( $attr['textColor'] ) );
		}
		if ( isset( $attr['linkColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a' );
			$css->add_property( 'color',  $css->render_color( $attr['linkColor'] ) );
		}
		if ( isset( $attr['linkHoverColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a:hover' );
			$css->add_property( 'color',  $css->render_color( $attr['linkHoverColor'] ) );
		}
		if ( isset( $attr['zIndex'] ) && ! empty( $attr['zIndex'] ) ) {
			$css->set_selector( '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id );
			$css->add_property( 'z-index',  $attr['zIndex'] );
		}
		$css->start_media_query( $media_query['tablet'] );
		if ( isset( $attr['collapseOrder'] ) ) {
			$css->set_selector( '.kt-row-column-wrap.kt-tab-layout-three-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-tab-layout-two-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-tab-layout-row > .kadence-column' . $unique_id );
			$css->add_property( 'order', $attr['collapseOrder'] );
		}
		if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && isset( $attr['textAlign'][ 1 ] ) && ! empty( $attr['textAlign'][ 1 ] ) ) {
			$css->set_selector( '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id );
			$css->add_property( 'text-align',  $attr['textAlign'][ 1 ] );
		}
		if ( isset( $attr['topPaddingT'] ) || isset( $attr['bottomPaddingT'] ) || isset( $attr['leftPaddingT'] ) || isset( $attr['rightPaddingT'] ) || isset( $attr['topMarginT'] ) || isset( $attr['bottomMarginT'] ) || isset( $attr['rightMarginT'] ) || isset( $attr['leftMarginT'] ) || isset( $attr['tabletBorderWidth'] ) ) {
			$css->set_selector( '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attr['topPaddingT'] ) ) {
				$css->add_property( 'padding-top', $attr['topPaddingT'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['bottomPaddingT'] ) ) {
				$css->add_property( 'padding-bottom', $attr['bottomPaddingT'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['leftPaddingT'] ) ) {
				$css->add_property( 'padding-left', $attr['leftPaddingT'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['rightPaddingT'] ) ) {
				$css->add_property( 'padding-right', $attr['rightPaddingT'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['topMarginT'] ) ) {
				$css->add_property( 'margin-top', $attr['topMarginT'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['bottomMarginT'] ) ) {
				$css->add_property( 'margin-bottom', $attr['bottomMarginT'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['rightMarginT'] ) ) {
				$css->add_property( 'margin-right', $attr['rightMarginT'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['leftMarginT'] ) ) {
				$css->add_property( 'margin-left', $attr['leftMarginT'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['tabletBorderWidth'] ) && ! empty( $attr['tabletBorderWidth'] ) && is_array( $attr['tabletBorderWidth'] ) ) {
				if ( isset( $attr['tabletBorderWidth'][0] ) && is_numeric( $attr['tabletBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['tabletBorderWidth'][0] . 'px' );
				}
				if ( isset( $attr['tabletBorderWidth'][1] ) && is_numeric( $attr['tabletBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['tabletBorderWidth'][1] . 'px' );
				}
				if ( isset( $attr['tabletBorderWidth'][2] ) && is_numeric( $attr['tabletBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['tabletBorderWidth'][2] . 'px' );
				}
				if ( isset( $attr['tabletBorderWidth'][3] ) && is_numeric( $attr['tabletBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['tabletBorderWidth'][3] . 'px' );
				}
			}
		}
		$css->stop_media_query();
		$css->start_media_query( $media_query['mobile'] );
		if ( isset( $attr['collapseOrder'] ) ) {
			$css->set_selector( '.kt-row-column-wrap.kt-mobile-layout-three-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-mobile-layout-two-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-mobile-layout-row > .kadence-column' . $unique_id );
			$css->add_property( 'order', $attr['collapseOrder'] );
		}
		if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && isset( $attr['textAlign'][ 2 ] ) && ! empty( $attr['textAlign'][ 2 ] ) ) {
			$css->set_selector( '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id );
			$css->add_property( 'text-align',  $attr['textAlign'][ 2 ] );
		}
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) || isset( $attr['rightMarginM'] ) || isset( $attr['leftMarginM'] ) || isset( $attr['mobileBorderWidth'] ) ) {
			$css->set_selector( '.kt-row-layout-inner > .kt-row-column-wrap > .kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attr['topPaddingM'] ) ) {
				$css->add_property( 'padding-top', $attr['topPaddingM'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['bottomPaddingM'] ) ) {
				$css->add_property( 'padding-bottom', $attr['bottomPaddingM'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['leftPaddingM'] ) ) {
				$css->add_property( 'padding-left', $attr['leftPaddingM'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['rightPaddingM'] ) ) {
				$css->add_property( 'padding-right', $attr['rightPaddingM'] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['topMarginM'] ) ) {
				$css->add_property( 'margin-top', $attr['topMarginM'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['bottomMarginM'] ) ) {
				$css->add_property( 'margin-bottom', $attr['bottomMarginM'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['rightMarginM'] ) ) {
				$css->add_property( 'margin-right', $attr['rightMarginM'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['leftMarginM'] ) ) {
				$css->add_property( 'margin-left', $attr['leftMarginM'] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['mobileBorderWidth'] ) && ! empty( $attr['mobileBorderWidth'] ) && is_array( $attr['mobileBorderWidth'] ) ) {
				if ( isset( $attr['mobileBorderWidth'][0] ) && is_numeric( $attr['mobileBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['mobileBorderWidth'][0] . 'px' );
				}
				if ( isset( $attr['mobileBorderWidth'][1] ) && is_numeric( $attr['mobileBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['mobileBorderWidth'][1] . 'px' );
				}
				if ( isset( $attr['mobileBorderWidth'][2] ) && is_numeric( $attr['mobileBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['mobileBorderWidth'][2] . 'px' );
				}
				if ( isset( $attr['mobileBorderWidth'][3] ) && is_numeric( $attr['mobileBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['mobileBorderWidth'][3] . 'px' );
				}
			}
		}
		$css->stop_media_query();
		return $css->css_output();
	}
	/**
	 * Adds var to color output if needed.
	 *
	 * @param string $color the output color.
	 */
	public function kadence_color_output( $color, $opacity = null ) {
		if ( strpos( $color, 'palette' ) === 0 ) {
			$color = 'var(--global-' . $color . ')';
		} else if ( isset( $opacity ) && is_numeric( $opacity ) ) {
			$color = $this->hex2rgba( $color, $opacity );
		}
		return $color;
	}
}
Kadence_Blocks_Frontend::get_instance();
