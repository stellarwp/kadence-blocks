<?php
/**
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package Kadence Blocks
 */

use function KadenceWP\KadenceBlocks\get_webfont_url;

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
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_inline_css' ), 20 );
		add_action( 'wp_head', array( $this, 'frontend_gfonts' ), 90 );
		add_action( 'wp_footer', array( $this, 'frontend_footer_gfonts' ), 90 );
		add_action( 'wp_head', array( $this, 'faq_schema' ), 91 );
		if ( ! is_admin() ) {
			add_action( 'render_block', array( $this, 'conditionally_render_block' ), 6, 3 );
		}
	}

	/**
	 * Check for logged in, logged out visibility settings.
	 *
	 * @param mixed $block_content The block content.
	 * @param array $block The block data.
	 * @param object $wp_block The block class object.
	 *
	 * @return mixed Returns the block content.
	 */
	public function conditionally_render_block( $block_content, $block, $wp_block ) {
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
	 * On init startup.
	 */
	public function on_init() {
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
	 * Loop through panes in an accordion and render the FAQ schema
	 *
	 * @param $accorion array
	 *
	 * @return void
	 */
	public function render_accordion_scheme_head( $accorion ) {
		if( !empty( $accorion['innerBlocks'] ) && is_array( $accorion['innerBlocks'] ) ) {
			foreach( $accorion['innerBlocks'] as $key => $block ) {
				if( isset( $block['blockName'] ) && $block['blockName'] === 'kadence/pane' ) {
					$this->render_pane_scheme_head( $block );
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
	 * Registers and enqueue's styles.
	 *
	 * @param string $handle the handle for the script.
	 */
	public function enqueue_style( $handle ) {
		if ( ! wp_style_is( $handle, 'registered' ) ) {
			$this->register_scripts();
		}
		wp_enqueue_style( $handle );
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

		$full_link = 'https://fonts.googleapis.com/css?family=' . esc_attr( str_replace( '|', '%7C', $link ) );
		$local_font_settings = get_option( 'kadence_blocks_font_settings' );
		if ( $local_font_settings && isset( $local_font_settings['load_fonts_local'] ) && $local_font_settings['load_fonts_local'] == 'true' && function_exists( 'KadenceWP\KadenceBlocks\get_webfont_url' )) {
			$full_link = get_webfont_url( htmlspecialchars_decode( $full_link ) );
		}
		echo '<link href="' . $full_link . '" rel="stylesheet">'; //phpcs:ignore
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
			$post_content = apply_filters( 'as3cf_filter_post_local_to_provider', $post_object->post_content );
			$blocks = parse_blocks( $post_content );
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
					/** !!!! Needs to stay to build schema !!! **/
					if ( 'kadence/accordion' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							if ( isset( $block['attrs']['faqSchema'] ) && $block['attrs']['faqSchema'] ) {
								$this->render_accordion_scheme_head( $block );
							}
						}
					}
					if ( 'core/block' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							if ( isset( $blockattr['ref'] ) ) {
								$reusable_block = get_post( $blockattr['ref'] );
								if ( $reusable_block && 'wp_block' === $reusable_block->post_type ) {
									$reuse_data_block = parse_blocks( $reusable_block->post_content );
									$this->blocks_cycle_through( $reuse_data_block, $kadence_blocks );
								}
							}
						}
					}
					if ( 'kadence/advanced-form' === $block['blockName'] ) {
						if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
							$blockattr = $block['attrs'];
							if ( isset( $blockattr['id'] ) ) {
								$form_block = get_post( $blockattr['id'] );
								if ( $form_block && 'kadence_form' === $form_block->post_type ) {
									$form_data_block = parse_blocks( $form_block->post_content );
									$this->blocks_cycle_through( $form_data_block, $kadence_blocks );
								}
							}
						}
					}
					if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
						$this->blocks_cycle_through( $block['innerBlocks'], $kadence_blocks );
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
	public function blocks_cycle_through( $inner_blocks, $kadence_blocks ) {
		foreach ( $inner_blocks as $in_indexkey => $inner_block ) {
			$inner_block = apply_filters( 'kadence_blocks_frontend_build_css', $inner_block );
			if ( ! is_object( $inner_block ) && is_array( $inner_block ) && isset( $inner_block['blockName'] ) ) {
				if ( isset( $kadence_blocks[ $inner_block['blockName'] ] ) ) {
					$block_class_instance = $kadence_blocks[ $inner_block['blockName'] ]::get_instance();
					$block_class_instance->output_head_data( $inner_block );
				}
				/** !!!! Needs to stay to build schema !!! **/
				if ( 'kadence/accordion' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						if ( isset( $inner_block['attrs']['faqSchema'] ) && $inner_block['attrs']['faqSchema'] ) {
							$this->render_accordion_scheme_head( $inner_block );
						}
					}
				}
				if ( 'core/block' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						if ( isset( $blockattr['ref'] ) ) {
							$reusable_block = get_post( $blockattr['ref'] );
							if ( $reusable_block && 'wp_block' === $reusable_block->post_type ) {
								$reuse_data_block = parse_blocks( $reusable_block->post_content );
								// This is a block inside itself.
								if ( isset( $reuse_data_block[0] ) && isset( $reuse_data_block[0]['blockName'] ) && 'core/block' === $reuse_data_block[0]['blockName'] && isset( $reuse_data_block[0]['attrs'] ) && isset( $reuse_data_block[0]['attrs']['ref'] ) && $reuse_data_block[0]['attrs']['ref'] === $blockattr['ref'] ) {
									return;
								}
								$this->blocks_cycle_through( $reuse_data_block, $kadence_blocks );
							}
						}
					}
				}
				if ( 'kadence/advanced-form' === $inner_block['blockName'] ) {
					if ( isset( $inner_block['attrs'] ) && is_array( $inner_block['attrs'] ) ) {
						$blockattr = $inner_block['attrs'];
						if ( isset( $blockattr['id'] ) ) {
							$form_block = get_post( $blockattr['id'] );
							if ( $form_block && 'kadence_form' === $form_block->post_type ) {
								$form_data_block = parse_blocks( $form_block->post_content );
								$this->blocks_cycle_through( $form_data_block, $kadence_blocks );
							}
						}
					}
				}
				if ( ! empty( $inner_block['innerBlocks'] ) && is_array( $inner_block['innerBlocks'] ) ) {
					$this->blocks_cycle_through( $inner_block['innerBlocks'], $kadence_blocks );
				}
			}
		}
	}
}

Kadence_Blocks_Frontend::get_instance();
