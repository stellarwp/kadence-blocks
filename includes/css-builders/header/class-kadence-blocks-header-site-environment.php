<?php
/**
 * Header site environment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * What the site offers the header: whether Kadence Blocks Pro is active.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Site_Environment implements Kadence_Blocks_Header_Environment {

	/**
	 * Whether Kadence Blocks Pro is active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_pro(): bool {
		return class_exists( 'Kadence_Blocks_Pro' );
	}
}
