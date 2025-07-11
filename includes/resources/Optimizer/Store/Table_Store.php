<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Query;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use Throwable;

/**
 * Optimizer table storage.
 */
final class Table_Store implements Contracts\Store {

	private Optimizer_Query $q;

	public function __construct( Optimizer_Query $query ) {
		$this->q = $query;
	}

	/**
	 * Get the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( int $post_id ): ?WebsiteAnalysis {
		$json = $this->q->get_var(
			$this->q->qb()->select( 'analysis' )
					->where( 'post_id', $post_id )
					->getSQL()
		);

		if ( ! $json ) {
			return null;
		}

		try {
			return WebsiteAnalysis::from( json_decode( $json, true ) );
		} catch ( Throwable $e ) {
			return null;
		}
	}

	/**
	 * Set the optimization data for a post.
	 *
	 * @param int             $post_id The post ID to associate with the data.
	 * @param WebsiteAnalysis $analysis The website analysis data.
	 *
	 * @return bool
	 */
	public function set( int $post_id, WebsiteAnalysis $analysis ): bool {
		$json = wp_json_encode( $analysis->toArray(), JSON_UNESCAPED_SLASHES );

		return (bool) $this->q->qb()->upsert(
			[
				'post_id'  => $post_id,
				'analysis' => $json,
			],
			[
				'post_id',
			],
			[
				'%d',
				'%s',
			]
		);
	}

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return bool
	 */
	public function delete( int $post_id ): bool {
		return (bool) $this->q->qb()
								->where( 'post_id', $post_id )
								->delete();
	}
}
