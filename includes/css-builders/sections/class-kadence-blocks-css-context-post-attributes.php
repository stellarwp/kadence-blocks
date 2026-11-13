<?php
/**
 * The attributes saved on a post, read through the block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-css-post-attributes.php';

/**
 * Reads the attributes of a post of a custom post type through the block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Context_Post_Attributes implements Kadence_Blocks_Css_Post_Attributes {

	/**
	 * What the builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

	/**
	 * The post type.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $post_type;

	/**
	 * The prefix of the meta keys that store the attributes.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $meta_prefix;

	/**
	 * Create the source.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Block_Context $context     What the builder needs from the block.
	 * @param string                           $post_type   The post type.
	 * @param string                           $meta_prefix The prefix of the meta keys that store the attributes.
	 */
	public function __construct( $context, $post_type, $meta_prefix ) {
		$this->context     = $context;
		$this->post_type   = $post_type;
		$this->meta_prefix = $meta_prefix;
	}

	/**
	 * The attributes of a post, with the defaults of its post type for what the post does not save.
	 *
	 * @since TBD
	 *
	 * @param int|string $post_id The post id.
	 *
	 * @return array
	 */
	public function for_post( $post_id ): array {
		return $this->context->call( 'get_attributes_with_defaults_cpt', $post_id, $this->post_type, $this->meta_prefix );
	}
}
