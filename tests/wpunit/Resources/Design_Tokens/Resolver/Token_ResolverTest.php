<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class Token_ResolverTest extends TestCase {

	/**
	 * Build a resolver over a fully-controlled baseline. The store is never touched by
	 * resolve_overrides(), so we can exercise the full resolution + render path without the database.
	 *
	 * @param array<string, mixed> $baseline
	 */
	private function resolver_for( array $baseline ): Token_Resolver {
		return new Token_Resolver(
			$this->container->get( Token_Store::class ),
			new Effective_Document( new Fake_Baseline_Document( $baseline ) ),
			new Css_Renderer()
		);
	}

	public function testItFlattensAnAliasToTheReferencedLiteral(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'primary' => [
								'$type'  => 'color',
								'$value' => '#3182CE',
							],
						],
					],
				],
				'semantic'  => [
					'color' => [
						'button-bg' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.brand.primary}',
						],
					],
				],
			]
		);

		$by_id = $resolver->resolve_overrides( [] )->by_id();

		$this->assertSame( '#3182CE', $by_id['semantic.color.button-bg'] );
		$this->assertSame( '#3182CE', $by_id['primitive.color.brand.primary'] );
	}

	public function testItCollapsesAMultiHopAliasChain(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'color' => [
						'c' => [
							'$type'  => 'color',
							'$value' => '#abcdef',
						],
						'b' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.c}',
						],
						'a' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.b}',
						],
					],
				],
			]
		);

		$this->assertSame( '#abcdef', $resolver->resolve_overrides( [] )->value( 'primitive.color.a' ) );
	}

	public function testItResolvesAnAliasNestedInsideACompositeShadow(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'color' => [
						'ink' => [
							'$type'  => 'color',
							'$value' => '#1A202C',
						],
					],
				],
				'semantic'  => [
					'shadow' => [
						'card' => [
							'$type'  => 'shadow',
							'$value' => [
								'color'   => '{primitive.color.ink}',
								'offsetX' => '0px',
								'offsetY' => '2px',
								'blur'    => '8px',
								'spread'  => '0px',
							],
						],
					],
				],
			]
		);

		$this->assertSame( '0px 2px 8px 0px #1A202C', $resolver->resolve_overrides( [] )->value( 'semantic.shadow.card' ) );
	}

	public function testFontFamilyListsRenderCommaSeparated(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'fontFamily' => [
						'sans' => [
							'$type'  => 'fontFamily',
							'$value' => [ 'Inter', 'system-ui', 'sans-serif' ],
						],
					],
				],
			]
		);

		$this->assertSame(
			'Inter, system-ui, sans-serif',
			$resolver->resolve_overrides( [] )->value( 'primitive.fontFamily.sans' )
		);
	}

	public function testCssVarKeysMatchTheCanonicalDerivation(): void {
		$resolver = $this->resolver_for(
			[
				'semantic' => [
					'color' => [
						'button-bg' => [
							'$type'  => 'color',
							'$value' => '#3182CE',
						],
					],
				],
			]
		);

		$by_var = $resolver->resolve_overrides( [] )->by_var();
		$var    = Css_Var::from_id( 'semantic.color.button-bg' );

		$this->assertArrayHasKey( $var, $by_var );
		$this->assertSame( '#3182CE', $by_var[ $var ] );
	}

	public function testItThrowsOnADanglingAlias(): void {
		$resolver = $this->resolver_for(
			[
				'semantic' => [
					'color' => [
						'x' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.missing}',
						],
					],
				],
			]
		);

		$this->expectException( Dangling_Alias_Exception::class );

		$resolver->resolve_overrides( [] );
	}

	public function testItThrowsOnADanglingAliasNestedInsideAComposite(): void {
		$resolver = $this->resolver_for(
			[
				'semantic' => [
					'shadow' => [
						'card' => [
							'$type'  => 'shadow',
							'$value' => [
								'color'   => '{primitive.color.missing}',
								'offsetX' => '0px',
								'offsetY' => '2px',
								'blur'    => '8px',
								'spread'  => '0px',
							],
						],
					],
				],
			]
		);

		$this->expectException( Dangling_Alias_Exception::class );

		$resolver->resolve_overrides( [] );
	}

	public function testItThrowsOnAnAliasCycle(): void {
		$resolver = $this->resolver_for(
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
		);

		$this->expectException( Alias_Cycle_Exception::class );

		$resolver->resolve_overrides( [] );
	}

	public function testDryRunOverridesWinOverTheBaseline(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'primary' => [
								'$type'  => 'color',
								'$value' => '#3182CE',
							],
						],
					],
				],
				'semantic'  => [
					'color' => [
						'button-bg' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.brand.primary}',
						],
					],
				],
			]
		);

		$by_id = $resolver->resolve_overrides(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'primary' => [
								'$type'  => 'color',
								'$value' => '#000000',
							],
						],
					],
				],
			]
		)->by_id();

		// The override flows through the alias.
		$this->assertSame( '#000000', $by_id['semantic.color.button-bg'] );
	}

	public function testResolvePopulatesObjectCacheOnColdPath(): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );
		// Fresh instance so the L1 memo is empty — the container singleton may already be warm from another
		// test, in which case resolve() returns the memo and never reaches the L2 write this asserts.
		$resolver = new Token_Resolver(
			$store,
			$this->container->get( Effective_Document::class ),
			$this->container->get( Css_Renderer::class )
		);

		$version   = $store->get_version();
		$cache_key = 'resolved_tokens_default_' . $version;

		wp_cache_delete( $cache_key, 'kb_design_tokens' );

		$result = $resolver->resolve();

		$this->assertInstanceOf( Resolved_Tokens::class, $result );

		$cached = wp_cache_get( $cache_key, 'kb_design_tokens', false, $found );

		$this->assertTrue( $found );
		$this->assertInstanceOf( Resolved_Tokens::class, $cached );
		$this->assertSame( $result->by_id(), $cached->by_id() );
	}

	public function testResolveReturnsObjectCacheHitWithoutRebuildingDocument(): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );
		// Fresh instance so the L1 memo is empty — the container singleton may already be warm.
		$resolver = new Token_Resolver(
			$store,
			$this->container->get( Effective_Document::class ),
			$this->container->get( Css_Renderer::class )
		);

		$version   = $store->get_version();
		$cache_key = 'resolved_tokens_default_' . $version;
		$sentinel  = new Resolved_Tokens(
			[ 'sentinel.token' => '#sentinel' ],
			[ '--kb-token--sentinel--token' => '#sentinel' ]
		);
		wp_cache_set( $cache_key, $sentinel, 'kb_design_tokens' );

		$result = $resolver->resolve();

		$this->assertSame( '#sentinel', $result->by_id()['sentinel.token'] ?? null );
	}

	public function testVersionBumpInvalidatesObjectCacheImplicitly(): void {
		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		$before = $resolver->resolve();

		$this->assertSame( '#3182CE', $before->value( 'semantic.color.button-bg' ) );

		$store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'primary' => [
									'$type'  => 'color',
									'$value' => '#FF0000',
								],
							],
						],
					],
				]
			)
		);

		$after = $resolver->resolve();

		$this->assertSame( '#FF0000', $after->value( 'semantic.color.button-bg' ) );
	}

	public function testResolveReadsTheStoredOverridesAndInvalidatesOnVersionBump(): void {
		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		// Empty store: button-bg resolves through the shipped baseline to brand.primary (#3182CE).
		$this->assertSame( '#3182CE', $resolver->resolve()->value( 'semantic.color.button-bg' ) );

		// Override brand.primary; the write bumps the store version, invalidating the per-request memo.
		$store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'primary' => [
									'$type'  => 'color',
									'$value' => '#000000',
								],
							],
						],
					],
				]
			)
		);

		$this->assertSame( '#000000', $resolver->resolve()->value( 'semantic.color.button-bg' ) );
	}
}
