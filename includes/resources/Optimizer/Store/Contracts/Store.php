<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store\Contracts;

use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;

interface Store {

	/**
	 * Get the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( int $post_id ): ?WebsiteAnalysis;

	/**
	 * Set the optimization data for a post.
	 *
	 * @param int             $post_id The post ID to associate with the data.
	 * @param WebsiteAnalysis $analysis  The website analysis data.
	 *
	 * @return bool
	 */
	public function set( int $post_id, WebsiteAnalysis $analysis ): bool;

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return bool
	 */
	public function delete( int $post_id ): bool;
}
