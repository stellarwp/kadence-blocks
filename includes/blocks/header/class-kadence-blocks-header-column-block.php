<?php
/**
 * Class to Build the Header block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Headers container Block for desktop.
 *
 * @category class
 */
class Kadence_Blocks_Header_Column_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'header-column';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;
	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

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
	 * On init startup register the block.
	 */
	public function on_init() {
		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/header/children/column/block.json',
			[
				'render_callback' => [ $this, 'render_css' ],
			]
		);
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

		$css->set_selector( '.wp-block-kadence-header-column' . $unique_id );


		return $css->css_output();
	}

	/**
	 * The innerblocks are stored on the $content variable. We just wrap with our data, if needed
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string Returns the block output.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		if( !empty( $block_instance->context['kadence/headerRowLayoutConfig'] ) && $block_instance->context['kadence/headerRowLayoutConfig'] === 'single' && !empty( $attributes['location'] ) && $attributes['location'] !== 'left' && $attributes['location'] !== 'tablet-left' ) {
			$content = '';
		}

		if ( ! empty( $attributes['location'] ) && ! in_array( $attributes['location'], ['tablet-center', 'tablet-left', 'tablet-right', 'center-left', 'center', 'center-right' ] ) ) {
			return $content;
		}

		$classes = [ 'wp-block-kadence-header-column' ];

		if ( ! empty( $attributes['location'] ) ) {
			$classes[] = 'wp-block-kadence-header-column-' . esc_attr( $attributes['location'] );

			//append a fake column in tablet left and right for more consistent styling compared to desktop
			if ( $attributes['location'] == 'tablet-left' ) {
				$content .= '<div class="wp-block-kadence-header-column wp-block-kadence-header-column-center-left"></div>';
			}
			if ( $attributes['location'] == 'tablet-right' ) {
				$content = '<div class="wp-block-kadence-header-column wp-block-kadence-header-column-center-right"></div>' . $content;
			}
		}
		if ( empty( $content ) ) {
			$classes[] = 'no-content';
			if ( ! empty( $attributes['location'] ) && ( 'center' === $attributes['location'] || 'tablet-center' === $attributes['location'] ) ) {
				$classes[] = 'no-content-column-center';
			}
		}

		return sprintf( '<div class="%1$s">%2$s</div>', esc_attr( implode( ' ', $classes ) ), $content );
	}
}

Kadence_Blocks_Header_Column_Block::get_instance();
