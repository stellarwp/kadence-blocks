<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Log;

use KadenceWP\KadenceBlocks\Monolog\Handler\AbstractHandler;
use KadenceWP\KadenceBlocks\Monolog\Handler\ErrorLogHandler;
use KadenceWP\KadenceBlocks\Monolog\Handler\NullHandler;
use KadenceWP\KadenceBlocks\Monolog\Logger;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Log\Formatters\ColoredLineFormatter;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Log\LogLevel;

final class Log_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
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

			$this->container->bind(
				LoggerInterface::class,
				function () {
					$logger  = new Logger( 'kadence' );
					$handler = $this->container->get( ErrorLogHandler::class );
					$handler->setFormatter( $this->container->get( ColoredLineFormatter::class ) );
					$logger->pushHandler( $handler );

					// Prefix logs.
					$logger->pushProcessor(
						static function ( array $record ): array {
							$record['message'] = '[Kadence Blocks]: ' . $record['message'];

							return $record;
						}
					);

					return $logger;
				}
			);
		} else {
			// Disable logging.
			$this->container->bind(
				LoggerInterface::class,
				static function () {
					$logger = new Logger( 'null' );
					$logger->pushHandler( new NullHandler() );

					return $logger;
				}
			);
		}
	}
}
