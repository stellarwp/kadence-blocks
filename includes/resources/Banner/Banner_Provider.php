<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Banner;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Shows the Nexcess software packages banner on Kadence Blocks admin pages.
 *
 * @since 3.8.0
 */
final class Banner_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		add_action( 'init', $this->container->callback( Software_Packages_Banner::class, 'register' ) );
		add_action( 'admin_notices', $this->container->callback( Software_Packages_Banner::class, 'render' ) );
	}
}
