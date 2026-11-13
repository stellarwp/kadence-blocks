<?php
/**
 * Navigation plain attributes.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Turns the attributes of the navigation into plain lists, the way the navigation always did.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Plain_Attributes implements Kadence_Blocks_Css_Post_Attributes {

	/**
	 * Where the attributes come from.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Post_Attributes
	 */
	private $source;

	/**
	 * Create the source.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Post_Attributes $source Where the attributes come from.
	 */
	public function __construct( $source ) {
		$this->source = $source;
	}

	/**
	 * The attributes of a post as plain lists.
	 *
	 * @since TBD
	 *
	 * @param int|string $post_id The post id.
	 *
	 * @return array|null
	 */
	public function for_post( $post_id ) {
		// phpcs:ignore WordPress.WP.AlternativeFunctions.json_encode_json_encode
		return json_decode( json_encode( $this->source->for_post( $post_id ) ), true );
	}
}
