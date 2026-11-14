<?php
/**
 * Class to Build the Icon Block.
 *
 * @package Kadence Blocks
 */

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Icon Block.
 *
 * @category class
 */
class Kadence_Blocks_Icon_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles {
	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'icon';

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Icon_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * The editor paints the layout inline. The block and vertical alignments are
	 * classes in the saved markup, which no site value can reach, so they stay per icon.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return [ 'textAlignment', 'tabletTextAlignment', 'mobileTextAlignment', 'wrapIcons', 'gap', 'gapUnit' ];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attributes_map(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_supports(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_selectors(): array {
		return [];
	}
}

Kadence_Blocks_Icon_Block::get_instance();
