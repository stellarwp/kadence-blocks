<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Admin;

use KadenceWP\KadenceBlocks\Asset\Asset;

/**
 * Post Meta to control excluding posts from being optimized set
 * via a Gutenberg plugin.
 *
 * @see Optimizer/assets/js/meta/index.js
 */
final class Post_Meta {

	public const META_KEY           = '_kb_optimizer_exclude';
	public const META_SCRIPT_HANDLE = 'kadence-optimizer-meta';

	private Asset $asset;

	public function __construct( Asset $asset ) {
		$this->asset = $asset;
	}

	/**
	 * Register post meta to exclude a post from optimization.
	 *
	 * @action init
	 *
	 * @return void
	 */
	public function register_meta(): void {
		register_post_meta(
			'', // Pass an empty string to register the meta key across all existing post types.
			self::META_KEY,
			[
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => 'boolean',
				'description'       => __( 'Exclude this post from optimization.', 'kadence-blocks' ),
				'sanitize_callback' => 'rest_sanitize_boolean',
				'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
			]
		);
	}

	/**
	 * Enqueue Meta Optimizer script when editing a post in Gutenberg.
	 *
	 * @action enqueue_block_editor_assets
	 *
	 * @return void
	 */
	public function enqueue_meta_script(): void {
		$this->asset->enqueue_script( self::META_SCRIPT_HANDLE, 'dist/kadence-optimizer-meta' );
	}
}
