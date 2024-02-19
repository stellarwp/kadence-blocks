<?php
/**
 * Class to Build the Navigation Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Navigation Block.
 *
 * @category class
 */
class Kadence_Blocks_Navigation_Block extends Kadence_Blocks_Abstract_Block {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'navigation';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	protected $has_style = false;

	/**
	 * Used to determine whether or not a navigation has submenus.
	 */
	private static $has_submenus = false;

	/**
	 * Used to determine which blocks need an <li> wrapper.
	 *
	 * @var array
	 */
	private static $needs_list_item_wrapper = array(
		'core/site-title',
		'core/site-logo',
	);

	/**
	 * Keeps track of all the navigation names that have been seen.
	 *
	 * @var array
	 */
	private static $seen_menu_names = array();

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
	 * Builds CSS for block.
	 *
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		return $css->css_output();
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param          $attributes
	 * @param          $unique_id
	 * @param          $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		$nav_block = get_post( $attributes['ref'] );

		$inner_blocks = static::get_inner_blocks( $attributes, $block_instance );
		// Prevent navigation blocks referencing themselves from rendering.
		if ( block_core_navigation_block_contains_core_navigation( $inner_blocks ) ) {
			return '-- Failed here --';
		}

		$name = ! empty( $attributes['name'] ) ? $attributes['name'] : '';
		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'      => 'kb-block-navigation',
				'aria-label' => $name,
			)
		);

		$content = do_blocks( $nav_block->post_content );

		return sprintf(
			'<nav %1$s>%2$s</nav>',
			$wrapper_attributes,
			$content
		);
	}

	/**
	 * Gets the inner blocks for the navigation block from the navigation post.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return WP_Block_List Returns the inner blocks for the navigation block.
	 */
	private static function get_inner_blocks_from_navigation_post( $attributes ) {
		$navigation_post = get_post( $attributes['ref'] );
		if ( ! isset( $navigation_post ) ) {
			return new WP_Block_List( array(), $attributes );
		}

		// Only published posts are valid. If this is changed then a corresponding change
		// must also be implemented in `use-navigation-menu.js`.
		if ( 'publish' === $navigation_post->post_status ) {
			$parsed_blocks = parse_blocks( $navigation_post->post_content );

			// 'parse_blocks' includes a null block with '\n\n' as the content when
			// it encounters whitespace. This code strips it.
			$blocks = block_core_navigation_filter_out_empty_blocks( $parsed_blocks );

			if ( function_exists( 'get_hooked_block_markup' ) ) {
				// Run Block Hooks algorithm to inject hooked blocks.
				$markup         = block_core_navigation_insert_hooked_blocks( $blocks, $navigation_post );
				$root_nav_block = parse_blocks( $markup )[0];

				$blocks = isset( $root_nav_block['innerBlocks'] ) ? $root_nav_block['innerBlocks'] : $blocks;
			}

			// TODO - this uses the full navigation block attributes for the
			// context which could be refined.
			return new WP_Block_List( $blocks, $attributes );
		}
	}

	/**
	 * Gets the inner blocks for the navigation block from the fallback.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return WP_Block_List Returns the inner blocks for the navigation block.
	 */
	private static function get_inner_blocks_from_fallback( $attributes ) {
		$fallback_blocks = block_core_navigation_get_fallback_blocks();

		// Fallback my have been filtered so do basic test for validity.
		if ( empty( $fallback_blocks ) || ! is_array( $fallback_blocks ) ) {
			return new WP_Block_List( array(), $attributes );
		}

		return new WP_Block_List( $fallback_blocks, $attributes );
	}

	/**
	 * Gets the inner blocks for the navigation block.
	 *
	 * @param array    $attributes The block attributes.
	 * @param WP_Block $block      The parsed block.
	 *
	 * @return WP_Block_List Returns the inner blocks for the navigation block.
	 */
	private static function get_inner_blocks( $attributes, $block ) {
		$inner_blocks = $block->inner_blocks;

		// Load inner blocks from the navigation post.
		if ( array_key_exists( 'ref', $attributes ) ) {
			$inner_blocks = static::get_inner_blocks_from_navigation_post( $attributes );
		}

		// If there are no inner blocks then fallback to rendering an appropriate fallback.
		if ( empty( $inner_blocks ) ) {
			$inner_blocks = static::get_inner_blocks_from_fallback( $attributes );
		}

		$post_ids = block_core_navigation_get_post_ids( $inner_blocks );
		if ( $post_ids ) {
			_prime_post_caches( $post_ids, false, false );
		}

		return $inner_blocks;
	}


	/**
	 * Returns the markup for the navigation block.
	 *
	 * @param array         $attributes   The block attributes.
	 * @param WP_Block_List $inner_blocks The list of inner blocks.
	 *
	 * @return string Returns the navigation wrapper markup.
	 */
	private static function get_wrapper_markup( $attributes, $inner_blocks ) {
		$inner_blocks_html = static::get_inner_blocks_html( $attributes, $inner_blocks );

		return $inner_blocks_html;
	}

}

Kadence_Blocks_Navigation_Block::get_instance();
