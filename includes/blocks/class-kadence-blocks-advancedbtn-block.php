<?php
/**
 * Class to Build the Advanced Button Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Advanced Button.
 *
 * @category class
 */
class Kadence_Blocks_Advancedbtn_Block extends Kadence_Blocks_Abstract_Block {
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
	 * @param array $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ', .site .entry-content .wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ', .wp-block-kadence-advancedbtn.kb-btns' . $unique_id . ', .site .entry-content .wp-block-kadence-advancedbtn.kb-btns' . $unique_id );

		//the margin attribute on this block is non standard and should be updated
		if ( isset( $attributes['margin'][0] ) && is_array( $attributes['margin'][0] ) ) {
			$margin_unit = ( !empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' );
			$css->render_measure_output(
				array_merge( $attributes['margin'][0], array( 'marginType' => $margin_unit) ),
				'margin',
				'margin',
				array(
					'desktop_key' => 'desk',
					'tablet_key'  => 'tablet',
					'mobile_key'  => 'mobile',
				)
			);
		}
		$css->set_selector( '.wp-block-kadence-advancedbtn.kb-btns' . $unique_id );
		$css->render_measure_output( $attributes, 'padding', 'padding', array( 'unit_key' => 'paddingUnit' ) );
		$css->render_gap( $attributes );
		$h_property = 'justify-content';
		$v_property = 'align-items';
		if ( ! empty( $attributes['orientation'][0] ) ) {
			$css->add_property( 'flex-direction', $attributes['orientation'][0] );
			if ( $attributes['orientation'][0] === 'column' || $attributes['orientation'][0] === 'column-reverse' ) {
				$h_property = 'align-items';
				$v_property = 'justify-content';
			}
		}
		if ( ! empty( $attributes['hAlign'] ) ) {
			switch ( $attributes['hAlign'] ) {
				case 'left':
					$css->add_property( $h_property, 'flex-start' );
					break;
				case 'center':
					$css->add_property( $h_property, 'center' );
					break;
				case 'right':
					$css->add_property( $h_property, 'flex-end' );
					break;
				case 'space-between':
					if ( 'align-items' === $h_property ) {
						$css->add_property( $h_property, 'center' );
					} else {
						$css->add_property( $h_property, 'space-between' );
					}
					break;
			}
		}
		if ( ! empty( $attributes['vAlign'] ) ) {
			switch ( $attributes['vAlign'] ) {
				case 'top':
					$css->add_property( $v_property, 'flex-start' );
					break;
				case 'center':
					$css->add_property( $v_property, 'center' );
					break;
				case 'bottom':
					$css->add_property( $v_property, 'flex-end' );
					break;
			}
		}
		// Tablet.
		$css->set_media_state( 'tablet' );
		$update_align = false;
		if ( ! empty( $attributes['orientation'][1] ) ) {
			$update_align = true;
			$css->add_property( 'flex-direction', $attributes['orientation'][1] );
			if ( $attributes['orientation'][1] === 'column' || $attributes['orientation'][1] === 'column-reverse' ) {
				$h_property = 'align-items';
				$v_property = 'justify-content';
			} else if ( $attributes['orientation'][1] === 'row' || $attributes['orientation'][1] === 'row-reverse' ) {
				$h_property = 'justify-content';
				$v_property = 'align-items';
			}
		}
		if ( ! empty( $attributes['thAlign'] ) || $update_align ) {
			$align = ! empty( $attributes['thAlign'] ) ? $attributes['thAlign'] : '';
			if ( empty( $align ) ) {
				$align = ! empty( $attributes['hAlign'] ) ? $attributes['hAlign'] : 'center';
			}
			switch ( $align ) {
				case 'left':
					$css->add_property( $h_property, 'flex-start' );
					break;
				case 'center':
					$css->add_property( $h_property, 'center' );
					break;
				case 'right':
					$css->add_property( $h_property, 'flex-end' );
					break;
				case 'space-between':
					if ( 'align-items' === $h_property ) {
						$css->add_property( $h_property, 'center' );
					} else {
						$css->add_property( $h_property, 'space-between' );
					}
					break;
			}
		}
		if ( ! empty( $attributes['tvAlign'] ) || $update_align ) {
			$align = ! empty( $attributes['tvAlign'] ) ? $attributes['tvAlign'] : '';
			if ( empty( $align ) ) {
				$align = ! empty( $attributes['vAlign'] ) ? $attributes['vAlign'] : 'center';
			}
			switch ( $align ) {
				case 'top':
					$css->add_property( $v_property, 'flex-start' );
					break;
				case 'center':
					$css->add_property( $v_property, 'center' );
					break;
				case 'bottom':
					$css->add_property( $v_property, 'flex-end' );
					break;
			}
		}
		// Mobile.
		$css->set_media_state( 'mobile' );
		$update_align = false;
		if ( ! empty( $attributes['orientation'][2] ) ) {
			$update_align = true;
			$css->add_property( 'flex-direction', $attributes['orientation'][2] );
			if ( $attributes['orientation'][2] === 'column' || $attributes['orientation'][2] === 'column-reverse' ) {
				$h_property = 'align-items';
				$v_property = 'justify-content';
			} else if ( $attributes['orientation'][2] === 'row' || $attributes['orientation'][2] === 'row-reverse' ) {
				$h_property = 'justify-content';
				$v_property = 'align-items';
			}
		}
		if ( ! empty( $attributes['mhAlign'] ) || $update_align ) {
			$align = ! empty( $attributes['mhAlign'] ) ? $attributes['mhAlign'] : '';
			if ( empty( $align ) ) {
				$align = ! empty( $attributes['thAlign'] ) ? $attributes['thAlign'] : '';
			}
			if ( empty( $align ) ) {
				$align = ! empty( $attributes['hAlign'] ) ? $attributes['hAlign'] : 'center';
			}
			switch ( $align ) {
				case 'left':
					$css->add_property( $h_property, 'flex-start' );
					break;
				case 'center':
					$css->add_property( $h_property, 'center' );
					break;
				case 'right':
					$css->add_property( $h_property, 'flex-end' );
					break;
				case 'space-between':
					if ( 'align-items' === $h_property ) {
						$css->add_property( $h_property, 'center' );
					} else {
						$css->add_property( $h_property, 'space-between' );
					}
					break;
			}
		}
		if ( ! empty( $attributes['mvAlign'] ) || $update_align ) {
			$align = ! empty( $attributes['mvAlign'] ) ? $attributes['mvAlign'] : '';
			if ( empty( $align ) ) {
				$align = ! empty( $attributes['tvAlign'] ) ? $attributes['tvAlign'] : '';
			}
			if ( empty( $align ) ) {
				$align = ! empty( $attributes['vAlign'] ) ? $attributes['vAlign'] : 'center';
			}
			switch ( $align ) {
				case 'top':
					$css->add_property( $v_property, 'flex-start' );
					break;
				case 'center':
					$css->add_property( $v_property, 'center' );
					break;
				case 'bottom':
					$css->add_property( $v_property, 'flex-end' );
					break;
			}
		}
		$css->set_media_state( 'desktop' );
		// Old CSS for backwards support.
		if ( isset( $attributes['btns'] ) && is_array( $attributes['btns'] ) ) {
			foreach ( $attributes['btns'] as $btnkey => $btnvalue ) {
				if ( is_array( $btnvalue ) ) {
					if ( isset( $btnvalue['target'] ) && ! empty( $btnvalue['target'] ) && 'video' == $btnvalue['target'] ) {
						$this->enqueue_style( 'kadence-simplelightbox-css' );
						$this->enqueue_script( 'kadence-blocks-videolight-js' );
					}
				}
			}
		}
		if ( isset( $attributes['typography'] ) || isset( $attributes['textTransform'] ) || isset( $attributes['fontWeight'] ) || isset( $attributes['fontStyle'] ) ) {
			$css->set_selector( '.kt-btns' . $unique_id . ' .kt-button' );
			if ( isset( $attributes['typography'] ) && ! empty( $attributes['typography'] ) ) {
				$css->add_property( 'font-family', $css->render_font_family( $attributes['typography'] ) );
			}
			if ( isset( $attributes['fontWeight'] ) && ! empty( $attributes['fontWeight'] ) ) {
				$css->add_property( 'font-weight', $css->render_font_weight( $attributes['fontWeight'] ) );
			}
			if ( isset( $attributes['fontStyle'] ) && ! empty( $attributes['fontStyle'] ) ) {
				$css->add_property( 'font-style', $attributes['fontStyle'] );
			}
			if ( isset( $attributes['textTransform'] ) && ! empty( $attributes['textTransform'] ) ) {
				$css->add_property( 'text-transform', $attributes['textTransform'] );
			}
		}

		if ( isset( $attributes['btns'] ) && is_array( $attributes['btns'] ) ) {
			foreach ( $attributes['btns'] as $btnkey => $btnvalue ) {
				if ( is_array( $btnvalue ) ) {
					$this->enqueue_style( 'kb-button-deprecated-styles' );
					if ( isset( $btnvalue['gap'] ) && is_numeric( $btnvalue['gap'] ) ) {
						$css->set_selector( '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey );
						$css->add_property( 'margin-right', $btnvalue['gap'] . 'px' );

						if ( is_rtl() ) {
							$css->set_selector( '.rtl .kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey );
							$css->add_property( 'margin-left', $btnvalue['gap'] . 'px' );
							$css->add_property( 'margin-right', '0px' );
						}
					}
					if ( isset( $btnvalue['backgroundType'] ) && 'gradient' === $btnvalue['backgroundType'] || isset( $btnvalue['backgroundHoverType'] ) && 'gradient' === $btnvalue['backgroundHoverType'] ) {
						$bgtype = 'gradient';
					} else {
						$bgtype = 'solid';
					}
					$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button' );
					if ( isset( $attributes['widthType'] ) && 'fixed' === $attributes['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][0] ) && ! empty( $btnvalue['width'][0] ) ) {
						$css->add_property( 'width', $btnvalue['width'][0] . 'px' );
					}
					if ( ! isset( $btnvalue['btnSize'] ) || ( isset( $btnvalue['btnSize'] ) && 'custom' === $btnvalue['btnSize'] ) ) {
						if ( isset( $btnvalue['paddingLR'] ) && is_numeric( $btnvalue['paddingLR'] ) ) {
							$css->add_property( 'padding-left', $btnvalue['paddingLR'] . 'px' );
							$css->add_property( 'padding-right', $btnvalue['paddingLR'] . 'px' );
						}
						if ( isset( $btnvalue['paddingBT'] ) && is_numeric( $btnvalue['paddingBT'] ) ) {
							$css->add_property( 'padding-top', $btnvalue['paddingBT'] . 'px' );
							$css->add_property( 'padding-bottom', $btnvalue['paddingBT'] . 'px' );
						}
					}
					if ( isset( $btnvalue['color'] ) && ! empty( $btnvalue['color'] ) ) {
						$css->add_property( 'color', $css->render_color( $btnvalue['color'] ) );
					}
					if ( isset( $btnvalue['size'] ) && ! empty( $btnvalue['size'] ) ) {
						$css->add_property( 'font-size', $css->get_font_size( $btnvalue['size'], ( isset( $btnvalue['sizeType'] ) && ! empty( $btnvalue['sizeType'] ) ? $btnvalue['sizeType'] : 'px' ) ) );
					}
					if ( isset( $btnvalue['backgroundType'] ) && 'gradient' === $btnvalue['backgroundType'] ) {
						$bg1 = ( ! isset( $btnvalue['background'] ) || 'transparent' === $btnvalue['background'] ? 'rgba(255,255,255,0)' : $css->render_color( $btnvalue['background'], ( isset( $btnvalue['backgroundOpacity'] ) && is_numeric( $btnvalue['backgroundOpacity'] ) ? $btnvalue['backgroundOpacity'] : 1 ) ) );
						$bg2 = ( isset( $btnvalue['gradient'][0] ) && ! empty( $btnvalue['gradient'][0] ) ? $css->render_color( $btnvalue['gradient'][0], ( isset( $btnvalue['gradient'][1] ) && is_numeric( $btnvalue['gradient'][1] ) ? $btnvalue['gradient'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $btnvalue['gradient'][1] ) && is_numeric( $btnvalue['gradient'][1] ) ? $btnvalue['gradient'][1] : 1 ) ) );
						if ( isset( $btnvalue['gradient'][4] ) && 'radial' === $btnvalue['gradient'][4] ) {
							$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $btnvalue['gradient'][6] ) && ! empty( $btnvalue['gradient'][6] ) ? $btnvalue['gradient'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $btnvalue['gradient'][2] ) && is_numeric( $btnvalue['gradient'][2] ) ? $btnvalue['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $btnvalue['gradient'][3] ) && is_numeric( $btnvalue['gradient'][3] ) ? $btnvalue['gradient'][3] : '100' ) . '%)' );
						} else if ( ! isset( $btnvalue['gradient'][4] ) || 'radial' !== $btnvalue['gradient'][4] ) {
							$css->add_property( 'background', 'linear-gradient(' . ( isset( $btnvalue['gradient'][5] ) && ! empty( $btnvalue['gradient'][5] ) ? $btnvalue['gradient'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $btnvalue['gradient'][2] ) && is_numeric( $btnvalue['gradient'][2] ) ? $btnvalue['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $btnvalue['gradient'][3] ) && is_numeric( $btnvalue['gradient'][3] ) ? $btnvalue['gradient'][3] : '100' ) . '%)' );
						}
					} else if ( isset( $btnvalue['background'] ) && ! empty( $btnvalue['background'] ) && 'transparent' === $btnvalue['background'] ) {
						$css->add_property( 'background', 'transparent' );
					} else if ( isset( $btnvalue['background'] ) && ! empty( $btnvalue['background'] ) ) {
						$alpha = ( isset( $btnvalue['backgroundOpacity'] ) && is_numeric( $btnvalue['backgroundOpacity'] ) ? $btnvalue['backgroundOpacity'] : 1 );
						$css->add_property( 'background', $css->render_color( $btnvalue['background'], $alpha ) );
					}
					if ( isset( $btnvalue['border'] ) && ! empty( $btnvalue['border'] ) ) {
						$alpha = ( isset( $btnvalue['borderOpacity'] ) && is_numeric( $btnvalue['borderOpacity'] ) ? $btnvalue['borderOpacity'] : 1 );
						$css->add_property( 'border-color', $css->render_color( $btnvalue['border'], $alpha ) );
					}
					if ( ! empty( $btnvalue['borderStyle'] ) ) {
						$css->add_property( 'border-style', $btnvalue['borderStyle'] );
					} elseif ( ! empty( $btnvalue['borderWidth'] ) ) {
						$css->add_property( 'border-style', 'solid' );
					}
					if ( isset( $btnvalue['boxShadow'] ) && is_array( $btnvalue['boxShadow'] ) && isset( $btnvalue['boxShadow'][0] ) && true === $btnvalue['boxShadow'][0] ) {
						$css->add_property( 'box-shadow', ( isset( $btnvalue['boxShadow'][7] ) && true === $btnvalue['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $btnvalue['boxShadow'][3] ) && is_numeric( $btnvalue['boxShadow'][3] ) ? $btnvalue['boxShadow'][3] : '1' ) . 'px ' . ( isset( $btnvalue['boxShadow'][4] ) && is_numeric( $btnvalue['boxShadow'][4] ) ? $btnvalue['boxShadow'][4] : '1' ) . 'px ' . ( isset( $btnvalue['boxShadow'][5] ) && is_numeric( $btnvalue['boxShadow'][5] ) ? $btnvalue['boxShadow'][5] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadow'][6] ) && is_numeric( $btnvalue['boxShadow'][6] ) ? $btnvalue['boxShadow'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $btnvalue['boxShadow'][1] ) && ! empty( $btnvalue['boxShadow'][1] ) ? $btnvalue['boxShadow'][1] : '#000000' ), ( isset( $btnvalue['boxShadow'][2] ) && is_numeric( $btnvalue['boxShadow'][2] ) ? $btnvalue['boxShadow'][2] : 0.2 ) ) );
					}

					$css->render_measure_output( $btnvalue, 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] );


					$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:hover, .wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:focus' );
					if ( isset( $btnvalue['colorHover'] ) && ! empty( $btnvalue['colorHover'] ) ) {
						$css->add_property( 'color', $css->render_color( $btnvalue['colorHover'] ) );
					}
					if ( isset( $btnvalue['borderHover'] ) && ! empty( $btnvalue['borderHover'] ) ) {
						$alpha = ( isset( $btnvalue['borderHoverOpacity'] ) && is_numeric( $btnvalue['borderHoverOpacity'] ) ? $btnvalue['borderHoverOpacity'] : 1 );
						$css->add_property( 'border-color', $css->render_color( $btnvalue['borderHover'], $alpha ) );
					}
					if ( isset( $btnvalue['boxShadowHover'] ) && is_array( $btnvalue['boxShadowHover'] ) && isset( $btnvalue['boxShadowHover'][0] ) && true === $btnvalue['boxShadowHover'][0] && isset( $btnvalue['boxShadowHover'][7] ) && true !== $btnvalue['boxShadowHover'][7] ) {
						$css->add_property( 'box-shadow', ( isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $btnvalue['boxShadowHover'][3] ) && is_numeric( $btnvalue['boxShadowHover'][3] ) ? $btnvalue['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][4] ) && is_numeric( $btnvalue['boxShadowHover'][4] ) ? $btnvalue['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][5] ) && is_numeric( $btnvalue['boxShadowHover'][5] ) ? $btnvalue['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][6] ) && is_numeric( $btnvalue['boxShadowHover'][6] ) ? $btnvalue['boxShadowHover'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $btnvalue['boxShadowHover'][1] ) && ! empty( $btnvalue['boxShadowHover'][1] ) ? $btnvalue['boxShadowHover'][1] : '#000000' ), ( isset( $btnvalue['boxShadowHover'][2] ) && is_numeric( $btnvalue['boxShadowHover'][2] ) ? $btnvalue['boxShadowHover'][2] : 0.4 ) ) );
					}
					if ( 'gradient' === $bgtype ) {
						$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button::before' );
						$css->add_property( 'transition', 'opacity .3s ease-in-out' );
						if ( isset( $btnvalue['backgroundHoverType'] ) && 'gradient' === $btnvalue['backgroundHoverType'] ) {
							$bg1 = ( ! isset( $btnvalue['backgroundHover'] ) ? $css->render_color( '#444444', ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 ) ) : $css->render_color( $btnvalue['backgroundHover'], ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 ) ) );
							$bg2 = ( isset( $btnvalue['gradientHover'][0] ) && ! empty( $btnvalue['gradientHover'][0] ) ? $css->render_color( $btnvalue['gradientHover'][0], ( isset( $btnvalue['gradientHover'][1] ) && is_numeric( $btnvalue['gradientHover'][1] ) ? $btnvalue['gradientHover'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $btnvalue['gradientHover'][1] ) && is_numeric( $btnvalue['gradientHover'][1] ) ? $btnvalue['gradientHover'][1] : 1 ) ) );
							if ( isset( $btnvalue['gradientHover'][4] ) && 'radial' === $btnvalue['gradientHover'][4] ) {
								$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $btnvalue['gradientHover'][6] ) && ! empty( $btnvalue['gradientHover'][6] ) ? $btnvalue['gradientHover'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $btnvalue['gradientHover'][2] ) && is_numeric( $btnvalue['gradientHover'][2] ) ? $btnvalue['gradientHover'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $btnvalue['gradientHover'][3] ) && is_numeric( $btnvalue['gradientHover'][3] ) ? $btnvalue['gradientHover'][3] : '100' ) . '%)' );
							} else if ( ! isset( $btnvalue['gradientHover'][4] ) || 'radial' !== $btnvalue['gradientHover'][4] ) {
								$css->add_property( 'background', 'linear-gradient(' . ( isset( $btnvalue['gradientHover'][5] ) && ! empty( $btnvalue['gradientHover'][5] ) ? $btnvalue['gradientHover'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $btnvalue['gradientHover'][2] ) && is_numeric( $btnvalue['gradientHover'][2] ) ? $btnvalue['gradientHover'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $btnvalue['gradientHover'][3] ) && is_numeric( $btnvalue['gradientHover'][3] ) ? $btnvalue['gradientHover'][3] : '100' ) . '%)' );
							}
						} else if ( isset( $btnvalue['backgroundHover'] ) && ! empty( $btnvalue['backgroundHover'] ) ) {
							$alpha = ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 );
							$css->add_property( 'background', $css->render_color( $btnvalue['backgroundHover'], $alpha ) );
						}
						if ( isset( $btnvalue['boxShadowHover'] ) && is_array( $btnvalue['boxShadowHover'] ) && isset( $btnvalue['boxShadowHover'][0] ) && true === $btnvalue['boxShadowHover'][0] && isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ) {
							$css->add_property( 'box-shadow', ( isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $btnvalue['boxShadowHover'][3] ) && is_numeric( $btnvalue['boxShadowHover'][3] ) ? $btnvalue['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][4] ) && is_numeric( $btnvalue['boxShadowHover'][4] ) ? $btnvalue['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][5] ) && is_numeric( $btnvalue['boxShadowHover'][5] ) ? $btnvalue['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][6] ) && is_numeric( $btnvalue['boxShadowHover'][6] ) ? $btnvalue['boxShadowHover'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $btnvalue['boxShadowHover'][1] ) && ! empty( $btnvalue['boxShadowHover'][1] ) ? $btnvalue['boxShadowHover'][1] : '#000000' ), ( isset( $btnvalue['boxShadowHover'][2] ) && is_numeric( $btnvalue['boxShadowHover'][2] ) ? $btnvalue['boxShadowHover'][2] : 0.4 ) ) );
							$css->add_property( 'border-radius', ( isset( $btnvalue['borderRadius'] ) && is_numeric( $btnvalue['borderRadius'] ) ? $btnvalue['borderRadius'] : '3' ) . 'px' );
						}
					} else {
						$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button::before' );
						$css->add_property( 'display', 'none' );
						$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:hover, .wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:focus' );
						if ( isset( $btnvalue['backgroundHover'] ) && ! empty( $btnvalue['backgroundHover'] ) ) {
							$alpha = ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 );
							$css->add_property( 'background', $css->render_color( $btnvalue['backgroundHover'], $alpha ) );
						} else {
							$alpha = ( isset( $btnvalue['backgroundHoverOpacity'] ) && is_numeric( $btnvalue['backgroundHoverOpacity'] ) ? $btnvalue['backgroundHoverOpacity'] : 1 );
							if ( ! isset( $btnvalue['inheritStyles'] ) || ( isset( $btnvalue['inheritStyles'] ) && 'inherit' !== $btnvalue['inheritStyles'] ) ) {
								$css->add_property( 'background', $css->render_color( '#444444', $alpha ) );
							}
						}
						if ( isset( $btnvalue['boxShadowHover'] ) && is_array( $btnvalue['boxShadowHover'] ) && isset( $btnvalue['boxShadowHover'][0] ) && true === $btnvalue['boxShadowHover'][0] && isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ) {
							$css->add_property( 'box-shadow', ( isset( $btnvalue['boxShadowHover'][7] ) && true === $btnvalue['boxShadowHover'][7] ? 'inset ' : '' ) . ( isset( $btnvalue['boxShadowHover'][3] ) && is_numeric( $btnvalue['boxShadowHover'][3] ) ? $btnvalue['boxShadowHover'][3] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][4] ) && is_numeric( $btnvalue['boxShadowHover'][4] ) ? $btnvalue['boxShadowHover'][4] : '2' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][5] ) && is_numeric( $btnvalue['boxShadowHover'][5] ) ? $btnvalue['boxShadowHover'][5] : '3' ) . 'px ' . ( isset( $btnvalue['boxShadowHover'][6] ) && is_numeric( $btnvalue['boxShadowHover'][6] ) ? $btnvalue['boxShadowHover'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $btnvalue['boxShadowHover'][1] ) && ! empty( $btnvalue['boxShadowHover'][1] ) ? $btnvalue['boxShadowHover'][1] : '#000000' ), ( isset( $btnvalue['boxShadowHover'][2] ) && is_numeric( $btnvalue['boxShadowHover'][2] ) ? $btnvalue['boxShadowHover'][2] : 0.4 ) ) );
						}
					}
					// Tablet CSS.
					if ( isset( $btnvalue['tabletGap'] ) && is_numeric( $btnvalue['tabletGap'] ) ) {
						$css->set_media_state( 'tablet' );
						$css->set_selector( '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey );
						$css->add_property( 'margin-right', $btnvalue['tabletGap'] . 'px' );
						$css->set_media_state( 'desktop' );
					}
					if ( ( isset( $btnvalue['responsiveSize'] ) && is_array( $btnvalue['responsiveSize'] ) && isset( $btnvalue['responsiveSize'][0] ) && is_numeric( $btnvalue['responsiveSize'][0] ) ) || ( isset( $attributes['widthType'] ) && 'fixed' === $attributes['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][1] ) && ! empty( $btnvalue['width'][1] ) ) ) {
						$css->set_media_state( 'tablet' );
						$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button' );
						if ( isset( $btnvalue['responsiveSize'] ) && is_array( $btnvalue['responsiveSize'] ) && isset( $btnvalue['responsiveSize'][0] ) && is_numeric( $btnvalue['responsiveSize'][0] ) ) {
							$css->add_property( 'font-size', $css->get_font_size( $btnvalue['responsiveSize'][0], ( isset( $btnvalue['sizeType'] ) && ! empty( $btnvalue['sizeType'] ) ? $btnvalue['sizeType'] : 'px' ) ) );
						}
						if ( isset( $attributes['widthType'] ) && 'fixed' === $attributes['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][1] ) && ! empty( $btnvalue['width'][1] ) ) {
							$css->add_property( 'width', $btnvalue['width'][1] . 'px' );
						}
						$css->set_media_state( 'desktop' );
					}
					if ( ( isset( $btnvalue['btnSize'] ) && 'custom' === $btnvalue['btnSize'] && ( ( isset( $btnvalue['responsivePaddingBT'] ) && is_array( $btnvalue['responsivePaddingBT'] ) && isset( $btnvalue['responsivePaddingBT'][0] ) && is_numeric( $btnvalue['responsivePaddingBT'][0] ) ) || ( isset( $btnvalue['responsivePaddingLR'] ) && is_array( $btnvalue['responsivePaddingLR'] ) && isset( $btnvalue['responsivePaddingLR'][0] ) && is_numeric( $btnvalue['responsivePaddingLR'][0] ) ) ) ) ) {
						$css->set_media_state( 'tablet' );
						$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button' );
						if ( isset( $btnvalue['responsivePaddingLR'] ) && is_array( $btnvalue['responsivePaddingLR'] ) && isset( $btnvalue['responsivePaddingLR'][0] ) && is_numeric( $btnvalue['responsivePaddingLR'][0] ) ) {
							$css->add_property( 'padding-left', $btnvalue['responsivePaddingLR'][0] . 'px' );
							$css->add_property( 'padding-right', $btnvalue['responsivePaddingLR'][0] . 'px' );
						}
						if ( isset( $btnvalue['responsivePaddingBT'] ) && is_array( $btnvalue['responsivePaddingBT'] ) && isset( $btnvalue['responsivePaddingBT'][0] ) && is_numeric( $btnvalue['responsivePaddingBT'][0] ) ) {
							$css->add_property( 'padding-top', $btnvalue['responsivePaddingBT'][0] . 'px' );
							$css->add_property( 'padding-bottom', $btnvalue['responsivePaddingBT'][0] . 'px' );
						}

						$css->set_media_state( 'desktop' );
					}
					// Mobile CSS.
					if ( isset( $btnvalue['mobileGap'] ) && is_numeric( $btnvalue['mobileGap'] ) ) {
						$css->set_media_state( 'mobile' );
						$css->set_selector( '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey );
						$css->add_property( 'margin-right', $btnvalue['mobileGap'] . 'px' );
						$css->set_media_state( 'desktop' );
					}
					if ( ( isset( $btnvalue['responsiveSize'] ) && is_array( $btnvalue['responsiveSize'] ) && isset( $btnvalue['responsiveSize'][1] ) && is_numeric( $btnvalue['responsiveSize'][1] ) ) || ( isset( $attributes['widthType'] ) && 'fixed' === $attributes['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][2] ) && ! empty( $btnvalue['width'][2] ) ) ) {
						$css->set_media_state( 'mobile' );
						$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button' );
						if ( isset( $btnvalue['responsiveSize'] ) && is_array( $btnvalue['responsiveSize'] ) && isset( $btnvalue['responsiveSize'][1] ) && is_numeric( $btnvalue['responsiveSize'][1] ) ) {
							$css->add_property( 'font-size', $css->get_font_size( $btnvalue['responsiveSize'][1], ( isset( $btnvalue['sizeType'] ) && ! empty( $btnvalue['sizeType'] ) ? $btnvalue['sizeType'] : 'px' ) ) );
						}
						if ( isset( $attributes['widthType'] ) && 'fixed' === $attributes['widthType'] && isset( $btnvalue['width'] ) && is_array( $btnvalue['width'] ) && isset( $btnvalue['width'][2] ) && ! empty( $btnvalue['width'][2] ) ) {
							$css->add_property( 'width', $btnvalue['width'][2] . 'px' );
						}
						$css->set_media_state( 'desktop' );
					}
					if ( ( isset( $btnvalue['btnSize'] ) && 'custom' === $btnvalue['btnSize'] && ( ( isset( $btnvalue['responsivePaddingLR'] ) && is_array( $btnvalue['responsivePaddingLR'] ) && isset( $btnvalue['responsivePaddingLR'][1] ) && is_numeric( $btnvalue['responsivePaddingLR'][1] ) ) || ( isset( $btnvalue['responsivePaddingBT'] ) && is_array( $btnvalue['responsivePaddingBT'] ) && isset( $btnvalue['responsivePaddingBT'][1] ) && is_numeric( $btnvalue['responsivePaddingBT'][1] ) ) ) ) ) {
						$css->set_media_state( 'mobile' );
						$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button' );
						if ( isset( $btnvalue['responsivePaddingLR'] ) && is_array( $btnvalue['responsivePaddingLR'] ) && isset( $btnvalue['responsivePaddingLR'][1] ) && is_numeric( $btnvalue['responsivePaddingLR'][1] ) ) {
							$css->add_property( 'padding-left', $btnvalue['responsivePaddingLR'][1] . 'px' );
							$css->add_property( 'padding-right', $btnvalue['responsivePaddingLR'][1] . 'px' );
						}
						if ( isset( $btnvalue['responsivePaddingBT'] ) && is_array( $btnvalue['responsivePaddingBT'] ) && isset( $btnvalue['responsivePaddingBT'][1] ) && is_numeric( $btnvalue['responsivePaddingBT'][1] ) ) {
							$css->add_property( 'padding-top', $btnvalue['responsivePaddingBT'][1] . 'px' );
							$css->add_property( 'padding-bottom', $btnvalue['responsivePaddingBT'][1] . 'px' );
						}
						$css->set_media_state( 'desktop' );
					}
					// Icons CSS.
					if ( isset( $btnvalue['icon'] ) && ! empty( $btnvalue['icon'] ) ) {
						$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button .kt-btn-svg-icon' );
						if ( isset( $btnvalue['iconColor'] ) && ! empty( $btnvalue['iconColor'] ) ) {
							$css->add_property( 'color', $css->render_color( $btnvalue['iconColor'] ) );
						}
						if ( isset( $btnvalue['iconSize'] ) && isset( $btnvalue['iconSize'][0] ) && is_numeric( $btnvalue['iconSize'][0] ) ) {
							$css->add_property( 'font-size', $css->get_font_size( $btnvalue['iconSize'][0], ( isset( $btnvalue['iconSizeType'] ) && ! empty( $btnvalue['iconSizeType'] ) ? $btnvalue['iconSizeType'] : 'px' ) ) );
						}
						if ( isset( $btnvalue['iconColorHover'] ) && ! empty( $btnvalue['iconColorHover'] ) ) {
							$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button .kt-btn-svg-icon' );
							$css->add_property( 'transition', 'all .3s ease-in-out' );
							$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button:hover .kt-btn-svg-icon' );
							$css->add_property( 'color', $css->render_color( $btnvalue['iconColorHover'] ) );
						}
						if ( isset( $btnvalue['iconPadding'] ) && is_array( $btnvalue['iconPadding'] ) ) {
							$css->set_selector( '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-btn-svg-icon' );
							if ( isset( $btnvalue['iconPadding'][0] ) && is_numeric( $btnvalue['iconPadding'][0] ) ) {
								$css->add_property( 'padding-top', $btnvalue['iconPadding'][0] . 'px' );
							}
							if ( isset( $btnvalue['iconPadding'][1] ) && is_numeric( $btnvalue['iconPadding'][1] ) ) {
								$css->add_property( 'padding-right', $btnvalue['iconPadding'][1] . 'px' );
							}
							if ( isset( $btnvalue['iconPadding'][2] ) && is_numeric( $btnvalue['iconPadding'][2] ) ) {
								$css->add_property( 'padding-bottom', $btnvalue['iconPadding'][2] . 'px' );
							}
							if ( isset( $btnvalue['iconPadding'][3] ) && is_numeric( $btnvalue['iconPadding'][3] ) ) {
								$css->add_property( 'padding-left', $btnvalue['iconPadding'][3] . 'px' );
							}
						}
						if ( ( isset( $btnvalue['iconTabletPadding'] ) && is_array( $btnvalue['iconTabletPadding'] ) ) || ( isset( $btnvalue['iconSize'] ) && isset( $btnvalue['iconSize'][1] ) && is_numeric( $btnvalue['iconSize'][1] ) ) ) {
							$css->set_media_state( 'tablet' );
							if ( isset( $btnvalue['iconSize'] ) && isset( $btnvalue['iconSize'][1] ) && is_numeric( $btnvalue['iconSize'][1] ) ) {
								$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button .kt-btn-svg-icon' );
								$css->add_property( 'font-size', $css->get_font_size( $btnvalue['iconSize'][1], ( isset( $btnvalue['iconSizeType'] ) && ! empty( $btnvalue['iconSizeType'] ) ? $btnvalue['iconSizeType'] : 'px' ) ) );
							}
							if ( isset( $btnvalue['iconTabletPadding'] ) && is_array( $btnvalue['iconTabletPadding'] ) ) {
								$css->set_selector( '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-btn-svg-icon' );
								if ( isset( $btnvalue['iconTabletPadding'][0] ) && is_numeric( $btnvalue['iconTabletPadding'][0] ) ) {
									$css->add_property( 'padding-top', $btnvalue['iconTabletPadding'][0] . 'px' );
								}
								if ( isset( $btnvalue['iconTabletPadding'][1] ) && is_numeric( $btnvalue['iconTabletPadding'][1] ) ) {
									$css->add_property( 'padding-right', $btnvalue['iconTabletPadding'][1] . 'px' );
								}
								if ( isset( $btnvalue['iconTabletPadding'][2] ) && is_numeric( $btnvalue['iconTabletPadding'][2] ) ) {
									$css->add_property( 'padding-bottom', $btnvalue['iconTabletPadding'][2] . 'px' );
								}
								if ( isset( $btnvalue['iconTabletPadding'][3] ) && is_numeric( $btnvalue['iconTabletPadding'][3] ) ) {
									$css->add_property( 'padding-left', $btnvalue['iconTabletPadding'][3] . 'px' );
								}
							}
							$css->set_media_state( 'desktop' );
						}
						if ( ( isset( $btnvalue['iconMobilePadding'] ) && is_array( $btnvalue['iconMobilePadding'] ) ) || ( isset( $btnvalue['iconSize'] ) && isset( $btnvalue['iconSize'][2] ) && is_numeric( $btnvalue['iconSize'][2] ) ) ) {
							$css->set_media_state( 'mobile' );
							if ( isset( $btnvalue['iconSize'] ) && isset( $btnvalue['iconSize'][2] ) && is_numeric( $btnvalue['iconSize'][2] ) ) {
								$css->set_selector( '.wp-block-kadence-advancedbtn.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-button .kt-btn-svg-icon' );
								$css->add_property( 'font-size', $css->get_font_size( $btnvalue['iconSize'][2], ( isset( $btnvalue['iconSizeType'] ) && ! empty( $btnvalue['iconSizeType'] ) ? $btnvalue['iconSizeType'] : 'px' ) ) );
							}
							if ( isset( $btnvalue['iconMobilePadding'] ) && is_array( $btnvalue['iconMobilePadding'] ) ) {
								$css->set_selector( '.kt-btns' . $unique_id . ' .kt-btn-wrap-' . $btnkey . ' .kt-btn-svg-icon' );
								if ( isset( $btnvalue['iconMobilePadding'][0] ) && is_numeric( $btnvalue['iconMobilePadding'][0] ) ) {
									$css->add_property( 'padding-top', $btnvalue['iconMobilePadding'][0] . 'px' );
								}
								if ( isset( $btnvalue['iconMobilePadding'][1] ) && is_numeric( $btnvalue['iconMobilePadding'][1] ) ) {
									$css->add_property( 'padding-right', $btnvalue['iconMobilePadding'][1] . 'px' );
								}
								if ( isset( $btnvalue['iconMobilePadding'][2] ) && is_numeric( $btnvalue['iconMobilePadding'][2] ) ) {
									$css->add_property( 'padding-bottom', $btnvalue['iconMobilePadding'][2] . 'px' );
								}
								if ( isset( $btnvalue['iconMobilePadding'][3] ) && is_numeric( $btnvalue['iconMobilePadding'][3] ) ) {
									$css->add_property( 'padding-left', $btnvalue['iconMobilePadding'][3] . 'px' );
								}
							}
							$css->set_media_state( 'desktop' );
						}
					}
				}
			}
		}

		return $css->css_output();
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
}

Kadence_Blocks_Advancedbtn_Block::get_instance();
