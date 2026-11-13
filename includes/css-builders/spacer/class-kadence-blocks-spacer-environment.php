<?php
/**
 * What the spacer needs to know about the site.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * What the spacer needs to know about the site.
 *
 * @since TBD
 */
interface Kadence_Blocks_Spacer_Environment {

	/**
	 * Whether the Kadence theme runs in its Full Site Editing mode.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_fse_mode(): bool;
}
