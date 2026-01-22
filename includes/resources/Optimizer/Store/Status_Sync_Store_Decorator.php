<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use WP_Post;

/**
 * Store decorator that automatically synchronizes Status post meta.
 *
 * Pure synchronization logic - no business rules or exclusion checks.
 * Exclusion is handled by Excluded_Store_Decorator upstream.
 *
 * Responsibility: Keep status meta in sync with optimization data.
 *
 * Benefits:
 * - Single source of truth for optimization state
 * - Impossible to forget to update status meta
 * - Automatic synchronization on all write operations
 * - No overhead on read operations
 */
final class Status_Sync_Store_Decorator implements Store {

	private Store $store;
	private Status $status;

	public function __construct( Store $store, Status $status ) {
		$this->store  = $store;
		$this->status = $status;
	}

	/**
	 * Whether a Path has optimization data.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function has( Path $path ): bool {
		return $this->store->has( $path );
	}

	/**
	 * Get the optimization data.
	 *
	 * @param Path $path The path object associated with the stored data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( Path $path ): ?WebsiteAnalysis {
		return $this->store->get( $path );
	}

	/**
	 * Set optimization data and sync status meta.
	 *
	 * Pure sync logic - no exclusion checks needed!
	 * Excluded_Store_Decorator upstream prevents optimization of excluded posts.
	 *
	 * @param Path            $path The path object.
	 * @param WebsiteAnalysis $analysis The website analysis data.
	 *
	 * @return bool
	 */
	public function set( Path $path, WebsiteAnalysis $analysis ): bool {
		$result = $this->store->set( $path, $analysis );

		if ( ! $result ) {
			return false;
		}

		$post_id = $this->resolve_post_id( $path );

		if ( $post_id ) {
			$this->status->sync_from_analysis( $post_id, $analysis );
		}

		return true;
	}

	/**
	 * Delete optimization data and sync status meta.
	 *
	 * Pure cleanup logic - no exclusion checks needed!
	 *
	 * Note: Status::delete() will preserve excluded status as a safety measure.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function delete( Path $path ): bool {
		$post_id = $this->resolve_post_id( $path );
		$result  = $this->store->delete( $path );

		if ( $post_id ) {
			$this->status->delete( $post_id );
		}

		return $result;
	}

	/**
	 * Resolve post ID from path.
	 *
	 * Priority order:
	 * 1. Explicit post_id from Path object (most reliable)
	 * 2. Current request context via get_post() and $post global
	 *
	 * @param Path $path The path object.
	 *
	 * @return int|null
	 */
	private function resolve_post_id( Path $path ): ?int {
		// Use explicit post_id if provided (most reliable).
		if ( $path->post_id() ) {
			return $path->post_id();
		}

		// Try to get from current request context via get_post().
		$current_post = get_post();

		if ( ! $current_post instanceof WP_Post ) {
			return null;
		}

		return $current_post->ID;
	}
}
