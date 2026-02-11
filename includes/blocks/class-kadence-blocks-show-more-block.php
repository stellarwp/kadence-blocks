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


		// Screen reader excerpt - visually hidden but accessible to screen readers
		$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .kb-show-more-sr-excerpt' );
		$css->add_property( 'position', 'absolute' );
		$css->add_property( 'width', '1px' );
		$css->add_property( 'height', '1px' );
		$css->add_property( 'padding', '0' );
		$css->add_property( 'margin', '-1px' );
		$css->add_property( 'overflow', 'hidden' );
		$css->add_property( 'clip', 'rect(0, 0, 0, 0)' );
		$css->add_property( 'white-space', 'nowrap' );
		$css->add_property( 'border', '0' );

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
	 * Return dynamically generated HTML for block
	 *
	 * @param array $attributes the blocks attributes.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $content the block content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string Modified block content.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		// Check if excerpt element already exists in content
		if ( false !== strpos( $content, 'kb-show-more-sr-excerpt' ) ) {
			return $content;
		}

		// Create the excerpt div HTML
		$excerpt_html = '<div class="kb-show-more-sr-excerpt" aria-live="polite" aria-atomic="true"></div>';

		// Find the opening div tag of the container and insert excerpt right after it
		// Match: <div class="kb-block-show-more-container...">
		$pattern = '/(<div[^>]*class="[^"]*kb-block-show-more-container[^"]*"[^>]*>)/i';
		
		if ( preg_match( $pattern, $content, $matches ) ) {
			// Insert excerpt div right after the opening container div
			$content = preg_replace( $pattern, $matches[0] . $excerpt_html, $content, 1 );
		} else {
			// Fallback: if pattern doesn't match, prepend to content
			$content = $excerpt_html . $content;
		}

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

		wp_register_script( 'kadence-blocks-show-more', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-show-more.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_localize_script(
			'kadence-blocks-show-more',
			'kbShowMore',
			array(
				'contentCollapsed'     => __( 'Content is collapsed.', 'kadence-blocks' ),
				'contentContinues'     => __( 'Content continues.', 'kadence-blocks' ),
				'activateButton'       => __( 'Activate the', 'kadence-blocks' ),
				'buttonToReveal'       => __( 'button to reveal the full content.', 'kadence-blocks' ),
				'showMoreDefault'      => __( 'Show More', 'kadence-blocks' ),
			)
		);
	}

}

Kadence_Blocks_Show_More_Block::get_instance();
