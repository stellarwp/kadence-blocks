<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library;

use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Registers the Style Library submenu under the Kadence admin menu.
 *
 * @since TBD
 */
final class Menu {

	/**
	 * The parent menu slug for Kadence admin submenus.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PARENT_SLUG = 'kadence-blocks';

	/**
	 * The Style Library screen slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const MENU_SLUG = 'kadence-blocks-style-library';

	/**
	 * The query arg naming which screen of the Style Library app to open on.
	 *
	 * The app owns its own routing, so this is the PHP counterpart of `SCREEN_QUERY_ARG` in
	 * src/style-library/helpers/route.js — the two must agree for a deep link built here to land
	 * anywhere but the default screen. Declared beside the menu slug because a link needs both, and
	 * a caller that had to know one string and guess the other would be the drift waiting to happen.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SCREEN_QUERY_ARG = 'kb-screen';

	/**
	 * The submenu position after Home (0) and Settings (1).
	 *
	 * Must stay an integer so Home remains the first submenu item and the default Kadence parent link.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private const MENU_POSITION = 2;

	/**
	 * The body class scoping the full-height layout overrides to the Style Library screen.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BODY_CLASS = 'kadence-blocks-style-library-page';

	/**
	 * The core hooks that print admin notices inside `#wpbody-content`
	 * (`wp-admin/admin-header.php`), where the Style Library app mounts. Emptied on this screen
	 * so a notice never renders inside — or beside — the app frame.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const ADMIN_NOTICE_HOOKS = [
		'admin_notices',
		'all_admin_notices',
		'user_admin_notices',
		'network_admin_notices',
	];

	/**
	 * Renders the Style Library admin screen markup.
	 *
	 * @since TBD
	 *
	 * @var Screen
	 */
	private Screen $screen;

	/**
	 * Enqueues the Style Library bundle on its admin screen.
	 *
	 * @since TBD
	 *
	 * @var Asset_Loader
	 */
	private Asset_Loader $asset_loader;

	/**
	 * @since TBD
	 *
	 * @param Screen       $screen       The screen renderer.
	 * @param Asset_Loader $asset_loader The asset loader.
	 */
	public function __construct( Screen $screen, Asset_Loader $asset_loader ) {
		$this->screen       = $screen;
		$this->asset_loader = $asset_loader;
	}

	/**
	 * The Style Library screen slug.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_menu_slug(): string {
		return self::MENU_SLUG;
	}

	/**
	 * An admin URL that opens the Style Library on one of its screens.
	 *
	 * @since TBD
	 *
	 * @param string $screen The screen id, e.g. "typography". Empty opens the default screen.
	 *
	 * @return string The admin URL.
	 */
	public static function get_screen_url( string $screen = '' ): string {
		$args = [ 'page' => self::MENU_SLUG ];

		if ( $screen !== '' ) {
			$args[ self::SCREEN_QUERY_ARG ] = $screen;
		}

		return add_query_arg( $args, admin_url( 'admin.php' ) );
	}

	/**
	 * The body class scoping the full-height layout overrides to the Style Library screen.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_body_class(): string {
		return self::BODY_CLASS;
	}

	/**
	 * The core hooks emptied on this screen so no admin notice renders inside the app frame.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	public static function get_admin_notice_hooks(): array {
		return self::ADMIN_NOTICE_HOOKS;
	}

	/**
	 * Register admin menu hooks.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_site_menu(): void {
		$this->register_submenu( self::PARENT_SLUG );
	}

	/**
	 * Register the Style Library submenu on network admin.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_network_menu(): void {
		if ( ! kadence_blocks_is_network_authorize_enabled() ) {
			return;
		}

		if ( ! function_exists( 'is_plugin_active_for_network' ) || ! is_plugin_active_for_network( 'kadence-blocks/kadence-blocks.php' ) ) {
			return;
		}

		$this->register_submenu( self::PARENT_SLUG );
	}

	/**
	 * Add the body-class filter, scoped to the Style Library screen via the `load-{$hook}` action.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_body_class_filter(): void {
		add_filter( 'admin_body_class', [ $this, 'filter_body_class' ] );
	}

	/**
	 * Append the full-height layout body class, leaving every existing class intact.
	 *
	 * @since TBD
	 *
	 * @param string $classes The space-separated body classes.
	 *
	 * @return string The body classes, with the Style Library class appended.
	 */
	public function filter_body_class( string $classes ): string {
		return $classes . ' ' . self::BODY_CLASS;
	}

	/**
	 * Empty every core admin-notice hook, scoped to the Style Library screen via the
	 * `load-{$hook}` action. `load-{$hook}` fires immediately before `wp-admin/admin-header.php`
	 * requires — the file that runs all four hooks inside `#wpbody-content`, where the app
	 * mounts — and after `admin_init` and `admin_menu`, the hooks most notice registrations use,
	 * so this catches them without touching the admin bar or admin menu.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function remove_admin_notices(): void {
		foreach ( self::ADMIN_NOTICE_HOOKS as $hook_name ) {
			remove_all_actions( $hook_name );
		}
	}

	/**
	 * Add the submenu page and wire screen assets.
	 *
	 * @since TBD
	 *
	 * @param string $parent_slug The parent menu slug.
	 *
	 * @return void
	 */
	private function register_submenu( string $parent_slug ): void {
		$hook = add_submenu_page(
			$parent_slug,
			__( 'Style Library', 'kadence-blocks' ),
			__( 'Style Library', 'kadence-blocks' ),
			$this->get_capability(),
			self::MENU_SLUG,
			[ $this->screen, 'render' ],
			self::MENU_POSITION
		);

		if ( ! is_string( $hook ) ) {
			return;
		}

		add_action( 'admin_print_styles-' . $hook, [ $this->asset_loader, 'enqueue' ] );
		add_action( 'load-' . $hook, [ $this, 'register_body_class_filter' ] );
		add_action( 'load-' . $hook, [ $this, 'remove_admin_notices' ] );
	}

	/**
	 * The capability required to access the Style Library screen.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function get_capability(): string {
		/**
		 * Filters the capability required to access the Style Library admin screen.
		 *
		 * @since TBD
		 *
		 * @param string $capability The required capability.
		 *
		 * @return string The required capability.
		 */
		return Cast::to_string( apply_filters( 'kadence_blocks_style_library_capability', 'edit_theme_options' ) );
	}
}
