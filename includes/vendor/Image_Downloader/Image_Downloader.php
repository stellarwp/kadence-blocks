<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Providable;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Exceptions\ImageDownloadException;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\ImageDownloader;
use RuntimeException;
use Throwable;

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

	public function container(): Container {
		return $this->container;
	}

	/**
	 * Download and import a collection of images to the WordPress library.
	 *
	 * @param array<array{
	 *      collection_slug?: string,
	 *      image_type?: string,
	 *      images: array<int, array{
	 *           id: int,
	 *           post_id?: int,
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
	 * @throws Throwable
	 */
	public function download( array $images ): array {
		$existing   = $this->get_existing_images( $images );
		$downloaded = empty( $images['images'] ) ? [] : $this->download_images( $images );

		// Merge any imported images with existing images.
		return array_merge( $existing, $downloaded );
	}

	/**
	 * Based on the incoming request, determine which images have already been
	 * downloaded.
	 *
	 * This is weird because the frontend replaces the id and the URL, which is normally
	 * the pexels_id and pexels URL with the attachment_id and full URL to the image.
	 *
	 * Now local images will pass a post_id, but depending on the image state, we still
	 * have to check the meta for the pexels_id, because the image may exist in the media
	 * library.
	 *
	 * @param array<array{
	 *       collection_slug?: string,
	 *       image_type?: string,
	 *       images: array<int, array{
	 *            id: int,
	 *            post_id?: int,
	 *            width: int,
	 *            height: int,
	 *            alt: string,
	 *            url: string,
	 *            photographer: string,
	 *            photographer_url: string,
	 *            avg_color: string,
	 *            sizes: non-empty-array<int,array{name: string, src: string}>
	 *       }>
	 *      }> $images
	 *
	 * @return array<array{id: int, url: string}>
	 */
	private function get_existing_images( array &$images ): array {
		$existing = [];
		$ids      = $this->container->get( Pexels_ID_Registry::class )->all();

		foreach ( $images['images'] as $key => $image ) {
			$post_id   = $image['post_id'] ?? false;
			$pexels_id = $image['id'] ?? false;

			if ( $post_id !== false ) {
				// We were provided a post_id, but it's not in our list of attachments.
				if ( ! isset( $ids['post_ids'][ $post_id ] ) ) {
					continue;
				}
			} elseif ( $pexels_id !== false ) {
				$post_id = $ids['pexels_ids'][ $pexels_id ] ?? false;

				if ( $post_id === false ) {
					continue;
				}
			}

			$existing[] = [
				'id'  => $post_id,
				'url' => wp_get_attachment_image_url( $post_id ),
			];

			unset( $images['images'][ $key ] );
		}

		return $existing;
	}

	/**
	 * Download and import Pexels images to the WordPress library.
	 *
	 * @param array<array{
	 *        collection_slug?: string,
	 *        image_type?: string,
	 *        images: array<int, array{
	 *             id: int,
	 *             post_id?: int,
	 *             width: int,
	 *             height: int,
	 *             alt: string,
	 *             url: string,
	 *             photographer: string,
	 *             photographer_url: string,
	 *             avg_color: string,
	 *             sizes: non-empty-array<int,array{name: string, src: string}>
	 *        }>
	 *       }> $images
	 *
	 * @return array<array{id: int, url: string}>
	 * @throws ImageDownloadException
	 * @throws Throwable
	 */
	private function download_images( array $images ): array {
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

		try {
			$downloaded = $this->container->get( ImageDownloader::class )->download( $collection, $path );

			return $this->container->get( WordPress_Importer::class )->import( $downloaded );
		} catch ( Throwable $e ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				error_log( $e->getMessage() );
			}

			return [];
		}
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
