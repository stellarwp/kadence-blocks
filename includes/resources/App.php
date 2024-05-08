<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Adbar\Dot;
use KadenceWP\KadenceBlocks\Cache\Cache_Provider;
use KadenceWP\KadenceBlocks\Health\Health_Provider;
use KadenceWP\KadenceBlocks\Image_Downloader\Image_Downloader_Provider;
use KadenceWP\KadenceBlocks\Shutdown\Shutdown_Provider;
use KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Providable;
use KadenceWP\KadenceBlocks\Uplink\Uplink_Provider;
use RuntimeException;

/**
 * The Core Kadence Blocks Application, with container support.
 */
final class App {

	private static $instance;

	/**
	 * @var Container
	 */
	private $container;

	/**
	 * Add any custom providers here.
	 *
	 * @note The order is important.
	 *
	 * @var class-string<Providable>
	 */
	private $providers = array(
		Uplink_Provider::class,
		Health_Provider::class,
		Image_Downloader_Provider::class,
		Cache_Provider::class,
		Shutdown_Provider::class,
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
	public static function instance( ?Container $container = null ): App {
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

	private function init(): void {
		$this->container->bind( Container::class, $this->container );
		$this->container->bind( ContainerInterface::class, $this->container );
		$this->container->singleton( Dot::class, new Dot() );

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
