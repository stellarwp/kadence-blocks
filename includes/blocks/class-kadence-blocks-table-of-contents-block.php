<?php
/**
 * Class to Build the Table of Contents Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Table of Contents Block.
 *
 * @category class
 */
class Kadence_Blocks_Tableofcontents_Block extends Kadence_Blocks_Abstract_Block {

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

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		// Container.
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ':not(.this-class-is-for-specificity):not(.class-is-for-specificity)' );

		$css->render_measure_output( $attributes, 'containerMargin', 'margin', array(
			'tablet_key'  => 'containerTabletMargin',
			'mobile_key'  => 'containerMobileMargin',
			'unit_key' => 'containerMarginUnit',
		) );

		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap' );
		$css->render_measure_output(
			$attributes,
			'containerPadding',
			'padding',
			array(
				'unit_key' => 'containerPaddingUnit',
			)
		);
		if ( isset( $attributes['containerBackground'] ) && ! empty( $attributes['containerBackground'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $attributes['containerBackground'] ) );
		}
		if ( ! empty( $attributes['containerBorderColor'] ) || $css->is_number( $attributes['containerBorder'][0] ) || $css->is_number( $attributes['containerBorder'][1] ) || $css->is_number( $attributes['containerBorder'][2] ) || $css->is_number( $attributes['containerBorder'][3] ) ) {
			if ( ! empty( $attributes['containerBorderColor'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attributes['containerBorderColor'] ) );
			}
			$css->render_measure_output( $attributes, 'containerBorder', 'border-width' );
		} else {
			$css->render_border_styles( $attributes, 'borderStyle' );
		}
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array( 'unit_key' => 'borderRadiusUnit' ) );
		if ( isset( $attributes['displayShadow'] ) && true == $attributes['displayShadow'] ) {
			if ( isset( $attributes['shadow'] ) && is_array( $attributes['shadow'] ) && isset( $attributes['shadow'][0] ) && is_array( $attributes['shadow'][0] ) ) {
				$css->add_property( 'box-shadow', $css->render_shadow( $attributes['shadow'][0] ) );
			} else {
				$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
			}
		}
		if ( isset( $attributes['maxWidth'] ) && ! empty( $attributes['maxWidth'] ) ) {
			$maxWidthType = ( isset( $attributes['maxWidthType'] ) ? $attributes['maxWidthType'] : 'px' );
			$css->add_property( 'max-width', $css->render_number( $attributes['maxWidth'], $maxWidthType ) );
		}
		// Title.
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title-wrap' );
		if ( isset( $attributes['titleAlign'] ) ) {
			$css->add_property( 'text-align', $css->render_string( $attributes['titleAlign'] ) );
		}
		$css->render_measure_output(
			$attributes,
			'titlePadding',
			'padding',
			array(
				'unit_key' => 'titlePaddingType',
			)
		);
		// Border, check old first.
		if ( ! empty( $attributes['titleBorderColor'] ) || $css->is_number( $attributes['titleBorder'][0] ) || $css->is_number( $attributes['titleBorder'][1] ) || $css->is_number( $attributes['titleBorder'][2] ) || $css->is_number( $attributes['titleBorder'][3] ) ) {
			if ( ! empty( $attributes['titleBorderColor'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attributes['titleBorderColor'] ) );
			}
			$css->render_measure_output( $attributes, 'titleBorder', 'border-width' );
		} else {
			$css->render_border_styles( $attributes, 'titleBorderStyle' );
		}		
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . '.kb-collapsible-toc.kb-toc-toggle-hidden .kb-table-of-contents-title-wrap' );
		if ( isset( $attributes['titleCollapseBorderColor'] ) && ! empty( $attributes['titleCollapseBorderColor'] ) ) {
			$css->add_property( 'border-color', $css->render_color( $attributes['titleCollapseBorderColor'] ) );
		}
		if ( isset( $attributes['titleColor'] ) && ! empty( $attributes['titleColor'] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title-wrap' );
			$css->add_property( 'color', $css->render_color( $attributes['titleColor'] ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title' );
		if ( isset( $attributes['titleColor'] ) && ! empty( $attributes['titleColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['titleColor'] ) );
		}
		if ( ! empty( $attributes['titleSize'][0] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['titleSize'][0], ( isset( $attributes['titleSizeType'] ) && ! empty( $attributes['titleSizeType'] ) ? $attributes['titleSizeType'] : 'px' ) ) );
		}
		if ( ! empty( $attributes['titleLineHeight'][0] ) ) {
			$css->add_property( 'line-height', $attributes['titleLineHeight'][0] . ( isset( $attributes['titleLineType'] ) ? $attributes['titleLineType'] : 'px' ) );
		}
		if ( isset( $attributes['titleLetterSpacing'] ) ) {
			$css->add_property( 'letter-spacing', $css->render_number( $attributes['titleLetterSpacing'], 'px' ) );
		}
		if ( isset( $attributes['titleTypography'] ) ) {
			$google = isset( $attributes['titleGoogleFont'] ) && $attributes['titleGoogleFont'] ? true : false;
			$google = $google && ( isset( $attributes['titleLoadGoogleFont'] ) && $attributes['titleLoadGoogleFont'] || ! isset( $attributes['titleLoadGoogleFont'] ) ) ? true : false;
			$css->add_property( 'font-family', $css->render_font_family( $attributes['titleTypography'], $google, ( isset( $attributes['titleFontVariant'] ) ? $attributes['titleFontVariant'] : '' ), ( isset( $attributes['titleFontSubset'] ) ? $attributes['titleFontSubset'] : '' ) ) );
		}
		if ( isset( $attributes['titleFontWeight'] ) ) {
			$css->add_property( 'font-weight', $css->render_string( $attributes['titleFontWeight'] ) );
		}
		if ( isset( $attributes['titleFontStyle'] ) ) {
			$css->add_property( 'font-style', $css->render_string( $attributes['titleFontStyle'] ) );
		}
		if ( isset( $attributes['titleTextTransform'] ) ) {
			$css->add_property( 'text-transform', $css->render_string( $attributes['titleTextTransform'] ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list' );
		if ( isset( $attributes['contentColor'] ) && ! empty( $attributes['contentColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['contentColor'] ) );
		}
		if ( ! empty( $attributes['contentSize'][0] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['contentSize'][0], ( isset( $attributes['contentSizeType'] ) && ! empty( $attributes['contentSizeType'] ) ? $attributes['contentSizeType'] : 'px' ) ) );
		}
		if ( ! empty( $attributes['contentLineHeight'][0] ) ) {
			$css->add_property( 'line-height', $attributes['contentLineHeight'][0] . ( isset( $attributes['contentLineType'] ) ? $attributes['contentLineType'] : 'px' ) );
		}
		if ( isset( $attributes['contentLetterSpacing'] ) ) {
			$css->add_property( 'letter-spacing', $css->render_number( $attributes['contentLetterSpacing'], 'px' ) );
		}
		if ( isset( $attributes['contentTypography'] ) ) {
			$google = isset( $attributes['contentGoogleFont'] ) && $attributes['contentGoogleFont'] ? true : false;
			$google = $google && ( isset( $attributes['contentLoadGoogleFont'] ) && $attributes['contentLoadGoogleFont'] || ! isset( $attributes['contentLoadGoogleFont'] ) ) ? true : false;
			$css->add_property( 'font-family', $css->render_font_family( $attributes['contentTypography'], $google, ( isset( $attributes['contentFontVariant'] ) ? $attributes['contentFontVariant'] : '' ), ( isset( $attributes['contentFontSubset'] ) ? $attributes['contentFontSubset'] : '' ) ) );
		}
		if ( isset( $attributes['contentFontWeight'] ) ) {
			$css->add_property( 'font-weight', $css->render_string( $attributes['contentFontWeight'] ) );
		}
		if ( isset( $attributes['contentFontStyle'] ) ) {
			$css->add_property( 'font-style', $css->render_string( $attributes['contentFontStyle'] ) );
		}
		if ( isset( $attributes['contentTextTransform'] ) ) {
			$css->add_property( 'text-transform', $css->render_string( $attributes['contentTextTransform'] ) );
		}
		$css->render_measure_output(
			$attributes,
			'contentMargin',
			'margin',
			array(
				'unit_key' => 'contentMarginType',
			)
		);
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list .kb-table-of-contents__entry:hover' );
		if ( isset( $attributes['contentHoverColor'] ) && ! empty( $attributes['contentHoverColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['contentHoverColor'] ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list .active > .kb-table-of-contents__entry' );
		if ( isset( $attributes['contentActiveColor'] ) && ! empty( $attributes['contentActiveColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['contentActiveColor'] ) );
		}
		if ( isset( $attributes['listGap'] ) && is_array( $attributes['listGap'] ) && isset( $attributes['listGap'][0] ) && ! empty( $attributes['listGap'][0] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li' );
			$css->add_property( 'margin-bottom', $css->render_string( $attributes['listGap'][0], 'px' ) );
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li .kb-table-of-contents-list-sub' );
			$css->add_property( 'margin-top', $css->render_string( $attributes['listGap'][0], 'px' ) );
		}
		if ( isset( $attributes['containerBackground'] ) && ! empty( $attributes['containerBackground'] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-basiccircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-basiccircle .kb-table-of-contents-icon-trigger:before, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-arrowcircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-arrowcircle .kb-table-of-contents-icon-trigger:before, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-xclosecircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-toggle-icon-style-xclosecircle .kb-table-of-contents-icon-trigger:before' );
			$css->add_property( 'background-color', $css->render_color( $attributes['containerBackground'] ) );
		}

		/*
		 * Tablet
		 */
		$css->set_media_state( 'tablet' );
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title' );
		if ( ! empty( $attributes['titleSize'][1] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['titleSize'][1], ( isset( $attributes['titleSizeType'] ) && ! empty( $attributes['titleSizeType'] ) ? $attributes['titleSizeType'] : 'px' ) ) );
		}
		if ( ! empty( $attributes['titleLineHeight'][1] ) ) {
			$css->add_property( 'line-height', $attributes['titleLineHeight'][1] . ( isset( $attributes['titleLineType'] ) ? $attributes['titleLineType'] : 'px' ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list' );
		if ( ! empty( $attributes['contentSize'][1] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['contentSize'][1], ( isset( $attributes['contentSizeType'] ) && ! empty( $attributes['contentSizeType'] ) ? $attributes['contentSizeType'] : 'px' ) ) );
		}
		if ( ! empty( $attributes['contentLineHeight'][1] ) ) {
			$css->add_property( 'line-height', $attributes['contentLineHeight'][1] . ( isset( $attributes['contentLineType'] ) ? $attributes['contentLineType'] : 'px' ) );
		}
		if ( ! empty( $attributes['listGap'][1] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li' );
			$css->add_property( 'margin-bottom', $css->render_string( $attributes['listGap'][1], 'px' ) );
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li .kb-table-of-contents-list-sub' );
			$css->add_property( 'margin-top', $css->render_string( $attributes['listGap'][1], 'px' ) );
		}
		$css->set_media_state( 'desktop' );

		/*
		 * Mobile
		 */
		$css->set_media_state( 'mobile' );
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ':not(.this-class-is-for-specificity):not(.class-is-for-specificity)' );
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-contents-title' );
		if ( ! empty( $attributes['titleSize'][2] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['titleSize'][2], ( isset( $attributes['titleSizeType'] ) && ! empty( $attributes['titleSizeType'] ) ? $attributes['titleSizeType'] : 'px' ) ) );
		}
		if ( isset( $attributes['titleLineHeight'] ) && is_array( $attributes['titleLineHeight'] ) && isset( $attributes['titleLineHeight'][2] ) && ! empty( $attributes['titleLineHeight'][2] ) ) {
			$css->add_property( 'line-height', $attributes['titleLineHeight'][2] . ( isset( $attributes['titleLineType'] ) ? $attributes['titleLineType'] : 'px' ) );
		}
		$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-wrap .kb-table-of-content-list' );
		if ( ! empty( $attributes['contentSize'][2] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $attributes['contentSize'][2], ( isset( $attributes['contentSizeType'] ) && ! empty( $attributes['contentSizeType'] ) ? $attributes['contentSizeType'] : 'px' ) ) );
		}
		if ( isset( $attributes['contentLineHeight'] ) && is_array( $attributes['contentLineHeight'] ) && isset( $attributes['contentLineHeight'][2] ) && ! empty( $attributes['contentLineHeight'][2] ) ) {
			$css->add_property( 'line-height', $attributes['contentLineHeight'][2] . ( isset( $attributes['contentLineType'] ) ? $attributes['contentLineType'] : 'px' ) );
		}
		if ( isset( $attributes['listGap'] ) && is_array( $attributes['listGap'] ) && isset( $attributes['listGap'][2] ) && ! empty( $attributes['listGap'][2] ) ) {
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li' );
			$css->add_property( 'margin-bottom', $css->render_string( $attributes['listGap'][2], 'px' ) );
			$css->set_selector( '.kb-table-of-content-nav.kb-table-of-content-id' . $unique_id . ' .kb-table-of-content-list li .kb-table-of-contents-list-sub' );
			$css->add_property( 'margin-top', $css->render_string( $attributes['listGap'][2], 'px' ) );
		}
		$css->set_media_state( 'desktop' );

		return $css->css_output();
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

}

Kadence_Blocks_Tableofcontents_Block::get_instance();
