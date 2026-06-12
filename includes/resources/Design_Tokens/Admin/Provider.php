<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Localizer;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Variants;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Book\Asset_Loader;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Book\Menu;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Book\Screen;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the admin UI schema feed (SOFT-3385): binds the builder, variant feed and localizer as
 * singletons, then hooks the localizer onto admin_head so the dashboard bundle receives
 * window.kadenceDesignTokens.
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		$this->container->singleton( Builder::class );
		$this->container->singleton( Variants::class );
		$this->container->singleton( Localizer::class );
		$this->container->singleton( Screen::class );
		$this->container->singleton( Asset_Loader::class );
		$this->container->singleton( Menu::class );

		// Register after Kadence_Blocks_Settings::add_menu() so the kadence-blocks parent exists.
		add_action( 'admin_menu', $this->container->callback( Menu::class, 'register_site_menu' ), 11 );
		add_action( 'network_admin_menu', $this->container->callback( Menu::class, 'register_network_menu' ), 11 );

		// admin_head fires after the dashboard's admin_print_styles-{page} enqueue and before the footer
		// where admin-kadence-home prints, so the handle is enqueued when the Localizer's guard runs.
		add_action( 'admin_head', $this->container->callback( Localizer::class, 'localize' ) );
	}
}
