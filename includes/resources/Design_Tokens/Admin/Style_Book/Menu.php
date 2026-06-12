<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Book;

use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Cast;

/**
 * Registers the Style Book submenu under the Kadence admin menu.
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
	 * The Style Book screen slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const MENU_SLUG = 'kadence-blocks-style-book';

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
	 * Renders the Style Book admin screen markup.
	 *
	 * @since TBD
	 *
	 * @var Screen
	 */
	private Screen $screen;

	/**
	 * Enqueues the Style Book bundle on its admin screen.
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
	 * The Style Book screen slug.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_menu_slug(): string {
		return self::MENU_SLUG;
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
	 * Register the Style Book submenu on network admin.
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
			__( 'Style Book', 'kadence-blocks' ),
			__( 'Style Book', 'kadence-blocks' ),
			$this->get_capability(),
			self::MENU_SLUG,
			[ $this->screen, 'render' ],
			self::MENU_POSITION
		);

		if ( ! is_string( $hook ) ) {
			return;
		}

		add_action( 'admin_print_styles-' . $hook, [ $this->asset_loader, 'enqueue' ] );
	}

	/**
	 * The capability required to access the Style Book screen.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function get_capability(): string {
		/**
		 * Filters the capability required to access the Style Book admin screen.
		 *
		 * @since TBD
		 *
		 * @param string $capability The required capability.
		 *
		 * @return string The required capability.
		 */
		return Cast::to_string( apply_filters( 'kadence_blocks_style_book_capability', 'edit_theme_options' ) );
	}
}
