<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Providable;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Exceptions\ImageDownloadException;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\ImageDownloader;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Models\DownloadedImage;
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
	public static function instance( ?Container $container ): Image_Downloader {
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
	 *      image_type: string,
	 *      images: array<int, array{
	 *           alt: string,
	 *           url: string,
	 *           photographer: string,
	 *           photographer_url: string,
	 *           avg_color: string,
	 *           sizes: non-empty-array<int,array{name: string, src: string}>
	 *      }>
	 *     }> $images
	 *
	 * @return array<int, array<string, DownloadedImage>>
	 * @throws ImageDownloadException
	 * @throws \Throwable
	 */
	public function download( array $images ): array {
		$path = wp_get_upload_dir()['path'] ?? '';

		if ( ! $path ) {
			return [];
		}

		if ( ! isset( $images['image_type'] ) ) {
			$images['image_type'] = 'jpg';
		}

		// TODO: this needs to be passed to the WordPress_Imported and brought into the media library.
		return $this->container->get( ImageDownloader::class )->download( $images, $path );
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
