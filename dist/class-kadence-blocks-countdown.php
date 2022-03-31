<?php
/**
 * Setup the Countdown Block.
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
class Kadence_Blocks_Countdown {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Google fonts to enqueue
	 *
	 * @var array
	 */
	public static $gfonts = array();

	/**
	 * Countdown Block information.
	 *
	 * @var array
	 */
	public static $countdown = array();


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
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'on_init' ), 20 );
		add_action( 'enqueue_block_assets', array( $this, 'blocks_assets' ) );
		add_action( 'wp_head', array( $this, 'frontend_gfonts' ), 85 );
		add_action( 'wp_footer', array( $this, 'countdown_enqueue' ), 1 );
	}
	/**
	 * Render Inline CSS helper function
	 *
	 * @param array  $css the css for each rendered block.
	 * @param string $style_id the unique id for the rendered style.
	 * @param bool   $in_content the bool for whether or not it should run in content.
	 */
	public function render_inline_css( $css, $style_id, $in_content = false ) {
		if ( ! is_admin() ) {
			wp_register_style( $style_id, false );
			wp_enqueue_style( $style_id );
			wp_add_inline_style( $style_id, $css );
			if ( 1 === did_action( 'wp_head' ) && $in_content ) {
				wp_print_styles( $style_id );
			}
		}
	}
	/**
	 * Enqueue Frontend Fonts
	 */
	public function frontend_gfonts() {
		if ( empty( self::$gfonts ) ) {
			return;
		}
		if ( class_exists( 'Kadence_Blocks_Frontend' ) ) {
			$ktblocks_instance = Kadence_Blocks_Frontend::get_instance();
			foreach ( self::$gfonts as $key => $gfont_values ) {
				if ( ! in_array( $key, $ktblocks_instance::$gfonts, true ) ) {
					$add_font = array(
						'fontfamily' => $gfont_values['fontfamily'],
						'fontvariants' => ( isset( $gfont_values['fontvariants'] ) && ! empty( $gfont_values['fontvariants'] ) ? $gfont_values['fontvariants'] : array() ),
						'fontsubsets' => ( isset(  $gfont_values['fontsubsets'] ) && !empty(  $gfont_values['fontsubsets'] ) ? $gfont_values['fontsubsets'] : array() ),
					);
					$ktblocks_instance::$gfonts[ $key ] = $add_font;
				} else {
					foreach ( $gfont_values['fontvariants'] as $gfontvariant_values ) {
						if ( ! in_array( $gfontvariant_values, $ktblocks_instance::$gfonts[ $key ]['fontvariants'], true ) ) {
							$ktblocks_instance::$gfonts[ $key ]['fontvariants'] = $gfontvariant_values;
						}
					}
					foreach ( $gfont_values['fontsubsets'] as $gfontsubset_values ) {
						if ( ! in_array( $gfontsubset_values, $ktblocks_instance::$gfonts[ $key ]['fontsubsets'], true ) ) {
							$ktblocks_instance::$gfonts[ $key ]['fontsubsets'] = $gfontsubset_values;
						}
					}
				}
			}
		}
	}
	/**
	 *
	 * Register and Enqueue block assets
	 *
	 * @since 1.0.0
	 */
	public function blocks_assets() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		$this->register_scripts();
	}
	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		// Lets register all the block styles.
		wp_register_style( 'kadence-blocks-countdown', KADENCE_BLOCKS_URL . 'dist/blocks/countdown.style.build.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-blocks-countdown', KADENCE_BLOCKS_URL . 'dist/assets/js/kb-countdown.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}
	/**
	 * Registers and enqueue's script.
	 *
	 * @param string  $handle the handle for the script.
	 */
	public function enqueue_script( $handle ) {
		if ( ! wp_script_is( $handle, 'registered' ) ) {
			$this->register_scripts();
		}
		wp_enqueue_script( $handle );
	}
	/**
	 * Registers and enqueue's styles.
	 *
	 * @param string  $handle the handle for the script.
	 */
	public function enqueue_style( $handle ) {
		if ( ! wp_style_is( $handle, 'registered' ) ) {
			$this->register_scripts();
		}
		wp_enqueue_style( $handle );
	}
	/**
	 * On init startup.
	 */
	public function on_init() {
		// Only load if Gutenberg is available.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}
		register_block_type(
			'kadence/countdown',
			array(
				'render_callback' => array( $this, 'render_countdown' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
	}
	/**
	 * Render Countdown Block
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_countdown( $attributes, $content ) {
		if ( ! is_array( $attributes ) ) {
			return;
		}
		if ( ! wp_style_is( 'kadence-blocks-countdown', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-countdown' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id      = $attributes['uniqueID'];
			$campaign_id    = ( isset( $attributes['campaignID'] ) && ! empty( $attributes['campaignID'] ) ? $attributes['campaignID'] : $unique_id );
			$countdown_type = ( isset( $attributes['countdownType'] ) && ! empty( $attributes['countdownType'] ) ? $attributes['countdownType'] : 'date' );
			$site_slug      = apply_filters( 'kadence_blocks_countdown_site_slug', sanitize_title( get_bloginfo( 'name' ) ) );
			$reset_days     = ( isset( $attributes['evergreenReset'] ) && ! empty( $attributes['evergreenReset'] ) ? $attributes['evergreenReset'] : 30 );
			self::$countdown[ $unique_id ] = array(
				'timestamp'    => ( isset( $attributes['timestamp'] ) ? $attributes['timestamp'] : '' ),
				'type'         => $countdown_type,
				'revealOnLoad' => ( isset( $attributes['revealOnLoad'] ) && $attributes['revealOnLoad'] ? true : false ),
				'stopWatch'    => ( isset( $attributes['timeNumbers'] ) && $attributes['timeNumbers'] ? true : false ),
				'dividers'     => ( isset( $attributes['countdownDivider'] ) && $attributes['countdownDivider'] ? true : false ),
				'action'       => ( isset( $attributes['expireAction'] ) ? $attributes['expireAction'] : 'none' ),
				'redirect'     => ( isset( $attributes['redirectURL'] ) ? $attributes['redirectURL'] : '' ),
				'reset'        => $reset_days,
				'campaign_id'  => $campaign_id,
				'evergreen'    => ( 'evergreen' === $countdown_type ? apply_filters( 'kadence_blocks_countdown_evergreen_config', 'query', $campaign_id, $site_slug, $reset_days ) : '' ),
				'strict'       => ( isset( $attributes['evergreenStrict'] ) && $attributes['evergreenStrict'] ? true : false ),
				'hours'        => ( isset( $attributes['evergreenHours'] ) ? $attributes['evergreenHours'] : '' ),
				'minutes'      => ( isset( $attributes['evergreenMinutes'] ) ? $attributes['evergreenMinutes'] : '' ),
				'timer'        => ( isset( $attributes['enableTimer'] ) ? $attributes['enableTimer'] : true ),
				'units'        => ( isset( $attributes['units'] ) ? $attributes['units'] : array( array( 'days' => true, 'hours' => true, 'minutes' => true, 'seconds' => true ) ) ),
				'preLabel'     => ( isset( $attributes['preLabel'] ) ? $attributes['preLabel'] : '' ),
				'postLabel'    => ( isset( $attributes['postLabel'] ) ? $attributes['postLabel'] : '' ),
				'daysLabel'    => ( isset( $attributes['daysLabel'] ) && ! empty( $attributes['daysLabel'] ) ? $attributes['daysLabel'] : esc_attr__( 'Days', 'kadence-blocks' ) ),
				'hoursLabel'   => ( isset( $attributes['hoursLabel'] ) && ! empty( $attributes['hoursLabel'] ) ? $attributes['hoursLabel'] : esc_attr__( 'Hrs', 'kadence-blocks' ) ),
				'minutesLabel' => ( isset( $attributes['minutesLabel'] ) && ! empty( $attributes['minutesLabel'] ) ? $attributes['minutesLabel'] : esc_attr__( 'Mins', 'kadence-blocks' ) ),
				'secondsLabel' => ( isset( $attributes['secondsLabel'] ) && ! empty( $attributes['secondsLabel'] ) ? $attributes['secondsLabel'] : esc_attr__( 'Secs', 'kadence-blocks' ) ),
			);
			$style_id = 'kb-countdown' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_countdown_render_block_attributes', $attributes );
				wp_enqueue_script( 'kadence-blocks-countdown' );
				$css = $this->output_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Output CSS styling for countdown Block
	 *
	 * @param array  $attr the block attributes.
	 * @param string $unique_id the block id.
	 */
	public function output_css( $attr, $unique_id ) {
		$css                          = new Kadence_Blocks_CSS();
		$media_query                  = array();
		$media_query['mobile']        = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['mobileReverse'] = apply_filters( 'kadence_mobile_reverse_media_query', '(min-width: 768px)' );
		$media_query['tablet']        = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['tabletOnly']    = apply_filters( 'kadence_tablet_only_media_query', '@media (min-width: 768px) and (max-width: 1024px)' );
		$media_query['desktop']       = apply_filters( 'kadence_tablet_media_query', '(min-width: 1025px)' );

		if ( isset( $attr['background'] ) || isset( $attr['border'] ) || ( isset( $attr['borderRadius'] ) && is_array( $attr['borderRadius'] ) ) || ( isset( $attr['borderWidth'] ) && is_array( $attr['borderWidth'] ) ) ) {
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['background'] ) && ! empty( $attr['background'] ) ) {
				$css->add_property( 'background', $css->render_color( $attr['background'] ) );
			}
			if ( isset( $attr['border'] ) && ! empty( $attr['border'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attr['border'] ) );
			}
			if ( isset( $attr['borderRadius'] ) && is_array( $attr['borderRadius'] ) ) {
				if ( isset( $attr['borderRadius'][0] ) && is_numeric( $attr['borderRadius'][0] ) ) {
					$css->add_property( 'border-top-left-radius', $attr['borderRadius'][0] . 'px' );
				}
				if ( isset( $attr['borderRadius'][1] ) && is_numeric( $attr['borderRadius'][1] ) ) {
					$css->add_property( 'border-top-right-radius', $attr['borderRadius'][1] . 'px' );
				}
				if ( isset( $attr['borderRadius'][2] ) && is_numeric( $attr['borderRadius'][2] ) ) {
					$css->add_property( 'border-bottom-right-radius', $attr['borderRadius'][2] . 'px' );
				}
				if ( isset( $attr['borderRadius'][3] ) && is_numeric( $attr['borderRadius'][3] ) ) {
					$css->add_property( 'border-bottom-left-radius', $attr['borderRadius'][3] . 'px' );
				}
			}
			if ( isset( $attr['borderWidth'] ) && is_array( $attr['borderWidth'] ) ) {
				if ( isset( $attr['borderWidth'][0] ) && is_numeric( $attr['borderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['borderWidth'][0] . 'px' );
				}
				if ( isset( $attr['borderWidth'][1] ) && is_numeric( $attr['borderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['borderWidth'][1] . 'px' );
				}
				if ( isset( $attr['borderWidth'][2] ) && is_numeric( $attr['borderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['borderWidth'][2] . 'px' );
				}
				if ( isset( $attr['borderWidth'][3] ) && is_numeric( $attr['borderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['borderWidth'][3] . 'px' );
				}
			}
		}
		if ( isset( $attr['tabletBorderWidth'] ) && is_array( $attr['tabletBorderWidth'] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['tabletBorderWidth'][0] ) && is_numeric( $attr['tabletBorderWidth'][0] ) ) {
				$css->add_property( 'border-top-width', $attr['tabletBorderWidth'][0] . 'px' );
			}
			if ( isset( $attr['tabletBorderWidth'][1] ) && is_numeric( $attr['tabletBorderWidth'][1] ) ) {
				$css->add_property( 'border-right-width', $attr['tabletBorderWidth'][1] . 'px' );
			}
			if ( isset( $attr['tabletBorderWidth'][2] ) && is_numeric( $attr['tabletBorderWidth'][2] ) ) {
				$css->add_property( 'border-bottom-width', $attr['tabletBorderWidth'][2] . 'px' );
			}
			if ( isset( $attr['tabletBorderWidth'][3] ) && is_numeric( $attr['tabletBorderWidth'][3] ) ) {
				$css->add_property( 'border-left-width', $attr['tabletBorderWidth'][3] . 'px' );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['mobileBorderWidth'] ) && is_array( $attr['mobileBorderWidth'] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['mobileBorderWidth'][0] ) && is_numeric( $attr['mobileBorderWidth'][0] ) ) {
				$css->add_property( 'border-top-width', $attr['mobileBorderWidth'][0] . 'px' );
			}
			if ( isset( $attr['mobileBorderWidth'][1] ) && is_numeric( $attr['mobileBorderWidth'][1] ) ) {
				$css->add_property( 'border-right-width', $attr['mobileBorderWidth'][1] . 'px' );
			}
			if ( isset( $attr['mobileBorderWidth'][2] ) && is_numeric( $attr['mobileBorderWidth'][2] ) ) {
				$css->add_property( 'border-bottom-width', $attr['mobileBorderWidth'][2] . 'px' );
			}
			if ( isset( $attr['mobileBorderWidth'][3] ) && is_numeric( $attr['mobileBorderWidth'][3] ) ) {
				$css->add_property( 'border-left-width', $attr['mobileBorderWidth'][3] . 'px' );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['containerPadding'] ) && is_array( $attr['containerPadding'] ) ) {
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['containerPadding'][0] ) && is_numeric( $attr['containerPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['containerPadding'][0] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerPadding'][1] ) && is_numeric( $attr['containerPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['containerPadding'][1] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerPadding'][2] ) && is_numeric( $attr['containerPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['containerPadding'][2] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerPadding'][3] ) && is_numeric( $attr['containerPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['containerPadding'][3] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
		}
		if ( isset( $attr['containerMargin'] ) && is_array( $attr['containerMargin'] ) ) {
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['containerMargin'][0] ) && is_numeric( $attr['containerMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attr['containerMargin'][0] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerMargin'][1] ) && is_numeric( $attr['containerMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attr['containerMargin'][1] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerMargin'][2] ) && is_numeric( $attr['containerMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attr['containerMargin'][2] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerMargin'][3] ) && is_numeric( $attr['containerMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attr['containerMargin'][3] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
		}
		if ( isset( $attr['containerTabletPadding'] ) && is_array( $attr['containerTabletPadding'] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['containerTabletPadding'][0] ) && is_numeric( $attr['containerTabletPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['containerTabletPadding'][0] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletPadding'][1] ) && is_numeric( $attr['containerTabletPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['containerTabletPadding'][1] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletPadding'][2] ) && is_numeric( $attr['containerTabletPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['containerTabletPadding'][2] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletPadding'][3] ) && is_numeric( $attr['containerTabletPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['containerTabletPadding'][3] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['containerMobilePadding'] ) && is_array( $attr['containerMobilePadding'] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['containerMobilePadding'][0] ) && is_numeric( $attr['containerMobilePadding'][0] ) ) {
				$css->add_property( 'padding-top', $attr['containerMobilePadding'][0] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobilePadding'][1] ) && is_numeric( $attr['containerMobilePadding'][1] ) ) {
				$css->add_property( 'padding-right', $attr['containerMobilePadding'][1] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobilePadding'][2] ) && is_numeric( $attr['containerMobilePadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attr['containerMobilePadding'][2] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobilePadding'][3] ) && is_numeric( $attr['containerMobilePadding'][3] ) ) {
				$css->add_property( 'padding-left', $attr['containerMobilePadding'][3] . ( isset( $attr['paddingType'] ) ? $attr['paddingType'] : 'px' ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['containerTabletMargin'] ) && is_array( $attr['containerTabletMargin'] ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['containerTabletMargin'][0] ) && is_numeric( $attr['containerTabletMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attr['containerTabletMargin'][0] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletMargin'][1] ) && is_numeric( $attr['containerTabletMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attr['containerTabletMargin'][1] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletMargin'][2] ) && is_numeric( $attr['containerTabletMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attr['containerTabletMargin'][2] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerTabletMargin'][3] ) && is_numeric( $attr['containerTabletMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attr['containerTabletMargin'][3] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['containerMobileMargin'] ) && is_array( $attr['containerMobileMargin'] ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kb-countdown-container-' . $unique_id );
			if ( isset( $attr['containerMobileMargin'][0] ) && is_numeric( $attr['containerMobileMargin'][0] ) ) {
				$css->add_property( 'margin-top', $attr['containerMobileMargin'][0] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobileMargin'][1] ) && is_numeric( $attr['containerMobileMargin'][1] ) ) {
				$css->add_property( 'margin-right', $attr['containerMobileMargin'][1] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobileMargin'][2] ) && is_numeric( $attr['containerMobileMargin'][2] ) ) {
				$css->add_property( 'margin-bottom', $attr['containerMobileMargin'][2] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			if ( isset( $attr['containerMobileMargin'][3] ) && is_numeric( $attr['containerMobileMargin'][3] ) ) {
				$css->add_property( 'margin-left', $attr['containerMobileMargin'][3] . ( isset( $attr['marginType'] ) ? $attr['marginType'] : 'px' ) );
			}
			$css->stop_media_query();
		}
		if ( isset( $attr['itemBackground'] ) || isset( $attr['itemBorder'] ) || ( isset( $attr['itemBorderRadius'] ) && is_array( $attr['itemBorderRadius'] ) ) || ( isset( $attr['itemBorderWidth'] ) && is_array( $attr['itemBorderWidth'] ) ) || ( isset( $attr['itemPadding'] ) && is_array( $attr['itemPadding'] ) ) ) {
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item:not( .kb-countdown-divider-item )' );
			if ( isset( $attr['itemBackground'] ) && ! empty( $attr['itemBackground'] ) ) {
				$css->add_property( 'background', $css->render_color( $attr['itemBackground'] ) );
			}
			if ( isset( $attr['itemBorder'] ) && ! empty( $attr['itemBorder'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attr['itemBorder'] ) );
			}
			if ( isset( $attr['itemBorderRadius'] ) && is_array( $attr['itemBorderRadius'] ) ) {
				if ( isset( $attr['itemBorderRadius'][0] ) && is_numeric( $attr['itemBorderRadius'][0] ) ) {
					$css->add_property( 'border-top-left-radius', $attr['itemBorderRadius'][0] . 'px' );
				}
				if ( isset( $attr['itemBorderRadius'][1] ) && is_numeric( $attr['itemBorderRadius'][1] ) ) {
					$css->add_property( 'border-top-right-radius', $attr['itemBorderRadius'][1] . 'px' );
				}
				if ( isset( $attr['itemBorderRadius'][2] ) && is_numeric( $attr['itemBorderRadius'][2] ) ) {
					$css->add_property( 'border-bottom-right-radius', $attr['itemBorderRadius'][2] . 'px' );
				}
				if ( isset( $attr['itemBorderRadius'][3] ) && is_numeric( $attr['itemBorderRadius'][3] ) ) {
					$css->add_property( 'border-bottom-left-radius', $attr['itemBorderRadius'][3] . 'px' );
				}
			}
			if ( isset( $attr['itemBorderWidth'] ) && is_array( $attr['itemBorderWidth'] ) ) {
				if ( isset( $attr['itemBorderWidth'][0] ) && is_numeric( $attr['itemBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['itemBorderWidth'][0] . 'px' );
				}
				if ( isset( $attr['itemBorderWidth'][1] ) && is_numeric( $attr['itemBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['itemBorderWidth'][1] . 'px' );
				}
				if ( isset( $attr['itemBorderWidth'][2] ) && is_numeric( $attr['itemBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['itemBorderWidth'][2] . 'px' );
				}
				if ( isset( $attr['itemBorderWidth'][3] ) && is_numeric( $attr['itemBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['itemBorderWidth'][3] . 'px' );
				}
			}
			if ( isset( $attr['itemPadding'] ) && is_array( $attr['itemPadding'] ) ) {
				if ( isset( $attr['itemPadding'][0] ) && is_numeric( $attr['itemPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attr['itemPadding'][0] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemPadding'][1] ) && is_numeric( $attr['itemPadding'][1] ) ) {
					$css->add_property( 'padding-right', $attr['itemPadding'][1] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemPadding'][2] ) && is_numeric( $attr['itemPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attr['itemPadding'][2] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemPadding'][3] ) && is_numeric( $attr['itemPadding'][3] ) ) {
					$css->add_property( 'padding-left', $attr['itemPadding'][3] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
			}
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item.kb-countdown-divider-item' );
			if ( isset( $attr['itemPadding'] ) && is_array( $attr['itemPadding'] ) ) {
				if ( isset( $attr['itemPadding'][0] ) && is_numeric( $attr['itemPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attr['itemPadding'][0] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemPadding'][2] ) && is_numeric( $attr['itemPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attr['itemPadding'][2] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attr['itemBorderWidth'] ) && is_array( $attr['itemBorderWidth'] ) ) {
				if ( isset( $attr['itemBorderWidth'][0] ) && is_numeric( $attr['itemBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['itemBorderWidth'][0] . 'px' );
				}
				if ( isset( $attr['itemBorderWidth'][2] ) && is_numeric( $attr['itemBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['itemBorderWidth'][2] . 'px' );
				}
			}
		}
		if ( ( isset( $attr['itemTabletBorderWidth'] ) && is_array( $attr['itemTabletBorderWidth'] ) ) || ( isset( $attr['itemTabletPadding'] ) && is_array( $attr['itemTabletPadding'] ) ) ) {
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item:not( .kb-countdown-divider-item )' );
			if ( isset( $attr['itemTabletPadding'] ) && is_array( $attr['itemTabletPadding'] ) ) {
				if ( isset( $attr['itemTabletPadding'][0] ) && is_numeric( $attr['itemTabletPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attr['itemTabletPadding'][0] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemTabletPadding'][1] ) && is_numeric( $attr['itemTabletPadding'][1] ) ) {
					$css->add_property( 'padding-right', $attr['itemTabletPadding'][1] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemTabletPadding'][2] ) && is_numeric( $attr['itemTabletPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attr['itemTabletPadding'][2] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemTabletPadding'][3] ) && is_numeric( $attr['itemTabletPadding'][3] ) ) {
					$css->add_property( 'padding-left', $attr['itemTabletPadding'][3] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attr['itemTabletBorderWidth'] ) && is_array( $attr['itemTabletBorderWidth'] ) ) {
				if ( isset( $attr['itemTabletBorderWidth'][0] ) && is_numeric( $attr['itemTabletBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['itemTabletBorderWidth'][0] . 'px' );
				}
				if ( isset( $attr['itemTabletBorderWidth'][1] ) && is_numeric( $attr['itemTabletBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['itemTabletBorderWidth'][1] . 'px' );
				}
				if ( isset( $attr['itemTabletBorderWidth'][2] ) && is_numeric( $attr['itemTabletBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['itemTabletBorderWidth'][2] . 'px' );
				}
				if ( isset( $attr['itemTabletBorderWidth'][3] ) && is_numeric( $attr['itemTabletBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['itemTabletBorderWidth'][3] . 'px' );
				}
			}
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item.kb-countdown-divider-item' );
			if ( isset( $attr['itemTabletPadding'] ) && is_array( $attr['itemTabletPadding'] ) ) {
				if ( isset( $attr['itemTabletPadding'][0] ) && is_numeric( $attr['itemTabletPadding'][0] ) ) {
					$css->add_property( 'padding-top', $attr['itemTabletPadding'][0] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemTabletPadding'][2] ) && is_numeric( $attr['itemTabletPadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attr['itemTabletPadding'][2] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attr['itemTabletBorderWidth'] ) && is_array( $attr['itemTabletBorderWidth'] ) ) {
				if ( isset( $attr['itemTabletBorderWidth'][0] ) && is_numeric( $attr['itemTabletBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['itemTabletBorderWidth'][0] . 'px' );
				}
				if ( isset( $attr['itemTabletBorderWidth'][2] ) && is_numeric( $attr['itemTabletBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['itemTabletBorderWidth'][2] . 'px' );
				}
			}
			$css->stop_media_query();
		}
		if ( ( isset( $attr['itemMobileBorderWidth'] ) && is_array( $attr['itemMobileBorderWidth'] ) ) || ( isset( $attr['itemMobilePadding'] ) && is_array( $attr['itemMobilePadding'] ) ) ) {
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item:not( .kb-countdown-divider-item )' );
			if ( isset( $attr['itemMobilePadding'] ) && is_array( $attr['itemMobilePadding'] ) ) {
				if ( isset( $attr['itemMobilePadding'][0] ) && is_numeric( $attr['itemMobilePadding'][0] ) ) {
					$css->add_property( 'padding-top', $attr['itemMobilePadding'][0] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemMobilePadding'][1] ) && is_numeric( $attr['itemMobilePadding'][1] ) ) {
					$css->add_property( 'padding-right', $attr['itemMobilePadding'][1] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemMobilePadding'][2] ) && is_numeric( $attr['itemMobilePadding'][2] ) ) {
					$css->add_property( 'padding-bottom', $attr['itemMobilePadding'][2] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
				if ( isset( $attr['itemMobilePadding'][3] ) && is_numeric( $attr['itemMobilePadding'][3] ) ) {
					$css->add_property( 'padding-left', $attr['itemMobilePadding'][3] . ( isset( $attr['itemPaddingType'] ) ? $attr['itemPaddingType'] : 'px' ) );
				}
			}
			if ( isset( $attr['itemMobileBorderWidth'] ) && is_array( $attr['itemMobileBorderWidth'] ) ) {
				if ( isset( $attr['itemMobileBorderWidth'][0] ) && is_numeric( $attr['itemMobileBorderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attr['itemMobileBorderWidth'][0] . 'px' );
				}
				if ( isset( $attr['itemMobileBorderWidth'][1] ) && is_numeric( $attr['itemMobileBorderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attr['itemMobileBorderWidth'][1] . 'px' );
				}
				if ( isset( $attr['itemMobileBorderWidth'][2] ) && is_numeric( $attr['itemMobileBorderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attr['itemMobileBorderWidth'][2] . 'px' );
				}
				if ( isset( $attr['itemMobileBorderWidth'][3] ) && is_numeric( $attr['itemMobileBorderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attr['itemMobileBorderWidth'][3] . 'px' );
				}
			}
			$css->stop_media_query();
		}
		$number_font = ( isset( $attr['numberFont'] ) && is_array( $attr['numberFont'] ) && isset( $attr['numberFont'][0] ) && is_array( $attr['numberFont'][0] ) ? $attr['numberFont'][0] : array() );
		if ( ! empty( $number_font ) || ( isset( $attr['numberColor'] ) && ! empty( $attr['numberColor'] ) ) ) {
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-number' );
			if ( isset( $attr['numberColor'] ) && ! empty( $attr['numberColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attr['numberColor'] ) );
			}
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][0] ) && ! empty( $number_font['size'][0] ) ) {
				$css->add_property( 'font-size', $number_font['size'][0] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
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
				$css->add_property( 'font-size', $number_font['size'][0] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
			}
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-number' );
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][1] ) && ! empty( $number_font['size'][1] ) ) {
				$css->add_property( 'font-size', $number_font['size'][1] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
			}
			if ( isset( $number_font['lineHeight'] ) && is_array( $number_font['lineHeight'] ) && isset( $number_font['lineHeight'][1] ) && ! empty( $number_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $number_font['lineHeight'][1] . ( ! isset( $number_font['lineType'] ) ? 'px' : $number_font['lineType'] ) );
			}
			if ( isset( $number_font['letterSpacing'] ) && is_array( $number_font['letterSpacing'] ) && isset( $number_font['letterSpacing'][1] ) && ! empty( $number_font['letterSpacing'][1] ) ) {
				$css->add_property( 'letter-spacing', $number_font['letterSpacing'][1] . ( ! isset( $number_font['letterType'] ) ? 'px' : $number_font['letterType'] ) );
			}
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][1] ) && ! empty( $number_font['size'][1] ) ) {
				$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item' );
				$css->add_property( 'font-size', $number_font['size'][1] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
			}
			$css->stop_media_query();
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-number' );
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][2] ) && ! empty( $number_font['size'][2] ) ) {
				$css->add_property( 'font-size', $number_font['size'][2] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
			}
			if ( isset( $number_font['lineHeight'] ) && is_array( $number_font['lineHeight'] ) && isset( $number_font['lineHeight'][2] ) && ! empty( $number_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $number_font['lineHeight'][2] . ( ! isset( $number_font['lineType'] ) ? 'px' : $number_font['lineType'] ) );
			}
			if ( isset( $number_font['letterSpacing'] ) && is_array( $number_font['letterSpacing'] ) && isset( $number_font['letterSpacing'][2] ) && ! empty( $number_font['letterSpacing'][2] ) ) {
				$css->add_property( 'letter-spacing', $number_font['letterSpacing'][2] . ( ! isset( $number_font['letterType'] ) ? 'px' : $number_font['letterType'] ) );
			}
			if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && isset( $number_font['size'][2] ) && ! empty( $number_font['size'][2] ) ) {
				$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item' );
				$css->add_property( 'font-size', $number_font['size'][2] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
			}
			$css->stop_media_query();
		}
		$label_font = ( isset( $attr['labelFont'] ) && is_array( $attr['labelFont'] ) && isset( $attr['labelFont'][0] ) && is_array( $attr['labelFont'][0] ) ? $attr['labelFont'][0] : array() );
		if ( ! empty( $label_font ) || ( isset( $attr['labelColor'] ) && ! empty( $attr['labelColor'] ) ) ) {
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-label' );
			if ( isset( $attr['labelColor'] ) && ! empty( $attr['labelColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attr['labelColor'] ) );
			}
			if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && isset( $label_font['size'][0] ) && ! empty( $label_font['size'][0] ) ) {
				$css->add_property( 'font-size', $label_font['size'][0] . ( ! isset( $label_font['sizeType'] ) ? 'px' : $label_font['sizeType'] ) );
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
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-label' );
			if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && isset( $label_font['size'][1] ) && ! empty( $label_font['size'][1] ) ) {
				$css->add_property( 'font-size', $label_font['size'][1] . ( ! isset( $label_font['sizeType'] ) ? 'px' : $label_font['sizeType'] ) );
			}
			if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && isset( $label_font['lineHeight'][1] ) && ! empty( $label_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $label_font['lineHeight'][1] . ( ! isset( $label_font['lineType'] ) ? 'px' : $label_font['lineType'] ) );
			}
			if ( isset( $label_font['letterSpacing'] ) && is_array( $label_font['letterSpacing'] ) && isset( $label_font['letterSpacing'][1] ) && ! empty( $label_font['letterSpacing'][1] ) ) {
				$css->add_property( 'letter-spacing', $label_font['letterSpacing'][1] . ( ! isset( $label_font['letterType'] ) ? 'px' : $label_font['letterType'] ) );
			}
			$css->stop_media_query();
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-date-item .kb-countdown-label' );
			if ( isset( $label_font['size'] ) && is_array( $label_font['size'] ) && isset( $label_font['size'][2] ) && ! empty( $label_font['size'][2] ) ) {
				$css->add_property( 'font-size', $label_font['size'][2] . ( ! isset( $label_font['sizeType'] ) ? 'px' : $label_font['sizeType'] ) );
			}
			if ( isset( $label_font['lineHeight'] ) && is_array( $label_font['lineHeight'] ) && isset( $label_font['lineHeight'][2] ) && ! empty( $label_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $label_font['lineHeight'][2] . ( ! isset( $label_font['lineType'] ) ? 'px' : $label_font['lineType'] ) );
			}
			if ( isset( $label_font['letterSpacing'] ) && is_array( $label_font['letterSpacing'] ) && isset( $label_font['letterSpacing'][2] ) && ! empty( $label_font['letterSpacing'][2] ) ) {
				$css->add_property( 'letter-spacing', $label_font['letterSpacing'][2] . ( ! isset( $label_font['letterType'] ) ? 'px' : $label_font['letterType'] ) );
			}
			$css->stop_media_query();
		}
		$pre_label_font = ( isset( $attr['preLabelFont'] ) && is_array( $attr['preLabelFont'] ) && isset( $attr['preLabelFont'][0] ) && is_array( $attr['preLabelFont'][0] ) ? $attr['preLabelFont'][0] : array() );
		if ( ! empty( $pre_label_font ) || ( isset( $attr['preLabelColor'] ) && ! empty( $attr['preLabelColor'] ) ) ) {
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-pre-timer' );
			if ( isset( $attr['preLabelColor'] ) && ! empty( $attr['preLabelColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attr['preLabelColor'] ) );
			}
			if ( isset( $pre_label_font['size'] ) && is_array( $pre_label_font['size'] ) && isset( $pre_label_font['size'][0] ) && ! empty( $pre_label_font['size'][0] ) ) {
				$css->add_property( 'font-size', $pre_label_font['size'][0] . ( ! isset( $pre_label_font['sizeType'] ) ? 'px' : $pre_label_font['sizeType'] ) );
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
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-pre-timer' );
			if ( isset( $pre_label_font['size'] ) && is_array( $pre_label_font['size'] ) && isset( $pre_label_font['size'][1] ) && ! empty( $pre_label_font['size'][1] ) ) {
				$css->add_property( 'font-size', $pre_label_font['size'][1] . ( ! isset( $pre_label_font['sizeType'] ) ? 'px' : $pre_label_font['sizeType'] ) );
			}
			if ( isset( $pre_label_font['lineHeight'] ) && is_array( $pre_label_font['lineHeight'] ) && isset( $pre_label_font['lineHeight'][1] ) && ! empty( $pre_label_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $pre_label_font['lineHeight'][1] . ( ! isset( $pre_label_font['lineType'] ) ? 'px' : $pre_label_font['lineType'] ) );
			}
			if ( isset( $pre_label_font['letterSpacing'] ) && is_array( $pre_label_font['letterSpacing'] ) && isset( $pre_label_font['letterSpacing'][1] ) && ! empty( $pre_label_font['letterSpacing'][1] ) ) {
				$css->add_property( 'letter-spacing', $pre_label_font['letterSpacing'][1] . ( ! isset( $pre_label_font['letterType'] ) ? 'px' : $pre_label_font['letterType'] ) );
			}
			$css->stop_media_query();
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-pre-timer' );
			if ( isset( $pre_label_font['size'] ) && is_array( $pre_label_font['size'] ) && isset( $pre_label_font['size'][2] ) && ! empty( $pre_label_font['size'][2] ) ) {
				$css->add_property( 'font-size', $pre_label_font['size'][2] . ( ! isset( $pre_label_font['sizeType'] ) ? 'px' : $pre_label_font['sizeType'] ) );
			}
			if ( isset( $pre_label_font['lineHeight'] ) && is_array( $pre_label_font['lineHeight'] ) && isset( $pre_label_font['lineHeight'][2] ) && ! empty( $pre_label_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $pre_label_font['lineHeight'][2] . ( ! isset( $pre_label_font['lineType'] ) ? 'px' : $pre_label_font['lineType'] ) );
			}
			if ( isset( $pre_label_font['letterSpacing'] ) && is_array( $pre_label_font['letterSpacing'] ) && isset( $pre_label_font['letterSpacing'][2] ) && ! empty( $pre_label_font['letterSpacing'][2] ) ) {
				$css->add_property( 'letter-spacing', $pre_label_font['letterSpacing'][2] . ( ! isset( $pre_label_font['letterType'] ) ? 'px' : $pre_label_font['letterType'] ) );
			}
			$css->stop_media_query();
		}
		$post_label_font = ( isset( $attr['postLabelFont'] ) && is_array( $attr['postLabelFont'] ) && isset( $attr['postLabelFont'][0] ) && is_array( $attr['postLabelFont'][0] ) ? $attr['postLabelFont'][0] : array() );
		if ( ! empty( $post_label_font ) || ( isset( $attr['postLabelColor'] ) && ! empty( $attr['postLabelColor'] ) ) ) {
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-post-timer' );
			if ( isset( $attr['postLabelColor'] ) && ! empty( $attr['postLabelColor'] ) ) {
				$css->add_property( 'color', $css->render_color( $attr['postLabelColor'] ) );
			}
			if ( isset( $post_label_font['size'] ) && is_array( $post_label_font['size'] ) && isset( $post_label_font['size'][0] ) && ! empty( $post_label_font['size'][0] ) ) {
				$css->add_property( 'font-size', $post_label_font['size'][0] . ( ! isset( $post_label_font['sizeType'] ) ? 'px' : $post_label_font['sizeType'] ) );
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
			$css->start_media_query( $media_query['tablet'] );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-post-timer' );
			if ( isset( $post_label_font['size'] ) && is_array( $post_label_font['size'] ) && isset( $post_label_font['size'][1] ) && ! empty( $post_label_font['size'][1] ) ) {
				$css->add_property( 'font-size', $post_label_font['size'][1] . ( ! isset( $post_label_font['sizeType'] ) ? 'px' : $post_label_font['sizeType'] ) );
			}
			if ( isset( $post_label_font['lineHeight'] ) && is_array( $post_label_font['lineHeight'] ) && isset( $post_label_font['lineHeight'][1] ) && ! empty( $post_label_font['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $post_label_font['lineHeight'][1] . ( ! isset( $post_label_font['lineType'] ) ? 'px' : $post_label_font['lineType'] ) );
			}
			if ( isset( $post_label_font['letterSpacing'] ) && is_array( $post_label_font['letterSpacing'] ) && isset( $post_label_font['letterSpacing'][1] ) && ! empty( $post_label_font['letterSpacing'][1] ) ) {
				$css->add_property( 'letter-spacing', $post_label_font['letterSpacing'][1] . ( ! isset( $post_label_font['letterType'] ) ? 'px' : $post_label_font['letterType'] ) );
			}
			$css->stop_media_query();
			$css->start_media_query( $media_query['mobile'] );
			$css->set_selector( '.kb-countdown-container.kb-countdown-container-' . $unique_id . ' .kb-countdown-item.kb-post-timer' );
			if ( isset( $post_label_font['size'] ) && is_array( $post_label_font['size'] ) && isset( $post_label_font['size'][2] ) && ! empty( $post_label_font['size'][2] ) ) {
				$css->add_property( 'font-size', $post_label_font['size'][2] . ( ! isset( $post_label_font['sizeType'] ) ? 'px' : $post_label_font['sizeType'] ) );
			}
			if ( isset( $post_label_font['lineHeight'] ) && is_array( $post_label_font['lineHeight'] ) && isset( $post_label_font['lineHeight'][2] ) && ! empty( $post_label_font['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $post_label_font['lineHeight'][2] . ( ! isset( $post_label_font['lineType'] ) ? 'px' : $post_label_font['lineType'] ) );
			}
			if ( isset( $post_label_font['letterSpacing'] ) && is_array( $post_label_font['letterSpacing'] ) && isset( $post_label_font['letterSpacing'][2] ) && ! empty( $post_label_font['letterSpacing'][2] ) ) {
				$css->add_property( 'letter-spacing', $post_label_font['letterSpacing'][2] . ( ! isset( $post_label_font['letterType'] ) ? 'px' : $post_label_font['letterType'] ) );
			}
			$css->stop_media_query();
		}
		self::$gfonts = $css->fonts_output();
		return $css->css_output();
	}
	/**
	 * Adds countdown data.
	 */
	public function countdown_enqueue() {
		wp_localize_script(
			'kadence-blocks-countdown',
			'kadence_blocks_countdown',
			array(
				'ajax_url'   => admin_url( 'admin-ajax.php' ),
				'ajax_nonce' => wp_create_nonce( 'kadence_blocks_countdown' ),
				'site_slug'  => apply_filters( 'kadence_blocks_countdown_site_slug', sanitize_title( get_bloginfo( 'name' ) ) ),
				'timers'     => wp_json_encode( self::$countdown ),
			)
		);
	}
}
Kadence_Blocks_Countdown::get_instance();
