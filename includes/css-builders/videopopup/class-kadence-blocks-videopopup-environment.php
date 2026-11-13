<?php
/**
 * What the video popup CSS needs from the site.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * What the video popup CSS needs from the site.
 *
 * @since TBD
 */
interface Kadence_Blocks_Videopopup_Environment {

	/**
	 * The Pro video popup block that adds its own CSS, or null when Pro is not active.
	 *
	 * @since TBD
	 *
	 * @return object|null
	 */
	public function pro_block();
}
