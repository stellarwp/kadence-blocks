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
use ReflectionProperty;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class Palette_FilterTest extends TestCase {

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

		// Token_Resolver also caches in the object cache keyed on the store version, so without this a
		// resolver built inside a test is served the document an earlier test resolved.
		wp_cache_flush();
	}

	protected function tearDown(): void {
		$this->registry->activate();
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
	 * The filter answers a slot the same way whichever palette set the theme has active.
	 *
	 * The removed option write only ever touched the "palette" set, so a site on second-palette saw
	 * nothing. The filter runs after the theme picks the set, so the set never reaches this code.
	 *
	 * @return void
	 */
	public function testResultDoesNotDependOnTheThemesActivePaletteSet(): void {
		$resolved = $this->container->get( Token_Resolver::class )->resolve();
		$expected = $resolved->value( 'primitive.color.brand.primary' );

		$this->assertSame( $expected, $this->filter->filter( '#from-palette', 'palette1' ) );
		$this->assertSame( $expected, $this->filter->filter( '#from-second-palette', 'palette1' ) );
		$this->assertSame( $expected, $this->filter->filter( '#from-third-palette', 'palette1' ) );
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
			$this->container->get( Mutator::class )
		);

		$filter = new Palette_Filter(
			$this->registry,
			$corrupt_resolver,
			$this->container->get( Active_Token_Library_Store::class ),
			$this->container->get( Palette_Builder::class )
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
			$builder
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
