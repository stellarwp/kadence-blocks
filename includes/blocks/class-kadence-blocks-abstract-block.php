<?php
/**
 * Class to Build the Icon Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Icon Block.
 *
 * @category class
 */
class Kadence_Blocks_Abstract_Block {

	/**
	 * Block namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'kadence';

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = '';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;
	/**
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'on_init' ), 20 );
		add_filter( 'kadence_blocks_blocks_to_generate_post_css', array( $this, 'add_block_to_post_generate_css' ) );
	}
	/**
	 * On init startup register the block.
	 */
	public function on_init() {
		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/' . $this->block_name . '/block.json',
			array(
				'render_callback' => array( $this, 'render_css' ),
				'editor_script'   => 'kadence-blocks-' . $this->block_name,
				'editor_style'    => 'kadence-blocks-' . $this->block_name,
			)
		);
	}
	/**
	 * Add Class name to list of blocks to render in header.
	 *
	 * @param array $block_class_array the blocks that are registered to be rendered.
	 */
	public function add_block_to_post_generate_css( $block_class_array ) {
		if ( ! isset( $block_class_array[ $this->namespace . '/' . $this->block_name ] ) ) {
			$block_class_array[ $this->namespace . '/' . $this->block_name ] = 'Kadence_Blocks_' .  str_replace( ' ', '_', ucwords( str_replace( '-', ' ', $this->block_name ) ) ) . '_Block';
		}
		return $block_class_array;
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
	 * Render Block CSS in Page Head.
	 *
	 * @param array $block the block data.
	 */
	public function output_head_data( $block ) {
		// Check and enqueue styles if needed.
		if ( ! wp_style_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-' . $this->block_name );
		}
		if ( $this->has_script ) {
			if ( ! wp_script_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_script( 'kadence-blocks-' . $this->block_name );
			}
		}
		if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
			$attributes = $block['attrs'];
			if ( isset( $attributes['uniqueID'] ) ) {
				$unique_id = $attributes['uniqueID'];
				$css_class = Kadence_Blocks_CSS::get_instance();
				if ( ! $css_class->has_styles( 'kb-' . $this->block_name . $unique_id ) && apply_filters( 'kadence_blocks_render_head_css', true, $this->block_name, $attributes ) ) {
					// Filter attributes for easier dynamic css.
					$attributes = apply_filters( 'kadence_blocks_' . $this->block_name . '_render_block_attributes', $attributes );
					$this->build_css( $attributes, $css_class, $unique_id );
				}
			}
		}
	}
	/**
	 * Render Block CSS
	 *
	 * @param array  $attributes the blocks attribtues.
	 * @param string $content the blocks content.
	 */
	public function render_css( $attributes, $content ) {
		if ( ! wp_style_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
			$this->enqueue_style( 'kadence-blocks-' . $this->block_name );
		}
		if ( $this->has_script ) {
			if ( ! wp_script_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_script( 'kadence-blocks-' . $this->block_name );
			}
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$css_class = Kadence_Blocks_CSS::get_instance();
			if ( ! $css_class->has_styles( 'kb-' . $this->block_name . $unique_id ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'icon', $unique_id ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_icon_render_block_attributes', $attributes );
				$css        = $this->build_css( $attributes, $css_class, $unique_id );
				if ( ! empty( $css ) ) {
					$content = '<style>' . $css . '</style>' . $content;
				}
			}
		}
		return $content;
	}
	/**
	 * Builds CSS for block.
	 *
	 * @param array  $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function build_css( $attributes, $css, $unique_id ) {
		return '';
	}
	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_style( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'dist/style-blocks-' . $this->block_name . '.css', array(), KADENCE_BLOCKS_VERSION );
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
}
