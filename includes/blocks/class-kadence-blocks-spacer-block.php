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
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string             $unique_id the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-spacer-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Spacer_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
	}

	/**
	 * The editor paints every value inline, and each desktop value has a default
	 * the instance rule prints, so every site value goes through the overlay.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( ...$this->site_styles_attribute_groups() );
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
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_scope_attribute(): string {
		return 'dividerStyle';
	}

	/**
	 * The divider's own style, from its `dividerStyle` attribute.
	 *
	 * @since 3.9.0
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
	 * @since 3.9.0
	 */
	public function site_styles_scoped_attributes(): array {
		return [ 'stripe' => array_merge( $this->site_styles_spacer_height_attributes(), $this->site_styles_divider_width_attributes() ) ];
	}

	/**
	 * Each height, width and color takes its unit, its tablet and mobile values,
	 * or its opacity with it.
	 *
	 * @since 3.9.0
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
	 * @since 3.9.0
	 *
	 * @return list<string> Attribute names.
	 */
	private function site_styles_spacer_height_attributes(): array {
		return [ 'spacerHeight', 'tabletSpacerHeight', 'mobileSpacerHeight', 'spacerHeightUnits' ];
	}

	/**
	 * The divider width on each device and its unit.
	 *
	 * @since 3.9.0
	 *
	 * @return list<string> Attribute names.
	 */
	private function site_styles_divider_width_attributes(): array {
		return [ 'dividerWidth', 'tabletDividerWidth', 'mobileDividerWidth', 'dividerWidthUnits' ];
	}
}

Kadence_Blocks_Spacer_Block::get_instance();
