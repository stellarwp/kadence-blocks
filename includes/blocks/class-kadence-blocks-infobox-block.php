<?php
/**
 * Class to Build the Info Box Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Legacy_Group_Attributes;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

/**
 * Class to Build the Info Box Block.
 *
 * @category class
 */
class Kadence_Blocks_Infobox_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Legacy_Group_Attributes {
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
	protected $block_name = 'infobox';

	/**
	 * Allowed HTML tags for front end output
	 *
	 * @var string[]
	 */
	protected $allowed_html_tags = array( 'heading', 'p', 'span', 'div' );

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
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-infobox-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Infobox_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * The editor paints every Info Box value itself, inline or in its own style
	 * tag, and the instance rule outranks core's, so every site value goes
	 * through the overlay.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( array_merge( ...$this->site_styles_attribute_groups() ), [ 'titleColor', 'titleHoverColor', 'textColor', 'textHoverColor' ] );
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
	 * Each spacing, border, radius, shadow, max width and min height takes its
	 * devices and unit with it, and each font and the text spacing are kept
	 * whole.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attribute_groups(): array {
		return [
			[ 'containerBackground' ],
			[ 'containerHoverBackground' ],
			[ 'borderStyle', 'tabletBorderStyle', 'mobileBorderStyle' ],
			[ 'borderRadius', 'tabletBorderRadius', 'mobileBorderRadius', 'borderRadiusUnit' ],
			[ 'borderHoverStyle', 'tabletBorderHoverStyle', 'mobileBorderHoverStyle' ],
			[ 'borderHoverRadius', 'tabletBorderHoverRadius', 'mobileBorderHoverRadius', 'borderHoverRadiusUnit' ],
			[ 'containerPadding', 'containerTabletPadding', 'containerMobilePadding', 'containerPaddingType' ],
			[ 'containerMargin', 'tabletContainerMargin', 'mobileContainerMargin', 'containerMarginUnit' ],
			[ 'displayShadow', 'shadow', 'tabletShadow', 'mobileShadow', 'shadowHover', 'tabletShadowHover', 'mobileShadowHover' ],
			[ 'maxWidth', 'tabletMaxWidth', 'mobileMaxWidth', 'maxWidthUnit', 'maxWidthTabletUnit', 'maxWidthMobileUnit' ],
			[ 'titleFont' ],
			[ 'titleMinHeight', 'titleMinHeightUnit' ],
			[ 'textFont' ],
			[ 'textSpacing' ],
			[ 'textMinHeight', 'textMinHeightUnit' ],
		];
	}

	/**
	 * Info Boxes saved before the border arrays carry the old border color,
	 * width and radius, which build_css() renders instead of the border and
	 * radius, and the old background opacities, which build_css() applies to
	 * any background. The old width and radius keep the hover border and
	 * radius too, so an old box doesn't gain the site border only on hover.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_legacy_group_attributes(): array {
		return [
			'containerBackground'      => [ 'containerBackgroundOpacity' ],
			'containerHoverBackground' => [ 'containerHoverBackgroundOpacity' ],
			'borderStyle'              => [ 'containerBorder', 'containerBorderWidth', 'containerBorderRadius' ],
			'borderRadius'             => [ 'containerBorder', 'containerBorderWidth', 'containerBorderRadius' ],
			'borderHoverStyle'         => [ 'containerHoverBorder', 'containerBorderWidth' ],
			'borderHoverRadius'        => [ 'containerHoverBorder', 'containerBorderRadius' ],
		];
	}
}

Kadence_Blocks_Infobox_Block::get_instance();
