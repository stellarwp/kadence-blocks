<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Cache;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Hasher;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\Shutdown\Contracts\Terminable;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Contracts\Storage;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Exceptions\StorageException;

/**
 * Caches Block Library files.
 */
class Block_Library_Cache implements Terminable {

	/**
	 * @var Storage
	 */
	protected $storage;

	/**
	 * @var Hasher
	 */
	protected $hasher;

	/**
	 * @var Config
	 */
	protected $config;

	/**
	 * @var LoggerInterface
	 */
	protected $logger;

	/**
	 * The filename extension for all files.
	 *
	 * @var string
	 */
	protected $ext;

	/**
	 * The data to be cached on shutdown, indexed by a filename.
	 *
	 * @var array<string, mixed>
	 */
	protected $items;

	/**
	 * @param Storage         $storage The file storage library.
	 * @param Hasher          $hasher  The hashing library.
	 * @param Config          $config  The cache configuration.
	 * @param LoggerInterface $logger  The logger, enabled if WP_DEBUG is set to true.
	 * @param string          $ext     The file extension all files will be saved with.
	 *
	 * @throws InvalidArgumentException
	 */
	public function __construct(
		Storage $storage,
		Hasher $hasher,
		Config $config,
		LoggerInterface $logger,
		string $ext = '.json'
	) {
		$this->storage = $storage;
		$this->hasher  = $hasher;
		$this->config  = $config;
		$this->logger  = $logger;
		$this->ext     = $ext;

		if ( ! str_starts_with( $ext, '.' ) || str_starts_with( $ext, '..' ) ) {
			throw new InvalidArgumentException( 'The $ext must start with a single period' );
		}

	}

	/**
	 * Prime data to be cached when the WordPress shutdown action occurs.
	 *
	 * @param mixed $identifier Unique data to identify this file.
	 * @param mixed $data       The data to store.
	 *
	 * @return void
	 * @throws InvalidArgumentException
	 * @throws \RuntimeException
	 */
	public function cache( $identifier, $data ): void {
		$identifier = $this->filename( $identifier );

		$this->items[ $identifier ] = $data;
	}

	/**
	 * Write cache file on shutdown.
	 *
	 * @action shutdown
	 *
	 * @return void
	 */
	public function terminate(): void {
		$this->write();
	}

	/**
	 * Writes the data to the file system cache on WordPress's shutdown action.
	 *
	 * @action shutdown
	 *
	 * @return void
	 */
	private function write(): void {
		if ( ! isset( $this->items ) ) {
			return;
		}
		foreach ( $this->items as $filename => $data ) {
			if ( $this->storage->has( $filename ) ) {
				$this->logger->debug( 'Filename already exists, deleting file...', [
					'filename' => $filename,
				] );

				try {
					$this->storage->delete( $filename );
				} catch ( StorageException $e ) {
					$this->logger->error( 'Error deleting existing cache file', [
						'filename'  => $filename,
						'exception' => $e->getMessage(),
					] );
				}
			}

			try {
				$this->logger->debug( sprintf( 'Writing cache file: %s', $filename ) );

				$this->storage->put( $filename, $data );
			} catch ( StorageException $e ) {
				$this->logger->error( 'Error saving cache file', [
					'filename'  => $filename,
					'exception' => $e->getMessage(),
				] );
			}
		}

		unset( $this->items );
	}

	/**
	 * Get a file from the cache.
	 *
	 * @param mixed $identifier Unique data to identify this file.
	 *
	 * @return string The file contents.
	 * @throws InvalidArgumentException
	 * @throws \KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Exceptions\NotFoundException
	 * @throws \RuntimeException
	 */
	public function get( $identifier ): string {
		$identifier = $this->filename( $identifier );
		$content    = $this->storage->get( $identifier );

		$this->logger->debug( sprintf( 'Found cache file: %s', $identifier ) );

		return $content;
	}

	/**
	 * Create a hashed file name from provided identifier.
	 *
	 * @param mixed $identifier Unique data to identify this file.
	 *
	 * @return string
	 * @throws InvalidArgumentException
	 * @throws \RuntimeException
	 */
	protected function filename( $identifier ): string {
		return $this->hasher->hash( [
			$this->config->base_url(),
			$this->config->base_path(),
			$identifier,
		] ) . $this->ext;
	}

}
