<?php
/**
 * Class to Build the Icon List Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Icon List Block.
 *
 * @category class
 */
class Kadence_Blocks_Iconlist_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'iconlist';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

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
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );

		if ( isset( $attributes['listStyles'] ) && is_array( $attributes['listStyles'] ) && isset( $attributes['listStyles'][0] ) && is_array( $attributes['listStyles'][0] ) && isset( $attributes['listStyles'][0]['google'] ) && $attributes['listStyles'][0]['google'] && ( ! isset( $attributes['listStyles'][0]['loadGoogle'] ) || true === $attributes['listStyles'][0]['loadGoogle'] ) && isset( $attributes['listStyles'][0]['family'] ) ) {
			$list_font    = $attributes['listStyles'][0];
			$font_variant = ( isset( $list_font['variant'] ) && ! empty( $list_font['variant'] ) ? array( $list_font['variant'] ) : array() );
			$subset       = ( isset( $list_font['subset'] ) && ! empty( $list_font['subset'] ) ? array( $list_font['subset'] ) : array() );

			$css->maybe_add_google_font( $list_font['family'], $font_variant, $subset );
		}


		if ( isset( $attributes['listMargin'] ) && is_array( $attributes['listMargin'] ) && isset( $attributes['listMargin'][0] ) ) {
			$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ':not(.this-stops-third-party-issues)' );
			$css->add_property( 'margin-top', '0' );
		}

		$column_gap_props = array(
			'columnGap' => array(
				0 => ! empty( $attributes['columnGap'] ) ? $attributes['columnGap'] : '',
				1 => ! empty( $attributes['tabletColumnGap'] ) ? $attributes['tabletColumnGap'] : '',
				2 => ! empty( $attributes['mobileColumnGap'] ) ? $attributes['mobileColumnGap'] : '',
			)
		);

		$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list' );
		$css->render_measure_output( $attributes, 'listMargin', 'margin');
		$css->render_responsive_range( $column_gap_props, 'columnGap', 'column-gap' );


		$list_gap_props = array(
			'listGap' => array(
				0 => ! empty( $attributes['listGap'] ) ? $attributes['listGap'] : '',
				1 => ! empty( $attributes['tabletListGap'] ) ? $attributes['tabletListGap'] : '',
				2 => ! empty( $attributes['mobileListGap'] ) ? $attributes['mobileListGap'] : '',
			)
		);

		$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap:not(:last-child)' );
		$css->render_responsive_range( $list_gap_props, 'listGap', 'margin-bottom' );

		$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ':not(.kt-svg-icon-list-columns-1) ul.kt-svg-icon-list' );
		$css->render_responsive_range( $list_gap_props, 'listGap', 'grid-row-gap' );

		$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ':not(.kt-svg-icon-list-columns-1) ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap' );
		$css->add_property( 'margin', '0px' );

		$css->set_media_state( 'desktop' );



		if ( ! empty( $attributes['listLabelGap'] ) ) {
			$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap .kt-svg-icon-list-single' );
			$css->add_property( 'margin-right', $attributes['listLabelGap'] . 'px' );
		}
		if ( isset( $attributes['listStyles'] ) && is_array( $attributes['listStyles'] ) && is_array( $attributes['listStyles'][0] ) ) {
			$list_styles = $attributes['listStyles'][0];
			$css->set_selector( '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap, .kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap a' );
			if ( isset( $list_styles['color'] ) && ! empty( $list_styles['color'] ) ) {
				$css->add_property( 'color', $css->sanitize_color( $list_styles['color'] ) );
			}
			if ( isset( $list_styles['size'] ) && is_array( $list_styles['size'] ) && ! empty( $list_styles['size'][0] ) ) {
				$css->add_property( 'font-size', $list_styles['size'][0] . ( ! isset( $list_styles['sizeType'] ) ? 'px' : $list_styles['sizeType'] ) );
			}
			if ( isset( $list_styles['lineHeight'] ) && is_array( $list_styles['lineHeight'] ) && ! empty( $list_styles['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $list_styles['lineHeight'][0] . ( ! isset( $list_styles['lineType'] ) ? 'px' : $list_styles['lineType'] ) );
			}
			if ( isset( $list_styles['letterSpacing'] ) && ! empty( $list_styles['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $list_styles['letterSpacing'] . 'px' );
			}
			if ( isset( $list_styles['textTransform'] ) && ! empty( $list_styles['textTransform'] ) ) {
				$css->add_property( 'text-transform', $list_styles['textTransform'] );
			}
			if ( isset( $list_styles['family'] ) && ! empty( $list_styles['family'] ) ) {
				$css->add_property( 'font-family', $list_styles['family'] );
			}
			if ( isset( $list_styles['style'] ) && ! empty( $list_styles['style'] ) ) {
				$css->add_property( 'font-style', $list_styles['style'] );
			}
			if ( isset( $list_styles['weight'] ) && ! empty( $list_styles['weight'] ) ) {
				$css->add_property( 'font-weight', $list_styles['weight'] );
			}
		}

		if ( isset( $attributes['listStyles'] ) && is_array( $attributes['listStyles'] ) && isset( $attributes['listStyles'][0] ) && is_array( $attributes['listStyles'][0] ) && ( ( isset( $attributes['listStyles'][0]['size'] ) && is_array( $attributes['listStyles'][0]['size'] ) && isset( $attributes['listStyles'][0]['size'][1] ) && ! empty( $attributes['listStyles'][0]['size'][1] ) ) || ( isset( $attributes['listStyles'][0]['lineHeight'] ) && is_array( $attributes['listStyles'][0]['lineHeight'] ) && isset( $attributes['listStyles'][0]['lineHeight'][1] ) && ! empty( $attributes['listStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap, .kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap a' );
			if ( isset( $attributes['listStyles'][0]['size'][1] ) && ! empty( $attributes['listStyles'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attributes['listStyles'][0]['size'][1] . ( ! isset( $attributes['listStyles'][0]['sizeType'] ) ? 'px' : $attributes['listStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['listStyles'][0]['lineHeight'][1] ) && ! empty( $attributes['listStyles'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attributes['listStyles'][0]['lineHeight'][1] . ( ! isset( $attributes['listStyles'][0]['lineType'] ) ? 'px' : $attributes['listStyles'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}

		if ( isset( $attributes['listStyles'] ) && is_array( $attributes['listStyles'] ) && isset( $attributes['listStyles'][0] ) && is_array( $attributes['listStyles'][0] ) && ( ( isset( $attributes['listStyles'][0]['size'] ) && is_array( $attributes['listStyles'][0]['size'] ) && isset( $attributes['listStyles'][0]['size'][2] ) && ! empty( $attributes['listStyles'][0]['size'][2] ) ) || ( isset( $attributes['listStyles'][0]['lineHeight'] ) && is_array( $attributes['listStyles'][0]['lineHeight'] ) && isset( $attributes['listStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['listStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css->set_media_state( 'media' );

			$css->set_selector( '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap, .kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap a' );
			if ( isset( $attributes['listStyles'][0]['size'][2] ) && ! empty( $attributes['listStyles'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attributes['listStyles'][0]['size'][2] . ( ! isset( $attributes['listStyles'][0]['sizeType'] ) ? 'px' : $attributes['listStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['listStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['listStyles'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attributes['listStyles'][0]['lineHeight'][2] . ( ! isset( $attributes['listStyles'][0]['lineType'] ) ? 'px' : $attributes['listStyles'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}

		return $css->css_output();
	}

}

Kadence_Blocks_Iconlist_Block::get_instance();
