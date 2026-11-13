<?php
/**
 * Condition: the Kadence theme is active and older than 1.0.16.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-posts-environment.php';

/**
 * Met when the Kadence theme is active, defines its version and is older than 1.0.16.
 *
 * @since TBD
 */
final class Kadence_Blocks_Posts_Old_Theme_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The first version of the theme that styles the entry padding itself.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FIRST_STYLED_VERSION = '1.0.16';

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
		$version = $this->environment->kadence_version();

		if ( ! $this->environment->has_kadence_theme() || null === $version ) {
			return false;
		}

		return version_compare( $version, self::FIRST_STYLED_VERSION, '<' );
	}
}
