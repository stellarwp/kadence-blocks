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
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css        the css class for blocks.
	 * @param string             $unique_id  the blocks attr ID.
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );
		$css->set_selector( '.kb-block-show-more-container' . $unique_id );

		/*
		 * Margin
		 */
		$margin_args = array(
			'desktop_key' => 'marginDesktop',
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
		);
		$css->render_measure_output( $attributes, 'margin', 'margin', $margin_args );

		/*
		 * Padding
		 */
		$padding_args = array(
			'desktop_key' => 'paddingDesktop',
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
		);
		$css->render_measure_output( $attributes, 'padding', 'padding', $padding_args );


		$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn' );
		$css->add_property( 'margin-top', '1em' );
		$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:last-child' );
		$css->add_property( 'display', 'none' );


		$css->set_selector('.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
		$css->add_property( 'max-height', (  isset( $attributes['heightDesktop'] ) ? $attributes['heightDesktop'] : 250) .  ( isset( $attributes['heightType'] ) ? $attributes['heightType'] : 'px' ) );
		$css->add_property( 'overflow-y', 'hidden' );

		if ( isset( $attributes['enableFadeOut'] ) && $attributes['enableFadeOut'] ) {
			$css->add_property( '-webkit-mask-image', 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize']) ? abs( $attributes['fadeOutSize'] - 100) : 50) . '%, transparent 100%)' );
			$css->add_property( 'mask-image', 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize']) ? abs( $attributes['fadeOutSize'] - 100) : 50) . '%, transparent 100%)' );
		}

		// Default expanded Desktop
		if ( isset( $attributes['defaultExpandedDesktop'] ) && $attributes['defaultExpandedDesktop'] ) {
			$css->set_selector('.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
			$css->set_media_state( 'desktop' );
			$css->add_property( 'max-height', 'none' );
			$css->add_property( '-webkit-mask-image', 'none' );
			$css->add_property( 'mask-image', 'none' );

			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child' );
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

			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child' );
			$css->add_property( 'display', 'none' );
			$css->set_media_state( 'desktop' );

			// If default expanded on tablet, but not on mobile
			if ( ! isset( $attributes['defaultExpandedMobile'] ) || ( isset( $attributes['defaultExpandedMobile'] ) && ! $attributes['defaultExpandedMobile'] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-column' );
				$css->add_property( 'max-height', ( isset( $attributes['heightDesktop'] ) ? $attributes['heightDesktop'] : 250 ) . ( isset( $attributes['heightType'] ) ? $attributes['heightType'] : 'px' ) );
				$css->add_property( 'overflow-y', 'hidden' );

				if ( isset( $attributes['enableFadeOut']) && $attributes['enableFadeOut'] ) {
					$css->add_property( '-webkit-mask-image', 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize'] ) ? abs( $attributes['fadeOutSize'] - 100) : 50) . '%, transparent 100%)' );
					$css->add_property( 'mask-image', 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize'] ) ? abs( $attributes['fadeOutSize'] - 100) : 50) . '%, transparent 100%)' );
				}

				$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child' );
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

			$css->set_selector( '.kb-block-show-more-container' . $unique_id . ' > .wp-block-kadence-advancedbtn .kt-btn-wrap:first-child' );
			$css->add_property( 'display', 'none' );
			$css->set_media_state( 'desktop' );
		}


		return $css->css_output();
	}

	/**
	 * Generate HTML for this block
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content ) {
		$show_more_container_id        = 'kb-block-show-more-container' . esc_attr( $unique_id );
		$show_more_id = str_replace( array( '-' ), '', $unique_id );

		$show_hide_more = isset( $attributes['showHideMore'] ) && $attributes['showHideMore'] === false ? '' : "hideMoreButton" . $show_more_id . ".style.display = 'block';";
		$preview_height = ( isset( $attributes['heightDesktop'] ) ? $attributes['heightDesktop'] : 250 ) . ( ! empty( $attributes['heightType'] ) ? $attributes['heightType'] : 'px' );
		$maskvalue = 'none';

		if ( isset( $attributes['enableFadeOut'] ) && $attributes['enableFadeOut'] ) {
			$maskvalue = 'linear-gradient(to bottom, black ' . ( isset( $attributes['fadeOutSize'] ) ? abs( $attributes['fadeOutSize'] - 100 ) : 50 ) . '%, transparent 100%)';
		}

		$content = $content . "<script>
			var showMoreContainer" . $show_more_id . " = document.querySelector('." . $show_more_container_id . " > .wp-block-kadence-column');
			var buttons" . $show_more_id . " = document.querySelectorAll('." . $show_more_container_id . " > .wp-block-kadence-advancedbtn div');
			var showMoreButton" . $show_more_id . " = buttons" . $show_more_id . "[0];
			var hideMoreButton" . $show_more_id . " = buttons" . $show_more_id . "[1];
			showMoreButton" . $show_more_id . ".addEventListener('click', function(e) {
				e.preventDefault();
				showMoreContainer" . $show_more_id . ".style.maxHeight = 'none';
				showMoreContainer" . $show_more_id . ".style['mask-image'] = 'none';
				showMoreContainer" . $show_more_id . ".style['-webkit-mask-image'] = 'none';
				showMoreButton" . $show_more_id . ".style.display = 'none';
				" . $show_hide_more . "
				return false;
			});
			hideMoreButton" . $show_more_id . ".addEventListener('click', function (e) {
				e.preventDefault();
				showMoreContainer" . $show_more_id . ".style.maxHeight =  '" . $preview_height . "';
				showMoreButton" . $show_more_id . ".style.display = 'block';
				hideMoreButton" . $show_more_id . ".style.display = 'none';
				showMoreContainer" . $show_more_id . ".style['mask-image'] = '" . $maskvalue . "';
				showMoreContainer" . $show_more_id . ".style['-webkit-mask-image'] = '" . $maskvalue . "';
				return false;
			});
		</script>";


		return $content;

	}

}

Kadence_Blocks_Show_More_Block::get_instance();
