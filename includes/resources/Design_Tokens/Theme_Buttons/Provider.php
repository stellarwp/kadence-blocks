<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the theme button discovery: the adapters in the order they are asked, and the per-request overlay
 * the baseline decorator and cache versioning read, flushed whenever the theme's button data can change.
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
		$this->container->singleton( Kadence_Button_Styles::class );
		$this->container->singleton( Block_Theme_Button_Styles::class );
		$this->container->singleton( Classic_Button_Styles::class );
		$this->container->singleton(
			Discovery::class,
			function (): Discovery {
				/** @var Kadence_Button_Styles $kadence */
				$kadence = $this->container->get( Kadence_Button_Styles::class );
				/** @var Block_Theme_Button_Styles $block_theme */
				$block_theme = $this->container->get( Block_Theme_Button_Styles::class );
				/** @var Classic_Button_Styles $classic */
				$classic = $this->container->get( Classic_Button_Styles::class );

				// Kadence answers through its Customizer sections; a block theme through its theme.json button
				// data; anything else gets the one class preset that keeps today's Theme Base rendering.
				return new Discovery( $kadence, $block_theme, $classic );
			}
		);
		$this->container->singleton( Theme_Button_Styles_Overlay::class );

		$flush = $this->container->callback( Theme_Button_Styles_Overlay::class, 'flush' );

		// The overlay memoizes for the request, and WordPress installs the Customizer's preview filters on
		// wp_loaded, after the first read, so without this the preview would show the saved styles.
		add_action( 'customize_preview_init', $flush, 0 );
		add_action( 'switch_theme', $flush, 0 );
		add_action( 'save_post_wp_global_styles', $flush, 0 );

		// Kadence stores its settings as theme mods by default, or in one option when a site filters
		// kadence_theme_option_type to "option"; customize_save_after covers both, and the theme-mods hooks
		// cover writes made outside the Customizer.
		add_action( 'customize_save_after', $flush, 0 );

		// Read once at registration: after a switch_theme in the same request these names point at the old
		// theme, but switch_theme itself flushes, so only a same-request write to the new theme's mods is
		// missed.
		foreach ( [ 'add_option_', 'update_option_', 'delete_option_' ] as $prefix ) {
			add_action( $prefix . 'theme_mods_' . get_stylesheet(), $flush, 10 );
		}
	}
}
