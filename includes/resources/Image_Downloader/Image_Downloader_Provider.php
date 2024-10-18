<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Image_Downloader;

use KadenceWP\KadenceBlocks\Hasher;
use KadenceWP\KadenceBlocks\Monolog\Handler\AbstractHandler;
use KadenceWP\KadenceBlocks\Monolog\Handler\ErrorLogHandler;
use KadenceWP\KadenceBlocks\Monolog\Handler\NullHandler;
use KadenceWP\KadenceBlocks\Monolog\Logger;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\FileNameProcessor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\ImageDownloader;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Sanitization\Contracts\Sanitizer;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Sanitization\Sanitizers\WPFileNameSanitizer;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Log\Formatters\ColoredLineFormatter;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Log\LogLevel;
use KadenceWP\KadenceBlocks\Symfony\Component\HttpClient\HttpClient;
use KadenceWP\KadenceBlocks\Symfony\Component\String\Slugger\AsciiSlugger;
use KadenceWP\KadenceBlocks\Symfony\Component\String\Slugger\SluggerInterface;
use KadenceWP\KadenceBlocks\Symfony\Contracts\HttpClient\HttpClientInterface;

final class Image_Downloader_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		// Create the HTTP Client used to concurrently download images.
		$this->container->bind( HttpClientInterface::class, HttpClient::create() );

		$this->register_hasher();
		$this->register_logging();
		$this->register_cache_primer();
		$this->register_image_downloader();
	}

	private function register_hasher(): void {
		$this->container->when( Hasher::class )
		                ->needs( '$algo' )
		                ->give( static function (): string {
			                return PHP_VERSION_ID >= 80100 ? 'xxh128' : 'md5';
		                } );
	}

	private function register_logging(): void {
		// Enable logging to the error log if WP_DEBUG is enabled and error_log is not listed in the php.ini/fpm disable_functions directive.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG && function_exists( 'error_log' ) ) {
			/**
			 * Filter the log level to use when debugging.
			 *
			 * @param string $log_level One of: debug, info, notice, warning, error, critical, alert, emergency
			 */
			$log_level = apply_filters( 'kadence_blocks_image_download_log_level', 'debug' );

			$this->container->when( ColoredLineFormatter::class )
			                ->needs( '$dateFormat' )
			                ->give( 'd/M/Y:H:i:s O' );

			$this->container->when( AbstractHandler::class )
			                ->needs( '$level' )
			                ->give( LogLevel::fromName( $log_level ) );

			$this->container->when( ErrorLogHandler::class )
			                ->needs( '$level' )
			                ->give( LogLevel::fromName( $log_level ) );

			$this->container->bind( LoggerInterface::class, function () {
				$logger  = new Logger( 'kadence' );
				$handler = $this->container->get( ErrorLogHandler::class );
				$handler->setFormatter( $this->container->get( ColoredLineFormatter::class ) );
				$logger->pushHandler( $handler );

				return $logger;
			} );
		} else {
			// Disable logging.
			$this->container->bind( LoggerInterface::class, static function () {
				$logger = new Logger( 'null' );
				$logger->pushHandler( new NullHandler() );

				return $logger;
			} );
		}
	}

	private function register_cache_primer(): void {
		/**
		 * Filter how many external cache requests we will open at once before discarding them.
		 *
		 * This may need to be adjusted depending on the host's limitations.
		 *
		 * @param int $batch_size The number of external cache requests per batch.
		 */
		$batch_size = absint( apply_filters( 'kadence_blocks_cache_primer_batch_size', 500 ) );

		/**
		 * How long in seconds to wait until we remotely prime the collection of images again.
		 *
		 * @param int $cache_duration Time in seconds.
		 */
		$cache_duration = absint( apply_filters( 'kadence_blocks_cache_primer_cache_duration', HOUR_IN_SECONDS ) );

		$this->container->when( Cache_Primer::class )
		                ->needs( '$batch_size' )
		                ->give( $batch_size );

		$this->container->when( Cache_Primer::class )
		                ->needs( '$cache_duration' )
		                ->give( $cache_duration );

		$this->container->singleton( Cache_Primer::class, Cache_Primer::class );
	}

	private function register_image_downloader(): void {
		$this->container->bind( SluggerInterface::class, AsciiSlugger::class );
		$this->container->bind( Sanitizer::class, WPFileNameSanitizer::class );

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

		/**
		 * Filter how many concurrent download requests we will open at once before we attempt to save
		 * the images to disk.
		 *
		 * This may need to be adjusted depending on the host's limitations.
		 *
		 * @param int $batch_size The number of download requests per batch.
		 */
		$batch_size = absint( apply_filters( 'kadence_blocks_image_download_batch_size', 200 ) );

		$this->container->when( ImageDownloader::class )
		                ->needs( '$batch_size' )
		                ->give( $batch_size );
	}

}
