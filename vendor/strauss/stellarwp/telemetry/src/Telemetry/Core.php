<?php
/**
 * Handles setting up the library.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 *
 * @license GPL-2.0-or-later
 * Modified by kadencewp on 30-January-2023 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace KadenceWP\KadenceBlocks\StellarWP\Telemetry;

use KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Admin\Admin_Subscriber;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Admin\Resources;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Contracts\Data_Provider;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Data_Providers\Debug_Data;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Exit_Interview\Exit_Interview_Subscriber;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Exit_Interview\Template;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Last_Send\Last_Send_Subscriber;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Opt_In_Subscriber;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Opt_In_Template;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Status;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Telemetry\Telemetry;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Telemetry\Telemetry_Subscriber;

/**
 * The core class of the library.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 */
class Core {
	const PLUGIN_BASENAME = 'plugin.basename';
	const PLUGIN_FILE     = 'plugin.file';
	const SITE_PLUGIN_DIR = 'site.plugin_dir';

	/**
	 * The subscriber class names that should be registered in the container.
	 *
	 * @since 1.0.0
	 *
	 * @var string[]
	 */
	private $subscribers = [
		Admin_Subscriber::class,
		Exit_Interview_Subscriber::class,
		Last_Send_Subscriber::class,
		Opt_In_Subscriber::class,
		Telemetry_Subscriber::class,
	];

	/**
	 * The container that should be used for loading library resources.
	 *
	 * @since 1.0.0
	 *
	 * @var ContainerInterface
	 */
	private $container;

	/**
	 * The current instance of the library.
	 *
	 * @since 1.0.0
	 *
	 * @var self
	 */
	private static $instance = null;

	/**
	 * Returns the current instance or creates one to return.
	 *
	 * @since 1.0.0
	 *
	 * @return self
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Initializes the library.
	 *
	 * @since 1.0.0
	 *
	 * @param string $plugin_path The path to the main plugin file.
	 *
	 * @throws \RuntimeException Throws exception if container is not set.
	 *
	 * @return void
	 */
	public function init( string $plugin_path ) {
		if ( ! Config::has_container() ) {
			throw new \RuntimeException( 'You must call StellarWP\Telemetry\Config::set_container() before calling StellarWP\Telemetry::init().' );
		}

		$this->init_container( $plugin_path );
	}

	/**
	 * Gets the container.
	 *
	 * @since 1.0.0
	 *
	 * @return \KadenceWP\KadenceBlocks\StellarWP\ContainerContract\ContainerInterface
	 */
	public function container() {
		return $this->container;
	}

	/**
	 * Initializes the container with library resources.
	 *
	 * @since 1.0.0
	 *
	 * @param string $plugin_path The path of the plugin.
	 *
	 * @return void
	 */
	private function init_container( string $plugin_path ) {
		$container = Config::get_container();

		$container->bind( self::PLUGIN_BASENAME, plugin_basename( $plugin_path ) );
		$container->bind( self::PLUGIN_FILE, $plugin_path );
		$container->bind( self::SITE_PLUGIN_DIR, dirname( plugin_dir_path( $plugin_path ) ) );
		$container->bind( Data_Provider::class, Debug_Data::class );
		$container->bind(
			Opt_In_Template::class,
			static function () use ( $container ) {
				return new Opt_In_Template( $container->get( Status::class ) );
			}
		);
		$container->bind(
			Template::class,
			static function () use ( $container ) {
				return new Template( $container );
			}
		);
		$container->bind(
			Telemetry::class,
			static function () use ( $container ) {
				return new Telemetry(
					$container->get( Data_Provider::class ),
					$container->get( Status::class )
				);
			}
		);
		$container->bind(
			Resources::class,
			static function () {
				return new Resources();
			}
		);

		// Store the container for later use.
		$this->container = $container;

		foreach ( $this->subscribers as $subscriber_class ) {
			( new $subscriber_class( $this->container ) )->register();
		}
	}
}
