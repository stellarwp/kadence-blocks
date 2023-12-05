<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\Hasher;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\Shutdown\Contracts\Terminable;
use KadenceWP\KadenceBlocks\Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;

/**
 * Prime Pexels HTTP cache for future image downloading.
 */
final class Cache_Primer implements Terminable {

	/**
	 * @var HttpClientInterface
	 */
	private $client;

	/**
	 * @var LoggerInterface
	 */
	private $logger;

	/**
	 * @var Hasher
	 */
	private $hasher;

	/**
	 * How long in seconds to wait until we remotely prime the collection of images again.
	 *
	 * @var int Time in seconds.
	 */
	private $cache_duration;

	/**
	 * How many external cache requests to create before removing them.
	 *
	 * @var int
	 */
	private $batch_size;

	/**
	 * The collections cache, to run when the class is destroyed.
	 *
	 * @var array<array{
	 *         collection_slug: string,
	 *         image_type: string,
	 *         images: array<int, array{
	 *              id: int,
	 *              width: int,
	 *              height: int,
	 *              alt: string,
	 *              url: string,
	 *              photographer: string,
	 *              photographer_url: string,
	 *              avg_color: string,
	 *              sizes: non-empty-array<int,array{name: string, src: string}>
	 *         }>
	 *        }> $collections
	 */
	private $collections;

	/**
	 * @param HttpClientInterface $client         The HTTP client.
	 * @param LoggerInterface     $logger         The logger.
	 * @param Hasher              $hasher         The hasher.
	 * @param int                 $cache_duration The cache duration in seconds.
	 * @param int                 $batch_size     How many external cache requests to create before removing them.
	 */
	public function __construct(
		HttpClientInterface $client,
		LoggerInterface $logger,
		Hasher $hasher,
		int $cache_duration,
		int $batch_size = 500
	) {
		$this->client         = $client;
		$this->logger         = $logger;
		$this->hasher         = $hasher;
		$this->cache_duration = $cache_duration;
		$this->batch_size     = $batch_size;
	}

	/**
	 * Assign which collections will be primed on the WordPress shutdown hook.
	 *
	 * @param array<array{
	 *        collection_slug: string,
	 *        image_type: string,
	 *        images: array<int, array{
	 *             id: int,
	 *             width: int,
	 *             height: int,
	 *             alt: string,
	 *             url: string,
	 *             photographer: string,
	 *             photographer_url: string,
	 *             avg_color: string,
	 *             sizes: non-empty-array<int,array{name: string, src: string}>
	 *        }>
	 *       }> $collections
	 *
	 * @return void
	 */
	public function init( array $collections ): void {
		if ( empty( $collections ) ) {
			return;
		}

		$this->collections = $collections;
	}

	/**
	 * Prime cache on shutdown.
	 *
	 * @action shutdown
	 *
	 * @return void
	 * @throws \InvalidArgumentException
	 * @throws \RuntimeException
	 */
	public function terminate(): void {
		$this->execute();
	}

	/**
	 * On shutdown, make asynchronous HEAD requests to all the potential images we'll download
	 * to ensure that Pexels caches their response to make downloading much quicker.
	 *
	 * This allows for 0 blocking.
	 *
	 * @action shutdown
	 *
	 * @return void
	 *
	 * @throws \InvalidArgumentException
	 * @throws \RuntimeException
	 */
	private function execute(): void {
		if ( ! isset( $this->collections ) ) {
			return;
		}

		$batch     = 0;
		$cache_key = $this->hasher->hash( $this->collections );

		if ( get_transient( $cache_key ) !== false ) {
			$this->logger->debug( sprintf( 'Found cache key "%s", skipping image cache priming', $cache_key ) );

			unset( $this->collections );

			return;
		}

		// Search results differ slightly from industry collections, reformat.
		if ( isset( $this->collections['images'] ) ) {
			$this->collections = [ $this->collections ];
		}

		foreach ( $this->collections as $collection ) {

			$this->logger->debug( sprintf( 'Priming image cache for %d images...', count( $collection['images'] ) ) );

			foreach ( $collection['images'] as $image ) {

				$this->logger->debug( sprintf( 'Priming image cache for: %s', $image['url'] ) );

				foreach ( $image['sizes'] as $size ) {
					try {
						$batch++;

						$url = $size['src'];

						// These are async requests; We won't wait for the responses.
						$promises[ $url ] = $this->client->request( 'HEAD', $url, [
							'timeout'      => 0.1,
							'max_duration' => 0.1,
						] );
					} catch ( Throwable $e ) {
					}

					// Remove existing promises when batch size reached.
					if ( $batch >= $this->batch_size ) {
						$batch = 0;

						try {
							unset( $promises );
						} catch ( Throwable $e ) {
						}
					}
				}
			}
		}

		// Remove any remaining promises.
		try {
			unset( $promises );
		} catch ( Throwable $e ) {
		}

		// Clear collections state in case this is accessed again in the same request.
		unset( $this->collections );

		$this->logger->debug( sprintf( 'Caching image priming using key "%s" for %d seconds', $cache_key, $this->cache_duration ) );

		set_transient( $cache_key, true, $this->cache_duration );
	}

}
