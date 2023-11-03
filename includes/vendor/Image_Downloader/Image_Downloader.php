<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Providable;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Exceptions\ImageDownloadException;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\ImageDownloader;
use RuntimeException;

final class Image_Downloader {

	private static $instance;

	/**
	 * @var Container
	 */
	private $container;

	/**
	 * @var class-string<Providable>
	 */
	private $providers = array(
		Image_Downloader_Provider::class,
	);

	private function __construct(
		Container $container
	) {
		$this->container = $container;

		$this->init();
	}

	/**
	 * @param Container|null $container
	 *
	 * @return self
	 * @throws InvalidArgumentException
	 */
	public static function instance( ?Container $container = null ): Image_Downloader {
		if ( ! isset( self::$instance ) ) {
			if ( ! $container ) {
				throw new InvalidArgumentException( 'You need to provide a concrete Contracts\Container instance!' );
			}

			self::$instance = new self( $container );
		}

		return self::$instance;
	}

	/**
	 * Download and import a collection of images to the WordPress library.
	 *
	 * @param array<array{
	 *      collection_slug?: string,
	 *      image_type?: string,
	 *      images: array<int, array{
	 *           id: int,
	 *           width: int,
	 *           height: int,
	 *           alt: string,
	 *           url: string,
	 *           photographer: string,
	 *           photographer_url: string,
	 *           avg_color: string,
	 *           sizes: non-empty-array<int,array{name: string, src: string}>
	 *      }>
	 *     }> $images
	 *
	 * @return array<array{id: int, url: string}>
	 * @throws ImageDownloadException
	 * @throws \Throwable
	 */
	public function download( array $images ): array {
		if ( ! current_user_can( 'upload_files' ) ) {
			return [];
		}

		$path = wp_get_upload_dir()['path'] ?? '';

		if ( ! $path ) {
			return [];
		}

		if ( ! isset( $images['image_type'] ) ) {
			$images['image_type'] = 'jpg';
		}

		if ( ! isset( $images['collection_slug'] ) ) {
			$images['collection_slug'] = wp_generate_password( 12, false );
		}

		$collection[] = $images;

		$downloaded = $this->container->get( ImageDownloader::class )->download( $collection, $path );

		return $this->container->get( WordPress_Importer::class )->import( $downloaded );
	}

	public function container(): Container {
		return $this->container;
	}

	private function init(): void {
		$this->container->bind( Container::class, $this->container );

		foreach ( $this->providers as $provider ) {
			$this->container->register( $provider );
		}
	}

	private function __clone() {
	}

	public function __wakeup(): void {
		throw new RuntimeException( 'method not implemented' );
	}

	public function __sleep(): array {
		throw new RuntimeException( 'method not implemented' );
	}
}
