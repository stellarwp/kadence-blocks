<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Localizer;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Variants;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class LocalizerTest extends TestCase {

	private const HANDLE = 'admin-kadence-home';

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
	}

	protected function tearDown(): void {
		$this->registry->activate();

		if ( wp_script_is( self::HANDLE, 'registered' ) ) {
			wp_dequeue_script( self::HANDLE );
			wp_deregister_script( self::HANDLE );
		}

		// Clear the resolver memo so values resolved here do not leak into later test classes.
		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );

		parent::tearDown();
	}

	private function enqueue_dashboard(): void {
		wp_register_script( self::HANDLE, 'https://example.test/admin-kadence-home.js', [], '1', true );
		wp_enqueue_script( self::HANDLE );
	}

	/**
	 * The decoded feed attached to the dashboard handle, or null when none was attached.
	 *
	 * @return array<string, mixed>|null
	 */
	private function attached_feed(): ?array {
		$data = wp_scripts()->get_data( self::HANDLE, 'before' );

		if ( ! is_array( $data ) ) {
			return null;
		}

		$inline = implode( "\n", array_filter( $data, 'is_string' ) );

		if ( strpos( $inline, 'window.kadenceDesignTokens' ) === false ) {
			return null;
		}

		$json    = (string) preg_replace( '/^.*?window\.kadenceDesignTokens\s*=\s*(.*);\s*$/s', '$1', $inline );
		$decoded = json_decode( $json, true );

		return is_array( $decoded ) ? $decoded : null;
	}

	private function localizer(): Localizer {
		return $this->container->get( Localizer::class );
	}

	public function testItAttachesTheFeedWithSchemaValuesAndRest(): void {
		$this->enqueue_dashboard();

		$this->localizer()->localize();

		$feed = $this->attached_feed();
		$this->assertNotNull( $feed, 'A feed should be attached on the dashboard page.' );

		$this->assertTrue( $feed['active'] );
		$this->assertTrue( $feed['resolved'] );

		// Structure: the shipped button-bg token reaches the schema.
		$ids = [];
		foreach ( $feed['schema']['groups'] as $entries ) {
			$ids = array_merge( $ids, array_column( $entries, 'id' ) );
		}
		$this->assertContains( 'semantic.color.button-bg', $ids );

		// Values: keyed identically to the schema, the resolved hex.
		$this->assertSame( '#3182CE', $feed['values']['semantic.color.button-bg'] );

		// REST descriptor.
		$this->assertSame( 'kb-design-tokens/v1', $feed['rest']['namespace'] );
		$this->assertNotEmpty( $feed['rest']['nonce'] );
		$this->assertSame( esc_url_raw( rest_url() ), $feed['rest']['root'] );
	}

	public function testItAttachesNothingWhenTheDashboardIsNotOnThePage(): void {
		// No enqueue.
		$this->localizer()->localize();

		$this->assertNull( $this->attached_feed() );
	}

	public function testFailClosedWhenTheRegistryIsInactive(): void {
		$this->registry->deactivate();
		$this->enqueue_dashboard();

		$this->localizer()->localize();

		$feed = $this->attached_feed();
		$this->assertNotNull( $feed );
		$this->assertFalse( $feed['active'] );
		$this->assertSame( [ 'groups' => [] ], $feed['schema'] );
		$this->assertSame( [], $feed['values'] );
	}

	public function testFailOpenWhenTheStoreIsUnresolvable(): void {
		$this->enqueue_dashboard();

		// A resolver over a baseline with an alias cycle throws on resolve(); the Localizer must catch it.
		$cyclic = new Token_Resolver(
			$this->container->get( Token_Store::class ),
			new Effective_Document(
				new Fake_Baseline_Document(
					[
						'primitive' => [
							'color' => [
								'a' => [
									'$type'  => 'color',
									'$value' => '{primitive.color.b}',
								],
								'b' => [
									'$type'  => 'color',
									'$value' => '{primitive.color.a}',
								],
							],
						],
					]
				)
			),
			new Css_Renderer()
		);

		$localizer = new Localizer(
			$cyclic,
			$this->container->get( Token_Store::class ),
			$this->container->get( Variants::class ),
			$this->container->get( Builder::class )
		);

		$localizer->localize();

		$feed = $this->attached_feed();
		$this->assertNotNull( $feed );
		$this->assertTrue( $feed['active'], 'Structure still renders.' );
		$this->assertFalse( $feed['resolved'], 'Values could not be resolved.' );
		$this->assertSame( [], $feed['values'] );
		$this->assertSame( [], $feed['variants'] );
		$this->assertArrayHasKey( 'groups', $feed['schema'] );
	}

	public function testTypeFidelityOfScalars(): void {
		$this->enqueue_dashboard();

		$this->localizer()->localize();

		$feed = $this->attached_feed();
		$this->assertNotNull( $feed );

		// Guards the wp_add_inline_script + wp_json_encode choice over wp_localize_script.
		$this->assertIsBool( $feed['active'] );
		$this->assertIsBool( $feed['resolved'] );
		$this->assertIsString( $feed['version'] );
	}

	public function testTheModuleWiresTheLocalizerOntoAdminHead(): void {
		$this->assertInstanceOf( Localizer::class, $this->container->get( Localizer::class ) );
		$this->assertNotFalse( has_action( 'admin_head' ) );
	}
}
