<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\GlobalStyles;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_Settings;
use WP_Theme_JSON_Data;

/**
 * Pins how a stored Kadence Blocks palette reaches the Kadence theme: the
 * theme.json data filter, the `editor-color-palette` theme support and the
 * block editor colors offer it as swatches in classic mode only, while the
 * `wp_head` and block editor class CSS keep printing in both modes.
 */
final class PaletteInjectionTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testThemeSupportMergesTheStoredPaletteIntoTheThemePalette(): void {
		$palette       = $this->tester->store_palette();
		$theme_palette = get_theme_support( 'editor-color-palette' );

		Kadence_Blocks_Settings::get_instance()->load_color_palette();

		$this->assertSame( [ array_merge( $theme_palette[0], $palette ) ], get_theme_support( 'editor-color-palette' ) );
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

	public function testNothingIsRegisteredWithoutAStoredPalette(): void {
		$theme_palette = get_theme_support( 'editor-color-palette' );

		Kadence_Blocks_Settings::get_instance()->load_color_palette();

		$this->assertSame( $theme_palette, get_theme_support( 'editor-color-palette' ) );
		$this->assertFalse( has_action( 'wp_head', [ Kadence_Blocks_Settings::get_instance(), 'print_color_palette_css' ] ) );
	}

	public function testWpHeadPrintsThePaletteCss(): void {
		$palette = $this->tester->store_palette();

		ob_start();
		Kadence_Blocks_Settings::get_instance()->print_color_palette_css();
		$output = ob_get_clean();

		$this->assertSame( '<style id="kadence_blocks_palette_css">' . $this->tester->palette_css( $palette ) . '</style>', $output );
	}

	public function testBlockEditorStylesReceiveThePaletteCss(): void {
		$palette = $this->tester->store_palette();
		$styles  = [ [ 'css' => 'body{}' ] ];

		$settings = Kadence_Blocks_Settings::get_instance()->add_color_palette_css_to_block_editor( [ 'styles' => $styles ] );

		$this->assertSame( array_merge( $styles, [ [ 'css' => $this->tester->palette_css( $palette ) ] ] ), $settings['styles'] );
	}

	public function testBlockEditorColorsMergeTheStoredPalette(): void {
		$palette       = $this->tester->store_palette();
		$editor_colors = [
			[
				'color' => '#000000',
				'name'  => 'Black',
				'slug'  => 'black',
			],
		];

		$settings = Kadence_Blocks_Settings::get_instance()->load_color_palette_editor_settings(
			[
				'colors'                 => $editor_colors,
				'__experimentalFeatures' => [ 'color' => [ 'palette' => [ 'theme' => $editor_colors ] ] ],
			]
		);

		$this->assertSame( array_merge( $editor_colors, $palette ), $settings['colors'] );
		$this->assertSame( array_merge( $editor_colors, $palette ), $settings['__experimentalFeatures']['color']['palette']['theme'] );
	}

	public function testBlockEditorColorsAreReplacedByAnOverridePalette(): void {
		$palette = $this->tester->store_palette( true );

		$settings = Kadence_Blocks_Settings::get_instance()->load_color_palette_editor_settings( [ 'colors' => [] ] );

		$this->assertSame( $palette, $settings['colors'] );
		$this->assertSame( $palette, $settings['__experimentalFeatures']['color']['palette']['theme'] );
	}

	public function testThemeJsonDataMergesTheStoredPalette(): void {
		$palette       = $this->tester->store_palette();
		$theme_palette = [
			[
				'color' => '#000000',
				'name'  => 'Black',
				'slug'  => 'black',
			],
		];
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

	public function testFseModeRegistersThePaletteCssHooksButNoThemeSupport(): void {
		$this->tester->store_palette();
		$this->tester->enable_fse_mode();
		$theme_palette = get_theme_support( 'editor-color-palette' );

		Kadence_Blocks_Settings::get_instance()->load_color_palette();

		$this->assertSame( $theme_palette, get_theme_support( 'editor-color-palette' ) );
		$this->assertSame( 8, has_action( 'wp_head', [ Kadence_Blocks_Settings::get_instance(), 'print_color_palette_css' ] ) );
		$this->assertSame( 999, has_filter( 'block_editor_settings_all', [ Kadence_Blocks_Settings::get_instance(), 'add_color_palette_css_to_block_editor' ] ) );
	}

	public function testFseModePrintsThePaletteCss(): void {
		$palette = $this->tester->store_palette();
		$this->tester->enable_fse_mode();

		ob_start();
		Kadence_Blocks_Settings::get_instance()->print_color_palette_css();

		$this->assertSame( '<style id="kadence_blocks_palette_css">' . $this->tester->palette_css( $palette ) . '</style>', ob_get_clean() );
	}

	public function testFseModeAddsThePaletteCssToBlockEditorStyles(): void {
		$palette = $this->tester->store_palette();
		$this->tester->enable_fse_mode();
		$styles = [ [ 'css' => 'body{}' ] ];

		$settings = Kadence_Blocks_Settings::get_instance()->add_color_palette_css_to_block_editor( [ 'styles' => $styles ] );

		$this->assertSame( array_merge( $styles, [ [ 'css' => $this->tester->palette_css( $palette ) ] ] ), $settings['styles'] );
	}

	public function testFseModeAddsNoColorsToBlockEditorSettings(): void {
		$this->tester->store_palette();
		$this->tester->enable_fse_mode();
		$settings = [ 'colors' => [] ];

		$this->assertSame( $settings, Kadence_Blocks_Settings::get_instance()->load_color_palette_editor_settings( $settings ) );
	}

	public function testFseModeLeavesThemeJsonDataUnchanged(): void {
		$this->tester->store_palette();
		$this->tester->enable_fse_mode();
		$data       = [
			'version'  => 2,
			'settings' => [
				'color' => [
					'palette' => [
						[
							'color' => '#000000',
							'name'  => 'Black',
							'slug'  => 'black',
						],
					],
				],
			],
		];
		$theme_json = new WP_Theme_JSON_Data( $data, 'theme' );

		$this->assertSame( $theme_json, Kadence_Blocks_Settings::get_instance()->load_color_palette_theme_json( $theme_json ) );
		$this->assertSame( $data['settings']['color']['palette'], $theme_json->get_data()['settings']['color']['palette']['theme'] );
	}

	public function testFseModeKeepsTheStoredPaletteOutOfGlobalSettings(): void {
		$this->tester->enable_fse_mode();
		wp_clean_theme_json_cache();
		$theme_palette = wp_get_global_settings( [ 'color', 'palette', 'theme' ] );

		$this->tester->store_palette();
		wp_clean_theme_json_cache();

		$this->assertSame( $theme_palette, wp_get_global_settings( [ 'color', 'palette', 'theme' ] ) );
	}
}
