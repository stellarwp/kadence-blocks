<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Style_Guide;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Json_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Theme_Style_Guide_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Version;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Mapper;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use Tests\Support\Classes\Fake_Style_Guide_Source;
use Tests\Support\Classes\TestCase;

final class Button_Colors_IntegrationTest extends TestCase {

	/**
	 * The palette slots this test gives the theme, with a color unique to each.
	 *
	 * @var array<string, string>
	 */
	private const THEME_COLORS = [
		'palette1'  => '#a10001',
		'palette2'  => '#a20002',
		'palette9'  => '#a90009',
		'palette11' => '#b10011',
	];

	/**
	 * The theme's shipped button settings: background on palette1/palette2, text on palette9.
	 *
	 * @var array<string, array<string, string>>
	 */
	private const THEME_DEFAULT_SETTINGS = [
		'buttons_background' => [
			'color' => 'palette1',
			'hover' => 'palette2',
		],
		'buttons_color'      => [
			'color' => 'palette9',
			'hover' => 'palette9',
		],
	];

	private Token_Registry $registry;
	private Token_Store $store;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
		$this->store    = $this->container->get( Token_Store::class );
		$this->store->delete( Token_Store::default_slug() );
		wp_cache_flush();
	}

	protected function tearDown(): void {
		$this->store->delete( Token_Store::default_slug() );
		wp_cache_flush();

		parent::tearDown();
	}

	/**
	 * With the theme's default button settings the four button semantics alias the primitives that claim
	 * the referenced slots, so they resolve to the theme's colors and follow a later palette change.
	 *
	 * @return void
	 */
	public function testDefaultButtonSettingsAliasThePaletteSlots(): void {
		$resolved = $this->resolver_for( $this->source( self::THEME_DEFAULT_SETTINGS ) )->resolve();

		$this->assertSame( 'primitive.color.brand.primary', $resolved->target( 'semantic.color.button-bg' ) );
		$this->assertSame( '#a10001', $resolved->value( 'semantic.color.button-bg' ) );
		$this->assertSame( 'primitive.color.brand.secondary', $resolved->target( 'semantic.color.button-bg-hover' ) );
		$this->assertSame( '#a20002', $resolved->value( 'semantic.color.button-bg-hover' ) );
		$this->assertSame( 'primitive.color.neutral.0', $resolved->target( 'semantic.color.button-text' ) );
		$this->assertSame( '#a90009', $resolved->value( 'semantic.color.button-text' ) );
		$this->assertSame( 'primitive.color.neutral.0', $resolved->target( 'semantic.color.button-text-hover' ) );
		$this->assertSame( '#a90009', $resolved->value( 'semantic.color.button-text-hover' ) );
	}

	/**
	 * A button background the theme stores as a literal, a gradient or an unclaimed slot resolves to that
	 * exact value rather than to a palette primitive.
	 *
	 * @dataProvider literalBackgroundProvider
	 *
	 * @param string $stored   The value the Customizer stores on buttons_background.color.
	 * @param string $expected The resolved semantic.color.button-bg value.
	 *
	 * @return void
	 */
	public function testLiteralBackgroundResolvesUnchanged( string $stored, string $expected ): void {
		$settings                                = self::THEME_DEFAULT_SETTINGS;
		$settings['buttons_background']['color'] = $stored;

		$resolved = $this->resolver_for( $this->source( $settings ) )->resolve();

		$this->assertNull( $resolved->target( 'semantic.color.button-bg' ) );
		$this->assertSame( $expected, $resolved->value( 'semantic.color.button-bg' ) );
	}

	/**
	 * Background values the Customizer can hold that are not a claimed palette slot.
	 *
	 * @return Generator
	 */
	public function literalBackgroundProvider(): Generator {
		yield 'hex literal' => [
			'stored'   => '#C81E1E',
			'expected' => '#C81E1E',
		];
		yield 'rgba literal' => [
			'stored'   => 'rgba(200, 30, 30, 0.5)',
			'expected' => 'rgba(200, 30, 30, 0.5)',
		];
		yield 'gradient' => [
			'stored'   => 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(20,39,109) 100%)',
			'expected' => 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(20,39,109) 100%)',
		];
		yield 'unclaimed slot' => [
			'stored'   => 'palette11',
			'expected' => '#b10011',
		];
	}

	/**
	 * A button setting the mapper cannot use leaves the semantic on its shipped alias, so the token never
	 * silently takes a different theme color.
	 *
	 * @return void
	 */
	public function testAnUnusableButtonSettingKeepsTheShippedAlias(): void {
		$settings                                = self::THEME_DEFAULT_SETTINGS;
		$settings['buttons_background']['color'] = 'var(--global-palette1)';

		$resolved = $this->resolver_for( $this->source( $settings ) )->resolve();

		$this->assertSame( 'primitive.color.brand.button', $resolved->target( 'semantic.color.button-bg' ) );
		$this->assertSame( '#3633e1', $resolved->value( 'semantic.color.button-bg' ) );
		$this->assertSame( '#a20002', $resolved->value( 'semantic.color.button-bg-hover' ) );
	}

	/**
	 * A stored override of a button semantic wins over the Customizer, and deleting it hands the token
	 * back to the Customizer color rather than to the plugin's shipped default.
	 *
	 * @return void
	 */
	public function testOverrideWinsAndResetRestoresTheCustomizerColor(): void {
		$source = $this->source( self::THEME_DEFAULT_SETTINGS );

		$this->store->save_document(
			(string) wp_json_encode(
				[
					'semantic' => [
						'color' => [
							'button-bg' => [
								'$type'  => 'color',
								'$value' => '#123456',
							],
						],
					],
				]
			)
		);
		wp_cache_flush();

		$this->assertSame( '#123456', $this->resolver_for( $source )->resolve()->value( 'semantic.color.button-bg' ) );

		$this->store->delete( Token_Store::default_slug() );
		wp_cache_flush();

		$this->assertSame( '#a10001', $this->resolver_for( $source )->resolve()->value( 'semantic.color.button-bg' ) );
	}

	/**
	 * A Customizer change to a button color is reflected by a fresh overlay and changes the effective
	 * version, even though no token was written.
	 *
	 * @return void
	 */
	public function testCustomizerChangeToAButtonColorChangesTheEffectiveVersion(): void {
		$slug  = Token_Store::default_slug();
		$first = $this->source( self::THEME_DEFAULT_SETTINGS );

		$this->assertSame( '#a10001', $this->resolver_for( $first )->resolve()->value( 'semantic.color.button-bg' ) );

		$changed                                = self::THEME_DEFAULT_SETTINGS;
		$changed['buttons_background']['color'] = '#C81E1E';
		$second                                 = $this->source( $changed );

		$this->assertSame( '#C81E1E', $this->resolver_for( $second )->resolve()->value( 'semantic.color.button-bg' ) );
		$this->assertNotSame( $this->version_for( $first )->for_slug( $slug ), $this->version_for( $second )->for_slug( $slug ) );
	}

	/**
	 * On a site not running the Kadence theme the four button semantics keep their shipped values.
	 *
	 * @return void
	 */
	public function testNonKadenceSiteKeepsTheShippedButtonColors(): void {
		$resolved = $this->resolver_for( new Fake_Style_Guide_Source( null ) )->resolve();

		$this->assertSame( '#3633e1', $resolved->value( 'semantic.color.button-bg' ) );
		$this->assertSame( '#2f2ffc', $resolved->value( 'semantic.color.button-bg-hover' ) );
		$this->assertSame( '#ffffff', $resolved->value( 'semantic.color.button-text' ) );
		$this->assertSame( '#ffffff', $resolved->value( 'semantic.color.button-text-hover' ) );
	}

	/**
	 * A Kadence source carrying this test's palette and the given button settings.
	 *
	 * @param array<string, mixed> $settings Setting key => the value the theme's option() returns.
	 *
	 * @return Fake_Style_Guide_Source
	 */
	private function source( array $settings ): Fake_Style_Guide_Source {
		return Fake_Style_Guide_Source::with_palette( self::THEME_COLORS )->with_settings( $settings );
	}

	/**
	 * The cache-version service over a fresh overlay of the source.
	 *
	 * @param Fake_Style_Guide_Source $source The Style Guide source.
	 *
	 * @return Effective_Version
	 */
	private function version_for( Fake_Style_Guide_Source $source ): Effective_Version {
		return new Effective_Version( $this->store, new Style_Guide_Overlay( $source, new Style_Guide_Mapper(), $this->registry ) );
	}

	/**
	 * A resolver over the theme-decorated shipped baseline, composed the way the container composes the
	 * real one on a Kadence site.
	 *
	 * @param Fake_Style_Guide_Source $source The Style Guide source.
	 *
	 * @return Token_Resolver
	 */
	private function resolver_for( Fake_Style_Guide_Source $source ): Token_Resolver {
		$overlay  = new Style_Guide_Overlay( $source, new Style_Guide_Mapper(), $this->registry );
		$baseline = new Theme_Style_Guide_Baseline_Document(
			new Json_Baseline_Document(
				dirname( __DIR__, 4 ) . '/../includes/resources/Design_Tokens/Registry/Baseline/baseline.json',
				'button-colors-' . spl_object_id( $source )
			),
			$overlay,
			$this->container->get( Mutator::class )
		);

		return new Token_Resolver(
			$this->store,
			new Effective_Document( $baseline ),
			new Css_Renderer(),
			new Effective_Palettes( $baseline, $this->store, $this->container->get( Mutator::class ) ),
			$this->container->get( Mutator::class ),
			new Effective_Version( $this->store, $overlay )
		);
	}
}
