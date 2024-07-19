<?php
/**
 * Class to Build the Show More Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Show More Block.
 *
 * @category class
 */
class Kadence_Blocks_Show_More_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'show-more';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

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
		$css->set_selector( '.kb-block-show-more-container' . $unique_id );

		/*
		 * Margin
		 */
		$margin_args = array(
			'desktop_key' => 'marginDesktop',
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
			'unit_key'    => 'marginUnit',
		);
		$css->render_measure_output( $attributes, 'margin', 'margin', $margin_args );

		/*
		 * Padding
		 */
		$padding_args = array(
			'desktop_key' => 'paddingDesktop',
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
			'unit_key'    => 'paddingUnit',
		);
		$css->render_measure_output( $attributes, 'padding', 'padding', $padding_args );


		$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn' );
		$css->add_property( 'margin-top', '1em' );
		$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:nth-child(2), .kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(2)' );
		$css->add_property( 'display', 'none' );


		$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
		$css->add_property( 'max-height', ( isset( $attributes['heightDesktop'] ) ? $attributes['heightDesktop'] : 250) . ( isset( $attributes['heightType'] ) ? $attributes['heightType'] : 'px' ) );
		$css->add_property( 'overflow-y', 'hidden' );

		if ( isset( $attributes['heightTablet'] ) && ! empty( $attributes['heightTablet'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
			$css->add_property( 'max-height', $attributes['heightTablet'] .  ( isset( $attributes['heightType'] ) ? $attributes['heightType'] : 'px' ) );
			$css->set_media_state( 'desktop');
		}
		if ( isset( $attributes['heightMobile'] ) && ! empty( $attributes['heightMobile'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
			$css->add_property( 'max-height', $attributes['heightMobile'] .  ( isset( $attributes['heightType'] ) ? $attributes['heightType'] : 'px' ) );
			$css->set_media_state( 'desktop');
		}

		if ( isset( $attributes['enableFadeOut'] ) && $attributes['enableFadeOut'] ) {
			$css->add_property( '-webkit-mask-image', 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize'] ) ? abs( $attributes['fadeOutSize'] - 100 ) : 50 ) . '%, transparent 100%)' );
			$css->add_property( 'mask-image', 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize'] ) ? abs( $attributes['fadeOutSize'] - 100 ) : 50 ) . '%, transparent 100%)' );
		}

		// Add open styles
		$css->set_selector( '.kb-block-show-more-container' . $unique_id . '.kb-smc-open > .wp-block-kadence-column' );
		$css->add_property( 'max-height', 'none' );
		$css->add_property( '-webkit-mask-image', 'none' );
		$css->add_property( 'mask-image', 'none' );
		$css->add_property( 'overflow-y', 'unset' );

		$css->set_selector( '.kb-block-show-more-container' . $unique_id . '.kb-smc-open > .wp-block-kadence-advancedbtn .kt-btn-wrap:nth-child(1), .kb-block-show-more-container' . $unique_id . '.kb-smc-open > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(1)' );
		$css->add_property( 'display', 'none' );
		$css->set_selector( '.kb-block-show-more-container' . $unique_id . '.kb-smc-open > .wp-block-kadence-advancedbtn .kt-btn-wrap:nth-child(2), .kb-block-show-more-container' . $unique_id . '.kb-smc-open > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(2)' );
		$css->add_property( 'display', 'inline-flex' );
		$css->set_selector( '.kb-block-show-more-container' . $unique_id . '.kb-smc-open > .wp-block-kadence-advancedbtn.kt-force-btn-fullwidth .kt-btn-wrap:nth-child(2)' );
		$css->add_property( 'display', 'block' );

		if( isset( $attributes['showHideMore'] ) && !$attributes['showHideMore'] ) {
			$css->set_selector( '.kb-block-show-more-container' . $unique_id . '.kb-smc-open > .wp-block-kadence-advancedbtn .kt-btn-wrap:nth-child(2), .kb-block-show-more-container' . $unique_id . '.kb-smc-open > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(2)' );
			$css->add_property( 'display', 'none' );
		}

		// Default expanded Desktop
		if ( isset( $attributes['defaultExpandedDesktop'] ) && $attributes['defaultExpandedDesktop'] ) {
			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
			$css->set_media_state( 'desktop' );
			$css->add_property( 'max-height', 'none' );
			$css->add_property( '-webkit-mask-image', 'none' );
			$css->add_property( 'mask-image', 'none' );

			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child, .kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(1)' );
			$css->add_property( 'display', 'none' );
			$css->set_media_state( 'desktop' );
		}

		// Default expanded Tablet.
		if ( isset( $attributes['defaultExpandedTablet'] ) && $attributes['defaultExpandedTablet'] ) {
			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
			$css->set_media_state( 'tablet' );
			$css->add_property( 'max-height', 'none' );
			$css->add_property( '-webkit-mask-image', 'none' );
			$css->add_property( 'mask-image', 'none' );

			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child, .kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(1)' );
			$css->add_property( 'display', 'none' );
			$css->set_media_state( 'desktop' );

			// If default expanded on tablet, but not on mobile.
			if ( ! isset( $attributes['defaultExpandedMobile'] ) || ( isset( $attributes['defaultExpandedMobile'] ) && ! $attributes['defaultExpandedMobile'] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
				$css->add_property( 'max-height', ( isset( $attributes['heightDesktop'] ) ? $attributes['heightDesktop'] : 250 ) . ( isset( $attributes['heightType'] ) ? $attributes['heightType'] : 'px' ) );
				$css->add_property( 'overflow-y', 'hidden' );

				if ( isset( $attributes['enableFadeOut'] ) && $attributes['enableFadeOut'] ) {
					$css->add_property( '-webkit-mask-image', 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize'] ) ? abs( $attributes['fadeOutSize'] - 100 ) : 50 ) . '%, transparent 100%)' );
					$css->add_property( 'mask-image', 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize'] ) ? abs( $attributes['fadeOutSize'] - 100 ) : 50 ) . '%, transparent 100%)' );
				}

				$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child, .kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(1)' );
				$css->add_property( 'display', 'inline' );
				$css->set_media_state( 'desktop' );
			}
		}

		// Default expanded Mobile
		if ( isset( $attributes['defaultExpandedMobile'] ) && $attributes['defaultExpandedMobile'] ) {
			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
			$css->set_media_state( 'mobile' );
			$css->add_property( 'max-height', 'none' );
			$css->add_property( '-webkit-mask-image', 'none' );
			$css->add_property( 'mask-image', 'none' );

			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child, .kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .wp-block-kadence-singlebtn:nth-of-type(1)' );
			$css->add_property( 'display', 'none' );
			$css->set_media_state( 'desktop' );
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

		wp_register_script( 'kadence-blocks-show-more', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-show-more.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}

}

Kadence_Blocks_Show_More_Block::get_instance();
