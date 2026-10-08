<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use KadenceWP\KadenceBlocks\Adbar\Dot;
use WP_Theme_JSON_Resolver;

/**
 * Reads a block's site-level values from the user Global Styles, as block
 * attributes.
 *
 * The values are read from the stored `wp_global_styles` post, not through the
 * resolver: `settings.custom.kadence` is removed from what core renders, so the
 * resolver never returns it.
 *
 * @since TBD
 */
final class Store {

	/**
	 * The supported blocks.
	 *
	 * @var Supported_Blocks
	 */
	private Supported_Blocks $blocks;

	/**
	 * @since TBD
	 *
	 * @param Supported_Blocks $blocks The supported blocks.
	 */
	public function __construct( Supported_Blocks $blocks ) {
		$this->blocks = $blocks;
	}

	/**
	 * Returns a block's `settings.custom.kadence.<slug>` values as block
	 * attributes. The colors in core's style for the block are left to core's
	 * global stylesheet.
	 *
	 * @since TBD
	 *
	 * @param string $block_name Block name, e.g. `kadence/singlebtn`.
	 *
	 * @return array<string, mixed> Attribute name => site-level value; empty in classic mode or for an unsupported block.
	 */
	public function attributes( string $block_name ): array {
		$block = $this->blocks->get( $block_name );

		if ( null === $block || ! kadence_blocks_is_fse_mode() ) {
			return [];
		}

		$attributes = ( new Dot( $this->user_data() ) )->get( 'settings.custom.kadence.' . $block->get_slug(), [] );

		return is_array( $attributes ) ? $attributes : [];
	}

	/**
	 * Returns the mapped paths in a block's core style that hold a site value
	 * on any device, e.g. `color.background`.
	 *
	 * @since TBD
	 *
	 * @param string $block_name Block name, e.g. `kadence/singlebtn`.
	 *
	 * @return list<string> Paths, in the order of the block's attributes map; empty in classic mode or for an unsupported block.
	 */
	public function core_paths( string $block_name ): array {
		$block = $this->blocks->get( $block_name );

		if ( null === $block || ! kadence_blocks_is_fse_mode() ) {
			return [];
		}

		$style = ( new Dot( $this->user_data() ) )->get( 'styles.blocks.' . $block_name, [] );

		if ( ! is_array( $style ) ) {
			return [];
		}

		$states = [ $style ];

		foreach ( $style as $key => $value ) {
			if ( is_string( $key ) && 0 === strpos( $key, '@' ) && is_array( $value ) ) {
				$states[] = $value;
			}
		}

		$paths = [];

		foreach ( $block->site_styles_attributes_map() as $path ) {
			foreach ( $states as $state ) {
				if ( ! empty( ( new Dot( $state ) )->get( $path ) ) ) {
					$paths[] = $path;
					break;
				}
			}
		}

		return $paths;
	}

	/**
	 * @return array<string, mixed> The decoded user Global Styles post, empty when there is none.
	 */
	private function user_data(): array {
		$post = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme() );

		if ( empty( $post['post_content'] ) ) {
			return [];
		}

		$data = json_decode( $post['post_content'], true );

		return is_array( $data ) ? $data : [];
	}
}
