<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use Kadence_Blocks_Singlebtn_Block;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider;

/**
 * Site-level block styles in the Kadence theme's FSE mode: Global Styles values
 * that every instance of a supported block follows unless it sets its own.
 *
 * @since TBD
 */
final class Site_Styles_Provider extends Provider {

	/**
	 * @inheritDoc
	 */
	public function register(): void {
		$this->container->singleton(
			Supported_Blocks::class,
			static function (): Supported_Blocks {
				return new Supported_Blocks( [ Kadence_Blocks_Singlebtn_Block::get_instance() ] );
			}
		);
		$this->container->singleton( Store::class, Store::class );
		$this->container->singleton( Overlay::class, Overlay::class );

		// On init: the provider registers before kadence_blocks_init() loads the block classes the registry holds.
		add_action(
			'init',
			function (): void {
				/** @var Overlay $overlay */
				$overlay = $this->container->get( Overlay::class );
				foreach ( array_keys( $overlay->hooks() ) as $hook ) {
					add_filter( $hook, $this->container->callback( Overlay::class, 'filter_render_attributes' ) );
				}
			},
			1
		);

		// After Kadence's instance rules (priority 180), so site rules win ties with parent block rules.
		$this->container->singleton( Site_Rules::class, Site_Rules::class );
		add_action( 'wp_enqueue_scripts', $this->container->callback( Site_Rules::class, 'enqueue' ), 190 );

		$this->container->singleton( Fse_Stylesheets::class, Fse_Stylesheets::class );
		add_filter( 'style_loader_src', $this->container->callback( Fse_Stylesheets::class, 'filter_src' ) );

		$this->container->singleton( Block_Supports::class, Block_Supports::class );
		add_filter( 'block_type_metadata', $this->container->callback( Block_Supports::class, 'filter_metadata' ) );

		// After Editor_Assets enqueues the early filters script (priority 10).
		$this->container->singleton( Editor_Params::class, Editor_Params::class );
		add_action( 'enqueue_block_editor_assets', $this->container->callback( Editor_Params::class, 'add_script_data' ), 11 );

		$this->container->singleton( User_Data_Filter::class, User_Data_Filter::class );
		add_filter( 'wp_theme_json_data_user', $this->container->callback( User_Data_Filter::class, 'filter' ) );

		// Around core's Global Styles (priority 9) and post (10) KSES filters.
		$this->container->singleton( Kses_Keeper::class, Kses_Keeper::class );
		foreach ( [ 'content_save_pre', 'content_filtered_save_pre' ] as $hook ) {
			add_filter( $hook, $this->container->callback( Kses_Keeper::class, 'capture' ), 8 );
			add_filter( $hook, $this->container->callback( Kses_Keeper::class, 'restore' ), 11 );
		}
	}
}
