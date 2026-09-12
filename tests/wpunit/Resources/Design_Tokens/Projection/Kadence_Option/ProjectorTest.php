<?php declare( strict_types=1 );
// cspell:ignore palette autoloaded alloptions .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class ProjectorTest extends TestCase {

	private Projector $projector;
	private Token_Registry $registry;

	/**
	 * Sentinel string used to detect absent options.
	 */
	private const ABSENT = "\0kb-design-tokens-absent\0";

	protected function setUp(): void {
		parent::setUp();

		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );

		// The Provider hooks reconcile() onto init, which fires during the WP test bootstrap and so
		// consumes the once-per-request guard before any test runs. Reset it so each test models a fresh
		// request whose first reconcile() actually does work.
		$this->reset_guard( $this->projector );

		delete_option( 'kadence_blocks_colors' );
		delete_option( 'kadence_global_palette' );
		delete_option( 'kadence_blocks_design_tokens_palette_sync' );
	}

	protected function tearDown(): void {
		$this->registry->activate();

		$this->reset_guard( $this->projector );

		// Clear the resolver memo so values do not leak between tests.
		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );

		delete_option( 'kadence_blocks_colors' );
		delete_option( 'kadence_global_palette' );
		delete_option( 'kadence_blocks_design_tokens_palette_sync' );

		parent::tearDown();
	}

	/**
	 * Reset a projector's per-request guard so a subsequent reconcile() runs (each call models a new
	 * request).
	 */
	private function reset_guard( Projector $projector ): void {
		$guard = new ReflectionProperty( Projector::class, 'reconciled_this_request' );
		$guard->setAccessible( true );
		$guard->setValue( $projector, false );
	}

	// ---- Always-on KB colors sync ------------------------------------------------------------------

	public function testReconcileWritesKbColorsWithResolvedPaletteToken(): void {
		$this->projector->reconcile();

		$raw     = get_option( 'kadence_blocks_colors' );
		$decoded = json_decode( (string) $raw, true );

		$this->assertIsArray( $decoded );
		$by_slug = array_column( $decoded['palette'], null, 'slug' );
		// The shipped declarations map primitive.color.brand.primary => palette1.
		$this->assertArrayHasKey( 'palette1', $by_slug );
		$this->assertMatchesRegularExpression( '/^#[0-9a-fA-F]{3,8}$/', $by_slug['palette1']['color'] );
	}

	public function testReconcileDecodesEmptyKbColorsOption(): void {
		update_option( 'kadence_blocks_colors', '' );

		$this->projector->reconcile();

		$decoded = json_decode( (string) get_option( 'kadence_blocks_colors' ), true );
		$this->assertIsArray( $decoded );
		$this->assertArrayHasKey( 'palette', $decoded );
	}

	public function testReconcileSyncsKbColorsWithoutKadenceGlobalPalettePresent(): void {
		// Explicitly confirm there is no kadence_global_palette option.
		$this->assertSame( self::ABSENT, get_option( 'kadence_global_palette', self::ABSENT ) );

		$this->projector->reconcile();

		// KB colors must be written regardless: it decodes to a palette array.
		$decoded = json_decode( (string) get_option( 'kadence_blocks_colors' ), true );
		$this->assertIsArray( $decoded );
		$this->assertArrayHasKey( 'palette', $decoded );
	}

	// ---- The theme's Style Guide is never written ---------------------------------------------------

	/**
	 * An existing kadence_global_palette is left byte-for-byte untouched, including the slots tokens claim.
	 *
	 * That option is the user's Style Guide. Writing it destroyed colors chosen in the Customizer with no
	 * way back, so this asserts the whole stored value, not just the claimed slots.
	 *
	 * @return void
	 */
	public function testReconcileLeavesAnExistingThemePaletteUntouched(): void {
		$theme_palette = [
			'palette' => [
				[
					'color' => '#old1',
					'name'  => 'Palette Color 1',
					'slug'  => 'palette1',
				],
				[
					'color' => '#old2',
					'name'  => 'Palette Color 2',
					'slug'  => 'palette2',
				],
				[
					'color' => '#old3',
					'name'  => 'Theme Extra',
					'slug'  => 'theme-extra',
				],
			],
		];
		$stored        = (string) wp_json_encode( $theme_palette );
		update_option( 'kadence_global_palette', $stored );

		$this->projector->reconcile();

		$this->assertSame( $stored, get_option( 'kadence_global_palette' ) );
	}

	/**
	 * A palette set the theme renders other than "palette" is left untouched too.
	 *
	 * The removed write only ever touched $existing['palette'], so a site on second-palette had its
	 * stored colors destroyed for no visible effect. This pins that the whole option survives.
	 *
	 * @return void
	 */
	public function testReconcileLeavesANonDefaultActivePaletteSetUntouched(): void {
		$theme_palette = [
			'active'         => 'second-palette',
			'palette'        => [
				[
					'color' => '#aaa111',
					'name'  => 'Palette Color 1',
					'slug'  => 'palette1',
				],
			],
			'second-palette' => [
				[
					'color' => '#bbb222',
					'name'  => 'Palette Color 1',
					'slug'  => 'palette1',
				],
			],
		];
		$stored        = (string) wp_json_encode( $theme_palette );
		update_option( 'kadence_global_palette', $stored );

		$this->projector->reconcile();

		$this->assertSame( $stored, get_option( 'kadence_global_palette' ) );
	}

	/**
	 * The projector never creates the theme's palette option on a site that has none.
	 *
	 * @return void
	 */
	public function testReconcileNeverCreatesThemePaletteWhenAbsent(): void {
		$this->projector->reconcile();

		$this->assertSame( self::ABSENT, get_option( 'kadence_global_palette', self::ABSENT ) );
	}

	// ---- Fail-closed guard -------------------------------------------------------------------------

	public function testReconcileWritesNothingWhenRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		$this->projector->reconcile();

		// kadence_blocks_colors is a registered setting with a '' default, so get_option never returns
		// false — assert it was not populated with a token palette instead.
		$this->assertEmpty( get_option( 'kadence_blocks_colors' ) );
		// The sync marker is our own option and is only written after a successful sync.
		$this->assertFalse( get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
	}

	// ---- Fail-open on corrupt store ----------------------------------------------------------------

	public function testReconcileDoesNotAdvanceMarkerOnResolverException(): void {
		$kb_colors     = [
			'palette'  => [
				[
					'color' => '#seeded',
					'name'  => 'Seeded',
					'slug'  => 'palette1',
				],
			],
			'override' => false,
		];
		$theme_palette = [
			'palette' => [
				[
					'color' => '#theme-old',
					'name'  => 'P1',
					'slug'  => 'palette1',
				],
			],
		];
		$kb_json       = (string) wp_json_encode( $kb_colors );
		$theme_json    = (string) wp_json_encode( $theme_palette );
		update_option( 'kadence_blocks_colors', $kb_json );
		update_option( 'kadence_global_palette', $theme_json );

		// A real resolver over a baseline whose only token aliases a missing path: resolve() throws a
		// Dangling_Alias_Exception (a RuntimeException), exercising the genuine fail-open path. Token_Resolver
		// is final, so we compose one rather than subclass it.
		$corrupt_resolver = new Token_Resolver(
			$this->container->get( Token_Store::class ),
			new Effective_Document(
				new Fake_Baseline_Document(
					[
						'semantic' => [
							'color' => [
								'button-bg' => [
									'$type'  => 'color',
									'$value' => '{primitive.color.missing}',
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

		$projector = new Projector(
			$this->registry,
			$corrupt_resolver,
			$this->container->get( Token_Store::class ),
			$this->container->get( Active_Token_Library_Store::class ),
			$this->container->get( Palette_Builder::class )
		);

		$projector->reconcile();

		$this->assertFalse( get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
		$this->assertSame( $kb_json, get_option( 'kadence_blocks_colors' ) );
		$this->assertSame( $theme_json, get_option( 'kadence_global_palette' ) );
	}

	// ---- Idempotency -------------------------------------------------------------------------------

	public function testSecondReconcileWithUnchangedSignatureSkipsResolution(): void {
		$this->projector->reconcile();

		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );

		$this->reset_guard( $this->projector );
		$this->projector->reconcile();

		// Matching marker must short-circuit before resolve() repopulates the memo.
		$this->assertSame( [], $memo->getValue( $resolver ) );
	}

	public function testMarkerIsAutoloaded(): void {
		$this->projector->reconcile();

		$this->assertNotFalse( get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
		// reconcile() reads the marker on every request to short-circuit, so it must be autoloaded
		// rather than cost a dedicated query: assert it landed in the autoloaded set.
		$this->assertArrayHasKey( 'kadence_blocks_design_tokens_palette_sync', wp_load_alloptions() );
	}

	// ---- Token-changed action re-sync --------------------------------------------------------------

	public function testOnTokensChangedBypassesPerRequestGuardAndSyncs(): void {
		// Perform a boot reconcile first.
		$this->projector->reconcile();

		// Simulate a token write by clearing the marker so the sync runs again and re-writes.
		delete_option( 'kadence_blocks_design_tokens_palette_sync' );

		// on_tokens_changed must bypass the guard and run sync again.
		$this->projector->on_tokens_changed();

		$decoded = json_decode( (string) get_option( 'kadence_blocks_colors' ), true );
		$this->assertIsArray( $decoded );
		$this->assertNotFalse( get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
	}

	// ---- Theme-switch signature flip ---------------------------------------------------------------

	/**
	 * Introducing the theme's palette option does not change the sync signature or write anything.
	 *
	 * The signature used to carry a "theme present" bit so a theme switch would re-sync and write the
	 * theme's option. Nothing is written any more, so the bit is gone and the marker carries only the
	 * plugin version, the active library slug and that library's store version.
	 *
	 * @return void
	 */
	public function testIntroducingTheThemePaletteDoesNotFlipTheSignature(): void {
		$this->projector->reconcile();

		$marker_after_first = (string) get_option( 'kadence_blocks_design_tokens_palette_sync' );
		$this->assertStringEndsNotWith( ':0', $marker_after_first );
		$this->assertStringEndsNotWith( ':1', $marker_after_first );

		$stored = (string) wp_json_encode(
			[
				'palette' => [
					[
						'color' => '#old',
						'name'  => 'P1',
						'slug'  => 'palette1',
					],
				],
			]
		);
		update_option( 'kadence_global_palette', $stored );

		$this->reset_guard( $this->projector );
		$this->projector->reconcile();

		$this->assertSame( $marker_after_first, (string) get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
		$this->assertSame( $stored, get_option( 'kadence_global_palette' ) );
	}

	/**
	 * The marker names the active library as well as its version, so the sync cannot mistake one library
	 * for another. A library version is a per-row hash and nothing enforces that two rows carry different
	 * ones, so the slug is what makes a switch always visible in the signature.
	 *
	 * @return void
	 */
	public function testSyncMarkerCarriesTheActiveLibrarySlug(): void {
		$active = $this->container->get( Active_Token_Library_Store::class )->get();

		$this->projector->reconcile();

		$this->assertStringContainsString(
			':' . $active . ':',
			(string) get_option( 'kadence_blocks_design_tokens_palette_sync' )
		);
	}

	// ---- Hook wiring -------------------------------------------------------------------------------

	public function testInitActionHasReconcileCallbackAtPriority20(): void {
		global $wp_filter;
		// has_action('init') is always non-false in WP core; check that priority 20 specifically has a
		// callback, which is where the Provider wires reconcile().
		$this->assertArrayHasKey( 20, $wp_filter['init']->callbacks );
	}

	public function testTokenChangedActionHasOnTokensChangedCallback(): void {
		$this->assertNotFalse( has_action( Token_Store::changed_action() ) );
	}
}
