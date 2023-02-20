<?php
/**
 * Outputs google fonts.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class to create a minified css output.
 */
class Kadence_Blocks_Google_Fonts {
	/**
	 * The singleton instance
	 */
	private static $instance = null;

	/**
	 * Google fonts to enqueue
	 *
	 * @var array
	 */
	public static $gfonts = array();

	/**
	 * Google fonts to enqueue
	 *
	 * @var array
	 */
	public static $footer_gfonts = array();

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
		add_action( 'wp_head', array( $this, 'frontend_gfonts' ), 85 );
		add_action( 'wp_footer', array( $this, 'frontend_footer_gfonts' ), 85 );
	}
	/**
	 * Load the front end Google Fonts
	 */
	public function frontend_gfonts() {
		if ( empty( self::$gfonts ) ) {
			return;
		}
		if ( class_exists( 'Kadence_Blocks_Frontend' ) ) {
			$ktblocks_instance = Kadence_Blocks_Frontend::get_instance();
			foreach ( self::$gfonts as $key => $font ) {
				if ( ! array_key_exists( $key, $ktblocks_instance::$gfonts ) ) {
					$add_font = array(
						'fontfamily'   => $font['fontfamily'],
						'fontvariants' => ( isset( $font['fontvariants'] ) && ! empty( $font['fontvariants'] ) && is_array( $font['fontvariants'] ) ? $font['fontvariants'] : array() ),
						'fontsubsets'  => ( isset( $font['fontsubsets'] ) && ! empty( $font['fontsubsets'] ) && is_array( $font['fontsubsets'] ) ? $font['fontsubsets'] : array() ),
					);
					$ktblocks_instance::$gfonts[ $key ] = $add_font;
				} else {
					foreach ( $font['fontvariants'] as $variant ) {
						if ( ! in_array( $variant, $ktblocks_instance::$gfonts[ $key ]['fontvariants'], true ) ) {
							array_push( $ktblocks_instance::$gfonts[ $key ]['fontvariants'], $variant );
						}
					}
				}
			}
		} else {
			$print_google_fonts = apply_filters( 'kadence_woo_print_google_fonts', true );
			if ( ! $print_google_fonts ) {
				return;
			}
			$this->print_gfonts( self::$gfonts );
		}
	}
	/**
	 * Load the front end Google Fonts
	 */
	public function frontend_footer_gfonts() {
		if ( empty( self::$footer_gfonts ) ) {
			return;
		}
		if ( class_exists( 'Kadence_Blocks_Frontend' ) ) {
			$ktblocks_instance = Kadence_Blocks_Frontend::get_instance();
			foreach ( self::$footer_gfonts as $key => $font ) {
				if ( ! array_key_exists( $key, $ktblocks_instance::$footer_gfonts ) ) {
					$add_font = array(
						'fontfamily'   => $font['fontfamily'],
						'fontvariants' => ( isset( $font['fontvariants'] ) && ! empty( $font['fontvariants'] ) && is_array( $font['fontvariants'] ) ? $font['fontvariants'] : array() ),
						'fontsubsets'  => ( isset( $font['fontsubsets'] ) && ! empty( $font['fontsubsets'] ) && is_array( $font['fontsubsets'] ) ? $font['fontsubsets'] : array() ),
					);
					$ktblocks_instance::$footer_gfonts[ $key ] = $add_font;
				} else {
					foreach ( $font['fontvariants'] as $variant ) {
						if ( ! in_array( $variant, $ktblocks_instance::$footer_gfonts[ $key ]['fontvariants'], true ) ) {
							array_push( $ktblocks_instance::$footer_gfonts[ $key ]['fontvariants'], $variant );
						}
					}
				}
			}
		} else {
			$print_google_fonts = apply_filters( 'kadence_woo_print_footer_google_fonts', true );
			if ( ! $print_google_fonts ) {
				return;
			}
			$this->print_gfonts( self::$footer_gfonts );
		}
	}
	/**
	 * Print gFonts
	 */
	public function print_gfonts( $gfonts ) {
		$link    = '';
		$subsets = array();
		foreach ( $gfonts as $key => $gfont_values ) {
			if ( ! empty( $link ) ) {
				$link .= '%7C'; // Append a new font to the string.
			}
			$link .= $gfont_values['fontfamily'];
			if ( ! empty( $gfont_values['fontvariants'] ) ) {
				$link .= ':';
				$link .= implode( ',', $gfont_values['fontvariants'] );
			}
			if ( ! empty( $gfont_values['fontsubsets'] ) ) {
				foreach ( $gfont_values['fontsubsets'] as $subset ) {
					if ( ! empty( $subset ) && ! in_array( $subset, $subsets ) ) {
						array_push( $subsets, $subset );
					}
				}
			}
		}
		if ( ! empty( $subsets ) ) {
			$link .= '&amp;subset=' . implode( ',', $subsets );
		}
		if ( apply_filters( 'kadence_display_swap_google_fonts', true ) ) {
			$link .= '&amp;display=swap';
		}
		echo '<link href="//fonts.googleapis.com/css?family=' . esc_attr( str_replace( '|', '%7C', $link ) ) . '" rel="stylesheet">';
	}
	/**
	 * Add gFonts.
	 */
	public function add_fonts( $fonts ) {
		if ( empty( $fonts ) ) {
			return;
		}
		if ( is_array( $fonts ) ) {
			foreach ( $fonts as $key => $font ) {
				if ( ( ! array_key_exists( $key, self::$gfonts ) && did_action( 'wp_body_open' ) === 0 ) || ( ! array_key_exists( $key, self::$footer_gfonts ) && did_action( 'wp_body_open' ) >= 1) ) {
					$add_font = array(
						'fontfamily'   => $font['fontfamily'],
						'fontvariants' => ( isset( $font['fontvariants'] ) && ! empty( $font['fontvariants'] ) && is_array( $font['fontvariants'] ) ? $font['fontvariants'] : array() ),
						'fontsubsets'  => ( isset( $font['fontsubsets'] ) && ! empty( $font['fontsubsets'] ) && is_array( $font['fontsubsets'] ) ? $font['fontsubsets'] : array() ),
					);
					// Check if wp_head has already run in which case we need to add to footer fonts.
					if ( did_action( 'wp_body_open' ) >= 1 ) {
						self::$footer_gfonts[ $key ] = $add_font;
					} else {
						self::$gfonts[ $key ] = $add_font;
					}
				} else {
					foreach ( $font['fontvariants'] as $variant ) {
						if ( did_action( 'wp_body_open' ) >= 1 ) {
							if ( is_array(self::$footer_gfonts[ $key ]['fontvariants']) && ! in_array( $variant, self::$footer_gfonts[ $key ]['fontvariants'], true ) ) {
								array_push( self::$footer_gfonts[ $key ]['fontvariants'], $variant );
							}
						} else {
							if ( is_array(self::$gfonts[ $key ]['fontvariants']) && ! in_array( $variant, self::$gfonts[ $key ]['fontvariants'], true ) ) {
								array_push( self::$gfonts[ $key ]['fontvariants'], $variant );
							}
						}
					}
				}
			}
		}
	}
}
Kadence_Blocks_Google_Fonts::get_instance();
