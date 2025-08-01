<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Shutdown;

use KadenceWP\KadenceBlocks\Shutdown\Contracts\Terminable;

/**
 * A collection of tasks that will run on the WordPress shutdown action.
 */
final class Shutdown_Collection {

	/**
	 * @var Terminable[]
	 */
	private array $tasks;

	/**
	 * @param Terminable[] $tasks The tasks to process.
	 */
	public function __construct( array $tasks = [] ) {
		$this->tasks = $tasks;
	}

	/**
	 * @return Terminable[]
	 */
	public function all(): array {
		return $this->tasks;
	}
}
