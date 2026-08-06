<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Feed_Assembler;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Presets;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Responsive_Feed;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Label_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Order_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
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
			$this->container->get( Responsive_Feed::class ),
			$this->container->get( Token_Label_Index::class ),
			$this->container->get( Token_Order_Index::class )
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

	/**
	 * A stored tokenLabels override reaches the assembled schema's `label` / `labelOverridden`
	 * fields — the single place both the Localizer and the REST feed controller read from, so a
	 * stored override cannot reach one caller and not the other.
	 *
	 * @return void
	 */
	public function testForSlugAppliesStoredTokenLabelOverrides(): void {
		$doc = (string) wp_json_encode(
			[
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenLabels' => [
							'semantic.color.button-primary-bg' => 'Cozy Button',
						],
					],
				],
			]
		);

		$this->container->get( Token_Store::class )->save_document( $doc );

		$feed = $this->assembler->for_slug( Token_Store::default_slug() );

		$found = null;

		foreach ( $feed['schema']['groups'] as $entries ) {
			foreach ( $entries as $entry ) {
				if ( ( $entry['id'] ?? '' ) === 'semantic.color.button-primary-bg' ) {
					$found = $entry;
					break 2;
				}
			}
		}

		$this->assertNotNull( $found, 'The overridden token must appear in the assembled schema.' );
		$this->assertSame( 'Cozy Button', $found['label'] );
		$this->assertTrue( $found['labelOverridden'] );
	}

	/**
	 * A stored tokenOrder entry surfaces in for_slug()'s assembled schema sequence — the wiring
	 * that hands the decoded flat order list into Builder::build(), not the pure merge itself
	 * (covered in BuilderTest).
	 *
	 * @return void
	 */
	public function testForSlugAppliesStoredTokenOrder(): void {
		$schema = $this->container->get( Token_Registry::class )->to_ui_schema();
		$groups = array_keys( $schema['groups'] );

		$this->assertNotEmpty( $groups, 'The registry fixture must declare at least one group to reorder.' );

		$group = $groups[0];
		$ids   = array_column( $schema['groups'][ $group ], 'id' );

		$this->assertGreaterThan( 1, count( $ids ), 'The group must carry at least two tokens to observe a permutation.' );

		$reversed = array_reverse( $ids );

		$doc = (string) wp_json_encode(
			[
				'$extensions' => [
					'com.kadence.designTokens' => [
						'tokenOrder' => $reversed,
					],
				],
			]
		);

		$this->container->get( Token_Store::class )->save_document( $doc );

		$feed = $this->assembler->for_slug( Token_Store::default_slug() );

		$this->assertSame( $reversed, array_column( $feed['schema']['groups'][ $group ], 'id' ) );
	}
}
