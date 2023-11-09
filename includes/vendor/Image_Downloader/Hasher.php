<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

final class Hasher {

	/**
	 * The hashing algorithm to use.
	 *
	 * If on PHP8.1+, we'll use xxh128.
	 *
	 * @var string
	 */
	private $algo;

	public function __construct( string $algo = 'md5' ) {
		$this->algo = $algo;
	}

	/**
	 * Create a hash from different types of data.
	 *
	 * @param mixed $data   The data to hash.
	 * @param bool  $binary Output in raw binary.
	 *
	 * @return string
	 */
	public function hash( $data, bool $binary = false ): string {
		if ( is_scalar( $data ) ) {
			$data = (string) $data;
		} else {
			$data = json_encode( $data );
		}

		return hash( $this->algo, $data, $binary );
	}

}
