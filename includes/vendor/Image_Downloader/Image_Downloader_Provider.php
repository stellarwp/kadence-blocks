<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\FileNameProcessor;
use KadenceWP\KadenceBlocks\Symfony\Component\HttpClient\HttpClient;
use KadenceWP\KadenceBlocks\Symfony\Contracts\HttpClient\HttpClientInterface;
use StellarWP\ProphecyMonorepo\ImageDownloader\ImageDownloader;

final class Image_Downloader_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
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

		$batch_size = absint( apply_filters( 'kadence_blocks_image_download_batch_size', 20 ) );

		$this->container->when( ImageDownloader::class )
		                ->needs( '$batch_size' )
		                ->give( $batch_size );
	}
}
