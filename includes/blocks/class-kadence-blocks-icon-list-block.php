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
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		if ( isset( $attributes['listStyles'] ) && is_array( $attributes['listStyles'] ) && isset( $attributes['listStyles'][0] ) && is_array( $attributes['listStyles'][0] ) && isset( $attributes['listStyles'][0]['google'] ) && $attributes['listStyles'][0]['google'] && ( ! isset( $attributes['listStyles'][0]['loadGoogle'] ) || true === $attributes['listStyles'][0]['loadGoogle'] ) && isset( $attributes['listStyles'][0]['family'] ) ) {
			$list_font    = $attributes['listStyles'][0];
			$font_variant = ( isset( $list_font['variant'] ) && ! empty( $list_font['variant'] ) ? $list_font['variant'] : null );
			$subset       = ( isset( $list_font['subset'] ) && ! empty( $list_font['subset'] ) ? $list_font['subset'] : null );

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
			),
		);

		$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list:not(.this-prevents-issues):not(.this-stops-third-party-issues):not(.tijsloc)' );
		$css->render_measure_output( $attributes, 'listMargin', 'margin' );
		$css->render_measure_output( $attributes, 'listPadding', 'padding' );
		$css->render_responsive_range( $column_gap_props, 'columnGap', 'column-gap' );

		$list_gap_props = array(
			'listGap' => array(
				0 => ! empty( $attributes['listGap'] ) ? $attributes['listGap'] : '5',
				1 => ! empty( $attributes['tabletListGap'] ) ? $attributes['tabletListGap'] : ( ! empty( $attributes['listGap'] ) ? $attributes['listGap'] : '' ),
				2 => ! empty( $attributes['mobileListGap'] ) ? $attributes['mobileListGap'] : ( ! empty( $attributes['tabletListGap'] ) ? $attributes['tabletListGap'] : ( ! empty( $attributes['listGap'] ) ? $attributes['listGap'] : '' ) ),
			),
		);

		$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list' );
		$css->render_responsive_range( $list_gap_props, 'listGap', 'grid-row-gap' );

		if ( ! empty( $attributes['columns'] ) && abs( $attributes['columns'] ) > 1 ) {
			$css->set_media_state( 'desktopOnly' );
			$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ':not(.kt-svg-icon-list-columns-1) ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap:not(:last-child)' );
			$css->add_property( 'margin', '0px' );
		}
		if ( ( ! empty( $attributes['tabletColumns'] ) && abs( $attributes['tabletColumns'] ) > 1 ) || ( empty( $attributes['tabletColumns'] ) && ! empty( $attributes['columns'] ) && abs( $attributes['columns'] ) > 1 ) ) {
			$css->set_media_state( 'tabletOnly' );
			$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ':not(.kt-tablet-svg-icon-list-columns-1) ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap:not(:last-child)' );
			$css->add_property( 'margin', '0px' );
		}
		if ( ( ! empty( $attributes['mobileColumns'] ) && abs( $attributes['mobileColumns'] ) > 1 ) || ( empty( $attributes['mobileColumns'] ) && ! empty( $attributes['tabletColumns'] ) && abs( $attributes['tabletColumns'] ) > 1 ) || ( empty( $attributes['tabletColumns'] ) && empty( $attributes['mobileColumns'] ) && ! empty( $attributes['columns'] ) && abs( $attributes['columns'] ) > 1 ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ':not(.kt-mobile-svg-icon-list-columns-1) ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap:not(:last-child)' );
			$css->add_property( 'margin', '0px' );
		}

		$css->set_media_state( 'desktop' );

		$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' .kb-svg-icon-wrap' );
		$css->render_responsive_range( $attributes, 'iconSize', 'font-size');
		if ( ! empty( $attributes['color'] ) ) {
			$css->add_property( 'color', $css->sanitize_color( $attributes['color'] ) );
		}

		if ( ! empty( $attributes['listLabelGap'] ) ) {
			$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap .kt-svg-icon-list-single' );

			if( is_rtl() ){
				$css->add_property( 'margin-left', $attributes['listLabelGap'] . 'px' );
			} else {
				$css->add_property( 'margin-right', $attributes['listLabelGap'] . 'px' );
			}
		}
		if ( isset( $attributes['listStyles'] ) && is_array( $attributes['listStyles'] ) && is_array( $attributes['listStyles'][0] ) ) {
			$list_styles = $attributes['listStyles'][0];
			$css->set_selector( '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap, .kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-item-wrap a' );
			if ( isset( $list_styles['color'] ) && ! empty( $list_styles['color'] ) ) {
				$css->add_property( 'color', $css->sanitize_color( $list_styles['color'] ) );
			}
			$css->render_typography( $attributes, 'listStyles' );
		}

		// Support SVG sizes for icon lists made pre-3.0 that have not been updated
		if( ! empty( $attributes['items'] ) && is_array( $attributes['items'] ) ) {
			foreach( $attributes['items'] as $level => $item ) {
				if( isset( $item['size'] ) && is_numeric( $item['size'] ) ) {
					$css->set_selector( '.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-level-' . $level . ' .kt-svg-icon-list-single svg' );
					$css->add_property( 'font-size', $item['size'] . 'px' );
				}
			}
		}

		/* Stacked display style */
		if( isset( $attributes['style'] ) && $attributes['style'] === 'stacked' ) {
			$css->set_selector( '.wp-block-kadence-iconlist.kt-svg-icon-list-items' . $unique_id . ' ul.kt-svg-icon-list .kt-svg-icon-list-single' );

			if( isset( $attributes['background'] )) {
				$css->add_property( 'background-color', $css->sanitize_color( $attributes['background'] ) );
			}

			if( isset( $attributes['borderRadius'] ) ){
				$css->add_property( 'border-radius',  $attributes['borderRadius'] . '%' );
			}

			if( isset( $attributes['border'] )) {
				$css->add_property( 'border-color',  $css->sanitize_color( $attributes['border'] ) );
			}

			if( isset( $attributes['borderWidth'] ) ) {
				$css->add_property( 'border-width',  $attributes['borderWidth'] . 'px' );
			}
			$css->add_property( 'border-style',  'solid' );

			if( isset( $attributes['padding'] ) ) {
				$css->add_property( 'padding',  $attributes['padding'] . 'px' );
			}
		}
		return $css->css_output();
	}

}

Kadence_Blocks_Iconlist_Block::get_instance();
