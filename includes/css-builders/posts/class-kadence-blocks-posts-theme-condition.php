<?php
/**
 * Condition: the Kadence theme is active.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-posts-environment.php';

/**
 * Met when the Kadence theme is active.
 *
 * @since TBD
 */
final class Kadence_Blocks_Posts_Theme_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * What the site offers.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Posts_Environment
	 */
	private $environment;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Posts_Environment $environment What the site offers.
	 */
	public function __construct( Kadence_Blocks_Posts_Environment $environment ) {
		$this->environment = $environment;
	}

	/**
	 * Whether the condition is met.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return $this->environment->has_kadence_theme();
	}
}
