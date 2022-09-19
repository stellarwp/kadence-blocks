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
			KADENCE_BLOCKS_PATH . 'dist/blocks/image/block.json',
			array(
				'render_callback' => array( $this, 'render_image_css' ),
				'editor_script'   => 'kadence-blocks-image',
				'editor_style'    => 'kadence-blocks-image',
			)
		);
		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/info-box/block.json',
			array(
				'render_callback' => array( $this, 'render_infobox_css' ),
				'editor_script'   => 'kadence-blocks-info-box',
				'editor_style'    => 'kadence-blocks-info-box',
			)
		);
		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/row-layout/block.json',
			array(
				'render_callback' => array( $this, 'render_row_layout_css' ),
				'editor_script'   => 'kadence-blocks-row-layout',
				'editor_style'    => 'kadence-blocks-row-layout',
			)
		);
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
	 * Render Row  Block
	 *
	 * @param array $attributes the blocks attributes.
	 */
	public function render_row_layout_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-rowlayout', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-rowlayout' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-rowlayout' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_head_css', true, 'rowlayout', $attributes ) ) {
				// Filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_rowlayout_render_block_attributes', $attributes );
				$css        = $this->row_layout_array_css( $attributes, $unique_id );
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
	 * @param array $attributes the blocks attributes.
	 * @param string $content the blocks content.
	 */
	public function render_row_layout_css( $attributes, $content ) {
		$attributes = apply_filters( 'kadence_render_row_layout_css_block_attributes', $attributes );
		if ( ! wp_style_is( 'kadence-blocks-rowlayout', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-rowlayout' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-rowlayout' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'rowlayout', $unique_id ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_rowlayout_render_block_attributes', $attributes );
				$this->render_row_layout_scripts( $attributes );
				$this->should_render_inline_stylesheet( 'kadence-blocks-rowlayout' );
				$css = $this->row_layout_array_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( $this->should_render_inline( 'rowlayout', $unique_id ) ) {
						$content = '<style id="' . $style_id . '">' . $css . '</style>' . $content;
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
	 * Render Info Block CSS in Head
	 *
	 * @param array $attributes the blocks attributes.
	 */
	public function render_icon_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-icon', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-icon' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-icon' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_head_css', true, 'icon', $attributes ) ) {
				// Filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_icon_render_block_attributes', $attributes );
				$css        = $this->blocks_icon_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}

	/**
	 * Render Icon CSS
	 *
	 * @param array $attributes the blocks attributes.
	 * @param string $content the blocks content.
	 */
	public function render_icon_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-icon', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-icon' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-icon' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'icon', $unique_id ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_icon_render_block_attributes', $attributes );
				$css        = $this->blocks_icon_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( $this->should_render_inline( 'icon', $unique_id ) ) {
						$content = '<style id="' . $style_id . '">' . $css . '</style>' . $content;
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
	 * @param array $attributes the blocks attributes.
	 */
	public function render_infobox_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-infobox', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-infobox' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-infobox' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_head_css', true, 'infobox', $attributes ) ) {
				// Filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_infobox_render_block_attributes', $attributes );
				$css        = $this->blocks_infobox_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
			}
		}
	}

	/**
	 * Render Info Block CSS
	 *
	 * @param array $attributes the blocks attributes.
	 * @param string $content the blocks content.
	 */
	public function render_infobox_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-infobox', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-infobox' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-infobox' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'infobox', $unique_id ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_infobox_render_block_attributes', $attributes );
				$this->should_render_inline_stylesheet( 'kadence-blocks-infobox' );
				$css = $this->blocks_infobox_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( $this->should_render_inline( 'infobox', $unique_id ) ) {
						$content = '<style id="' . $style_id . '">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}

		return $content;
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
	 * Render Image CSS
	 *
	 * @param array $attributes the blocks attributes.
	 * @param string $content the blocks content.
	 */
	public function render_image_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-image', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-image' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-image' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'image', $unique_id ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_image_render_block_attributes', $attributes );
				$this->should_render_inline_stylesheet( 'kadence-blocks-image' );
				$css = $this->blocks_image_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( $this->should_render_inline( 'image', $unique_id ) ) {
						$content = '<style id="' . $style_id . '">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}

		return $content;
	}

	/**
	 * Render Image CSS
	 *
	 * @param array $attributes the blocks attributes.
	 * @param string $content the blocks content.
	 */
	public function render_image_css_head( $attributes ) {
		if ( ! wp_style_is( 'kadence-blocks-image', 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-image' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id  = 'kb-image' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_head_css', true, 'image', $unique_id ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_image_render_block_attributes', $attributes );
				$css        = $this->blocks_image_array( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					$this->render_inline_css( $css, $style_id );
				}
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
		wp_register_style( 'kadence-blocks-row-layout', KADENCE_BLOCKS_URL . 'dist/style-blocks-row-layout.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-column', KADENCE_BLOCKS_URL . 'dist/style-blocks-column.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-accordion', KADENCE_BLOCKS_URL . 'dist/style-blocks-accordion.css', array(), KADENCE_BLOCKS_VERSION );

		//wp_register_style( 'kadence-blocks-icon', KADENCE_BLOCKS_URL . 'dist/style-blocks-icon.css', array(), KADENCE_BLOCKS_VERSION );
		//wp_register_style( 'kadence-blocks-icon', false );
		wp_register_style( 'kadence-blocks-iconlist', KADENCE_BLOCKS_URL . 'dist/style-blocks-icon-list.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-image', KADENCE_BLOCKS_URL . 'dist/style-blocks-image.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-tabs', KADENCE_BLOCKS_URL . 'dist/style-blocks-tabs.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-infobox', KADENCE_BLOCKS_URL . 'dist/style-blocks-info-box.css', array(), KADENCE_BLOCKS_VERSION );
		//wp_register_style( 'kadence-blocks-heading', KADENCE_BLOCKS_URL . 'dist/style-blocks-heading.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-heading', false );
//		wp_register_style( 'kadence-blocks-advanced-form', KADENCE_BLOCKS_URL . 'dist/style-blocks-advanced-form.css', array(), KADENCE_BLOCKS_VERSION );

		// Next all the extras that are shared.
		wp_register_style( 'kadence-simplelightbox-css', KADENCE_BLOCKS_URL . 'includes/assets/css/simplelightbox.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-simplelightbox', KADENCE_BLOCKS_URL . 'includes/assets/js/simplelightbox.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-videolight-js', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-init-video-popup.min.js', array( 'kadence-simplelightbox' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'magnific-popup', KADENCE_BLOCKS_URL . 'includes/assets/js/jquery.magnific-popup.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-gallery-magnific-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-gallery-magnific-init.min.js', array(
			'jquery',
			'magnific-popup'
		), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'jarallax', KADENCE_BLOCKS_URL . 'includes/assets/js/jarallax.min.js', array(), KADENCE_BLOCKS_VERSION, true );
//		wp_register_script( 'kadence-blocks-advanced-form', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-advanced-form-block.min.js', array(), KADENCE_BLOCKS_VERSION, true );


		wp_register_script( 'kadence-blocks-parallax-js', KADENCE_BLOCKS_URL . 'includes/assets/js/kt-init-parallax.min.js', array( 'jarallax' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_style( 'kadence-blocks-pro-slick', KADENCE_BLOCKS_URL . 'dist/assets/css/kt-blocks-slick.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-slick', KADENCE_BLOCKS_URL . 'includes/assets/js/slick.min.js', array( 'jquery' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-slick-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kt-slick-init.min.js', array(
			'jquery',
			'kadence-slick'
		), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-video-bg', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-init-html-bg-video.min.js', array(), KADENCE_BLOCKS_VERSION, true );
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
	 * Hex to RGBA
	 *
	 * @param string $hex string hex code.
	 * @param number $alpha alpha number.
	 */
	public function hex2rgba( $hex, $alpha ) {
		if ( empty( $hex ) ) {
			return '';
		}
		if ( 'transparent' === $hex ) {
			return $hex;
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
					/** !!!! Needs to stay to build schema !!! **/
					if ( 'kadence/pane' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							if ( isset( $block['attrs']['faqSchema'] ) && $block['attrs']['faqSchema'] ) {
								$this->render_pane_scheme_head( $block );
							}
						}
					}
					if ( 'kadence/image' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_image_css_head( $blockattr );
						}
					}
					if ( 'kadence/infobox' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							$this->render_infobox_css_head( $blockattr );
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
				if ( 'kadence/pane' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						if ( isset( $inner_block['attrs']['faqSchema'] ) && $inner_block['attrs']['faqSchema'] ) {
							$this->render_pane_scheme_head( $inner_block );
						}
					}
				}
				if ( 'kadence/infobox' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_infobox_css_head( $blockattr );
					}
				}
				if ( 'kadence/image' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						$this->render_image_css_head( $blockattr );
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
	 * Builds CSS for Icon block.
	 *
	 * @param array $attr the blocks attr.
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
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_infobox_array( $attr, $unique_id ) {
		if ( isset( $attr['mediaType'] ) && 'number' === $attr['mediaType'] && isset( $attr['mediaNumber'] ) && is_array( $attr['mediaNumber'] ) && isset( $attr['mediaNumber'][0] ) && is_array( $attr['mediaNumber'][0] ) && isset( $attr['mediaNumber'][0]['google'] ) && $attr['mediaNumber'][0]['google'] && ( ! isset( $attr['mediaNumber'][0]['loadGoogle'] ) || true === $attr['mediaNumber'][0]['loadGoogle'] ) && isset( $attr['mediaNumber'][0]['family'] ) ) {
			$number_font = $attr['mediaNumber'][0];
			$this->add_gfont(
				array(
					'googleFont'     => ( isset( $number_font['google'] ) ? $number_font['google'] : false ),
					'loadGoogleFont' => ( isset( $number_font['loadGoogle'] ) ? $number_font['loadGoogle'] : true ),
					'typography'     => ( isset( $number_font['family'] ) ? $number_font['family'] : '' ),
					'fontVariant'    => ( isset( $number_font['variant'] ) ? $number_font['variant'] : '' ),
					'fontSubset'     => ( isset( $number_font['subset'] ) ? $number_font['subset'] : '' ),
					'loadItalic'     => false,
				)
			);
		}

		if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && isset( $attr['titleFont'][0]['google'] ) && $attr['titleFont'][0]['google'] && ( ! isset( $attr['titleFont'][0]['loadGoogle'] ) || true === $attr['titleFont'][0]['loadGoogle'] ) && isset( $attr['titleFont'][0]['family'] ) ) {
			$title_font = $attr['titleFont'][0];
			$this->add_gfont(
				array(
					'googleFont'     => ( isset( $title_font['google'] ) ? $title_font['google'] : false ),
					'loadGoogleFont' => ( isset( $title_font['loadGoogle'] ) ? $title_font['loadGoogle'] : true ),
					'typography'     => ( isset( $title_font['family'] ) ? $title_font['family'] : '' ),
					'fontVariant'    => ( isset( $title_font['variant'] ) ? $title_font['variant'] : '' ),
					'fontSubset'     => ( isset( $title_font['subset'] ) ? $title_font['subset'] : '' ),
					'loadItalic'     => false,
				)
			);
		}
		if ( isset( $attr['textFont'] ) && is_array( $attr['textFont'] ) && isset( $attr['textFont'][0] ) && is_array( $attr['textFont'][0] ) && isset( $attr['textFont'][0]['google'] ) && $attr['textFont'][0]['google'] && ( ! isset( $attr['textFont'][0]['loadGoogle'] ) || true === $attr['textFont'][0]['loadGoogle'] ) && isset( $attr['textFont'][0]['family'] ) ) {
			$text_font = $attr['textFont'][0];
			$this->add_gfont(
				array(
					'googleFont'     => ( isset( $text_font['google'] ) ? $text_font['google'] : false ),
					'loadGoogleFont' => ( isset( $text_font['loadGoogle'] ) ? $text_font['loadGoogle'] : true ),
					'typography'     => ( isset( $text_font['family'] ) ? $text_font['family'] : '' ),
					'fontVariant'    => ( isset( $text_font['variant'] ) ? $text_font['variant'] : '' ),
					'fontSubset'     => ( isset( $text_font['subset'] ) ? $text_font['subset'] : '' ),
					'loadItalic'     => false,
				)
			);
		}
		if ( isset( $attr['displayLearnMore'] ) && $attr['displayLearnMore'] && isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && isset( $attr['learnMoreStyles'][0] ) && is_array( $attr['learnMoreStyles'][0] ) && isset( $attr['learnMoreStyles'][0]['google'] ) && $attr['learnMoreStyles'][0]['google'] && ( ! isset( $attr['learnMoreStyles'][0]['loadGoogle'] ) || true === $attr['learnMoreStyles'][0]['loadGoogle'] ) && isset( $attr['learnMoreStyles'][0]['family'] ) ) {
			$learn_more_font = $attr['learnMoreStyles'][0];
			$this->add_gfont(
				array(
					'googleFont'     => ( isset( $learn_more_font['google'] ) ? $learn_more_font['google'] : false ),
					'loadGoogleFont' => ( isset( $learn_more_font['loadGoogle'] ) ? $learn_more_font['loadGoogle'] : true ),
					'typography'     => ( isset( $learn_more_font['family'] ) ? $learn_more_font['family'] : '' ),
					'fontVariant'    => ( isset( $learn_more_font['variant'] ) ? $learn_more_font['variant'] : '' ),
					'fontSubset'     => ( isset( $learn_more_font['subset'] ) ? $learn_more_font['subset'] : '' ),
					'loadItalic'     => false,
				)
			);
		}
		$css                    = new Kadence_Blocks_CSS();
		$media_query            = array();
		$media_query['mobile']  = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['tablet']  = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['desktop'] = apply_filters( 'kadence_desktop_media_query', '(min-width: 1025px)' );
		// Style.
		if ( isset( $attr['containerBorder'] ) || isset( $attr['containerBackground'] ) || isset( $attr['containerBackgroundOpacity'] ) || isset( $attr['containerPadding'] ) || isset( $attr['containerMargin'] ) || isset( $attr['containerBorderRadius'] ) || isset( $attr['containerBorderWidth'] ) || isset( $attr['maxWidth'] ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap' );
			if ( isset( $attr['containerBorder'] ) && ! empty( $attr['containerBorder'] ) ) {
				$alpha = ( isset( $attr['containerBorderOpacity'] ) && is_numeric( $attr['containerBorderOpacity'] ) ? $attr['containerBorderOpacity'] : 1 );
				$css->add_property( 'border-color', $css->render_color( $attr['containerBorder'], $alpha ) );
			}
			if ( isset( $attr['containerBorderRadius'] ) && ! empty( $attr['containerBorderRadius'] ) ) {
				$css->add_property( 'border-radius', $attr['containerBorderRadius'] . 'px' );
			}
			if ( isset( $attr['containerBackground'] ) && ! empty( $attr['containerBackground'] ) ) {
				$alpha = ( isset( $attr['containerBackgroundOpacity'] ) && is_numeric( $attr['containerBackgroundOpacity'] ) ? $attr['containerBackgroundOpacity'] : 1 );
				$css->add_property( 'background', $css->render_color( $attr['containerBackground'], $alpha ) );
			} elseif ( isset( $attr['containerBackgroundOpacity'] ) && is_numeric( $attr['containerBackgroundOpacity'] ) ) {
				$alpha = ( isset( $attr['containerBackgroundOpacity'] ) && is_numeric( $attr['containerBackgroundOpacity'] ) ? $attr['containerBackgroundOpacity'] : 1 );
				$css->add_property( 'background', $css->render_color( '#f2f2f2', $alpha ) );
			}
			if ( isset( $attr['containerPadding'] ) && is_array( $attr['containerPadding'] ) ) {
				if ( isset( $attr['containerPadding'][0] ) && is_numeric( $attr['containerPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attr['containerPadding'][0] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['containerPadding'][1] ) && is_numeric( $attr['containerPadding'][1] ) ) {
					$css->add_property( 'padding-right', $attr['containerPadding'][1] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['containerPadding'][2] ) && is_numeric( $attr['containerPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attr['containerPadding'][2] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['containerPadding'][3] ) && is_numeric( $attr['containerPadding'][3] ) ) {
					$css->add_property( 'padding-left', $attr['containerPadding'][3] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) && isset( $attr['containerMargin'][0] ) && is_numeric( $attr['containerMargin'][0] ) ) {
				$unit = ( isset( $attr['containerMarginUnit'] ) && ! empty( $attr['containerMarginUnit'] ) ? $attr['containerMarginUnit'] : 'px' );
				$css->add_property( 'margin-top', $attr['containerMargin'][0] . $unit );
			}
			if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) && isset( $attr['containerMargin'][1] ) && is_numeric( $attr['containerMargin'][1] ) ) {
				$unit = ( isset( $attr['containerMarginUnit'] ) && ! empty( $attr['containerMarginUnit'] ) ? $attr['containerMarginUnit'] : 'px' );
				$css->add_property( 'margin-right', $attr['containerMargin'][1] . $unit );
			}
			if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) && isset( $attr['containerMargin'][2] ) && is_numeric( $attr['containerMargin'][2] ) ) {
				$unit = ( isset( $attr['containerMarginUnit'] ) && ! empty( $attr['containerMarginUnit'] ) ? $attr['containerMarginUnit'] : 'px' );
				$css->add_property( 'margin-bottom', $attr['containerMargin'][2] . $unit );
			}
			if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) && isset( $attr['containerMargin'][3] ) && is_numeric( $attr['containerMargin'][3] ) ) {
				$unit = ( isset( $attr['containerMarginUnit'] ) && ! empty( $attr['containerMarginUnit'] ) ? $attr['containerMarginUnit'] : 'px' );
				$css->add_property( 'margin-left', $attr['containerMargin'][3] . $unit );
			}
			if ( isset( $attr['containerBorderWidth'] ) && is_array( $attr['containerBorderWidth'] ) ) {
				if ( isset( $attr['containerBorderWidth'][0] ) && is_numeric( $attr['containerBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['containerBorderWidth'][0] . 'px' );
				}
				if ( isset( $attr['containerBorderWidth'][1] ) && is_numeric( $attr['containerBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['containerBorderWidth'][1] . 'px' );
				}
				if ( isset( $attr['containerBorderWidth'][2] ) && is_numeric( $attr['containerBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['containerBorderWidth'][2] . 'px' );
				}
				if ( isset( $attr['containerBorderWidth'][3] ) && is_numeric( $attr['containerBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['containerBorderWidth'][3] . 'px' );
				}
			}
			if ( isset( $attr['maxWidth'] ) && ! empty( $attr['maxWidth'] ) ) {
				$unit = ( isset( $attr['maxWidthUnit'] ) && ! empty( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' );
				$css->add_property( 'max-width', $attr['maxWidth'] . $unit );
			}
		}
		if ( isset( $attr['containerTabletPadding'] ) && is_array( $attr['containerTabletPadding'] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap' );
			if ( isset( $attr['containerTabletPadding'][0] ) && is_numeric( $attr['containerTabletPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['containerTabletPadding'][0] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletPadding'][1] ) && is_numeric( $attr['containerTabletPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['containerTabletPadding'][1] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletPadding'][2] ) && is_numeric( $attr['containerTabletPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['containerTabletPadding'][2] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletPadding'][3] ) && is_numeric( $attr['containerTabletPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['containerTabletPadding'][3] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['containerMobilePadding'] ) && is_array( $attr['containerMobilePadding'] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap' );
			if ( isset( $attr['containerMobilePadding'][0] ) && is_numeric( $attr['containerMobilePadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['containerMobilePadding'][0] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobilePadding'][1] ) && is_numeric( $attr['containerMobilePadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['containerMobilePadding'][1] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobilePadding'][2] ) && is_numeric( $attr['containerMobilePadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['containerMobilePadding'][2] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobilePadding'][3] ) && is_numeric( $attr['containerMobilePadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['containerMobilePadding'][3] . ( isset( $attr['containerPaddingType'] ) && ! empty( $attr['containerPaddingType'] ) ? $attr['containerPaddingType'] : 'px' ) );
			}
			$css->stop_media_query();
		}
		$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover' );
		$border_hover = ( isset( $attr['containerHoverBorder'] ) && ! empty( $attr['containerHoverBorder'] ) ? $attr['containerHoverBorder'] : '#eeeeee' );
		$alpha        = ( isset( $attr['containerHoverBorderOpacity'] ) && is_numeric( $attr['containerHoverBorderOpacity'] ) ? $attr['containerHoverBorderOpacity'] : 1 );
		$bg_hover     = ( isset( $attr['containerHoverBackground'] ) && ! empty( $attr['containerHoverBackground'] ) ? $attr['containerHoverBackground'] : '#f2f2f2' );
		$bg_alpha     = ( isset( $attr['containerHoverBackgroundOpacity'] ) && is_numeric( $attr['containerHoverBackgroundOpacity'] ) ? $attr['containerHoverBackgroundOpacity'] : 1 );
		$css->add_property( 'border-color', $css->render_color( $border_hover, $alpha ) );
		$css->add_property( 'background', $css->render_color( $bg_hover, $bg_alpha ) );
		if ( isset( $attr['mediaIcon'] ) && is_array( $attr['mediaIcon'] ) && is_array( $attr['mediaIcon'][0] ) ) {
			$media_icon = $attr['mediaIcon'][0];
		} else {
			$media_icon = array();
		}
		if ( isset( $attr['mediaStyle'] ) && is_array( $attr['mediaStyle'] ) && is_array( $attr['mediaStyle'][0] ) ) {
			$media_style = $attr['mediaStyle'][0];
		} else {
			$media_style = array();
		}
		if ( isset( $attr['mediaImage'] ) && is_array( $attr['mediaImage'] ) && is_array( $attr['mediaImage'][0] ) ) {
			$media_image = $attr['mediaImage'][0];
		} else {
			$media_image = array();
		}
		if ( isset( $attr['mediaNumber'] ) && is_array( $attr['mediaNumber'] ) && is_array( $attr['mediaNumber'][0] ) ) {
			$media_number = $attr['mediaNumber'][0];
		} else {
			$media_number = array();
		}
		if ( isset( $attr['mediaType'] ) && 'image' === $attr['mediaType'] ) {
			if ( isset( $media_image['maxWidth'] ) && ! empty( $media_image['maxWidth'] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kadence-info-box-image-inner-intrisic-container' );
				$css->add_property( 'max-width', $media_image['maxWidth'] . 'px' );
			}
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kadence-info-box-image-inner-intrisic-container .kadence-info-box-image-intrisic' );
			if ( isset( $attr['imageRatio'] ) && ! empty( $attr['imageRatio'] ) && 'inherit' !== $attr['imageRatio'] ) {
				switch ( $attr['imageRatio'] ) {
					case 'land43':
						$image_ratio_padding = '75%';
						break;
					case 'land32':
						$image_ratio_padding = '66.67%';
						break;
					case 'land169':
						$image_ratio_padding = '56.25%';
						break;
					case 'land21':
						$image_ratio_padding = '50%';
						break;
					case 'land31':
						$image_ratio_padding = '33%';
						break;
					case 'land41':
						$image_ratio_padding = '25%';
						break;
					case 'port34':
						$image_ratio_padding = '133.33%';
						break;
					case 'port23':
						$image_ratio_padding = '150%';
						break;
					default:
						$image_ratio_padding = '100%';
						break;
				}
				$css->add_property( 'padding-bottom', $image_ratio_padding );
			} elseif ( isset( $media_image['height'] ) && is_numeric( $media_image['height'] ) && isset( $media_image['width'] ) && is_numeric( $media_image['width'] ) ) {
				$css->add_property( 'padding-bottom', round( ( absint( $media_image['height'] ) / absint( $media_image['width'] ) ) * 100, 4 ) . '%' );
			}
			if ( isset( $media_image['width'] ) && ! empty( $media_image['width'] ) ) {
				$css->add_property( 'width', $media_image['width'] . 'px' );
			}
			if ( isset( $media_image['height'] ) && ! empty( $media_image['height'] ) ) {
				$css->add_property( 'height', '0px' );
			}
			$css->add_property( 'max-width', '100%' );
		}
		if ( isset( $media_image['subtype'] ) && 'svg+xml' === $media_image['subtype'] ) {
			if ( isset( $media_image['maxWidth'] ) && ! empty( $media_image['maxWidth'] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media .kt-info-box-image' );
				$css->add_property( 'width', $media_image['maxWidth'] . 'px' );
				$css->add_property( 'height', 'auto' );
			}
			if ( isset( $media_icon['color'] ) && ! empty( $media_icon['color'] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media .kt-info-box-image, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-media .kt-info-box-image path' );
				$css->add_property( 'fill', $media_icon['color'] );
			}
			if ( isset( $media_icon['hoverColor'] ) && ! empty( $media_icon['hoverColor'] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media .kt-info-box-image, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media .kt-info-box-image path' );
				$css->add_property( 'fill', $media_icon['hoverColor'] );
			}
		}
		if ( isset( $media_icon['size'] ) && ! empty( $media_icon['size'] ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-info-svg-icon, #kt-info-box' . $unique_id . ' .kt-info-svg-icon-flip, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-number' );
			$css->add_property( 'font-size', $media_icon['size'] . 'px' );
		}
		if ( isset( $media_icon['tabletSize'] ) && is_numeric( $media_icon['tabletSize'] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-info-svg-icon, #kt-info-box' . $unique_id . ' .kt-info-svg-icon-flip, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-number' );
			$css->add_property( 'font-size', $media_icon['tabletSize'] . 'px' );
			$css->stop_media_query();
		}
		if ( isset( $media_icon['mobileSize'] ) && is_numeric( $media_icon['mobileSize'] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-info-svg-icon, #kt-info-box' . $unique_id . ' .kt-info-svg-icon-flip, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-number' );
			$css->add_property( 'font-size', $media_icon['mobileSize'] . 'px' );
			$css->stop_media_query();
		}
		if ( ( isset( $media_number['family'] ) && ! empty( $media_number['family'] ) ) || ( isset( $media_number['style'] ) && ! empty( $media_number['style'] ) ) || ( isset( $media_number['weight'] ) && ! empty( $media_number['weight'] ) ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-number' );
			if ( isset( $media_number['family'] ) && ! empty( $media_number['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $media_number['family'] ) );
			}
			if ( isset( $media_number['style'] ) && ! empty( $media_number['style'] ) ) {
				$css->add_property( 'font-style', $media_number['style'] );
			}
			if ( isset( $media_number['weight'] ) && ! empty( $media_number['weight'] ) ) {
				$css->add_property( 'font-weight', $css->render_font_weight( $media_number['weight'] ) );
			}
		}
		$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media' );
		if ( isset( $media_icon['color'] ) && ! empty( $media_icon['color'] ) ) {
			$css->add_property( 'color', $css->render_color( $media_icon['color'] ) );
		}
		if ( isset( $media_style['background'] ) && ! empty( $media_style['background'] ) ) {
			$css->add_property( 'background', $css->render_color( $media_style['background'] ) );
		}
		if ( isset( $media_style['border'] ) && ! empty( $media_style['border'] ) ) {
			$css->add_property( 'border-color', $css->render_color( $media_style['border'] ) );
		}
		if ( isset( $media_style['borderRadius'] ) && ! empty( $media_style['borderRadius'] ) ) {
			$css->add_property( 'border-radius', $media_style['borderRadius'] . 'px' );
		}
		if ( isset( $media_style['borderWidth'] ) && is_array( $media_style['borderWidth'] ) ) {
			if ( isset( $media_style['borderWidth'][0] ) && is_numeric( $media_style['borderWidth'][0] ) ) {
				$css->add_property( 'border-top-width', $media_style['borderWidth'][0] . 'px' );
			}
			if ( isset( $media_style['borderWidth'][1] ) && is_numeric( $media_style['borderWidth'][1] ) ) {
				$css->add_property( 'border-right-width', $media_style['borderWidth'][1] . 'px' );
			}
			if ( isset( $media_style['borderWidth'][2] ) && is_numeric( $media_style['borderWidth'][2] ) ) {
				$css->add_property( 'border-bottom-width', $media_style['borderWidth'][2] . 'px' );
			}
			if ( isset( $media_style['borderWidth'][3] ) && is_numeric( $media_style['borderWidth'][3] ) ) {
				$css->add_property( 'border-left-width', $media_style['borderWidth'][3] . 'px' );
			}
		}
		if ( isset( $media_style['padding'] ) && is_array( $media_style['padding'] ) ) {
			if ( isset( $media_style['padding'][0] ) && is_numeric( $media_style['padding'][0] ) ) {
				$css->add_property( 'padding-top', $media_style['padding'][0] . 'px' );
			}
			if ( isset( $media_style['padding'][1] ) && is_numeric( $media_style['padding'][1] ) ) {
				$css->add_property( 'padding-right', $media_style['padding'][1] . 'px' );
			}
			if ( isset( $media_style['padding'][2] ) && is_numeric( $media_style['padding'][2] ) ) {
				$css->add_property( 'padding-bottom', $media_style['padding'][2] . 'px' );
			}
			if ( isset( $media_style['padding'][3] ) && is_numeric( $media_style['padding'][3] ) ) {
				$css->add_property( 'padding-left', $media_style['padding'][3] . 'px' );
			}
		}
		if ( isset( $media_style['margin'] ) && is_array( $media_style['margin'] ) && isset( $attr['mediaAlign'] ) && 'top' !== $attr['mediaAlign'] ) {
			if ( isset( $media_style['margin'][0] ) && is_numeric( $media_style['margin'][0] ) ) {
				$css->add_property( 'margin-top', $media_style['margin'][0] . 'px' );
			}
			if ( isset( $media_style['margin'][1] ) && is_numeric( $media_style['margin'][1] ) ) {
				$css->add_property( 'margin-right', $media_style['margin'][1] . 'px' );
			}
			if ( isset( $media_style['margin'][2] ) && is_numeric( $media_style['margin'][2] ) ) {
				$css->add_property( 'margin-bottom', $media_style['margin'][2] . 'px' );
			}
			if ( isset( $media_style['margin'][3] ) && is_numeric( $media_style['margin'][3] ) ) {
				$css->add_property( 'margin-left', $media_style['margin'][3] . 'px' );
			}
		}
		if ( isset( $media_style['margin'] ) && is_array( $media_style['margin'] ) && ( ! isset( $attr['mediaAlign'] ) || 'top' === $attr['mediaAlign'] ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media-container' );
			if ( isset( $media_style['margin'][0] ) && is_numeric( $media_style['margin'][0] ) ) {
				$css->add_property( 'margin-top', $media_style['margin'][0] . 'px' );
			}
			if ( isset( $media_style['margin'][1] ) && is_numeric( $media_style['margin'][1] ) ) {
				$css->add_property( 'margin-right', $media_style['margin'][1] . 'px' );
			}
			if ( isset( $media_style['margin'][2] ) && is_numeric( $media_style['margin'][2] ) ) {
				$css->add_property( 'margin-bottom', $media_style['margin'][2] . 'px' );
			}
			if ( isset( $media_style['margin'][3] ) && is_numeric( $media_style['margin'][3] ) ) {
				$css->add_property( 'margin-left', $media_style['margin'][3] . 'px' );
			}
		}
		if ( isset( $media_style['borderRadius'] ) && ! empty( $media_style['borderRadius'] ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media .kadence-info-box-image-intrisic:not(.kb-info-box-image-ratio) img' );
			$css->add_property( 'border-radius', $media_style['borderRadius'] . 'px' );
		}
		$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media' );
		if ( isset( $media_icon['hoverColor'] ) && ! empty( $media_icon['hoverColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $media_icon['hoverColor'] ) );
		}
		if ( isset( $media_style['hoverBackground'] ) && ! empty( $media_style['hoverBackground'] ) ) {
			$css->add_property( 'background', $css->render_color( $media_style['hoverBackground'] ) );
		}
		if ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ) {
			$css->add_property( 'border-color', $css->render_color( $media_style['hoverBorder'] ) );
		}
		if ( ( ( isset( $attr['mediaType'] ) && 'icon' === $attr['mediaType'] || ! isset( $attr['mediaType'] ) ) && isset( $media_icon['hoverAnimation'] ) && 'drawborder' === $media_icon['hoverAnimation'] ) || ( isset( $attr['mediaType'] ) && 'number' === $attr['mediaType'] && isset( $media_number['hoverAnimation'] ) && 'drawborder' === $media_number['hoverAnimation'] ) || ( isset( $attr['mediaType'] ) && 'image' === $attr['mediaType'] && isset( $media_image['hoverAnimation'] ) && ( 'drawborder' === $media_image['hoverAnimation'] || 'grayscale-border-draw' === $media_image['hoverAnimation'] ) ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media' );
			$css->add_property( 'border-width', '0px' );
			if ( isset( $media_style['borderWidth'] ) && is_array( $media_style['borderWidth'] ) ) {
				$css->add_property( 'box-shadow', 'inset 0 0 0 ' . $media_style['borderWidth'][0] . 'px ' . ( isset( $media_style['border'] ) && ! empty( $media_style['border'] ) ? $media_style['border'] : '#444444' ) );
			}
			if ( isset( $media_style['borderRadius'] ) && ! empty( $media_style['borderRadius'] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, #kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after' );
				$css->add_property( 'border-radius', $media_style['borderRadius'] . 'px' );
			}
			if ( isset( $media_style['borderWidth'] ) && is_array( $media_style['borderWidth'] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before' );
				$css->add_property( 'border-width', $media_style['borderWidth'][0] . 'px' );
			}
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after' );
			$css->set_selector( 'border-width', '0px' );
			if ( isset( $media_style['borderWidth'] ) && is_array( $media_style['borderWidth'] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after' );
				$css->add_property( 'border-right-color', ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $css->render_color( $media_style['hoverBorder'] ) : '#444444' ) );
				$css->add_property( 'border-right-width', $media_style['borderWidth'][0] . 'px' );
				$css->add_property( 'border-top-width', $media_style['borderWidth'][0] . 'px' );
				$css->add_property( 'border-bottom-width', $media_style['borderWidth'][0] . 'px' );
			}
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before' );
			$css->add_property( 'border-top-color', ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $css->render_color( $media_style['hoverBorder'] ) : '#444444' ) );
			$css->add_property( 'border-right-color', ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $css->render_color( $media_style['hoverBorder'] ) : '#444444' ) );
			$css->add_property( 'border-bottom-color', ( isset( $media_style['hoverBorder'] ) && ! empty( $media_style['hoverBorder'] ) ? $css->render_color( $media_style['hoverBorder'] ) : '#444444' ) );
		}
		if ( isset( $attr['titleColor'] ) || isset( $attr['titleFont'] ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title' );
			if ( isset( $attr['titleColor'] ) && ! empty( $attr['titleColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attr['titleColor'] ) );
			}
			if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && is_array( $attr['titleFont'][0] ) ) {
				$title_font = $attr['titleFont'][0];
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
				if ( isset( $title_font['weight'] ) && ! empty( $title_font['weight'] ) ) {
					$css->add_property( 'font-weight', $css->render_font_weight( $title_font['weight'] ) );
				}
				if ( isset( $title_font['padding'] ) && is_array( $title_font['padding'] ) ) {
					if ( isset( $title_font['padding'][0] ) && is_numeric( $title_font['padding'][0] ) ) {
						$css->add_property( 'padding-top', $title_font['padding'][0] . 'px' );
					}
					if ( isset( $title_font['padding'][1] ) && is_numeric( $title_font['padding'][1] ) ) {
						$css->add_property( 'padding-right', $title_font['padding'][1] . 'px' );
					}
					if ( isset( $title_font['padding'][2] ) && is_numeric( $title_font['padding'][2] ) ) {
						$css->add_property( 'padding-bottom', $title_font['padding'][2] . 'px' );
					}
					if ( isset( $title_font['padding'][3] ) && is_numeric( $title_font['padding'][3] ) ) {
						$css->add_property( 'padding-left', $title_font['padding'][3] . 'px' );
					}
				}
				if ( isset( $title_font['margin'] ) && is_array( $title_font['margin'] ) ) {
					if ( isset( $title_font['margin'][0] ) && is_numeric( $title_font['margin'][0] ) ) {
						$css->add_property( 'margin-top', $title_font['margin'][0] . 'px' );
					}
					if ( isset( $title_font['margin'][1] ) && is_numeric( $title_font['margin'][1] ) ) {
						$css->add_property( 'margin-right', $title_font['margin'][1] . 'px' );
					}
					if ( isset( $title_font['margin'][2] ) && is_numeric( $title_font['margin'][2] ) ) {
						$css->add_property( 'margin-bottom', $title_font['margin'][2] . 'px' );
					}
					if ( isset( $title_font['margin'][3] ) && is_numeric( $title_font['margin'][3] ) ) {
						$css->add_property( 'margin-left', $title_font['margin'][3] . 'px' );
					}
				}
			}
		}
		if ( isset( $attr['titleHoverColor'] ) && ! empty( $attr['titleHoverColor'] ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-title' );
			$css->add_property( 'color', $css->render_color( $attr['titleHoverColor'] ) );
		}
		if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && ( ( isset( $attr['titleFont'][0]['size'] ) && is_array( $attr['titleFont'][0]['size'] ) && isset( $attr['titleFont'][0]['size'][1] ) && ! empty( $attr['titleFont'][0]['size'][1] ) ) || ( isset( $attr['titleFont'][0]['lineHeight'] ) && is_array( $attr['titleFont'][0]['lineHeight'] ) && isset( $attr['titleFont'][0]['lineHeight'][1] ) && ! empty( $attr['titleFont'][0]['lineHeight'][1] ) ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title' );
			if ( isset( $attr['titleFont'][0]['size'][1] ) && ! empty( $attr['titleFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attr['titleFont'][0]['size'][1] . ( ! isset( $attr['titleFont'][0]['sizeType'] ) ? 'px' : $attr['titleFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['titleFont'][0]['lineHeight'][1] ) && ! empty( $attr['titleFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['titleFont'][0]['lineHeight'][1] . ( ! isset( $attr['titleFont'][0]['lineType'] ) ? 'px' : $attr['titleFont'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['titleFont'] ) && is_array( $attr['titleFont'] ) && isset( $attr['titleFont'][0] ) && is_array( $attr['titleFont'][0] ) && ( ( isset( $attr['titleFont'][0]['size'] ) && is_array( $attr['titleFont'][0]['size'] ) && isset( $attr['titleFont'][0]['size'][2] ) && ! empty( $attr['titleFont'][0]['size'][2] ) ) || ( isset( $attr['titleFont'][0]['lineHeight'] ) && is_array( $attr['titleFont'][0]['lineHeight'] ) && isset( $attr['titleFont'][0]['lineHeight'][2] ) && ! empty( $attr['titleFont'][0]['lineHeight'][2] ) ) ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title' );
			if ( isset( $attr['titleFont'][0]['size'][2] ) && ! empty( $attr['titleFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attr['titleFont'][0]['size'][2] . ( ! isset( $attr['titleFont'][0]['sizeType'] ) ? 'px' : $attr['titleFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['titleFont'][0]['lineHeight'][2] ) && ! empty( $attr['titleFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['titleFont'][0]['lineHeight'][2] . ( ! isset( $attr['titleFont'][0]['lineType'] ) ? 'px' : $attr['titleFont'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['titleMinHeight'] ) && is_array( $attr['titleMinHeight'] ) && isset( $attr['titleMinHeight'][0] ) ) {
			if ( is_numeric( $attr['titleMinHeight'][0] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title' );
				$css->add_property( 'min-height', $attr['titleMinHeight'][0] . 'px' );
			}
			if ( isset( $attr['titleMinHeight'][1] ) && is_numeric( $attr['titleMinHeight'][1] ) ) {
				$css->start_media_query( $media_query['tablet'] );
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title' );
				$css->add_property( 'min-height', $attr['titleMinHeight'][1] . 'px' );
				$css->stop_media_query();
			}
			if ( isset( $attr['titleMinHeight'][2] ) && is_numeric( $attr['titleMinHeight'][2] ) ) {
				$css->start_media_query( $media_query['mobile'] );
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-title' );
				$css->add_property( 'min-height', $attr['titleMinHeight'][2] . 'px' );
				$css->stop_media_query();
			}
		}
		if ( isset( $attr['mediaAlignTablet'] ) && ! empty( $attr['mediaAlignTablet'] ) ) {
			if ( 'top' === $attr['mediaAlignTablet'] ) {
				$display = 'block';
				$align   = '';
				$content = '';
			} elseif ( 'left' === $attr['mediaAlignTablet'] ) {
				$display = 'flex';
				$align   = 'center';
				$content = 'flex-start';
			} else {
				$display = 'flex';
				$align   = 'center';
				$content = 'flex-end';
			}
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap' );
			$css->add_property( 'display', $display );
			if ( ! empty( $align ) ) {
				$css->add_property( 'align-items', $align );
			}
			if ( ! empty( $content ) ) {
				$css->add_property( 'justify-content', $content );
			}
			if ( 'top' === $attr['mediaAlignTablet'] ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media' );
				$css->add_property( 'display', 'inline-block' );
				$css->add_property( 'max-width', '100%' );
			} else {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media' );
				$css->add_property( 'display', 'block' );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['mediaAlignMobile'] ) && ! empty( $attr['mediaAlignMobile'] ) ) {
			if ( 'top' === $attr['mediaAlignMobile'] ) {
				$display = 'block';
				$content = '';
			} elseif ( 'left' === $attr['mediaAlignMobile'] ) {
				$display   = 'flex';
				$content   = 'flex-start';
				$direction = 'row';
			} else {
				$display   = 'flex';
				$content   = 'flex-end';
				$direction = 'row-reverse';
			}
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap' );
			$css->add_property( 'display', $display );
			if ( ! empty( $content ) ) {
				$css->add_property( 'justify-content', $content );
			}
			if ( ! empty( $direction ) ) {
				$css->add_property( 'flex-direction', $direction );
			}
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media' );
			$css->add_property( 'display', 'inline-block' );
			$css->add_property( 'max-width', '100%' );
			// $css .= '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-media-align-left.kt-blocks-info-box-link-wrap .kt-blocks-info-box-media {';
			// $css .= 'display: block;';
			// $css .= '}';
			// .kt-blocks-info-box-media-container {
			// 	width: 100%;
			// }
			$css->stop_media_query();
		}
		if ( isset( $attr['textColor'] ) || isset( $attr['textFont'] ) || isset( $attr['textSpacing'] ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text' );
			if ( isset( $attr['textColor'] ) && ! empty( $attr['textColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attr['textColor'] ) );
			}
			if ( isset( $attr['textFont'] ) && is_array( $attr['textFont'] ) && is_array( $attr['textFont'][0] ) ) {
				$text_font = $attr['textFont'][0];
				if ( isset( $text_font['size'] ) && is_array( $text_font['size'] ) && ! empty( $text_font['size'][0] ) ) {
					$css->add_property( 'font-size', $text_font['size'][0] . ( ! isset( $text_font['sizeType'] ) ? 'px' : $text_font['sizeType'] ) );
				}
				if ( isset( $text_font['lineHeight'] ) && is_array( $text_font['lineHeight'] ) && ! empty( $text_font['lineHeight'][0] ) ) {
					$css->add_property( 'line-height', $text_font['lineHeight'][0] . ( ! isset( $text_font['lineType'] ) ? 'px' : $text_font['lineType'] ) );
				}
				if ( isset( $text_font['letterSpacing'] ) && ! empty( $text_font['letterSpacing'] ) ) {
					$css->add_property( 'letter-spacing', $text_font['letterSpacing'] . 'px' );
				}
				if ( isset( $text_font['textTransform'] ) && ! empty( $text_font['textTransform'] ) ) {
					$css->add_property( 'text-transform', $text_font['textTransform'] );
				}
				if ( isset( $text_font['family'] ) && ! empty( $text_font['family'] ) ) {
					$css->add_property( 'font-family', $css->render_font_family( $text_font['family'] ) );
				}
				if ( isset( $text_font['style'] ) && ! empty( $text_font['style'] ) ) {
					$css->add_property( 'font-style', $text_font['style'] );
				}
				if ( isset( $text_font['weight'] ) && ! empty( $text_font['weight'] ) ) {
					$css->add_property( 'font-weight', $css->render_font_weight( $text_font['weight'] ) );
				}
			}
			if ( isset( $attr['textSpacing'] ) && is_array( $attr['textSpacing'] ) && is_array( $attr['textSpacing'][0] ) ) {
				$text_spacing = $attr['textSpacing'][0];
				if ( isset( $text_spacing['padding'] ) && is_array( $text_spacing['padding'] ) ) {
					if ( isset( $text_spacing['padding'][0] ) && is_numeric( $text_spacing['padding'][0] ) ) {
						$css->add_property( 'padding-top', $text_spacing['padding'][0] . 'px' );
					}
					if ( isset( $text_spacing['padding'][1] ) && is_numeric( $text_spacing['padding'][1] ) ) {
						$css->add_property( 'padding-right', $text_spacing['padding'][1] . 'px' );
					}
					if ( isset( $text_spacing['padding'][2] ) && is_numeric( $text_spacing['padding'][2] ) ) {
						$css->add_property( 'padding-bottom', $text_spacing['padding'][2] . 'px' );
					}
					if ( isset( $text_spacing['padding'][3] ) && is_numeric( $text_spacing['padding'][3] ) ) {
						$css->add_property( 'padding-left', $text_spacing['padding'][3] . 'px' );
					}
				}
				if ( isset( $text_spacing['margin'] ) && is_array( $text_spacing['margin'] ) ) {
					if ( isset( $text_spacing['margin'][0] ) && is_numeric( $text_spacing['margin'][0] ) ) {
						$css->add_property( 'margin-top', $text_spacing['margin'][0] . 'px' );
					}
					if ( isset( $text_spacing['margin'][1] ) && is_numeric( $text_spacing['margin'][1] ) ) {
						$css->add_property( 'margin-right', $text_spacing['margin'][1] . 'px' );
					}
					if ( isset( $text_spacing['margin'][2] ) && is_numeric( $text_spacing['margin'][2] ) ) {
						$css->add_property( 'margin-bottom', $text_spacing['margin'][2] . 'px' );
					}
					if ( isset( $text_spacing['margin'][3] ) && is_numeric( $text_spacing['margin'][3] ) ) {
						$css->add_property( 'margin-left', $text_spacing['margin'][3] . 'px' );
					}
				}
			}
		}
		if ( isset( $attr['textHoverColor'] ) && ! empty( $attr['textHoverColor'] ) ) {
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-text' );
			$css->add_property( 'color', $css->render_color( $attr['textHoverColor'] ) );
		}
		if ( isset( $attr['textFont'] ) && is_array( $attr['textFont'] ) && isset( $attr['textFont'][0] ) && is_array( $attr['textFont'][0] ) && ( ( isset( $attr['textFont'][0]['size'] ) && is_array( $attr['textFont'][0]['size'] ) && isset( $attr['textFont'][0]['size'][1] ) && ! empty( $attr['textFont'][0]['size'][1] ) ) || ( isset( $attr['textFont'][0]['lineHeight'] ) && is_array( $attr['textFont'][0]['lineHeight'] ) && isset( $attr['textFont'][0]['lineHeight'][1] ) && ! empty( $attr['textFont'][0]['lineHeight'][1] ) ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text' );
			if ( isset( $attr['textFont'][0]['size'][1] ) && ! empty( $attr['textFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attr['textFont'][0]['size'][1] . ( ! isset( $attr['textFont'][0]['sizeType'] ) ? 'px' : $attr['textFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['textFont'][0]['lineHeight'][1] ) && ! empty( $attr['textFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['textFont'][0]['lineHeight'][1] . ( ! isset( $attr['textFont'][0]['lineType'] ) ? 'px' : $attr['textFont'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['textFont'] ) && is_array( $attr['textFont'] ) && isset( $attr['textFont'][0] ) && is_array( $attr['textFont'][0] ) && ( ( isset( $attr['textFont'][0]['size'] ) && is_array( $attr['textFont'][0]['size'] ) && isset( $attr['textFont'][0]['size'][2] ) && ! empty( $attr['textFont'][0]['size'][2] ) ) || ( isset( $attr['textFont'][0]['lineHeight'] ) && is_array( $attr['textFont'][0]['lineHeight'] ) && isset( $attr['textFont'][0]['lineHeight'][2] ) && ! empty( $attr['textFont'][0]['lineHeight'][2] ) ) ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text' );
			if ( isset( $attr['textFont'][0]['size'][2] ) && ! empty( $attr['textFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attr['textFont'][0]['size'][2] . ( ! isset( $attr['textFont'][0]['sizeType'] ) ? 'px' : $attr['textFont'][0]['sizeType'] ) );
			}
			if ( isset( $attr['textFont'][0]['lineHeight'][2] ) && ! empty( $attr['textFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['textFont'][0]['lineHeight'][2] . ( ! isset( $attr['textFont'][0]['lineType'] ) ? 'px' : $attr['textFont'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['textMinHeight'] ) && is_array( $attr['textMinHeight'] ) && isset( $attr['textMinHeight'][0] ) ) {
			if ( is_numeric( $attr['textMinHeight'][0] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text' );
				$css->add_property( 'min-height', $attr['textMinHeight'][0] . 'px' );
			}
			if ( isset( $attr['textMinHeight'][1] ) && is_numeric( $attr['textMinHeight'][1] ) ) {
				$css->start_media_query( $media_query['tablet'] );
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text' );
				$css->add_property( 'min-height', $attr['textMinHeight'][1] . 'px' );
				$css->stop_media_query();
			}
			if ( isset( $attr['textMinHeight'][2] ) && is_numeric( $attr['textMinHeight'][2] ) ) {
				$css->start_media_query( $media_query['mobile'] );
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-text' );
				$css->add_property( 'min-height', $attr['textMinHeight'][2] . 'px' );
				$css->stop_media_query();
			}
		}
		if ( isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'][0] ) ) {
			$learn_more_styles = $attr['learnMoreStyles'][0];
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-learnmore' );
			if ( isset( $learn_more_styles['color'] ) && ! empty( $learn_more_styles['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $learn_more_styles['color'] ) );
			}
			if ( isset( $learn_more_styles['background'] ) && ! empty( $learn_more_styles['background'] ) ) {
				$css->add_property( 'background', $css->render_color( $learn_more_styles['background'] ) );
			}
			if ( isset( $learn_more_styles['border'] ) && ! empty( $learn_more_styles['border'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $learn_more_styles['border'] ) );
			}
			if ( isset( $learn_more_styles['borderRadius'] ) && ! empty( $learn_more_styles['borderRadius'] ) ) {
				$css->add_property( 'border-radius', $learn_more_styles['borderRadius'] . 'px' );
			}
			if ( isset( $learn_more_styles['size'] ) && is_array( $learn_more_styles['size'] ) && ! empty( $learn_more_styles['size'][0] ) ) {
				$css->add_property( 'font-size', $learn_more_styles['size'][0] . ( ! isset( $learn_more_styles['sizeType'] ) ? 'px' : $learn_more_styles['sizeType'] ) );
			}
			if ( isset( $learn_more_styles['lineHeight'] ) && is_array( $learn_more_styles['lineHeight'] ) && ! empty( $learn_more_styles['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $learn_more_styles['lineHeight'][0] . ( ! isset( $learn_more_styles['lineType'] ) ? 'px' : $learn_more_styles['lineType'] ) );
			}
			if ( isset( $learn_more_styles['letterSpacing'] ) && ! empty( $learn_more_styles['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $learn_more_styles['letterSpacing'] . 'px' );
			}
			if ( isset( $learn_more_styles['textTransform'] ) && ! empty( $learn_more_styles['textTransform'] ) ) {
				$css->add_property( 'text-transform', $learn_more_styles['textTransform'] );
			}
			if ( isset( $learn_more_styles['family'] ) && ! empty( $learn_more_styles['family'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $learn_more_styles['family'] ) );
			}
			if ( isset( $learn_more_styles['style'] ) && ! empty( $learn_more_styles['style'] ) ) {
				$css->add_property( 'font-style', $learn_more_styles['style'] );
			}
			if ( isset( $learn_more_styles['weight'] ) && ! empty( $learn_more_styles['weight'] ) ) {
				$css->add_property( 'font-weight', $css->render_font_weight( $learn_more_styles['weight'] ) );
			}
			if ( isset( $learn_more_styles['borderWidth'] ) && is_array( $learn_more_styles['borderWidth'] ) ) {
				$css->add_property( 'border-width', $learn_more_styles['borderWidth'][0] . 'px ' . $learn_more_styles['borderWidth'][1] . 'px ' . $learn_more_styles['borderWidth'][2] . 'px ' . $learn_more_styles['borderWidth'][3] . 'px' );
			}
			if ( isset( $learn_more_styles['padding'] ) && is_array( $learn_more_styles['padding'] ) ) {
				$css->add_property( 'padding', $learn_more_styles['padding'][0] . 'px ' . $learn_more_styles['padding'][1] . 'px ' . $learn_more_styles['padding'][2] . 'px ' . $learn_more_styles['padding'][3] . 'px' );
			}
			if ( isset( $learn_more_styles['margin'] ) && is_array( $learn_more_styles['margin'] ) ) {
				$css->add_property( 'margin', $learn_more_styles['margin'][0] . 'px ' . $learn_more_styles['margin'][1] . 'px ' . $learn_more_styles['margin'][2] . 'px ' . $learn_more_styles['margin'][3] . 'px' );
			}
			if ( isset( $learn_more_styles['colorHover'] ) || isset( $learn_more_styles['colorHover'] ) || isset( $learn_more_styles['borderHover'] ) ) {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore' );
				if ( isset( $learn_more_styles['colorHover'] ) && ! empty( $learn_more_styles['colorHover'] ) ) {
					$css->add_property( 'color', $css->render_color( $learn_more_styles['colorHover'] ) );
				}
				if ( isset( $learn_more_styles['backgroundHover'] ) && ! empty( $learn_more_styles['backgroundHover'] ) ) {
					$css->add_property( 'background', $css->render_color( $learn_more_styles['backgroundHover'] ) );
				}
				if ( isset( $learn_more_styles['borderHover'] ) && ! empty( $learn_more_styles['borderHover'] ) ) {
					$css->add_property( 'border-color', $css->render_color( $learn_more_styles['borderHover'] ) );
				}
			}
		}
		if ( isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && isset( $attr['learnMoreStyles'][0] ) && is_array( $attr['learnMoreStyles'][0] ) && ( ( isset( $attr['learnMoreStyles'][0]['size'] ) && is_array( $attr['learnMoreStyles'][0]['size'] ) && isset( $attr['learnMoreStyles'][0]['size'][1] ) && ! empty( $attr['learnMoreStyles'][0]['size'][1] ) ) || ( isset( $attr['learnMoreStyles'][0]['lineHeight'] ) && is_array( $attr['learnMoreStyles'][0]['lineHeight'] ) && isset( $attr['learnMoreStyles'][0]['lineHeight'][1] ) && ! empty( $attr['learnMoreStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-learnmore' );
			if ( isset( $attr['learnMoreStyles'][0]['size'][1] ) && ! empty( $attr['learnMoreStyles'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attr['learnMoreStyles'][0]['size'][1] . ( ! isset( $attr['learnMoreStyles'][0]['sizeType'] ) ? 'px' : $attr['learnMoreStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attr['learnMoreStyles'][0]['lineHeight'][1] ) && ! empty( $attr['learnMoreStyles'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['learnMoreStyles'][0]['lineHeight'][1] . ( ! isset( $attr['learnMoreStyles'][0]['lineType'] ) ? 'px' : $attr['learnMoreStyles'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['learnMoreStyles'] ) && is_array( $attr['learnMoreStyles'] ) && isset( $attr['learnMoreStyles'][0] ) && is_array( $attr['learnMoreStyles'][0] ) && ( ( isset( $attr['learnMoreStyles'][0]['size'] ) && is_array( $attr['learnMoreStyles'][0]['size'] ) && isset( $attr['learnMoreStyles'][0]['size'][2] ) && ! empty( $attr['learnMoreStyles'][0]['size'][2] ) ) || ( isset( $attr['learnMoreStyles'][0]['lineHeight'] ) && is_array( $attr['learnMoreStyles'][0]['lineHeight'] ) && isset( $attr['learnMoreStyles'][0]['lineHeight'][2] ) && ! empty( $attr['learnMoreStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-learnmore' );
			if ( isset( $attr['learnMoreStyles'][0]['size'][2] ) && ! empty( $attr['learnMoreStyles'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attr['learnMoreStyles'][0]['size'][2] . ( ! isset( $attr['learnMoreStyles'][0]['sizeType'] ) ? 'px' : $attr['learnMoreStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attr['learnMoreStyles'][0]['lineHeight'][2] ) && ! empty( $attr['learnMoreStyles'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['learnMoreStyles'][0]['lineHeight'][2] . ( ! isset( $attr['learnMoreStyles'][0]['lineType'] ) ? 'px' : $attr['learnMoreStyles'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['displayShadow'] ) && ! empty( $attr['displayShadow'] ) && true === $attr['displayShadow'] ) {
			if ( isset( $attr['shadow'] ) && is_array( $attr['shadow'] ) && is_array( $attr['shadow'][0] ) ) {
				$shadow = $attr['shadow'][0];
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap' );
				$css->add_property( 'box-shadow', $shadow['hOffset'] . 'px ' . $shadow['vOffset'] . 'px ' . $shadow['blur'] . 'px ' . $shadow['spread'] . 'px ' . $css->render_color( ( isset( $shadow['color'] ) ? $shadow['color'] : '' ), $shadow['opacity'] ) );
			}
			if ( isset( $attr['shadowHover'] ) && is_array( $attr['shadowHover'] ) && is_array( $attr['shadowHover'][0] ) ) {
				$shadow_hover = $attr['shadowHover'][0];
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover' );
				$css->add_property( 'box-shadow', $shadow_hover['hOffset'] . 'px ' . $shadow_hover['vOffset'] . 'px ' . $shadow_hover['blur'] . 'px ' . $shadow_hover['spread'] . 'px ' . $css->render_color( $shadow_hover['color'], $shadow_hover['opacity'] ) );
			} else {
				$css->set_selector( '#kt-info-box' . $unique_id . ' .kt-blocks-info-box-link-wrap:hover' );
				$css->add_property( 'box-shadow', '0px 0px 14px 0px rgba(0,0,0,0.2)' );
			}
		}

		return $css->css_output();
	}

	/**
	 * Adds Scripts for row block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function render_row_layout_scripts( $attr ) {
		if ( ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] ) || ( isset( $attr['overlayBgImg'] ) && ! empty( $attr['overlayBgImg'] ) && isset( $attr['overlayBgImgAttachment'] ) && 'parallax' === $attr['overlayBgImgAttachment'] ) ) {
			$this->enqueue_script( 'kadence-blocks-parallax-js' );
		}
		if ( isset( $attr['backgroundSettingTab'] ) && 'slider' === $attr['backgroundSettingTab'] ) {
			$this->enqueue_style( 'kadence-blocks-pro-slick' );
			$this->enqueue_script( 'kadence-blocks-slick-init' );
			// $this->enqueue_style( 'kadence-blocks-tiny-slider' );
			// $this->enqueue_script( 'kadence-blocks-tiny-slider-init' );
		}
		if ( isset( $attr['backgroundSettingTab'] ) && 'video' === $attr['backgroundSettingTab'] && isset( $attr['backgroundVideo'] ) && isset( $attr['backgroundVideo'][0] ) && isset( $attr['backgroundVideo'][0]['btns'] ) && true === $attr['backgroundVideo'][0]['btns'] ) {
			$this->enqueue_script( 'kadence-blocks-video-bg' );
		}
	}

	/**
	 * Adds Scripts and Google fonts for Accordion block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function blocks_accordion_scripts_gfonts( $attr ) {
		$this->enqueue_script( 'kadence-blocks-accordion-js' );
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && isset( $attr['titleStyles'][0] ) && is_array( $attr['titleStyles'][0] ) && isset( $attr['titleStyles'][0]['google'] ) && $attr['titleStyles'][0]['google'] && ( ! isset( $attr['titleStyles'][0]['loadGoogle'] ) || true === $attr['titleStyles'][0]['loadGoogle'] ) && isset( $attr['titleStyles'][0]['family'] ) ) {
			$title_styles = $attr['titleStyles'][0];
			// Check if the font has been added yet
			if ( ! array_key_exists( $title_styles['family'], self::$gfonts ) ) {
				$add_font                                = array(
					'fontfamily'   => $title_styles['family'],
					'fontvariants' => ( isset( $title_styles['variant'] ) && ! empty( $title_styles['variant'] ) ? array( $title_styles['variant'] ) : array() ),
					'fontsubsets'  => ( isset( $title_styles['subset'] ) && ! empty( $title_styles['subset'] ) ? array( $title_styles['subset'] ) : array() ),
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
	 * Builds CSS for Image block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function blocks_image_array( $attr, $unique_id ) {
		$css = new Kadence_Blocks_CSS();

		$media_query            = array();
		$media_query['mobile']  = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['tablet']  = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['desktop'] = apply_filters( 'kadence_desktop_media_query', '(min-width: 1025px)' );
		$key_positions          = [ 'top', 'right', 'bottom', 'left' ];
		$css->set_selector( '.wp-block-kadence-image.kb-image' . $unique_id );
		if ( ! empty( $attr['zIndex'] ) ) {
			$css->add_property( 'position', 'relative' );
			$css->add_property( 'z-index', $attr['zIndex'] );
		}
		// Margins
		foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $breakpoint ) {
			if ( $breakpoint !== 'Desktop' ) {
				$css->start_media_query( $media_query[ strtolower( $breakpoint ) ] );
			}
			if ( isset( $attr[ 'margin' . $breakpoint ] ) && is_array( $attr[ 'margin' . $breakpoint ] ) ) {
				foreach ( $attr[ 'margin' . $breakpoint ] as $key => $marginValue ) {
					if ( is_numeric( $marginValue ) ) {
						$css->add_property( 'margin-' . $key_positions[ $key ], $marginValue . ( ! isset( $attr['marginUnit'] ) ? 'px' : $attr['marginUnit'] ) );

					}
				}
			}
			if ( $breakpoint !== 'Desktop' ) {
				$css->stop_media_query();
			}
		}
		$align = ( ! empty( $attr['align'] ) ? $attr['align'] : '' );
		if ( $align !== 'wide' && $align !== 'full' ) {
			$css->set_selector( '.kb-image' . $unique_id . '.kb-image-is-ratio-size, .kb-image' . $unique_id . ' .kb-image-is-ratio-size' );
			if ( isset( $attr['imgMaxWidth'] ) && is_numeric( $attr['imgMaxWidth'] ) ) {
				$css->add_property( 'max-width', $attr['imgMaxWidth'] . 'px' );
				$css->add_property( 'width', '100%' );
			}
		}
		if ( $align === 'center' || $align === 'right' || $align === 'left' ) {
			$css->set_selector( '.kb-image' . $unique_id . ' figure' );
			if ( isset( $attr['imgMaxWidth'] ) && is_numeric( $attr['imgMaxWidth'] ) ) {
				$css->add_property( 'max-width', $attr['imgMaxWidth'] . 'px' );
			}
		} else if ( $align !== 'wide' && $align !== 'full' ) {
			$css->set_selector( '.kb-image' . $unique_id );
			if ( isset( $attr['imgMaxWidth'] ) && is_numeric( $attr['imgMaxWidth'] ) ) {
				$css->add_property( 'max-width', $attr['imgMaxWidth'] . 'px' );
				$css->set_selector( '.image-is-svg.kb-image' . $unique_id . ' img' );
				$css->add_property( 'width', '100%' );
			}
		}
		// Tablet and Mobile Max Width.
		foreach ( [ 'Tablet', 'Mobile' ] as $breakpoint ) {
			$css->start_media_query( $media_query[ strtolower( $breakpoint ) ] );
			if ( isset( $attr[ 'imgMaxWidth' . $breakpoint ] ) && is_numeric( $attr[ 'imgMaxWidth' . $breakpoint ] ) ) {
				if ( $align !== 'wide' && $align !== 'full' ) {
					$css->set_selector( '.kb-image' . $unique_id . '.kb-image-is-ratio-size, .kb-image' . $unique_id . ' .kb-image-is-ratio-size' );
					$css->add_property( 'max-width', $attr[ 'imgMaxWidth' . $breakpoint ] . 'px' );
					$css->add_property( 'width', '100%' );
				}
				if ( $align === 'center' || $align === 'right' || $align === 'left' ) {
					$css->set_selector( '.kb-image' . $unique_id . ' figure' );
					$css->add_property( 'max-width', $attr[ 'imgMaxWidth' . $breakpoint ] . 'px' );
				} else if ( $align !== 'wide' && $align !== 'full' ) {
					$css->set_selector( '.kb-image' . $unique_id );
					$css->add_property( 'max-width', $attr[ 'imgMaxWidth' . $breakpoint ] . 'px' );
				}
			}
			$css->stop_media_query();
		}
		$css->set_selector( '.kb-image' . $unique_id . ' img.kb-img, .kb-image' . $unique_id . ' .kb-img img' );
		// Padding
		foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $breakpoint ) {
			if ( $breakpoint !== 'Desktop' ) {
				$css->start_media_query( $media_query[ strtolower( $breakpoint ) ] );
			}
			if ( isset( $attr[ 'padding' . $breakpoint ] ) && is_array( $attr[ 'padding' . $breakpoint ] ) ) {
				foreach ( $attr[ 'padding' . $breakpoint ] as $key => $paddingValue ) {
					if ( is_numeric( $paddingValue ) ) {
						$css->add_property( 'padding-' . $key_positions[ $key ], $paddingValue . ( ! isset( $attr['paddingUnit'] ) ? 'px' : $attr['paddingUnit'] ) );

					}
				}
			}
			if ( $breakpoint !== 'Desktop' ) {
				$css->stop_media_query();
			}
		}

		// Border Color
		if ( isset( $attr['borderColor'] ) ) {
			$css->add_property( 'border-style', 'solid' );
			$css->add_property( 'border-color', $css->render_color( $attr['borderColor'] ) );
		}

		// Border widths
		foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $breakpoint ) {
			if ( $breakpoint !== 'Desktop' ) {
				$css->start_media_query( $media_query[ strtolower( $breakpoint ) ] );
			}
			if ( isset( $attr[ 'borderWidth' . $breakpoint ] ) && is_array( $attr[ 'borderWidth' . $breakpoint ] ) ) {
				foreach ( $attr[ 'borderWidth' . $breakpoint ] as $key => $bDesktop ) {
					if ( is_numeric( $bDesktop ) ) {
						$css->add_property( 'border-' . $key_positions[ $key ] . '-width', $bDesktop . ( ! isset( $attr['borderWidthUnit'] ) ? 'px' : $attr['borderWidthUnit'] ) );
					}
				}
			}
			if ( $breakpoint !== 'Desktop' ) {
				$css->stop_media_query();
			}
		}

		// Background Color
		if ( isset( $attr['backgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $attr['backgroundColor'] ) );
		}

		// Border Radius
		if ( isset( $attr['borderRadius'] ) && is_array( $attr['borderRadius'] ) ) {
			$borderRadius     = array();
			$borderRadiusUnit = isset( $attr['borderRadiusUnit'] ) ? $attr['borderRadiusUnit'] : 'px';

			foreach ( $attr['borderRadius'] as $br ) {
				$borderRadius[] = ! is_numeric( $br ) ? '0' : $br . $borderRadiusUnit;
			}

			$css->add_property( 'border-radius', implode( ' ', $borderRadius ) );
		}

		if ( ! empty( $attr['maskSvg'] ) && 'none' !== $attr['maskSvg'] ) {
			if ( 'custom' === $attr['maskSvg'] ) {
				if ( ! empty( $attr['maskUrl'] ) ) {
					$mask_size     = ( ! empty( $attr['maskSize'] ) ? $attr['maskSize'] : 'auto' );
					$mask_position = ( ! empty( $attr['maskPosition'] ) ? $attr['maskPosition'] : 'center center' );
					$mask_repeat   = ( ! empty( $attr['maskRepeat'] ) ? $attr['maskRepeat'] : 'no-repeat' );
					$css->add_property( 'mask-image', 'url(' . $attr['maskUrl'] . ')' );
					$css->add_property( 'mask-size', $mask_size );
					$css->add_property( 'mask-repeat', $mask_repeat );
					$css->add_property( 'mask-position', $mask_position );

					$css->add_property( '-webkit-mask-image', 'url(' . $attr['maskUrl'] . ')' );
					$css->add_property( '-webkit-mask-size', $mask_size );
					$css->add_property( '-webkit-mask-repeat', $mask_repeat );
					$css->add_property( '-webkit-mask-position', $mask_position );
				}
			} else {
				$mask_base_url = KADENCE_BLOCKS_URL . 'dist/assets/images/masks/';
				$css->add_property( 'mask-image', 'url(' . $mask_base_url . $attr['maskSvg'] . '.svg)' );
				$css->add_property( 'mask-size', 'auto' );
				$css->add_property( 'mask-repeat', 'no-repeat' );
				$css->add_property( 'mask-position', 'center' );

				$css->add_property( '-webkit-mask-image', 'url(' . $mask_base_url . $attr['maskSvg'] . '.svg)' );
				$css->add_property( '-webkit-mask-size', 'auto' );
				$css->add_property( '-webkit-mask-repeat', 'no-repeat' );
				$css->add_property( '-webkit-mask-position', 'center' );
			}
		}

		// Box shadow
		if ( isset( $attr['displayBoxShadow'] ) && true == $attr['displayBoxShadow'] ) {
			if ( isset( $attr['boxShadow'] ) && is_array( $attr['boxShadow'] ) && isset( $attr['boxShadow'][0] ) && is_array( $attr['boxShadow'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attr['boxShadow'][0]['inset'] ) && true === $attr['boxShadow'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attr['boxShadow'][0]['hOffset'] ) && is_numeric( $attr['boxShadow'][0]['hOffset'] ) ? $attr['boxShadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attr['boxShadow'][0]['vOffset'] ) && is_numeric( $attr['boxShadow'][0]['vOffset'] ) ? $attr['boxShadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attr['boxShadow'][0]['blur'] ) && is_numeric( $attr['boxShadow'][0]['blur'] ) ? $attr['boxShadow'][0]['blur'] : '14' ) . 'px ' . ( isset( $attr['boxShadow'][0]['spread'] ) && is_numeric( $attr['boxShadow'][0]['spread'] ) ? $attr['boxShadow'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attr['boxShadow'][0]['color'] ) && ! empty( $attr['boxShadow'][0]['color'] ) ? $attr['boxShadow'][0]['color'] : '#000000' ), ( isset( $attr['boxShadow'][0]['opacity'] ) && is_numeric( $attr['boxShadow'][0]['opacity'] ) ? $attr['boxShadow'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
			}
		}

		// Drop Shadow
		if ( isset( $attr['displayDropShadow'] ) && true == $attr['displayDropShadow'] ) {
			if ( isset( $attr['dropShadow'] ) && is_array( $attr['dropShadow'] ) && isset( $attr['dropShadow'][0] ) && is_array( $attr['dropShadow'][0] ) ) {
				$css->add_property( 'filter', 'drop-shadow(' . ( isset( $attr['dropShadow'][0]['hOffset'] ) && is_numeric( $attr['dropShadow'][0]['hOffset'] ) ? $attr['dropShadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attr['dropShadow'][0]['vOffset'] ) && is_numeric( $attr['dropShadow'][0]['vOffset'] ) ? $attr['dropShadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attr['dropShadow'][0]['blur'] ) && is_numeric( $attr['dropShadow'][0]['blur'] ) ? $attr['dropShadow'][0]['blur'] : '14' ) . 'px ' . $css->render_color( ( isset( $attr['dropShadow'][0]['color'] ) && ! empty( $attr['dropShadow'][0]['color'] ) ? $attr['dropShadow'][0]['color'] : '#000000' ), ( isset( $attr['dropShadow'][0]['opacity'] ) && is_numeric( $attr['dropShadow'][0]['opacity'] ) ? $attr['dropShadow'][0]['opacity'] : 0.2 ) ) . ')' );
			} else {
				$css->add_property( 'filter', 'drop-shadow(0px 0px 14px rgba(0, 0, 0, 0.2) )' );
			}
		}

		// Caption Font
		if ( ! isset( $attr['showCaption'] ) && isset( $attr['captionStyles'] ) && is_array( $attr['captionStyles'] ) && is_array( $attr['captionStyles'][0] ) ) {
			$caption_font = $attr['captionStyles'][0];

			$css->set_selector( '.kb-image' . $unique_id . ' figcaption' );
			if ( isset( $caption_font['color'] ) && ! empty( $caption_font['color'] ) ) {
				$css->add_property( 'color', $this->kadence_color_output( $caption_font['color'] ) );
			}
			if ( isset( $caption_font['background'] ) && ! empty( $caption_font['background'] ) ) {
				$css->add_property( 'background', $this->kadence_color_output( $caption_font['background'] ) );
			}
			if ( isset( $caption_font['size'] ) && is_array( $caption_font['size'] ) && ! empty( $caption_font['size'][0] ) ) {
				$css->add_property( 'font-size', $caption_font['size'][0] . ( ! isset( $caption_font['sizeType'] ) ? 'px' : $caption_font['sizeType'] ) );
			}
			if ( isset( $caption_font['lineHeight'] ) && is_array( $caption_font['lineHeight'] ) && ! empty( $caption_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $caption_font['lineHeight'][0] . ( ! isset( $caption_font['lineType'] ) ? 'px' : $caption_font['lineType'] ) );
			}
			if ( isset( $caption_font['letterSpacing'] ) && ! empty( $caption_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $caption_font['letterSpacing'] . 'px' );
			}
			if ( isset( $caption_font['textTransform'] ) && ! empty( $caption_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $caption_font['textTransform'] );
			}
			if ( isset( $caption_font['family'] ) && ! empty( $caption_font['family'] ) ) {
				$css->add_property( 'font-family', $caption_font['family'] );
			}
			if ( isset( $caption_font['style'] ) && ! empty( $caption_font['style'] ) ) {
				$css->add_property( 'font-style', $caption_font['style'] );
			}
			if ( isset( $caption_font['weight'] ) && ! empty( $caption_font['weight'] ) ) {
				$css->add_property( 'font-weight', $caption_font['weight'] );
			}
		}
		if ( ! isset( $attr['showCaption'] ) && isset( $attr['captionStyles'] ) && is_array( $attr['captionStyles'] ) && isset( $attr['captionStyles'][0] ) && is_array( $attr['captionStyles'][0] ) && ( ( isset( $attr['captionStyles'][0]['size'] ) && is_array( $attr['captionStyles'][0]['size'] ) && isset( $attr['captionStyles'][0]['size'][1] ) && ! empty( $attr['captionStyles'][0]['size'][1] ) ) || ( isset( $attr['captionStyles'][0]['lineHeight'] ) && is_array( $attr['captionStyles'][0]['lineHeight'] ) && isset( $attr['captionStyles'][0]['lineHeight'][1] ) && ! empty( $attr['captionStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-image' . $unique_id . ' figcaption' );
			if ( isset( $attr['captionStyles'][0]['size'][1] ) && ! empty( $attr['captionStyles'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attr['captionStyles'][0]['size'][1] . ( ! isset( $attr['captionStyles'][0]['sizeType'] ) ? 'px' : $attr['captionStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attr['captionStyles'][0]['lineHeight'][1] ) && ! empty( $attr['captionStyles'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attr['captionStyles'][0]['lineHeight'][1] . ( ! isset( $attr['captionStyles'][0]['lineType'] ) ? 'px' : $attr['captionStyles'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}
		if ( ! isset( $attr['showCaption'] ) && isset( $attr['captionStyles'] ) && is_array( $attr['captionStyles'] ) && isset( $attr['captionStyles'][0] ) && is_array( $attr['captionStyles'][0] ) && ( ( isset( $attr['captionStyles'][0]['size'] ) && is_array( $attr['captionStyles'][0]['size'] ) && isset( $attr['captionStyles'][0]['size'][2] ) && ! empty( $attr['captionStyles'][0]['size'][2] ) ) || ( isset( $attr['captionStyles'][0]['lineHeight'] ) && is_array( $attr['captionStyles'][0]['lineHeight'] ) && isset( $attr['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attr['captionStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-image' . $unique_id . ' figcaption' );
			if ( isset( $attr['captionStyles'][0]['size'][2] ) && ! empty( $attr['captionStyles'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attr['captionStyles'][0]['size'][2] . ( ! isset( $attr['captionStyles'][0]['sizeType'] ) ? 'px' : $attr['captionStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attr['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attr['captionStyles'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attr['captionStyles'][0]['lineHeight'][2] . ( ! isset( $attr['captionStyles'][0]['lineType'] ) ? 'px' : $attr['captionStyles'][0]['lineType'] ) );
			}
			$css->stop_media_query();
		}


		return $css->css_output();
	}

	/**
	 * Builds CSS for Accordion block.
	 *
	 * @param array $attr the blocks attr.
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
				$css .= 'border-radius:' . $attr['contentBorderRadius'][0] . 'px ' . $attr['contentBorderRadius'][1] . 'px ' . $attr['contentBorderRadius'][2] . 'px ' . $attr['contentBorderRadius'][3] . 'px;';
			}
			if ( isset( $attr['contentBgColor'] ) && ! empty( $attr['contentBgColor'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $attr['contentBgColor'] ) . ';';
			}
			if ( isset( $attr['contentPadding'] ) && is_array( $attr['contentPadding'] ) ) {
				if ( isset( $attr['contentPadding'][0] ) && is_numeric( $attr['contentPadding'][0] ) ) {
					$css .= 'padding-top:' . $attr['contentPadding'][0] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
				}
				if ( isset( $attr['contentPadding'][1] ) && is_numeric( $attr['contentPadding'][1] ) ) {
					$css .= 'padding-right:' . $attr['contentPadding'][1] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
				}
				if ( isset( $attr['contentPadding'][2] ) && is_numeric( $attr['contentPadding'][2] ) ) {
					$css .= 'padding-bottom:' . $attr['contentPadding'][2] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
				}
				if ( isset( $attr['contentPadding'][3] ) && is_numeric( $attr['contentPadding'][3] ) ) {
					$css .= 'padding-left:' . $attr['contentPadding'][3] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
				}
			}
			if ( isset( $attr['contentBorder'] ) && is_array( $attr['contentBorder'] ) ) {
				$css .= 'border-width:' . $attr['contentBorder'][0] . 'px ' . $attr['contentBorder'][1] . 'px ' . $attr['contentBorder'][2] . 'px ' . $attr['contentBorder'][3] . 'px;';
			}
			$css .= '}';
		}
		if ( isset( $attr['contentTabletPadding'] ) && is_array( $attr['contentTabletPadding'] ) ) {
			$css .= '@media (max-width: 1024px) {';
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner {';
			if ( isset( $attr['contentTabletPadding'][0] ) && is_numeric( $attr['contentTabletPadding'][0] ) ) {
				$css .= 'padding-top:' . $attr['contentTabletPadding'][0] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
			}
			if ( isset( $attr['contentTabletPadding'][1] ) && is_numeric( $attr['contentTabletPadding'][1] ) ) {
				$css .= 'padding-right:' . $attr['contentTabletPadding'][1] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
			}
			if ( isset( $attr['contentTabletPadding'][2] ) && is_numeric( $attr['contentTabletPadding'][2] ) ) {
				$css .= 'padding-bottom:' . $attr['contentTabletPadding'][2] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
			}
			if ( isset( $attr['contentTabletPadding'][3] ) && is_numeric( $attr['contentTabletPadding'][3] ) ) {
				$css .= 'padding-left:' . $attr['contentTabletPadding'][3] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['contentMobilePadding'] ) && is_array( $attr['contentMobilePadding'] ) ) {
			$css .= '@media (max-width: 767px) {';
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner {';
			if ( isset( $attr['contentMobilePadding'][0] ) && is_numeric( $attr['contentMobilePadding'][0] ) ) {
				$css .= 'padding-top:' . $attr['contentMobilePadding'][0] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
			}
			if ( isset( $attr['contentMobilePadding'][1] ) && is_numeric( $attr['contentMobilePadding'][1] ) ) {
				$css .= 'padding-right:' . $attr['contentMobilePadding'][1] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
			}
			if ( isset( $attr['contentMobilePadding'][2] ) && is_numeric( $attr['contentMobilePadding'][2] ) ) {
				$css .= 'padding-bottom:' . $attr['contentMobilePadding'][2] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
			}
			if ( isset( $attr['contentMobilePadding'][3] ) && is_numeric( $attr['contentMobilePadding'][3] ) ) {
				$css .= 'padding-left:' . $attr['contentMobilePadding'][3] . ( isset( $attr['contentPaddingType'] ) && ! empty( $attr['contentPaddingType'] ) ? $attr['contentPaddingType'] : 'px' ) . ';';
			}
			$css .= '}';
			$css .= '}';
		}
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && is_array( $attr['titleStyles'][0] ) ) {
			$title_styles = $attr['titleStyles'][0];
			$css          .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
			if ( isset( $title_styles['color'] ) && ! empty( $title_styles['color'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $title_styles['color'] ) . ';';
			}
			if ( isset( $title_styles['background'] ) && ! empty( $title_styles['background'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $title_styles['background'] ) . ';';
			}
			if ( isset( $title_styles['border'] ) && is_array( $title_styles['border'] ) && ! empty( $title_styles['border'][0] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $title_styles['border'][0] ) . ' ' . $this->kadence_color_output( $title_styles['border'][1] ) . ' ' . $this->kadence_color_output( $title_styles['border'][2] ) . ' ' . $this->kadence_color_output( $title_styles['border'][3] ) . ';';
			}
			if ( isset( $title_styles['size'] ) && is_array( $title_styles['size'] ) && ! empty( $title_styles['size'][0] ) ) {
				$css .= 'font-size:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
			}
			if ( isset( $title_styles['lineHeight'] ) && is_array( $title_styles['lineHeight'] ) && ! empty( $title_styles['lineHeight'][0] ) ) {
				$css .= 'line-height:' . $title_styles['lineHeight'][0] . ( ! isset( $title_styles['lineType'] ) ? 'px' : $title_styles['lineType'] ) . ';';
			}
			if ( isset( $title_styles['letterSpacing'] ) && ! empty( $title_styles['letterSpacing'] ) ) {
				$css .= 'letter-spacing:' . $title_styles['letterSpacing'] . 'px;';
			}
			if ( isset( $title_styles['textTransform'] ) && ! empty( $title_styles['textTransform'] ) ) {
				$css .= 'text-transform:' . $title_styles['textTransform'] . ';';
			}
			if ( isset( $title_styles['family'] ) && ! empty( $title_styles['family'] ) ) {
				$css .= 'font-family:' . $title_styles['family'] . ';';
			}
			if ( isset( $title_styles['style'] ) && ! empty( $title_styles['style'] ) ) {
				$css .= 'font-style:' . $title_styles['style'] . ';';
			}
			if ( isset( $title_styles['weight'] ) && ! empty( $title_styles['weight'] ) ) {
				$css .= 'font-weight:' . $title_styles['weight'] . ';';
			}
			if ( isset( $title_styles['borderRadius'] ) && is_array( $title_styles['borderRadius'] ) ) {
				$css .= 'border-radius:' . $title_styles['borderRadius'][0] . 'px ' . $title_styles['borderRadius'][1] . 'px ' . $title_styles['borderRadius'][2] . 'px ' . $title_styles['borderRadius'][3] . 'px;';
			}
			if ( isset( $title_styles['borderWidth'] ) && is_array( $title_styles['borderWidth'] ) ) {
				$css .= 'border-width:' . $title_styles['borderWidth'][0] . 'px ' . $title_styles['borderWidth'][1] . 'px ' . $title_styles['borderWidth'][2] . 'px ' . $title_styles['borderWidth'][3] . 'px;';
			}
			if ( isset( $title_styles['padding'] ) && is_array( $title_styles['padding'] ) ) {
				if ( isset( $title_styles['padding'][0] ) && is_numeric( $title_styles['padding'][0] ) ) {
					$css .= 'padding-top:' . $title_styles['padding'][0] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['padding'][1] ) && is_numeric( $title_styles['padding'][1] ) ) {
					$css .= 'padding-right:' . $title_styles['padding'][1] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['padding'][2] ) && is_numeric( $title_styles['padding'][2] ) ) {
					$css .= 'padding-bottom:' . $title_styles['padding'][2] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['padding'][3] ) && is_numeric( $title_styles['padding'][3] ) ) {
					$css .= 'padding-left:' . $title_styles['padding'][3] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
			}
			if ( isset( $title_styles['marginTop'] ) && ! empty( $title_styles['marginTop'] ) ) {
				$css .= 'margin-top:' . $title_styles['marginTop'] . 'px;';
			}
			$css .= '}';
			if ( isset( $title_styles['paddingTablet'] ) && is_array( $title_styles['paddingTablet'] ) ) {
				$css .= '@media (max-width: 1024px) {';
				$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
				if ( isset( $title_styles['paddingTablet'][0] ) && is_numeric( $title_styles['paddingTablet'][0] ) ) {
					$css .= 'padding-top:' . $title_styles['paddingTablet'][0] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['paddingTablet'][1] ) && is_numeric( $title_styles['paddingTablet'][1] ) ) {
					$css .= 'padding-right:' . $title_styles['paddingTablet'][1] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['paddingTablet'][2] ) && is_numeric( $title_styles['paddingTablet'][2] ) ) {
					$css .= 'padding-bottom:' . $title_styles['paddingTablet'][2] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['paddingTablet'][3] ) && is_numeric( $title_styles['paddingTablet'][3] ) ) {
					$css .= 'padding-left:' . $title_styles['paddingTablet'][3] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $title_styles['paddingMobile'] ) && is_array( $title_styles['paddingMobile'] ) ) {
				$css .= '@media (max-width: 767px) {';
				$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
				if ( isset( $title_styles['paddingMobile'][0] ) && is_numeric( $title_styles['paddingMobile'][0] ) ) {
					$css .= 'padding-top:' . $title_styles['paddingMobile'][0] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['paddingMobile'][1] ) && is_numeric( $title_styles['paddingMobile'][1] ) ) {
					$css .= 'padding-right:' . $title_styles['paddingMobile'][1] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['paddingMobile'][2] ) && is_numeric( $title_styles['paddingMobile'][2] ) ) {
					$css .= 'padding-bottom:' . $title_styles['paddingMobile'][2] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				if ( isset( $title_styles['paddingMobile'][3] ) && is_numeric( $title_styles['paddingMobile'][3] ) ) {
					$css .= 'padding-left:' . $title_styles['paddingMobile'][3] . ( isset( $title_styles['paddingType'] ) && ! empty( $title_styles['paddingType'] ) ? $title_styles['paddingType'] : 'px' ) . ';';
				}
				$css .= '}';
				$css .= '}';
			}
			if ( isset( $title_styles['size'] ) && is_array( $title_styles['size'] ) && ! empty( $title_styles['size'][0] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header .kt-btn-svg-icon svg {';
				$css .= 'width:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
				$css .= 'height:' . $title_styles['size'][0] . ( ! isset( $title_styles['sizeType'] ) ? 'px' : $title_styles['sizeType'] ) . ';';
				$css .= '}';
			}
			if ( ! empty( $attr['iconColor']['standard'] ) || ! empty( $title_styles['color'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( ( ! empty( $attr['iconColor']['standard'] ) ? $attr['iconColor']['standard'] : $title_styles['color'] ) ) . ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger {';
				$css .= 'background:' . $this->kadence_color_output( ( ! empty( $attr['iconColor']['standard'] ) ? $attr['iconColor']['standard'] : $title_styles['color'] ) ) . ';';
				$css .= '}';
			}
			if ( isset( $title_styles['background'] ) && ! empty( $title_styles['background'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( $title_styles['background'] ) . ';';
				$css .= '}';
			}
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header:hover, .kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header:focus {';
			if ( isset( $title_styles['colorHover'] ) && ! empty( $title_styles['colorHover'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $title_styles['colorHover'] ) . ';';
			}
			if ( isset( $title_styles['backgroundHover'] ) && ! empty( $title_styles['backgroundHover'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundHover'] ) . ';';
			}
			if ( isset( $title_styles['borderHover'] ) && is_array( $title_styles['borderHover'] ) && ! empty( $title_styles['borderHover'][0] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $title_styles['borderHover'][0] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][1] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][2] ) . ' ' . $this->kadence_color_output( $title_styles['borderHover'][3] ) . ';';
			}
			$css .= '}';

			if ( ! empty( $attr['iconColor']['hover'] ) || ! empty( $title_styles['colorHover'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( ( ! empty( $attr['iconColor']['hover'] ) ? $attr['iconColor']['hover'] : $title_styles['colorHover'] ) ) . ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger {';
				$css .= 'background:' . $this->kadence_color_output( ( ! empty( $attr['iconColor']['hover'] ) ? $attr['iconColor']['hover'] : $title_styles['colorHover'] ) ) . ';';
				$css .= '}';
			}
			if ( isset( $title_styles['backgroundHover'] ) && ! empty( $title_styles['backgroundHover'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundHover'] ) . ';';
				$css .= '}';
			}
			$css .= '.kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header.kt-accordion-panel-active {';
			if ( isset( $title_styles['colorActive'] ) && ! empty( $title_styles['colorActive'] ) ) {
				$css .= 'color:' . $this->kadence_color_output( $title_styles['colorActive'] ) . ';';
			}
			if ( isset( $title_styles['backgroundActive'] ) && ! empty( $title_styles['backgroundActive'] ) ) {
				$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundActive'] ) . ';';
			}
			if ( isset( $title_styles['borderActive'] ) && is_array( $title_styles['borderActive'] ) && ! empty( $title_styles['borderActive'][0] ) ) {
				$css .= 'border-color:' . $this->kadence_color_output( $title_styles['borderActive'][0] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][1] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][2] ) . ' ' . $this->kadence_color_output( $title_styles['borderActive'][3] ) . ';';
			}
			$css .= '}';
			if ( ! empty( $attr['iconColor']['active'] ) || ! empty( $title_styles['colorActive'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( ( ! empty( $attr['iconColor']['active'] ) ? $attr['iconColor']['hover'] : $title_styles['colorActive'] ) ) . ';';
				$css .= '}';
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger {';
				$css .= 'background:' . $this->kadence_color_output( ( ! empty( $attr['iconColor']['active'] ) ? $attr['iconColor']['hover'] : $title_styles['colorActive'] ) ) . ';';
				$css .= '}';
			}
			if ( isset( $title_styles['backgroundActive'] ) && ! empty( $title_styles['backgroundActive'] ) ) {
				$css .= '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before {';
				$css .= 'background:' . $this->kadence_color_output( $title_styles['backgroundActive'] ) . ';';
				$css .= '}';
			}
		}
		if ( isset( $attr['titleStyles'] ) && is_array( $attr['titleStyles'] ) && isset( $attr['titleStyles'][0] ) && is_array( $attr['titleStyles'][0] ) && ( ( isset( $attr['titleStyles'][0]['size'] ) && is_array( $attr['titleStyles'][0]['size'] ) && isset( $attr['titleStyles'][0]['size'][1] ) && ! empty( $attr['titleStyles'][0]['size'][1] ) ) || ( isset( $attr['titleStyles'][0]['lineHeight'] ) && is_array( $attr['titleStyles'][0]['lineHeight'] ) && isset( $attr['titleStyles'][0]['lineHeight'][1] ) && ! empty( $attr['titleStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css .= '@media (max-width: 1024px) {';
			$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
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
			$css .= '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header {';
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
	 * Adds Google fonts for loading later
	 *
	 * @param array $attr the blocks attr.
	 */
	public function add_gfont( $attr ) {
		$defaults = array(
			'googleFont'     => false,
			'loadGoogleFont' => true,
			'typography'     => '',
			'fontVariant'    => '',
			'fontSubset'     => '',
			'loadItalic'     => false,
		);
		$attr     = wp_parse_args( $attr, $defaults );
		if ( true == $attr['googleFont'] && true == $attr['loadGoogleFont'] && ! empty( $attr['typography'] ) ) {
			// Check if the font has been added yet.
			if ( ! array_key_exists( $attr['typography'], self::$gfonts ) ) {
				$add_font                            = array(
					'fontfamily'   => $attr['typography'],
					'fontvariants' => ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ? array( $attr['fontVariant'] ) : array() ),
					'fontsubsets'  => ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ? array( $attr['fontSubset'] ) : array() ),
				);
				self::$gfonts[ $attr['typography'] ] = $add_font;
				// Check if wp_head has already run in which case we need to add to footer fonts.
				if ( did_action( 'wp_body_open' ) >= 1 ) {
					self::$footer_gfonts[ $attr['typography'] ] = $add_font;
				}
			} else {
				if ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ) {
					if ( ! in_array( $attr['fontVariant'], self::$gfonts[ $attr['typography'] ]['fontvariants'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontvariants'], $attr['fontVariant'] );
						if ( did_action( 'wp_body_open' ) >= 1 ) {
							if ( ! array_key_exists( $attr['typography'], self::$footer_gfonts ) ) {
								$add_font                                   = array(
									'fontfamily'   => $attr['typography'],
									'fontvariants' => ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ? array( $attr['fontVariant'] ) : array() ),
									'fontsubsets'  => ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ? array( $attr['fontSubset'] ) : array() ),
								);
								self::$footer_gfonts[ $attr['typography'] ] = $add_font;
							} else {
								array_push( self::$footer_gfonts[ $attr['typography'] ]['fontvariants'], $attr['fontVariant'] );
							}
						}
					}
				}
				if ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ) {
					if ( ! in_array( $attr['fontSubset'], self::$gfonts[ $attr['typography'] ]['fontsubsets'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontsubsets'], $attr['fontSubset'] );
						if ( did_action( 'wp_body_open' ) >= 1 ) {
							if ( ! array_key_exists( $attr['typography'], self::$footer_gfonts ) ) {
								$add_font                                   = array(
									'fontfamily'   => $attr['typography'],
									'fontvariants' => ( isset( $attr['fontVariant'] ) && ! empty( $attr['fontVariant'] ) ? array( $attr['fontVariant'] ) : array() ),
									'fontsubsets'  => ( isset( $attr['fontSubset'] ) && ! empty( $attr['fontSubset'] ) ? array( $attr['fontSubset'] ) : array() ),
								);
								self::$footer_gfonts[ $attr['typography'] ] = $add_font;
							} else {
								array_push( self::$footer_gfonts[ $attr['typography'] ]['fontsubsets'], $attr['fontSubset'] );
							}
						}
					}
				}
			}
			if ( isset( $attr['loadItalic'] ) && true == $attr['loadItalic'] ) {
				if ( isset( $attr['fontVariant'] ) && strpos( $attr['fontVariant'], 'italic' ) === false ) {
					$italicVersion = ( $attr['fontVariant'] === 'regular' ? 'italic' : $attr['fontVariant'] . 'italic' );
					if ( ! in_array( $italicVersion, self::$gfonts[ $attr['typography'] ]['fontvariants'], true ) ) {
						array_push( self::$gfonts[ $attr['typography'] ]['fontvariants'], $italicVersion );
						if ( did_action( 'wp_body_open' ) >= 1 ) {
							if ( ! array_key_exists( $attr['typography'], self::$footer_gfonts ) ) {
								array_push( self::$footer_gfonts[ $attr['typography'] ]['fontvariants'], $italicVersion );
							}
						}
					}
				}
			}
		}
	}

	/**
	 * Builds Css for row layout block.
	 *
	 * @param array $attr the blocks attr.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function row_layout_array_css( $attr, $unique_id ) {
		$css                          = new Kadence_Blocks_CSS();
		$media_query                  = array();
		$media_query['mobile']        = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['mobileReverse'] = apply_filters( 'kadence_mobile_reverse_media_query', '(min-width: 768px)' );
		$media_query['tablet']        = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['tabletOnly']    = apply_filters( 'kadence_tablet_only_media_query', '(min-width: 768px) and (max-width: 1024px)' );
		$media_query['desktop']       = apply_filters( 'kadence_desktop_media_query', '(min-width: 1025px)' );
		if ( isset( $attr['inheritMaxWidth'] ) && $attr['inheritMaxWidth'] ) {
			global $content_width;
			if ( isset( $content_width ) ) {
				if ( class_exists( 'Kadence\Theme' ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap.kb-theme-content-width' );
					$css->add_property( 'max-width', 'var( --global-content-width, ' . absint( $content_width ) . 'px )' );
					$css->set_selector( '.kt-layout-id' . $unique_id . ' > .kb-theme-content-width' );
					$css->add_property( 'padding-left', 'var(--global-content-edge-padding)' );
					$css->add_property( 'padding-right', 'var(--global-content-edge-padding)' );
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
		if ( isset( $attr['firstColumnWidth'] ) && ! empty( $attr['firstColumnWidth'] ) && isset( $attr['secondColumnWidth'] ) && ! empty( $attr['secondColumnWidth'] ) && ( isset( $attr['columns'] ) && 3 === $attr['columns'] ) ) {
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
		if ( isset( $attr['bgColor'] ) || isset( $attr['bgImg'] ) || isset( $attr['topMargin'] ) || isset( $attr['bottomMargin'] ) || isset( $attr['border'] ) || isset( $attr['borderWidth'] ) || isset( $attr['borderRadius'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id );
			if ( isset( $attr['topMargin'] ) ) {
				$css->add_property( 'margin-top', $attr['topMargin'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
			}
			if ( isset( $attr['bottomMargin'] ) ) {
				$css->add_property( 'margin-bottom', $attr['bottomMargin'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
			}
			if ( isset( $attr['border'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attr['border'] ) );
			}
			if ( isset( $attr['borderWidth'] ) && is_array( $attr['borderWidth'] ) ) {
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
			$has_radius = false;
			if ( isset( $attr['borderRadius'] ) && is_array( $attr['borderRadius'] ) ) {
				if ( isset( $attr['borderRadius'][0] ) && is_numeric( $attr['borderRadius'][0] ) ) {
					if ( 0 !== $attr['borderRadius'][0] ) {
						$has_radius = true;
					}
					$css->add_property( 'border-top-left-radius', $attr['borderRadius'][0] . 'px' );
				}
				if ( isset( $attr['borderRadius'][1] ) && is_numeric( $attr['borderRadius'][1] ) ) {
					if ( 0 !== $attr['borderRadius'][1] ) {
						$has_radius = true;
					}
					$css->add_property( 'border-top-right-radius', $attr['borderRadius'][1] . 'px' );
				}
				if ( isset( $attr['borderRadius'][2] ) && is_numeric( $attr['borderRadius'][2] ) ) {
					if ( 0 !== $attr['borderRadius'][2] ) {
						$has_radius = true;
					}
					$css->add_property( 'border-bottom-right-radius', $attr['borderRadius'][2] . 'px' );
				}
				if ( isset( $attr['borderRadius'][3] ) && is_numeric( $attr['borderRadius'][3] ) ) {
					if ( 0 !== $attr['borderRadius'][3] ) {
						$has_radius = true;
					}
					$css->add_property( 'border-bottom-left-radius', $attr['borderRadius'][3] . 'px' );
				}
			}
			if ( $has_radius ) {
				$css->add_property( 'overflow', 'hidden' );
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
		if ( isset( $attr['topPadding'] ) || isset( $attr['bottomPadding'] ) || isset( $attr['paddingUnit'] ) || isset( $attr['leftPadding'] ) || isset( $attr['rightPadding'] ) || isset( $attr['minHeight'] ) || isset( $attr['maxWidth'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
			if ( isset( $attr['topPadding'] ) || isset( $attr['paddingUnit'] ) ) {
				$css->add_property( 'padding-top', ( isset( $attr['topPadding'] ) ? $attr['topPadding'] : '25' ) . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
			}
			if ( isset( $attr['bottomPadding'] ) || isset( $attr['paddingUnit'] ) ) {
				$css->add_property( 'padding-bottom', ( isset( $attr['bottomPadding'] ) ? $attr['bottomPadding'] : '25' ) . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
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
				$css->add_property( 'max-width', $attr['maxWidth'] . ( isset( $attr['maxWidthUnit'] ) && ! empty( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
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
				$type = ( isset( $attr['overlayGradType'] ) ? $attr['overlayGradType'] : 'linear' );
				if ( 'radial' === $type ) {
					$angle = ( isset( $attr['overlayBgImgPosition'] ) ? 'at ' . $attr['overlayBgImgPosition'] : 'at center center' );
				} else {
					$angle = ( isset( $attr['overlayGradAngle'] ) ? $attr['overlayGradAngle'] . 'deg' : '180deg' );
				}
				$loc         = ( isset( $attr['overlayGradLoc'] ) ? $attr['overlayGradLoc'] : '0' );
				$color       = ( isset( $attr['overlay'] ) ? $css->render_color( $attr['overlay'], ( isset( $attr['overlayFirstOpacity'] ) && is_numeric( $attr['overlayFirstOpacity'] ) ? $attr['overlayFirstOpacity'] : 1 ) ) : 'transparent' );
				$locsecond   = ( isset( $attr['overlayGradLocSecond'] ) ? $attr['overlayGradLocSecond'] : '100' );
				$colorsecond = ( isset( $attr['overlaySecond'] ) ? $css->render_color( $attr['overlaySecond'], ( isset( $attr['overlaySecondOpacity'] ) && is_numeric( $attr['overlaySecondOpacity'] ) ? $attr['overlaySecondOpacity'] : 1 ) ) : '#00B5E2' );
				$css->add_property( 'background-image', $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
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
		$tablet_overlay    = ( isset( $attr['tabletOverlay'] ) && is_array( $attr['tabletOverlay'] ) && isset( $attr['tabletOverlay'][0] ) && is_array( $attr['tabletOverlay'][0] ) ? $attr['tabletOverlay'][0] : array() );
		$tablet_background = ( isset( $attr['tabletBackground'] ) && is_array( $attr['tabletBackground'] ) && isset( $attr['tabletBackground'][0] ) && is_array( $attr['tabletBackground'][0] ) ? $attr['tabletBackground'][0] : array() );
		if ( isset( $attr['tabletPadding'] ) || isset( $attr['topMarginT'] ) || isset( $attr['tabletBorder'] ) || isset( $attr['tabletBorderWidth'] ) || isset( $attr['tabletBorderRadius'] ) || isset( $attr['minHeightTablet'] ) || isset( $attr['bottomMarginT'] ) || ( isset( $tablet_overlay['enable'] ) && $tablet_overlay['enable'] ) || ( isset( $tablet_background['enable'] ) && $tablet_background['enable'] ) || isset( $attr['responsiveMaxWidth'] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			if ( isset( $attr['topMarginT'] ) || isset( $attr['bottomMarginT'] ) || isset( $attr['tabletBorder'] ) || isset( $attr['tabletBorderWidth'] ) || isset( $attr['tabletBorderRadius'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( isset( $attr['topMarginT'] ) ) {
					$css->add_property( 'margin-top', $attr['topMarginT'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
				}
				if ( isset( $attr['bottomMarginT'] ) ) {
					$css->add_property( 'margin-bottom', $attr['bottomMarginT'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
				}
				if ( isset( $attr['tabletBorder'] ) ) {
					$css->add_property( 'border-color', $css->render_color( $attr['tabletBorder'] ) );
				}
				if ( isset( $attr['tabletBorderWidth'] ) && is_array( $attr['tabletBorderWidth'] ) ) {
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
				if ( isset( $attr['tabletBorderRadius'] ) && is_array( $attr['tabletBorderRadius'] ) ) {
					if ( isset( $attr['tabletBorderRadius'][0] ) && is_numeric( $attr['tabletBorderRadius'][0] ) ) {
						$css->add_property( 'border-top-left-radius', $attr['tabletBorderRadius'][0] . 'px' );
					}
					if ( isset( $attr['tabletBorderRadius'][1] ) && is_numeric( $attr['tabletBorderRadius'][1] ) ) {
						$css->add_property( 'border-top-right-radius', $attr['tabletBorderRadius'][1] . 'px' );
					}
					if ( isset( $attr['tabletBorderRadius'][2] ) && is_numeric( $attr['tabletBorderRadius'][2] ) ) {
						$css->add_property( 'border-bottom-right-radius', $attr['tabletBorderRadius'][2] . 'px' );
					}
					if ( isset( $attr['tabletBorderRadius'][3] ) && is_numeric( $attr['tabletBorderRadius'][3] ) ) {
						$css->add_property( 'border-bottom-left-radius', $attr['tabletBorderRadius'][3] . 'px' );
					}
				}
			}
			if ( ( isset( $attr['tabletPadding'] ) && is_array( $attr['tabletPadding'] ) ) || isset( $attr['minHeightTablet'] ) || isset( $attr['responsiveMaxWidth'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
				if ( isset( $attr['tabletPadding'][0] ) && is_numeric( $attr['tabletPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attr['tabletPadding'][0] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['tabletPadding'][1] ) && is_numeric( $attr['tabletPadding'][1] ) ) {
					$css->add_property( 'padding-right', $attr['tabletPadding'][1] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['tabletPadding'][2] ) && is_numeric( $attr['tabletPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attr['tabletPadding'][2] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['tabletPadding'][3] ) && is_numeric( $attr['tabletPadding'][3] ) ) {
					$css->add_property( 'padding-left', $attr['tabletPadding'][3] . ( isset( $attr['paddingUnit'] ) && ! empty( $attr['paddingUnit'] ) ? $attr['paddingUnit'] : 'px' ) );
				}
				if ( isset( $attr['minHeightTablet'] ) ) {
					$css->add_property( 'min-height', $attr['minHeightTablet'] . ( isset( $attr['minHeightUnit'] ) && ! empty( $attr['minHeightUnit'] ) ? $attr['minHeightUnit'] : 'px' ) );
				}
				if ( isset( $attr['responsiveMaxWidth'] ) && isset( $attr['responsiveMaxWidth'][0] ) && is_numeric( $attr['responsiveMaxWidth'][0] ) ) {
					$css->add_property( 'max-width', $attr['responsiveMaxWidth'][0] . ( isset( $attr['maxWidthUnit'] ) && ! empty( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
					$css->add_property( 'margin-left', 'auto' );
					$css->add_property( 'margin-right', 'auto' );
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
				}
				if ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] && isset( $tablet_background['bgImg'] ) && ! empty( $tablet_background['bgImg'] ) && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' !== $tablet_background['bgImgAttachment'] ) {
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
				if ( isset( $tablet_overlay['overlayOpacity'] ) && is_numeric( $tablet_overlay['overlayOpacity'] ) ) {
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
					$loc         = ( ! empty( $tablet_overlay['overlayGradLoc'] ) ? $tablet_overlay['overlayGradLoc'] : '0' );
					$color       = ( ! empty( $tablet_overlay['overlay'] ) ? $css->render_color( $tablet_overlay['overlay'] ) : 'transparent' );
					$locsecond   = ( ! empty( $tablet_overlay['overlayGradLocSecond'] ) ? $tablet_overlay['overlayGradLocSecond'] : '100' );
					$colorsecond = ( ! empty( $tablet_overlay['overlaySecond'] ) ? $css->render_color( $tablet_overlay['overlaySecond'] ) : '#00B5E2' );
					$css->add_property( 'background-image', $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
				} else {
					if ( ! empty( $tablet_overlay['overlay'] ) ) {
						$css->add_property( 'background-color', $css->render_color( $tablet_overlay['overlay'] ) );
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
			if ( isset( $tablet_background['enable'] ) && $tablet_background['enable'] && isset( $tablet_background['forceOverDesk'] ) && $tablet_background['forceOverDesk'] ) {
				$css->start_media_query( $media_query['tabletOnly'] );
				$css->set_selector( '#kt-layout-id' . $unique_id );
				$css->add_property( 'background-image', 'none !important' );
				$css->set_selector( '#kt-layout-id' . $unique_id . ' [id*="jarallax-container-"]' );
				$css->add_property( 'display', 'none !important' );
				$css->stop_media_query();
			}
		}
		$mobile_overlay    = ( isset( $attr['mobileOverlay'] ) && is_array( $attr['mobileOverlay'] ) && isset( $attr['mobileOverlay'][0] ) && is_array( $attr['mobileOverlay'][0] ) ? $attr['mobileOverlay'][0] : array() );
		$mobile_background = ( isset( $attr['mobileBackground'] ) && is_array( $attr['mobileBackground'] ) && isset( $attr['mobileBackground'][0] ) && is_array( $attr['mobileBackground'][0] ) ? $attr['mobileBackground'][0] : array() );
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) || isset( $attr['mobileBorder'] ) || isset( $attr['mobileBorderWidth'] ) || isset( $attr['mobileBorderRadius'] ) || ( isset( $mobile_overlay['enable'] ) && $mobile_overlay['enable'] ) || isset( $attr['minHeightMobile'] ) || ( isset( $mobile_background['enable'] ) && $mobile_background['enable'] == 'true' ) || isset( $attr['responsiveMaxWidth'] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			if ( isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) || isset( $attr['mobileBorder'] ) || isset( $attr['mobileBorderWidth'] ) || isset( $attr['mobileBorderRadius'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( isset( $attr['topMarginM'] ) ) {
					$css->add_property( 'margin-top', $attr['topMarginM'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
				}
				if ( isset( $attr['bottomMarginM'] ) ) {
					$css->add_property( 'margin-bottom', $attr['bottomMarginM'] . ( isset( $attr['marginUnit'] ) && ! empty( $attr['marginUnit'] ) ? $attr['marginUnit'] : 'px' ) );
				}
				if ( isset( $attr['mobileBorder'] ) ) {
					$css->add_property( 'border-color', $css->render_color( $attr['mobileBorder'] ) );
				}
				if ( isset( $attr['mobileBorderWidth'] ) && is_array( $attr['mobileBorderWidth'] ) ) {
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
				if ( isset( $attr['mobileBorderRadius'] ) && is_array( $attr['mobileBorderRadius'] ) ) {
					if ( isset( $attr['mobileBorderRadius'][0] ) && is_numeric( $attr['mobileBorderRadius'][0] ) ) {
						$css->add_property( 'border-top-left-radius', $attr['mobileBorderRadius'][0] . 'px' );
					}
					if ( isset( $attr['mobileBorderRadius'][1] ) && is_numeric( $attr['mobileBorderRadius'][1] ) ) {
						$css->add_property( 'border-top-right-radius', $attr['mobileBorderRadius'][1] . 'px' );
					}
					if ( isset( $attr['mobileBorderRadius'][2] ) && is_numeric( $attr['mobileBorderRadius'][2] ) ) {
						$css->add_property( 'border-bottom-right-radius', $attr['mobileBorderRadius'][2] . 'px' );
					}
					if ( isset( $attr['mobileBorderRadius'][3] ) && is_numeric( $attr['mobileBorderRadius'][3] ) ) {
						$css->add_property( 'border-bottom-left-radius', $attr['mobileBorderRadius'][3] . 'px' );
					}
				}
			}
			if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['minHeightMobile'] ) || isset( $attr['responsiveMaxWidth'] ) ) {
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
				if ( isset( $attr['responsiveMaxWidth'] ) && isset( $attr['responsiveMaxWidth'][1] ) && is_numeric( $attr['responsiveMaxWidth'][1] ) ) {
					$css->add_property( 'max-width', $attr['responsiveMaxWidth'][1] . ( isset( $attr['maxWidthUnit'] ) && ! empty( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
					$css->add_property( 'margin-left', 'auto' );
					$css->add_property( 'margin-right', 'auto' );
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
					$css->add_property( 'background-image', 'none !important' );
					$css->set_selector( '#kt-layout-id' . $unique_id . ' [id*="jarallax-container-"]' );
					$css->add_property( 'display', 'none !important' );
				}
				if ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] && isset( $mobile_background['bgImg'] ) && ! empty( $mobile_background['bgImg'] ) && isset( $mobile_background['bgImgAttachment'] ) && 'parallax' !== $mobile_background['bgImgAttachment'] ) {
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
				if ( isset( $mobile_overlay['overlayOpacity'] ) && is_numeric( $mobile_overlay['overlayOpacity'] ) ) {
					if ( $mobile_overlay['overlayOpacity'] < 10 ) {
						$css->add_property( 'opacity', '0.0' . $mobile_overlay['overlayOpacity'] );
					} else if ( $mobile_overlay['overlayOpacity'] >= 100 ) {
						$css->add_property( 'opacity', '1' );
					} else {
						$css->add_property( 'opacity', '0.' . $mobile_overlay['overlayOpacity'] );
					}
				}
				if ( ! empty( $mobile_overlay['currentOverlayTab'] ) && 'grad' == $mobile_overlay['currentOverlayTab'] ) {
					$type = ( ! empty( $mobile_overlay['overlayGradType'] ) ? $mobile_overlay['overlayGradType'] : 'linear' );
					if ( 'radial' === $type ) {
						$angle = ( ! empty( $mobile_overlay['overlayBgImgPosition'] ) ? 'at ' . $mobile_overlay['overlayBgImgPosition'] : 'at center center' );
					} else {
						$angle = ( ! empty( $mobile_overlay['overlayGradAngle'] ) ? $mobile_overlay['overlayGradAngle'] . 'deg' : '180deg' );
					}
					$loc         = ( ! empty( $mobile_overlay['overlayGradLoc'] ) ? $mobile_overlay['overlayGradLoc'] : '0' );
					$color       = ( ! empty( $mobile_overlay['overlay'] ) ? $css->render_color( $mobile_overlay['overlay'] ) : 'transparent' );
					$locsecond   = ( ! empty( $mobile_overlay['overlayGradLocSecond'] ) ? $mobile_overlay['overlayGradLocSecond'] : '100' );
					$colorsecond = ( ! empty( $mobile_overlay['overlaySecond'] ) ? $css->render_color( $mobile_overlay['overlaySecond'] ) : '#00B5E2' );
					$css->add_property( 'background-image', $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
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
		if ( isset( $attr['kadenceBlockCSS'] ) && ! empty( $attr['kadenceBlockCSS'] ) ) {
			$css->add_css_string( str_replace( 'selector', '#kt-layout-id' . $unique_id, $attr['kadenceBlockCSS'] ) );
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
		$media_query['desktop'] = apply_filters( 'kadence_desktop_media_query', '(min-width: 1025px)' );
		// Style.
		if ( ! empty( $attr['maxWidth'][0] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attr['maxWidth'][0] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '1 ' . $attr['maxWidth'][0] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
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
			$css->set_selector( '.kt-inner-column-height-full > .wp-block-kadence-column.kadence-column' . $unique_id );
			$css->add_property( 'align-self', 'auto' );
			$css->set_selector( '.kt-inner-column-height-full > .wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
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
		if ( isset( $attr['topPaddingT'] ) || isset( $attr['bottomPaddingT'] ) || isset( $attr['leftPaddingT'] ) || isset( $attr['rightPaddingT'] ) || isset( $attr['topMarginT'] ) || isset( $attr['bottomMarginT'] ) || isset( $attr['rightMarginT'] ) || ! empty( $attr['height'][1] ) || isset( $attr['leftMarginT'] ) || isset( $attr['tabletBorderWidth'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( ! empty( $attr['height'][1] ) ) {
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
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attr['maxWidth'][2] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '1 ' . $attr['maxWidth'][2] . ( isset( $attr['maxWidthUnit'] ) ? $attr['maxWidthUnit'] : 'px' ) );
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
			if ( $desktop_direction === 'horizontal' ) {
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
		if ( isset( $attr['topPaddingM'] ) || isset( $attr['bottomPaddingM'] ) || isset( $attr['leftPaddingM'] ) || isset( $attr['rightPaddingM'] ) || isset( $attr['topMarginM'] ) || isset( $attr['bottomMarginM'] ) || isset( $attr['rightMarginM'] ) || isset( $attr['leftMarginM'] ) || ! empty( $attr['height'][2] ) || isset( $attr['mobileBorderWidth'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( ! empty( $attr['height'][2] ) ) {
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
		if ( isset( $attr['kadenceBlockCSS'] ) && ! empty( $attr['kadenceBlockCSS'] ) ) {
			$css->add_css_string( str_replace( 'selector', '.kadence-column' . $unique_id, $attr['kadenceBlockCSS'] ) );
		}

		return $css->css_output();
	}

	/**
	 * Adds var to color output if needed.
	 *
	 * @param string $color the output color.
	 */
	public function kadence_color_output( $color, $opacity = null ) {
		if ( strpos( $color, 'palette' ) === 0 ) {
			switch ( $color ) {
				case 'palette2':
					$fallback = '#2B6CB0';
					break;
				case 'palette3':
					$fallback = '#1A202C';
					break;
				case 'palette4':
					$fallback = '#2D3748';
					break;
				case 'palette5':
					$fallback = '#4A5568';
					break;
				case 'palette6':
					$fallback = '#718096';
					break;
				case 'palette7':
					$fallback = '#EDF2F7';
					break;
				case 'palette8':
					$fallback = '#F7FAFC';
					break;
				case 'palette9':
					$fallback = '#ffffff';
					break;
				default:
					$fallback = '#3182CE';
					break;
			}
			$color = 'var(--global-' . $color . ', ' . $fallback . ')';
		} elseif ( isset( $opacity ) && is_numeric( $opacity ) && 1 !== (int) $opacity ) {
			$color = $this->hex2rgba( $color, $opacity );
		}

		return $color;
	}
}

Kadence_Blocks_Frontend::get_instance();
