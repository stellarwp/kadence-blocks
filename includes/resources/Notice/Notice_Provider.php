<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Notice;

use KadenceWP\KadenceBlocks\StellarWP\CoreUpdateNotice\Config;
use KadenceWP\KadenceBlocks\StellarWP\CoreUpdateNotice\Register;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Admin notice container definitions and hooks.
 *
 * @since TBD
 */
final class Notice_Provider extends Provider {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		Config::setContainer( $this->container );

		// Deferred to init so the copy below is translated; the notice hooks admin_init, which is later.
		add_action( 'init', [ $this, 'register_core_update_notice' ] );
	}

	/**
	 * Register the shared WordPress core update notice.
	 *
	 * The copy is passed in rather than left to the library's English defaults so it is extracted
	 * into this plugin's text domain.
	 *
	 * @since TBD
	 *
	 * @hook init
	 *
	 * @return void
	 */
	public function register_core_update_notice(): void {
		Register::notice(
			[
				'heading' => __( 'Keep your site protected. Update to the latest version of WordPress.', 'kadence-blocks' ),
				'body'    => __( 'Your site is running on an outdated version of WordPress, which can leave it vulnerable to security issues. To decrease your risk of exposure, please update your WordPress install to the latest version.', 'kadence-blocks' ),
				'dismiss' => __( 'Dismiss this notice.', 'kadence-blocks' ),
			]
		);
	}
}
