<?php
/**
 * Icon list environment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * What the icon list needs from the site.
 *
 * @since TBD
 */
interface Kadence_Blocks_Iconlist_Environment {

	/**
	 * Whether the site is written right to left.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_rtl(): bool;
}
