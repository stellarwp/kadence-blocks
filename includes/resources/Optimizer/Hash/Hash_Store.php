<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash;

use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;

/**
 * Stores a hash based on the rendered HTML for each viewport
 * in order to invalidate optimizer data if it changes.
 */
final class Hash_Store {

	/**
	 * Get the hash for a viewport.
	 *
	 * @param int      $post_id The post ID.
	 * @param Viewport $vp The viewport enum.
	 *
	 * @return string|null
	 */
	public function get( int $post_id, Viewport $vp ): ?string {
		$hash = get_post_meta( $post_id, $this->get_key( $vp ), true );

		return $hash ?: null;
	}

	/**
	 * Set the hash for a viewport.
	 *
	 * @param int      $post_id The post ID.
	 * @param Viewport $vp The viewport enum.
	 * @param string   $hash The hash to store.
	 *
	 * @return bool
	 */
	public function set( int $post_id, Viewport $vp, string $hash ): bool {
		return (bool) update_post_meta(
			$post_id,
			$this->get_key( $vp ),
			$hash
		);
	}

	/**
	 * Delete a viewport hash.
	 *
	 * @param int      $post_id The post ID.
	 * @param Viewport $vp The viewport enum.
	 *
	 * @return bool
	 */
	public function delete( int $post_id, Viewport $vp ): bool {
		return delete_post_meta( $post_id, $this->get_key( $vp ) );
	}

	/**
	 * Generate a viewport hash key.
	 *
	 * @param Viewport $vp The viewport enum.
	 *
	 * @return string
	 */
	private function get_key( Viewport $vp ): string {
		return sprintf( '_kb_optimizer_%s_hash', $vp );
	}
}
