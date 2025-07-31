<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash;

use KadenceWP\KadenceBlocks\Optimizer\Database\Viewport_Query;
use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;

/**
 * Stores a hash based on the rendered HTML for each viewport
 * in order to invalidate optimizer data if it changes.
 */
final class Hash_Store {

	private Viewport_Query $q;

	public function __construct( Viewport_Query $query ) {
		$this->q = $query;
	}

	/**
	 * Get the hash for a viewport.
	 *
	 * @param Path     $path The current path object.
	 * @param Viewport $vp The viewport enum.
	 *
	 * @return string|null
	 */
	public function get( Path $path, Viewport $vp ): ?string {
		$hash = $this->q->get_var(
			$this->q->qb()->select( 'html_hash' )
					->where( 'path_hash', $path->hash() )
					->where( 'viewport', $vp->value() )
					->getSQL()
		);

		return $hash ?: null;
	}

	/**
	 * Set the hash for a viewport.
	 *
	 * @param Path     $path The current path object.
	 * @param Viewport $vp The viewport enum.
	 * @param string   $hash The hash to store.
	 *
	 * @return bool
	 */
	public function set( Path $path, Viewport $vp, string $hash ): bool {
		return (bool) $this->q->qb()->upsert(
			[
				'path_hash' => $path->hash(),
				'viewport'  => $vp->value(),
				'html_hash' => $hash,
			],
			[
				'path_hash',
				'viewport',
			],
			[
				'%s',
				'%s',
				'%s',
			]
		);
	}

	/**
	 * Delete a viewport hash.
	 *
	 * @param Path     $path The current path object.
	 * @param Viewport $vp The viewport enum.
	 *
	 * @return bool
	 */
	public function delete( Path $path, Viewport $vp ): bool {
		return (bool) $this->q->qb()
								->where( 'path_hash', $path->hash() )
								->where( 'viewport', $vp->value() )
								->delete();
	}
}
