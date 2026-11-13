<?php
/**
 * What the site offers the spacer.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-spacer-environment.php';

/**
 * What the site offers the spacer.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Site_Environment implements Kadence_Blocks_Spacer_Environment {

	/**
	 * Whether the Kadence theme runs in its Full Site Editing mode.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function is_fse_mode(): bool {
		return kadence_blocks_is_fse_mode();
	}
}
