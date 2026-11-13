<?php
/**
 * Looks the Pro video popup block up on the site.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-videopopup-environment.php';

/**
 * Looks the Pro video popup block up on the site.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Site_Environment implements Kadence_Blocks_Videopopup_Environment {

	/**
	 * The class that tells Pro is active.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $plugin_class;

	/**
	 * The Pro video popup block class.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $block_class;

	/**
	 * Create the environment.
	 *
	 * @since TBD
	 *
	 * @param string $plugin_class The class that tells Pro is active.
	 * @param string $block_class  The Pro video popup block class.
	 */
	public function __construct( $plugin_class = 'Kadence_Blocks_Pro', $block_class = 'Kadence_Blocks_Pro_Video_Popup_Block' ) {
		$this->plugin_class = $plugin_class;
		$this->block_class  = $block_class;
	}

	/**
	 * A new Pro video popup block, or null when Pro or its block is not there.
	 *
	 * @since TBD
	 *
	 * @return object|null
	 */
	public function pro_block() {
		if ( ! class_exists( $this->plugin_class ) || ! class_exists( $this->block_class ) ) {
			return null;
		}

		return new $this->block_class();
	}
}
