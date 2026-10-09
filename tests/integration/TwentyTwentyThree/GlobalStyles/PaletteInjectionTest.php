<?php

declare( strict_types=1 );

namespace Tests\integration\TwentyTwentyThree\GlobalStyles;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_Settings;
use WP_Theme_JSON_Data;

/**
 * Pins how a stored Kadence Blocks palette reaches a theme that is not Kadence
 * through the plugin's four palette channels: the theme.json data filter, the
 * `editor-color-palette` theme support, the `wp_head` palette CSS and the
 * block editor settings.
 */
final class PaletteInjectionTest extends WPTestCase {
	/**
	 * Slugs of the palette the plugin falls back to when the theme registers no
	 * `editor-color-palette` support.
	 */
	private const FALLBACK_PALETTE_SLUGS = [
		'pale-pink',
		'vivid-red',
		'luminous-vivid-orange',
		'luminous-vivid-amber',
		'light-green-cyan',
		'vivid-green-cyan',
		'pale-cyan-blue',
		'vivid-cyan-blue',
		'very-light-gray',
		'cyan-bluish-gray',
		'very-dark-gray',
	];

	protected \IntegrationTester $tester;

	public function testTheThemeRegistersNoEditorColorPaletteSupport(): void {
		$this->assertFalse( get_theme_support( 'editor-color-palette' ) );
	}

	public function testThemeSupportAppendsTheStoredPaletteToTheFallbackPalette(): void {
		$palette = $this->tester->store_palette();

		Kadence_Blocks_Settings::get_instance()->load_color_palette();

		$support = get_theme_support( 'editor-color-palette' )[0];
		$this->assertSame( self::FALLBACK_PALETTE_SLUGS, array_column( array_slice( $support, 0, count( self::FALLBACK_PALETTE_SLUGS ) ), 'slug' ) );
		$this->assertSame( $palette, array_slice( $support, count( self::FALLBACK_PALETTE_SLUGS ) ) );
	}

	public function testThemeSupportIsReplacedByAnOverridePalette(): void {
		$palette = $this->tester->store_palette( true );

		Kadence_Blocks_Settings::get_instance()->load_color_palette();

		$this->assertSame( [ $palette ], get_theme_support( 'editor-color-palette' ) );
	}

	public function testPaletteCssHooksAreRegisteredForAStoredPalette(): void {
		$this->tester->store_palette();

		Kadence_Blocks_Settings::get_instance()->load_color_palette();

		$this->assertSame( 8, has_action( 'wp_head', [ Kadence_Blocks_Settings::get_instance(), 'print_color_palette_css' ] ) );
		$this->assertSame( 999, has_filter( 'block_editor_settings_all', [ Kadence_Blocks_Settings::get_instance(), 'add_color_palette_css_to_block_editor' ] ) );
	}

	public function testWpHeadPrintsThePaletteCss(): void {
		$palette = $this->tester->store_palette();

		ob_start();
		Kadence_Blocks_Settings::get_instance()->print_color_palette_css();
		$output = ob_get_clean();

		$this->assertSame( '<style id="kadence_blocks_palette_css">' . $this->tester->palette_css( $palette ) . '</style>', $output );
	}

	public function testBlockEditorColorsFallBackWhenTheSettingsCarryNone(): void {
		$palette = $this->tester->store_palette();

		$settings = Kadence_Blocks_Settings::get_instance()->load_color_palette_editor_settings( [] );

		$this->assertSame( self::FALLBACK_PALETTE_SLUGS, array_column( array_slice( $settings['colors'], 0, count( self::FALLBACK_PALETTE_SLUGS ) ), 'slug' ) );
		$this->assertSame( $palette, array_slice( $settings['colors'], count( self::FALLBACK_PALETTE_SLUGS ) ) );
		$this->assertSame( $settings['colors'], $settings['__experimentalFeatures']['color']['palette']['theme'] );
	}

	public function testThemeJsonDataMergesTheStoredPaletteIntoTheThemePalette(): void {
		$theme_palette = wp_get_global_settings( [ 'color', 'palette', 'theme' ] );
		$palette       = $this->tester->store_palette();
		$theme_json    = new WP_Theme_JSON_Data(
			[
				'version'  => 2,
				'settings' => [ 'color' => [ 'palette' => $theme_palette ] ],
			],
			'theme'
		);

		$data = Kadence_Blocks_Settings::get_instance()->load_color_palette_theme_json( $theme_json )->get_data();

		$this->assertSame( array_merge( $theme_palette, $palette ), $data['settings']['color']['palette']['theme'] );
	}

	public function testGlobalSettingsCarryTheStoredPaletteInTheThemeOrigin(): void {
		$theme_palette = wp_get_global_settings( [ 'color', 'palette', 'theme' ] );
		$palette       = $this->tester->store_palette();
		wp_clean_theme_json_cache();

		$this->assertSame( array_merge( $theme_palette, $palette ), wp_get_global_settings( [ 'color', 'palette', 'theme' ] ) );
	}
}
