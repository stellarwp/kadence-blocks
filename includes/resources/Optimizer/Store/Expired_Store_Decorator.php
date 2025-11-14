<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;

/**
 * A Store Decorator that checks if the data is expired before
 * returning it.
 */
final class Expired_Store_Decorator implements Contracts\Store {

	/**
	 * The underlying store concrete.
	 *
	 * @var Store
	 */
	private Store $store;

	public function __construct( Store $store ) {
		$this->store = $store;
	}

	/**
	 * Whether a Path has optimization data, stale or not.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function has( Path $path ): bool {
		return $this->store->has( $path );
	}

	/**
	 * Only return the optimization if the analysis data is newer than the post's last modified date.
	 *
	 * @param Path $path The path object associated with the stored data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( Path $path ): ?WebsiteAnalysis {
		$analysis = $this->store->get( $path );

		if ( ! $analysis ) {
			return null;
		}

		return $analysis->isStale ? null : $analysis;
	}

	/**
	 * Set the optimization data for a post.
	 *
	 * @param Path            $path The path object associated with the stored data.
	 * @param WebsiteAnalysis $analysis The website analysis data.
	 *
	 * @return bool
	 */
	public function set( Path $path, WebsiteAnalysis $analysis ): bool {
		return $this->store->set( $path, $analysis );
	}

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param Path $path The path object associated with the stored data.
	 *
	 * @return bool
	 */
	public function delete( Path $path ): bool {
		return $this->store->delete( $path );
	}
}
