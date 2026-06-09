<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
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
		// The shipped declarations include button-bg => palette1.
		$this->assertArrayHasKey( 'palette1', $by_slug );
		$this->assertNotEmpty( $by_slug['palette1']['color'] );
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

	// ---- Theme option conditional sync -------------------------------------------------------------

	public function testReconcileUpdatesThemePaletteWhenItExists(): void {
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
					'color' => '#old5',
					'name'  => 'Palette Color 5',
					'slug'  => 'palette5',
				],
			],
		];
		update_option( 'kadence_global_palette', wp_json_encode( $theme_palette ) );

		$this->projector->reconcile();

		$raw     = get_option( 'kadence_global_palette' );
		$decoded = json_decode( (string) $raw, true );
		$by_slug = array_column( $decoded['palette'], null, 'slug' );

		// Token-claimed slots must be overwritten.
		$this->assertNotSame( '#old1', $by_slug['palette1']['color'] );
		// Unclaimed slots must be untouched.
		$this->assertSame( '#old5', $by_slug['palette5']['color'] );
	}

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
			new Css_Renderer()
		);

		$projector = new Projector(
			$this->registry,
			$corrupt_resolver,
			$this->container->get( Token_Store::class ),
			$this->container->get( Palette_Builder::class )
		);

		$projector->reconcile();

		$this->assertFalse( get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
		$this->assertEmpty( get_option( 'kadence_blocks_colors' ) );
	}

	// ---- Idempotency -------------------------------------------------------------------------------

	public function testSecondReconcileWithUnchangedSignaturePerformsNoWrite(): void {
		$this->projector->reconcile();

		$after_first = get_option( 'kadence_blocks_colors' );

		// Reset the per-request guard to allow a second reconcile.
		$this->reset_guard( $this->projector );

		$this->projector->reconcile();

		// The marker must have been set after the first reconcile; the second must short-circuit.
		$this->assertSame( $after_first, get_option( 'kadence_blocks_colors' ) );
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

	public function testThemeSwitchCausesSignatureFlipAndSyncsThemePalette(): void {
		// First reconcile without the theme palette present.
		$this->projector->reconcile();

		$marker_after_first = get_option( 'kadence_blocks_design_tokens_palette_sync' );
		$this->assertStringEndsWith( ':0', (string) $marker_after_first );

		// Now "switch" the theme by introducing the kadence_global_palette option.
		update_option(
			'kadence_global_palette',
			wp_json_encode(
				[
					'palette' => [
						[
							'color' => '#old',
							'name'  => 'P1',
							'slug'  => 'palette1',
						],
					],
				]
			)
		);

		// Reset the guard to allow another reconcile.
		$this->reset_guard( $this->projector );

		$this->projector->reconcile();

		$marker_after_second = get_option( 'kadence_blocks_design_tokens_palette_sync' );
		$this->assertStringEndsWith( ':1', (string) $marker_after_second );

		// The theme palette must have been updated.
		$raw     = get_option( 'kadence_global_palette' );
		$decoded = json_decode( (string) $raw, true );
		$by_slug = array_column( $decoded['palette'], null, 'slug' );
		$this->assertNotSame( '#old', $by_slug['palette1']['color'] );
	}

	// ---- Hook wiring -------------------------------------------------------------------------------

	public function testInitActionHasReconcileCallbackAtPriority20(): void {
		$this->assertNotFalse( has_action( 'init' ) );
	}

	public function testTokenChangedActionHasOnTokensChangedCallback(): void {
		$this->assertNotFalse( has_action( Token_Store::changed_action() ) );
	}
}
