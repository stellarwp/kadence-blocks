<?php
/**
 * Rowlayout environment.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * What the row layout needs to know about the site it runs on.
 *
 * @since TBD
 */
interface Kadence_Blocks_Rowlayout_Environment {

	/**
	 * Whether GeneratePress is active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_generatepress(): bool;

	/**
	 * Whether the Kadence theme is active.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_kadence_theme(): bool;

	/**
	 * The content width of the theme, or null when it has none.
	 *
	 * @since TBD
	 *
	 * @return mixed
	 */
	public function content_width();

	/**
	 * Whether the site is in full site editing mode.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_fse_mode(): bool;
}
