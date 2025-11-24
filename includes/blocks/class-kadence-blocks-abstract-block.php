<?php
/**
 * Abstract Class to Build Blocks.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Abstract class to register blocks, build CSS, and enqueue scripts.
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
	 * Block determines if style needs to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = true;

	/**
	 * Block determines if scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Cache for a blocks attributes with defaults based on uniqueId
	 * Stored as: uniqueId => attributes
	 *
	 * @var array
	 */
	protected $attributes_with_defaults = [];

	/**
	 * Cache for default attributes by block name.
	 * Stored as: blockName => attributes
	 *
	 * @var array
	 */
	protected $default_attributes_cache = [];

	/**
	 * Allow us to enable merged defaults on blocks individually.
	 * Considered setting this as a property within each block, but it's easier to see an exhaustive list here.
	 * Eventually all blocks will be supported.
	 *
	 * @var array
	 */
	protected $supports_merged_defaults = [
		'navigation',
		'navigation-link',
		'header',
		'navigation-list',
		'singlebtn',
		'header-row',
		'off-canvas-trigger',
		'off-canvas',
		'header-column',
		'search',
		'identity',
		'table',
		'vector',
		'select',
		'email',
		'text',
		'textarea',
		'number',
		'date',
		'time',
		'radio',
		'checkbox',
		'file',
		'telephone',
		'accept',
		'captcha',
		'submit',
	];

	/**
	 * Allow us to enable merged defaults on blocks individually.
	 * Considered setting this as a property within each block, but it's easier to see an exhaustive list here.
	 * Eventually all blocks will be supported.
	 *
	 * @var array
	 */
	protected $is_cpt_block = [
		'navigation',
		'header',
		'advanced-form',
	];

	/**
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'on_init' ], 20 );
		add_filter( 'kadence_blocks_blocks_to_generate_post_css', [ $this, 'add_block_to_post_generate_css' ] );
	}

	/**
	 * On init startup register the block.
	 */
	public function on_init() {
		if ( $this->should_register() ) {
			register_block_type(
				KADENCE_BLOCKS_PATH . 'dist/blocks/' . $this->block_name . '/block.json',
				[
					'render_callback' => [ $this, 'render_css' ],
					'editor_script'   => 'kadence-blocks-' . $this->block_name,
					'editor_style'    => 'kadence-blocks-' . $this->block_name,
				]
			);
		}
	}

	/**
	 * Add Class name to list of blocks to render in header.
	 *
	 * @param array $block_class_array the blocks that are registered to be rendered.
	 */
	public function add_block_to_post_generate_css( $block_class_array ) {
		if ( $this->should_register() ) {
			if ( ! isset( $block_class_array[ $this->namespace . '/' . $this->block_name ] ) ) {
				$block_class_array[ $this->namespace . '/' . $this->block_name ] = 'Kadence_Blocks_' . str_replace( ' ', '_', ucwords( str_replace( '-', ' ', $this->block_name ) ) ) . '_Block';
			}
		}

		return $block_class_array;
	}

	/**
	 * Check if block stylesheet should render inline.
	 *
	 * @param string $name the stylesheet name.
	 */
	public function should_render_inline_stylesheet( $name ) {
		if ( apply_filters( 'kadence_blocks_force_render_inline_stylesheet', false, $name ) || ( ! is_admin() && ! wp_style_is( $name, 'done' ) && ! is_feed() ) ) {
			if ( function_exists( 'wp_is_block_theme' ) ) {
				if ( ! doing_filter( 'the_content' ) && ! wp_is_block_theme() && 1 === did_action( 'wp_head' ) ) {
					wp_print_styles( $name );
				}
			} elseif ( ! doing_filter( 'the_content' ) && 1 === did_action( 'wp_head' ) ) {
				wp_print_styles( $name );
			}
		}
	}

	/**
	 * Render styles in the footer.
	 *
	 * @param string $name the stylesheet name.
	 */
	public function render_styles_footer( $name, $css ) {
		if ( ! is_admin() && ! wp_style_is( $name, 'done' ) && ! is_feed() ) {
			wp_register_style( $name, false, [], false );
			wp_add_inline_style( $name, $css );
			wp_enqueue_style( $name );
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
		if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
			$attributes = $block['attrs'];
			if ( in_array( $this->block_name, $this->is_cpt_block ) ) {
				$unique_id = ! empty( $attributes['id'] ) ? strval( $attributes['id'] ) . '-cpt-id' : '';
				if ( empty( $unique_id ) ) {
					$unique_id = ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '';
				}
			} else {
				$unique_id = ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '';
			}
			if ( ! empty( $unique_id ) ) {
				$unique_id = str_replace( '/', '-', $unique_id );
				if ( in_array( $this->block_name, $this->supports_merged_defaults ) ) {
					$attributes = $this->get_attributes_with_defaults( $unique_id, $attributes );
				}
				// Check and enqueue stylesheets and scripts if needed.
				$this->render_scripts( $attributes, false );

				$css_class = Kadence_Blocks_CSS::get_instance();
				if ( ! $css_class->has_styles( 'kb-' . $this->block_name . $unique_id ) && apply_filters( 'kadence_blocks_render_head_css', true, $this->block_name, $attributes ) ) {
					// Filter attributes for easier dynamic css.
					$attributes = apply_filters( 'kadence_blocks_' . $this->block_name . '_render_block_attributes', $attributes );
					$this->build_css( $attributes, $css_class, $unique_id, $unique_id );
				}
			}
		}
	}
	/**
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		if ( $this->has_style ) {
			if ( ! wp_style_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_style( 'kadence-blocks-' . $this->block_name );
				if ( $inline ) {
					$this->should_render_inline_stylesheet( 'kadence-blocks-' . $this->block_name );
				}
			}
		}
		if ( $this->has_script ) {
			if ( ! wp_script_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_script( 'kadence-blocks-' . $this->block_name );
			}
		}
	}
	/**
	 * Render Block CSS
	 *
	 * @param array    $attributes the blocks attribtues.
	 * @param string   $content the blocks content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 */
	public function render_css( $attributes, $content, $block_instance ) {
		$this->render_scripts( $attributes, true );
		if ( in_array( $this->block_name, $this->is_cpt_block ) ) {
			$unique_id = ! empty( $attributes['id'] ) ? strval( $attributes['id'] ) . '-cpt-id' : '';
			if ( empty( $unique_id ) ) {
				$unique_id = ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '';
			}
		} else {
			$unique_id = ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '';
		}
		if ( ! empty( $unique_id ) ) {
			$unique_id       = str_replace( '/', '-', $unique_id );
			$unique_style_id = apply_filters( 'kadence_blocks_build_render_unique_id', $unique_id, $this->block_name, $attributes );
			$css_class       = Kadence_Blocks_CSS::get_instance();

			if ( in_array( $this->block_name, $this->supports_merged_defaults ) ) {
				$attributes = $this->get_attributes_with_defaults( $unique_id . get_locale(), $attributes, false );
			}

			// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
			$attributes = apply_filters( 'kadence_blocks_' . str_replace( '-', '_', $this->block_name ) . '_render_block_attributes', $attributes, $block_instance );

			$content = $this->build_html( $attributes, $unique_id, $content, $block_instance );
			if ( ! $css_class->has_styles( 'kb-' . $this->block_name . $unique_style_id ) && ! is_feed() && apply_filters( 'kadence_blocks_render_inline_css', true, $this->block_name, $unique_id ) ) {
				$css = $this->build_css( $attributes, $css_class, $unique_id, $unique_style_id );
				if ( ! empty( $css ) && ! wp_is_block_theme() ) {
					$this->do_inline_styles( $content, $unique_style_id, $css );
				}
			} elseif ( ! wp_is_block_theme() && ! $css_class->has_header_styles( 'kb-' . $this->block_name . $unique_style_id ) && ! is_feed() && apply_filters( 'kadence_blocks_render_inline_css', true, $this->block_name, $unique_id ) ) {
				// Some plugins run render block without outputing the content, this makes it so css can be rebuilt.
				$css = $this->build_css( $attributes, $css_class, $unique_id, $unique_style_id );
				if ( ! empty( $css ) ) {
					$this->do_inline_styles( $content, $unique_style_id, $css );
				}
			}
		}

		return $content;
	}

	/**
	 * Potentially prepend inline style to the content, unless it needs to get moved off to the footer.
	 */
	public function do_inline_styles( &$content, $unique_style_id, $css ) {
		if ( apply_filters( 'kadence_blocks_render_styles_footer', $this->block_name == 'data' || $this->block_name == 'slide' ) ) {
			$this->render_styles_footer( 'kb-' . $this->block_name . $unique_style_id, $css );
		} else {
			$content = '<style>' . $css . '</style>' . $content;
		}
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array  $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return '';
	}

	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		return $content;
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
		wp_register_style( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'dist/style-blocks-' . $this->block_name . '.css', [], KADENCE_BLOCKS_VERSION );
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
	}


	/**
	 * Gets the HTML tag from the attributes.
	 * If the tag provided isn't allowed, return the default value.
	 *
	 * @param array  $attributes Array of the blocks attributes.
	 * @param string $tag_key Offest on $attributes where the tag is set.
	 * @param string $default Default tag to use if $tag_key attribue is undefined or invalid.
	 * @param array  $allowed_tags Array of allowed tags.
	 * @param string $level_key If defined, we'll assume heading tags are allowed.
	 *
	 * @return string
	 */
	public function get_html_tag( $attributes, $tag_key, $default, $allowed_tags = [], $level_key = '' ) {

		if ( ! empty( $attributes[ $tag_key ] ) && in_array( $attributes[ $tag_key ], $allowed_tags ) ) {

			if ( $attributes[ $tag_key ] === 'heading' ) {
				$level = ! empty( $attributes[ $level_key ] ) ? $attributes[ $level_key ] : 2;
				return 'h' . $level;
			}

			return $attributes[ $tag_key ];
		}

		return $default;
	}



	/**
	 * Get this blocks attributes merged with defaults from the registration.
	 *
	 * @param string $cache_key The cache key (usually unique id).
	 * @param array  $attributes The block's attributes.
	 * @param string $block_name The name of the block.
	 * @return array
	 */
	public function get_attributes_with_defaults( $cache_key, $attributes, $cache = true ) {
		if ( ! empty( $this->attributes_with_defaults[ $cache_key ] ) ) {
			return $this->attributes_with_defaults[ $cache_key ];
		}

		$default_attributes = $this->get_block_default_attributes();
		$merged_attributes  = $this->merge_attributes_with_defaults( $attributes, $default_attributes );

		if ( $cache ) {
			$this->attributes_with_defaults[ $cache_key ] = $merged_attributes;
		}
		return $merged_attributes;
	}

	/**
	 * Get default attributes for a block.
	 *
	 * @return array
	 */
	protected function get_block_default_attributes() {
		$block_name = 'kadence/' . $this->block_name;
		if ( ! isset( $this->default_attributes_cache[ $block_name ] ) ) {
			$registry           = WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
			$default_attributes = [];

			if ( $registry && property_exists( $registry, 'attributes' ) && ! empty( $registry->attributes ) ) {
				foreach ( $registry->attributes as $key => $value ) {
					if ( isset( $value['default'] ) ) {
						$default_attributes[ $key ] = $value['default'];
					}
				}
			}

			$this->default_attributes_cache[ $block_name ] = $default_attributes;
		}

		return $this->default_attributes_cache[ $block_name ];
	}

	/**
	 * Merge attributes with defaults.
	 *
	 * @param array $attributes The block's attributes.
	 * @param array $default_attributes The default attributes.
	 * @return array
	 */
	protected function merge_attributes_with_defaults( $attributes, $default_attributes ) {
		$merged_attributes = $default_attributes;

		foreach ( $attributes as $key => $value ) {
			if ( isset( $merged_attributes[ $key ] ) && is_array( $merged_attributes[ $key ] ) &&
				count( $merged_attributes[ $key ] ) == 1 && isset( $merged_attributes[ $key ][0] ) &&
				is_array( $merged_attributes[ $key ][0] ) &&
				is_array( $value ) && count( $value ) == 1 && isset( $value[0] ) ) {
				// Handle attributes that are an array with a single object
				$merged_attributes[ $key ][0] = array_merge( $merged_attributes[ $key ][0], $value[0] );
			} else {
				$merged_attributes[ $key ] = $value;
			}
		}

		return $merged_attributes;
	}

	/**
	 * Get this blocks attributes merged with defaults from the registration for post type based blocks.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $cpt_name Custom post type name.
	 * @param string $meta_prefix Meta prefix.
	 * @return array
	 */
	public function get_attributes_with_defaults_cpt( $post_id, $cpt_name, $meta_prefix ) {
		if ( ! empty( $this->attributes_with_defaults[ $post_id ] ) ) {
			return $this->attributes_with_defaults[ $post_id ];
		}

		$default_attributes = $this->get_cpt_default_attributes( $cpt_name, $meta_prefix );
		$post_meta          = get_post_meta( $post_id );
		$attributes         = [];
		if ( ! empty( $post_meta ) && is_array( $post_meta ) ) {
			foreach ( $post_meta as $meta_key => $meta_value ) {
				if ( strpos( $meta_key, $meta_prefix ) === 0 && isset( $meta_value[0] ) ) {
					$attributes[ str_replace( $meta_prefix, '', $meta_key ) ] = maybe_unserialize( $meta_value[0] );
				}
			}
		}
		$merged_attributes = $this->merge_attributes_with_defaults( $attributes, $default_attributes );

		$this->attributes_with_defaults[ $post_id ] = $merged_attributes;
		return $merged_attributes;
	}


	/**
	 * Get default attributes for a custom post type.
	 *
	 * @param string $cpt_name Custom post type name.
	 * @param string $meta_prefix Meta prefix.
	 * @return array
	 */
	protected function get_cpt_default_attributes( $cpt_name, $meta_prefix ) {
		$cache_key = $cpt_name . '_' . $meta_prefix;

		if ( ! isset( $this->default_attributes_cache[ $cache_key ] ) ) {
			$meta_keys          = get_registered_meta_keys( 'post', $cpt_name );
			$default_attributes = [];

			foreach ( $meta_keys as $key => $value ) {
				if ( str_starts_with( $key, $meta_prefix ) && array_key_exists( 'default', $value ) ) {
					$attr_name                        = str_replace( $meta_prefix, '', $key );
					$default_attributes[ $attr_name ] = $value['default'];
				}
			}

			$this->default_attributes_cache[ $cache_key ] = $default_attributes;
		}

		return $this->default_attributes_cache[ $cache_key ];
	}

	/**
	 * Retuurn if this block should register itself. (can override for things like blocks in two plugins)
	 *
	 * @return boolean
	 */
	public function should_register() {
		return true;
	}

	/**
	 * Get the current blocks pro version. Useful for mocking in tests that rely the on KBP_VERSION constant.
	 *
	 * @return string|null
	 */
	protected function get_pro_version() {
		return defined( 'KBP_VERSION' ) ? KBP_VERSION : null;
	}

	/**
	 * Build escaped HTML attributes to be placed in an HTML tag.
	 *
	 * @param array<string, string|int|float|bool> $attributes The html attributes to render to a tag.
	 *
	 * @return string
	 */
	protected function build_escaped_html_attributes( array $attributes ): string {
		$html = '';

		foreach ( $attributes as $key => $value ) {
			if ( is_bool( $value ) ) {
				if ( $value ) {
					$html .= sprintf( ' %s', esc_attr( $key ) );
				}

				continue;
			}

			$html .= sprintf( ' %s="%s"', esc_attr( $key ), esc_attr( $value ) );
		}

		return $html;
	}
}
