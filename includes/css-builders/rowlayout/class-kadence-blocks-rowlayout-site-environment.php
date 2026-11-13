<?php
/**
 * Rowlayout site environment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';

/**
 * The environment of the site the code runs on.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Site_Environment implements Kadence_Blocks_Rowlayout_Environment {

	/**
	 * Whether GeneratePress is active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_generatepress(): bool {
		return class_exists( 'GeneratePress_CSS' );
	}

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
	 * The content width of the theme, or null when it has none.
	 *
	 * @since TBD
	 *
	 * @return mixed
	 */
	public function content_width() {
		global $content_width;

		return $content_width ?? null;
	}

	/**
	 * Whether the site is in full site editing mode.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_fse_mode(): bool {
		return kadence_blocks_is_fse_mode();
	}
}
