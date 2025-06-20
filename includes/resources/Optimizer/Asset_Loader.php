<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer;

use KadenceWP\KadenceBlocks\Asset\Asset;

final class Asset_Loader {

	public const HANDLE = 'admin-kadence-optimizer';

	private Asset $asset;

	/**
	 * @param Asset $asset
	 */
	public function __construct( Asset $asset ) {
		$this->asset = $asset;
	}

	/**
	 * Enqueue the Optimizer JS.
	 *
	 * @return void
	 */
	public function enqueue(): void {
		$this->asset->enqueue_script( self::HANDLE, 'dist/kadence-optimizer' );
	}
}
