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
		// Disable any logging.
		$this->container->bind( LoggerInterface::class, static function () {
			$logger = new Logger( 'null' );
			$logger->pushHandler( new NullHandler() );

			return $logger;
		} );

		// Ensure we always get the same instance, so the image state is current.
		$this->container->singleton( WordPress_Importer::class, WordPress_Importer::class );

		$this->container->when( FileNameProcessor::class )
		                ->needs( '$allowed_extensions' )
		                ->give( [
			                'jpg'  => true,
			                'jpeg' => true,
			                'webp' => true,
			                'png'  => true,
		                ] );

		$this->container->when( ImageDownloader::class )
		                ->needs( HttpClientInterface::class )
		                ->give( HttpClient::create() );

		$batch_size = absint( apply_filters( 'kadence_blocks_image_download_batch_size', 60 ) );

		$this->container->when( ImageDownloader::class )
		                ->needs( '$batch_size' )
		                ->give( $batch_size );
	}

}
