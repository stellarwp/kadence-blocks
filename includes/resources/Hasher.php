<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks;

use InvalidArgumentException;
use RuntimeException;

final class Hasher {

	/**
	 * The hashing algorithm to use.
	 *
	 * If on PHP8.1+, we'll use xxh128.
	 *
	 * @var string
	 */
	private $algo;

	/**
	 * @param string $algo The hashing algorithm to use.
	 *
	 * @see \hash_algos()
	 */
	public function __construct( string $algo = 'md5' ) {
		$this->algo = $algo;
	}

	/**
	 * Create a hash from different types of data.
	 *
	 * @param string|object|array|int|float $data   The data to hash.
	 * @param bool                          $binary Output in raw binary.
	 *
	 * @return string
	 *
	 * @throws InvalidArgumentException|RuntimeException
	 */
	public function hash( $data, bool $binary = false ): string {
		if ( $data === null ) {
			throw new InvalidArgumentException( '$data cannot be null.' );
		}

		$data = is_scalar( $data ) ? (string) $data : (string) json_encode( $data );

		if ( strlen( $data ) <= 0 ) {
			throw new RuntimeException( 'Cannot hash an empty data string. Perhaps JSON encoding failed?' );
		}

		return hash( $this->algo, $data, $binary );
	}

}
