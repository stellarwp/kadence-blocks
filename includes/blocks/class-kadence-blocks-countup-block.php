<?php
/**
 * Class to Build the Countup Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Countup Block.
 *
 * @category class
 */
class Kadence_Blocks_Countup_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'countup';

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
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		$this->enqueue_script( 'kadence-countup' );
		$this->enqueue_script( 'countup' );

		// Add title font
		if ( isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) && isset( $attributes['titleFont'][0]['google'] ) && $attributes['titleFont'][0]['google'] && ( ! isset( $attributes['titleFont'][0]['loadGoogle'] ) || true === $attributes['titleFont'][0]['loadGoogle'] ) && isset( $attributes['titleFont'][0]['family'] ) ) {
			$title_font = $attributes['titleFont'][0];

			$font_variant = ( ! empty( $title_font['variant'] ) ? array( $title_font['variant'] ) : '' );
			$font_subset  = ( ! empty( $title_font['subset'] ) ? array( $title_font['subset'] ) : '' );

			$css->maybe_add_google_font( $title_font['family'], $font_variant, $font_subset );
		}

		// Add number font
		if ( isset( $attributes['numberFont'] ) && is_array( $attributes['numberFont'] ) && isset( $attributes['numberFont'][0] ) && is_array( $attributes['numberFont'][0] ) && isset( $attributes['numberFont'][0]['google'] ) && $attributes['numberFont'][0]['google'] && ( ! isset( $attributes['numberFont'][0]['loadGoogle'] ) || true === $attributes['numberFont'][0]['loadGoogle'] ) && isset( $attributes['numberFont'][0]['family'] ) ) {
			$numbeer_font = $attributes['numberFont'][0];

			$font_variant = ( ! empty( $numbeer_font['variant'] ) ? array( $numbeer_font['variant'] ) : '' );
			$font_subset  = ( ! empty( $numbeer_font['subset'] ) ? array( $numbeer_font['subset'] ) : '' );

			$css->maybe_add_google_font( $numbeer_font['family'], $font_variant, $font_subset );
		}

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );

		if ( isset( $attributes['titleColor'] ) || isset( $attributes['titleFont'] ) ) {
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );

			if ( isset( $attributes['titleColor'] ) && ! empty( $attributes['titleColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attributes['titleColor'] ) );
			}
			if ( isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && is_array( $attributes['titleFont'][0] ) ) {
				$title_font = $attributes['titleFont'][0];
				if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && ! empty( $title_font['size'][0] ) ) {
					$css->add_property( 'font-size', $title_font['size'][0] . ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) );
				}
				if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && ! empty( $title_font['lineHeight'][0] ) ) {
					$css->add_property( 'line-height', $title_font['lineHeight'][0] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
				}
				if ( isset( $title_font['letterSpacing'] ) && ! empty( $title_font['letterSpacing'] ) ) {
					$css->add_property( 'letter-spacing', $title_font['letterSpacing'] . 'px' );
				}
				if ( isset( $title_font['textTransform'] ) && ! empty( $title_font['textTransform'] ) ) {
					$css->add_property( 'text-transform', $title_font['textTransform'] );
				}
				if ( isset( $title_font['family'] ) && ! empty( $title_font['family'] ) ) {
					$css->add_property( 'font-family', $title_font['family'] );
				}
				if ( isset( $title_font['style'] ) && ! empty( $title_font['style'] ) ) {
					$css->add_property( 'font-style', $title_font['style'] );
				}
				if ( isset( $title_font['weight'] ) && ! empty( $title_font['weight'] ) ) {
					$css->add_property( 'font-weight', $title_font['weight'] );
				}
				if ( isset( $title_font['textTransform'] ) && ! empty( $title_font['textTransform'] ) ) {
					$css->add_property( 'text-transform', $title_font['textTransform'] );
				}
			} else {
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
				$css->add_property( 'font-size', '50px' );
			}
		}

		if ( isset( $attributes['titlePadding'] ) && is_array( $attributes['titlePadding'] ) ) {
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
			if ( isset( $attributes['titlePadding'][0] ) && is_numeric( $attributes['titlePadding'][0] ) ) {
				$css->add_property( 'padding-top', $attributes['titlePadding'][0] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titlePadding'][1] ) && is_numeric( $attributes['titlePadding'][1] ) ) {
				$css->add_property( 'padding-right', $attributes['titlePadding'][1] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titlePadding'][2] ) && is_numeric( $attributes['titlePadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attributes['titlePadding'][2] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titlePadding'][3] ) && is_numeric( $attributes['titlePadding'][3] ) ) {
				$css->add_property( 'padding-left', $attributes['titlePadding'][3] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
		}
		if ( isset( $attributes['titleMargin'] ) && is_array( $attributes['titleMargin'] ) ) {
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
			if ( isset( $attributes['titleMargin'][0] ) && is_numeric( $attributes['titleMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attributes['titleMargin'][0] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMargin'][1] ) && is_numeric( $attributes['titleMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attributes['titleMargin'][1] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMargin'][2] ) && is_numeric( $attributes['titleMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attributes['titleMargin'][2] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMargin'][3] ) && is_numeric( $attributes['titleMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attributes['titleMargin'][3] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
		}
		if ( isset( $attributes['titleTabletPadding'] ) && is_array( $attributes['titleTabletPadding'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
			if ( isset( $attributes['titleTabletPadding'][0] ) && is_numeric( $attributes['titleTabletPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attributes['titleTabletPadding'][0] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titleTabletPadding'][1] ) && is_numeric( $attributes['titleTabletPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attributes['titleTabletPadding'][1] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titleTabletPadding'][2] ) && is_numeric( $attributes['titleTabletPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attributes['titleTabletPadding'][2] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titleTabletPadding'][3] ) && is_numeric( $attributes['titleTabletPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attributes['titleTabletPadding'][3] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['titleMobilePadding'] ) && is_array( $attributes['titleMobilePadding'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
			if ( isset( $attributes['titleMobilePadding'][0] ) && is_numeric( $attributes['titleMobilePadding'][0] ) ) {
				$css->add_property( 'padding-top', $attributes['titleMobilePadding'][0] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMobilePadding'][1] ) && is_numeric( $attributes['titleMobilePadding'][1] ) ) {
				$css->add_property( 'padding-right', $attributes['titleMobilePadding'][1] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMobilePadding'][2] ) && is_numeric( $attributes['titleMobilePadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attributes['titleMobilePadding'][2] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMobilePadding'][3] ) && is_numeric( $attributes['titleMobilePadding'][3] ) ) {
				$css->add_property( 'padding-left', $attributes['titleMobilePadding'][3] . ( isset( $attributes['titlePaddingType'] ) ? $attributes['titlePaddingType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['titleTabletMargin'] ) && is_array( $attributes['titleTabletMargin'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
			if ( isset( $attributes['titleTabletMargin'][0] ) && is_numeric( $attributes['titleTabletMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attributes['titleTabletMargin'][0] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleTabletMargin'][1] ) && is_numeric( $attributes['titleTabletMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attributes['titleTabletMargin'][1] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleTabletMargin'][2] ) && is_numeric( $attributes['titleTabletMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attributes['titleTabletMargin'][2] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleTabletMargin'][3] ) && is_numeric( $attributes['titleTabletMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attributes['titleTabletMargin'][3] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['titleMobileMargin'] ) && is_array( $attributes['titleMobileMargin'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
			if ( isset( $attributes['titleMobileMargin'][0] ) && is_numeric( $attributes['titleMobileMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attributes['titleMobileMargin'][0] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMobileMargin'][1] ) && is_numeric( $attributes['titleMobileMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attributes['titleMobileMargin'][1] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMobileMargin'][2] ) && is_numeric( $attributes['titleMobileMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attributes['titleMobileMargin'][2] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['titleMobileMargin'][3] ) && is_numeric( $attributes['titleMobileMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attributes['titleMobileMargin'][3] . ( isset( $attributes['titleMarginType'] ) ? $attributes['titleMarginType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) && ( ( isset( $attributes['titleFont'][0]['size'] ) && is_array( $attributes['titleFont'][0]['size'] ) && isset( $attributes['titleFont'][0]['size'][1] ) && ! empty( $attributes['titleFont'][0]['size'][1] ) ) || ( isset( $attributes['titleFont'][0]['lineHeight'] ) && is_array( $attributes['titleFont'][0]['lineHeight'] ) && isset( $attributes['titleFont'][0]['lineHeight'][1] ) && ! empty( $attributes['titleFont'][0]['lineHeight'][1] ) ) ) ) {
			$css->set_media_state( 'tablet' ); //  767px) and (max-width: 1024px
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );

			if ( isset( $attributes['titleFont'][0]['size'][1] ) && ! empty( $attributes['titleFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attributes['titleFont'][0]['size'][1] . ( ! isset( $attributes['titleFont'][0]['sizeType'] ) ? 'px' : $attributes['titleFont'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['titleFont'][0]['lineHeight'][1] ) && ! empty( $attributes['titleFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attributes['titleFont'][0]['lineHeight'][1] . ( ! isset( $attributes['titleFont'][0]['lineType'] ) ? 'px' : $attributes['titleFont'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) && ( ( isset( $attributes['titleFont'][0]['size'] ) && is_array( $attributes['titleFont'][0]['size'] ) && isset( $attributes['titleFont'][0]['size'][2] ) && ! empty( $attributes['titleFont'][0]['size'][2] ) ) || ( isset( $attributes['titleFont'][0]['lineHeight'] ) && is_array( $attributes['titleFont'][0]['lineHeight'] ) && isset( $attributes['titleFont'][0]['lineHeight'][2] ) && ! empty( $attributes['titleFont'][0]['lineHeight'][2] ) ) ) ) {
			$css->set_media_state( 'mobile' ); // max-width: 767px
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-titletle' );

			if ( isset( $attributes['titleFont'][0]['size'][2] ) && ! empty( $attributes['titleFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attributes['titleFont'][0]['size'][2] . ( ! isset( $attributes['titleFont'][0]['sizeType'] ) ? 'px' : $attributes['titleFont'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['titleFont'][0]['lineHeight'][2] ) && ! empty( $attributes['titleFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attributes['titleFont'][0]['lineHeight'][2] . ( ! isset( $attributes['titleFont'][0]['lineType'] ) ? 'px' : $attributes['titleFont'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['titleMinHeight'] ) && is_array( $attributes['titleMinHeight'] ) && isset( $attributes['titleMinHeight'][0] ) ) {
			if ( is_numeric( $attributes['titleMinHeight'][0] ) ) {
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
				$css->add_property( 'min-height', $attributes['titleMinHeight'][0] . 'px' );
			}
			if ( isset( $attributes['titleMinHeight'][1] ) && is_numeric( $attributes['titleMinHeight'][1] ) ) {
				$css->set_media_state( 'tablet' ); //  767px) and (max-width: 1024px
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
				$css->add_property( 'min-height', $attributes['titleMinHeight'][1] . 'px' );
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $attributes['titleMinHeight'][2] ) && is_numeric( $attributes['titleMinHeight'][2] ) ) {
				$css->set_media_state( 'mobile' ); //  767px
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
				$css->add_property( 'min-height', $attributes['titleMinHeight'][2] . 'px' );
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['titleAlign'] ) ) {
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );

			if ( ! empty( $attributes['titleAlign'][0] ) ) {
				$css->add_property( 'text-align', $attributes['titleAlign'][0] );
			}

			if ( ! empty( $attributes['titleAlign'][1] ) ) {
				$css->set_media_state( 'tablet' ); //  767px) and (max-width: 1024px
				$css->add_property( 'text-align', $attributes['titleAlign'][1] );
				$css->set_media_state( 'desktop' );
			}

			if ( ! empty( $attributes['titleAlign'][2] ) ) {
				$css->set_media_state( 'mobile' ); //  767px) and (max-width: 1024px
				$css->add_property( 'text-align', $attributes['titleAlign'][2] );
				$css->set_media_state( 'desktop' );
			}

		}

		$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );

		if ( isset( $attributes['numberColor'] ) && ! empty( $attributes['numberColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['numberColor'] ) );
		}

		if ( isset( $attributes['numberFont'] ) && is_array( $attributes['numberFont'] ) && is_array( $attributes['numberFont'][0] ) ) {
			$number_font = $attributes['numberFont'][0];
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && ! empty( $number_font['size'][0] ) ) {
				$css->add_property( 'font-size', $number_font['size'][0] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
			}
			if ( isset( $number_font['lineHeight'] ) && is_array( $number_font['lineHeight'] ) && ! empty( $number_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $number_font['lineHeight'][0] . ( ! isset( $number_font['lineType'] ) ? 'px' : $number_font['lineType'] ) );
			}
			if ( isset( $number_font['letterSpacing'] ) && ! empty( $number_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $number_font['letterSpacing'] . 'px' );
			}
			if ( isset( $number_font['textTransform'] ) && ! empty( $number_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $number_font['textTransform'] );
			}
			if ( isset( $number_font['family'] ) && ! empty( $number_font['family'] ) ) {
				$css->add_property( 'font-family', $number_font['family'] );
			}
			if ( isset( $number_font['style'] ) && ! empty( $number_font['style'] ) ) {
				$css->add_property( 'font-style', $number_font['style'] );
			}
			if ( isset( $number_font['weight'] ) && ! empty( $number_font['weight'] ) ) {
				$css->add_property( 'font-weight', $number_font['weight'] );
			}
			if ( isset( $number_font['padding'] ) && is_array( $number_font['padding'] ) ) {
				$css->add_property( 'padding', $number_font['padding'][0] . 'px ' . $number_font['padding'][1] . 'px ' . $number_font['padding'][2] . 'px ' . $number_font['padding'][3] . 'px' );
			}
			if ( isset( $number_font['margin'] ) && is_array( $number_font['margin'] ) ) {
				$css->add_property( 'margin', $number_font['margin'][0] . 'px ' . $number_font['margin'][1] . 'px ' . $number_font['margin'][2] . 'px ' . $number_font['margin'][3] . 'px' );
			}
		} else {
			$css->add_property( 'font-size', '50px' );
		}


		if ( isset( $attributes['numberPadding'] ) && is_array( $attributes['numberPadding'] ) ) {
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
			if ( isset( $attributes['numberPadding'][0] ) && is_numeric( $attributes['numberPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attributes['numberPadding'][0] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberPadding'][1] ) && is_numeric( $attributes['numberPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attributes['numberPadding'][1] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberPadding'][2] ) && is_numeric( $attributes['numberPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attributes['numberPadding'][2] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberPadding'][3] ) && is_numeric( $attributes['numberPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attributes['numberPadding'][3] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
		}
		if ( isset( $attributes['numberMargin'] ) && is_array( $attributes['numberMargin'] ) ) {
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
			if ( isset( $attributes['numberMargin'][0] ) && is_numeric( $attributes['numberMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attributes['numberMargin'][0] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMargin'][1] ) && is_numeric( $attributes['numberMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attributes['numberMargin'][1] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMargin'][2] ) && is_numeric( $attributes['numberMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attributes['numberMargin'][2] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMargin'][3] ) && is_numeric( $attributes['numberMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attributes['numberMargin'][3] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
		}
		if ( isset( $attributes['numberTabletPadding'] ) && is_array( $attributes['numberTabletPadding'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
			if ( isset( $attributes['numberTabletPadding'][0] ) && is_numeric( $attributes['numberTabletPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attributes['numberTabletPadding'][0] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberTabletPadding'][1] ) && is_numeric( $attributes['numberTabletPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attributes['numberTabletPadding'][1] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberTabletPadding'][2] ) && is_numeric( $attributes['numberTabletPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attributes['numberTabletPadding'][2] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberTabletPadding'][3] ) && is_numeric( $attributes['numberTabletPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attributes['numberTabletPadding'][3] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['numberMobilePadding'] ) && is_array( $attributes['numberMobilePadding'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
			if ( isset( $attributes['numberMobilePadding'][0] ) && is_numeric( $attributes['numberMobilePadding'][0] ) ) {
				$css->add_property( 'padding-top', $attributes['numberMobilePadding'][0] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMobilePadding'][1] ) && is_numeric( $attributes['numberMobilePadding'][1] ) ) {
				$css->add_property( 'padding-right', $attributes['numberMobilePadding'][1] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMobilePadding'][2] ) && is_numeric( $attributes['numberMobilePadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attributes['numberMobilePadding'][2] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMobilePadding'][3] ) && is_numeric( $attributes['numberMobilePadding'][3] ) ) {
				$css->add_property( 'padding-left', $attributes['numberMobilePadding'][3] . ( isset( $attributes['numberPaddingType'] ) ? $attributes['numberPaddingType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['numberTabletMargin'] ) && is_array( $attributes['numberTabletMargin'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
			if ( isset( $attributes['numberTabletMargin'][0] ) && is_numeric( $attributes['numberTabletMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attributes['numberTabletMargin'][0] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberTabletMargin'][1] ) && is_numeric( $attributes['numberTabletMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attributes['numberTabletMargin'][1] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberTabletMargin'][2] ) && is_numeric( $attributes['numberTabletMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attributes['numberTabletMargin'][2] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberTabletMargin'][3] ) && is_numeric( $attributes['numberTabletMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attributes['numberTabletMargin'][3] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['numberMobileMargin'] ) && is_array( $attributes['numberMobileMargin'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
			if ( isset( $attributes['numberMobileMargin'][0] ) && is_numeric( $attributes['numberMobileMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attributes['numberMobileMargin'][0] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMobileMargin'][1] ) && is_numeric( $attributes['numberMobileMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attributes['numberMobileMargin'][1] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMobileMargin'][2] ) && is_numeric( $attributes['numberMobileMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attributes['numberMobileMargin'][2] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			if ( isset( $attributes['numberMobileMargin'][3] ) && is_numeric( $attributes['numberMobileMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attributes['numberMobileMargin'][3] . ( isset( $attributes['numberMarginType'] ) ? $attributes['numberMarginType'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['numberAlign'] ) ) {
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );

			if ( ! empty( $attributes['numberAlign'][0] ) ) {
				$css->add_property( 'text-align', $attributes['numberAlign'][0] );
			}

			if ( ! empty( $attributes['numberAlign'][1] ) ) {
				$css->set_media_state( 'tablet' ); //  767px) and (max-width: 1024px
				$css->add_property( 'text-align', $attributes['numberAlign'][1] );
				$css->set_media_state( 'desktop' );
			}

			if ( ! empty( $attributes['numberAlign'][2] ) ) {
				$css->set_media_state( 'mobile' ); //  767px) and (max-width: 1024px
				$css->add_property( 'text-align', $attributes['numberAlign'][2] );
				$css->set_media_state( 'desktop' );
			}

		}
		if ( isset( $attributes['numberFont'] ) && is_array( $attributes['numberFont'] ) && isset( $attributes['numberFont'][0] ) && is_array( $attributes['numberFont'][0] ) && ( ( isset( $attributes['numberFont'][0]['size'] ) && is_array( $attributes['numberFont'][0]['size'] ) && isset( $attributes['numberFont'][0]['size'][1] ) && ! empty( $attributes['numberFont'][0]['size'][1] ) ) || ( isset( $attributes['numberFont'][0]['lineHeight'] ) && is_array( $attributes['numberFont'][0]['lineHeight'] ) && isset( $attributes['numberFont'][0]['lineHeight'][1] ) && ! empty( $attributes['numberFont'][0]['lineHeight'][1] ) ) ) ) {
			$css->set_media_state( 'tablet' ); //  767px) and (max-width: 1024px
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );


			if ( isset( $attributes['numberFont'][0]['size'][1] ) && ! empty( $attributes['numberFont'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attributes['numberFont'][0]['size'][1] . ( ! isset( $attributes['numberFont'][0]['sizeType'] ) ? 'px' : $attributes['numberFont'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['numberFont'][0]['lineHeight'][1] ) && ! empty( $attributes['numberFont'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attributes['numberFont'][0]['lineHeight'][1] . ( ! isset( $attributes['numberFont'][0]['lineType'] ) ? 'px' : $attributes['numberFont'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['numberFont'] ) && is_array( $attributes['numberFont'] ) && isset( $attributes['numberFont'][0] ) && is_array( $attributes['numberFont'][0] ) && ( ( isset( $attributes['numberFont'][0]['size'] ) && is_array( $attributes['numberFont'][0]['size'] ) && isset( $attributes['numberFont'][0]['size'][2] ) && ! empty( $attributes['numberFont'][0]['size'][2] ) ) || ( isset( $attributes['numberFont'][0]['lineHeight'] ) && is_array( $attributes['numberFont'][0]['lineHeight'] ) && isset( $attributes['numberFont'][0]['lineHeight'][2] ) && ! empty( $attributes['numberFont'][0]['lineHeight'][2] ) ) ) ) {
			$css->set_media_state( 'mobile' );
			$css->add_property( '.kb-count-up-' . $unique_id . ' .kb-count-up-numbertle' );

			if ( isset( $attributes['numberFont'][0]['size'][2] ) && ! empty( $attributes['numberFont'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attributes['numberFont'][0]['size'][2] . ( ! isset( $attributes['numberFont'][0]['sizeType'] ) ? 'px' : $attributes['numberFont'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['numberFont'][0]['lineHeight'][2] ) && ! empty( $attributes['numberFont'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attributes['numberFont'][0]['lineHeight'][2] . ( ! isset( $attributes['numberFont'][0]['lineType'] ) ? 'px' : $attributes['numberFont'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['numberMinHeight'] ) && is_array( $attributes['numberMinHeight'] ) && isset( $attributes['numberMinHeight'][0] ) ) {
			if ( is_numeric( $attributes['numberMinHeight'][0] ) ) {
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
				$css->add_property( 'min-height', $attributes['numberMinHeight'][0] . 'px' );
			}
			if ( isset( $attributes['numberMinHeight'][1] ) && is_numeric( $attributes['numberMinHeight'][1] ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
				$css->add_property( 'min-height', $attributes['numberMinHeight'][1] . 'px' );
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $attributes['numberMinHeight'][2] ) && is_numeric( $attributes['numberMinHeight'][2] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
				$css->add_property( 'min-height', $attributes['numberMinHeight'][2] . 'px' );
				$css->set_media_state( 'desktop' );
			}
		}

		return $css->css_output();
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		// Skip calling parent because this block does not have a dedicated CSS file.
//		parent::register_scripts();

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}

		wp_register_script( 'kadence-countup', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-countup.min.js', array( 'countup' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'countup', KADENCE_BLOCKS_URL . 'includes/assets/js/countUp.min.js', array(), KADENCE_BLOCKS_VERSION, true );

	}
}

Kadence_Blocks_Countup_Block::get_instance();
