<?php
/**
 * Class to Build the Table Block.
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
 * Class to Build the Table Block.
 *
 * @category class
 */
class Kadence_Blocks_Table_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Groups_Site_Styles {

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
	protected $block_name = 'table';

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
	protected $has_style = true;


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
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-table-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Table_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * Return dynamically generated HTML for block
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {


		$wrapper_classes = [
			'kb-table-container',
			'kb-table-container' . esc_attr( $unique_id ),
		];

		if(! empty( $attributes['className'] )) {
			$wrapper_classes[] = esc_attr( $attributes['className'] );
		}

		$wrapper_attributes = get_block_wrapper_attributes( [
			'class' => implode( ' ', $wrapper_classes ),
		] );

		$caption_html = '';
		$is_enabled = filter_var( $attributes['enableCaption'] ?? false, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );
		if ( $is_enabled === true && isset( $attributes['caption'] ) && is_string( $attributes['caption'] ) && trim( $attributes['caption'] ) !== '' ) {
			$caption_html = '<caption>' . esc_html( $attributes['caption'] ) . '</caption>';
		}

		return sprintf(
			'<div %1$s><table class="kb-table kb-table%2$s">%3$s%4$s</table></div>',
			$wrapper_attributes,
			esc_attr( $unique_id ),
			$caption_html,
			$content
		);
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

//		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kt-tabs.min.js', array(), KADENCE_BLOCKS_VERSION, true );

	}

	/**
	 * The editor paints every Table value itself, in its own style tag, and the
	 * instance rule outranks core's, so every site value goes through the
	 * overlay.
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
	 * Each font is kept whole, each alignment, border, spacing and row height
	 * takes its devices and unit with it, the row backgrounds their toggle, and
	 * the max width its unit and scroll setting.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attribute_groups(): array {
		return [
			[ 'dataTypography' ],
			[ 'headerTypography' ],
			[ 'captionTypography' ],
			[ 'textAlign', 'textAlignTablet', 'textAlignMobile' ],
			[ 'headerAlign', 'headerAlignTablet', 'headerAlignMobile' ],
			[ 'captionAlign', 'captionAlignTablet', 'captionAlignMobile' ],
			[ 'evenOddBackground', 'backgroundColorEven', 'backgroundColorOdd', 'backgroundHoverColorEven', 'backgroundHoverColorOdd' ],
			[ 'borderStyle', 'tabletBorderStyle', 'mobileBorderStyle', 'borderOnRowOnly' ],
			[ 'cellPadding', 'tabletCellPadding', 'mobileCellPadding', 'cellPaddingType' ],
			[ 'rowMinHeight', 'tabletRowMinHeight', 'mobileRowMinHeight', 'rowMinHeightType' ],
			[ 'padding', 'tabletPadding', 'mobilePadding', 'paddingType' ],
			[ 'margin', 'tabletMargin', 'mobileMargin', 'marginType' ],
			[ 'maxWidth', 'maxWidthUnit', 'overflowXScroll' ],
		];
	}
}

Kadence_Blocks_Table_Block::get_instance();
