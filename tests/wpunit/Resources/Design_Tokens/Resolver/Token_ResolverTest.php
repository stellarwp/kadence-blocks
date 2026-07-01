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

	/**
	 * A reference-valued token exposes its immediate alias target (by id and by css-var) alongside the
	 * flattened literal; a raw-valued token exposes no target.
	 *
	 * @return void
	 */
	public function testItExposesTheImmediateAliasTargetForAReferenceValuedToken(): void {
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

		$resolved = $resolver->resolve_overrides( [] );

		// The reference-valued semantic carries its immediate target, the literal-valued primitive does not.
		$this->assertSame( 'primitive.color.brand.primary', $resolved->target( 'semantic.color.button-bg' ) );
		$this->assertNull( $resolved->target( 'primitive.color.brand.primary' ) );

		// The css-var projection reads a var() reference to the target's variable.
		$this->assertSame(
			'var(' . Css_Var::from_id( 'primitive.color.brand.primary' ) . ')',
			$resolved->projected_vars()[ Css_Var::from_id( 'semantic.color.button-bg' ) ]
		);

		// The literal is still produced for host-publishing surfaces.
		$this->assertSame( '#3182CE', $resolved->value( 'semantic.color.button-bg' ) );
	}

	/**
	 * Every link of a chain records its own immediate target — not the final leaf — so each declaration
	 * is a single var() hop and the cascade chains. The literal leaf records no target.
	 *
	 * @return void
	 */
	public function testItRecordsEachTokensImmediateTargetInAChain(): void {
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

		$resolved = $resolver->resolve_overrides( [] );

		$this->assertSame( 'primitive.color.b', $resolved->target( 'primitive.color.a' ) );
		$this->assertSame( 'primitive.color.c', $resolved->target( 'primitive.color.b' ) );
		$this->assertNull( $resolved->target( 'primitive.color.c' ) );
	}

	/**
	 * A composite token (a shadow whose color field is an alias) is not a top-level reference: its
	 * $value is an array, so it records no target and keeps its flattened literal.
	 *
	 * @return void
	 */
	public function testACompositeWithAnAliasFieldExposesNoTopLevelTarget(): void {
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

		$resolved = $resolver->resolve_overrides( [] );

		// Not a top-level reference (its $value is an array), so no target id is recorded...
		$this->assertNull( $resolved->target( 'semantic.shadow.card' ) );

		// ...and the host-facing literal still flattens the aliased color field.
		$this->assertSame( '0px 2px 8px 0px #1A202C', $resolved->value( 'semantic.shadow.card' ) );

		// But the css-var projection keeps the aliased color as a var() reference, so the shadow
		// color follows the primitive live. var() is valid anywhere in a value, shorthands included.
		$this->assertSame(
			'0px 2px 8px 0px var(' . Css_Var::from_id( 'primitive.color.ink' ) . ')',
			$resolved->projected_vars()[ Css_Var::from_id( 'semantic.shadow.card' ) ]
		);
	}

	/**
	 * A baseline alias overridden to a literal is "explicitly set": its effective $value is no longer an
	 * alias, so it exposes no target and emits the literal — the indirection only applies when unset.
	 *
	 * @return void
	 */
	public function testASemanticOverriddenToALiteralExposesNoTarget(): void {
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

		$resolved = $resolver->resolve_overrides(
			[
				'semantic' => [
					'color' => [
						'button-bg' => [
							'$type'  => 'color',
							'$value' => '#FF0000',
						],
					],
				],
			]
		);

		$this->assertNull( $resolved->target( 'semantic.color.button-bg' ) );
		$this->assertSame( '#FF0000', $resolved->value( 'semantic.color.button-bg' ) );
	}

	/**
	 * Overriding a baseline alias to a different alias retargets the indirection: the effective $value is
	 * still a reference, just to a new leaf.
	 *
	 * @return void
	 */
	public function testASemanticOverriddenToADifferentAliasRetargets(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'color' => [
						'brand'   => [
							'primary' => [
								'$type'  => 'color',
								'$value' => '#3182CE',
							],
						],
						'neutral' => [
							'900' => [
								'$type'  => 'color',
								'$value' => '#1A202C',
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

		$resolved = $resolver->resolve_overrides(
			[
				'semantic' => [
					'color' => [
						'button-bg' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.neutral.900}',
						],
					],
				],
			]
		);

		$this->assertSame( 'primitive.color.neutral.900', $resolved->target( 'semantic.color.button-bg' ) );
		$this->assertSame( '#1A202C', $resolved->value( 'semantic.color.button-bg' ) );
	}

	/**
	 * Overriding the primitive a semantic alias points at leaves the alias untouched: the semantic keeps
	 * the same target id while its resolved literal reflects the new primitive value — this is what lets
	 * a palette edit follow live through the var() chain with no re-targeting.
	 *
	 * @return void
	 */
	public function testOverridingTheTargetPrimitiveKeepsTheSameTargetButNewValue(): void {
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

		$resolved = $resolver->resolve_overrides(
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
		);

		$this->assertSame( 'primitive.color.brand.primary', $resolved->target( 'semantic.color.button-bg' ) );
		$this->assertSame( '#000000', $resolved->value( 'semantic.color.button-bg' ) );
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

		$this->assertSame( '#3633e1', $before->value( 'semantic.color.button-bg' ) );

		$store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'button' => [
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

	/**
	 * resolve_namespaced() namespaces every projected css-var name under the set slug, and keeps a set's
	 * alias chain inside the set: a reference reads var(--kb-token--<slug>--<target>), not the canonical
	 * target, so switching the active set never leaks one set's primitive into another.
	 *
	 * @return void
	 */
	public function testResolveNamespacedNamespacesTheProjectedNamesAndKeepsTheChainInSet(): void {
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

		// A slug with no stored row resolves the baseline directly, namespaced under that slug.
		$projected = $resolver->resolve_namespaced( 'dark' )->projected_vars();

		// The leaf primitive carries the literal under its namespaced name.
		$this->assertSame( '#3182CE', $projected[ Css_Var::from_id( 'primitive.color.brand.primary', 'dark' ) ] );

		// The semantic alias points at the namespaced primitive, so the chain stays inside the set.
		$this->assertSame(
			'var(' . Css_Var::from_id( 'primitive.color.brand.primary', 'dark' ) . ')',
			$projected[ Css_Var::from_id( 'semantic.color.button-bg', 'dark' ) ]
		);

		// The canonical (un-namespaced) names are absent from a namespaced projection.
		$this->assertArrayNotHasKey( Css_Var::from_id( 'semantic.color.button-bg' ), $projected );
	}

	/**
	 * A composite's embedded var() reference is namespaced too, field by field, so a namespaced shadow's
	 * aliased color follows that set's primitive.
	 *
	 * @return void
	 */
	public function testResolveNamespacedNamespacesACompositeEmbeddedVar(): void {
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

		$projected = $resolver->resolve_namespaced( 'dark' )->projected_vars();

		$this->assertSame(
			'0px 2px 8px 0px var(' . Css_Var::from_id( 'primitive.color.ink', 'dark' ) . ')',
			$projected[ Css_Var::from_id( 'semantic.shadow.card', 'dark' ) ]
		);
	}

	/**
	 * The id-keyed literal map is namespace-invariant: by_id() keys stay canonical dot-paths and its
	 * values stay the flattened literals, so host surfaces and the canonical token-id list read it
	 * unchanged whether resolved canonically or namespaced.
	 *
	 * @return void
	 */
	public function testResolveNamespacedLeavesByIdCanonicalAndLiteral(): void {
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

		$by_id = $resolver->resolve_namespaced( 'dark' )->by_id();

		// Keyed on the canonical dot-path, with the flattened literal — identical to a canonical resolve.
		$this->assertArrayHasKey( 'semantic.color.button-bg', $by_id );
		$this->assertSame( '#3182CE', $by_id['semantic.color.button-bg'] );
	}

	/**
	 * The namespaced form caches under its own key (resolved_tokens_ns_<slug>_<version>), distinct from the
	 * canonical resolve() key, so the two never collide.
	 *
	 * @return void
	 */
	public function testResolveNamespacedPopulatesItsOwnObjectCacheKey(): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );
		// Fresh instance so the L1 memo is empty — the container singleton may already be warm.
		$resolver = new Token_Resolver(
			$store,
			$this->container->get( Effective_Document::class ),
			$this->container->get( Css_Renderer::class )
		);

		$version   = $store->get_version();
		$cache_key = 'resolved_tokens_ns_default_' . $version;

		wp_cache_delete( $cache_key, 'kb_design_tokens' );

		$result = $resolver->resolve_namespaced( 'default' );

		$this->assertInstanceOf( Resolved_Tokens::class, $result );

		$cached = wp_cache_get( $cache_key, 'kb_design_tokens', false, $found );

		$this->assertTrue( $found );
		$this->assertInstanceOf( Resolved_Tokens::class, $cached );
	}

	public function testResolveReadsTheStoredOverridesAndInvalidatesOnVersionBump(): void {
		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		// Empty store: button-bg resolves through the shipped baseline to brand.button (#3633e1).
		$this->assertSame( '#3633e1', $resolver->resolve()->value( 'semantic.color.button-bg' ) );

		// Override brand.button; the write bumps the store version, invalidating the per-request memo.
		$store->save_document(
			(string) wp_json_encode(
				[
					'primitive' => [
						'color' => [
							'brand' => [
								'button' => [
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
