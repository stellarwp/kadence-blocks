<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Feed_Assembler;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Presets;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Responsive_Feed;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Covers Feed_Assembler in isolation — the pipeline both the Localizer and Feed_Controller share
 * to turn a slug into the feed payload. Localizer_Test and Feed_ControllerTest additionally pin
 * that both of those callers agree on the shape this class produces.
 */
final class Feed_AssemblerTest extends TestCase {

	private Feed_Assembler $assembler;

	/**
	 * Boots a container-resolved assembler before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->assembler = $this->container->get( Feed_Assembler::class );
	}

	/**
	 * Clears the resolver memo so values resolved here do not leak into later test classes.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );

		parent::tearDown();
	}

	/**
	 * The feed names the untitled default library, so the app's library selector can label it on first
	 * paint without carrying a default of its own.
	 *
	 * @return void
	 */
	public function testForSlugCarriesTheDefaultTitleForTheUntitledDefaultLibrary(): void {
		$feed = $this->assembler->for_slug( Token_Store::default_slug() );

		$this->assertSame( Token_Store::default_title(), $feed['title'] );
	}

	/**
	 * A stored title wins over the default library's standing name, matching what the REST list serves.
	 *
	 * @return void
	 */
	public function testForSlugPrefersAStoredTitleOverTheDefaultTitle(): void {
		$this->container->get( Token_Store::class )->save_document( '{}', Token_Store::default_slug(), 'Acme Brand' );

		$feed = $this->assembler->for_slug( Token_Store::default_slug() );

		$this->assertSame( 'Acme Brand', $feed['title'] );
	}

	/**
	 * A non-default library with no stored title carries an empty one — the default name belongs to the
	 * default library alone, never to any library that happens to be untitled.
	 *
	 * @return void
	 */
	public function testForSlugLeavesAnUntitledNonDefaultLibraryUnnamed(): void {
		$this->container->get( Token_Store::class )->save_document( '{}', 'brand-a' );

		$feed = $this->assembler->for_slug( 'brand-a' );

		$this->assertSame( '', $feed['title'] );
	}

	/**
	 * A resolvable library yields every key the Builder emits, populated from the given slug.
	 *
	 * @return void
	 */
	public function testForSlugAssemblesTheFullPayloadForAResolvableLibrary(): void {
		$feed = $this->assembler->for_slug( Token_Store::default_slug() );

		$this->assertTrue( $feed['active'] );
		$this->assertTrue( $feed['resolved'] );
		$this->assertSame( Token_Store::default_slug(), $feed['slug'] );
		$this->assertIsString( $feed['version'] );
		$this->assertArrayHasKey( 'groups', $feed['schema'] );
		$this->assertSame( '#3633e1', $feed['values']['semantic.color.button-primary-bg'] );
		$this->assertIsArray( $feed['presets'] );
		$this->assertIsArray( $feed['presetNav'] );
		$this->assertIsArray( $feed['responsive'] );
		$this->assertSame( 'kb-design-tokens/v1', $feed['rest']['namespace'] );
		$this->assertNotEmpty( $feed['rest']['nonce'] );
		$this->assertSame( esc_url_raw( rest_url() ), $feed['rest']['root'] );
	}

	/**
	 * A named, non-default library assembles its own values and reports its own slug, distinct
	 * from the default library.
	 *
	 * @return void
	 */
	public function testForSlugAssemblesANamedLibraryDistinctFromTheDefault(): void {
		$doc = (string) wp_json_encode(
			[
				'semantic' => [
					'color' => [
						'button-primary-bg' => [
							'$type'  => 'color',
							'$value' => '#0f7a3d',
						],
					],
				],
			]
		);

		$this->container->get( Token_Store::class )->save_document( $doc, 'brand-b' );

		$feed = $this->assembler->for_slug( 'brand-b' );

		$this->assertSame( 'brand-b', $feed['slug'] );
		$this->assertSame( '#0f7a3d', $feed['values']['semantic.color.button-primary-bg'] );
	}

	/**
	 * A store that cannot be resolved (an alias cycle) yields an empty, resolved:false payload
	 * rather than throwing, while still passing through structure, version, slug and the REST
	 * descriptor.
	 *
	 * @return void
	 */
	public function testForSlugFailsOpenWhenTheStoreIsUnresolvable(): void {
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
			new Css_Renderer(),
			$this->container->get( Effective_Palettes::class ),
			$this->container->get( Mutator::class )
		);

		$assembler = new Feed_Assembler(
			$cyclic,
			$this->container->get( Token_Store::class ),
			$this->container->get( Presets::class ),
			$this->container->get( Builder::class ),
			$this->container->get( Responsive_Feed::class )
		);

		$feed = $assembler->for_slug( Token_Store::default_slug() );

		$this->assertTrue( $feed['active'], 'Structure still renders.' );
		$this->assertFalse( $feed['resolved'], 'Values could not be resolved.' );
		$this->assertSame( [], $feed['values'] );
		$this->assertSame( [], $feed['presets'] );
		$this->assertSame( [], $feed['responsive'] );
		$this->assertSame( Token_Store::default_slug(), $feed['slug'] );
		$this->assertNotEmpty( $feed['rest']['nonce'] );
	}
}
