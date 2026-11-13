<?php
/**
 * The attributes saved on a post.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * Where the attributes of a post come from.
 *
 * @since TBD
 */
interface Kadence_Blocks_Css_Post_Attributes {

	/**
	 * The attributes of a post, with the defaults of its post type for what the post does not save.
	 *
	 * @since TBD
	 *
	 * @param int|string $post_id The post id.
	 *
	 * @return array
	 */
	public function for_post( $post_id );
}
