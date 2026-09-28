<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use WP_Block_Type_Registry;

/**
 * Merges a block's site-level values into each instance's attributes before
 * Kadence builds its markup and CSS, so the existing builders render them.
 *
 * Precedence is decided per leaf: an instance leaf that differs from the
 * block's default wins, every other leaf takes the site value.
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
		$site = $this->store->attributes( $block_name );

		if ( ! $site ) {
			return $attributes;
		}

		$block_type = WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
		$defaults   = $block_type ? $block_type->attributes : [];

		foreach ( $site as $name => $value ) {
			$attributes[ $name ] = self::merge( $attributes[ $name ] ?? null, $value, $defaults[ $name ]['default'] ?? null );
		}

		return $attributes;
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
