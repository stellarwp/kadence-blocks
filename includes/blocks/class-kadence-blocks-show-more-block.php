<?php
/**
 * Class to Build the Show More Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Groups_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

/**
 * Class to Build the Show More Block.
 *
 * @category class
 */
class Kadence_Blocks_Show_More_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Groups_Site_Styles {

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
	protected $block_name = 'show-more';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

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
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Show_More_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * Return dynamically generated HTML for block
	 *
	 * @since 3.7.8.2 Insert the excerpt element without reprocessing the inner content.
	 *
	 * @param array $attributes the blocks attributes.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $content the block content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string Modified block content.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		// Check if excerpt element already exists in content
		if ( false !== strpos( $content, 'kb-show-more-sr-excerpt' ) ) {
			return $content;
		}

		// Create the excerpt div HTML
		$excerpt_html = '<div class="kb-show-more-sr-excerpt" aria-live="polite" aria-atomic="true"></div>';

		// Find the opening div tag of the container and insert excerpt right after it
		// Match: <div class="kb-block-show-more-container...">
		$pattern = '/(<div[^>]*class="[^"]*kb-block-show-more-container[^"]*"[^>]*>)/i';

		if ( preg_match( $pattern, $content, $matches, PREG_OFFSET_CAPTURE ) ) {
			// Insert excerpt div right after the opening container div
			$content = substr_replace( $content, $excerpt_html, $matches[0][1] + strlen( $matches[0][0] ), 0 );
		} else {
			// Fallback: if pattern doesn't match, prepend to content
			$content = $excerpt_html . $content;
		}

		return $content;
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

		wp_register_script( 'kadence-blocks-show-more', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-show-more.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_localize_script(
			'kadence-blocks-show-more',
			'kbShowMore',
			array(
				'contentCollapsed'     => __( 'Content is collapsed.', 'kadence-blocks' ),
				'contentContinues'     => __( 'Content continues.', 'kadence-blocks' ),
				'activateButton'       => __( 'Activate the', 'kadence-blocks' ),
				'buttonToReveal'       => __( 'button to reveal the full content.', 'kadence-blocks' ),
				'showMoreDefault'      => __( 'Show More', 'kadence-blocks' ),
			)
		);
	}

	/**
	 * The instance rule always prints the collapsed height, and the editor sets
	 * the spacing inline and the height and fade in a style tag that always
	 * prints, so every site value goes through the overlay.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( ...$this->site_styles_attribute_groups() );
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

	/**
	 * The collapsed height, the padding and the margin each take their unit and
	 * their tablet and mobile values with them, and the fade takes its size.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attribute_groups(): array {
		return [
			[ 'heightDesktop', 'heightTablet', 'heightMobile', 'heightType' ],
			[ 'enableFadeOut', 'fadeOutSize' ],
			[ 'paddingDesktop', 'paddingTablet', 'paddingMobile', 'paddingUnit' ],
			[ 'marginDesktop', 'marginTablet', 'marginMobile', 'marginUnit' ],
		];
	}
}

Kadence_Blocks_Show_More_Block::get_instance();
