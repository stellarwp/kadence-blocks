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
	 * The block names to ignore.
	 *
	 * @var null
	 */
	public static $ignore_list = null;

	/**
	 * The block names to ignore.
	 *
	 * @var null
	 */
	public static $inner_ignore_list = null;

	/**
	 * The heading classes to ignore.
	 *
	 * @var null
	 */
	public static $ignore_classes = null;


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
	 * Constructor
	 */
	public function __construct() {
		add_action( 'wp_footer', array( $this, 'headings_enqueue' ), 1 );
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
					if ( isset( $attributes['enableTemplateSearch'] ) && $attributes['enableTemplateSearch'] && class_exists( 'Kadence_Woo_Block_Editor_Templates' ) && is_singular( 'product' ) ) {
						$kadence_woo_pro = Kadence_Woo_Block_Editor_Templates::get_instance();
						$page_content = '';
						if ( ! empty( $kadence_woo_pro::$single_override ) ) {
							$template_post = get_post( $kadence_woo_pro::$single_override );
							$blocks = parse_blocks( $template_post->post_content );
							self::$output_content = '';
							foreach ( $blocks as $block ) {
								$this->recursively_parse_blocks( $block );
							}
							if ( self::$output_content ) {
								$page_content .= do_shortcode( self::$output_content );
							}
						} else {
							$blocks = parse_blocks( $post->post_content );
							self::$output_content = '';
							foreach ( $blocks as $block ) {
								$this->recursively_parse_blocks( $block );
							}
							if ( self::$output_content ) {
								$page_content .= do_shortcode( self::$output_content );
							} else {
								$page_content .= do_shortcode( $post->post_content );
							}
						}
					} else if ( isset( $attributes['enableTemplateSearch'] ) && $attributes['enableTemplateSearch'] && class_exists( 'Kadence_Pro\Elements_Controller' ) && is_singular() ) {
						$kadence_pro = Kadence_Pro\Elements_Controller::get_instance();
						$page_content = '';
						if ( ! empty( $kadence_pro::$single_template ) ) {
							$blocks = parse_blocks( $post->post_content );
							self::$output_content = '';
							$the_post_content = '';
							foreach ( $blocks as $block ) {
								$this->recursively_parse_blocks( $block );
							}
							if ( self::$output_content ) {
								$the_post_content .= do_shortcode( self::$output_content );
							} else {
								$the_post_content .= do_shortcode( $post->post_content );
							}
							$template_post = get_post( $kadence_pro::$single_template );
							$blocks = parse_blocks( $template_post->post_content );
							self::$output_content = '';
							foreach ( $blocks as $block ) {
								$this->recursively_parse_blocks( $block, $the_post_content );
							}
							if ( self::$output_content ) {
								$page_content .= do_shortcode( self::$output_content );
							}
						} else {
							$blocks = parse_blocks( $post->post_content );
							self::$output_content = '';
							foreach ( $blocks as $block ) {
								$this->recursively_parse_blocks( $block );
							}
							if ( self::$output_content ) {
								$page_content .= do_shortcode( self::$output_content );
							} else {
								$page_content .= do_shortcode( $post->post_content );
							}
						}
					} else {
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
					}
				} else {
					$page_content = $post->post_content;
				}
				self::$the_headings = $this->table_of_contents_get_headings_from_content( $page_content, 1, 1, $attributes );
			}
			$headings = self::$the_headings;
			if ( $attributes && isset( $attributes['allowedHeaders'] ) && isset( $attributes['allowedHeaders'][0] ) && is_array( $attributes['allowedHeaders'][0] ) ) {
				foreach ( array( 'h1' => 1, 'h2' => 2, 'h3' => 3, 'h4' => 4, 'h5' => 5, 'h6' => 6 ) as $tag => $level ) {

					foreach ( $headings as $headkey => $headvalue ) {
						// User is specifically excluding this heading.
						if( false === $headvalue['include'] ) {

							unset( $headings[$headkey] );
						}

						// User is specifically including this heading, or, it's in the allowed headers list.
						if ( true === $headvalue['include'] || ( !isset( $attributes['allowedHeaders'][0][$tag] ) || $attributes['allowedHeaders'][0][$tag] ) ) {
							continue;
						}

						// Heading is at an unwanted level.
						if ( $headvalue['level'] === $level ) {
							unset( $headings[$headkey] );
						}
					}
				}
			}
			return array_values( $headings );
		}
	}
	/**
	 * Get the ignore list of blocks.
	 *
	 * @access private
	 */
	private function get_ignore_list() {
		if ( is_null( self::$ignore_list ) ) {
			self::$ignore_list = apply_filters( 'kadence_toc_block_ignore_array', array( 'kadence/tableofcontents', 'kadence/tabs', 'kadence/modal', 'kadence/repeater', 'core/post-content' ) );
		}
		return self::$ignore_list;
	}

	/**
	 * Get the ignore list of blocks.
	 *
	 * @access private
	 */
	private function get_inner_block_ignore_list() {
		if ( is_null( self::$inner_ignore_list ) ) {
			self::$inner_ignore_list = apply_filters( 'kadence_toc_inner_block_ignore_array', array( 'kadence/pane' ) );
		}
		return self::$inner_ignore_list;
	}

	/**
	 * Get the ignore list of classes.
	 *
	 * @access private
	 */
	private function get_ignore_classes() {
		if ( is_null( self::$ignore_classes ) ) {
			self::$ignore_classes = apply_filters( 'kadence_toc_exclude_classes_array', array( 'kt-testimonial-title', 'image-overlay-title', 'image-overlay-subtitle', 'toc-ignore' ) );
		}
		return self::$ignore_classes;
	}
	/**
	 * Renders blocks to allow dynamic blocks that bring in headings to be accounted for.
	 *
	 * @access private
	 *
	 * @param string $block The page content content.
	 */
	private function recursively_parse_blocks( $block, $the_post_content = '' ) {
		if ( ! in_array( $block['blockName'], $this->get_ignore_list() ) ) {
			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				// Can't link to inner blocks so ignore everything past.
				if ( in_array( $block['blockName'], $this->get_inner_block_ignore_list() ) ) {
					self::$output_content .= $block['innerHTML'];
				} else {
					foreach( $block['innerBlocks'] as $inner_block ) {
						$this->recursively_parse_blocks( $inner_block );
					}
				}
			} else {
				self::$output_content .= render_block( $block );
			}
		} else if ( $block['blockName'] === 'core/post-content' ) {
			self::$output_content .= $the_post_content;
		} else if ( $block['blockName'] === 'kadence/repeater' ) {
			//repeater needs to render all together to properly render dynamic data with context.
			self::$output_content .= render_block( $block );
		}
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
			'kadence-blocks-tableofcontents',
			'kadence_blocks_toc',
			array(
				'headings'      => wp_json_encode( self::$headings ),
				'expandText'    => esc_attr__( 'Expand Table of Contents', 'kadence-blocks' ),
				'collapseText'  => esc_attr__( 'Collapse Table of Contents', 'kadence-blocks' ),
			)
		);
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
		$content = remove_accents( $content );
		$content = strtolower( $content );
		$content = preg_replace( "/[^A-Za-z0-9 ]/", '', $content );
		$content = str_replace( ' ', '-', $content );
		return $content;
	}
	
	/**
	 * Process content through Kadence Blocks conditional logic (logged in/out, RCP membership, etc.).
	 *
	 * @access private
	 *
	 * @param string $content The post content to process.
	 *
	 * @return string The processed content with conditionally hidden blocks removed.
	 */
	private function process_content_through_kadence_conditional_logic( $content ) {
		$blocks = parse_blocks( $content );
		
		if ( empty( $blocks ) ) {
			return $content;
		}
		
		// Get the Kadence Blocks Frontend instance to access conditionally_render_block
		$frontend_instance = Kadence_Blocks_Frontend::get_instance();
		
		if ( ! $frontend_instance ) {
			return $content;
		}
		
		// Process each block through conditional logic
		$processed_blocks = array();
		foreach ( $blocks as $block ) {
			if ( empty( $block['blockName'] ) ) {
				$processed_blocks[] = $block;
				continue;
			}
			
			$wp_block = new stdClass();
			$wp_block->context = array();
			
			// Check if this block should be conditionally hidden using Kadence Blocks logic
			// We pass a placeholder content to test if the block would be hidden
			$block_content = $frontend_instance->conditionally_render_block( 'PLACEHOLDER_CONTENT', $block, $wp_block );
			
			
			if ( $block_content !== '' ) {
				$processed_blocks[] = $block;
			}
		}
		
		// Re-render the content from the processed blocks
		$processed_content = '';
		foreach ( $processed_blocks as $block ) {
			$processed_content .= serialize_block( $block );
		}
		
		return $processed_content;
	}
	
	/**
	 * Process content through Kadence Blocks Pro conditional hiding logic.
	 *
	 * @access private
	 *
	 * @param string $content The post content to process.
	 *
	 * @return string The processed content with conditionally hidden blocks removed.
	 */
	private function process_content_through_conditional_hiding( $content ) {
		// Check if Kadence Blocks Pro is available
		if ( ! class_exists( 'Kadence_Blocks_Pro_Dynamic_Content' ) ) {
			return $content;
		}
	
		$dynamic_content = Kadence_Blocks_Pro_Dynamic_Content::get_instance();
		
		if ( ! $dynamic_content ) {
			return $content;
		}
		
		// Parse the content into blocks and process each block through conditional display logic
		$blocks = $dynamic_content->kadence_parse_blocks( $content );
		
		if ( empty( $blocks ) ) {
			return $content;
		}
		
		$processed_blocks = array();
		foreach ( $blocks as $block ) {
			$wp_block = new stdClass();
			$wp_block->context = array();
			
			$should_hide = $dynamic_content->should_conditionally_hide_block( '', $block, $wp_block, null, null );
			
			if ( ! $should_hide ) {
				$processed_blocks[] = $block;
			}
		}
		
		// Convert the filtered block array back to serialized content format
		$processed_content = '';
		foreach ( $processed_blocks as $block ) {
			$processed_content .= serialize_block( $block );
		}
		
		return $processed_content;
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
		// Process content through Kadence Blocks conditional logic first
		$content = $this->process_content_through_kadence_conditional_logic( $content );
		
		// Then process content through Kadence Blocks Pro conditional hiding before parsing HTML
		$content = $this->process_content_through_conditional_hiding( $content );
		
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
		$content = mb_encode_numericentity( $content, [0x80, 0x10FFFF, 0, ~0], 'UTF-8' );
		// loadHTML expects ISO-8859-1, so we need to convert the post content to
		// that format. We use htmlentities to encode Unicode characters not
		// supported by ISO-8859-1 as HTML entities. However, this function also
		// converts all special characters like < or > to HTML entities, so we use
		// htmlspecialchars_decode to decode them.
		$doc->loadHTML(
			htmlspecialchars_decode(
				mb_convert_encoding(
					htmlentities(
						'<!DOCTYPE html><html><head><title>:D</title><body>' .
						htmlentities( $content ) .
						'</body></html>',
						ENT_COMPAT,
						'UTF-8',
						false
					), 'ISO-8859-1', 'UTF-8'
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
					$exclude_classes = $this->get_ignore_classes();
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
				if ( $heading->getAttribute( 'data-alt-title' ) ) {
					$heading->textContent = $heading->getAttribute( 'data-alt-title' );
				}

				$headingWrapper = [
					'element' => $heading,
					'include' => ''
				];
				if( $heading->getAttribute( 'data-toc-include' ) === 'true' ){
					$headingWrapper['include'] = true;
				} else if ( $heading->getAttribute( 'data-toc-include' ) === 'false' ) {
					$headingWrapper['include'] = false;
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
							'include'   => $headingWrapper['include'],
							'page'    => $headings_page,
						);
					}
				}
				return array(
					'anchor'  => $anchor,
					'content' => $this->convert_smart_quotes( $heading->textContent ),
					'level'   => $level,
					'include'   => $headingWrapper['include'],
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
		$search = array("×",
						"’",
						"‘",
						"”",
						"“",
						"–",
						"—",
						"…");
		$replace = array("x",
						"'",
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
	 * Render Table of Contents Block
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
		$attributes = apply_filters( 'kadence_blocks_toc_block_build_only_attributes', $attributes );
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
		$output = '<nav class="' . esc_attr( $class ) . ( $enable_toggle ? ' kb-collapsible-toc kb-toc-toggle-' . ( $start_closed ? 'hidden' : 'active' ) : '' ) . '" role="navigation" aria-label="' . esc_attr__( 'Table of Contents', 'kadence-blocks' ) . '"' . ( $enable_scroll ? ' data-scroll-offset="' . esc_attr( $scroll_offset ) . '"' : '' ) . ( isset( $attributes['enableScrollSpy'] ) && true === $attributes['enableScrollSpy'] ? ' data-scroll-spy="true"' : '' ) . '>';
		$output .= '<div class="kb-table-of-content-wrap">';
		if ( ! isset( $attributes['enableTitle'] ) || isset( $attributes['enableTitle'] ) && $attributes['enableTitle'] ) {
			$output .= '<div class="kb-table-of-contents-title-wrap kb-toggle-icon-style-' . ( $enable_toggle && isset( $attributes['toggleIcon'] ) && $attributes['toggleIcon'] ? $attributes['toggleIcon'] : 'arrow' ) . '">';
			if ( $title_toggle ) {
				$output .= '<button class="kb-table-of-contents-title-btn kb-table-of-contents-toggle" aria-expanded="' . esc_attr( $start_closed ? 'false' : 'true' ) . '" aria-label="' . ( $start_closed ? esc_attr__( 'Expand Table of Contents', 'kadence-blocks' ) : esc_attr__( 'Collapse Table of Contents', 'kadence-blocks' ) ) . '">';
			}
			$output .= '<span class="kb-table-of-contents-title">';
			$output .= ( isset( $attributes['title'] ) && $attributes['title'] !== 'Table of Contents' ? $attributes['title'] : __( 'Table of Contents', 'kadence-blocks' ) );
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
						//need to laod this script with the gumshoe dependency if scrollspy is enabled
						wp_enqueue_script( 'kadence-blocks-table-of-contents', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-table-of-contents.min.js', array('kadence-blocks-gumshoe') , KADENCE_BLOCKS_VERSION, true );
					} else {
						wp_enqueue_script( 'kadence-blocks-table-of-contents' );
					}
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
			}
		}
		return $content;
	}

	/*
	 * Reset the instance properties for unit tests
	 */
	private static function reset_instance() {
		self::$headings = array();
		self::$anchors = array();
		self::$the_headings = null;
		self::$output_content = '';
	}

}

Kadence_Blocks_Table_Of_Contents::get_instance();
