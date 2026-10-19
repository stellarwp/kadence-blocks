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

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Groups_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Scopes_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Class to Build the Spacer Block.
 *
 * @category class
 */
class Kadence_Blocks_Spacer_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Scopes_Site_Styles, Groups_Site_Styles {

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

		$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-block-spacer' );
		$units = ! empty( $attributes['spacerHeightUnits'] ) ? $attributes['spacerHeightUnits'] : 'px';
		if ( ! empty( $attributes['spacerHeight'] ) || $units !== 'px' ) {
			$height = ( ! empty( $attributes['spacerHeight'] ) ? $attributes['spacerHeight'] : '60' );
			$css->add_property( 'height', $height . $units );
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
			// In the Kadence theme's Full Site Editing mode the band takes its own tablet and mobile heights, as the editor shows it; classic mode keeps its output.
			$is_fse_mode = kadence_blocks_is_fse_mode();
			if ( ( ! empty( $attributes['tabletDividerHeight'] ) ) || ( isset( $attributes['tabletDividerWidth'] ) && ! empty( $attributes['tabletDividerWidth'] ) ) ) {
				$css->set_media_state( 'tablet' );
				$css->set_selector( '.wp-block-kadence-spacer.kt-block-spacer-' . $unique_id . ' .kt-divider-stripe' );
				if ( ! empty( $attributes['tabletDividerHeight'] ) ) {
					$css->add_property( 'height', ( $is_fse_mode ? $attributes['tabletDividerHeight'] : $attributes['tabletSpacerHeight'] ) . 'px !important' );
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
					$css->add_property( 'height', ( $is_fse_mode ? $attributes['mobileDividerHeight'] : $attributes['mobileSpacerHeight'] ) . 'px !important' );
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

	/**
	 * The editor paints every value inline, and each desktop value has a default
	 * the instance rule prints, so every site value goes through the overlay.
	 *
	 * @since TBD
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( ...$this->site_styles_attribute_groups() );
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function site_styles_attributes_map(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function site_styles_supports(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function site_styles_selectors(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function site_styles_scope_attribute(): string {
		return 'dividerStyle';
	}

	/**
	 * The divider's own style, from its `dividerStyle` attribute.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $attributes The instance's attributes.
	 *
	 * @return string|null The style, or null when the instance has none.
	 */
	public function site_styles_scope_style( array $attributes ): ?string {
		return isset( $attributes['dividerStyle'] ) ? Cast::to_string( $attributes['dividerStyle'] ) : null;
	}

	/**
	 * A stripe divider saves its color, opacity and pattern in its markup, and
	 * uses the divider height as its band height, so it takes only the spacer
	 * height and the divider width. Other styles take every value.
	 *
	 * @since TBD
	 */
	public function site_styles_scoped_attributes(): array {
		return [ 'stripe' => array_merge( $this->site_styles_spacer_height_attributes(), $this->site_styles_divider_width_attributes() ) ];
	}

	/**
	 * Each height, width and color takes its unit, its tablet and mobile values,
	 * or its opacity with it.
	 *
	 * @since TBD
	 */
	public function site_styles_attribute_groups(): array {
		return [
			$this->site_styles_spacer_height_attributes(),
			[ 'dividerHeight', 'tabletDividerHeight', 'mobileDividerHeight' ],
			$this->site_styles_divider_width_attributes(),
			[ 'dividerColor', 'dividerOpacity' ],
		];
	}

	/**
	 * The spacer height on each device and its unit.
	 *
	 * @since TBD
	 *
	 * @return list<string> Attribute names.
	 */
	private function site_styles_spacer_height_attributes(): array {
		return [ 'spacerHeight', 'tabletSpacerHeight', 'mobileSpacerHeight', 'spacerHeightUnits' ];
	}

	/**
	 * The divider width on each device and its unit.
	 *
	 * @since TBD
	 *
	 * @return list<string> Attribute names.
	 */
	private function site_styles_divider_width_attributes(): array {
		return [ 'dividerWidth', 'tabletDividerWidth', 'mobileDividerWidth', 'dividerWidthUnits' ];
	}
}

Kadence_Blocks_Spacer_Block::get_instance();
