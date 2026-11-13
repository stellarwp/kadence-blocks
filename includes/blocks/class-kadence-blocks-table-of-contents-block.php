<?php
/**
 * Class to Build the Table of Contents Block.
 *
 * @package Kadence Blocks
 */

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Table of Contents Block.
 *
 * @category class
 */
class Kadence_Blocks_Tableofcontents_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles {

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
	protected $block_name = 'tableofcontents';

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

	public function __construct() {
		parent::__construct();

		add_filter( 'rank_math/researches/toc_plugins', array( $this, 'toc_filter_rankmath' ) );
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
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-tableofcontents-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Tableofcontents_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

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
		if ( is_feed() ) {
			return;
		}
		if ( isset( $attributes['enableScrollSpy'] ) && $attributes['enableScrollSpy'] ) {
			wp_register_script( 'kadence-blocks-gumshoe', KADENCE_BLOCKS_URL . 'includes/assets/js/gumshoe.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		}

		$toc = new Kadence_Blocks_Table_Of_Contents();

		return $toc->render_table_of_content( $attributes, $content );
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

		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-table-of-contents.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}

	/**
	 * Filter to add plugins to the TOC list.
	 *
	 * @param array $toc_plugins TOC plugins.
	 */
	public function toc_filter_rankmath( $toc_plugins ) {
		$toc_plugins['kadence-blocks/kadence-blocks.php'] = 'Kadence Blocks';

		return $toc_plugins;
	}

	/**
	 * The editor paints the title and the list inline, and the list's columns, style and
	 * link style are classes the render builds from the attributes, so every style value
	 * goes through the overlay. What the block does with the headings (which to list, the
	 * title text and toggle, scrolling, searching) stays per table.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge(
			[ 'columns', 'listStyle', 'linkStyle', 'listGap', 'displayShadow', 'shadow', 'maxWidth', 'maxWidthType' ],
			[ 'containerBackground', 'containerPadding', 'tabletContainerPadding', 'mobileContainerPadding', 'containerPaddingUnit' ],
			[ 'containerMargin', 'containerTabletMargin', 'containerMobileMargin', 'containerMarginUnit' ],
			[ 'borderStyle', 'tabletBorderStyle', 'mobileBorderStyle', 'borderRadius', 'tabletBorderRadius', 'mobileBorderRadius', 'borderRadiusUnit' ],
			[ 'titleAlign', 'titleColor', 'titleSize', 'titleSizeType', 'titleLineHeight', 'titleLineType', 'titleLetterSpacing', 'titleTextTransform' ],
			[ 'titleTypography', 'titleGoogleFont', 'titleLoadGoogleFont', 'titleFontSubset', 'titleFontVariant', 'titleFontWeight', 'titleFontStyle' ],
			[ 'titlePadding', 'tabletTitlePadding', 'mobileTitlePadding', 'titlePaddingType', 'titleBorderStyle', 'tabletTitleBorderStyle', 'mobileTitleBorderStyle' ],
			[ 'contentHoverColor', 'contentSize', 'contentSizeType', 'contentLineHeight', 'contentLineType', 'contentLetterSpacing', 'contentTextTransform' ],
			[ 'contentTypography', 'contentGoogleFont', 'contentLoadGoogleFont', 'contentFontSubset', 'contentFontVariant', 'contentFontWeight', 'contentFontStyle' ],
			[ 'contentMargin', 'tabletContentMargin', 'mobileContentMargin', 'contentMarginType' ]
		);
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attributes_map(): array {
		return [ 'contentColor' => 'color.text' ];
	}

	/**
	 * The text color is the list's, which is what the block's own content color paints.
	 *
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_supports(): array {
		return [
			'color' => [
				'text'                            => true,
				'background'                      => false,
				'gradients'                       => false,
				'__experimentalSkipSerialization' => true,
			],
		];
	}

	/**
	 * The list, which the editor and the front end both render inside the block's wrapper. Only
	 * the color goes there, so the block's other core styles, such as Additional CSS, keep the wrapper.
	 *
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_selectors(): array {
		return [ 'color' => '.wp-block-kadence-tableofcontents .kb-table-of-content-list' ];
	}

}

Kadence_Blocks_Tableofcontents_Block::get_instance();
