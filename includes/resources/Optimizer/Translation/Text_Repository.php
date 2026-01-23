<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Translation;

use InvalidArgumentException;

/**
 * Provides shared translated strings.
 */
final class Text_Repository {

	public const RUN_OPTIMIZER             = 'runOptimizer';
	public const REMOVE_OPTIMIZATION       = 'removeOptimization';
	public const OPTIMIZED                 = 'optimized';
	public const OPTIMIZING                = 'optimizing';
	public const NOT_OPTIMIZED             = 'notOptimized';
	public const NOT_OPTIMIZABLE           = 'notOptimizable';
	public const EXCLUDED                  = 'excluded';
	public const OPTIMIZATION_OUTDATED     = 'outdated';
	public const OPTIMIZATION_OUTDATED_RUN = 'outdateRunOptimizer';

	/**
	 * @var array<string, string> $labels Translated labels indexed by the above constants.
	 */
	private array $labels;

	/**
	 * @param array<string, string> $labels Translated labels indexed by the above constants.
	 */
	public function __construct( array $labels ) {
		$this->labels = $labels;
	}

	/**
	 * Get a translated label.
	 *
	 * @param string $key
	 *
	 * @throws InvalidArgumentException If passed a key that doesn't exist.
	 *
	 * @return string
	 */
	public function get( string $key ): string {
		if ( ! isset( $this->labels[ $key ] ) ) {
			throw new InvalidArgumentException( "Unknown label key: $key" );
		}

		return $this->labels[ $key ];
	}

	/**
	 * Get all labels.
	 *
	 * @return array<string, string>
	 */
	public function all(): array {
		return $this->labels;
	}
}
