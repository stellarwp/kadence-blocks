<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
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
			new Css_Renderer(),
			$this->container->get( Effective_Palettes::class ),
			$this->container->get( Mutator::class )
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

	/**
	 * effective_document() returns the baseline-merged document with a stored leaf's authored $extensions
	 * intact, so the responsive feed and the REST resolved read can recover the authored responsive / clamp
	 * shape the flat resolved maps drop.
	 *
	 * @return void
	 */
	public function testEffectiveDocumentPreservesAStoredLeafsAuthoredExtensions(): void {
		$resolver = $this->resolver_for(
			[
				'semantic' => [
					'font-size' => [
						'control' => [
							'$type'  => 'dimension',
							'$value' => '1rem',
						],
					],
				],
			]
		);

		$this->container->get( Token_Store::class )->save_document(
			'{"semantic":{"font-size":{"control":{"$type":"dimension","$value":"1.125rem",'
			. '"$extensions":{"com.kadence.designTokens":{"responsive":{"tablet":"1.0625rem","mobile":"1rem"}}}}}}}'
		);

		$leaf = $resolver->effective_document( Token_Store::default_slug() )['semantic']['font-size']['control'];

		$this->assertSame( '1.125rem', $leaf['$value'] );
		$this->assertSame(
			[
				'tablet' => '1.0625rem',
				'mobile' => '1rem',
			],
			$leaf['$extensions']['com.kadence.designTokens']['responsive']
		);
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
			$this->container->get( Css_Renderer::class ),
			$this->container->get( Effective_Palettes::class ),
			$this->container->get( Mutator::class )
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
			$this->container->get( Css_Renderer::class ),
			$this->container->get( Effective_Palettes::class ),
			$this->container->get( Mutator::class )
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

		$this->assertSame( '#3633e1', $before->value( 'semantic.color.button-primary-bg' ) );

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

		$this->assertSame( '#FF0000', $after->value( 'semantic.color.button-primary-bg' ) );
	}

	/**
	 * resolve() reads stored overrides and invalidates the per-request memo on a version bump.
	 *
	 * @return void
	 */
	public function testResolveReadsTheStoredOverridesAndInvalidatesOnVersionBump(): void {
		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		// Empty store: button-primary-bg resolves through the shipped baseline to brand.button (#3633e1).
		$this->assertSame( '#3633e1', $resolver->resolve()->value( 'semantic.color.button-primary-bg' ) );

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

		$this->assertSame( '#000000', $resolver->resolve()->value( 'semantic.color.button-primary-bg' ) );
	}

	/**
	 * The set's `$current` color palette re-tints the color tokens at resolve time, and every semantic color
	 * that aliases a re-tinted primitive follows for free — while a non-color token is byte-identical.
	 *
	 * @return void
	 */
	public function testTheCurrentPaletteReTintsColorsAndCascadesToSemantics(): void {
		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		// Baseline: the default palette equals the baseline, so brand.primary and the link that aliases it
		// resolve to the shipped brand color; a spacing token to its shipped length.
		$this->assertSame( '#3182CE', $resolver->resolve()->value( 'primitive.color.brand.primary' ) );
		$this->assertSame( '#3182CE', $resolver->resolve()->value( 'semantic.color.link' ) );
		$spacing = $resolver->resolve()->value( 'semantic.spacing.block' );

		// Switch the set to the shipped "sunset" palette by writing $current; the write bumps the version.
		$store->save_document(
			(string) wp_json_encode(
				[ '$extensions' => [ 'com.kadence.designTokens' => [ 'colorPalettes' => [ '$current' => 'sunset' ] ] ] ]
			)
		);

		$resolved = $resolver->resolve();

		// The brand primitive and the semantic link that aliases it both re-tint to sunset's color.
		$this->assertSame( '#DD6B20', $resolved->value( 'primitive.color.brand.primary' ) );
		$this->assertSame( '#DD6B20', $resolved->value( 'semantic.color.link' ) );

		// A non-color token is byte-identical across the palette switch.
		$this->assertSame( $spacing, $resolved->value( 'semantic.spacing.block' ) );
	}

	/**
	 * Switching the set's `$current` palette back to "default" restores the baseline colors, proving the
	 * overlay is non-destructive and reversible.
	 *
	 * @return void
	 */
	public function testSwitchingBackToTheDefaultPaletteRestoresBaselineColors(): void {
		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		$store->save_document(
			(string) wp_json_encode(
				[ '$extensions' => [ 'com.kadence.designTokens' => [ 'colorPalettes' => [ '$current' => 'sunset' ] ] ] ]
			)
		);
		$this->assertSame( '#DD6B20', $resolver->resolve()->value( 'primitive.color.brand.primary' ) );

		$store->save_document(
			(string) wp_json_encode(
				[ '$extensions' => [ 'com.kadence.designTokens' => [ 'colorPalettes' => [ '$current' => 'default' ] ] ] ]
			)
		);

		$this->assertSame( '#3182CE', $resolver->resolve()->value( 'primitive.color.brand.primary' ) );
	}

	/**
	 * A stepped responsive dimension keeps its flat base value and adds a per-breakpoint override that the
	 * projection redeclares: the base is in by_id / by_var, and each breakpoint override is exposed both as a
	 * projected var map and as a literal via value_at().
	 *
	 * @return void
	 */
	public function testItExposesPerBreakpointResponsiveOverrides(): void {
		$resolver = $this->resolver_for(
			[
				'semantic' => [
					'font-size' => [
						'control' => [
							'$type'       => 'dimension',
							'$value'      => '1.125rem',
							'$extensions' => [
								'com.kadence.designTokens' => [
									'responsive' => [
										'tablet' => '1rem',
										'mobile' => '0.9rem',
									],
								],
							],
						],
					],
				],
			]
		);

		$resolved = $resolver->resolve_overrides( [] );
		$var      = Css_Var::from_id( 'semantic.font-size.control' );

		$this->assertSame( '1.125rem', $resolved->value( 'semantic.font-size.control' ) );
		$this->assertSame( '1.125rem', $resolved->projected_vars()[ $var ] );
		$this->assertSame(
			[
				'tablet' => '1rem',
				'mobile' => '0.9rem',
			],
			$resolved->projected_responsive()[ $var ]
		);
		$this->assertSame( '1rem', $resolved->value_at( 'semantic.font-size.control', 'tablet' ) );
		$this->assertSame( '0.9rem', $resolved->value_at( 'semantic.font-size.control', 'mobile' ) );
	}

	/**
	 * A responsive breakpoint slot may itself be an alias: the literal per-breakpoint value flattens to the
	 * referenced token's value, while the projected form preserves the indirection as a var() reference.
	 *
	 * @return void
	 */
	public function testAResponsiveSlotCanAlias(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'dimension' => [
						'font-size' => [
							'mobile' => [
								'$type'  => 'dimension',
								'$value' => '0.875rem',
							],
						],
					],
				],
				'semantic'  => [
					'font-size' => [
						'control' => [
							'$type'       => 'dimension',
							'$value'      => '1.125rem',
							'$extensions' => [
								'com.kadence.designTokens' => [
									'responsive' => [
										'mobile' => '{primitive.dimension.font-size.mobile}',
									],
								],
							],
						],
					],
				],
			]
		);

		$resolved = $resolver->resolve_overrides( [] );
		$var      = Css_Var::from_id( 'semantic.font-size.control' );

		$this->assertSame( '0.875rem', $resolved->value_at( 'semantic.font-size.control', 'mobile' ) );
		$this->assertSame(
			'var(' . Css_Var::from_id( 'primitive.dimension.font-size.mobile' ) . ')',
			$resolved->projected_responsive()[ $var ]['mobile']
		);
	}

	/**
	 * A structured clamp renders to a clamp(min, preferred, max) string for both the literal and projected
	 * forms, overriding the flat base $value, and produces no per-breakpoint media-query overrides.
	 *
	 * @return void
	 */
	public function testItRendersAStructuredClampIntoTheValue(): void {
		$resolver = $this->resolver_for(
			[
				'semantic' => [
					'font-size' => [
						'control' => [
							'$type'       => 'dimension',
							'$value'      => '1.125rem',
							'$extensions' => [
								'com.kadence.designTokens' => [
									'clamp' => [
										'min'       => '1.1rem',
										'preferred' => '0.995rem + 0.326vw',
										'max'       => '1.25rem',
									],
								],
							],
						],
					],
				],
			]
		);

		$resolved = $resolver->resolve_overrides( [] );
		$var      = Css_Var::from_id( 'semantic.font-size.control' );

		$this->assertSame( 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)', $resolved->value( 'semantic.font-size.control' ) );
		$this->assertSame( 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)', $resolved->projected_vars()[ $var ] );
		$this->assertSame( [], $resolved->projected_responsive() );
	}

	/**
	 * A clamp bound slot may itself be an alias: the literal clamp flattens the slot to the referenced value,
	 * while the projected clamp preserves the indirection as a var() reference.
	 *
	 * @return void
	 */
	public function testAClampSlotCanAlias(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'dimension' => [
						'font-size' => [
							'min' => [
								'$type'  => 'dimension',
								'$value' => '1.1rem',
							],
						],
					],
				],
				'semantic'  => [
					'font-size' => [
						'control' => [
							'$type'       => 'dimension',
							'$value'      => '1.125rem',
							'$extensions' => [
								'com.kadence.designTokens' => [
									'clamp' => [
										'min'       => '{primitive.dimension.font-size.min}',
										'preferred' => '0.995rem + 0.326vw',
										'max'       => '1.25rem',
									],
								],
							],
						],
					],
				],
			]
		);

		$resolved = $resolver->resolve_overrides( [] );
		$var      = Css_Var::from_id( 'semantic.font-size.control' );

		$this->assertSame( 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)', $resolved->value( 'semantic.font-size.control' ) );
		$this->assertSame(
			'clamp(var(' . Css_Var::from_id( 'primitive.dimension.font-size.min' ) . '), 0.995rem + 0.326vw, 1.25rem)',
			$resolved->projected_vars()[ $var ]
		);
	}

	/**
	 * A flat token (no responsive / clamp shape) resolves exactly as before: no per-breakpoint overrides and
	 * null value_at() at every breakpoint, so enabling responsive elsewhere never perturbs a flat token.
	 *
	 * @return void
	 */
	public function testAFlatTokenHasNoResponsiveProjection(): void {
		$resolver = $this->resolver_for(
			[
				'semantic' => [
					'font-size' => [
						'control' => [
							'$type'  => 'dimension',
							'$value' => '1.125rem',
						],
					],
				],
			]
		);

		$resolved = $resolver->resolve_overrides( [] );

		$this->assertSame( '1.125rem', $resolved->value( 'semantic.font-size.control' ) );
		$this->assertSame( [], $resolved->projected_responsive() );
		$this->assertNull( $resolved->value_at( 'semantic.font-size.control', 'tablet' ) );
	}
}
