<?php
/**
 * Header environment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * What the header needs to know about the site.
 *
 * @since TBD
 */
interface Kadence_Blocks_Header_Environment {

	/**
	 * Whether Kadence Blocks Pro is active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_pro(): bool;
}
