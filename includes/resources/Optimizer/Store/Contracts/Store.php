<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store\Contracts;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;

interface Store {

	/**
	 * Whether a Path has optimization data.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function has( Path $path ): bool;

	/**
	 * Get the optimization data for a post.
	 *
	 * @param Path $path The path object.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( Path $path ): ?WebsiteAnalysis;

	/**
	 * Set the optimization data for a post.
	 *
	 * @param Path            $path The path object.
	 * @param WebsiteAnalysis $analysis The website analysis data.
	 *
	 * @return bool
	 */
	public function set( Path $path, WebsiteAnalysis $analysis ): bool;

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function delete( Path $path ): bool;
}
