<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Status;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;

/**
 * Store the status for a post, used mostly to sort the Post List Table.
 *
 * @note The excluded status is actually the source of truth for this.
 */
final class Status {

	/**
	 * Optimization status values.
	 *
	 * Values are chosen to sort naturally:
	 * - ASC:  Excluded (-1) > Not Optimized (0) > Optimized (1) > Stale (2)
	 * - DESC: Stale (2) > Optimized (1) > Not Optimized (0) > Excluded (-1)
	 */
	public const EXCLUDED = -1;

	public const NOT_OPTIMIZED = 0;

	public const OPTIMIZED = 1;

	public const STALE = 2;

	private const STATUSES = [
		self::EXCLUDED      => true,
		self::NOT_OPTIMIZED => true,
		self::OPTIMIZED     => true,
		self::STALE         => true,
	];

	/**
	 * Check if a status is valid.
	 *
	 * @param int $status The status to check.
	 *
	 * @return bool
	 */
	public function is_valid( int $status ): bool {
		return isset( self::STATUSES[ $status ] );
	}

	/**
	 * Get the optimization status for a post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return int One of the STATUS_* constants.
	 */
	public function get( int $post_id ): int {
		return (int) get_post_meta( $post_id, Meta::KEY, true );
	}

	/**
	 * Set the optimization status for a post.
	 *
	 * @param int $post_id The post ID.
	 * @param int $status  One of the STATUS_* constants.
	 *
	 * @throws InvalidArgumentException If the wrong status is passed.
	 *
	 * @return bool
	 */
	public function set( int $post_id, int $status = self::OPTIMIZED ): bool {
		if ( ! isset( self::STATUSES[ $status ] ) ) {
			throw new InvalidArgumentException( 'Invalid status: ' . $status );
		}

		return (bool) update_post_meta( $post_id, Meta::KEY, $status );
	}

	/**
	 * Set the post to optimized.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function set_optimized( int $post_id ): bool {
		return $this->set( $post_id );
	}

	/**
	 * Set the post to excluded.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function set_excluded( int $post_id ): bool {
		return $this->set( $post_id, self::EXCLUDED );
	}

	/**
	 * Check if a post is excluded from optimization.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function is_excluded( int $post_id ): bool {
		return $this->get( $post_id ) === self::EXCLUDED;
	}

	/**
	 * Delete the status meta.
	 *
	 * IMPORTANT: Preserves EXCLUDED status since it's user-controlled.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function delete( int $post_id ): bool {
		if ( $this->is_excluded( $post_id ) ) {
			return false;
		}

		return delete_post_meta( $post_id, Meta::KEY );
	}

	/**
	 * Derive status from WebsiteAnalysis.
	 *
	 * Helper method to determine what status should be based on analysis state.
	 *
	 * @param WebsiteAnalysis|null $analysis The analysis data.
	 *
	 * @return int One of the STATUS_* constants.
	 */
	public function from_analysis( ?WebsiteAnalysis $analysis ): int {
		if ( ! $analysis ) {
			return self::NOT_OPTIMIZED;
		}

		return $analysis->isStale ? self::STALE : self::OPTIMIZED;
	}

	/**
	 * Sync status from analysis data.
	 *
	 * Automatically sets the correct status based on the analysis state.
	 * This is the single source of truth for deriving status from analysis.
	 *
	 * @param int                  $post_id  The post ID.
	 * @param WebsiteAnalysis|null $analysis The analysis data.
	 *
	 * @return bool
	 */
	public function sync_from_analysis( int $post_id, ?WebsiteAnalysis $analysis ): bool {
		$status = $this->from_analysis( $analysis );

		return $this->set( $post_id, $status );
	}
}
