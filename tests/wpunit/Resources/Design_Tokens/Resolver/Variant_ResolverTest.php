<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Resolves the Button variants against the real shipped baseline, so these assertions also guard the
 * baseline's variant definitions.
 */
final class Variant_ResolverTest extends TestCase {

	private const BUTTON = 'kadence/advancedbtn';

	private Variant_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
	}

	public function testItResolvesGhostBindingsMixingLiteralsAndAliases(): void {
		$values = $this->resolver->resolve( self::BUTTON, 'ghost' );

		// Literal passes through; aliases flatten through the token graph.
		$this->assertSame( 'transparent', $values['button-bg'] );
		$this->assertSame( '#3182CE', $values['button-text'] );   // {primitive.color.brand.primary}
		$this->assertSame( '#3182CE', $values['button-border'] );
		$this->assertSame( '0.5rem', $values['button-radius'] );  // {semantic.radius.control} -> radius.md
	}

	public function testItFlattensMultiHopAliasesForThePrimaryVariant(): void {
		$values = $this->resolver->resolve( self::BUTTON, 'primary' );

		// button-bg -> {semantic.color.button-bg} -> {primitive.color.brand.primary} -> #3182CE
		$this->assertSame( '#3182CE', $values['button-bg'] );
		// button-text -> {semantic.color.button-text} -> {primitive.color.neutral.0} -> #ffffff
		$this->assertSame( '#ffffff', $values['button-text'] );
	}

	public function testResolveDefaultUsesTheDeclaredDefault(): void {
		// The baseline's $default for the button is "primary".
		$this->assertSame(
			$this->resolver->resolve( self::BUTTON, 'primary' ),
			$this->resolver->resolve_default( self::BUTTON )
		);
	}

	public function testItListsTheDocumentsVariantNames(): void {
		$this->assertSame( [ 'primary', 'secondary', 'ghost' ], $this->resolver->names( self::BUTTON ) );
	}

	public function testDefaultVariantReadsTheDollarDefault(): void {
		$this->assertSame( 'primary', $this->resolver->default_variant( self::BUTTON ) );
	}

	public function testHasVariant(): void {
		$this->assertTrue( $this->resolver->has_variant( self::BUTTON, 'ghost' ) );
		$this->assertFalse( $this->resolver->has_variant( self::BUTTON, 'outline' ) );
		// Unknown block is false, not an error.
		$this->assertFalse( $this->resolver->has_variant( 'kadence/nope', 'primary' ) );
	}

	public function testItReadsAVariantLabelFromTheDocument(): void {
		$this->assertSame( 'Ghost', $this->resolver->label( self::BUTTON, 'ghost' ) );
		$this->assertSame( 'Primary', $this->resolver->label( self::BUTTON, 'primary' ) );
	}

	public function testLabelIsNullForAnUnknownVariantOrBlock(): void {
		// A non-throwing lookup, mirroring has_variant().
		$this->assertNull( $this->resolver->label( self::BUTTON, 'outline' ) );
		$this->assertNull( $this->resolver->label( 'kadence/nope', 'ghost' ) );
	}

	public function testValuePropertiesAreTheUnionAcrossVariants(): void {
		$properties = $this->resolver->value_properties( self::BUTTON );

		sort( $properties );
		$this->assertSame(
			[ 'button-bg', 'button-border', 'button-radius', 'button-text' ],
			$properties
		);
	}

	public function testTheShippedButtonSetIsConsistent(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$set      = $registry->for_block( self::BUTTON );

		$this->assertNotNull( $set, 'The Button variant set should be registered at boot.' );

		// Every property the variants value has a binding, and every binding is valued somewhere.
		$report = $set->consistency( $this->resolver->value_properties( self::BUTTON ) );

		$this->assertSame( [], $report['unbound'], 'Valued properties with no binding.' );
		$this->assertSame( [], $report['unvalued'], 'Bindings no variant ever sets.' );

		// A token-ref binding must resolve to the referenced token's projections. An empty result would
		// mean a typo'd token id silently produced no projection (effective_projections fails soft), so
		// assert the reference actually lands.
		$binding = $set->binding( 'button-bg' );
		$this->assertNotNull( $binding, 'button-bg should be bound.' );
		$this->assertTrue( $binding->is_token_ref(), 'button-bg should be a token reference.' );
		$this->assertNotEmpty(
			$registry->effective_projections( $binding ),
			'The button-bg token reference should resolve to the token projections.'
		);
	}

	public function testItThrowsForAnUnknownBlock(): void {
		$this->expectException( Unknown_Variant_Exception::class );

		$this->resolver->resolve( 'kadence/not-a-block', 'primary' );
	}

	public function testItThrowsForAnUnknownVariant(): void {
		$this->expectException( Unknown_Variant_Exception::class );

		$this->resolver->resolve( self::BUTTON, 'not-a-variant' );
	}
}
