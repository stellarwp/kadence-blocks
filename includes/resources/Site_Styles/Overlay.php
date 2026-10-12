<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Scopes_Site_Styles;
use WP_Block_Type_Registry;

/**
 * Merges a block's site-level values into each instance's attributes before
 * Kadence builds its markup and CSS, so the existing builders render them.
 *
 * Precedence is decided per leaf: an instance leaf that differs from the
 * block's default wins, every other leaf takes the site value. Stored values
 * of attributes the block excludes are ignored. A block that
 * scopes its site styles gives each instance only the site values its style
 * takes.
 *
 * @since TBD
 */
final class Overlay {

	/**
	 * The site-level values.
	 *
	 * @var Store
	 */
	private Store $store;

	/**
	 * The supported blocks.
	 *
	 * @var Supported_Blocks
	 */
	private Supported_Blocks $blocks;

	/**
	 * @since TBD
	 *
	 * @param Store            $store  The site-level values.
	 * @param Supported_Blocks $blocks The supported blocks.
	 */
	public function __construct( Store $store, Supported_Blocks $blocks ) {
		$this->store  = $store;
		$this->blocks = $blocks;
	}

	/**
	 * The render-attributes filter of each supported block, e.g.
	 * `kadence_blocks_singlebtn_render_block_attributes`.
	 *
	 * @since TBD
	 *
	 * @return array<string, string> Filter name => block name.
	 */
	public function hooks(): array {
		$hooks = [];

		foreach ( $this->blocks->all() as $block_name => $block ) {
			$hooks[ 'kadence_blocks_' . str_replace( '-', '_', $block->get_slug() ) . '_render_block_attributes' ] = $block_name;
		}

		return $hooks;
	}

	/**
	 * Filters a block's attributes before rendering. The block is identified by
	 * the filter being run.
	 *
	 * @since TBD
	 *
	 * @param mixed $attributes The block's attributes.
	 *
	 * @return mixed The attributes with the site-level values merged in.
	 */
	public function filter_render_attributes( $attributes ) {
		$block_name = $this->hooks()[ current_filter() ] ?? null;

		if ( null === $block_name || ! is_array( $attributes ) ) {
			return $attributes;
		}

		return $this->apply( $block_name, $attributes );
	}

	/**
	 * @since TBD
	 *
	 * @param string               $block_name Block name, e.g. `kadence/singlebtn`.
	 * @param array<string, mixed> $attributes The instance's attributes.
	 *
	 * @return array<string, mixed> The attributes with the site-level values merged in.
	 */
	public function apply( string $block_name, array $attributes ): array {
		$block = $this->blocks->get( $block_name );
		$site  = null === $block ? [] : array_diff_key(
			$this->store->attributes( $block_name ),
			array_flip( Supported_Blocks::excluded_attributes( $block ) )
		);

		if ( ! $site ) {
			return $attributes;
		}

		$block_type = WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
		$defaults   = $block_type ? $block_type->attributes : [];

		if ( $block instanceof Scopes_Site_Styles ) {
			$scope_attribute = $block->site_styles_scope_attribute();
			$site            = self::scope(
				$site,
				$attributes,
				[
					'attribute'  => $scope_attribute,
					'attributes' => $block->site_styles_scoped_attributes(),
				],
				$defaults[ $scope_attribute ]['default'] ?? null
			);
		}

		foreach ( $site as $name => $value ) {
			$attributes[ $name ] = self::merge( $attributes[ $name ] ?? null, $value, $defaults[ $name ]['default'] ?? null );
		}

		return $attributes;
	}

	/**
	 * Keeps the site values the instance's style takes. The style is the
	 * instance's own value of the scope attribute, or the block's default. A
	 * style that isn't listed takes every site value.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>                                              $site          Attribute name => site value.
	 * @param array<string, mixed>                                              $attributes    The instance's attributes.
	 * @param array{attribute: string, attributes: array<string, list<string>>} $scope         The scope attribute, and style => the site attributes it takes.
	 * @param mixed                                                             $default_style The scope attribute's default.
	 *
	 * @return array<string, mixed> The site values the instance takes.
	 */
	public static function scope( array $site, array $attributes, array $scope, $default_style ): array {
		$style = $attributes[ $scope['attribute'] ] ?? $default_style;

		if ( ! is_string( $style ) || ! isset( $scope['attributes'][ $style ] ) ) {
			return $site;
		}

		return array_intersect_key( $site, array_flip( $scope['attributes'][ $style ] ) );
	}

	/**
	 * Merges one attribute's site value into the instance value, leaf by leaf.
	 *
	 * @since TBD
	 *
	 * @param mixed $instance The instance value, null when the instance doesn't have the attribute.
	 * @param mixed $site     The site value.
	 * @param mixed $default  The block's default value.
	 *
	 * @return mixed The merged value.
	 */
	public static function merge( $instance, $site, $default ) {
		if ( null === $instance || $instance === $default ) {
			return $site;
		}

		if ( is_array( $instance ) && is_array( $site ) && is_array( $default ) ) {
			foreach ( $site as $key => $value ) {
				$instance[ $key ] = self::merge( $instance[ $key ] ?? null, $value, $default[ $key ] ?? null );
			}
		}

		return $instance;
	}
}
