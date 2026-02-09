<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Asset;

final class Asset {

	/**
	 * @var string The URL to the plugin's main folder.
	 */
	private string $plugin_url;

	/**
	 * @param string $plugin_url The URL to the plugin's main folder.
	 */
	public function __construct( string $plugin_url ) {
		$this->plugin_url = $plugin_url;
	}

	/**
	 * Get an asset URL.
	 *
	 * @param  string $path A relative path to an asset.
	 *
	 * @return string The full URL to the asset.
	 */
	public function get_url( string $path = '' ): string {
		return $this->plugin_url . $path;
	}

	/**
	 * Get the asset meta.
	 *
	 * @param string $path The filepath without extension, e.g. dist/hello.
	 *
	 * @return array{dependencies?: string[], version?: string };
	 */
	public function get_meta( string $path = '' ): array {
		return kadence_blocks_get_asset_file( $path );
	}

	/**
	 * Enqueue a script.
	 *
	 * @param string $name The name of the script.
	 * @param string $path The relative path to the script, without extension, e.g. build/settings.
	 * @param string $ext The file extension without a period.
	 *
	 * @return void
	 */
	public function enqueue_script( string $name, string $path, string $ext = 'js' ): void {
		$meta = $this->get_meta( $path );

		wp_enqueue_script(
			$name,
			$this->get_url( "$path.$ext" ),
				$meta['dependencies'] ?? [],
				$meta['version'] ?? '',
			true
		);
	}
}
