<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Query;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
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
	 * Whether a Path has optimization data.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function has( Path $path ): bool {
		return (bool) $this->q->get_var(
			$this->q->qb()->select( '1' )
					->where( 'path_hash', $path->hash() )
					->limit( 1 )->getSQL()
		);
	}

	/**
	 * Get the optimization data for a path object.
	 *
	 * @param Path $path The path object associated with the stored data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( Path $path ): ?WebsiteAnalysis {
		$json = $this->q->get_var(
			$this->q->qb()->select( 'analysis' )
					->where( 'path_hash', $path->hash() )
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
	 * Set the optimization data for a path object.
	 *
	 * @param Path            $path The path object associated with the stored data.
	 * @param WebsiteAnalysis $analysis The website analysis data.
	 *
	 * @return bool
	 */
	public function set( Path $path, WebsiteAnalysis $analysis ): bool {
		$json = wp_json_encode( $analysis->toArray(), JSON_UNESCAPED_SLASHES );

		return false !== $this->q->qb()->upsert(
			[
				'path_hash' => $path->hash(),
				'path'      => $path->path(),
				'analysis'  => $json,
			],
			[
				'path_hash',
			],
			[
				'%s',
				'%s',
				'%s',
			]
		);
	}

	/**
	 * Delete the optimization data for a path object.
	 *
	 * @param Path $path The path object associated with the stored data.
	 *
	 * @return bool
	 */
	public function delete( Path $path ): bool {
		return (bool) $this->q->qb()
								->where( 'path_hash', $path->hash() )
								->delete();
	}
}
