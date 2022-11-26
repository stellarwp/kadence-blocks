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
	 */
	public function build_css( $attributes, $css, $unique_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );
		// Style.
		if ( ! empty( $attributes['maxWidth'][0] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id );
			$css->add_property( 'max-width', $attributes['maxWidth'][0] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
			// Backward compatablity.
			$css->set_selector( '.wp-block-kadence-column>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '1 ' . $attributes['maxWidth'][0] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->set_selector( '.wp-block-kadence-column.kb-section-dir-horizontal>.kt-inside-inner-col>.kadence-column' . $unique_id );
			$css->add_property( 'flex', '0 1 ' . $attributes['maxWidth'][0] . ( isset( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
			$css->add_property( 'max-width', 'unset' );
			$css->add_property( 'margin-left', 'unset' );
			$css->add_property( 'margin-right', 'unset' );
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
		$css->render_measure_output( $attributes, 'padding', 'padding', array(
			'unit_key' => 'paddingType'
		) );
		$css->render_measure_output( $attributes, 'margin', 'margin', array(
			'unit_key' => 'marginType'
		) );
		if ( isset( $attributes['topPadding'] ) || isset( $attributes['bottomPadding'] ) || isset( $attributes['leftPadding'] ) || isset( $attributes['rightPadding'] ) || isset( $attributes['topMargin'] ) || isset( $attributes['bottomMargin'] ) || isset( $attributes['rightMargin'] ) || isset( $attributes['leftMargin'] ) || ! empty( $attributes['height'][0] ) || isset( $attributes['border'] ) || isset( $attributes['borderRadius'] ) || isset( $attributes['borderWidth'] ) || ( isset( $attributes['displayShadow'] ) && true == $attributes['displayShadow'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( ! empty( $attributes['height'][0] ) ) {
				$css->add_property( 'min-height', $attributes['height'][0] . ( isset( $attributes['heightUnit'] ) ? $attributes['heightUnit'] : 'px' ) );
			}
			if ( isset( $attributes['topPadding'] ) ) {
				$css->add_property( 'padding-top', $attributes['topPadding'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['bottomPadding'] ) ) {
				$css->add_property( 'padding-bottom', $attributes['bottomPadding'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['leftPadding'] ) ) {
				$css->add_property( 'padding-left', $attributes['leftPadding'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['rightPadding'] ) ) {
				$css->add_property( 'padding-right', $attributes['rightPadding'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['border'] ) ) {
				$alpha = ( isset( $attributes['borderOpacity'] ) && ! empty( $attributes['borderOpacity'] ) ? $attributes['borderOpacity'] : 1 );
				$css->add_property( 'border-color', $css->render_color( $attributes['border'], $alpha ) );
			}
			if ( isset( $attributes['borderWidth'] ) && ! empty( $attributes['borderWidth'] ) && is_array( $attributes['borderWidth'] ) ) {
				if ( isset( $attributes['borderWidth'][0] ) && is_numeric( $attributes['borderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['borderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['borderWidth'][1] ) && is_numeric( $attributes['borderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attributes['borderWidth'][1] . 'px' );
				}
				if ( isset( $attributes['borderWidth'][2] ) && is_numeric( $attributes['borderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['borderWidth'][2] . 'px' );
				}
				if ( isset( $attributes['borderWidth'][3] ) && is_numeric( $attributes['borderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attributes['borderWidth'][3] . 'px' );
				}
			}
			if ( isset( $attributes['borderRadius'] ) && ! empty( $attributes['borderRadius'] ) && is_array( $attributes['borderRadius'] ) ) {
				if ( isset( $attributes['borderRadius'][0] ) && is_numeric( $attributes['borderRadius'][0] ) ) {
					$css->add_property( 'border-top-left-radius', $attributes['borderRadius'][0] . 'px' );
				}
				if ( isset( $attributes['borderRadius'][1] ) && is_numeric( $attributes['borderRadius'][1] ) ) {
					$css->add_property( 'border-top-right-radius', $attributes['borderRadius'][1] . 'px' );
				}
				if ( isset( $attributes['borderRadius'][2] ) && is_numeric( $attributes['borderRadius'][2] ) ) {
					$css->add_property( 'border-bottom-right-radius', $attributes['borderRadius'][2] . 'px' );
				}
				if ( isset( $attributes['borderRadius'][3] ) && is_numeric( $attributes['borderRadius'][3] ) ) {
					$css->add_property( 'border-bottom-left-radius', $attributes['borderRadius'][3] . 'px' );
				}
			}
			if ( isset( $attributes['displayShadow'] ) && true == $attributes['displayShadow'] ) {
				if ( isset( $attributes['shadow'] ) && is_array( $attributes['shadow'] ) && isset( $attributes['shadow'][0] ) && is_array( $attributes['shadow'][0] ) ) {
					$css->add_property( 'box-shadow', ( isset( $attributes['shadow'][0]['inset'] ) && true === $attributes['shadow'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadow'][0]['hOffset'] ) && is_numeric( $attributes['shadow'][0]['hOffset'] ) ? $attributes['shadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadow'][0]['vOffset'] ) && is_numeric( $attributes['shadow'][0]['vOffset'] ) ? $attributes['shadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadow'][0]['blur'] ) && is_numeric( $attributes['shadow'][0]['blur'] ) ? $attributes['shadow'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadow'][0]['spread'] ) && is_numeric( $attributes['shadow'][0]['spread'] ) ? $attributes['shadow'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadow'][0]['color'] ) && ! empty( $attributes['shadow'][0]['color'] ) ? $attributes['shadow'][0]['color'] : '#000000' ), ( isset( $attributes['shadow'][0]['opacity'] ) && is_numeric( $attributes['shadow'][0]['opacity'] ) ? $attributes['shadow'][0]['opacity'] : 0.2 ) ) );
				} else {
					$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
				}
			}
		}
		if ( isset( $attributes['topMargin'] ) || isset( $attributes['bottomMargin'] ) || isset( $attributes['rightMargin'] ) || isset( $attributes['leftMargin'] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attributes['topMargin'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMargin'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['bottomMargin'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMargin'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['rightMargin'] ) ) {
				$css->add_property( 'margin-right', $attributes['rightMargin'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['leftMargin'] ) ) {
				$css->add_property( 'margin-left', $attributes['leftMargin'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
		}
		// Hover Styles.
		if ( isset( $attributes['borderHover'] ) || isset( $attributes['borderHoverRadius'] ) || isset( $attributes['borderHoverWidth'] ) || ( isset( $attributes['displayHoverShadow'] ) && true == $attributes['displayHoverShadow'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
			if ( isset( $attributes['borderHover'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attributes['borderHover'] ) );
			}
			if ( isset( $attributes['borderHoverWidth'] ) && ! empty( $attributes['borderHoverWidth'] ) && is_array( $attributes['borderHoverWidth'] ) ) {
				if ( isset( $attributes['borderHoverWidth'][0] ) && is_numeric( $attributes['borderHoverWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['borderHoverWidth'][0] . 'px' );
				}
				if ( isset( $attributes['borderHoverWidth'][1] ) && is_numeric( $attributes['borderHoverWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attributes['borderHoverWidth'][1] . 'px' );
				}
				if ( isset( $attributes['borderHoverWidth'][2] ) && is_numeric( $attributes['borderHoverWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['borderHoverWidth'][2] . 'px' );
				}
				if ( isset( $attributes['borderHoverWidth'][3] ) && is_numeric( $attributes['borderHoverWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attributes['borderHoverWidth'][3] . 'px' );
				}
			}
			if ( isset( $attributes['borderHoverRadius'] ) && ! empty( $attributes['borderHoverRadius'] ) && is_array( $attributes['borderHoverRadius'] ) ) {
				if ( isset( $attributes['borderHoverRadius'][0] ) && is_numeric( $attributes['borderHoverRadius'][0] ) ) {
					$css->add_property( 'border-top-left-radius', $attributes['borderHoverRadius'][0] . 'px' );
				}
				if ( isset( $attributes['borderHoverRadius'][1] ) && is_numeric( $attributes['borderHoverRadius'][1] ) ) {
					$css->add_property( 'border-top-right-radius', $attributes['borderHoverRadius'][1] . 'px' );
				}
				if ( isset( $attributes['borderHoverRadius'][2] ) && is_numeric( $attributes['borderHoverRadius'][2] ) ) {
					$css->add_property( 'border-bottom-right-radius', $attributes['borderHoverRadius'][2] . 'px' );
				}
				if ( isset( $attributes['borderHoverRadius'][3] ) && is_numeric( $attributes['borderHoverRadius'][3] ) ) {
					$css->add_property( 'border-bottom-left-radius', $attributes['borderHoverRadius'][3] . 'px' );
				}
			}
			if ( isset( $attributes['displayHoverShadow'] ) && true == $attributes['displayHoverShadow'] ) {
				if ( isset( $attributes['shadowHover'] ) && is_array( $attributes['shadowHover'] ) && isset( $attributes['shadowHover'][0] ) && is_array( $attributes['shadowHover'][0] ) ) {
					$css->add_property( 'box-shadow', ( isset( $attributes['shadowHover'][0]['inset'] ) && true === $attributes['shadowHover'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadowHover'][0]['hOffset'] ) && is_numeric( $attributes['shadowHover'][0]['hOffset'] ) ? $attributes['shadowHover'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['vOffset'] ) && is_numeric( $attributes['shadowHover'][0]['vOffset'] ) ? $attributes['shadowHover'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['blur'] ) && is_numeric( $attributes['shadowHover'][0]['blur'] ) ? $attributes['shadowHover'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['spread'] ) && is_numeric( $attributes['shadowHover'][0]['spread'] ) ? $attributes['shadowHover'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadowHover'][0]['color'] ) && ! empty( $attributes['shadowHover'][0]['color'] ) ? $attributes['shadowHover'][0]['color'] : '#000000' ), ( isset( $attributes['shadowHover'][0]['opacity'] ) && is_numeric( $attributes['shadowHover'][0]['opacity'] ) ? $attributes['shadowHover'][0]['opacity'] : 0.2 ) ) );
				} else {
					$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
				}
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
		if ( isset( $attributes['background'] ) && ! empty( $attributes['background'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$alpha = ( isset( $attributes['backgroundOpacity'] ) && is_numeric( $attributes['backgroundOpacity'] ) ? $attributes['backgroundOpacity'] : 1 );
			$css->add_property( 'background-color', $css->render_color( $attributes['background'], $alpha ) );
		}
		if ( isset( $attributes['backgroundImg'] ) && is_array( $attributes['backgroundImg'] ) && isset( $attributes['backgroundImg'][0] ) && is_array( $attributes['backgroundImg'][0] ) && isset( $attributes['backgroundImg'][0]['bgImg'] ) && ! empty( $attributes['backgroundImg'][0]['bgImg'] ) ) {
			$bg_img = $attributes['backgroundImg'][0];
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img['bgImgSize'] ) ? $bg_img['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img['bgImgPosition'] ) ? $bg_img['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img['bgImgAttachment'] ) ? $bg_img['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img['bgImgRepeat'] ) ? $bg_img['bgImgRepeat'] : 'no-repeat' ) );
		}
		// Background Hover.
		if ( isset( $attributes['backgroundHover'] ) && ! empty( $attributes['backgroundHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHover'] ) );
		}
		if ( isset( $attributes['backgroundImgHover'] ) && is_array( $attributes['backgroundImgHover'] ) && isset( $attributes['backgroundImgHover'][0] ) && is_array( $attributes['backgroundImgHover'][0] ) && isset( $attributes['backgroundImgHover'][0]['bgImg'] ) && ! empty( $attributes['backgroundImgHover'][0]['bgImg'] ) ) {
			$bg_img_hover = $attributes['backgroundImgHover'][0];
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col' );
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img_hover['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img_hover['bgImgSize'] ) ? $bg_img_hover['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img_hover['bgImgPosition'] ) ? $bg_img_hover['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img_hover['bgImgAttachment'] ) ? $bg_img_hover['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img_hover['bgImgRepeat'] ) ? $bg_img_hover['bgImgRepeat'] : 'no-repeat' ) );
		}
		// Overlay.
		if ( isset( $attributes['overlayOpacity'] ) && is_numeric( $attributes['overlayOpacity'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col:before' );
			$css->add_property( 'opacity', $attributes['overlayOpacity'] );
		}
		if ( isset( $attributes['overlay'] ) && ! empty( $attributes['overlay'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col:before' );
			$css->add_property( 'background-color', $css->render_color( $attributes['overlay'] ) );
		}
		if ( isset( $attributes['overlayImg'] ) && is_array( $attributes['overlayImg'] ) && isset( $attributes['overlayImg'][0] ) && is_array( $attributes['overlayImg'][0] ) && isset( $attributes['overlayImg'][0]['bgImg'] ) && ! empty( $attributes['overlayImg'][0]['bgImg'] ) ) {
			$bg_img = $attributes['overlayImg'][0];
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col:before' );
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img['bgImgSize'] ) ? $bg_img['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img['bgImgPosition'] ) ? $bg_img['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img['bgImgAttachment'] ) ? $bg_img['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img['bgImgRepeat'] ) ? $bg_img['bgImgRepeat'] : 'no-repeat' ) );
		}
		// Overlay Hover.
		if ( isset( $attributes['overlayHoverOpacity'] ) && is_numeric( $attributes['overlayHoverOpacity'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
			$css->add_property( 'opacity', $attributes['overlayHoverOpacity'] );
		}
		if ( isset( $attributes['overlayHover'] ) && ! empty( $attributes['overlayHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
			$css->add_property( 'background-color', $css->render_color( $attributes['overlayHover'] ) );
		}
		if ( isset( $attributes['overlayImgHover'] ) && is_array( $attributes['overlayImgHover'] ) && isset( $attributes['overlayImgHover'][0] ) && is_array( $attributes['overlayImgHover'][0] ) && isset( $attributes['overlayImgHover'][0]['bgImg'] ) && ! empty( $attributes['overlayImgHover'][0]['bgImg'] ) ) {
			$bg_img_hover = $attributes['overlayImgHover'][0];
			$css->set_selector( '.kadence-column' . $unique_id . ':hover > .kt-inside-inner-col:before' );
			$css->add_property( 'background-image', sprintf( "url('%s')", $bg_img_hover['bgImg'] ) );
			$css->add_property( 'background-size', ( ! empty( $bg_img_hover['bgImgSize'] ) ? $bg_img_hover['bgImgSize'] : 'cover' ) );
			$css->add_property( 'background-position', ( ! empty( $bg_img_hover['bgImgPosition'] ) ? $bg_img_hover['bgImgPosition'] : 'center center' ) );
			$css->add_property( 'background-attachment', ( ! empty( $bg_img_hover['bgImgAttachment'] ) ? $bg_img_hover['bgImgAttachment'] : 'scroll' ) );
			$css->add_property( 'background-repeat', ( ! empty( $bg_img_hover['bgImgRepeat'] ) ? $bg_img_hover['bgImgRepeat'] : 'no-repeat' ) );
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
			$css->set_selector( '.kadence-column' . $unique_id . ', .kadence-column' . $unique_id . ' h1, .kadence-column' . $unique_id . ' h2, .kadence-column' . $unique_id . ' h3, .kadence-column' . $unique_id . ' h4, .kadence-column' . $unique_id . ' h5, .kadence-column' . $unique_id . ' h6' );
			$css->add_property( 'color', $css->render_color( $attributes['textColorHover'] ) );
		}
		if ( isset( $attributes['linkColorHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a' );
			$css->add_property( 'color', $css->render_color( $attributes['linkColorHover'] ) );
		}
		if ( isset( $attributes['linkHoverColorHover'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' a:hover' );
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
			$css->set_selector( '.kt-row-column-wrap.kt-tab-layout-three-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-tab-layout-two-grid > .kadence-column' . $unique_id . ', .kt-row-column-wrap.kt-tab-layout-row > .kadence-column' . $unique_id . ', .kadence-column' . $unique_id );
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
		if ( isset( $attributes['topPaddingT'] ) || isset( $attributes['bottomPaddingT'] ) || isset( $attributes['leftPaddingT'] ) || isset( $attributes['rightPaddingT'] ) || ( isset( $attributes['height'][1] ) && is_numeric( $attributes['height'][1] ) ) || isset( $attributes['tabletBorderWidth'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attributes['height'][1] ) && is_numeric( $attributes['height'][1] ) ) {
				$css->add_property( 'min-height', $attributes['height'][1] . ( isset( $attributes['heightUnit'] ) ? $attributes['heightUnit'] : 'px' ) );
			}
			if ( isset( $attributes['topPaddingT'] ) ) {
				$css->add_property( 'padding-top', $attributes['topPaddingT'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['bottomPaddingT'] ) ) {
				$css->add_property( 'padding-bottom', $attributes['bottomPaddingT'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['leftPaddingT'] ) ) {
				$css->add_property( 'padding-left', $attributes['leftPaddingT'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['rightPaddingT'] ) ) {
				$css->add_property( 'padding-right', $attributes['rightPaddingT'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['topMarginT'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMarginT'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['bottomMarginT'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMarginT'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['rightMarginT'] ) ) {
				$css->add_property( 'margin-right', $attributes['rightMarginT'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['leftMarginT'] ) ) {
				$css->add_property( 'margin-left', $attributes['leftMarginT'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['tabletBorderWidth'] ) && ! empty( $attributes['tabletBorderWidth'] ) && is_array( $attributes['tabletBorderWidth'] ) ) {
				if ( isset( $attributes['tabletBorderWidth'][0] ) && is_numeric( $attributes['tabletBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['tabletBorderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['tabletBorderWidth'][1] ) && is_numeric( $attributes['tabletBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attributes['tabletBorderWidth'][1] . 'px' );
				}
				if ( isset( $attributes['tabletBorderWidth'][2] ) && is_numeric( $attributes['tabletBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['tabletBorderWidth'][2] . 'px' );
				}
				if ( isset( $attributes['tabletBorderWidth'][3] ) && is_numeric( $attributes['tabletBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attributes['tabletBorderWidth'][3] . 'px' );
				}
			}
		}
		$css->set_media_state( 'desktop' );
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
		if ( isset( $attributes['topPaddingM'] ) || isset( $attributes['bottomPaddingM'] ) || isset( $attributes['leftPaddingM'] ) || isset( $attributes['rightPaddingM'] ) || ( isset( $attributes['height'][2] ) && is_numeric( $attributes['height'][2] ) ) || isset( $attributes['mobileBorderWidth'] ) ) {
			$css->set_selector( '.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attributes['height'][2] ) && is_numeric( $attributes['height'][2] ) ) {
				$css->add_property( 'min-height', $attributes['height'][2] . ( isset( $attributes['heightUnit'] ) ? $attributes['heightUnit'] : 'px' ) );
			}
			if ( isset( $attributes['topPaddingM'] ) ) {
				$css->add_property( 'padding-top', $attributes['topPaddingM'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['bottomPaddingM'] ) ) {
				$css->add_property( 'padding-bottom', $attributes['bottomPaddingM'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['leftPaddingM'] ) ) {
				$css->add_property( 'padding-left', $attributes['leftPaddingM'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['rightPaddingM'] ) ) {
				$css->add_property( 'padding-right', $attributes['rightPaddingM'] . ( isset( $attributes['paddingType'] ) ? $attributes['paddingType'] : 'px' ) );
			}
			if ( isset( $attributes['mobileBorderWidth'] ) && ! empty( $attributes['mobileBorderWidth'] ) && is_array( $attributes['mobileBorderWidth'] ) ) {
				if ( isset( $attributes['mobileBorderWidth'][0] ) && is_numeric( $attributes['mobileBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['mobileBorderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['mobileBorderWidth'][1] ) && is_numeric( $attributes['mobileBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attributes['mobileBorderWidth'][1] . 'px' );
				}
				if ( isset( $attributes['mobileBorderWidth'][2] ) && is_numeric( $attributes['mobileBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['mobileBorderWidth'][2] . 'px' );
				}
				if ( isset( $attributes['mobileBorderWidth'][3] ) && is_numeric( $attributes['mobileBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attributes['mobileBorderWidth'][3] . 'px' );
				}
			}
		}
		if ( isset( $attributes['topMarginM'] ) || isset( $attributes['bottomMarginM'] ) || isset( $attributes['rightMarginM'] ) || isset( $attributes['leftMarginM'] ) ) {
			$css->set_selector( '.wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			if ( isset( $attributes['topMarginM'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMarginM'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['bottomMarginM'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMarginM'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['rightMarginM'] ) ) {
				$css->add_property( 'margin-right', $attributes['rightMarginM'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
			}
			if ( isset( $attributes['leftMarginM'] ) ) {
				$css->add_property( 'margin-left', $attributes['leftMarginM'] . ( isset( $attributes['marginType'] ) ? $attributes['marginType'] : 'px' ) );
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
