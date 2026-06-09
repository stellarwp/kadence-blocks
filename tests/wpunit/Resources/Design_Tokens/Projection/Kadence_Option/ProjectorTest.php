<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
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

		delete_option( 'kadence_blocks_colors' );
		delete_option( 'kadence_global_palette' );
		delete_option( 'kadence_blocks_design_tokens_palette_sync' );
	}

	protected function tearDown(): void {
		$this->registry->activate();

		// Reset the per-request guard so tests are isolated.
		$guard = new ReflectionProperty( Projector::class, 'reconciled_this_request' );
		$guard->setAccessible( true );
		$guard->setValue( $this->projector, false );

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

		// KB colors must be written regardless.
		$this->assertNotFalse( get_option( 'kadence_blocks_colors' ) );
	}

	// ---- Theme option conditional sync -------------------------------------------------------------

	public function testReconcileUpdatesThemePaletteWhenItExists(): void {
		$theme_palette = [
			'palette' => [
				[ 'color' => '#old1', 'name' => 'Palette Color 1', 'slug' => 'palette1' ],
				[ 'color' => '#old2', 'name' => 'Palette Color 2', 'slug' => 'palette2' ],
				[ 'color' => '#old5', 'name' => 'Palette Color 5', 'slug' => 'palette5' ],
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

		$this->assertFalse( get_option( 'kadence_blocks_colors' ) );
		$this->assertFalse( get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
	}

	// ---- Fail-open on corrupt store ----------------------------------------------------------------

	public function testReconcileDoesNotAdvanceMarkerOnResolverException(): void {
		// Replace the resolver with one that always throws.
		$throwing_resolver = new class extends Token_Resolver {
			public function __construct() {}

			public function resolve( string $slug = 'default' ): never {
				throw new \RuntimeException( 'corrupt store' );
			}
		};

		$projector = new Projector(
			$this->registry,
			$throwing_resolver,
			$this->container->get( Token_Store::class ),
			$this->container->get( Palette_Builder::class )
		);

		$projector->reconcile();

		$this->assertFalse( get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
		$this->assertFalse( get_option( 'kadence_blocks_colors' ) );
	}

	// ---- Idempotency -------------------------------------------------------------------------------

	public function testSecondReconcileWithUnchangedSignaturePerformsNoWrite(): void {
		$this->projector->reconcile();

		$after_first = get_option( 'kadence_blocks_colors' );

		// Reset the per-request guard to allow a second reconcile.
		$guard = new ReflectionProperty( Projector::class, 'reconciled_this_request' );
		$guard->setAccessible( true );
		$guard->setValue( $this->projector, false );

		$this->projector->reconcile();

		// The marker must have been set after the first reconcile; the second must short-circuit.
		$this->assertSame( $after_first, get_option( 'kadence_blocks_colors' ) );
	}

	// ---- Token-changed action re-sync --------------------------------------------------------------

	public function testOnTokensChangedBypasesPerRequestGuardAndSyncs(): void {
		// Perform a boot reconcile first.
		$this->projector->reconcile();

		// Simulate a token write by clearing the marker so the sync runs again and re-writes.
		delete_option( 'kadence_blocks_design_tokens_palette_sync' );

		// on_tokens_changed must bypass the guard and run sync again.
		$this->projector->on_tokens_changed();

		$this->assertNotFalse( get_option( 'kadence_blocks_colors' ) );
		$this->assertNotFalse( get_option( 'kadence_blocks_design_tokens_palette_sync' ) );
	}

	// ---- Theme-switch signature flip ---------------------------------------------------------------

	public function testThemeSwitchCausesSignatureFlipAndSyncsThemePalette(): void {
		// First reconcile without the theme palette present.
		$this->projector->reconcile();

		$marker_after_first = get_option( 'kadence_blocks_design_tokens_palette_sync' );
		$this->assertStringEndsWith( ':0', (string) $marker_after_first );

		// Now "switch" the theme by introducing the kadence_global_palette option.
		update_option( 'kadence_global_palette', wp_json_encode( [ 'palette' => [ [ 'color' => '#old', 'name' => 'P1', 'slug' => 'palette1' ] ] ] ) );

		// Reset the guard to allow another reconcile.
		$guard = new ReflectionProperty( Projector::class, 'reconciled_this_request' );
		$guard->setAccessible( true );
		$guard->setValue( $this->projector, false );

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
