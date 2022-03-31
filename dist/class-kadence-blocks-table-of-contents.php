<?php
/**
 * Setup the Table of Contents Block.
 *
 * This Block was largely based on the Core Table of Contents block.
 *
 * @since   1.9.0
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Table of Contents.
 *
 * @category class
 */
class Kadence_Blocks_Table_Of_Contents {

	/**
	 * Google fonts to enqueue
	 *
	 * @var array
	 */
	public static $gfonts = array();

	/**
	 * Headers that needs ids.
	 *
	 * @var null
	 */
	public static $headings = array();

	/**
	 * Anchors that are used, prevent duplicates.
	 *
	 * @var null
	 */
	public static $anchors = array();

	/**
	 * Post content.
	 *
	 * @var string
	 */
	public static $output_content = '';

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * headings that are used, prevent duplicates.
	 *
	 * @var null
	 */
	public static $the_headings = null;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $is_started = '';

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
		add_action( 'wp_footer', array( $this, 'headings_enqueue' ), 1 );
		add_action( 'wp_head', array( $this, 'frontend_gfonts' ), 85 );
		add_filter( 'rank_math/researches/toc_plugins', array( $this, 'toc_filter_rankmath' ) );
		// add_action( 'wp_enqueue_scripts', array( $this, 'frontend_inline_css' ), 20 );
		// add_action( 'wp_head', array( $this, 'frontend_gfonts' ), 90 );
	}
	/**
	 * Filter to add plugins to the TOC list.
	 *
	 * @param array $toc_plugins TOC plugins.
	 */
	public function toc_filter_rankmath( $toc_plugins ) {
		$toc_plugins['kadence-blocks/kadence-blocks.php'] = 'Kadence Blocks';
		return $toc_plugins;
	}
	/**
	 * Enqueue Frontend Fonts
	 */
	public function frontend_gfonts() {
		if ( empty( self::$gfonts ) ) {
			return;
		}
		if ( class_exists( 'Kadence_Blocks_Frontend' ) ) {
			$ktblocks_instance = Kadence_Blocks_Frontend::get_instance();
			foreach ( self::$gfonts as $key => $gfont_values ) {
				if ( ! in_array( $key, $ktblocks_instance::$gfonts, true ) ) {
					$add_font = array(
						'fontfamily' => $gfont_values['fontfamily'],
						'fontvariants' => ( isset( $gfont_values['fontvariants'] ) && ! empty( $gfont_values['fontvariants'] ) ? $gfont_values['fontvariants'] : array() ),
						'fontsubsets' => ( isset(  $gfont_values['fontsubsets'] ) && !empty(  $gfont_values['fontsubsets'] ) ? $gfont_values['fontsubsets'] : array() ),
					);
					$ktblocks_instance::$gfonts[ $key ] = $add_font;
				} else {
					foreach ( $gfont_values['fontvariants'] as $gfontvariant_values ) {
						if ( ! in_array( $gfontvariant_values, $ktblocks_instance::$gfonts[ $key ]['fontvariants'], true ) ) {
							$ktblocks_instance::$gfonts[ $key ]['fontvariants'] = $gfontvariant_values;
						}
					}
					foreach ( $gfont_values['fontsubsets'] as $gfontsubset_values ) {
						if ( ! in_array( $gfontsubset_values, $ktblocks_instance::$gfonts[ $key ]['fontsubsets'], true ) ) {
							$ktblocks_instance::$gfonts[ $key ]['fontsubsets'] = $gfontsubset_values;
						}
					}
				}
			}
		}
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
		if ( is_admin() ) {
			return;
		}
		// Lets register all the block styles.
		wp_register_style( 'kadence-blocks-table-of-contents', KADENCE_BLOCKS_URL . 'dist/blocks/tableofcontents.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-blocks-gumshoe', KADENCE_BLOCKS_URL . 'dist/assets/js/gumshoe.min.js', array(), KADENCE_BLOCKS_VERSION, true );	
		wp_register_script( 'kadence-blocks-table-of-contents', KADENCE_BLOCKS_URL . 'dist/assets/js/kb-table-of-contents.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}
	/**
	 * Registers scripts and styles.
	 */
	public function headings_enqueue() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		wp_localize_script(
			'kadence-blocks-table-of-contents',
			'kadence_blocks_toc',
			array(
				'headings'      => wp_json_encode( self::$headings ),
				'expandText'    => esc_attr__( 'Expand Table of Contents', 'kadence-blocks' ),
				'collapseText'  => esc_attr__( 'Collapse Table of Contents', 'kadence-blocks' ),
			)
		);
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
	 * On init startup.
	 */
	public function on_init() {
		// Only load if Gutenberg is available.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}
		register_block_type(
			'kadence/tableofcontents',
			array(
				'render_callback' => array( $this, 'render_table_of_content' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
	}
	/**
	 * Helper function to remove the children of a node.
	 *
	 * @access private
	 *
	 * @param object $node The node to remove children from.
	 */
	public function table_of_contents_delete_node_children( $node ) {
		/* phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase */
		// Disabled because of PHP DOMDoument and DOMXPath APIs using camelCase.

		// Whenever the 1st child node is removed, the 2nd one becomes the 1st.
		while ( isset( $node->firstChild ) ) {
			$this->table_of_contents_delete_node_children( $node->firstChild );
			$node->removeChild( $node->firstChild );
		}
		/* phpcs:enable */
	}

	/**
	 * Helper function to remove a node and all of its children.
	 *
	 * @access private
	 *
	 * @param object $node The node to remove along with its children.
	 */
	public function table_of_contents_delete_node_and_children( $node ) {
		/* phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase */
		// Disabled because of PHP DOMDoument and DOMXPath APIs using camelCase.

		$this->table_of_contents_delete_node_children( $node );
		$node->parentNode->removeChild( $node );
		/* phpcs:enable */
	}
	/**
	 * Gets the content, anchor, level, and page of headings from a post. Returns
	 * data from all headings in a paginated post if $current_page_only is false;
	 * otherwise, returns only data from headings on the current page being
	 * rendered.
	 *
	 * @access private
	 *
	 * @param WP_Post $post The post to extract headings from.
	 * @param array   $attributes the block attributes.
	 *
	 * @return array The list of headings.
	 */
	private function table_of_contents_get_headings( $post, $attributes = array() ) {
		global $multipage, $page, $pages;
		if ( $multipage ) {
			// Creates a list of heading lists, one list per page.
			$pages_of_headings = array_map(
				function( $page_content, $page_index ) use ( $page, $attributes ) {
					return $this->table_of_contents_get_headings_from_content(
						$page_content,
						$page_index + 1,
						$page,
						$attributes
					);
				},
				$pages,
				array_keys( $pages )
			);
			$current_page_only = true;
			if ( $current_page_only ) {
				// Return the headings from the current page.
				return $pages_of_headings[ $page - 1 ];
			} else {
				// Concatenate the heading lists into a single array and return it.
				return array_merge( ...$pages_of_headings );
			}
		} else {
			// Only one page, so return headings from entire post_content.
			if ( is_null( self::$the_headings ) ) {
				if ( isset( $attributes['enableDynamicSearch'] ) && $attributes['enableDynamicSearch'] ) {
					$blocks = parse_blocks( $post->post_content );
					self::$output_content = '';
					foreach ( $blocks as $block ) {
						$this->recursively_parse_blocks( $block );
					}
					if ( self::$output_content ) {
						$page_content = do_shortcode( self::$output_content );
					} else {
						$page_content = do_shortcode( $post->post_content );
					}
				} else {
					$page_content = $post->post_content;
				}
				self::$the_headings = $this->table_of_contents_get_headings_from_content( $page_content, 1, 1, $attributes );
			}
			$headings = self::$the_headings;
		
			if ( $attributes && isset( $attributes['allowedHeaders'] ) && isset( $attributes['allowedHeaders'][0] ) && is_array( $attributes['allowedHeaders'][0] ) ) {
				if ( isset( $attributes['allowedHeaders'][0]['h1'] ) && ! $attributes['allowedHeaders'][0]['h1'] ) {
					foreach ( $headings as $headkey => $headvalue ) {
						if ( $headvalue['level'] === 1 ) {
							unset( $headings[$headkey] );
						}
					}
				}
				if ( isset( $attributes['allowedHeaders'][0]['h2'] ) && ! $attributes['allowedHeaders'][0]['h2'] ) {
					foreach ( $headings as $headkey => $headvalue ) {
						if ( $headvalue['level'] === 2 ) {
							unset( $headings[$headkey] );
						}
					}
				}
				if ( isset( $attributes['allowedHeaders'][0]['h3'] ) && ! $attributes['allowedHeaders'][0]['h3'] ) {
					foreach ( $headings as $headkey => $headvalue ) {
						if ( $headvalue['level'] === 3 ) {
							unset( $headings[$headkey] );
						}
					}
				}
				if ( isset( $attributes['allowedHeaders'][0]['h4'] ) && ! $attributes['allowedHeaders'][0]['h4'] ) {
					foreach ( $headings as $headkey => $headvalue ) {
						if ( $headvalue['level'] === 4 ) {
							unset( $headings[$headkey] );
						}
					}
				}
				if ( isset( $attributes['allowedHeaders'][0]['h5'] ) && ! $attributes['allowedHeaders'][0]['h5'] ) {
					foreach ( $headings as $headkey => $headvalue ) {
						if ( $headvalue['level'] === 5 ) {
							unset( $headings[$headkey] );
						}
					}
				}
				if ( isset( $attributes['allowedHeaders'][0]['h6'] ) && ! $attributes['allowedHeaders'][0]['h6'] ) {
					foreach ( $headings as $headkey => $headvalue ) {
						if ( $headvalue['level'] === 6 ) {
							unset( $headings[$headkey] );
						}
					}
				}
			}
			return array_values($headings);
		}
	}
	/**
	 * Renders blocks to allow dynamic blocks that bring in headings to be accounted for.
	 *
	 * @access private
	 *
	 * @param string $block The page content content.
	 */
	private function recursively_parse_blocks( $block ) {
		if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
			// Can't link to inner blocks to ignore.
			if ( 'kadence/accordion' === $block['blockName'] || 'kadence/tabs' === $block['blockName'] ) {
				self::$output_content .= render_block( $block );
			} else {
				foreach( $block['innerBlocks'] as $inner_block ) {
					$this->recursively_parse_blocks( $inner_block );
				}
			}
		} elseif ( 'kadence/tableofcontents' !== $block['blockName'] && 'core/block' !== $block['blockName'] ) {
			self::$output_content .= render_block( $block );
		}
	}
	/**
	 * Extracts heading content, anchor, and level from the given post content.
	 *
	 * @access private
	 *
	 * @param string $content The heading content.
	 *
	 * @return string The sanitized heading content for anchor link.
	 */
	private function convert_text_to_anchor( $content ) {
		$content = strtolower( $content );
		$content = preg_replace( "/[^A-Za-z0-9 ]/", '', $content );
		$content = str_replace( ' ', '-', $content );
		return $content;
	}
	/**
	 * Extracts heading content, anchor, and level from the given post content.
	 *
	 * @access private
	 *
	 * @param string $content       The post content to extract headings from.
	 * @param int    $headings_page The page of the post where the headings are
	 *                              located.
	 * @param int    $current_page  The page of the post currently being rendered.
	 * @param array  $attributes    The block attributes.
	 *
	 * @return array The list of headings.
	 */
	private function table_of_contents_get_headings_from_content(
		$content,
		$headings_page = 1,
		$current_page = 1,
		$attributes = array()
	) {
		/* phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase */
		// Disabled because of PHP DOMDoument and DOMXPath APIs using camelCase.
		// Create a document to load the post content into.
		//$doc = new DOMDocument();
		$wp_charset = get_bloginfo( 'charset' );
		$doc = new DOMDocument( '1.0', $wp_charset );
		// Enable user error handling for the HTML parsing. HTML5 elements aren't
		// supported (as of PHP 7.4) and There's no way to guarantee that the markup
		// is valid anyway, so we're just going to ignore all errors in parsing.
		// Nested heading elements will still be parsed.
		// The lack of HTML5 support is a libxml2 issue:
		// https://bugzilla.gnome.org/show_bug.cgi?id=761534.
		libxml_use_internal_errors( true );
		// Parse the post content into an HTML document.
		$content = mb_convert_encoding( $content, 'HTML-ENTITIES', 'UTF-8' );
		$doc->loadHTML(
			// loadHTML expects ISO-8859-1, so we need to convert the post content to
			// that format. We use htmlentities to encode Unicode characters not
			// supported by ISO-8859-1 as HTML entities. However, this function also
			// converts all special characters like < or > to HTML entities, so we use
			// htmlspecialchars_decode to decode them.
			htmlspecialchars_decode(
				utf8_decode(
					htmlentities(
						'<!DOCTYPE html><html><head><title>:D</title><body>' .
						htmlspecialchars( $content ) .
							'</body></html>',
						ENT_COMPAT,
						'UTF-8',
						false
					)
				),
				ENT_COMPAT
			)
		);
		// We're done parsing, so we can disable user error handling. This also
		// clears any existing errors, which helps avoid a memory leak.
		libxml_use_internal_errors( false );
		$document_el = $doc->documentElement;
		// IE11 treats template elements like divs, so to avoid extracting heading
		// elements from them, we first have to remove the template elements and
		// their children.
		// We can't use foreach directly on the $templates DOMNodeList because it's a
		// dynamic list, and removing nodes confuses the foreach iterator. So
		// instead, we create a static array of the nodes we want to remove and then
		// iterate over that.
		$templates = iterator_to_array(
			$document_el->getElementsByTagName( 'template' )
		);
		foreach ( $templates as $template ) {
			$this->table_of_contents_delete_node_and_children( $template );
		}
		$xpath = new DOMXPath( $doc );
		$query = '//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]';
		// Remove this since the headings are cached, instead strip out the ones we don't want from the cached response.
		/*
		if ( $attributes && isset( $attributes['allowedHeaders'] ) && isset( $attributes['allowedHeaders'][0] ) && is_array( $attributes['allowedHeaders'][0] ) ) {
			$query = '//*[';
			$arr   = array();
			if ( isset( $attributes['allowedHeaders'][0]['h1'] ) && $attributes['allowedHeaders'][0]['h1'] ) {
				$arr[] = 'self::h1';
			}
			if ( isset( $attributes['allowedHeaders'][0]['h2'] ) && $attributes['allowedHeaders'][0]['h2'] ) {
				$arr[] = 'self::h2';
			}
			if ( isset( $attributes['allowedHeaders'][0]['h3'] ) && $attributes['allowedHeaders'][0]['h3'] ) {
				$arr[] = 'self::h3';
			}
			if ( isset( $attributes['allowedHeaders'][0]['h4'] ) && $attributes['allowedHeaders'][0]['h4'] ) {
				$arr[] = 'self::h4';
			}
			if ( isset( $attributes['allowedHeaders'][0]['h5'] ) && $attributes['allowedHeaders'][0]['h5'] ) {
				$arr[] = 'self::h5';
			}
			if ( isset( $attributes['allowedHeaders'][0]['h6'] ) && $attributes['allowedHeaders'][0]['h6'] ) {
				$arr[] = 'self::h6';
			}
			$query .= implode( ' or ', $arr );
			$query .= ']';
		}
		*/
		// Get all heading elements in the post content.
		$temp_headings = iterator_to_array(
			$xpath->query( $query )
		);
		$headings = array();
		foreach ( $temp_headings as $temp_heading ) {
			if ( isset( $temp_heading->attributes ) ) {
				$heading_classes_string = $temp_heading->attributes->getNamedItem( 'class' );
				if ( null !== $heading_classes_string ) {
					$heading_classes = explode( ' ', trim( $heading_classes_string->nodeValue ) );
					$exclude_classes = array( 'kt-testimonial-title', 'image-overlay-title', 'image-overlay-subtitle', 'toc-ignore' );
					$exclude         = false;
					foreach ( $exclude_classes as $exclude_class ) {
						if ( in_array( $exclude_class, $heading_classes ) ) {
							$exclude = true;
							break;
						}
					}
					if ( $exclude ) {
						continue;
					}
				}
			}
			$headings[] = $temp_heading;
		}
		return array_map(
			function ( $heading ) use ( $headings_page, $current_page ) {
				$anchor_string = false;
				$anchor        = '';
				if ( isset( $heading->attributes ) ) {
					$id_attribute = $heading->attributes->getNamedItem( 'id' );
					if ( null !== $id_attribute ) {
						// The id attribute may contain many ids, so just use the first.
						$first_id = explode( ' ', trim( $id_attribute->nodeValue ) )[0];

						if ( $headings_page === $current_page ) {
							$anchor = '#' . $first_id;
						} elseif ( 1 !== $headings_page && 1 === $current_page ) {
							$anchor = './' . $headings_page . '/#' . $first_id;
						} elseif ( 1 === $headings_page && 1 !== $current_page ) {
							$anchor = '../#' . $first_id;
						} else {
							$anchor = '../' . $headings_page . '/#' . $first_id;
						}
					} else {
						$anchor_string = $this->convert_text_to_anchor( $heading->textContent );
						if ( ! $anchor_string ) {
							$anchor_string = uniqid( 'hd-' );
						}
						if ( in_array( $anchor_string, self::$anchors ) ) {
							$anchor_string = $anchor_string . uniqid( '-hd-' );
						}
						self::$anchors[] = $anchor_string;
						$anchor = '#' . $anchor_string;
					}
				} else {
					$anchor_string = $this->convert_text_to_anchor( $heading->textContent );
					if ( ! $anchor_string ) {
						$anchor_string = uniqid( 'hd-' );
					}
					if ( in_array( $anchor_string, self::$anchors ) ) {
						$anchor_string = $anchor_string . uniqid( '-hd-' );
					}
					self::$anchors[] = $anchor_string;
					$anchor = '#' . $anchor_string;
				}

				switch ( $heading->nodeName ) {
					case 'h1':
						$level = 1;
						break;
					case 'h2':
						$level = 2;
						break;
					case 'h3':
						$level = 3;
						break;
					case 'h4':
						$level = 4;
						break;
					case 'h5':
						$level = 5;
						break;
					case 'h6':
						$level = 6;
						break;
				}
				if ( $anchor_string ) {
					$add = true;
					foreach ( self::$headings as $v ) {
						if ( $v['anchor'] == $anchor_string ) {
							$add = false;
						}
					}
					if ( $add ) {
						self::$headings[] = array(
							'anchor'  => $anchor_string,
							'content' => $this->convert_smart_quotes( $heading->textContent ),
							'level'   => $level,
							'page'    => $headings_page,
						);
					}
				}
				return array(
					'anchor'  => $anchor,
					'content' => $this->convert_smart_quotes( $heading->textContent ),
					'level'   => $level,
					'page'    => $headings_page,
				);
			},
			$headings
		);
		/* phpcs:enable */
	}
	/**
	 * converts special quotes characters in string to normal.
	 *
	 * @param string $string The string to convert.
	 * @return string The string converted.
	 */
	public function convert_smart_quotes( $string ) { 
		$search = array("’",
						"‘",
						"”", 
						"“", 
						"–",
						"—",
						"…"); 
		$replace = array("'",
						 "'",  
						 '"', 
						 '"', 
						 '-',
						 '-',
						 '...'); 
	
		return str_replace( $search, $replace, $string ); 
	} 
	/**
	 * Sets the current post for usage in template blocks.
	 *
	 * @return WP_Post|null The post if any, or null otherwise.
	 */
	public function get_post_from_context() {
		// TODO: Without this temporary fix, an infinite loop can occur where
		// posts with post content blocks render themselves recursively.
		if ( is_admin() || defined( 'REST_REQUEST' ) ) {
			return null;
		}
		// Prevent an issue with the terms and conditions page in the woocommerce checkout.
		if ( class_exists( 'woocommerce' ) && is_checkout() ) {
			return '';
		}
		// Bug when called in via a hook on the front page.
		// if ( ! in_the_loop() && ! is_front_page() ) {
		// 	rewind_posts();
		// 	the_post();
		// }
		return get_post();
	}
	/**
	 * Converts a flat list of heading parameters to a hierarchical nested list
	 * based on each header's immediate parent's level.
	 *
	 * @access private
	 *
	 * @param array $heading_list Flat list of heading parameters to nest.
	 * @param int   $index        The current list index.
	 *
	 * @return array A hierarchical nested list of heading parameters.
	 */
	private function table_of_contents_linear_to_nested_heading_list(
		$heading_list,
		$index = 0
	) {
		$nested_heading_list = array();

		foreach ( $heading_list as $key => $heading ) {
			if ( ! isset( $heading['content'] ) ) {
				break;
			}

			// Make sure we are only working with the same level as the first
			// iteration in our set.
			if ( $heading['level'] === $heading_list[0]['level'] ) {
				// Check that the next iteration will return a value.
				// If it does and the next level is greater than the current level,
				// the next iteration becomes a child of the current interation.
				if (
					isset( $heading_list[ $key + 1 ] ) &&
					$heading_list[ $key + 1 ]['level'] > $heading['level']
				) {
					// We need to calculate the last index before the next iteration
					// that has the same level (siblings). We then use this last index
					// to slice the array for use in recursion. This prevents duplicate
					// nodes.
					$heading_list_length = count( $heading_list );
					$end_of_slice        = $heading_list_length;
					for ( $i = $key + 1; $i < $heading_list_length; $i++ ) {
						if ( $heading_list[ $i ]['level'] === $heading['level'] ) {
							$end_of_slice = $i;
							break;
						}
					}

					// Found a child node: Push a new node onto the return array with
					// children.
					$nested_heading_list[] = array(
						'heading'  => $heading,
						'index'    => $index + $key,
						'children' => $this->table_of_contents_linear_to_nested_heading_list(
							array_slice(
								$heading_list,
								$key + 1,
								$end_of_slice - ( $key + 1 )
							),
							$index + $key + 1
						),
					);
				} else {
					// No child node: Push a new node onto the return array.
					$nested_heading_list[] = array(
						'heading'  => $heading,
						'index'    => $index + $key,
						'children' => null,
					);
				}
			}
		}

		return $nested_heading_list;
	}
	/**
	 * Renders the heading list of the kadence table of contents block on server.
	 *
	 * @access private
	 *
	 * @param array  $nested_heading_list Nested list of heading data.
	 * @param bool   $wrap if the list should be wrapped.
	 * @param string $list_tag the tag to be used if wrapped.
	 *
	 * @return string The heading list rendered as HTML.
	 */
	private function table_of_contents_render_list( $nested_heading_list, $wrap = false, $list_tag = 'ul' ) {
		$entry_class = 'kb-table-of-contents__entry';
		$child_nodes = array_map(
			function ( $child_node ) use ( $entry_class, $list_tag ) {
				$anchor  = $child_node['heading']['anchor'];
				$content = $child_node['heading']['content'];

				if ( isset( $anchor ) && '' !== $anchor ) {
					$entry = sprintf(
						'<a class="%1$s" href="%2$s">%3$s</a>',
						$entry_class,
						esc_attr( $anchor ),
						esc_html( $content )
					);
				} else {
					$entry = sprintf(
						'<span class="%1$s">%2$s</span>',
						$entry_class,
						esc_html( $content )
					);
				}

				return sprintf(
					'<li>%1$s%2$s</li>',
					$entry,
					$child_node['children']
						? $this->table_of_contents_render_list( $child_node['children'], true, $list_tag )
						: null
				);
			},
			$nested_heading_list
		);

		return $wrap ? '<' . $list_tag . ' class="kb-table-of-contents-list-sub">' . implode( $child_nodes ) . '</' . $list_tag . '>' : implode( $child_nodes );
	}
	/**
	 * Render Table Of Contents Block
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_table_of_content( $attributes, $content ) {
		$the_post = $this->get_post_from_context();
		// CSS class string.
		$class = 'wp-block-kadence-tableofcontents kb-table-of-content-nav kb-table-of-content-id' . $attributes['uniqueID'];

		// Add custom CSS classes to class string.
		if ( isset( $attributes['className'] ) ) {
			$class .= ' ' . $attributes['className'];
		}

		if ( ! $the_post ) {
			return '';
		}
		$headings = $this->table_of_contents_get_headings(
			$the_post,
			$attributes
		);
		$list_tag = ( isset( $attributes['listStyle'] ) && 'numbered' === $attributes['listStyle'] ? 'ol' : 'ul' );

		// If there are no headings or the only heading is empty.
		if ( count( $headings ) === 0 || '' === $headings[0]['content'] ) {
			return '';
		}
		if ( ! isset( $attributes['enableTitle'] ) || isset( $attributes['enableTitle'] ) && $attributes['enableTitle'] ) {
			if ( isset( $attributes['enableToggle'] ) && $attributes['enableToggle'] ) {
				$enable_toggle = true;
				$start_closed  = ( isset( $attributes['startClosed'] ) && $attributes['startClosed'] ? true : false );
				$title_toggle  = ( isset( $attributes['enableTitleToggle'] ) && $attributes['enableTitleToggle'] ? true : false );
			} else {
				$enable_toggle = false;
				$start_closed  = false;
				$title_toggle  = false;
			}
		} else {
			$enable_toggle = false;
			$start_closed  = false;
			$title_toggle  = false;
		}
		$enable_scroll = false;
		$scroll_offset = '40';
		if ( isset( $attributes['enableSmoothScroll'] ) && true === $attributes['enableSmoothScroll'] ) {
			$enable_scroll = true;
			$scroll_offset = ( isset( $attributes['smoothScrollOffset'] ) && is_numeric( $attributes['smoothScrollOffset'] ) ? $attributes['smoothScrollOffset'] : '40' );
			$class .= ' kb-toc-smooth-scroll';
		}
		//print_r( $attributes );
		$output = '<nav class="' . esc_attr( $class ) . ( $enable_toggle ? ' kb-collapsible-toc kb-toc-toggle-' . ( $start_closed ? 'hidden' : 'active' ) : '' ) . '" role="navigation" aria-label="' . esc_attr__( 'Table Of Contents', 'kadence-blocks' ) . '"' . ( $enable_scroll ? ' data-scroll-offset="' . esc_attr( $scroll_offset ) . '"' : '' ) . ( isset( $attributes['enableScrollSpy'] ) && true === $attributes['enableScrollSpy'] ? ' data-scroll-spy="true"' : '' ) . '>';
		$output .= '<div class="kb-table-of-content-wrap">';
		if ( ! isset( $attributes['enableTitle'] ) || isset( $attributes['enableTitle'] ) && $attributes['enableTitle'] ) {
			$output .= '<div class="kb-table-of-contents-title-wrap kb-toggle-icon-style-' . ( $enable_toggle && isset( $attributes['toggleIcon'] ) && $attributes['toggleIcon'] ? $attributes['toggleIcon'] : 'arrow' ) . '">';
			if ( $title_toggle ) {
				$output .= '<button class="kb-table-of-contents-title-btn kb-table-of-contents-toggle" aria-expanded="' . esc_attr( $start_closed ? 'false' : 'true' ) . '" aria-label="' . ( $start_closed ? esc_attr__( 'Expand Table of Contents', 'kadence-blocks' ) : esc_attr__( 'Collapse Table of Contents', 'kadence-blocks' ) ) . '">';
			}
			$output .= '<span class="kb-table-of-contents-title">';
			$output .= ( isset( $attributes['title'] ) ? $attributes['title'] : __( 'Table of Contents', 'kadence-blocks' ) );
			$output .= '</span>';
			if ( $enable_toggle ) {
				if ( $title_toggle ) {
					$output .= '<span class="kb-table-of-contents-icon-trigger"></span>';
				} else {
					$output .= '<button class="kb-table-of-contents-icon-trigger kb-table-of-contents-toggle" aria-expanded="' . esc_attr( $start_closed ? 'false' : 'true' ) . '" aria-label="' . ( $start_closed ? esc_attr__( 'Expand Table of Contents', 'kadence-blocks' ) : esc_attr__( 'Collapse Table of Contents', 'kadence-blocks' ) ) . '"></button>';
				}
			}
			if ( $title_toggle ) {
				$output .= '</button>';
			}
			$output .= '</div>';
		}
		$output .= '<' . $list_tag . ' class="kb-table-of-content-list kb-table-of-content-list-columns-' . esc_attr( isset( $attributes['columns'] ) && ! empty( $attributes['columns'] ) ? $attributes['columns'] : '1' ) . ' kb-table-of-content-list-style-' . esc_attr( isset( $attributes['listStyle'] ) && ! empty( $attributes['listStyle'] ) ? $attributes['listStyle'] : 'disc' ) . ' kb-table-of-content-link-style-' . esc_attr( isset( $attributes['linkStyle'] ) && ! empty( $attributes['linkStyle'] ) ? $attributes['linkStyle'] : 'underline' ) . '">';
		$output .= $this->table_of_contents_render_list(
			$this->table_of_contents_linear_to_nested_heading_list( $headings, false ),
			false,
			$list_tag
		);
		$output .= '</' . $list_tag . '>';
		$output .= '</div>';
		$output .= '</nav>';
		$content = $output . $content;
		if ( ! wp_style_is( 'kadence-blocks-table-of-contents', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-table-of-contents' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kb-tableofcontents' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'tableofcontent', $unique_id ) ) {
				if ( kadence_blocks_is_not_amp() ) {
					if ( isset( $attributes['enableScrollSpy'] ) && $attributes['enableScrollSpy'] ) {
						wp_enqueue_script( 'kadence-blocks-gumshoe' );
					}
					wp_enqueue_script( 'kadence-blocks-table-of-contents' );
				}
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! wp_style_is( 'kadence-blocks-table-of-contents', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-table-of-contents' );
					}
				} else {
					if ( ! wp_style_is( 'kadence-blocks-table-of-contents', 'done' ) ) {
						ob_start();
							wp_print_styles( 'kadence-blocks-table-of-contents' );
						$content = ob_get_clean() . $content;
					}
				}
				$css = $this->output_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
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
	 * Output CSS styling for Table of Contents Block
	 *
	 * @param string $color the output color.
	 */
	public function output_css( $attributes, $unique_id ) {
		$css                    = new Kadence_Blocks_CSS();
		$media_query            = array();
		$media_query['mobile']  = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['tablet']  = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['desktop'] = apply_filters( 'kadence_tablet_media_query', '(min-width: 1025px)' );
		// Container.
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ':not(.this-class-is-for-specificity):not(.class-is-for-specificity)' );
		if ( isset( $attributes['containerMargin'] ) && is_array( $attributes['containerMargin'] ) ) {
			$css->add_property( 'margin', $css->render_measure( $attributes['containerMargin'], ( ! empty( $attributes['containerMarginUnit'] ) ? $attributes['containerMarginUnit'] : 'px' ) ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap' );
		if ( isset( $attributes['containerPadding'] ) && is_array( $attributes['containerPadding'] ) ) {
			$css->add_property( 'padding', $css->render_measure( $attributes['containerPadding'], ( isset( $attributes['containerPaddingUnit'] ) && ! empty( $attributes['containerPaddingUnit'] ) ? $attributes['containerPaddingUnit'] : 'px' ) ) );
		}
		if ( isset( $attributes['containerBackground'] ) && ! empty( $attributes['containerBackground'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $attributes['containerBackground'] ) );
		}
		if ( isset( $attributes['containerBorderColor'] ) && ! empty( $attributes['containerBorderColor'] ) ) {
			$css->add_property( 'border-color', $css->render_color( $attributes['containerBorderColor'] ) );
		}
		if ( isset( $attributes['containerBorder'] ) && is_array( $attributes['containerBorder'] ) ) {
			$css->add_property( 'border-width', $css->render_measure( $attributes['containerBorder'], 'px' ) );
		}
		if ( isset( $attributes['borderRadius'] ) && ! empty( $attributes['borderRadius'] ) && is_array( $attributes['borderRadius'] ) ) {
			$css->add_property( 'border-radius', $css->render_measure( $attributes['borderRadius'], 'px' ) );
		}
		if ( isset( $attributes['displayShadow'] ) && true == $attributes['displayShadow'] ) {
			if ( isset( $attributes['shadow'] ) && is_array( $attributes['shadow'] ) && isset( $attributes['shadow'][0] ) && is_array( $attributes['shadow'][0] ) ) {
				$css->add_property( 'box-shadow', $css->render_shadow( $attributes['shadow'][0] ) );
			} else {
				$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
			}
		}
		if ( isset( $attributes['maxWidth'] ) && ! empty( $attributes['maxWidth'] ) ) {
			$css->add_property( 'max-width', $css->render_number( $attributes['maxWidth'], 'px' ) );
		}
		// Title.
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title-wrap' );
		if ( isset( $attributes['titleAlign'] ) ) {
			$css->add_property( 'text-align', $css->render_string( $attributes['titleAlign'] ) );
		}
		if ( isset( $attributes['titlePadding'] ) && is_array( $attributes['titlePadding'] ) ) {
			$css->add_property( 'padding', $css->render_measure( $attributes['titlePadding'], ( isset( $attributes['titlePaddingUnit'] ) && ! empty( $attributes['titlePaddingUnit'] ) ? $attributes['titlePaddingUnit'] : 'px' ) ) );
		}
		if ( isset( $attributes['titleBorder'] ) && is_array( $attributes['titleBorder'] ) ) {
			$css->add_property( 'border-width', $css->render_measure( $attributes['titleBorder'], 'px' ) );
		}
		if ( isset( $attributes['titleBorderColor'] ) && ! empty( $attributes['titleBorderColor'] ) ) {
			$css->add_property( 'border-color', $css->render_color( $attributes['titleBorderColor'] ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . '.kb-collapsible-toc.kb-toc-toggle-hidden .kb-table-of-contents-title-wrap' );
		if ( isset( $attributes['titleCollapseBorderColor'] ) && ! empty( $attributes['titleCollapseBorderColor'] ) ) {
			$css->add_property( 'border-color', $css->render_color( $attributes['titleCollapseBorderColor'] ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title' );
		if ( isset( $attributes['titleColor'] ) && ! empty( $attributes['titleColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['titleColor'] ) );
		}
		if ( isset( $attributes['titleSize'] ) && is_array( $attributes['titleSize'] ) && isset( $attributes['titleSize'][0] ) && ! empty( $attributes['titleSize'][0] ) ) {
			$css->add_property( 'font-size', $attributes['titleSize'][0] . ( isset( $attributes['titleSizeType'] ) && ! empty( $attributes['titleSizeType'] ) ? $attributes['titleSizeType'] : 'px' ) );
		}
		if ( isset( $attributes['titleLineHeight'] ) && is_array( $attributes['titleLineHeight'] ) && isset( $attributes['titleLineHeight'][0] ) && ! empty( $attributes['titleLineHeight'][0] ) ) {
			$css->add_property( 'line-height', $attributes['titleLineHeight'][0] . ( isset( $attributes['titleLineType'] ) && ! empty( $attributes['titleLineType'] ) ? $attributes['titleLineType'] : 'px' ) );
		}
		if ( isset( $attributes['titleLetterSpacing'] ) ) {
			$css->add_property( 'letter-spacing', $css->render_number( $attributes['titleLetterSpacing'], 'px' ) );
		}
		if ( isset( $attributes['titleTypography'] ) ) {
			$google = isset( $attributes['titleGoogleFont'] ) && $attributes['titleGoogleFont'] ? true : false;
			$google = $google && ( isset( $attributes['titleLoadGoogleFont'] ) && $attributes['titleLoadGoogleFont'] || ! isset( $attributes['titleLoadGoogleFont'] ) ) ? true : false;
			$css->add_property( 'font-family', $css->render_font_family( $attributes['titleTypography'], $google, ( isset( $attributes['titleFontVariant'] ) ? $attributes['titleFontVariant'] : '' ), ( isset( $attributes['titleFontSubset'] ) ? $attributes['titleFontSubset'] : '' ) ) );
		}
		if ( isset( $attributes['titleFontWeight'] ) ) {
			$css->add_property( 'font-weight', $css->render_string( $attributes['titleFontWeight'] ) );
		}
		if ( isset( $attributes['titleFontStyle'] ) ) {
			$css->add_property( 'font-style', $css->render_string( $attributes['titleFontStyle'] ) );
		}
		if ( isset( $attributes['titleTextTransform'] ) ) {
			$css->add_property( 'text-transform', $css->render_string( $attributes['titleTextTransform'] ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list' );
		if ( isset( $attributes['contentColor'] ) && ! empty( $attributes['contentColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['contentColor'] ) );
		}
		if ( isset( $attributes['contentSize'] ) && is_array( $attributes['contentSize'] ) && isset( $attributes['contentSize'][0] ) && ! empty( $attributes['contentSize'][0] ) ) {
			$css->add_property( 'font-size', $attributes['contentSize'][0] . ( isset( $attributes['contentSizeType'] ) && ! empty( $attributes['contentSizeType'] ) ? $attributes['contentSizeType'] : 'px' ) );
		}
		if ( isset( $attributes['contentLineHeight'] ) && is_array( $attributes['contentLineHeight'] ) && isset( $attributes['contentLineHeight'][0] ) && ! empty( $attributes['contentLineHeight'][0] ) ) {
			$css->add_property( 'line-height', $attributes['contentLineHeight'][0] . ( isset( $attributes['contentLineType'] ) && ! empty( $attributes['contentLineType'] ) ? $attributes['contentLineType'] : 'px' ) );
		}
		if ( isset( $attributes['contentLetterSpacing'] ) ) {
			$css->add_property( 'letter-spacing', $css->render_number( $attributes['contentLetterSpacing'], 'px' ) );
		}
		if ( isset( $attributes['contentTypography'] ) ) {
			$google = isset( $attributes['contentGoogleFont'] ) && $attributes['contentGoogleFont'] ? true : false;
			$google = $google && ( isset( $attributes['contentLoadGoogleFont'] ) && $attributes['contentLoadGoogleFont'] || ! isset( $attributes['contentLoadGoogleFont'] ) ) ? true : false;
			$css->add_property( 'font-family', $css->render_font_family( $attributes['contentTypography'], $google, ( isset( $attributes['contentFontVariant'] ) ? $attributes['contentFontVariant'] : '' ), ( isset( $attributes['contentFontSubset'] ) ? $attributes['contentFontSubset'] : '' ) ) );
		}
		if ( isset( $attributes['contentFontWeight'] ) ) {
			$css->add_property( 'font-weight', $css->render_string( $attributes['contentFontWeight'] ) );
		}
		if ( isset( $attributes['contentFontStyle'] ) ) {
			$css->add_property( 'font-style', $css->render_string( $attributes['contentFontStyle'] ) );
		}
		if ( isset( $attributes['contentTextTransform'] ) ) {
			$css->add_property( 'text-transform', $css->render_string( $attributes['contentTextTransform'] ) );
		}
		if ( isset( $attributes['contentMargin'] ) && is_array( $attributes['contentMargin'] ) ) {
			$css->add_property( 'margin', $css->render_measure( $attributes['contentMargin'], ( isset( $attributes['contentMarginUnit'] ) && ! empty( $attributes['contentMarginUnit'] ) ? $attributes['contentMarginUnit'] : 'px' ) ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list .kb-table-of-contents__entry:hover' );
		if ( isset( $attributes['contentHoverColor'] ) && ! empty( $attributes['contentHoverColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['contentHoverColor'] ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list .active > .kb-table-of-contents__entry' );
		if ( isset( $attributes['contentActiveColor'] ) && ! empty( $attributes['contentActiveColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['contentActiveColor'] ) );
		}
		if ( isset( $attributes['listGap'] ) && is_array( $attributes['listGap'] ) && isset( $attributes['listGap'][0] ) && ! empty( $attributes['listGap'][0] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li' );
			$css->add_property( 'margin-bottom', $css->render_string( $attributes['listGap'][0], 'px' ) );
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li .kb-table-of-contents-list-sub' );
			$css->add_property( 'margin-top', $css->render_string( $attributes['listGap'][0], 'px' ) );
		}
		if ( isset( $attributes['containerBackground'] ) && ! empty( $attributes['containerBackground'] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-basiccircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-basiccircle .kb-table-of-contents-icon-trigger:before, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-arrowcircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-arrowcircle .kb-table-of-contents-icon-trigger:before, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-xclosecircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-xclosecircle .kb-table-of-contents-icon-trigger:before' );
			$css->add_property( 'background-color', $css->render_color( $attributes['containerBackground'] ) );
		}
		// Tablet.
		$css->start_media_query( $media_query['tablet'] );
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ':not(.this-class-is-for-specificity):not(.class-is-for-specificity)' );
		if ( isset( $attributes['containerTabletMargin'] ) && is_array( $attributes['containerTabletMargin'] ) ) {
			$css->add_property( 'margin', $css->render_measure( $attributes['containerTabletMargin'], 'px' ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title' );
		if ( isset( $attributes['titleSize'] ) && is_array( $attributes['titleSize'] ) && isset( $attributes['titleSize'][1] ) && ! empty( $attributes['titleSize'][1] ) ) {
			$css->add_property( 'font-size', $attributes['titleSize'][1] . ( isset( $attributes['titleSizeType'] ) && ! empty( $attributes['titleSizeType'] ) ? $attributes['titleSizeType'] : 'px' ) );
		}
		if ( isset( $attributes['titleLineHeight'] ) && is_array( $attributes['titleLineHeight'] ) && isset( $attributes['titleLineHeight'][1] ) && ! empty( $attributes['titleLineHeight'][1] ) ) {
			$css->add_property( 'line-height', $attributes['titleLineHeight'][1] . ( isset( $attributes['titleLineType'] ) && ! empty( $attributes['titleLineType'] ) ? $attributes['titleLineType'] : 'px' ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list' );
		if ( isset( $attributes['contentSize'] ) && is_array( $attributes['contentSize'] ) && isset( $attributes['contentSize'][1] ) && ! empty( $attributes['contentSize'][1] ) ) {
			$css->add_property( 'font-size', $attributes['contentSize'][1] . ( isset( $attributes['contentSizeType'] ) && ! empty( $attributes['contentSizeType'] ) ? $attributes['contentSizeType'] : 'px' ) );
		}
		if ( isset( $attributes['contentLineHeight'] ) && is_array( $attributes['contentLineHeight'] ) && isset( $attributes['contentLineHeight'][1] ) && ! empty( $attributes['contentLineHeight'][1] ) ) {
			$css->add_property( 'line-height', $attributes['contentLineHeight'][1] . ( isset( $attributes['contentLineType'] ) && ! empty( $attributes['contentLineType'] ) ? $attributes['contentLineType'] : 'px' ) );
		}
		if ( isset( $attributes['listGap'] ) && is_array( $attributes['listGap'] ) && isset( $attributes['listGap'][1] ) && ! empty( $attributes['listGap'][1] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li' );
			$css->add_property( 'margin-bottom', $css->render_string( $attributes['listGap'][1], 'px' ) );
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li .kb-table-of-contents-list-sub' );
			$css->add_property( 'margin-top', $css->render_string( $attributes['listGap'][1], 'px' ) );
		}
		$css->stop_media_query();
		// Mobile.
		$css->start_media_query( $media_query['mobile'] );
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ':not(.this-class-is-for-specificity):not(.class-is-for-specificity)' );
		if ( isset( $attributes['containerMobileMargin'] ) && is_array( $attributes['containerMobileMargin'] ) ) {
			$css->add_property( 'margin', $css->render_measure( $attributes['containerMobileMargin'], 'px' ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title' );
		if ( isset( $attributes['titleSize'] ) && is_array( $attributes['titleSize'] ) && isset( $attributes['titleSize'][2] ) && ! empty( $attributes['titleSize'][2] ) ) {
			$css->add_property( 'font-size', $attributes['titleSize'][2] . ( isset( $attributes['titleSizeType'] ) && ! empty( $attributes['titleSizeType'] ) ? $attributes['titleSizeType'] : 'px' ) );
		}
		if ( isset( $attributes['titleLineHeight'] ) && is_array( $attributes['titleLineHeight'] ) && isset( $attributes['titleLineHeight'][2] ) && ! empty( $attributes['titleLineHeight'][2] ) ) {
			$css->add_property( 'line-height', $attributes['titleLineHeight'][2] . ( isset( $attributes['titleLineType'] ) && ! empty( $attributes['titleLineType'] ) ? $attributes['titleLineType'] : 'px' ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list' );
		if ( isset( $attributes['contentSize'] ) && is_array( $attributes['contentSize'] ) && isset( $attributes['contentSize'][2] ) && ! empty( $attributes['contentSize'][2] ) ) {
			$css->add_property( 'font-size', $attributes['contentSize'][2] . ( isset( $attributes['contentSizeType'] ) && ! empty( $attributes['contentSizeType'] ) ? $attributes['contentSizeType'] : 'px' ) );
		}
		if ( isset( $attributes['contentLineHeight'] ) && is_array( $attributes['contentLineHeight'] ) && isset( $attributes['contentLineHeight'][2] ) && ! empty( $attributes['contentLineHeight'][2] ) ) {
			$css->add_property( 'line-height', $attributes['contentLineHeight'][2] . ( isset( $attributes['contentLineType'] ) && ! empty( $attributes['contentLineType'] ) ? $attributes['contentLineType'] : 'px' ) );
		}
		if ( isset( $attributes['listGap'] ) && is_array( $attributes['listGap'] ) && isset( $attributes['listGap'][2] ) && ! empty( $attributes['listGap'][2] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li' );
			$css->add_property( 'margin-bottom', $css->render_string( $attributes['listGap'][2], 'px' ) );
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li .kb-table-of-contents-list-sub' );
			$css->add_property( 'margin-top', $css->render_string( $attributes['listGap'][2], 'px' ) );
		}
		$css->stop_media_query();
		self::$gfonts = $css->fonts_output();
		return $css->css_output();
	}
}
Kadence_Blocks_Table_Of_Contents::get_instance();
