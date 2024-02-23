<?php
/**
 * Class to Build the Header Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Header Block.
 *
 * @category class
 */
class Kadence_Blocks_Header_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'header';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	protected $has_style = false;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $seen_refs = array();

	protected $header_attributes = array();

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
		$header_block = get_post( $attributes['id'] );

		if ( ! $header_block || 'kadence_header' !== $header_block->post_type ) {
			return '';
		}

		if ( 'publish' !== $header_block->post_status || ! empty( $header_block->post_password ) ) {
			return '';
		}

		// Prevent a nav block from being rendered inside itself.
		if ( isset( self::$seen_refs[ $attributes['id'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]', 'kadence-blocks' ) :
				'';
		}
		self::$seen_refs[ $attributes['id'] ] = true;

		// Remove the advanced nav block so it doesn't try and render.
		$content = preg_replace( '/<!-- wp:kadence\/header {.*?} -->/', '', $header_block->post_content );
		$content = str_replace( '<!-- wp:kadence/header  -->', '', $content );
		$content = str_replace( '<!-- wp:kadence/header -->', '', $content );
		$content = str_replace( '<!-- /wp:kadence/header -->', '', $content );

		// Handle embeds for nav block.
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $content );
		$content = $wp_embed->autoembed( $content );
		$content = do_blocks( $content );

		unset( self::$seen_refs[ $attributes['id'] ] );

//		$header_attributes = $this->get_header_attributes( $attributes['id'] );
//		$header_attributes = json_decode( json_encode( $header_attributes ), true );

		$name = ! empty( $attributes['name'] ) ? $attributes['name'] : '';
		$outer_classes = array( 'wp-block-kadence-header' . $unique_id );
		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class'      => implode( ' ', $outer_classes ),
				'aria-label' => $name,
			)
		);

		return sprintf(
			'<nav %1$s>%2$s</nav>',
			$wrapper_attributes,
			$content
		);
	}

	/**
	 * Get header attributes.
	 *
	 * @param int $post_id Post ID.
	 * @return array
	 */
	private function get_header_attributes( $post_id ) {

		if ( ! empty( $this->header_attributes[ $post_id ] ) ) {
			return $this->header_attributes[ $post_id ];
		}

		$post_meta = get_post_meta( $post_id );
		$nav_meta = array();
		if ( is_array( $post_meta ) ) {
			foreach ( $post_meta as $meta_key => $meta_value ) {
				if ( strpos( $meta_key, '_kad_header_' ) === 0 && isset( $meta_value[0] ) ) {
					$nav_meta[ str_replace( '_kad_header_', '', $meta_key ) ] = maybe_unserialize( $meta_value[0] );
				}
			}
		}

		if ( $this->header_attributes[ $post_id ] = $nav_meta ) {
			return $this->header_attributes[ $post_id ];
		}

		return array();
	}
}

Kadence_Blocks_Header_Block::get_instance();
