<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Resolves the Button variants against the real shipped baseline, so these assertions also guard the
 * baseline's variant definitions.
 */
final class Variant_ResolverTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	private Variant_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
	}

	public function testItResolvesAliasBindingsForSecondary(): void {
		$values = $this->resolver->resolve( self::BUTTON, 'secondary' );

		// Aliases flatten through the token graph. Secondary is the dark/charcoal identity.
		$this->assertSame( '#1A202C', $values['button-bg'] );           // {semantic.color.button-secondary-bg} -> neutral.900
		$this->assertSame( '#ffffff', $values['button-text'] );         // {semantic.color.button-secondary-text} -> neutral.0
		$this->assertSame( '#2D3748', $values['button-bg-hover'] );     // {semantic.color.button-secondary-bg-hover} -> neutral.700
		$this->assertSame( '#ffffff', $values['button-text-hover'] );   // {semantic.color.button-secondary-text-hover} -> neutral.0
		$this->assertSame( '0.5rem', $values['button-radius'] );        // {semantic.radius.control} -> radius.md
	}

	public function testItFlattensMultiHopAliasesForThePrimaryVariant(): void {
		$values = $this->resolver->resolve( self::BUTTON, 'primary' );

		// button-bg -> {semantic.color.button-primary-bg} -> {primitive.color.brand.primary} -> #3182CE
		$this->assertSame( '#3182CE', $values['button-bg'] );
		// button-text -> {semantic.color.button-primary-text} -> {primitive.color.neutral.0} -> #ffffff
		$this->assertSame( '#ffffff', $values['button-text'] );
		// Hover darkens to a dedicated darker-primary shade (brand.primary-dark), decoupled from brand.secondary.
		$this->assertSame( '#2C5282', $values['button-bg-hover'] );
		$this->assertSame( '#ffffff', $values['button-text-hover'] );
	}

	public function testResolveDefaultUsesTheDeclaredDefault(): void {
		// The baseline's $default for the button is "primary".
		$this->assertSame(
			$this->resolver->resolve( self::BUTTON, 'primary' ),
			$this->resolver->resolve_default( self::BUTTON )
		);
	}

	public function testItListsTheDocumentsVariantNames(): void {
		$this->assertSame( [ 'primary', 'secondary' ], $this->resolver->names( self::BUTTON ) );
	}

	public function testDefaultVariantReadsTheDollarDefault(): void {
		$this->assertSame( 'primary', $this->resolver->default_variant( self::BUTTON ) );
	}

	public function testHasVariant(): void {
		$this->assertTrue( $this->resolver->has_variant( self::BUTTON, 'secondary' ) );
		// "ghost" is not a V1 Button variant (the native Outline style covers it).
		$this->assertFalse( $this->resolver->has_variant( self::BUTTON, 'ghost' ) );
		// Unknown block is false, not an error.
		$this->assertFalse( $this->resolver->has_variant( 'kadence/nope', 'primary' ) );
	}

	public function testItReadsAVariantLabelFromTheDocument(): void {
		$this->assertSame( 'Secondary', $this->resolver->label( self::BUTTON, 'secondary' ) );
		$this->assertSame( 'Primary', $this->resolver->label( self::BUTTON, 'primary' ) );
	}

	public function testLabelIsNullForAnUnknownVariantOrBlock(): void {
		// A non-throwing lookup, mirroring has_variant().
		$this->assertNull( $this->resolver->label( self::BUTTON, 'ghost' ) );
		$this->assertNull( $this->resolver->label( 'kadence/nope', 'primary' ) );
	}

	public function testValuePropertiesAreTheUnionAcrossVariants(): void {
		$properties = $this->resolver->value_properties( self::BUTTON );

		sort( $properties );
		$this->assertSame(
			[ 'button-bg', 'button-bg-hover', 'button-radius', 'button-text', 'button-text-hover' ],
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

		/**
		 * The Kadence button bindings retarget a global slot directly — the per-variant VALUE comes from
		 * the variant token map, so the binding carries a kadence_slot projection rather than a token ref.
		 * Assert the slot actually lands (an empty result would mean the binding silently projected nothing).
		 */
		$binding = $set->binding( 'button-bg' );
		$this->assertNotNull( $binding, 'button-bg should be bound.' );
		$this->assertSame(
			'palette-btn-bg',
			$registry->effective_projections( $binding )[ Binding::get_kadence_slot_key() ] ?? null,
			'The button-bg binding should retarget the palette-btn-bg slot.'
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
