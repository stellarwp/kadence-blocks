<?php
/**
 * Posts environment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * What the posts block needs to know about the site it runs on.
 *
 * @since TBD
 */
interface Kadence_Blocks_Posts_Environment {

	/**
	 * Whether the Kadence theme is active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_kadence_theme(): bool;

	/**
	 * The version of the Kadence theme, or null when it does not define one.
	 *
	 * @since TBD
	 *
	 * @return mixed
	 */
	public function kadence_version();
}
