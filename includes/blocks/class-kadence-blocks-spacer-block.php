<?php
/**
 * Class to Build the Spacer Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Spacer Block.
 *
 * @category class
 */
class Kadence_Blocks_Spacer_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'spacer';

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
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		if ( ! empty( $attributes['spacerHeight'] ) ) {
			$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-block-spacer' );
			$css->add_property( 'height', $attributes['spacerHeight'] . ( isset( $attributes['spacerHeightUnits'] ) ? $attributes['spacerHeightUnits'] : 'px' ) );
		}
		if ( ! empty( $attributes['tabletSpacerHeight'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-block-spacer' );
			$css->add_property( 'height', $attributes['tabletSpacerHeight'] . ( isset( $attributes['spacerHeightUnits'] ) ? $attributes['spacerHeightUnits'] : 'px' ) . '!important' );
			$css->set_media_state( 'desktop' );
		}
		if ( ! empty( $attributes['mobileSpacerHeight'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-block-spacer' );
			$css->add_property( 'height', $attributes['mobileSpacerHeight'] . ( isset( $attributes['spacerHeightUnits'] ) ? $attributes['spacerHeightUnits'] : 'px' ) . '!important' );
			$css->set_media_state( 'desktop' );
		}
		if ( ! empty( $attributes['dividerStyle'] ) && 'stripe' === $attributes['dividerStyle'] ) {
			$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-divider-stripe' );
			$divider_height = ( ! empty( $attributes['dividerHeight'] ) ? $attributes['dividerHeight'] : '10' );
			$css->add_property( 'height', $divider_height . 'px' );
			$divider_width       = ( ! empty( $attributes['dividerWidth'] ) ? $attributes['dividerWidth'] : '80' );
			$divider_width_units = ( isset( $attributes['dividerWidthUnits'] ) && ! empty( $attributes['dividerWidthUnits'] ) ? $attributes['dividerWidthUnits'] : '%' );
			$css->add_property( 'width', $divider_width . $divider_width_units );
			if ( ( ! empty( $attributes['tabletDividerHeight'] ) ) || ( isset( $attributes['tabletDividerWidth'] ) && ! empty( $attributes['tabletDividerWidth'] ) ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-divider-stripe' );
				if ( ! empty( $attributes['tabletDividerHeight'] ) ) {
					$css->add_property( 'height', $attributes['tabletSpacerHeight'] . 'px !important' );
				}
				if ( ! empty( $attributes['tabletDividerWidth'] ) ) {
					$css->add_property( 'width', $attributes['tabletDividerWidth'] . $divider_width_units . '!important' );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( ! empty( $attributes['mobileDividerHeight'] ) || ! empty( $attributes['mobileDividerWidth'] ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-divider-stripe' );
				if ( ! empty( $attributes['mobileDividerHeight'] ) ) {
					$css->add_property( 'height', $attributes['mobileSpacerHeight'] . 'px !important' );
				}
				if ( ! empty( $attributes['mobileDividerWidth'] ) ) {
					$css->add_property( 'width', $attributes['mobileDividerWidth'] . $divider_width_units . '!important' );
				}
				$css->set_media_state( 'desktop' );
			}
		} else {
			$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-divider' );
			if ( isset( $attributes['dividerHeight'] ) && ! empty( $attributes['dividerHeight'] ) ) {
				$css->add_property( 'border-top-width', $attributes['dividerHeight'] . 'px' );
				// Adding this prevents a blur when browsers are rendering. 
				if( ! empty( $attributes['dividerHeight'] ) && intval( absint( $attributes['dividerHeight'] ) % 2 ) != 0 ){
					$css->add_property( 'height', '1px' );
				}
			}
			if ( ! empty( $attributes['dividerColor'] ) ) {
				$alp_opacity = ( isset( $attributes['dividerOpacity'] ) && is_numeric( $attributes['dividerOpacity'] ) ? $attributes['dividerOpacity'] : 100 );
				if ( $alp_opacity < 10 ) {
					$alp = '0.0' . $alp_opacity;
				} else if ( $alp_opacity >= 100 ) {
					$alp = '1';
				} else {
					$alp = '0.' . $alp_opacity;
				}
				$css->add_property( 'border-top-color', $css->render_color( $attributes['dividerColor'], $alp ) );
			}
			$divider_width       = ( ! empty( $attributes['dividerWidth'] ) ? $attributes['dividerWidth'] : '80' );
			$divider_width_units = ( isset( $attributes['dividerWidthUnits'] ) && ! empty( $attributes['dividerWidthUnits'] ) ? $attributes['dividerWidthUnits'] : '%' );
			$css->add_property( 'width', $divider_width . $divider_width_units );
			if ( isset( $attributes['dividerStyle'] ) && ! empty( $attributes['dividerStyle'] ) ) {
				$css->add_property( 'border-top-style', $attributes['dividerStyle'] );
			}
			if ( ( ! empty( $attributes['tabletDividerHeight'] ) ) || ( ! empty( $attributes['tabletDividerWidth'] ) ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-divider' );
				if ( ! empty( $attributes['tabletDividerHeight'] ) ) {
					$css->add_property( 'border-top-width', $attributes['tabletDividerHeight'] . 'px !important' );
				}
				if ( ! empty( $attributes['tabletDividerWidth'] ) ) {
					$css->add_property( 'width', $attributes['tabletDividerWidth'] . $divider_width_units . '!important' );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( ( ! empty( $attributes['mobileDividerHeight'] ) ) || ( ! empty( $attributes['mobileDividerWidth'] ) ) ) {
				$css->set_media_state( 'mobile' );
				$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-divider' );
				if ( ! empty( $attributes['mobileDividerHeight'] ) ) {
					$css->add_property( 'border-top-width', $attributes['mobileDividerHeight'] . 'px !important' );
				}
				if ( ! empty( $attributes['mobileDividerWidth'] ) ) {
					$css->add_property( 'width', $attributes['mobileDividerWidth'] . $divider_width_units . '!important' );
				}
				$css->set_media_state( 'desktop' );
			}
		}

		return $css->css_output();
	}

}

Kadence_Blocks_Spacer_Block::get_instance();
