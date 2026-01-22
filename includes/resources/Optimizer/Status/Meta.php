<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Status;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;

/**
 * Post Meta to control excluding posts from being optimized set
 * via a Gutenberg plugin.
 *
 * @see kadence-control-plugin.js
 */
final class Meta {

	use Permalink_Trait;

	public const KEY                = '_kb_optimizer_status';

	private Asset $asset;
	private Status $status;
	private Store $store;

	public function __construct(
		Asset $asset,
		Status $status,
		Store $store
	) {
		$this->asset  = $asset;
		$this->status = $status;
		$this->store  = $store;
	}

	/**
	 * Register post meta for the Gutenberg sidebar toggle to exclude a post from optimization.
	 *
	 * @action init
	 *
	 * @return void
	 */
	public function register_meta(): void {
		register_post_meta(
			'',
			self::KEY,
			[
				'single'            => true,
				'type'              => 'integer',
				// Excluded is stored a -1.
				'sanitize_callback' => function ( $value ): int {
					$value = (int) $value;

					return $this->status->is_valid( $value ) ? $value : 0;
				},
				'auth_callback'     => static fn(): bool => current_user_can( 'edit_posts' ),
				'show_in_rest'      => [
					'schema' => [
						'type'        => 'integer',
						'description' => __( 'Exclude this post from optimization.', 'kadence-blocks' ),
					],
				],
			]
		);
	}

	/**
	 * Clear the optimizer data if this post is excluded.
	 *
	 * @action updated_post_meta
	 *
	 * @param int    $post_id The post ID this meta is for.
	 * @param string $meta_key The current meta key.
	 * @param mixed  $value The meta value.
	 *
	 * @return void
	 */
	public function maybe_clear_optimizer_data( int $post_id, string $meta_key, $value ): void {
		if ( $meta_key !== self::KEY || $value !== Status::EXCLUDED ) {
			return;
		}

		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}

		$post_path = $this->get_post_path( $post_id );

		if ( ! $post_path ) {
			return;
		}

		// Include post_id for reliable status synchronization.
		$path = new Path( $post_path, $post_id );

		$this->store->delete( $path );
	}
}
