<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Classes;

use Generator;
use Kadence_Blocks_Settings;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_Theme_JSON_Data;

/**
 * The Design Tokens palette (palette1 to palette15) must not reach the core editor palette unless the Kadence theme is active.
 */
class ColorPaletteInjectionTest extends KadenceBlocksTestCase {

	/**
	 * Slug of a legacy, user-defined Kadence Blocks palette entry.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LEGACY_SLUG = 'kb-palette-brand-blue';

	protected function setUp(): void {
		parent::setUp();

		update_option(
			'kadence_blocks_colors',
			wp_json_encode(
				[
					'palette'  => [
						[
							'color' => '#1d4f91',
							'name'  => 'Brand Blue',
							'slug'  => self::LEGACY_SLUG,
						],
						[
							'color' => '#3182CE',
							'name'  => 'Brand Primary',
							'slug'  => 'palette1',
						],
						[
							'color' => '#f5a524',
							'name'  => 'Rating',
							'slug'  => 'palette15',
						],
					],
					'override' => false,
				]
			)
		);
	}

	protected function tearDown(): void {
		remove_all_filters( 'kadence_blocks_is_kadence_theme' );
		remove_action( 'wp_head', [ Kadence_Blocks_Settings::get_instance(), 'print_color_palette_css' ], 8 );
		remove_filter( 'block_editor_settings_all', [ Kadence_Blocks_Settings::get_instance(), 'add_color_palette_css_to_block_editor' ], 999 );
		remove_theme_support( 'editor-color-palette' );
		delete_option( 'kadence_blocks_colors' );

		parent::tearDown();
	}

	/**
	 * Without the Kadence theme the block editor settings carry the legacy entry but not the token palette slots.
	 *
	 * @return void
	 */
	public function test_editor_settings_skip_token_slots_off_the_kadence_theme(): void {
		$settings = Kadence_Blocks_Settings::get_instance()->load_color_palette_editor_settings( [ 'colors' => [] ] );

		$this->assertSame( [ self::LEGACY_SLUG ], array_column( $settings['colors'], 'slug' ) );
	}

	/**
	 * Without the Kadence theme the theme.json palette carries the legacy entry but not the token palette slots.
	 *
	 * @return void
	 */
	public function test_theme_json_skips_token_slots_off_the_kadence_theme(): void {
		$theme_json = new WP_Theme_JSON_Data(
			[
				'version'  => 2,
				'settings' => [
					'color' => [
						'palette' => [
							[
								'color' => '#ffffff',
								'name'  => 'Base',
								'slug'  => 'base',
							],
						],
					],
				],
			],
			'theme'
		);

		$data = Kadence_Blocks_Settings::get_instance()->load_color_palette_theme_json( $theme_json )->get_data();

		$this->assertSame( [ 'base', self::LEGACY_SLUG ], array_column( $data['settings']['color']['palette']['theme'], 'slug' ) );
	}

	/**
	 * Without the Kadence theme the registered theme support carries the legacy entry but not the token palette slots.
	 *
	 * @return void
	 */
	public function test_theme_support_skips_token_slots_off_the_kadence_theme(): void {
		Kadence_Blocks_Settings::get_instance()->load_color_palette();

		$support = get_theme_support( 'editor-color-palette' );

		$this->assertIsArray( $support );
		$this->assertContains( self::LEGACY_SLUG, array_column( $support[0], 'slug' ) );
		$this->assertNotContains( 'palette1', array_column( $support[0], 'slug' ) );
		$this->assertNotContains( 'palette15', array_column( $support[0], 'slug' ) );
	}

	/**
	 * A stored palette made only of token slots still registers both color class CSS callbacks, while the slots stay out of the theme support palette.
	 *
	 * @return void
	 */
	public function test_css_callbacks_register_for_a_token_only_palette_off_the_kadence_theme(): void {
		update_option(
			'kadence_blocks_colors',
			wp_json_encode(
				[
					'palette'  => [
						[
							'color' => '#3182CE',
							'name'  => 'Brand Primary',
							'slug'  => 'palette1',
						],
					],
					'override' => false,
				]
			)
		);
		$settings = Kadence_Blocks_Settings::get_instance();

		$settings->load_color_palette();

		$this->assertSame( 8, has_action( 'wp_head', [ $settings, 'print_color_palette_css' ] ) );
		$this->assertSame( 999, has_filter( 'block_editor_settings_all', [ $settings, 'add_color_palette_css_to_block_editor' ] ) );

		$support = get_theme_support( 'editor-color-palette' );

		if ( is_array( $support ) ) {
			$this->assertNotContains( 'palette1', array_column( $support[0], 'slug' ) );
		}
	}

	/**
	 * The token palette slots reach the block editor settings only when the Kadence theme is active.
	 *
	 * @dataProvider kadenceThemeProvider
	 *
	 * @param bool     $is_kadence_theme Whether the Kadence theme is reported as active.
	 * @param string[] $expected         The slugs the block editor settings carry.
	 *
	 * @return void
	 */
	public function test_editor_settings_keep_token_slots_on_the_kadence_theme( bool $is_kadence_theme, array $expected ): void {
		add_filter( 'kadence_blocks_is_kadence_theme', static fn() => $is_kadence_theme );

		$settings = Kadence_Blocks_Settings::get_instance()->load_color_palette_editor_settings( [ 'colors' => [] ] );

		$this->assertSame( $expected, array_column( $settings['colors'], 'slug' ) );
	}

	/**
	 * Theme states paired with the slugs the block editor settings carry.
	 *
	 * @return Generator
	 */
	public function kadenceThemeProvider(): Generator {
		yield 'kadence theme keeps every entry' => [
			'is_kadence_theme' => true,
			'expected'         => [ self::LEGACY_SLUG, 'palette1', 'palette15' ],
		];

		yield 'other theme keeps only the legacy entry' => [
			'is_kadence_theme' => false,
			'expected'         => [ self::LEGACY_SLUG ],
		];
	}
}
