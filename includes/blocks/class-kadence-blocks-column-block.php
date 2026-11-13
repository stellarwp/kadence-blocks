<?php
/**
 * Class to Build the Column Block.
 *
 * @package Kadence Blocks
 */

// cspell:ignore aligncenter .

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Legacy_Group_Attributes;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

/**
 * Class to Build the Column Block.
 *
 * @category class
 */
class Kadence_Blocks_Column_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Legacy_Group_Attributes {
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
	protected $block_name = 'column';

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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css object for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-column-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Column_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
	}

	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$html = parent::build_html( $attributes, $unique_id, $content, $block_instance );

		// Do not remove: The Optimizer uses this.
		return apply_filters( 'kadence_blocks_column_html', $html, $attributes, $unique_id, $block_instance );
	}

	/**
	 * The editor paints every Section value itself, inline or in its own style
	 * tag, so every site value goes through the overlay.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( array_merge( ...$this->site_styles_attribute_groups() ), [ 'backgroundHover', 'textColor', 'linkColor', 'linkHoverColor', 'textColorHover', 'linkColorHover', 'linkHoverColorHover' ] );
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attributes_map(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_supports(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_selectors(): array {
		return [];
	}

	/**
	 * Each spacing, height, radius and shadow takes its unit, its tablet and
	 * mobile values, or its toggle with it, and the background takes its
	 * opacity. The hover border, radius and shadow group the same way.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attribute_groups(): array {
		return [
			[ 'padding', 'tabletPadding', 'mobilePadding', 'paddingType' ],
			[ 'height', 'heightUnit' ],
			[ 'background', 'backgroundOpacity' ],
			[ 'borderStyle', 'tabletBorderStyle', 'mobileBorderStyle' ],
			[ 'borderRadius', 'tabletBorderRadius', 'mobileBorderRadius', 'borderRadiusUnit' ],
			[ 'displayShadow', 'shadow' ],
			[ 'borderHoverStyle', 'tabletBorderHoverStyle', 'mobileBorderHoverStyle' ],
			[ 'borderHoverRadius', 'tabletBorderHoverRadius', 'mobileBorderHoverRadius', 'borderHoverRadiusUnit' ],
			[ 'displayHoverShadow', 'shadowHover' ],
		];
	}

	/**
	 * Sections saved before the padding and border arrays carry separate side
	 * numbers and the old border colors and widths, which build_css() renders
	 * instead of the padding, border and hover border. The old border width
	 * keeps the hover border too, so a Section showing its own or no border
	 * doesn't gain the site border only on hover.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_legacy_group_attributes(): array {
		return [
			'padding'          => [ 'topPadding', 'rightPadding', 'bottomPadding', 'leftPadding', 'topPaddingT', 'rightPaddingT', 'bottomPaddingT', 'leftPaddingT', 'topPaddingM', 'rightPaddingM', 'bottomPaddingM', 'leftPaddingM' ],
			'borderStyle'      => [ 'border', 'borderWidth', 'tabletBorderWidth', 'mobileBorderWidth' ],
			'borderHoverStyle' => [ 'borderHover', 'borderHoverWidth', 'tabletBorderHoverWidth', 'mobileBorderHoverWidth', 'borderWidth' ],
		];
	}

	/**
	 * Set the vertical align.
	 *
	 * @param array  $media_state The media query size.
	 * @param string $media_vertical_align The alignment setting.
	 * @param string $media_direction The direction setting.
	 * @param object $css The css object.
	 * @param string $unique_id The unique id.
	 */
	private function set_vertical_align( $media_state, $media_vertical_align, $media_direction, $css, $unique_id ) {
		// Restart $align variable to avoid inherit from above value assignment
		$align = 'center';
		$justify_content = '';
		switch ( $media_vertical_align ) {
			case 'top':
				$align = 'flex-start';
				$justify_content = 'flex-start';
				break;
			case 'bottom':
				$align = 'flex-end';
				$justify_content = 'flex-end';
				break;
			case 'space-between':
				$justify_content = 'space-between';
				break;
			case 'space-around':
				$justify_content = 'space-around';
				break;
			case 'space-evenly':
				$justify_content = 'space-evenly';
				break;
			case 'stretch':
				$justify_content = 'stretch';
				break;
			default:
				$justify_content = 'center';
				break;
		}
		$css->set_media_state( $media_state );
		if ( 'horizontal' === $media_direction || 'horizontal-reverse' === $media_direction ) {
			$css->set_selector( '.kt-row-column-wrap > .kadence-column' . $unique_id );
			$css->add_property( 'align-self', $align );
			$css->set_selector( '.kt-inner-column-height-full:not(.kt-has-1-columns) > .wp-block-kadence-column.kadence-column' . $unique_id );
			$css->add_property( 'align-self', 'auto' );
			$css->set_selector( '.kt-inner-column-height-full:not(.kt-has-1-columns) > .wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$css->add_property( 'align-items', $align );
		} else {
			$css->set_selector( '.kt-row-column-wrap > .kadence-column' . $unique_id );
			$css->add_property( 'align-self', $align );
			$css->set_selector( '.kt-inner-column-height-full:not(.kt-has-1-columns) > .wp-block-kadence-column.kadence-column' . $unique_id );
			$css->add_property( 'align-self', 'auto' );
			$css->set_selector( '.kt-inner-column-height-full:not(.kt-has-1-columns) > .wp-block-kadence-column.kadence-column' . $unique_id . ' > .kt-inside-inner-col' );
			$css->add_property( 'flex-direction', 'column' );
			$css->add_property( 'justify-content', $justify_content );
		}
	}
}

Kadence_Blocks_Column_Block::get_instance();
