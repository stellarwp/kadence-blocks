<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Cache;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Contracts\Storage;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Drivers\LocalStorage;
use KadenceWP\KadenceBlocks\Symfony\Component\Filesystem\Filesystem;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

final class Cache_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		$base_path = apply_filters( 'kadence_block_library_local_data_base_path', trailingslashit( wp_get_upload_dir()['basedir'] ) );
		$base_url  = apply_filters( 'kadence_block_library_local_data_base_url', content_url() );

		$this->container->singleton( Config::class, new Config( $base_path, $base_url ) );

		$this->register_block_library_storage();
		$this->register_ai_storage();
	}

	private function register_block_library_storage(): void {
		$library_subfolder = apply_filters( 'kadence_block_library_local_data_subfolder_name', 'kadence_blocks_library' );
		$path              = $this->container->get( Config::class )->base_path() . $library_subfolder;

		$this->container->when( Block_Library_Cache::class )
		                ->needs( Storage::class )
		                ->give( new LocalStorage( $this->container->get( Filesystem::class ), $path ) );

		$this->container->singleton( Block_Library_Cache::class, Block_Library_Cache::class );
	}

	private function register_ai_storage(): void {
		$ai_subfolder = apply_filters( 'kadence_block_ai_local_data_subfolder_name', 'kadence_ai' );
		$path         = $this->container->get( Config::class )->base_path() . $ai_subfolder;

		$this->container->when( Ai_Cache::class )
		                ->needs( Storage::class )
		                ->give( new LocalStorage( $this->container->get( Filesystem::class ), $path ) );

		$this->container->singleton( Ai_Cache::class, Ai_Cache::class );
	}

}
