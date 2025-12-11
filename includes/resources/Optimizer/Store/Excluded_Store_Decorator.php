<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;

/**
 * Store decorator that blocks optimization operations on excluded posts.
 *
 * Excluded posts are user-controlled and should never have optimization data.
 * This decorator provides infrastructure-level protection.
 *
 * Responsibility: Prevent optimization of excluded posts.
 */
final class Excluded_Store_Decorator implements Store {

	private Store $store;
	private Status $status;
	private LoggerInterface $logger;

	public function __construct(
		Store $store,
		Status $status,
		LoggerInterface $logger
	) {
		$this->store  = $store;
		$this->status = $status;
		$this->logger = $logger;
	}

	/**
	 * An excluded post should return false for if it has data,
	 * even if it does.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function has( Path $path ): bool {
		$post_id = $path->post_id();

		if ( $post_id && $this->status->is_excluded( $post_id ) ) {
			return false;
		}

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
	 * Block optimization of excluded posts.
	 *
	 * If post is excluded, silently fail and log.
	 * This provides defense-in-depth even if application layer checks fail.
	 *
	 * @param Path            $path The path object.
	 * @param WebsiteAnalysis $analysis The website analysis data.
	 *
	 * @return bool
	 */
	public function set( Path $path, WebsiteAnalysis $analysis ): bool {
		$post_id = $path->post_id();

		if ( ! $post_id ) {
			$this->logger->warning(
				'Missing post_id in Path: Skipping exclusion check and storing optimization data without post_id',
				[ 'path' => $path->path() ]
			);

			return $this->store->set( $path, $analysis );
		}

		// Check if post is excluded.
		if ( $this->status->is_excluded( $post_id ) ) {
			// Silently block - excluded posts should never be optimized.
			$this->logger->debug(
				'Blocked optimization of excluded post',
				[
					'post_id' => $post_id,
					'path'    => $path->path(),
				]
			);

			return false;
		}

		return $this->store->set( $path, $analysis );
	}

	/**
	 * Allow deletion even for excluded posts.
	 *
	 * Clearing optimization data is safe for excluded posts.
	 * Status_Sync_Store_Decorator will preserve the excluded status meta.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function delete( Path $path ): bool {
		return $this->store->delete( $path );
	}
}
