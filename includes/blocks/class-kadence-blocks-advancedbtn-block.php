<?php
/**
 * Class to Build the Advanced Button Block.
 *
 * @package Kadence Blocks
 */

// cspell:ignore bgtype btnkey btnvalue simplelightbox videolight .

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Advanced Button.
 *
 * @category class
 */
class Kadence_Blocks_Advancedbtn_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles {
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
	protected $block_name = 'advancedbtn';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css object for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-advancedbtn-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Advancedbtn_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		parent::register_scripts();
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_style( 'kb-button-deprecated-styles', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-button-deprecated-style.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-simplelightbox-css', KADENCE_BLOCKS_URL . 'includes/assets/css/simplelightbox.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-simplelightbox', KADENCE_BLOCKS_URL . 'includes/assets/js/simplelightbox.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_register_script( 'kadence-blocks-videolight-js', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-init-video-popup.min.js', array( 'kadence-simplelightbox' ), KADENCE_BLOCKS_VERSION, true );
	}

	/**
	 * The editor paints the layout inline. The typography, width and `btns`
	 * attributes only style buttons saved before the Single Button block.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return [ 'hAlign', 'thAlign', 'mhAlign', 'vAlign', 'tvAlign', 'mvAlign', 'orientation', 'gap', 'gapUnit', 'padding', 'tabletPadding', 'mobilePadding', 'paddingUnit', 'margin', 'marginUnit' ];
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

Kadence_Blocks_Advancedbtn_Block::get_instance();
