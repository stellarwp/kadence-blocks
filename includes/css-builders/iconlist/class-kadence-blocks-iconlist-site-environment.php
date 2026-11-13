<?php
/**
 * Icon list site environment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-iconlist-environment.php';

/**
 * What the site offers the icon list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_Site_Environment implements Kadence_Blocks_Iconlist_Environment {

	/**
	 * Whether the site is written right to left.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_rtl(): bool {
		return is_rtl();
	}
}
