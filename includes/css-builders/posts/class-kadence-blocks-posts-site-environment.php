<?php
/**
 * Posts site environment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-posts-environment.php';

/**
 * The environment of the site the code runs on.
 *
 * @since TBD
 */
final class Kadence_Blocks_Posts_Site_Environment implements Kadence_Blocks_Posts_Environment {

	/**
	 * Whether the Kadence theme is active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_kadence_theme(): bool {
		return class_exists( 'Kadence\\Theme' );
	}

	/**
	 * The version of the Kadence theme, or null when it does not define one.
	 *
	 * @since TBD
	 *
	 * @return mixed
	 */
	public function kadence_version() {
		return defined( 'KADENCE_VERSION' ) ? KADENCE_VERSION : null;
	}
}
