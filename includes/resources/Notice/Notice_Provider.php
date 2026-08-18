<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Notice;

use KadenceWP\KadenceBlocks\StellarWP\CoreUpdateNotice\CoreUpdateNotice;
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
		/*
		 * Built on resolution rather than here, so the copy is translated. The provider registers
		 * during plugins_loaded, before the text domain is available.
		 */
		$this->container->singleton(
			CoreUpdateNotice::class,
			static function (): CoreUpdateNotice {
				return new CoreUpdateNotice(
					[
						'heading' => __( 'Keep your site protected. Update to the latest version of WordPress.', 'kadence-blocks' ),
						'body'    => __( 'Your site is running on an outdated version of WordPress, which can leave it vulnerable to security issues. To decrease your risk of exposure, please update your WordPress install to the latest version.', 'kadence-blocks' ),
						'dismiss' => __( 'Dismiss this notice.', 'kadence-blocks' ),
					]
				);
			}
		);

		$this->container->singleton( Is_Plugin_Admin_Screen::class );

		// The package requires registration before admin_init.
		add_action( 'init', [ $this, 'register_core_update_notice' ] );
	}

	/**
	 * Register the shared WordPress core update notice.
	 *
	 * @since TBD
	 *
	 * @hook init
	 *
	 * @return void
	 */
	public function register_core_update_notice(): void {
		/** @var CoreUpdateNotice $notice */
		$notice = $this->container->get( CoreUpdateNotice::class );

		/** @var Is_Plugin_Admin_Screen $is_plugin_admin_screen */
		$is_plugin_admin_screen = $this->container->get( Is_Plugin_Admin_Screen::class );

		Register::notice( $notice, $is_plugin_admin_screen );
	}
}
