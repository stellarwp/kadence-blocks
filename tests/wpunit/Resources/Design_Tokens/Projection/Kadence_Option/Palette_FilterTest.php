<?php declare( strict_types=1 );
// cspell:ignore palette subkey .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Kadence_Option;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Filter;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts\Style_Guide_Source;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Reader;
use ReflectionProperty;
use Tests\Support\Classes\Fake_Style_Guide_Source;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Version;

final class Palette_FilterTest extends TestCase {

	/**
	 * Slug of the second token library the active-library switch case needs.
	 */
	private const OTHER_LIBRARY = 'filter-switch-target';

	private Palette_Filter $filter;
	private Token_Registry $registry;
	private Token_Store $store;

	protected function setUp(): void {
		parent::setUp();

		$this->filter   = $this->container->get( Palette_Filter::class );
		$this->registry = $this->container->get( Token_Registry::class );
		$this->store    = $this->container->get( Token_Store::class );

		// The filter memoizes per request; the WP test bootstrap may already have populated it.
		$this->filter->on_tokens_changed();
		$this->store->delete( Token_Store::default_slug() );
		$this->reset_resolver_memo();

		// Start every test with no Style Guide, so the result never depends on whether the Kadence theme
		// is active and has a palette saved in the environment running the suite.
		$this->swap_style_guide_source( new Fake_Style_Guide_Source() );

		// Token_Resolver also caches in the object cache keyed on the store version, so without this a
		// resolver built inside a test is served the document an earlier test resolved.
		wp_cache_flush();
	}

	protected function tearDown(): void {
		$this->registry->activate();
		$this->restore_style_guide_source();
		$this->container->get( Active_Token_Library_Store::class )->set( Token_Store::default_slug() );
		$this->store->delete( self::OTHER_LIBRARY );
		$this->filter->on_tokens_changed();
		$this->store->delete( Token_Store::default_slug() );
		$this->reset_resolver_memo();

		parent::tearDown();
	}

	/**
	 * A slot a token claims is answered with the resolved token color, replacing the theme's value.
	 *
	 * @return void
	 */
	public function testClaimedSlotReturnsResolvedTokenColor(): void {
		$resolved = $this->container->get( Token_Resolver::class )->resolve();

		$this->assertSame(
			$resolved->value( 'primitive.color.brand.primary' ),
			$this->filter->filter( '#old', 'palette1' )
		);
	}

	/**
	 * Slots no token claims, and non-string slot keys, pass through untouched.
	 *
	 * @dataProvider passthroughProvider
	 *
	 * @param mixed $value  The theme's value.
	 * @param mixed $subkey The slot key the theme asked for.
	 *
	 * @return void
	 */
	public function testUnclaimedSlotPassesThrough( $value, $subkey ): void {
		$this->assertSame( $value, $this->filter->filter( $value, $subkey ) );
	}

	/**
	 * Slot keys the token vocabulary does not claim, and malformed keys.
	 *
	 * @return Generator
	 */
	public function passthroughProvider(): Generator {
		yield 'complement slot' => [
			'value'  => '#FfFfFf',
			'subkey' => 'palette10',
		];
		yield 'rating slot' => [
			'value'  => '#f5a524',
			'subkey' => 'palette15',
		];
		yield 'non-string subkey' => [
			'value'  => '#abcdef',
			'subkey' => 3,
		];
	}

	/**
	 * A deactivated registry (fail-closed guard) leaves every read untouched.
	 *
	 * @return void
	 */
	public function testDeactivatedRegistryPassesThrough(): void {
		$this->registry->deactivate();

		$this->assertSame( '#old', $this->filter->filter( '#old', 'palette1' ) );
	}

	/**
	 * A token override written to the store wins over the theme value on the next read.
	 *
	 * @return void
	 */
	public function testTokenOverrideWinsAfterWrite(): void {
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

		$this->filter->on_tokens_changed();
		$this->reset_resolver_memo();

		$this->assertSame( '#123456', $this->filter->filter( '#old', 'palette1' ) );
	}

	/**
	 * A read the theme resolved from the saved active palette set gets the token color.
	 *
	 * @return void
	 */
	public function testValueFromTheActivePaletteSetGetsTheTokenColor(): void {
		$this->swap_style_guide_source( $this->style_guide_with_two_sets() );

		$resolved = $this->container->get( Token_Resolver::class )->resolve();

		$this->assertSame(
			$resolved->value( 'primitive.color.brand.primary' ),
			$this->filter->filter( '#111111', 'palette1' )
		);
	}

	/**
	 * A read the theme resolved from a palette set other than the saved active one is left untouched.
	 *
	 * Kadence Pro's dark mode asks the theme for second-palette while the site renders palette, and the
	 * filter receives only the slot, so the value is what tells the two apart.
	 *
	 * @dataProvider otherPaletteSetProvider
	 *
	 * @param string $value  The color the theme resolved from the requested set.
	 * @param string $subkey The slot being read.
	 *
	 * @return void
	 */
	public function testValueFromAnotherPaletteSetPassesThrough( string $value, string $subkey ): void {
		$this->swap_style_guide_source( $this->style_guide_with_two_sets() );

		$this->assertSame( $value, $this->filter->filter( $value, $subkey ) );
	}

	/**
	 * Slot reads that resolve from second-palette while palette is active.
	 *
	 * @return Generator
	 */
	public function otherPaletteSetProvider(): Generator {
		yield 'second palette slot 1' => [
			'value'  => '#999999',
			'subkey' => 'palette1',
		];
		yield 'second palette slot 3' => [
			'value'  => '#aaaaaa',
			'subkey' => 'palette3',
		];
	}

	/**
	 * The comparison with the saved active color ignores case and surrounding whitespace.
	 *
	 * @return void
	 */
	public function testActiveSetComparisonIgnoresCaseAndWhitespace(): void {
		$this->swap_style_guide_source( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#AbCdEf' ] ) );

		$resolved = $this->container->get( Token_Resolver::class )->resolve();

		$this->assertSame(
			$resolved->value( 'primitive.color.brand.primary' ),
			$this->filter->filter( ' #abcdef ', 'palette1' )
		);
	}

	/**
	 * A slot the active set has no color for is not treated as another palette set.
	 *
	 * @return void
	 */
	public function testSlotMissingFromTheActiveSetStillGetsTheTokenColor(): void {
		$this->swap_style_guide_source( Fake_Style_Guide_Source::with_palette( [ 'palette2' => '#222222' ] ) );

		$resolved = $this->container->get( Token_Resolver::class )->resolve();

		$this->assertSame(
			$resolved->value( 'primitive.color.brand.primary' ),
			$this->filter->filter( '#anything', 'palette1' )
		);
	}

	/**
	 * A non-string value cannot be compared with the saved color, so it is not treated as another palette set.
	 *
	 * @return void
	 */
	public function testNonStringValueStillGetsTheTokenColor(): void {
		$this->swap_style_guide_source( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );

		$resolved = $this->container->get( Token_Resolver::class )->resolve();

		$this->assertSame(
			$resolved->value( 'primitive.color.brand.primary' ),
			$this->filter->filter( null, 'palette1' )
		);
	}

	/**
	 * A corrupt stored document fails open: the theme's own value is returned.
	 *
	 * @return void
	 */
	public function testCorruptDocumentPassesThrough(): void {
		$corrupt_resolver = new Token_Resolver(
			$this->store,
			new Effective_Document(
				new Fake_Baseline_Document(
					[
						'primitive' => [
							'color' => [
								'brand' => [
									'primary' => [
										'$type'  => 'color',
										'$value' => '{primitive.color.missing}',
									],
								],
							],
						],
					]
				)
			),
			new Css_Renderer(),
			$this->container->get( Effective_Palettes::class ),
			$this->container->get( Mutator::class ),
			$this->container->get( Effective_Version::class )
		);

		$filter = new Palette_Filter(
			$this->registry,
			$corrupt_resolver,
			$this->container->get( Active_Token_Library_Store::class ),
			$this->container->get( Palette_Builder::class ),
			$this->container->get( Style_Guide_Overlay::class )
		);

		$this->assertSame( '#old', $filter->filter( '#old', 'palette1' ) );
	}

	/**
	 * The provider hooks the filter onto the theme's palette read.
	 *
	 * @return void
	 */
	public function testFilterIsHookedToKadencePaletteOption(): void {
		$this->assertNotFalse( has_filter( 'kadence_palette_option' ) );
	}

	/**
	 * A token write clears the memo through the provider's hook, with no manual reset.
	 *
	 * The filter memoizes per request, so without that hook a palette read later in the same request
	 * that wrote the token would answer with the pre-write color.
	 *
	 * @return void
	 */
	public function testTokenWriteClearsTheMemoThroughTheHook(): void {
		// Build the memo first, so the test fails if the write does not clear it.
		$this->filter->filter( '#old', 'palette1' );

		$this->store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'primary' => [
									'$type'  => 'color',
									'$value' => '#abcdef',
								],
							],
						],
					],
				]
			)
		);

		$this->assertSame( '#abcdef', $this->filter->filter( '#old', 'palette1' ) );
	}

	/**
	 * Switching the active library clears the memo through the provider's hook, with no manual reset.
	 *
	 * The memo is built from the active library's resolved tokens, so the pointer moving invalidates it for
	 * the same reason a write does. Without the hook a palette read after the switch answers with the
	 * previous library's colors.
	 *
	 * @return void
	 */
	public function testActiveLibrarySwitchClearsTheMemoThroughTheHook(): void {
		$this->store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'primary' => [
									'$type'  => 'color',
									'$value' => '#abcdef',
								],
							],
						],
					],
				]
			),
			self::OTHER_LIBRARY
		);

		// Build the memo against the default library first, so the test fails if the switch does not clear it.
		$before = $this->filter->filter( '#old', 'palette1' );
		$this->assertNotSame( '#abcdef', $before );

		$this->container->get( Active_Token_Library_Store::class )->set( self::OTHER_LIBRARY );

		$this->assertSame( '#abcdef', $this->filter->filter( '#old', 'palette1' ) );
	}

	/**
	 * A Style Guide change clears the memo through the provider's hook, after the overlay flushed.
	 *
	 * The memo is built from the resolver, and the resolver reads the baseline decorated with the theme's
	 * Style Guide, so a Customizer save invalidates it with no token write and no library switch. The probe
	 * read runs on the same hook just before the overlay flushes: if the memo were cleared before the flush
	 * instead of after, the probe would rebuild it from the stale overlay and nothing would clear it again.
	 *
	 * @dataProvider styleGuideHookProvider
	 *
	 * @param string $hook           The hook the theme fires when the Style Guide changes.
	 * @param int    $probe_priority One step before the overlay's own flush on that hook.
	 *
	 * @return void
	 */
	public function testStyleGuideChangeClearsTheMemoThroughTheHook( string $hook, int $probe_priority ): void {
		$source = Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] );
		$this->swap_style_guide_source( $source );

		// Build the memo from the first Style Guide, so the test fails if the change does not clear it.
		$this->assertSame( '#111111', $this->filter->filter( '#111111', 'palette1' ) );

		$source->set( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#222222' ] )->snapshot() );

		$probe = function (): void {
			$this->filter->filter( '#222222', 'palette1' );
		};
		add_action( $hook, $probe, $probe_priority );

		try {
			do_action( $hook );
		} finally {
			remove_action( $hook, $probe, $probe_priority );
		}

		$this->assertSame( '#222222', $this->filter->filter( '#222222', 'palette1' ) );
	}

	/**
	 * The four hooks the overlay flushes on, each with a probe priority one step before that flush.
	 *
	 * @return Generator
	 */
	public function styleGuideHookProvider(): Generator {
		yield 'palette option added' => [
			'hook'           => 'add_option_' . Style_Guide_Reader::get_palette_option_key(),
			'probe_priority' => 9,
		];
		yield 'palette option updated' => [
			'hook'           => 'update_option_' . Style_Guide_Reader::get_palette_option_key(),
			'probe_priority' => 9,
		];
		yield 'palette option deleted' => [
			'hook'           => 'delete_option_' . Style_Guide_Reader::get_palette_option_key(),
			'probe_priority' => 9,
		];
		yield 'customizer preview init' => [
			'hook'           => 'customize_preview_init',
			'probe_priority' => -1,
		];
	}

	/**
	 * A read taken before the declarations register does not pin an empty map for the rest of the request.
	 *
	 * The theme reads the palette earlier than init:0 (its own CSS and the Customizer both call
	 * palette_option()), so memoizing "no palette tokens" would answer every later read with the theme's
	 * value and a token override would silently do nothing. Found on a live site, not by the suite.
	 *
	 * @return void
	 */
	public function testAnEarlyReadDoesNotPinAnEmptyMap(): void {
		$builder = new Palette_Builder( new Token_Registry() );
		$filter  = new Palette_Filter(
			$this->registry,
			$this->container->get( Token_Resolver::class ),
			$this->container->get( Active_Token_Library_Store::class ),
			$builder,
			$this->container->get( Style_Guide_Overlay::class )
		);

		// A theme read before init:0: the registry has no palette tokens yet, so the theme's value stands.
		$this->assertSame( '#theme', $filter->filter( '#theme', 'palette1' ) );

		// Declarations register partway through the request, as they do at init:0 on a real site.
		$registry = new ReflectionProperty( Palette_Builder::class, 'registry' );
		$registry->setAccessible( true );
		$registry->setValue( $builder, $this->container->get( Token_Registry::class ) );

		// The same filter instance must not answer this read from the empty map it saw first.
		$this->assertNotSame( '#theme', $filter->filter( '#theme', 'palette1' ) );
	}

	/**
	 * A Style Guide whose active "palette" set and its "second-palette" disagree on every slot.
	 *
	 * @return Fake_Style_Guide_Source
	 */
	private function style_guide_with_two_sets(): Fake_Style_Guide_Source {
		$snapshot                      = Fake_Style_Guide_Source::with_palette(
			[
				'palette1' => '#111111',
				'palette3' => '#333333',
			]
		)->snapshot();
		$snapshot['palette']['second-palette'] = [
			[
				'color' => '#999999',
				'name'  => 'PALETTE1',
				'slug'  => 'palette1',
			],
			[
				'color' => '#aaaaaa',
				'name'  => 'PALETTE3',
				'slug'  => 'palette3',
			],
		];

		return new Fake_Style_Guide_Source( $snapshot );
	}

	/**
	 * Point the container's Style Guide overlay at a source the test controls, so the real overlay,
	 * decorator, resolver and filter chain runs against a Style Guide without the Kadence theme installed.
	 *
	 * @param Style_Guide_Source $source The source to read from.
	 *
	 * @return void
	 */
	private function swap_style_guide_source( Style_Guide_Source $source ): void {
		$overlay  = $this->container->get( Style_Guide_Overlay::class );
		$property = new ReflectionProperty( Style_Guide_Overlay::class, 'source' );
		$property->setAccessible( true );
		$property->setValue( $overlay, $source );
		$overlay->flush();
	}

	/**
	 * Put the real reader back on the container's overlay, so later tests see the suite's empty Style Guide.
	 *
	 * @return void
	 */
	private function restore_style_guide_source(): void {
		$this->swap_style_guide_source( $this->container->get( Style_Guide_Source::class ) );
	}

	/**
	 * Clear the resolver's per-request memo so values do not leak between tests.
	 *
	 * @return void
	 */
	private function reset_resolver_memo(): void {
		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );
	}
}
