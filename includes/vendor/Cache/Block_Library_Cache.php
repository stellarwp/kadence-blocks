<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Cache;

use KadenceWP\KadenceBlocks\Hasher;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Contracts\Storage;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Exceptions\NotFoundException;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Exceptions\StorageException;

/**
 * Caches Block Library files.
 */
class Block_Library_Cache {

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
	 * @var Image_Cache_Validator
	 */
	protected $validator;

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
	 * @param Storage               $storage   The file storage library.
	 * @param Hasher                $hasher    The hashing library.
	 * @param Config                $config    The cache configuration.
	 * @param LoggerInterface       $logger    The logger, enabled if WP_DEBUG is set to true.
	 * @param Image_Cache_Validator $validator Validates a cached API response still has the correct image sizes.
	 * @param string                $ext       The file extension all files will be saved with.
	 */
	public function __construct(
		Storage $storage,
		Hasher $hasher,
		Config $config,
		LoggerInterface $logger,
		Image_Cache_Validator $validator,
		string $ext = '.json'
	) {
		$this->storage   = $storage;
		$this->hasher    = $hasher;
		$this->config    = $config;
		$this->logger    = $logger;
		$this->validator = $validator;
		$this->ext       = $ext;
	}

	/**
	 * Prime data to be cached when the WordPress shutdown action occurs.
	 *
	 * @param mixed $identifier Unique data to identify this file.
	 * @param mixed $data       The data to store.
	 *
	 * @return void
	 * @throws \InvalidArgumentException
	 * @throws \RuntimeException
	 */
	public function cache( $identifier, $data ): void {
		$identifier = $this->filename( $identifier );

		$this->items[ $identifier ] = $data;
	}

	/**
	 * Writes the data to the file system cache on WordPress's shutdown action.
	 *
	 * @action shutdown
	 *
	 * @return void
	 */
	public function write(): void {
		if ( ! isset( $this->items ) ) {
			return;
		}

		/*
		 * If running on PHP-FPM, this will return the request, but continue processing
		 * the code below in the thread, which means it instantly sends the request back
		 * to the browser without needing to wait for anything.
         */
		if ( function_exists( 'fastcgi_finish_request' ) ) {
			fastcgi_finish_request();
		}

		foreach ( $this->items as $filename => $data ) {
			if ( $this->storage->has( $filename ) ) {
				$this->logger->warning( 'Filename already exists', [
					'filename' => $filename,
				] );

				continue;
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
	 * @throws \InvalidArgumentException
	 * @throws \KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Exceptions\NotFoundException
	 * @throws \KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Exceptions\StorageException
	 * @throws \RuntimeException
	 */
	public function get( $identifier ): string {
		$identifier = $this->filename( $identifier );
		$content    = $this->storage->get( $identifier );

		$this->logger->debug( sprintf( 'Found cache file: %s', $identifier ) );

		if ( ! $this->is_valid( $content ) ) {
			$this->logger->warning( sprintf(
				'"%s" does not contain valid image sizes, deleting cache file...',
				$identifier
			) );

			$this->storage->delete( $identifier );

			throw NotFoundException::pathNotFound( $identifier );
		}

		return $content;
	}

	/**
	 * Make sure image sizes haven't changed between the site and the cached file.
	 *
	 * @param string $content The JSON content from a cached file.
	 *
	 * @return bool
	 */
	protected function is_valid( string $content ): bool {
		if ( ! str_contains( $content, '"images":' ) ) {
			return true;
		}

		return $this->validator->is_valid( $content );
	}

	/**
	 * Create a hashed file name from provided identifier.
	 *
	 * @param mixed $identifier Unique data to identify this file.
	 *
	 * @return string
	 * @throws \InvalidArgumentException
	 * @throws \RuntimeException
	 */
	protected function filename( $identifier ): string {
		return $this->hasher->hash( [
			$this->config->base_url,
			$this->config->base_path,
			$identifier,
		] ) . $this->ext;
	}

}
