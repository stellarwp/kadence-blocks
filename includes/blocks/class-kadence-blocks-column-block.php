<?php
/**
 * Class to Build the Column Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Column Block.
 *
 * @category class
 */
class Kadence_Blocks_Column_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'column';

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
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		// Style.
		if ( ! empty( $attributes['maxWidth'][0] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attributes['maxWidth'][0] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
			//Section inside Section compatablity.
			// $css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			// $css->add_property( 'flex', '1 ' . $attributes['maxWidth'][0] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column.kb-section-dir-horizontal>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '0 1 ' . $attributes['maxWidth'][0] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'max-width', 'unset' );
			$css->add_property( 'margin-left', 'unset' );
			$css->add_property( 'margin-right', 'unset' );
		}
		// Margin, check old first.
		if ( $css->is_number( $attributes['topMargin'] ) || $css->is_number( $attributes['bottomMargin'] ) || $css->is_number( $attributes['rightMargin'] ) || $css->is_number( $attributes['leftMargin'] ) || $css->is_number( $attributes['topMarginT'] ) || $css->is_number( $attributes['bottomMarginT'] ) || $css->is_number( $attributes['rightMarginT'] ) || $css->is_number( $attributes['leftMarginT'] ) || $css->is_number( $attributes['topMarginM'] ) || $css->is_number( $attributes['bottomMarginM'] ) || $css->is_number( $attributes['rightMarginM'] ) || $css->is_number( $attributes['leftMarginM'] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( $css->is_number( $attributes['topMargin'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMargin'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomMargin'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMargin'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['rightMargin'] ) ) {
				$css->add_property( 'margin-right', $attributes['rightMargin'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['leftMargin'] ) ) {
				$css->add_property( 'margin-left', $attributes['leftMargin'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			$css->set_media_state( 'tablet' );
			if ( $css->is_number( $attributes['topMarginT'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMarginT'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomMarginT'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMarginT'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['rightMarginT'] ) ) {
				$css->add_property( 'margin-right', $attributes['rightMarginT'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['leftMarginT'] ) ) {
				$css->add_property( 'margin-left', $attributes['leftMarginT'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			$css->set_media_state( 'mobile' );
			if ( $css->is_number( $attributes['topMarginM'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMarginM'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomMarginM'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMarginM'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['rightMarginM'] ) ) {
				$css->add_property( 'margin-right', $attributes['rightMarginM'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['leftMarginM'] ) ) {
				$css->add_property( 'margin-left', $attributes['leftMarginM'] . ( ! empty( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		} else {
			// New margin intentially targets outer container, improvement and don't have to worry about issues with row layout.
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->render_measure_output(
				$attributes,
				'margin',
				'margin',
				array(
					'unit_key' => 'marginType',
				)
			);
		}
		if ( ! empty( $attributes['sticky'] ) && true === $attributes['sticky'] ) {
			$css->set_selector( '#wrapper.site' );
			$css->add_property( 'overflow', 'clip' );
			if ( ! empty( $attributes['stickyOffset'][0] ) ) {
				$css->set_selector( '.kadence-column' . $unique_id );
				$css->add_property( '--kb-section-setting-offset', $attributes['stickyOffset'][0] . ( isset( $attributes['stickyOffsetUnit'] ) ? $attributes['stickyOffsetUnit'] : 'px' ) );
			}
		}
		if ( ! empty( $attributes['stickyOffset'][1] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( '--kb-section-setting-offset', $attributes['stickyOffset'][1] . ( isset( $attributes['stickyOffsetUnit'] ) ? $attributes['stickyOffsetUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		if ( ! empty( $attributes['stickyOffset'][2] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( '--kb-section-setting-offset', $attributes['stickyOffset'][2] . ( isset( $attributes['stickyOffsetUnit'] ) ? $attributes['stickyOffsetUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		if ( ! empty( $attributes['sticky'] ) && true === $attributes['sticky'] ) {
			$css->set_selector( '#wrapper.site' );
			$css->add_property( 'overflow', 'clip' );
			if ( ! empty( $attributes['stickyOffset'][0] ) ) {
				$css->set_selector( '.kadence-column' . $unique_id );
				$css->add_property( '--kb-section-setting-offset', $attributes['stickyOffset'][0] . ( isset( $attributes['stickyOffsetUnit'] ) ? $attributes['stickyOffsetUnit'] : 'px' ) );
			}
		}
		if ( ! empty( $attributes['stickyOffset'][1] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( '--kb-section-setting-offset', $attributes['stickyOffset'][1] . ( isset( $attributes['stickyOffsetUnit'] ) ? $attributes['stickyOffsetUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		if ( ! empty( $attributes['stickyOffset'][2] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( '--kb-section-setting-offset', $attributes['stickyOffset'][2] . ( isset( $attributes['stickyOffsetUnit'] ) ? $attributes['stickyOffsetUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}

		$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
		// Padding, check old first.
		if ( $css->is_number( $attributes['topPadding'] ) || $css->is_number( $attributes['bottomPadding'] ) || $css->is_number( $attributes['leftPadding'] ) || $css->is_number( $attributes['rightPadding'] ) || $css->is_number( $attributes['topPaddingT'] ) || $css->is_number( $attributes['bottomPaddingT'] ) || $css->is_number( $attributes['leftPaddingT'] ) || $css->is_number( $attributes['rightPaddingT'] ) || $css->is_number( $attributes['topPaddingM'] ) || $css->is_number( $attributes['bottomPaddingM'] ) || $css->is_number( $attributes['leftPaddingM'] ) || $css->is_number( $attributes['rightPaddingM'] ) ) {
			if ( $css->is_number( $attributes['topPadding'] ) ) {
				$css->add_property( 'padding-top', $attributes['topPadding'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomPadding'] ) ) {
				$css->add_property( 'padding-bottom', $attributes['bottomPadding'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['leftPadding'] ) ) {
				$css->add_property( 'padding-left', $attributes['leftPadding'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['rightPadding'] ) ) {
				$css->add_property( 'padding-right', $attributes['rightPadding'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			$css->set_media_state( 'tablet' );
			if ( $css->is_number( $attributes['topPaddingT'] ) ) {
				$css->add_property( 'padding-top', $attributes['topPaddingT'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomPaddingT'] ) ) {
				$css->add_property( 'padding-bottom', $attributes['bottomPaddingT'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['leftPaddingT'] ) ) {
				$css->add_property( 'padding-left', $attributes['leftPaddingT'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['rightPaddingT'] ) ) {
				$css->add_property( 'padding-right', $attributes['rightPaddingT'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			$css->set_media_state( 'mobile' );
			if ( $css->is_number( $attributes['topPaddingM'] ) ) {
				$css->add_property( 'padding-top', $attributes['topPaddingM'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomPaddingM'] ) ) {
				$css->add_property( 'padding-bottom', $attributes['bottomPaddingM'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['leftPaddingM'] ) ) {
				$css->add_property( 'padding-left', $attributes['leftPaddingM'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['rightPaddingM'] ) ) {
				$css->add_property( 'padding-right', $attributes['rightPaddingM'] . ( ! empty( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		} else {
			$css->render_measure_output(
				$attributes,
				'padding',
				'padding',
				array(
					'unit_key' => 'paddingType',
				)
			);
		}
		$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
		if ( $css->is_number( $attributes['height'][0] ) ) {
			$css->add_property( 'min-height', $attributes['height'][0] . ( ! empty( $attributes['heightUnit'] ) ? $attributes['heightUnit'] : 'px' ) );
		}
		$css->set_media_state( 'tablet' );
		if ( $css->is_number( $attributes['height'][1] ) ) {
			$css->add_property( 'min-height', $attributes['height'][1] . ( ! empty( $attributes['heightUnit'] ) ? $attributes['heightUnit'] : 'px' ) );
		}
		$css->set_media_state( 'mobile' );
		if ( $css->is_number( $attributes['height'][2] ) ) {
			$css->add_property( 'min-height', $attributes['height'][2] . ( ! empty( $attributes['heightUnit'] ) ? $attributes['heightUnit'] : 'px' ) );
		}
		$css->set_media_state( 'desktop' );
		if ( isset( $attributes['displayShadow'] ) && true == $attributes['displayShadow'] ) {
			if ( isset( $attributes['shadow'] ) && is_array( $attributes['shadow'] ) && isset( $attributes['shadow'][0] ) && is_array( $attributes['shadow'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadow'][0]['inset'] ) && true === $attributes['shadow'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadow'][0]['hOffset'] ) && is_numeric( $attributes['shadow'][0]['hOffset'] ) ? $attributes['shadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadow'][0]['vOffset'] ) && is_numeric( $attributes['shadow'][0]['vOffset'] ) ? $attributes['shadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadow'][0]['blur'] ) && is_numeric( $attributes['shadow'][0]['blur'] ) ? $attributes['shadow'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadow'][0]['spread'] ) && is_numeric( $attributes['shadow'][0]['spread'] ) ? $attributes['shadow'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadow'][0]['color'] ) && ! empty( $attributes['shadow'][0]['color'] ) ? $attributes['shadow'][0]['color'] : '#000000' ), ( isset( $attributes['shadow'][0]['opacity'] ) && is_numeric( $attributes['shadow'][0]['opacity'] ) ? $attributes['shadow'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
			}
		}
		// Border, check old first.
		if ( ! empty( $attributes['border'] ) || $css->is_number( $attributes['borderWidth'][0] ) || $css->is_number( $attributes['borderWidth'][1] ) || $css->is_number( $attributes['borderWidth'][2] ) || $css->is_number( $attributes['borderWidth'][3] ) || $css->is_number( $attributes['tabletBorderWidth'][0] ) || $css->is_number( $attributes['tabletBorderWidth'][1] ) || $css->is_number( $attributes['tabletBorderWidth'][2] ) || $css->is_number( $attributes['tabletBorderWidth'][3] ) || $css->is_number( $attributes['mobileBorderWidth'][0] ) || $css->is_number( $attributes['mobileBorderWidth'][1] ) || $css->is_number( $attributes['mobileBorderWidth'][2] ) || $css->is_number( $attributes['mobileBorderWidth'][3] ) ) {
			if ( ! empty( $attributes['border'] ) ) {
				$alpha = ( isset( $attributes['borderOpacity'] ) && is_numeric( $attributes['borderOpacity'] ) ? $attributes['borderOpacity'] : 1 );
				$css->add_property( 'border-color', $css->render_color( $attributes['border'], $alpha ) );
			}
			$css->render_measure_output( $attributes, 'borderWidth', 'border-width' );
		} else {
			$css->render_border_styles( $attributes, 'borderStyle' );
		}
		$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col,.kadence-column' . $unique_id . ' > .kt-inside-inner-col:before' );
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array( 'unit_key' => 'borderRadiusUnit' ) );
		// Border Hover Styles, check old first.
		$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
		if ( ! empty( $attributes['borderHover'] ) || $css->is_number( $attributes['borderHoverWidth'][0] ) || $css->is_number( $attributes['borderHoverWidth'][1] ) || $css->is_number( $attributes['borderHoverWidth'][2] ) || $css->is_number( $attributes['borderHoverWidth'][3] ) || $css->is_number( $attributes['tabletBorderHoverWidth'][0] ) || $css->is_number( $attributes['tabletBorderHoverWidth'][1] ) || $css->is_number( $attributes['tabletBorderHoverWidth'][2] ) || $css->is_number( $attributes['tabletBorderHoverWidth'][3] ) || $css->is_number( $attributes['mobileBorderHoverWidth'][0] ) || $css->is_number( $attributes['mobileBorderHoverWidth'][1] ) || $css->is_number( $attributes['mobileBorderHoverWidth'][2] ) || $css->is_number( $attributes['mobileBorderHoverWidth'][3] ) ) {
			if ( ! empty( $attributes['borderHover'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attributes['borderHover'] ) );
			}
			$css->render_measure_output( $attributes, 'borderHoverWidth', 'border-width' );
		} else {
			$css->render_border_styles( $attributes, 'borderHoverStyle' );
		}
		$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col,.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
		$css->render_measure_output( $attributes, 'borderHoverRadius', 'border-radius', array( 'unit_key' => 'borderHoverRadiusUnit' ) );
		if ( isset( $attributes['displayHoverShadow'] ) && true == $attributes['displayHoverShadow'] ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
			if ( isset( $attributes['shadowHover'] ) && is_array( $attributes['shadowHover'] ) && isset( $attributes['shadowHover'][0] ) && is_array( $attributes['shadowHover'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadowHover'][0]['inset'] ) && true === $attributes['shadowHover'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadowHover'][0]['hOffset'] ) && is_numeric( $attributes['shadowHover'][0]['hOffset'] ) ? $attributes['shadowHover'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['vOffset'] ) && is_numeric( $attributes['shadowHover'][0]['vOffset'] ) ? $attributes['shadowHover'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['blur'] ) && is_numeric( $attributes['shadowHover'][0]['blur'] ) ? $attributes['shadowHover'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['spread'] ) && is_numeric( $attributes['shadowHover'][0]['spread'] ) ? $attributes['shadowHover'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadowHover'][0]['color'] ) && ! empty( $attributes['shadowHover'][0]['color'] ) ? $attributes['shadowHover'][0]['color'] : '#000000' ), ( isset( $attributes['shadowHover'][0]['opacity'] ) && is_numeric( $attributes['shadowHover'][0]['opacity'] ) ? $attributes['shadowHover'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
			}
		}
		// Direction Styles.
		$desktop_direction = ( isset( $attributes['direction'] ) && is_array( $attributes['direction'] ) && ! empty( $attributes['direction'][0] ) ? $attributes['direction'][0] : 'vertical' );
		if ( $desktop_direction === 'horizontal' ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$css->add_property( 'display', 'flex' );
			$css->add_property( 'flex-direction', 'row' );
			$css->add_property( 'flex-wrap', 'wrap' );
			$align = ! empty( $attributes['verticalAlignment'] ) ? $attributes['verticalAlignment'] : 'center';
			switch ( $align ) {
				case 'top':
					$align = 'flex-start';
					break;
				case 'bottom':
					$align = 'flex-end';
					break;
				default:
					$align = 'center';
					break;
			}
			$css->add_property( 'align-items', $align );
			if ( isset( $attributes['justifyContent'] ) && is_array( $attributes['justifyContent'] ) && ! empty( $attributes['justifyContent'][0] ) ) {
				$css->add_property( 'justify-content', $attributes['justifyContent'][0] );
			} else if ( isset( $attributes['textAlign'] ) && is_array( $attributes['textAlign'] ) && ! empty( $attributes['textAlign'][0] ) ) {
				switch ( $attributes['textAlign'][0] ) {
					case 'left':
						$justify = 'flex-start';
						break;
					case 'right':
						$justify = 'flex-end';
						break;
					default:
						$justify = 'center';
						break;
				}
				$css->add_property( 'justify-content', $justify );
			}
			if ( isset( $attributes['wrapContent'] ) && is_array( $attributes['wrapContent'] ) && ! empty( $attributes['wrapContent'][0] ) ) {
				$css->add_property( 'flex-wrap', $attributes['wrapContent'][0] );
			}
			$gutter      = isset( $attributes['gutter'] ) && is_array( $attributes['gutter'] ) && isset( $attributes['gutter'][0] ) && is_numeric( $attributes['gutter'][0] ) ? $attributes['gutter'][0] : 10;
			$gutter_unit = ! empty( $attributes['gutterUnit'] ) ? $attributes['gutterUnit'] : 'px';
			$css->add_property( 'gap', $gutter . $gutter_unit );
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > *, .kadence-column' . $unique_id . ' > .kt-inside-inner-col > figure.wp-block-image, .kadence-column' . $unique_id . ' > .kt-inside-inner-col > figure.wp-block-kadence-image' );
			$css->add_property( 'margin-top', '0px' );
			$css->add_property( 'margin-bottom', '0px' );
		} else {
			if ( ! empty( $attributes['verticalAlignment'] ) ) {
				switch ( $attributes['verticalAlignment'] ) {
					case 'top':
						$align = 'flex-start';
						break;
					case 'bottom':
						$align = 'flex-end';
						break;
					default:
						$align = 'center';
						break;
				}
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'justify-content', $align );
				$css->add_property( 'flex-direction', 'column' );
				$css->add_property( 'display', 'flex' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > .aligncenter' );
				$css->add_property( 'width', '100%' );
			}
		}
		// inside of Row.
		if ( ! empty( $attributes['verticalAlignment'] ) ) {
			switch ( $attributes['verticalAlignment'] ) {
				case 'top':
					$align = 'flex-start';
					break;
				case 'bottom':
					$align = 'flex-end';
					break;
				default:
					$align = 'center';
					break;
			}
			$css->set_selector( '.kt-row-column-wrap > .kadence-column' . $unique_id );
			$css->add_property( 'align-self', $align );
			$css->set_selector( '.kt-inner-column-height-full:not(.kt-has-1-columns) > .wp-block-kadence-column.kadence-column' . $unique_id );
			$css->add_property( 'align-self', 'auto' );
			$css->set_selector( '.kt-inner-column-height-full:not(.kt-has-1-columns) > .wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$css->add_property( 'display', 'flex' );
			$css->add_property( 'flex-direction', 'column' );
			$css->add_property( 'justify-content', $align );
		}
		// Background.
		$background_type = ! empty( $attributes['backgroundType'] ) ? $attributes['backgroundType'] : 'normal';
		$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
		switch ( $background_type ) {
			case 'normal':
				if ( ! empty( $attributes['background'] ) ) {
					$alpha = ( $css->is_number( $attributes['backgroundOpacity'] ) ? $attributes['backgroundOpacity'] : 1 );
					$css->add_property( 'background-color', $css->render_color( $attributes['background'], $alpha ) );
				}
				if ( ! empty( $attributes['backgroundImg'][0]['bgImg'] ) ) {
					$css->add_property( 'background-image', sprintf( "url('%s')", $attributes['backgroundImg'][0]['bgImg'] ) );
					$css->add_property( 'background-size', ( isset( $attributes['backgroundImg'][0]['bgImgSize'] ) ? $attributes['backgroundImg'][0]['bgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( isset( $attributes['backgroundImg'][0]['bgImgPosition'] ) ? $attributes['backgroundImg'][0]['bgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', ( isset( $attributes['backgroundImg'][0]['bgImgAttachment'] ) ? $attributes['backgroundImg'][0]['bgImgAttachment'] : 'scroll' ) );
					$css->add_property( 'background-repeat', ( isset( $attributes['backgroundImg'][0]['bgImgRepeat'] ) ? $attributes['backgroundImg'][0]['bgImgRepeat'] : 'no-repeat' ) );
				}
				break;
			case 'gradient':
				if ( ! empty( $attributes['gradient'] ) ) {
					$css->add_property( 'background-image', $attributes['gradient'] );
				}
				break;
		}
		// Background Hover.
		$hover_type = ! empty( $attributes['backgroundHoverType'] ) ? $attributes['backgroundHoverType'] : 'normal';
		$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
		switch ( $hover_type ) {
			case 'normal':
				if ( ! empty( $attributes['backgroundHover'] ) ) {
					$css->render_color_output( $attributes, 'backgroundHover', 'background-color' );
				}
				if ( ! empty( $attributes['backgroundImgHover'][0]['bgImg'] ) ) {
					$css->add_property( 'background-image', sprintf( "url('%s')", $attributes['backgroundImgHover'][0]['bgImg'] ) );
					$css->add_property( 'background-size', ( isset( $attributes['backgroundImgHover'][0]['bgImgSize'] ) ? $attributes['backgroundImgHover'][0]['bgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( isset( $attributes['backgroundImgHover'][0]['bgImgPosition'] ) ? $attributes['backgroundImgHover'][0]['bgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', ( isset( $attributes['backgroundImgHover'][0]['bgImgAttachment'] ) ? $attributes['backgroundImgHover'][0]['bgImgAttachment'] : 'scroll' ) );
					$css->add_property( 'background-repeat', ( isset( $attributes['backgroundImgHover'][0]['bgImgRepeat'] ) ? $attributes['backgroundImgHover'][0]['bgImgRepeat'] : 'no-repeat' ) );
				}
				break;
			case 'gradient':
				if ( ! empty( $attributes['gradientHover'] ) ) {
					$css->add_property( 'background-image', $attributes['gradientHover'] );
				}
				break;
		}
		// Overlay.
		$overlay_type = ! empty( $attributes['overlayType'] ) ? $attributes['overlayType'] : 'normal';
		$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col:before' );
		if ( $css->is_number( $attributes['overlayOpacity'] ) ) {
			$css->add_property( 'opacity', $attributes['overlayOpacity'] );
		}
		if ( ! empty( $attributes['overlayBlendMode'] ) ) {
			$css->add_property( 'mix-blend-mode', $attributes['overlayBlendMode'] );
		}
		switch ( $overlay_type ) {
			case 'normal':
				if ( ! empty( $attributes['overlay'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $attributes['overlay'] ) );
				}
				if ( ! empty( $attributes['overlayImg'][0]['bgImg'] ) ) {
					$bg_img = $attributes['overlayImg'][0];
					$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img['bgImg'] ) );
					$css->add_property( 'background-size', ( ! empty( $bg_img['bgImgSize'] ) ? $bg_img['bgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( ! empty( $bg_img['bgImgPosition'] ) ? $bg_img['bgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', ( ! empty( $bg_img['bgImgAttachment'] ) ? $bg_img['bgImgAttachment'] : 'scroll' ) );
					$css->add_property( 'background-repeat', ( ! empty( $bg_img['bgImgRepeat'] ) ? $bg_img['bgImgRepeat'] : 'no-repeat' ) );
				}
				break;
			case 'gradient':
				if ( ! empty( $attributes['overlayGradient'] ) ) {
					$css->add_property( 'background-image', $attributes['overlayGradient'] );
				}
				break;
		}
		// Overlay Hover.
		$overlay_hover_type = ! empty( $attributes['overlayHoverType'] ) ? $attributes['overlayHoverType'] : 'normal';
		$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
		if ( $css->is_number( $attributes['overlayHoverOpacity'] ) ) {
			$css->add_property( 'opacity', $attributes['overlayHoverOpacity'] );
		}
		if ( ! empty( $attributes['hoverOverlayBlendMode'] ) ) {
			$css->add_property( 'mix-blend-mode', $attributes['hoverOverlayBlendMode'] );
		}
		switch ( $overlay_hover_type ) {
			case 'normal':
				if ( ! empty( $attributes['overlayHover'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $attributes['overlayHover'] ) );
				}
				if ( ! empty( $attributes['overlayImgHover'][0]['bgImg'] ) ) {
					$bg_img_hover = $attributes['overlayImgHover'][0];
					$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
					$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img_hover['bgImg'] ) );
					$css->add_property( 'background-size', ( ! empty( $bg_img_hover['bgImgSize'] ) ? $bg_img_hover['bgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( ! empty( $bg_img_hover['bgImgPosition'] ) ? $bg_img_hover['bgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', ( ! empty( $bg_img_hover['bgImgAttachment'] ) ? $bg_img_hover['bgImgAttachment'] : 'scroll' ) );
					$css->add_property( 'background-repeat', ( ! empty( $bg_img_hover['bgImgRepeat'] ) ? $bg_img_hover['bgImgRepeat'] : 'no-repeat' ) );
				}
			case 'gradient':
				if ( ! empty( $attributes['overlayGradientHover'] ) ) {
					$css->add_property( 'background-image', $attributes['overlayGradientHover'] );
				}
				break;
		}
		// Align.
		if ( isset( $attributes['textAlign'] ) && is_array( $attributes['textAlign'] ) && isset( $attributes['textAlign'][0] ) && ! empty( $attributes['textAlign'][0] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'text-align', $attributes['textAlign'][0] );
		}
		// Text Colors.
		if ( isset( $attributes['textColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ', .kadence-column' . $unique_id . ' h1, .kadence-column' . $unique_id . ' h2, .kadence-column' . $unique_id . ' h3, .kadence-column' . $unique_id . ' h4, .kadence-column' . $unique_id . ' h5, .kadence-column' . $unique_id . ' h6' );
			$css->add_property( 'color', $css->render_color( $attributes['textColor'] ) );
		}
		if ( isset( $attributes['linkColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a' );
			$css->add_property( 'color', $css->render_color( $attributes['linkColor'] ) );
		}
		if ( isset( $attributes['linkHoverColor'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a:hover' );
			$css->add_property( 'color', $css->render_color( $attributes['linkHoverColor'] ) );
		}
		// Hover Text colors.
		if ( isset( $attributes['textColorHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover, .kadence-column' . $unique_id . ' h1, .kadence-column' . $unique_id . ' h2, .kadence-column' . $unique_id . ' h3, .kadence-column' . $unique_id . ' h4, .kadence-column' . $unique_id . ' h5, .kadence-column' . $unique_id . ' h6' );
			$css->add_property( 'color', $css->render_color( $attributes['textColorHover'] ) );
		}
		if ( isset( $attributes['linkColorHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover a' );
			$css->add_property( 'color', $css->render_color( $attributes['linkColorHover'] ) );
		}
		if ( isset( $attributes['linkHoverColorHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover a:hover' );
			$css->add_property( 'color', $css->render_color( $attributes['linkHoverColorHover'] ) );
		}
		if ( isset( $attributes['zIndex'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			if ( $attributes['zIndex'] === 0 ) {
				$css->add_property( 'z-index', 'auto' );
			} else {
				$css->add_property( 'z-index', $attributes['zIndex'] );
			}
			$css->set_selector( 'div:not(.kt-inside-inner-col) > .kadence-column' . $unique_id );
			$css->add_property( 'position', 'relative' );
		}
		$css->set_media_state( 'tablet' );
		if ( ! empty( $attributes['maxWidth'][1] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attributes['maxWidth'][1] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '1 ' . $attributes['maxWidth'][1] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
		}
		if ( isset( $attributes['collapseOrder'] ) ) {
			$css->set_selector( '.kt-row-column-wrap.kt-tab-layout-three-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-tab-layout-two-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-tab-layout-row > .kadence-column' . $unique_id );
			$css->add_property( 'order', $attributes['collapseOrder'] );
		}
		if ( isset( $attributes['textAlign'] ) && is_array( $attributes['textAlign'] ) && isset( $attributes['textAlign'][1] ) && ! empty( $attributes['textAlign'][1] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'text-align', $attributes['textAlign'][1] );
		}
		$tablet_direction = ( isset( $attributes['direction'] ) && is_array( $attributes['direction'] ) && ! empty( $attributes['direction'][1] ) ? $attributes['direction'][1] : '' );
		if ( empty( $tablet_direction ) ) {
			$tablet_direction = ( isset( $attributes['direction'] ) && is_array( $attributes['direction'] ) && ! empty( $attributes['direction'][0] ) ? $attributes['direction'][0] : '' );
		}
		if ( 'vertical' === $tablet_direction ) {
			// If desktop horizonal remove margin.
			if ( $desktop_direction === 'horizontal' ) {
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'display', 'block' );
				$css->add_property( 'margin-left', '0px' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > *' );
				$css->add_property( 'margin-left', '0px' );;
			}
		} elseif ( 'horizontal' === $tablet_direction ) {
			if ( $desktop_direction === 'vertical' && ! empty( $attributes['verticalAlignment'] ) ) {
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'justify-content', 'inherit' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > .aligncenter' );
				$css->add_property( 'width', 'auto' );
			}
			// If desktop vertical lets add the horizontal css.
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attributes['direction'] ) && is_array( $attributes['direction'] ) && ! empty( $attributes['direction'][0] ) && $attributes['direction'][0] === 'vertical' ) {
				$css->add_property( 'display', 'flex' );
				$css->add_property( 'flex-direction', 'row' );
				$css->add_property( 'flex-wrap', 'wrap' );
				$align = ! empty( $attributes['verticalAlignment'] ) ? $attributes['verticalAlignment'] : 'center';
				switch ( $align ) {
					case 'top':
						$align = 'flex-start';
						break;
					case 'bottom':
						$align = 'flex-end';
						break;
					default:
						$align = 'center';
						break;
				}
				$css->add_property( 'align-items', $align );
			}
			if ( isset( $attributes['justifyContent'] ) && is_array( $attributes['justifyContent'] ) && ! empty( $attributes['justifyContent'][1] ) ) {
				$css->add_property( 'justify-content', $attributes['justifyContent'][1] );
			} else if ( isset( $attributes['textAlign'] ) && is_array( $attributes['textAlign'] ) && ! empty( $attributes['textAlign'][1] ) ) {
				switch ( $attributes['textAlign'][1] ) {
					case 'left':
						$justify = 'flex-start';
						break;
					case 'right':
						$justify = 'flex-end';
						break;
					default:
						$justify = 'center';
						break;
				}
				$css->add_property( 'justify-content', $justify );
			}
			if ( isset( $attributes['wrapContent'] ) && is_array( $attributes['wrapContent'] ) && ! empty( $attributes['wrapContent'][1] ) ) {
				$css->add_property( 'flex-wrap', $attributes['wrapContent'][1] );
			}
			$gutter      = isset( $attributes['gutter'] ) && is_array( $attributes['gutter'] ) && isset( $attributes['gutter'][1] ) && is_numeric( $attributes['gutter'][1] ) ? $attributes['gutter'][1] : '';
			$gutter_unit = ! empty( $attributes['gutterUnit'] ) ? $attributes['gutterUnit'] : 'px';
			if ( '' !== $gutter ) {
				$css->add_property( 'gap', $gutter . $gutter_unit );
			}
		}
		$css->set_media_state( 'mobile' );
		if ( ! empty( $attributes['maxWidth'][2] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ', .wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attributes['maxWidth'][2] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
			$css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '1 ' . $attributes['maxWidth'][2] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column.kb-section-sm-dir-horizontal>.kt-inside-inner-col>.kadence-column' . $unique_id . ', .wp-block-kadence-column.kb-section-dir-horizontal:not(.kb-section-sm-dir-vertical):not(.kb-section-md-dir-vertical) >.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '0 1 ' . $attributes['maxWidth'][2] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'max-width', 'unset' );
			$css->add_property( 'margin-left', 'unset' );
			$css->add_property( 'margin-right', 'unset' );
		} else if ( ! empty( $attributes['maxWidth'][1] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attributes['maxWidth'][1] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
		} else if ( ! empty( $attributes['maxWidth'][0] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attributes['maxWidth'][0] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
		}
		if ( isset( $attributes['collapseOrder'] ) ) {
			$css->set_selector( '.kt-row-column-wrap.kt-mobile-layout-three-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-mobile-layout-two-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-mobile-layout-row > .kadence-column' . $unique_id );
			$css->add_property( 'order', $attributes['collapseOrder'] );
		}
		if ( isset( $attributes['textAlign'] ) && is_array( $attributes['textAlign'] ) && isset( $attributes['textAlign'][2] ) && ! empty( $attributes['textAlign'][2] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'text-align', $attributes['textAlign'][2] );
		}
		$mobile_direction = ( isset( $attributes['direction'] ) && is_array( $attributes['direction'] ) && ! empty( $attributes['direction'][2] ) ? $attributes['direction'][2] : '' );
		if ( empty( $mobile_direction ) ) {
			$mobile_direction = ( isset( $attributes['direction'] ) && is_array( $attributes['direction'] ) && ! empty( $attributes['direction'][1] ) ? $attributes['direction'][1] : '' );
		}
		if ( empty( $mobile_direction ) ) {
			$mobile_direction = ( isset( $attributes['direction'] ) && is_array( $attributes['direction'] ) && ! empty( $attributes['direction'][0] ) ? $attributes['direction'][0] : '' );
		}
		if ( 'vertical' === $mobile_direction ) {
			// If desktop horizonal remove margin.
			if ( $desktop_direction === 'horizontal' || $tablet_direction === 'horizontal' ) {
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'display', 'block' );
				$css->add_property( 'margin-left', '0px' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > *' );
				$css->add_property( 'margin-left', '0px' );;
			}
		} elseif ( 'horizontal' === $mobile_direction ) {
			if ( $desktop_direction === 'vertical' && ! empty( $attributes['verticalAlignment'] ) ) {
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
				$css->add_property( 'justify-content', 'inherit' );
				$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col > .aligncenter' );
				$css->add_property( 'width', 'auto' );
			}
			// If desktop vertical lets add the horizontal css.
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( $desktop_direction === 'vertical' ) {
				$css->add_property( 'display', 'flex' );
				$css->add_property( 'flex-direction', 'row' );
				$css->add_property( 'flex-wrap', 'wrap' );
				$align = ! empty( $attributes['verticalAlignment'] ) ? $attributes['verticalAlignment'] : 'center';
				switch ( $align ) {
					case 'top':
						$align = 'flex-start';
						break;
					case 'bottom':
						$align = 'flex-end';
						break;
					default:
						$align = 'center';
						break;
				}
				$css->add_property( 'align-items', $align );
			}
			if ( isset( $attributes['justifyContent'] ) && is_array( $attributes['justifyContent'] ) && ! empty( $attributes['justifyContent'][2] ) ) {
				$css->add_property( 'justify-content', $attributes['justifyContent'][2] );
			} else if ( isset( $attributes['textAlign'] ) && is_array( $attributes['textAlign'] ) && ! empty( $attributes['textAlign'][2] ) ) {
				switch ( $attributes['textAlign'][2] ) {
					case 'left':
						$justify = 'flex-start';
						break;
					case 'right':
						$justify = 'flex-end';
						break;
					default:
						$justify = 'center';
						break;
				}
				$css->add_property( 'justify-content', $justify );
			}
			if ( isset( $attributes['wrapContent'] ) && is_array( $attributes['wrapContent'] ) && ! empty( $attributes['wrapContent'][2] ) ) {
				$css->add_property( 'flex-wrap', $attributes['wrapContent'][2] );
			}
			$gutter      = isset( $attributes['gutter'] ) && is_array( $attributes['gutter'] ) && isset( $attributes['gutter'][2] ) && is_numeric( $attributes['gutter'][2] ) ? $attributes['gutter'][2] : '';
			$gutter_unit = ! empty( $attributes['gutterUnit'] ) ? $attributes['gutterUnit'] : 'px';
			if ( '' !== $gutter ) {
				$css->add_property( 'gap', $gutter . $gutter_unit );
			}
		}
		$css->set_media_state( 'desktop' );
		if ( isset( $attributes['kadenceBlockCSS'] ) && ! empty( $attributes['kadenceBlockCSS'] ) ) {
			$css->add_css_string( str_replace( 'selector', '.kadence-column' . $unique_id, $attributes['kadenceBlockCSS'] ) );
		}
		// Filter with cdn support.
		$css_output = apply_filters( 'as3cf_filter_post_local_to_provider', $css->css_output() );
		return $css_output;
	}
}
Kadence_Blocks_Column_Block::get_instance();
