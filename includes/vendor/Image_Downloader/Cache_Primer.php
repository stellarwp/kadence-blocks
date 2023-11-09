<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\Symfony\Contracts\HttpClient\HttpClientInterface;
use Throwable;

/**
 * Prime Pexels HTTP cache for future image downloading.
 */
final class Cache_Primer {

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
	 * How many external cache requests to create before removing them.
	 *
	 * @var int
	 */
	private $batch_size;

	public function __construct(
		HttpClientInterface $client,
		LoggerInterface $logger,
		Hasher $hasher,
		int $batch_size = 500
	) {
		$this->client     = $client;
		$this->logger     = $logger;
		$this->hasher     = $hasher;
		$this->batch_size = $batch_size;
	}

	/**
	 * Make asynchronous HEAD requests to all the potential images we'll download
	 * to ensure that Pexels caches their response to make downloading much quicker.
	 *
	 * This is as close to a non-blocking operation as possible.
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
	public function cache( array $collections ): void {
		if ( empty( $collections ) ) {
			return;
		}

		$batch     = 0;
		$cache_key = $this->hasher->hash( $collections );

		if ( get_transient( $cache_key ) !== false ) {
			$this->logger->debug( sprintf( 'Found cache key "%s", skipping image cache priming', $cache_key ) );

			return;
		}

		// Search results differ slightly from industry collections, reformat.
		if ( isset( $collections['images'] ) ) {
			$collections = [ $collections ];
		}

		foreach ( $collections as $collection ) {

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

		$duration = DAY_IN_SECONDS;

		$this->logger->debug( sprintf( 'Caching image priming using key "%s" for %d seconds', $cache_key, $duration ) );

		set_transient( $cache_key, true, $duration );
	}

}
