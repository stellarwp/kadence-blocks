<?php
/**
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Kadence Blocks
 */

include 'advanced-form/advanced-form-frontend.php';

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
	 * Google fonts to enqueue
	 *
	 * @var array
	 */
	public static $footer_gfonts = array();

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
		add_action( 'wp_footer', array( $this, 'frontend_footer_gfonts' ), 90 );
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
		if ( is_admin() ) {
			return $block_content;
		}
		if ( 'kadence/rowlayout' === $block['blockName'] && isset( $block['attrs'] ) ) {
			if ( isset( $block['attrs']['loggedIn'] ) && $block['attrs']['loggedIn'] && is_user_logged_in() ) {
				$hide = true;
				if ( isset( $block['attrs']['loggedInUser'] ) && is_array( $block['attrs']['loggedInUser'] ) && ! empty( $block['attrs']['loggedInUser'] ) ) {
					$user = wp_get_current_user();
					foreach ( $block['attrs']['loggedInUser'] as $key => $role ) {
						if ( in_array( $role['value'], (array) $user->roles ) ) {
							return '';
						} else {
							$hide = false;
						}
					}
				}
				if ( isset( $block['attrs']['loggedInShow'] ) && is_array( $block['attrs']['loggedInShow'] ) && ! empty( $block['attrs']['loggedInShow'] ) ) {
					$user       = wp_get_current_user();
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
			if ( function_exists( 'rcp_user_has_access' ) && isset( $block['attrs']['rcpMembership'] ) && $block['attrs']['rcpMembership'] ) {
				if ( ! is_user_logged_in() ) {
					return '';
				}
				$hide         = true;
				$access_level = (int) ( isset( $block['attrs']['rcpAccess'] ) ? $block['attrs']['rcpAccess'] : '0' );
				if ( rcp_user_has_access( get_current_user_id(), $access_level ) ) {
					$hide = false;
				}
				if ( $hide ) {
					return '';
				}
				if ( isset( $block['attrs']['rcpMembershipLevel'] ) && ! empty( $block['attrs']['rcpMembershipLevel'] ) && is_array( $block['attrs']['rcpMembershipLevel'] ) ) {
					$hide = true;
					foreach ( $block['attrs']['rcpMembershipLevel'] as $key => $level ) {
						if ( in_array( $level['value'], rcp_get_customer_membership_level_ids() ) ) {
							$hide = false;
						}
					}
				}
				if ( $hide ) {
					return '';
				}
			}
		}

		return $block_content;
	}

	/**
	 * Adds a filter to the head filter for compatibility with toolset.
	 *
	 * @param boolean $render_inline_css
	 * @param string $block_name
	 * @param array $attributes
	 *
	 * @return boolean
	 */
	public function add_toolset_depreciated_filter_compatibility( $render_css, $block_name, $attributes ) {
		$unique_id = ( ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '' );

		return apply_filters( 'kadence_blocks_render_inline_css', $render_css, $block_name, $unique_id );
	}

	/**
	 * On init startup.
	 */
	public function on_init() {
		if ( defined( 'TOOLSET_VERSION' ) ) {
			add_filter( 'kadence_blocks_render_head_css', array(
				$this,
				'add_toolset_depreciated_filter_compatibility'
			), 10, 3 );
		}
		// Only load if Gutenberg is available.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/column/block.json',
			array(
				'render_callback' => array( $this, 'render_column_layout_css' ),
				'editor_script'   => 'kadence-blocks-column',
				'editor_style'    => 'kadence-blocks-column',
			)
		);
		add_filter( 'excerpt_allowed_blocks', array( $this, 'add_blocks_to_excerpt' ), 20 );
		add_filter( 'excerpt_allowed_wrapper_blocks', array( $this, 'add_wrapper_blocks_to_excerpt' ), 20 );
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
	 * Allow Columns to be looked at for inner content.
	 *
	 * @param array $allowed inner blocks.
	 */
	public function add_wrapper_blocks_to_excerpt( $allowed ) {
		$allowed = array_merge( $allowed, apply_filters( 'kadence_blocks_allowed_excerpt_blocks', array(
			'kadence/rowlayout',
			'kadence/column'
		) ) );

		return $allowed;
	}

	/**
	 * Render Inline CSS helper function
	 *
	 * @param array $css the css for each rendered block.
	 * @param string $style_id the unique id for the rendered style.
	 * @param bool $in_content the bool for whether or not it should run in content.
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
	 * Check if block stylesheet should render inline.
	 *
	 * @param string $name the stylesheet name.
	 */
	public function should_render_inline_stylesheet( $name ) {
		if ( ! is_admin() && ! wp_style_is( $name, 'done' ) ) {
			if ( function_exists( 'wp_is_block_theme' ) ) {
				if ( ! doing_filter( 'the_content' ) && ! wp_is_block_theme() ) {
					wp_print_styles( $name );
				}
			} elseif ( ! doing_filter( 'the_content' ) ) {
				wp_print_styles( $name );
			}
		}
	}

	/**
	 * Render Column Block CSS Head
	 *
	 * @param array $attributes the blocks attributes.
	 */
	public function render_column_layout_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-column', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-column' );
		}
		if ( isset( $attributes['uniqueID'] ) && ! empty( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-column' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_head_css', true, 'column', $attributes ) ) {
				// Filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_column_render_block_attributes', $attributes );
				$css        = $this->column_layout_css( $attributes, $unique_id );
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
	 * @param array $attributes the blocks attributes.
	 * @param string $content the blocks content.
	 */
	public function render_column_layout_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-column', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-column' );
		}
		$attributes = apply_filters( 'kadence_blocks_column_render_block_attributes', $attributes );
		if ( isset( $attributes['uniqueID'] ) && ! empty( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
		} else {
			$unique_id = rand( 100, 10000 );
			$pos       = strpos( $content, 'inner-column-' );
			if ( false !== $pos ) {
				$content = substr_replace( $content, 'kadence-column' . $unique_id . ' inner-column-', $pos, strlen( 'inner-column-' ) );
			}
		}
		$style_id = 'kb-column' . esc_attr( $unique_id );
		if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'column', $unique_id ) ) {
			// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
			$attributes = apply_filters( 'kadence_blocks_column_render_block_attributes', $attributes );
			$this->should_render_inline_stylesheet( 'kadence-blocks-column' );
			$css = $this->column_layout_css( $attributes, $unique_id );
			if ( ! empty( $css ) ) {
				if ( $this->should_render_inline( 'column', $unique_id ) ) {
					$content = '<style id="' . $style_id . '">' . $css . '</style>' . $content;
				} else {
					$this->render_inline_css( $css, $style_id, true );
				}
			}
		};

		return $content;
	}

	/**
	 * Check if block should render inline.
	 *
	 * @param string $name the blocks name.
	 * @param string $unique_id the blocks unique id.
	 */
	public function should_render_inline( $name, $unique_id ) {
		if ( ( doing_filter( 'the_content' ) && ! is_feed() ) || apply_filters( 'kadence_blocks_force_render_inline_css_in_content', false, $name, $unique_id ) || is_customize_preview() ) {
			return true;
		}

		return false;
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
					if ( ! empty( $inner_block['innerHTML'] ) ) {
						$inner_html = trim( strip_tags( $inner_block['innerHTML'], '<a><strong><br><h2><h3><h4><h5><ul><li><ol><p>' ) );
						if ( ! empty( $inner_html ) ) {
							$answer .= $inner_html;
						}
					}
					if ( isset( $inner_block['innerBlocks'] ) && is_array( $inner_block['innerBlocks'] ) && ! empty ( $inner_block['innerBlocks'] ) ) {
						foreach ( $inner_block['innerBlocks'] as $again_inner_key => $again_inner_block ) {
							if ( ! empty( $again_inner_block['innerHTML'] ) ) {
								$inner_html = trim( strip_tags( $again_inner_block['innerHTML'], '<a><strong><br><h2><h3><h4><h5><ul><li><ol><p>' ) );
								if ( ! empty( $inner_html ) ) {
									$answer .= $inner_html;
								}
							}
							if ( isset( $again_inner_block['innerBlocks'] ) && is_array( $again_inner_block['innerBlocks'] ) && ! empty ( $again_inner_block['innerBlocks'] ) ) {
								foreach ( $again_inner_block['innerBlocks'] as $again_again_inner_key => $again_again_inner_block ) {
									if ( ! empty( $again_again_inner_block['innerHTML'] ) ) {
										$inner_html = trim( strip_tags( $again_again_inner_block['innerHTML'], '<a><strong><br><h2><h3><h4><h5><ul><li><ol><p>' ) );
										if ( ! empty( $inner_html ) ) {
											$answer .= $inner_html;
										}
									}
								}
							}
						}
					}
				}
				preg_match( '/<span class="kt-blocks-accordion-title">(.*?)<\/span>/s', $block['innerHTML'], $match );
				$question = ( $match && isset( $match[1] ) && ! empty( $match[1] ) ? $match[1] : '' );
				if ( strpos( self::$faq_schema, '}]}</script>' ) !== false ) {
					$schema = ',';
				} else {
					$schema = '';
				}
				$schema           .= '{"@type":"Question","name": "' . esc_attr( $question ) . '","acceptedAnswer":{"@type": "Answer","text": "' . str_replace( '"', '&quot;', $answer ) . '"}}';
				$question_schema  = ( ! empty( $question ) && ! empty( $answer ) ? $schema . ']}</script>' : ']}</script>' );
				self::$faq_schema = str_replace( "]}</script>", $question_schema, self::$faq_schema );
			}
		}
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
		$prefix = rest_get_url_prefix();
		if ( ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || ( isset( $_GET['rest_route'] ) && strpos( $_GET['rest_route'], '/', 0 ) === 0 ) ) {
			return true;
		}
		// (#3).
		global $wp_rewrite;
		if ( $wp_rewrite === null ) {
			$wp_rewrite = new WP_Rewrite();
		}
		// (#4).
		$rest_url    = wp_parse_url( trailingslashit( rest_url() ) );
		$current_url = wp_parse_url( add_query_arg( array() ) );

		if ( isset( $current_url['path'] ) && isset( $rest_url['path'] ) ) {
			return strpos( $current_url['path'], $rest_url['path'], 0 ) === 0;
		}
		return false;
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
		wp_register_style( 'kadence-blocks-column', KADENCE_BLOCKS_URL . 'dist/style-blocks-column.css', array(), KADENCE_BLOCKS_VERSION );

		// Next all the extras that are shared.
		wp_register_style( 'kadence-simplelightbox-css', KADENCE_BLOCKS_URL . 'includes/assets/css/simplelightbox.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-simplelightbox', KADENCE_BLOCKS_URL . 'includes/assets/js/simplelightbox.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-videolight-js', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-init-video-popup.min.js', array( 'kadence-simplelightbox' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'magnific-popup', KADENCE_BLOCKS_URL . 'includes/assets/js/jquery.magnific-popup.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-gallery-magnific-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-gallery-magnific-init.min.js', array(
			'jquery',
			'magnific-popup'
		), KADENCE_BLOCKS_VERSION, true );
	}

	/**
	 * Registers and enqueue's script.
	 *
	 * @param string $handle the handle for the script.
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
	 * @param string $handle the handle for the script.
	 */
	public function enqueue_style( $handle ) {
		if ( ! wp_style_is( $handle, 'registered' ) ) {
			$this->register_scripts();
		}
		wp_enqueue_style( $handle );
		if ( 'kadence-blocks-icon' === $handle ) {
			$icon_css = '.kt-svg-style-stacked .kt-svg-icon{border:0px solid #444444;transition:all .3s ease-in-out}.kt-svg-icon-wrap{display:-webkit-inline-flex;display:inline-flex}.kt-svg-icon-wrap a.kt-svg-icon-link{display:block;border:0;text-decoration:none;box-shadow:none}.kt-svg-icon-wrap a.kt-svg-icon-link:hover{box-shadow:none}.kb-icon-valign-top{-webkit-align-items:flex-start;align-items:flex-start;display:-webkit-flex;display:flex}.kb-icon-valign-middle{-webkit-align-items:center;align-items:center;display:-webkit-flex;display:flex}.kb-icon-valign-bottom{-webkit-align-items:flex-end;align-items:flex-end;display:-webkit-flex;display:flex}';
			wp_add_inline_style( 'kadence-blocks-icon', $icon_css );
		}
		if ( 'kadence-blocks-heading' === $handle ) {
			$heading_css = '.wp-block-kadence-advancedheading mark{color:#f76a0c;background:transparent;border-style:solid;border-width:0}';
			// Short term fix for an issue with heading wrapping.
			if ( class_exists( '\Kadence\Theme' ) ) {
				$heading_css .= '.single-content .kadence-advanced-heading-wrapper h1, .single-content .kadence-advanced-heading-wrapper h2, .single-content .kadence-advanced-heading-wrapper h3, .single-content .kadence-advanced-heading-wrapper h4, .single-content .kadence-advanced-heading-wrapper h5, .single-content .kadence-advanced-heading-wrapper h6 {margin: 1.5em 0 .5em;}.single-content .kadence-advanced-heading-wrapper+* { margin-top:0;}';
			}
			wp_add_inline_style( 'kadence-blocks-heading', $heading_css );
		}
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
		$this->print_gfonts( self::$gfonts );
	}

	/**
	 * Load the front end Google Fonts
	 */
	public function frontend_footer_gfonts() {
		if ( empty( self::$footer_gfonts ) ) {
			return;
		}
		$print_google_fonts = apply_filters( 'kadence_blocks_print_footer_google_fonts', true );
		if ( ! $print_google_fonts ) {
			return;
		}
		$this->print_gfonts( self::$footer_gfonts );
	}

	/**
	 * Print gFonts
	 */
	public function print_gfonts( $gfonts ) {
		$link    = '';
		$subsets = array();
		foreach ( $gfonts as $key => $gfont_values ) {
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
					if ( ! empty( $subset ) && ! in_array( $subset, $subsets ) ) {
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
						$add_font                      = array(
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
						$new_css .= $fontkey . ' {';
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
							$new_css .= $fontkey . ' {';
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
							$new_css .= $fontkey . ' {';
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
			$blocks = parse_blocks( $post_object->post_content );
			if ( ! is_array( $blocks ) || empty( $blocks ) ) {
				return;
			}
			$kadence_blocks = apply_filters( 'kadence_blocks_blocks_to_generate_post_css', array() );
			foreach ( $blocks as $indexkey => $block ) {
				$block = apply_filters( 'kadence_blocks_frontend_build_css', $block );
				if ( ! is_object( $block ) && is_array( $block ) && isset( $block['blockName'] ) ) {
					if ( isset( $kadence_blocks[ $block['blockName'] ] ) ) {
						$block_class_instance = $kadence_blocks[ $block['blockName'] ]::get_instance();
						$block_class_instance->output_head_data( $block );
					}
					if ( 'kadence/column' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_column_layout_css_head( $blockattr );
						}
					}
					/** !!!! Needs to stay to build schema !!! **/
					if ( 'kadence/pane' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							if ( isset( $block['attrs']['faqSchema'] ) && $block['attrs']['faqSchema'] ) {
								$this->render_pane_scheme_head( $block );
							}
						}
					}
					if ( 'core/block' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							if ( isset( $blockattr['ref'] ) ) {
								$reusable_block = get_post( $blockattr['ref'] );
								if ( $reusable_block && 'wp_block' == $reusable_block->post_type ) {
									$reuse_data_block = parse_blocks( $reusable_block->post_content );
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
			$inner_block = apply_filters( 'kadence_blocks_frontend_build_css', $inner_block );
			if ( ! is_object( $inner_block ) && is_array( $inner_block ) && isset( $inner_block['blockName'] ) ) {
				if ( 'kadence/column' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_column_layout_css_head( $blockattr );
					}
				}
				if ( 'kadence/pane' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						if ( isset( $inner_block['attrs']['faqSchema'] ) && $inner_block['attrs']['faqSchema'] ) {
							$this->render_pane_scheme_head( $inner_block );
						}
					}
				}
				if ( 'core/block' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						if ( isset( $blockattr['ref'] ) ) {
							$reusable_block = get_post( $blockattr['ref'] );
							if ( $reusable_block && 'wp_block' == $reusable_block->post_type ) {
								$reuse_data_block = parse_blocks( $reusable_block->post_content );
								// This is a block inside itself.
								if ( isset( $reuse_data_block[0] ) && isset( $reuse_data_block[0]['blockName'] ) && 'core/block' === $reuse_data_block[0]['blockName'] && isset( $reuse_data_block[0]['attrs'] ) && isset( $reuse_data_block[0]['attrs']['ref'] ) && $reuse_data_block[0]['attrs']['ref'] === $blockattr['ref'] ) {
									return;
								}
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
		$media_query['desktop'] = apply_filters( 'kadence_desktop_media_query', '(min-width: 1025px)' );
		// Style.
		if ( ! empty( $attr['maxWidth'][0] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attr['maxWidth'][0] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
			// Backward compatablity.
			$css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '1 ' . $attr['maxWidth'][0] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column.kb-section-dir-horizontal>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '0 1 ' . $attr['maxWidth'][0] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'max-width', 'unset' );
			$css->add_property( 'margin-left', 'unset' );
			$css->add_property( 'margin-right', 'unset' );
		}
		if ( ! empty( $attr['sticky'] ) && true === $attr['sticky'] ) {
			$css->set_selector( '#wrapper.site' );
			$css->add_property( 'overflow', 'clip' );
			if ( ! empty( $attr['stickyOffset'][0] ) ) {
				$css->set_selector( '.kadence-column' . $unique_id );
				$css->add_property( '--kb-section-setting-offset', $attr['stickyOffset'][0] . ( isset( $attr['stickyOffsetUnit'] ) ? $attr['stickyOffsetUnit'] : 'px' ) );
			}
		}
		if ( ! empty( $attr['stickyOffset'][1] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( '--kb-section-setting-offset', $attr['stickyOffset'][1] . ( isset( $attr['stickyOffsetUnit'] ) ? $attr['stickyOffsetUnit'] : 'px' ) );
			$css->stop_media_query();
		}
		if ( ! empty( $attr['stickyOffset'][2] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( '--kb-section-setting-offset', $attr['stickyOffset'][2] . ( isset( $attr['stickyOffsetUnit'] ) ? $attr['stickyOffsetUnit'] : 'px' ) );
			$css->stop_media_query();
		}
		if ( ! empty( $attr['sticky'] ) && true === $attr['sticky'] ) {
			$css->set_selector( '#wrapper.site' );
			$css->add_property( 'overflow', 'clip' );
			if ( ! empty( $attr['stickyOffset'][0] ) ) {
				$css->set_selector( '.kadence-column' . $unique_id );
				$css->add_property( '--kb-section-setting-offset', $attr['stickyOffset'][0] . ( isset( $attr['stickyOffsetUnit'] ) ? $attr['stickyOffsetUnit'] : 'px' ) );
			}
		}
		if ( ! empty( $attr['stickyOffset'][1] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( '--kb-section-setting-offset', $attr['stickyOffset'][1] . ( isset( $attr['stickyOffsetUnit'] ) ? $attr['stickyOffsetUnit'] : 'px' ) );
			$css->stop_media_query();
		}
		if ( ! empty( $attr['stickyOffset'][2] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( '--kb-section-setting-offset', $attr['stickyOffset'][2] . ( isset( $attr['stickyOffsetUnit'] ) ? $attr['stickyOffsetUnit'] : 'px' ) );
			$css->stop_media_query();
		}

		$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
		$css->render_measure_output( $attr, 'padding', 'padding', array(
			'unit_key' => 'paddingType'
		) );

		$css->render_measure_output( $attr, 'margin', 'margin', array(
			'unit_key' => 'marginType'
		) );

		if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) || isset( $attr['rightMargin'] ) || isset( $attr['leftMargin'] ) || ! empty( $attr['height'][0] ) || isset( $attr['border'] ) || isset( $attr['borderRadius'] ) || isset( $attr['borderWidth'] ) || ( isset( $attr['displayShadow'] ) && true == $attr['displayShadow'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( ! empty( $attr['height'][0] ) ) {
				$css->add_property( 'min-height', $attr['height'][0] . ( isset( $attr['heightUnit'] ) ? $attr['heightUnit'] : 'px' ) );
			}
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
		if ( isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) || isset( $attr['rightMargin'] ) || isset( $attr['leftMargin'] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
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
		}
		// Hover Styles.
		if ( isset( $attr['borderHover'] ) || isset( $attr['borderHoverRadius'] ) || isset( $attr['borderHoverWidth'] ) || ( isset( $attr['displayHoverShadow'] ) && true == $attr['displayHoverShadow'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
			if ( isset( $attr['borderHover'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attr['borderHover'] ) );
			}
			if ( isset( $attr['borderHoverWidth'] ) && ! empty( $attr['borderHoverWidth'] ) && is_array( $attr['borderHoverWidth'] ) ) {
				if ( isset( $attr['borderHoverWidth'][0] ) && is_numeric( $attr['borderHoverWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['borderHoverWidth'][0] . 'px' );
				}
				if ( isset( $attr['borderHoverWidth'][1] ) && is_numeric( $attr['borderHoverWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['borderHoverWidth'][1] . 'px' );
				}
				if ( isset( $attr['borderHoverWidth'][2] ) && is_numeric( $attr['borderHoverWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['borderHoverWidth'][2] . 'px' );
				}
				if ( isset( $attr['borderHoverWidth'][3] ) && is_numeric( $attr['borderHoverWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['borderHoverWidth'][3] . 'px' );
				}
			}
			if ( isset( $attr['borderHoverRadius'] ) && ! empty( $attr['borderHoverRadius'] ) && is_array( $attr['borderHoverRadius'] ) ) {
				if ( isset( $attr['borderHoverRadius'][0] ) && is_numeric( $attr['borderHoverRadius'][0] ) ) {
					$css->add_property( 'border-top-left-radius', $attr['borderHoverRadius'][0] . 'px' );
				}
				if ( isset( $attr['borderHoverRadius'][1] ) && is_numeric( $attr['borderHoverRadius'][1] ) ) {
					$css->add_property( 'border-top-right-radius', $attr['borderHoverRadius'][1] . 'px' );
				}
				if ( isset( $attr['borderHoverRadius'][2] ) && is_numeric( $attr['borderHoverRadius'][2] ) ) {
					$css->add_property( 'border-bottom-right-radius', $attr['borderHoverRadius'][2] . 'px' );
				}
				if ( isset( $attr['borderHoverRadius'][3] ) && is_numeric( $attr['borderHoverRadius'][3] ) ) {
					$css->add_property( 'border-bottom-left-radius', $attr['borderHoverRadius'][3] . 'px' );
				}
			}
			if ( isset( $attr['displayHoverShadow'] ) && true == $attr['displayHoverShadow'] ) {
				if ( isset( $attr['shadowHover'] ) && is_array( $attr['shadowHover'] ) && isset( $attr['shadowHover'][0] ) && is_array( $attr['shadowHover'][0] ) ) {
					$css->add_property( 'box-shadow', ( isset( $attr['shadowHover'][0]['inset'] ) && true === $attr['shadowHover'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attr['shadowHover'][0]['hOffset'] ) && is_numeric( $attr['shadowHover'][0]['hOffset'] ) ? $attr['shadowHover'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attr['shadowHover'][0]['vOffset'] ) && is_numeric( $attr['shadowHover'][0]['vOffset'] ) ? $attr['shadowHover'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attr['shadowHover'][0]['blur'] ) && is_numeric( $attr['shadowHover'][0]['blur'] ) ? $attr['shadowHover'][0]['blur'] : '14' ) . 'px ' . ( isset( $attr['shadowHover'][0]['spread'] ) && is_numeric( $attr['shadowHover'][0]['spread'] ) ? $attr['shadowHover'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attr['shadowHover'][0]['color'] ) && ! empty( $attr['shadowHover'][0]['color'] ) ? $attr['shadowHover'][0]['color'] : '#000000' ), ( isset( $attr['shadowHover'][0]['opacity'] ) && is_numeric( $attr['shadowHover'][0]['opacity'] ) ? $attr['shadowHover'][0]['opacity'] : 0.2 ) ) );
				} else {
					$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
				}
			}
		}
		// Direction Styles.
		$desktop_direction = ( isset( $attr['direction'] ) && is_array( $attr['direction'] ) && ! empty( $attr['direction'][0] ) ? $attr['direction'][0] : 'vertical' );
		if ( $desktop_direction === 'horizontal' ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$css->add_property( 'display', 'flex' );
			$css->add_property( 'flex-direction', 'row' );
			$css->add_property( 'flex-wrap', 'wrap' );
			$align = ! empty( $attr['verticalAlignment'] ) ? $attr['verticalAlignment'] : 'center';
			switch ( $align ) {
				case 'top':
					$align = 'flex-start';
					break;
				case 'bottom':
					$align = 'flex-end';
					break;
				default:
					$align = 'center';
					break;
			}
			$css->add_property( 'align-items', $align );
			if ( isset( $attr['justifyContent'] ) && is_array( $attr['justifyContent'] ) && ! empty( $attr['justifyContent'][0] ) ) {
				$css->add_property( 'justify-content', $attr['justifyContent'][0] );
			} else if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && ! empty( $attr['textAlign'][0] ) ) {
				switch ( $attr['textAlign'][0] ) {
					case 'left':
						$justify = 'flex-start';
						break;
					case 'right':
						$justify = 'flex-end';
						break;
					default:
						$justify = 'center';
						break;
				}
				$css->add_property( 'justify-content', $justify );
			}
			if ( isset( $attr['wrapContent'] ) && is_array( $attr['wrapContent'] ) && ! empty( $attr['wrapContent'][0] ) ) {
				$css->add_property( 'flex-wrap', $attr['wrapContent'][0] );
			}
			$gutter      = isset( $attr['gutter'] ) && is_array( $attr['gutter'] ) && isset( $attr['gutter'][0] ) && is_numeric( $attr['gutter'][0] ) ? $attr['gutter'][0] : 10;
			$gutter_unit = ! empty( $attr['gutterUnit'] ) ? $attr['gutterUnit'] : 'px';
			$css->add_property( 'gap', $gutter . $gutter_unit );
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > *, .kadence-column' . $unique_id . ' > .kt-inside-inner-col > figure.wp-block-image, .kadence-column' . $unique_id . ' > .kt-inside-inner-col > figure.wp-block-kadence-image' );
			$css->add_property( 'margin-top', '0px' );
			$css->add_property( 'margin-bottom', '0px' );
		} else {
			if ( ! empty( $attr['verticalAlignment'] ) ) {
				switch ( $attr['verticalAlignment'] ) {
					case 'top':
						$align = 'flex-start';
						break;
					case 'bottom':
						$align = 'flex-end';
						break;
					default:
						$align = 'center';
						break;
				}
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'justify-content', $align );
				$css->add_property( 'flex-direction', 'column' );
				$css->add_property( 'display', 'flex' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > .aligncenter' );
				$css->add_property( 'width', '100%' );
			}
		}
		// inside of Row.
		if ( ! empty( $attr['verticalAlignment'] ) ) {
			switch ( $attr['verticalAlignment'] ) {
				case 'top':
					$align = 'flex-start';
					break;
				case 'bottom':
					$align = 'flex-end';
					break;
				default:
					$align = 'center';
					break;
			}
			$css->set_selector( '.kt-row-column-wrap > .kadence-column' . $unique_id );
			$css->add_property( 'align-self', $align );
			$css->set_selector( '.kt-inner-column-height-full:not(.kt-has-1-columns) > .wp-block-kadence-column.kadence-column' . $unique_id );
			$css->add_property( 'align-self', 'auto' );
			$css->set_selector( '.kt-inner-column-height-full:not(.kt-has-1-columns) > .wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$css->add_property( 'display', 'flex' );
			$css->add_property( 'flex-direction', 'column' );
			$css->add_property( 'justify-content', $align );
		}
		// Background.
		if ( isset( $attr['background'] ) && ! empty( $attr['background'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$alpha = ( isset( $attr['backgroundOpacity'] ) && is_numeric( $attr['backgroundOpacity'] ) ? $attr['backgroundOpacity'] : 1 );
			$css->add_property( 'background-color', $css->render_color( $attr['background'], $alpha ) );
		}
		if ( isset( $attr['backgroundImg'] ) && is_array( $attr['backgroundImg'] ) && isset( $attr['backgroundImg'][0] ) && is_array( $attr['backgroundImg'][0] ) && isset( $attr['backgroundImg'][0]['bgImg'] ) && ! empty( $attr['backgroundImg'][0]['bgImg'] ) ) {
			$bg_img = $attr['backgroundImg'][0];
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img['bgImgSize'] ) ? $bg_img['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img['bgImgPosition'] ) ? $bg_img['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img['bgImgAttachment'] ) ? $bg_img['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img['bgImgRepeat'] ) ? $bg_img['bgImgRepeat'] : 'no-repeat' ) );
		}
		// Background Hover.
		if ( isset( $attr['backgroundHover'] ) && ! empty( $attr['backgroundHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
			$css->add_property( 'background-color', $css->render_color( $attr['backgroundHover'] ) );
		}
		if ( isset( $attr['backgroundImgHover'] ) && is_array( $attr['backgroundImgHover'] ) && isset( $attr['backgroundImgHover'][0] ) && is_array( $attr['backgroundImgHover'][0] ) && isset( $attr['backgroundImgHover'][0]['bgImg'] ) && ! empty( $attr['backgroundImgHover'][0]['bgImg'] ) ) {
			$bg_img_hover = $attr['backgroundImgHover'][0];
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img_hover['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img_hover['bgImgSize'] ) ? $bg_img_hover['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img_hover['bgImgPosition'] ) ? $bg_img_hover['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img_hover['bgImgAttachment'] ) ? $bg_img_hover['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img_hover['bgImgRepeat'] ) ? $bg_img_hover['bgImgRepeat'] : 'no-repeat' ) );
		}
		// Overlay.
		if ( isset( $attr['overlayOpacity'] ) && is_numeric( $attr['overlayOpacity'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col:before' );
			$css->add_property( 'opacity', $attr['overlayOpacity'] );
		}
		if ( isset( $attr['overlay'] ) && ! empty( $attr['overlay'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col:before' );
			$css->add_property( 'background-color', $css->render_color( $attr['overlay'] ) );
		}
		if ( isset( $attr['overlayImg'] ) && is_array( $attr['overlayImg'] ) && isset( $attr['overlayImg'][0] ) && is_array( $attr['overlayImg'][0] ) && isset( $attr['overlayImg'][0]['bgImg'] ) && ! empty( $attr['overlayImg'][0]['bgImg'] ) ) {
			$bg_img = $attr['overlayImg'][0];
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col:before' );
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img['bgImgSize'] ) ? $bg_img['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img['bgImgPosition'] ) ? $bg_img['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img['bgImgAttachment'] ) ? $bg_img['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img['bgImgRepeat'] ) ? $bg_img['bgImgRepeat'] : 'no-repeat' ) );
		}
		// Overlay Hover.
		if ( isset( $attr['overlayHoverOpacity'] ) && is_numeric( $attr['overlayHoverOpacity'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
			$css->add_property( 'opacity', $attr['overlayHoverOpacity'] );
		}
		if ( isset( $attr['overlayHover'] ) && ! empty( $attr['overlayHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
			$css->add_property( 'background-color', $css->render_color( $attr['overlayHover'] ) );
		}
		if ( isset( $attr['overlayImgHover'] ) && is_array( $attr['overlayImgHover'] ) && isset( $attr['overlayImgHover'][0] ) && is_array( $attr['overlayImgHover'][0] ) && isset( $attr['overlayImgHover'][0]['bgImg'] ) && ! empty( $attr['overlayImgHover'][0]['bgImg'] ) ) {
			$bg_img_hover = $attr['overlayImgHover'][0];
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img_hover['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img_hover['bgImgSize'] ) ? $bg_img_hover['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img_hover['bgImgPosition'] ) ? $bg_img_hover['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img_hover['bgImgAttachment'] ) ? $bg_img_hover['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img_hover['bgImgRepeat'] ) ? $bg_img_hover['bgImgRepeat'] : 'no-repeat' ) );
		}
		// Align.
		if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && isset( $attr['textAlign'][0] ) && ! empty( $attr['textAlign'][0] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'text-align', $attr['textAlign'][0] );
		}
		// Text Colors.
		if ( isset( $attr['textColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ', .kadence-column' . $unique_id . ' h1, .kadence-column' . $unique_id . ' h2, .kadence-column' . $unique_id . ' h3, .kadence-column' . $unique_id . ' h4, .kadence-column' . $unique_id . ' h5, .kadence-column' . $unique_id . ' h6' );
			$css->add_property( 'color', $css->render_color( $attr['textColor'] ) );
		}
		if ( isset( $attr['linkColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a' );
			$css->add_property( 'color', $css->render_color( $attr['linkColor'] ) );
		}
		if ( isset( $attr['linkHoverColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a:hover' );
			$css->add_property( 'color', $css->render_color( $attr['linkHoverColor'] ) );
		}
		// Hover Text colors.
		if ( isset( $attr['textColorHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ', .kadence-column' . $unique_id . ' h1, .kadence-column' . $unique_id . ' h2, .kadence-column' . $unique_id . ' h3, .kadence-column' . $unique_id . ' h4, .kadence-column' . $unique_id . ' h5, .kadence-column' . $unique_id . ' h6' );
			$css->add_property( 'color', $css->render_color( $attr['textColorHover'] ) );
		}
		if ( isset( $attr['linkColorHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a' );
			$css->add_property( 'color', $css->render_color( $attr['linkColorHover'] ) );
		}
		if ( isset( $attr['linkHoverColorHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a:hover' );
			$css->add_property( 'color', $css->render_color( $attr['linkHoverColorHover'] ) );
		}
		if ( isset( $attr['zIndex'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			if ( $attr['zIndex'] === 0 ) {
				$css->add_property( 'z-index', 'auto' );
			} else {
				$css->add_property( 'z-index', $attr['zIndex'] );
			}
			$css->set_selector( 'div:not(.kt-inside-inner-col) > .kadence-column' . $unique_id );
			$css->add_property( 'position', 'relative' );
		}
		$css->start_media_query( $media_query['tablet'] );
		if ( ! empty( $attr['maxWidth'][1] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attr['maxWidth'][1] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '1 ' . $attr['maxWidth'][1] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
		}
		if ( isset( $attr['collapseOrder'] ) ) {
			$css->set_selector( '.kt-row-column-wrap.kt-tab-layout-three-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-tab-layout-two-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-tab-layout-row > .kadence-column' . $unique_id . ', .kadence-column' . $unique_id );
			$css->add_property( 'order', $attr['collapseOrder'] );
		}
		if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && isset( $attr['textAlign'][1] ) && ! empty( $attr['textAlign'][1] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'text-align', $attr['textAlign'][1] );
		}
		$tablet_direction = ( isset( $attr['direction'] ) && is_array( $attr['direction'] ) && ! empty( $attr['direction'][1] ) ? $attr['direction'][1] : '' );
		if ( empty( $tablet_direction ) ) {
			$tablet_direction = ( isset( $attr['direction'] ) && is_array( $attr['direction'] ) && ! empty( $attr['direction'][0] ) ? $attr['direction'][0] : '' );
		}
		if ( 'vertical' === $tablet_direction ) {
			// If desktop horizonal remove margin.
			if ( $desktop_direction === 'horizontal' ) {
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'display', 'block' );
				$css->add_property( 'margin-left', '0px' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > *' );
				$css->add_property( 'margin-left', '0px' );;
			}
		} elseif ( 'horizontal' === $tablet_direction ) {
			if ( $desktop_direction === 'vertical' && ! empty( $attr['verticalAlignment'] ) ) {
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'justify-content', 'inherit' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > .aligncenter' );
				$css->add_property( 'width', 'auto' );
			}
			// If desktop vertical lets add the horizontal css.
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attr['direction'] ) && is_array( $attr['direction'] ) && ! empty( $attr['direction'][0] ) && $attr['direction'][0] === 'vertical' ) {
				$css->add_property( 'display', 'flex' );
				$css->add_property( 'flex-direction', 'row' );
				$css->add_property( 'flex-wrap', 'wrap' );
				$align = ! empty( $attr['verticalAlignment'] ) ? $attr['verticalAlignment'] : 'center';
				switch ( $align ) {
					case 'top':
						$align = 'flex-start';
						break;
					case 'bottom':
						$align = 'flex-end';
						break;
					default:
						$align = 'center';
						break;
				}
				$css->add_property( 'align-items', $align );
			}
			if ( isset( $attr['justifyContent'] ) && is_array( $attr['justifyContent'] ) && ! empty( $attr['justifyContent'][1] ) ) {
				$css->add_property( 'justify-content', $attr['justifyContent'][1] );
			} else if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && ! empty( $attr['textAlign'][1] ) ) {
				switch ( $attr['textAlign'][1] ) {
					case 'left':
						$justify = 'flex-start';
						break;
					case 'right':
						$justify = 'flex-end';
						break;
					default:
						$justify = 'center';
						break;
				}
				$css->add_property( 'justify-content', $justify );
			}
			if ( isset( $attr['wrapContent'] ) && is_array( $attr['wrapContent'] ) && ! empty( $attr['wrapContent'][1] ) ) {
				$css->add_property( 'flex-wrap', $attr['wrapContent'][1] );
			}
			$gutter      = isset( $attr['gutter'] ) && is_array( $attr['gutter'] ) && isset( $attr['gutter'][1] ) && is_numeric( $attr['gutter'][1] ) ? $attr['gutter'][1] : '';
			$gutter_unit = ! empty( $attr['gutterUnit'] ) ? $attr['gutterUnit'] : 'px';
			if ( '' !== $gutter ) {
				$css->add_property( 'gap', $gutter . $gutter_unit );
			}
		}
		if ( isset( $attr['topPaddingT'] ) || isset( $attr['bottomPaddingT'] ) || isset( $attr['leftPaddingT'] ) || isset( $attr['rightPaddingT'] ) || ( isset( $attr['height'][1] ) && is_numeric( $attr['height'][1] ) ) || isset( $attr['tabletBorderWidth'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attr['height'][1] ) && is_numeric( $attr['height'][1] ) ) {
				$css->add_property( 'min-height', $attr['height'][1] . ( isset( $attr['heightUnit'] ) ? $attr['heightUnit'] : 'px' ) );
			}
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
		if ( ! empty( $attr['maxWidth'][2] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ', .wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attr['maxWidth'][2] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
			$css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '1 ' . $attr['maxWidth'][2] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column.kb-section-sm-dir-horizontal>.kt-inside-inner-col>.kadence-column' . $unique_id . ', .wp-block-kadence-column.kb-section-dir-horizontal:not(.kb-section-sm-dir-vertical):not(.kb-section-md-dir-vertical) >.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '0 1 ' . $attr['maxWidth'][2] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'max-width', 'unset' );
			$css->add_property( 'margin-left', 'unset' );
			$css->add_property( 'margin-right', 'unset' );
		} else if ( ! empty( $attr['maxWidth'][1] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attr['maxWidth'][1] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
		} else if ( ! empty( $attr['maxWidth'][0] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attr['maxWidth'][0] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
		}
		if ( isset( $attr['collapseOrder'] ) ) {
			$css->set_selector( '.kt-row-column-wrap.kt-mobile-layout-three-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-mobile-layout-two-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-mobile-layout-row > .kadence-column' . $unique_id );
			$css->add_property( 'order', $attr['collapseOrder'] );
		}
		if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && isset( $attr['textAlign'][2] ) && ! empty( $attr['textAlign'][2] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'text-align', $attr['textAlign'][2] );
		}
		$mobile_direction = ( isset( $attr['direction'] ) && is_array( $attr['direction'] ) && ! empty( $attr['direction'][2] ) ? $attr['direction'][2] : '' );
		if ( empty( $mobile_direction ) ) {
			$mobile_direction = ( isset( $attr['direction'] ) && is_array( $attr['direction'] ) && ! empty( $attr['direction'][1] ) ? $attr['direction'][1] : '' );
		}
		if ( empty( $mobile_direction ) ) {
			$mobile_direction = ( isset( $attr['direction'] ) && is_array( $attr['direction'] ) && ! empty( $attr['direction'][0] ) ? $attr['direction'][0] : '' );
		}
		if ( 'vertical' === $mobile_direction ) {
			// If desktop horizonal remove margin.
			if ( $desktop_direction === 'horizontal' || $tablet_direction === 'horizontal' ) {
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'display', 'block' );
				$css->add_property( 'margin-left', '0px' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > *' );
				$css->add_property( 'margin-left', '0px' );;
			}
		} elseif ( 'horizontal' === $mobile_direction ) {
			if ( $desktop_direction === 'vertical' && ! empty( $attr['verticalAlignment'] ) ) {
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'justify-content', 'inherit' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > .aligncenter' );
				$css->add_property( 'width', 'auto' );
			}
			// If desktop vertical lets add the horizontal css.
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( $desktop_direction === 'vertical' ) {
				$css->add_property( 'display', 'flex' );
				$css->add_property( 'flex-direction', 'row' );
				$css->add_property( 'flex-wrap', 'wrap' );
				$align = ! empty( $attr['verticalAlignment'] ) ? $attr['verticalAlignment'] : 'center';
				switch ( $align ) {
					case 'top':
						$align = 'flex-start';
						break;
					case 'bottom':
						$align = 'flex-end';
						break;
					default:
						$align = 'center';
						break;
				}
				$css->add_property( 'align-items', $align );
			}
			if ( isset( $attr['justifyContent'] ) && is_array( $attr['justifyContent'] ) && ! empty( $attr['justifyContent'][2] ) ) {
				$css->add_property( 'justify-content', $attr['justifyContent'][2] );
			} else if ( isset( $attr['textAlign'] ) && is_array( $attr['textAlign'] ) && ! empty( $attr['textAlign'][2] ) ) {
				switch ( $attr['textAlign'][2] ) {
					case 'left':
						$justify = 'flex-start';
						break;
					case 'right':
						$justify = 'flex-end';
						break;
					default:
						$justify = 'center';
						break;
				}
				$css->add_property( 'justify-content', $justify );
			}
			if ( isset( $attr['wrapContent'] ) && is_array( $attr['wrapContent'] ) && ! empty( $attr['wrapContent'][2] ) ) {
				$css->add_property( 'flex-wrap', $attr['wrapContent'][2] );
			}
			$gutter      = isset( $attr['gutter'] ) && is_array( $attr['gutter'] ) && isset( $attr['gutter'][2] ) && is_numeric( $attr['gutter'][2] ) ? $attr['gutter'][2] : '';
			$gutter_unit = ! empty( $attr['gutterUnit'] ) ? $attr['gutterUnit'] : 'px';
			if ( '' !== $gutter ) {
				$css->add_property( 'gap', $gutter . $gutter_unit );
			}
		}
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || ( isset( $attr['height'][2] ) && is_numeric( $attr['height'][2] ) ) || isset( $attr['mobileBorderWidth'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attr['height'][2] ) && is_numeric( $attr['height'][2] ) ) {
				$css->add_property( 'min-height', $attr['height'][2] . ( isset( $attr['heightUnit'] ) ? $attr['heightUnit'] : 'px' ) );
			}
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
		if ( isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) || isset( $attr['rightMarginM'] ) || isset( $attr['leftMarginM'] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
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
		}
		$css->stop_media_query();
		if ( isset( $attr['kadenceBlockCSS'] ) && ! empty( $attr['kadenceBlockCSS'] ) ) {
			$css->add_css_string( str_replace( 'selector', '.kadence-column' . $unique_id, $attr['kadenceBlockCSS'] ) );
		}

		return $css->css_output();
	}
}

Kadence_Blocks_Frontend::get_instance();
