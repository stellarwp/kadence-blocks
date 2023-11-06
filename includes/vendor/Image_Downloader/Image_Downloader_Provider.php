<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\Monolog\Handler\NullHandler;
use KadenceWP\KadenceBlocks\Monolog\Logger;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\FileNameProcessor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\ImageDownloader;
use KadenceWP\KadenceBlocks\Symfony\Component\HttpClient\HttpClient;
use KadenceWP\KadenceBlocks\Symfony\Contracts\HttpClient\HttpClientInterface;

final class Image_Downloader_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		$this->register_meta();
		$this->register_image_downloader();
	}

	private function register_meta(): void {
		add_action( 'delete_attachment', $this->container->callback( Meta::class, 'delete' ), 10, 1 );
	}

	private function register_image_downloader(): void {
		// Disable logging.
		$this->container->bind( LoggerInterface::class, static function () {
			$logger = new Logger( 'null' );
			$logger->pushHandler( new NullHandler() );

			return $logger;
		} );

		// Ensure we always get the same instance, so the image state is current.
		$this->container->singleton( WordPress_Importer::class, WordPress_Importer::class );

		// Configure the allowed file extensions that are allowed to be processed.
		$this->container->when( FileNameProcessor::class )
		                ->needs( '$allowed_extensions' )
		                ->give( [
			                'jpg'  => true,
			                'jpeg' => true,
			                'webp' => true,
			                'png'  => true,
		                ] );

		// Create the HTTP Client used to concurrently download images.
		$this->container->when( ImageDownloader::class )
		                ->needs( HttpClientInterface::class )
		                ->give( HttpClient::create() );

		/**
		 * Filter how many download requests we will open at once before we attempt to save
		 * the images to disk.
		 *
		 * @param int $batch_size The number of download requests per bathc.
		 */
		$batch_size = absint( apply_filters( 'kadence_blocks_image_download_batch_size', 60 ) );

		$this->container->when( ImageDownloader::class )
		                ->needs( '$batch_size' )
		                ->give( $batch_size );
	}

}
