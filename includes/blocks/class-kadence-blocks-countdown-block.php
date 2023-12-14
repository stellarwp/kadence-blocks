<?php
/**
 * Class to Build the Countdown Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Countdown Block.
 *
 * @category class
 */
class Kadence_Blocks_Countdown_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'countdown';

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
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		if ( isset( $attributes['background'] ) || isset( $attributes['border'] ) || ( isset( $attributes['borderRadius'] ) && is_array( $attributes['borderRadius'] ) ) || ( isset( $attributes['borderWidth'] ) && is_array( $attributes['borderWidth'] ) ) ) {
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attributes['background'] ) && ! empty( $attributes['background'] ) ) {
				$css->add_property( 'background', $css->render_color( $attributes['background'] ) );
			}
			if ( isset( $attributes['border'] ) && ! empty( $attributes['border'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attributes['border'] ) );
			}
			if ( isset( $attributes['borderRadius'] ) && is_array( $attributes['borderRadius'] ) ) {
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
			if ( isset( $attributes['borderWidth'] ) && is_array( $attributes['borderWidth'] ) ) {
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
		}
		if ( isset( $attributes['tabletBorderWidth'] ) && is_array( $attributes['tabletBorderWidth'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
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
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['mobileBorderWidth'] ) && is_array( $attributes['mobileBorderWidth'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
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
			$css->set_media_state( 'desktop' );
		}
		$css->set_selector( '.kb-countdown-container-' . $unique_id );
		$css->render_measure_output( $attributes, 'containerPadding', 'padding', [ 'unit_key' => 'paddingType', 'tablet_key' => 'containerTabletPadding', 'mobile_key' => 'containerMobilePadding' ] );

		$css->render_measure_output( $attributes, 'containerMargin', 'margin', [ 'unit_key' => 'marginType', 'tablet_key' => 'containerTabletMargin', 'mobile_key' => 'containerMobileMargin' ] );

		if ( isset( $attributes['itemBackground'] ) || isset( $attributes['itemBorder'] ) || ( isset( $attributes['itemBorderRadius'] ) && is_array( $attributes['itemBorderRadius'] ) ) || ( isset( $attributes['itemBorderWidth'] ) && is_array( $attributes['itemBorderWidth'] ) ) || ( isset( $attributes['itemPadding'] ) && is_array( $attributes['itemPadding'] ) ) ) {
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item:not( .kb-countdown-divider-item )' );
			if ( isset( $attributes['itemBackground'] ) && ! empty( $attributes['itemBackground'] ) ) {
				$css->add_property( 'background', $css->render_color( $attributes['itemBackground'] ) );
			}
			if ( isset( $attributes['itemBorder'] ) && ! empty( $attributes['itemBorder'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attributes['itemBorder'] ) );
			}
			if ( isset( $attributes['itemBorderRadius'] ) && is_array( $attributes['itemBorderRadius'] ) ) {
				if ( isset( $attributes['itemBorderRadius'][0] ) && is_numeric( $attributes['itemBorderRadius'][0] ) ) {
					$css->add_property( 'border-top-left-radius', $attributes['itemBorderRadius'][0] . 'px' );
				}
				if ( isset( $attributes['itemBorderRadius'][1] ) && is_numeric( $attributes['itemBorderRadius'][1] ) ) {
					$css->add_property( 'border-top-right-radius', $attributes['itemBorderRadius'][1] . 'px' );
				}
				if ( isset( $attributes['itemBorderRadius'][2] ) && is_numeric( $attributes['itemBorderRadius'][2] ) ) {
					$css->add_property( 'border-bottom-right-radius', $attributes['itemBorderRadius'][2] . 'px' );
				}
				if ( isset( $attributes['itemBorderRadius'][3] ) && is_numeric( $attributes['itemBorderRadius'][3] ) ) {
					$css->add_property( 'border-bottom-left-radius', $attributes['itemBorderRadius'][3] . 'px' );
				}
			}
			if ( isset( $attributes['itemBorderWidth'] ) && is_array( $attributes['itemBorderWidth'] ) ) {
				if ( isset( $attributes['itemBorderWidth'][0] ) && is_numeric( $attributes['itemBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['itemBorderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['itemBorderWidth'][1] ) && is_numeric( $attributes['itemBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attributes['itemBorderWidth'][1] . 'px' );
				}
				if ( isset( $attributes['itemBorderWidth'][2] ) && is_numeric( $attributes['itemBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['itemBorderWidth'][2] . 'px' );
				}
				if ( isset( $attributes['itemBorderWidth'][3] ) && is_numeric( $attributes['itemBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attributes['itemBorderWidth'][3] . 'px' );
				}
			}
			if ( isset( $attributes['itemPadding'] ) && is_array( $attributes['itemPadding'] ) ) {
				if ( isset( $attributes['itemPadding'][0] ) && is_numeric( $attributes['itemPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attributes['itemPadding'][0] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemPadding'][1] ) && is_numeric( $attributes['itemPadding'][1] ) ) {
					$css->add_property( 'padding-right', $attributes['itemPadding'][1] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemPadding'][2] ) && is_numeric( $attributes['itemPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attributes['itemPadding'][2] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemPadding'][3] ) && is_numeric( $attributes['itemPadding'][3] ) ) {
					$css->add_property( 'padding-left', $attributes['itemPadding'][3] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
			}
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item.kb-countdown-divider-item' );
			if ( isset( $attributes['itemPadding'] ) && is_array( $attributes['itemPadding'] ) ) {
				if ( isset( $attributes['itemPadding'][0] ) && is_numeric( $attributes['itemPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attributes['itemPadding'][0] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemPadding'][2] ) && is_numeric( $attributes['itemPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attributes['itemPadding'][2] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attributes['itemBorderWidth'] ) && is_array( $attributes['itemBorderWidth'] ) ) {
				if ( isset( $attributes['itemBorderWidth'][0] ) && is_numeric( $attributes['itemBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['itemBorderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['itemBorderWidth'][2] ) && is_numeric( $attributes['itemBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['itemBorderWidth'][2] . 'px' );
				}
			}
		}
		if ( ( isset( $attributes['itemTabletBorderWidth'] ) && is_array( $attributes['itemTabletBorderWidth'] ) ) || ( isset( $attributes['itemTabletPadding'] ) && is_array( $attributes['itemTabletPadding'] ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item:not( .kb-countdown-divider-item )' );
			if ( isset( $attributes['itemTabletPadding'] ) && is_array( $attributes['itemTabletPadding'] ) ) {
				if ( isset( $attributes['itemTabletPadding'][0] ) && is_numeric( $attributes['itemTabletPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attributes['itemTabletPadding'][0] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemTabletPadding'][1] ) && is_numeric( $attributes['itemTabletPadding'][1] ) ) {
					$css->add_property( 'padding-right', $attributes['itemTabletPadding'][1] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemTabletPadding'][2] ) && is_numeric( $attributes['itemTabletPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attributes['itemTabletPadding'][2] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemTabletPadding'][3] ) && is_numeric( $attributes['itemTabletPadding'][3] ) ) {
					$css->add_property( 'padding-left', $attributes['itemTabletPadding'][3] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attributes['itemTabletBorderWidth'] ) && is_array( $attributes['itemTabletBorderWidth'] ) ) {
				if ( isset( $attributes['itemTabletBorderWidth'][0] ) && is_numeric( $attributes['itemTabletBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['itemTabletBorderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['itemTabletBorderWidth'][1] ) && is_numeric( $attributes['itemTabletBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attributes['itemTabletBorderWidth'][1] . 'px' );
				}
				if ( isset( $attributes['itemTabletBorderWidth'][2] ) && is_numeric( $attributes['itemTabletBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['itemTabletBorderWidth'][2] . 'px' );
				}
				if ( isset( $attributes['itemTabletBorderWidth'][3] ) && is_numeric( $attributes['itemTabletBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attributes['itemTabletBorderWidth'][3] . 'px' );
				}
			}
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item.kb-countdown-divider-item' );
			if ( isset( $attributes['itemTabletPadding'] ) && is_array( $attributes['itemTabletPadding'] ) ) {
				if ( isset( $attributes['itemTabletPadding'][0] ) && is_numeric( $attributes['itemTabletPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attributes['itemTabletPadding'][0] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemTabletPadding'][2] ) && is_numeric( $attributes['itemTabletPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attributes['itemTabletPadding'][2] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attributes['itemTabletBorderWidth'] ) && is_array( $attributes['itemTabletBorderWidth'] ) ) {
				if ( isset( $attributes['itemTabletBorderWidth'][0] ) && is_numeric( $attributes['itemTabletBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['itemTabletBorderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['itemTabletBorderWidth'][2] ) && is_numeric( $attributes['itemTabletBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['itemTabletBorderWidth'][2] . 'px' );
				}
			}
			$css->set_media_state( 'desktop' );
		}
		if ( ( isset( $attributes['itemMobileBorderWidth'] ) && is_array( $attributes['itemMobileBorderWidth'] ) ) || ( isset( $attributes['itemMobilePadding'] ) && is_array( $attributes['itemMobilePadding'] ) ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item:not( .kb-countdown-divider-item )' );
			if ( isset( $attributes['itemMobilePadding'] ) && is_array( $attributes['itemMobilePadding'] ) ) {
				if ( isset( $attributes['itemMobilePadding'][0] ) && is_numeric( $attributes['itemMobilePadding'][0] ) ) {
					$css->add_property( 'padding-top', $attributes['itemMobilePadding'][0] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemMobilePadding'][1] ) && is_numeric( $attributes['itemMobilePadding'][1] ) ) {
					$css->add_property( 'padding-right', $attributes['itemMobilePadding'][1] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemMobilePadding'][2] ) && is_numeric( $attributes['itemMobilePadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attributes['itemMobilePadding'][2] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attributes['itemMobilePadding'][3] ) && is_numeric( $attributes['itemMobilePadding'][3] ) ) {
					$css->add_property( 'padding-left', $attributes['itemMobilePadding'][3] . ( isset( $attributes['itemPaddingType'] ) ? $attributes['itemPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attributes['itemMobileBorderWidth'] ) && is_array( $attributes['itemMobileBorderWidth'] ) ) {
				if ( isset( $attributes['itemMobileBorderWidth'][0] ) && is_numeric( $attributes['itemMobileBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['itemMobileBorderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['itemMobileBorderWidth'][1] ) && is_numeric( $attributes['itemMobileBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attributes['itemMobileBorderWidth'][1] . 'px' );
				}
				if ( isset( $attributes['itemMobileBorderWidth'][2] ) && is_numeric( $attributes['itemMobileBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['itemMobileBorderWidth'][2] . 'px' );
				}
				if ( isset( $attributes['itemMobileBorderWidth'][3] ) && is_numeric( $attributes['itemMobileBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attributes['itemMobileBorderWidth'][3] . 'px' );
				}
			}
			$css->set_media_state( 'desktop' );
		}
		$number_font = ( isset( $attributes['numberFont'] ) && is_array( $attributes['numberFont'] ) && isset( $attributes['numberFont'][0] ) && is_array( $attributes['numberFont'][0] ) ? $attributes['numberFont'][0] : array() );
		if ( ! empty( $number_font ) || ( isset( $attributes['numberColor'] ) && ! empty( $attributes['numberColor'] ) ) ) {
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-number' );
			if ( isset( $attributes['numberColor'] ) && ! empty( $attributes['numberColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attributes['numberColor'] ) );
			}
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][0] ) && ! empty( $number_font['size'][0] ) ) {
				if( $css->is_variable_font_size_value( $number_font['size'][0] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $number_font['size'][0] ) );
				} else {
					$css->add_property( 'font-size', $number_font['size'][0] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
				}
			}
			if ( isset( $number_font['lineHeight'] ) && is_array( $number_font['lineHeight'] ) && isset( $number_font['lineHeight'][0] ) && ! empty( $number_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $number_font['lineHeight'][0] . ( ! isset( $number_font['lineType'] ) ? 'px' : $number_font['lineType'] ) );
			}
			if ( isset( $number_font['letterSpacing'] ) && is_array( $number_font['letterSpacing'] ) && isset( $number_font['letterSpacing'][0] ) && ! empty( $number_font['letterSpacing'][0] ) ) {
				$css->add_property( 'letter-spacing', $number_font['letterSpacing'][0] . ( ! isset( $number_font['letterType'] ) ? 'px' : $number_font['letterType'] ) );
			}
			if ( isset( $number_font['textTransform'] ) && ! empty( $number_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $number_font['textTransform'] );
			}
			if ( isset( $number_font['family'] ) && ! empty( $number_font['family'] ) ) {
				$google = isset( $number_font['google'] ) && $number_font['google'] ? true : false;
				$google = $google && ( isset( $number_font['loadGoogle'] ) && $number_font['loadGoogle'] || ! isset( $number_font['loadGoogle'] ) ) ? true : false;
				$css->add_property( 'font-family', $css->render_font_family( $number_font['family'], $google, ( isset( $number_font['variant'] ) ? $number_font['variant'] : '' ), ( isset( $number_font['subset'] ) ? $number_font['subset'] : '' ) ) );
			}
			if ( isset( $number_font['style'] ) && ! empty( $number_font['style'] ) ) {
				$css->add_property( 'font-style', $number_font['style'] );
			}
			if ( isset( $number_font['weight'] ) && ! empty( $number_font['weight'] ) && 'regular' !== $number_font['weight'] ) {
				$css->add_property( 'font-weight', $number_font['weight'] );
			}
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][0] ) && ! empty( $number_font['size'][0] ) ) {
				$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item' );
				if( $css->is_variable_font_size_value( $number_font['size'][0] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $number_font['size'][0] ) );
				} else {
					$css->add_property( 'font-size', $number_font['size'][0] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
				}
			}
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-number' );
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][1] ) && ! empty( $number_font['size'][1] ) ) {
				if( $css->is_variable_font_size_value( $number_font['size'][1] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $number_font['size'][1] ) );
				} else {
					$css->add_property( 'font-size', $number_font['size'][1] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
				}
			}
			if ( isset( $number_font['lineHeight'] ) && is_array( $number_font['lineHeight'] ) && isset( $number_font['lineHeight'][1] ) && ! empty( $number_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $number_font['lineHeight'][1] . ( ! isset( $number_font['lineType'] ) ? 'px' : $number_font['lineType'] ) );
			}
			if ( isset( $number_font['letterSpacing'] ) && is_array( $number_font['letterSpacing'] ) && isset( $number_font['letterSpacing'][1] ) && ! empty( $number_font['letterSpacing'][1] ) ) {
				$css->add_property( 'letter-spacing', $number_font['letterSpacing'][1] . ( ! isset( $number_font['letterType'] ) ? 'px' : $number_font['letterType'] ) );
			}
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][1] ) && ! empty( $number_font['size'][1] ) ) {
				$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item' );
				if( $css->is_variable_font_size_value( $number_font['size'][1] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $number_font['size'][1] ) );
				} else {
					$css->add_property( 'font-size', $number_font['size'][1] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
				}
			}
			$css->set_media_state( 'desktop' );
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-number' );
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][2] ) && ! empty( $number_font['size'][2] ) ) {
				if( $css->is_variable_font_size_value( $number_font['size'][2] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $number_font['size'][2] ) );
				} else {
					$css->add_property( 'font-size', $number_font['size'][2] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
				}
			}
			if ( isset( $number_font['lineHeight'] ) && is_array( $number_font['lineHeight'] ) && isset( $number_font['lineHeight'][2] ) && ! empty( $number_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $number_font['lineHeight'][2] . ( ! isset( $number_font['lineType'] ) ? 'px' : $number_font['lineType'] ) );
			}
			if ( isset( $number_font['letterSpacing'] ) && is_array( $number_font['letterSpacing'] ) && isset( $number_font['letterSpacing'][2] ) && ! empty( $number_font['letterSpacing'][2] ) ) {
				$css->add_property( 'letter-spacing', $number_font['letterSpacing'][2] . ( ! isset( $number_font['letterType'] ) ? 'px' : $number_font['letterType'] ) );
			}
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][2] ) && ! empty( $number_font['size'][2] ) ) {
				$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item' );
				if( $css->is_variable_font_size_value( $number_font['size'][2] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $number_font['size'][2] ) );
				} else {
					$css->add_property( 'font-size', $number_font['size'][2] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
				}			}
			$css->set_media_state( 'desktop' );
		}
		$label_font = ( isset( $attributes['labelFont'] ) && is_array( $attributes['labelFont'] ) && isset( $attributes['labelFont'][0] ) && is_array( $attributes['labelFont'][0] ) ? $attributes['labelFont'][0] : array() );
		if ( ! empty( $label_font ) || ( isset( $attributes['labelColor'] ) && ! empty( $attributes['labelColor'] ) ) ) {
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-label' );
			if ( isset( $attributes['labelColor'] ) && ! empty( $attributes['labelColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attributes['labelColor'] ) );
			}
			if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && isset( $label_font['size'][0] ) && ! empty( $label_font['size'][0] ) ) {
				if( $css->is_variable_font_size_value( $label_font['size'][0] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $label_font['size'][0] ) );
				} else {
					$css->add_property( 'font-size', $label_font['size'][0] . ( ! isset( $label_font['sizeType'] ) ? 'px' : $label_font['sizeType'] ) );
				}
			}
			if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && isset( $label_font['lineHeight'][0] ) && ! empty( $label_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $label_font['lineHeight'][0] . ( ! isset( $label_font['lineType'] ) ? 'px' : $label_font['lineType'] ) );
			}
			if ( isset( $label_font['letterSpacing'] ) && is_array( $label_font['letterSpacing'] ) && isset( $label_font['letterSpacing'][0] ) && ! empty( $label_font['letterSpacing'][0] ) ) {
				$css->add_property( 'letter-spacing', $label_font['letterSpacing'][0] . ( ! isset( $label_font['letterType'] ) ? 'px' : $label_font['letterType'] ) );
			}
			if ( isset( $label_font['textTransform'] ) && ! empty( $label_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $label_font['textTransform'] );
			}
			if ( isset( $label_font['family'] ) && ! empty( $label_font['family'] ) ) {
				$google = isset( $label_font['google'] ) && $label_font['google'] ? true : false;
				$google = $google && ( isset( $label_font['loadGoogle'] ) && $label_font['loadGoogle'] || ! isset( $label_font['loadGoogle'] ) ) ? true : false;
				$css->add_property( 'font-family', $css->render_font_family( $label_font['family'], $google, ( isset( $label_font['variant'] ) ? $label_font['variant'] : '' ), ( isset( $label_font['subset'] ) ? $label_font['subset'] : '' ) ) );
			}
			if ( isset( $label_font['style'] ) && ! empty( $label_font['style'] ) ) {
				$css->add_property( 'font-style', $label_font['style'] );
			}
			if ( isset( $label_font['weight'] ) && ! empty( $label_font['weight'] ) && 'regular' !== $label_font['weight'] ) {
				$css->add_property( 'font-weight', $label_font['weight'] );
			}
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-label' );
			if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && isset( $label_font['size'][1] ) && ! empty( $label_font['size'][1] ) ) {
				if( $css->is_variable_font_size_value( $label_font['size'][1] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $label_font['size'][1] ) );
				} else {
					$css->add_property( 'font-size', $label_font['size'][1] . ( ! isset( $label_font['sizeType'] ) ? 'px' : $label_font['sizeType'] ) );
				}
			}
			if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && isset( $label_font['lineHeight'][1] ) && ! empty( $label_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $label_font['lineHeight'][1] . ( ! isset( $label_font['lineType'] ) ? 'px' : $label_font['lineType'] ) );
			}
			if ( isset( $label_font['letterSpacing'] ) && is_array( $label_font['letterSpacing'] ) && isset( $label_font['letterSpacing'][1] ) && ! empty( $label_font['letterSpacing'][1] ) ) {
				$css->add_property( 'letter-spacing', $label_font['letterSpacing'][1] . ( ! isset( $label_font['letterType'] ) ? 'px' : $label_font['letterType'] ) );
			}
			$css->set_media_state( 'desktop' );
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-label' );
			if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && isset( $label_font['size'][2] ) && ! empty( $label_font['size'][2] ) ) {
				if( $css->is_variable_font_size_value( $label_font['size'][2] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $label_font['size'][2] ) );
				} else {
					$css->add_property( 'font-size', $label_font['size'][2] . ( ! isset( $label_font['sizeType'] ) ? 'px' : $label_font['sizeType'] ) );
				}
			}
			if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && isset( $label_font['lineHeight'][2] ) && ! empty( $label_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $label_font['lineHeight'][2] . ( ! isset( $label_font['lineType'] ) ? 'px' : $label_font['lineType'] ) );
			}
			if ( isset( $label_font['letterSpacing'] ) && is_array( $label_font['letterSpacing'] ) && isset( $label_font['letterSpacing'][2] ) && ! empty( $label_font['letterSpacing'][2] ) ) {
				$css->add_property( 'letter-spacing', $label_font['letterSpacing'][2] . ( ! isset( $label_font['letterType'] ) ? 'px' : $label_font['letterType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		$pre_label_font = ( isset( $attributes['preLabelFont'] ) && is_array( $attributes['preLabelFont'] ) && isset( $attributes['preLabelFont'][0] ) && is_array( $attributes['preLabelFont'][0] ) ? $attributes['preLabelFont'][0] : array() );
		if ( ! empty( $pre_label_font ) || ( isset( $attributes['preLabelColor'] ) && ! empty( $attributes['preLabelColor'] ) ) ) {
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-pre-timer' );
			if ( isset( $attributes['preLabelColor'] ) && ! empty( $attributes['preLabelColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attributes['preLabelColor'] ) );
			}
			if ( isset( $pre_label_font['size'] ) && is_array( $pre_label_font['size'] ) && isset( $pre_label_font['size'][0] ) && ! empty( $pre_label_font['size'][0] ) ) {
				if( $css->is_variable_font_size_value( $pre_label_font['size'][0] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $pre_label_font['size'][0] ) );
				} else {
					$css->add_property( 'font-size', $pre_label_font['size'][0] . ( ! isset( $pre_label_font['sizeType'] ) ? 'px' : $pre_label_font['sizeType'] ) );
				}
			}
			if ( isset( $pre_label_font['lineHeight'] ) && is_array( $pre_label_font['lineHeight'] ) && isset( $pre_label_font['lineHeight'][0] ) && ! empty( $pre_label_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $pre_label_font['lineHeight'][0] . ( ! isset( $pre_label_font['lineType'] ) ? 'px' : $pre_label_font['lineType'] ) );
			}
			if ( isset( $pre_label_font['letterSpacing'] ) && is_array( $pre_label_font['letterSpacing'] ) && isset( $pre_label_font['letterSpacing'][0] ) && ! empty( $pre_label_font['letterSpacing'][0] ) ) {
				$css->add_property( 'letter-spacing', $pre_label_font['letterSpacing'][0] . ( ! isset( $pre_label_font['letterType'] ) ? 'px' : $pre_label_font['letterType'] ) );
			}
			if ( isset( $pre_label_font['textTransform'] ) && ! empty( $pre_label_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $pre_label_font['textTransform'] );
			}
			if ( isset( $pre_label_font['family'] ) && ! empty( $pre_label_font['family'] ) ) {
				$google = isset( $pre_label_font['google'] ) && $pre_label_font['google'] ? true : false;
				$google = $google && ( isset( $pre_label_font['loadGoogle'] ) && $pre_label_font['loadGoogle'] || ! isset( $pre_label_font['loadGoogle'] ) ) ? true : false;
				$css->add_property( 'font-family', $css->render_font_family( $pre_label_font['family'], $google, ( isset( $pre_label_font['variant'] ) ? $pre_label_font['variant'] : '' ), ( isset( $pre_label_font['subset'] ) ? $pre_label_font['subset'] : '' ) ) );
			}
			if ( isset( $pre_label_font['style'] ) && ! empty( $pre_label_font['style'] ) ) {
				$css->add_property( 'font-style', $pre_label_font['style'] );
			}
			if ( isset( $pre_label_font['weight'] ) && ! empty( $pre_label_font['weight'] ) && 'regular' !== $pre_label_font['weight'] ) {
				$css->add_property( 'font-weight', $pre_label_font['weight'] );
			}
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-pre-timer' );
			if ( isset( $pre_label_font['size'] ) && is_array( $pre_label_font['size'] ) && isset( $pre_label_font['size'][1] ) && ! empty( $pre_label_font['size'][1] ) ) {
				if( $css->is_variable_font_size_value( $pre_label_font['size'][1] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $pre_label_font['size'][1] ) );
				} else {
					$css->add_property( 'font-size', $pre_label_font['size'][1] . ( ! isset( $pre_label_font['sizeType'] ) ? 'px' : $pre_label_font['sizeType'] ) );
				}
			}
			if ( isset( $pre_label_font['lineHeight'] ) && is_array( $pre_label_font['lineHeight'] ) && isset( $pre_label_font['lineHeight'][1] ) && ! empty( $pre_label_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $pre_label_font['lineHeight'][1] . ( ! isset( $pre_label_font['lineType'] ) ? 'px' : $pre_label_font['lineType'] ) );
			}
			if ( isset( $pre_label_font['letterSpacing'] ) && is_array( $pre_label_font['letterSpacing'] ) && isset( $pre_label_font['letterSpacing'][1] ) && ! empty( $pre_label_font['letterSpacing'][1] ) ) {
				$css->add_property( 'letter-spacing', $pre_label_font['letterSpacing'][1] . ( ! isset( $pre_label_font['letterType'] ) ? 'px' : $pre_label_font['letterType'] ) );
			}
			$css->set_media_state( 'desktop' );
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-pre-timer' );
			if ( isset( $pre_label_font['size'] ) && is_array( $pre_label_font['size'] ) && isset( $pre_label_font['size'][2] ) && ! empty( $pre_label_font['size'][2] ) ) {
				if( $css->is_variable_font_size_value( $pre_label_font['size'][2] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $pre_label_font['size'][2] ) );
				} else {
					$css->add_property( 'font-size', $pre_label_font['size'][2] . ( ! isset( $pre_label_font['sizeType'] ) ? 'px' : $pre_label_font['sizeType'] ) );
				}
			}
			if ( isset( $pre_label_font['lineHeight'] ) && is_array( $pre_label_font['lineHeight'] ) && isset( $pre_label_font['lineHeight'][2] ) && ! empty( $pre_label_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $pre_label_font['lineHeight'][2] . ( ! isset( $pre_label_font['lineType'] ) ? 'px' : $pre_label_font['lineType'] ) );
			}
			if ( isset( $pre_label_font['letterSpacing'] ) && is_array( $pre_label_font['letterSpacing'] ) && isset( $pre_label_font['letterSpacing'][2] ) && ! empty( $pre_label_font['letterSpacing'][2] ) ) {
				$css->add_property( 'letter-spacing', $pre_label_font['letterSpacing'][2] . ( ! isset( $pre_label_font['letterType'] ) ? 'px' : $pre_label_font['letterType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		$post_label_font = ( isset( $attributes['postLabelFont'] ) && is_array( $attributes['postLabelFont'] ) && isset( $attributes['postLabelFont'][0] ) && is_array( $attributes['postLabelFont'][0] ) ? $attributes['postLabelFont'][0] : array() );
		if ( ! empty( $post_label_font ) || ( isset( $attributes['postLabelColor'] ) && ! empty( $attributes['postLabelColor'] ) ) ) {
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-post-timer' );
			if ( isset( $attributes['postLabelColor'] ) && ! empty( $attributes['postLabelColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attributes['postLabelColor'] ) );
			}
			if ( isset( $post_label_font['size'] ) && is_array( $post_label_font['size'] ) && isset( $post_label_font['size'][0] ) && ! empty( $post_label_font['size'][0] ) ) {
				if( $css->is_variable_font_size_value( $post_label_font['size'][0] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $post_label_font['size'][0] ) );
				} else {
					$css->add_property( 'font-size', $post_label_font['size'][0] . ( ! isset( $post_label_font['sizeType'] ) ? 'px' : $post_label_font['sizeType'] ) );
				}
			}
			if ( isset( $post_label_font['lineHeight'] ) && is_array( $post_label_font['lineHeight'] ) && isset( $post_label_font['lineHeight'][0] ) && ! empty( $post_label_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $post_label_font['lineHeight'][0] . ( ! isset( $post_label_font['lineType'] ) ? 'px' : $post_label_font['lineType'] ) );
			}
			if ( isset( $post_label_font['letterSpacing'] ) && is_array( $post_label_font['letterSpacing'] ) && isset( $post_label_font['letterSpacing'][0] ) && ! empty( $post_label_font['letterSpacing'][0] ) ) {
				$css->add_property( 'letter-spacing', $post_label_font['letterSpacing'][0] . ( ! isset( $post_label_font['letterType'] ) ? 'px' : $post_label_font['letterType'] ) );
			}
			if ( isset( $post_label_font['textTransform'] ) && ! empty( $post_label_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $post_label_font['textTransform'] );
			}
			if ( isset( $post_label_font['family'] ) && ! empty( $post_label_font['family'] ) ) {
				$google = isset( $post_label_font['google'] ) && $post_label_font['google'] ? true : false;
				$google = $google && ( isset( $post_label_font['loadGoogle'] ) && $post_label_font['loadGoogle'] || ! isset( $post_label_font['loadGoogle'] ) ) ? true : false;
				$css->add_property( 'font-family', $css->render_font_family( $post_label_font['family'], $google, ( isset( $post_label_font['variant'] ) ? $post_label_font['variant'] : '' ), ( isset( $post_label_font['subset'] ) ? $post_label_font['subset'] : '' ) ) );
			}
			if ( isset( $post_label_font['style'] ) && ! empty( $post_label_font['style'] ) ) {
				$css->add_property( 'font-style', $post_label_font['style'] );
			}
			if ( isset( $post_label_font['weight'] ) && ! empty( $post_label_font['weight'] ) && 'regular' !== $post_label_font['weight'] ) {
				$css->add_property( 'font-weight', $post_label_font['weight'] );
			}
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-post-timer' );
			if ( isset( $post_label_font['size'] ) && is_array( $post_label_font['size'] ) && isset( $post_label_font['size'][1] ) && ! empty( $post_label_font['size'][1] ) ) {
				if( $css->is_variable_font_size_value( $post_label_font['size'][1] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $post_label_font['size'][1] ) );
				} else {
					$css->add_property( 'font-size', $post_label_font['size'][1] . ( ! isset( $post_label_font['sizeType'] ) ? 'px' : $post_label_font['sizeType'] ) );
				}
			}
			if ( isset( $post_label_font['lineHeight'] ) && is_array( $post_label_font['lineHeight'] ) && isset( $post_label_font['lineHeight'][1] ) && ! empty( $post_label_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $post_label_font['lineHeight'][1] . ( ! isset( $post_label_font['lineType'] ) ? 'px' : $post_label_font['lineType'] ) );
			}
			if ( isset( $post_label_font['letterSpacing'] ) && is_array( $post_label_font['letterSpacing'] ) && isset( $post_label_font['letterSpacing'][1] ) && ! empty( $post_label_font['letterSpacing'][1] ) ) {
				$css->add_property( 'letter-spacing', $post_label_font['letterSpacing'][1] . ( ! isset( $post_label_font['letterType'] ) ? 'px' : $post_label_font['letterType'] ) );
			}
			$css->set_media_state( 'desktop' );
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-post-timer' );
			if ( isset( $post_label_font['size'] ) && is_array( $post_label_font['size'] ) && isset( $post_label_font['size'][2] ) && ! empty( $post_label_font['size'][2] ) ) {
				if( $css->is_variable_font_size_value( $post_label_font['size'][2] ) ) {
					$css->add_property( 'font-size', $css->get_variable_font_size_value( $post_label_font['size'][2] ) );
				} else {
					$css->add_property( 'font-size', $post_label_font['size'][2] . ( ! isset( $post_label_font['sizeType'] ) ? 'px' : $post_label_font['sizeType'] ) );
				}
			}
			if ( isset( $post_label_font['lineHeight'] ) && is_array( $post_label_font['lineHeight'] ) && isset( $post_label_font['lineHeight'][2] ) && ! empty( $post_label_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $post_label_font['lineHeight'][2] . ( ! isset( $post_label_font['lineType'] ) ? 'px' : $post_label_font['lineType'] ) );
			}
			if ( isset( $post_label_font['letterSpacing'] ) && is_array( $post_label_font['letterSpacing'] ) && isset( $post_label_font['letterSpacing'][2] ) && ! empty( $post_label_font['letterSpacing'][2] ) ) {
				$css->add_property( 'letter-spacing', $post_label_font['letterSpacing'][2] . ( ! isset( $post_label_font['letterType'] ) ? 'px' : $post_label_font['letterType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}

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
		//$countdown should grow with each countdown that gets loaded to the page
		static $countdown        = array();
		$campaign_id             = ( ! empty( $attributes['campaignID'] ) ? $attributes['campaignID'] : $unique_id );
		$countdown_type          = ( ! empty( $attributes['countdownType'] ) ? $attributes['countdownType'] : 'date' );
		$site_slug               = apply_filters( 'kadence_blocks_countdown_site_slug', sanitize_title( get_bloginfo( 'name' ) ) );
		$reset_days              = ( isset( $attributes['evergreenReset'] ) && ! empty( $attributes['evergreenReset'] ) ? $attributes['evergreenReset'] : 30 );
		$countdown[ $unique_id ] = array(
			'timestamp'    => ( isset( $attributes['timestamp'] ) ? $attributes['timestamp'] : '' ),
			'type'         => $countdown_type,
			'revealOnLoad' => ( isset( $attributes['revealOnLoad'] ) && $attributes['revealOnLoad'] ? true : false ),
			'stopWatch'    => ( isset( $attributes['timeNumbers'] ) && $attributes['timeNumbers'] ? true : false ),
			'dividers'     => ( isset( $attributes['countdownDivider'] ) && $attributes['countdownDivider'] ? true : false ),
			'action'       => ( isset( $attributes['expireAction'] ) ? $attributes['expireAction'] : 'none' ),
			'redirect'     => ( isset( $attributes['redirectURL'] ) ? $attributes['redirectURL'] : '' ),
			'repeat'	   => ( isset( $attributes['repeat'] ) ? $attributes['repeat'] : '' ),
			'frequency'	   => ( isset( $attributes['frequency'] ) ? $attributes['frequency'] : '' ),
			'stopCount'    => ( isset( $attributes['stopRepeating'] ) ? $attributes['stopRepeating'] : false ),
			'endDate'	   => ( isset( $attributes['endDate'] ) ? $attributes['endDate'] : '' ),
			'reset'        => $reset_days,
			'time_offset'  => get_option( 'gmt_offset' ),
			'campaign_id'  => $campaign_id,
			'evergreen'    => ( 'evergreen' === $countdown_type ? apply_filters( 'kadence_blocks_countdown_evergreen_config', 'query', $campaign_id, $site_slug, $reset_days ) : '' ),
			'strict'       => ( isset( $attributes['evergreenStrict'] ) && $attributes['evergreenStrict'] ? true : false ),
			'hours'        => ( isset( $attributes['evergreenHours'] ) ? $attributes['evergreenHours'] : '' ),
			'minutes'      => ( isset( $attributes['evergreenMinutes'] ) ? $attributes['evergreenMinutes'] : '' ),
			'timer'        => ( isset( $attributes['enableTimer'] ) ? $attributes['enableTimer'] : true ),
			'units'        => ( isset( $attributes['units'] ) ? $attributes['units'] : array(
				array(
					'days'    => true,
					'hours'   => true,
					'minutes' => true,
					'seconds' => true
				)
			) ),
			'preLabel'     => ( isset( $attributes['preLabel'] ) ? $attributes['preLabel'] : '' ),
			'postLabel'    => ( isset( $attributes['postLabel'] ) ? $attributes['postLabel'] : '' ),
			'daysLabel'    => ( isset( $attributes['daysLabel'] ) && ! empty( $attributes['daysLabel'] ) ? $attributes['daysLabel'] : esc_attr__( 'Days', 'kadence-blocks' ) ),
			'hoursLabel'   => ( isset( $attributes['hoursLabel'] ) && ! empty( $attributes['hoursLabel'] ) ? $attributes['hoursLabel'] : esc_attr__( 'Hrs', 'kadence-blocks' ) ),
			'minutesLabel' => ( isset( $attributes['minutesLabel'] ) && ! empty( $attributes['minutesLabel'] ) ? $attributes['minutesLabel'] : esc_attr__( 'Mins', 'kadence-blocks' ) ),
			'secondsLabel' => ( isset( $attributes['secondsLabel'] ) && ! empty( $attributes['secondsLabel'] ) ? $attributes['secondsLabel'] : esc_attr__( 'Secs', 'kadence-blocks' ) ),
		);
		
		wp_localize_script(
			'kadence-blocks-countdown',
			'kadence_blocks_countdown',
			array(
				'ajax_url'   => admin_url( 'admin-ajax.php' ),
				'ajax_nonce' => wp_create_nonce( 'kadence_blocks_countdown' ),
				'site_slug'  => apply_filters( 'kadence_blocks_countdown_site_slug', sanitize_title( get_bloginfo( 'name' ) ) ),
				'timers'     => wp_json_encode( $countdown ),
			)
		);

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

		wp_register_script( 'kadence-blocks-countdown', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-countdown.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}


}

Kadence_Blocks_Countdown_Block::get_instance();
