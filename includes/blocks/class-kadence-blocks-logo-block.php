<?php
/**
 * Class to Build the Logo Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Logo Block.
 *
 * @category class
 */
class Kadence_Blocks_Logo_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'logo';

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
	protected $has_style = true;

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
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.¸
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$css->set_selector( '.kb-logo' . $unique_id );

		return $css->css_output();
	}

	/**
	 * Return dynamically generated HTML for block
	 *
	 * @param array    $attributes    The block attributes.
	 * @param string   $unique_id     The unique ID for the block.
	 * @param string   $content       The block inner content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$showSiteTitle = isset( $attributes['showSiteTitle'] ) ? $attributes['showSiteTitle'] : true;
		$showSiteTagline = isset( $attributes['showSiteTagline'] ) ? $attributes['showSiteTagline'] : false;
		$layout = isset( $attributes['layout'] ) ? $attributes['layout'] : 'logo-title';

		$outer_classes = array( 'kb-logo', 'kb-logo-' . $unique_id, 'kb-logo-layout-' . $layout );

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $outer_classes ) ) );

		$inner_content = '';

		// Parse inner blocks
		if ( ! empty( $block_instance->inner_blocks ) ) {
			foreach ( $block_instance->inner_blocks as $inner_block ) {
				if ( $inner_block->name === 'kadence/image' ) {
					$inner_content .= $inner_block->render();
				} elseif ( $inner_block->name === 'core/group' && ( $layout === 'logo-right-stacked' || $layout === 'logo-left-stacked' ) ) {
					$inner_content .= '<div class="wp-block-group">';
					foreach ( $inner_block->inner_blocks as $group_block ) {
						$inner_content .= $group_block->render();
					}
					$inner_content .= '</div>';
				} elseif ( $inner_block->name === 'kadence/advancedheading' ) {
					$metadata = $inner_block->attributes['metadata'] ?? array();
					if ( isset( $metadata['for'] ) && $metadata['for'] === 'title' && $showSiteTitle ) {
						$inner_content .= '<div class="kb-logo-title">' . $inner_block->render() . '</div>';
					} elseif ( isset( $metadata['for'] ) && $metadata['for'] === 'tagline' && $showSiteTagline ) {
						$inner_content .= '<div class="kb-logo-tagline">' . $inner_block->render() . '</div>';
					}
				}
			}
		}

		// If no inner blocks, fallback to default content
		if ( empty( $inner_content ) ) {
			$inner_content .= '<div class="kb-logo-image">' . get_custom_logo() . '</div>';
			if ( $showSiteTitle ) {
				$inner_content .= '<div class="kb-logo-title">' . get_bloginfo( 'name' ) . '</div>';
			}
			if ( $showSiteTagline ) {
				$inner_content .= '<div class="kb-logo-tagline">' . get_bloginfo( 'description' ) . '</div>';
			}
		}

		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $inner_content );
	}

}

Kadence_Blocks_Logo_Block::get_instance();
