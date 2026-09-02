<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Confirms that `semantic.icon-size.default` and `semantic.color.icon` resolve through the existing
 * dimension/color alias pass-through in the Resolver with zero bespoke renderer code: `icon-size` is a
 * plain `dimension` token, the same family as spacing/radius, and `semantic.color.icon` is a plain `color`
 * token like every other semantic color alias.
 */
final class Icon_Size_ResolutionTest extends TestCase {

	/**
	 * Build a resolver over a fully-controlled baseline, mirroring Token_ResolverTest's own helper so the
	 * resolution path exercised here is identical to the one every other token type already relies on.
	 *
	 * @param array<string, mixed> $baseline
	 *
	 * @return Token_Resolver
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

	/**
	 * `semantic.icon-size.default` is a `dimension` alias to `primitive.dimension.icon-size.md`, resolving
	 * to a plain CSS length with no icon-specific renderer involved — the same alias-flattening every other
	 * dimension token (radius, spacing) already goes through.
	 *
	 * @return void
	 */
	public function testIconSizeDefaultResolvesThroughTheDimensionAliasChain(): void {
		$resolver = $this->resolver_for(
			[
				'primitive' => [
					'dimension' => [
						'icon-size' => [
							'md' => [
								'$type'  => 'dimension',
								'$value' => '1.5rem',
							],
						],
					],
				],
				'semantic'  => [
					'icon-size' => [
						'default' => [
							'$type'  => 'dimension',
							'$value' => '{primitive.dimension.icon-size.md}',
						],
					],
				],
			]
		);

		$resolved = $resolver->resolve_overrides( [] );

		$this->assertSame( '1.5rem', $resolved->value( 'semantic.icon-size.default' ) );
		$this->assertSame( 'primitive.dimension.icon-size.md', $resolved->target( 'semantic.icon-size.default' ) );
		$this->assertSame(
			'var(' . Css_Var::from_id( 'primitive.dimension.icon-size.md' ) . ')',
			$resolved->projected_vars()[ Css_Var::from_id( 'semantic.icon-size.default' ) ]
		);
	}

	/**
	 * `semantic.color.icon` is a `color` alias to `primitive.color.brand.primary`, resolving to a plain hex
	 * string through the same alias-flattening every other semantic color already goes through.
	 *
	 * @return void
	 */
	public function testSemanticColorIconResolvesThroughTheColorAliasChain(): void {
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
						'icon' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.brand.primary}',
						],
					],
				],
			]
		);

		$resolved = $resolver->resolve_overrides( [] );

		$this->assertSame( '#3182CE', $resolved->value( 'semantic.color.icon' ) );
		$this->assertSame( 'primitive.color.brand.primary', $resolved->target( 'semantic.color.icon' ) );
		$this->assertSame(
			'var(' . Css_Var::from_id( 'primitive.color.brand.primary' ) . ')',
			$resolved->projected_vars()[ Css_Var::from_id( 'semantic.color.icon' ) ]
		);
	}

	/**
	 * Both icon tokens resolve identically against the real shipped baseline (not a fake one), proving the
	 * pass-through this test exercises in isolation is exactly what production wiring already resolves.
	 *
	 * @return void
	 */
	public function testBothIconTokensResolveAgainstTheShippedBaseline(): void {
		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );

		$resolved = $resolver->resolve();

		$this->assertSame( '1.5rem', $resolved->value( 'semantic.icon-size.default' ) );
		$this->assertSame( '#3182CE', $resolved->value( 'semantic.color.icon' ) );
	}
}
