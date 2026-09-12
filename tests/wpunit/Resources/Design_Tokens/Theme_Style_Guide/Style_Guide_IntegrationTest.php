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

final class Style_Guide_IntegrationTest extends TestCase {

	/**
	 * The nine palette slots a token claims, and the color this test gives each one.
	 *
	 * @var array<string, string>
	 */
	private const THEME_COLORS = [
		'palette1' => '#a10001',
		'palette2' => '#a20002',
		'palette3' => '#a30003',
		'palette4' => '#a40004',
		'palette5' => '#a50005',
		'palette6' => '#a60006',
		'palette7' => '#a70007',
		'palette8' => '#a80008',
		'palette9' => '#a90009',
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
	 * AC1: on a fresh library the palette primitives resolve to the theme's colors, and the semantics
	 * that alias them follow, so the site keeps the look it already had.
	 *
	 * @return void
	 */
	public function testFreshLibraryResolvesToTheThemePalette(): void {
		$resolved = $this->resolver_for( Fake_Style_Guide_Source::with_palette( self::THEME_COLORS ) )->resolve();

		$this->assertSame( '#a10001', $resolved->value( 'primitive.color.brand.primary' ) );
		$this->assertSame( '#a30003', $resolved->value( 'primitive.color.neutral.900' ) );
		$this->assertSame( '#a90009', $resolved->value( 'primitive.color.neutral.0' ) );

		// semantic.color.text aliases neutral.900, so re-valuing the primitive re-tints the semantic.
		$this->assertSame( '#a30003', $resolved->value( 'semantic.color.text' ) );
	}

	/**
	 * AC4: whichever palette set the theme renders is the one the tokens are read from.
	 *
	 * @dataProvider activeSetProvider
	 *
	 * @param string $set The palette set the theme has active.
	 *
	 * @return void
	 */
	public function testActiveSetIsHonored( string $set ): void {
		$source   = Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#abcdef' ], $set );
		$resolved = $this->resolver_for( $source )->resolve();

		$this->assertSame( '#abcdef', $resolved->value( 'primitive.color.brand.primary' ) );
	}

	/**
	 * The theme's three palette sets.
	 *
	 * @return Generator
	 */
	public function activeSetProvider(): Generator {
		yield 'first set' => [ 'set' => 'palette' ];
		yield 'second set' => [ 'set' => 'second-palette' ];
		yield 'third set' => [ 'set' => 'third-palette' ];
	}

	/**
	 * AC3: a token override wins over the theme, and deleting it hands control back to the Customizer
	 * rather than to the plugin's shipped default.
	 *
	 * @return void
	 */
	public function testTokenOverrideWinsAndResetRestoresTheThemeColor(): void {
		$source = Fake_Style_Guide_Source::with_palette( self::THEME_COLORS );

		$this->store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'primary' => [
									'$type'  => 'color',
									'$value' => '#123456',
								],
							],
						],
					],
				]
			)
		);
		wp_cache_flush();

		$this->assertSame( '#123456', $this->resolver_for( $source )->resolve()->value( 'primitive.color.brand.primary' ) );

		$this->store->delete( Token_Store::default_slug() );
		wp_cache_flush();

		$this->assertSame( '#a10001', $this->resolver_for( $source )->resolve()->value( 'primitive.color.brand.primary' ) );
	}

	/**
	 * AC5: a site not running the Kadence theme resolves exactly as it does today — the decorated and
	 * undecorated baselines produce the same map.
	 *
	 * @return void
	 */
	public function testNonKadenceSiteResolvesExactlyAsShipped(): void {
		$decorated = $this->resolver_for( new Fake_Style_Guide_Source( null ) )->resolve()->by_id();

		wp_cache_flush();

		$shipped = $this->shipped_resolver()->resolve()->by_id();

		$this->assertSame( $shipped, $decorated );
	}

	/**
	 * AC6: a Customizer save is reflected on the next request even though it writes no token, and the
	 * effective version changes while the store version does not.
	 *
	 * @return void
	 */
	public function testCustomizerSaveIsReflectedWithoutAStoreWrite(): void {
		$slug           = Token_Store::default_slug();
		$before_version = $this->store->get_version( $slug );

		$first     = Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] );
		$overlay   = new Style_Guide_Overlay( $first, new Style_Guide_Mapper(), $this->registry );
		$versions  = new Effective_Version( $this->store, $overlay );
		$effective = $versions->for_slug( $slug );

		$this->assertSame( '#111111', $this->resolver_for( $first )->resolve()->value( 'primitive.color.brand.primary' ) );

		// A new request after the Customizer save: a fresh overlay over the changed Style Guide.
		$second        = Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#999999' ] );
		$next_overlay  = new Style_Guide_Overlay( $second, new Style_Guide_Mapper(), $this->registry );
		$next_versions = new Effective_Version( $this->store, $next_overlay );

		$this->assertSame( '#999999', $this->resolver_for( $second )->resolve()->value( 'primitive.color.brand.primary' ) );
		$this->assertNotSame( $effective, $next_versions->for_slug( $slug ) );
		$this->assertSame( $before_version, $this->store->get_version( $slug ) );
	}

	/**
	 * AC7: has() delegates, so a declared token with no shipped baseline entry is still missing and the
	 * guard keeps failing closed.
	 *
	 * @return void
	 */
	public function testGuardStillSeesTheShippedIdsOnly(): void {
		$baseline = $this->baseline_for( Fake_Style_Guide_Source::with_palette( self::THEME_COLORS ) );

		$this->assertTrue( $baseline->has( 'primitive.color.brand.primary' ) );
		$this->assertFalse( $baseline->has( 'primitive.color.brand.invented' ) );
	}

	/**
	 * AC8: the Style Library's default palette shows the theme's colors, so "reset swatch" restores the
	 * theme color rather than the shipped hex.
	 *
	 * @return void
	 */
	public function testDefaultPaletteSwatchesShowTheThemeColors(): void {
		$baseline = $this->baseline_for( Fake_Style_Guide_Source::with_palette( self::THEME_COLORS ) );
		$palettes = new Effective_Palettes( $baseline, $this->store, $this->container->get( Mutator::class ) );
		$swatches = $palettes->baseline_swatch_values();

		$this->assertSame( '#a10001', $swatches['primitive.color.brand.primary'] );
		$this->assertSame( '#a30003', $swatches['primitive.color.neutral.900'] );
	}

	/**
	 * The decorated baseline over the real shipped baseline.json.
	 *
	 * @param Fake_Style_Guide_Source $source The Style Guide source.
	 *
	 * @return Theme_Style_Guide_Baseline_Document
	 */
	private function baseline_for( Fake_Style_Guide_Source $source ): Theme_Style_Guide_Baseline_Document {
		return new Theme_Style_Guide_Baseline_Document(
			$this->shipped_baseline( 'integration-' . spl_object_id( $source ) ),
			new Style_Guide_Overlay( $source, new Style_Guide_Mapper(), $this->registry ),
			$this->container->get( Mutator::class )
		);
	}

	/**
	 * A resolver over the decorated baseline, composed the way the container composes the real one.
	 *
	 * @param Fake_Style_Guide_Source $source The Style Guide source.
	 *
	 * @return Token_Resolver
	 */
	private function resolver_for( Fake_Style_Guide_Source $source ): Token_Resolver {
		$overlay  = new Style_Guide_Overlay( $source, new Style_Guide_Mapper(), $this->registry );
		$baseline = new Theme_Style_Guide_Baseline_Document(
			$this->shipped_baseline( 'integration-' . spl_object_id( $source ) ),
			$overlay,
			$this->container->get( Mutator::class )
		);

		return $this->resolver_over( $baseline, new Effective_Version( $this->store, $overlay ) );
	}

	/**
	 * A resolver over the undecorated shipped baseline, for the "unchanged on other themes" comparison.
	 *
	 * @return Token_Resolver
	 */
	private function shipped_resolver(): Token_Resolver {
		$baseline = $this->shipped_baseline( 'integration-shipped' );
		$overlay  = new Style_Guide_Overlay( new Fake_Style_Guide_Source( null ), new Style_Guide_Mapper(), $this->registry );

		return $this->resolver_over( $baseline, new Effective_Version( $this->store, $overlay ) );
	}

	/**
	 * Compose a resolver over a baseline.
	 *
	 * @param object            $baseline The baseline document.
	 * @param Effective_Version $versions The cache-version service.
	 *
	 * @return Token_Resolver
	 */
	private function resolver_over( $baseline, Effective_Version $versions ): Token_Resolver {
		return new Token_Resolver(
			$this->store,
			new Effective_Document( $baseline ),
			new Css_Renderer(),
			new Effective_Palettes( $baseline, $this->store, $this->container->get( Mutator::class ) ),
			$this->container->get( Mutator::class ),
			$versions
		);
	}

	/**
	 * The shipped baseline.json, with a per-test cache version so one test's decoded document cannot be
	 * served to another.
	 *
	 * @param string $version The cache version to key the decoded document on.
	 *
	 * @return Json_Baseline_Document
	 */
	private function shipped_baseline( string $version ): Json_Baseline_Document {
		return new Json_Baseline_Document(
			dirname( __DIR__, 4 ) . '/../includes/resources/Design_Tokens/Registry/Baseline/baseline.json',
			$version
		);
	}
}
