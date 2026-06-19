<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Resolves the Button variants against the real shipped baseline, so these assertions also guard the
 * baseline's variant definitions.
 *
 * The grouped (multi-axis) cases run against a controllable baseline fixture — a grouped block with two
 * axes alongside a flat block — so the same accessors are asserted for both shapes. That fixture uses
 * literal token values, so resolution is deterministic without leaning on the token graph.
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

		// button-bg -> {semantic.color.button-primary-bg} -> {primitive.color.brand.button} -> #3633e1
		$this->assertSame( '#3633e1', $values['button-bg'] );
		// button-text -> {semantic.color.button-primary-text} -> {primitive.color.neutral.0} -> #ffffff
		$this->assertSame( '#ffffff', $values['button-text'] );
		// Hover -> {semantic.color.button-primary-bg-hover} -> {primitive.color.brand.button-hover} -> #2f2ffc
		$this->assertSame( '#2f2ffc', $values['button-bg-hover'] );
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

	/**
	 * A grouped block reports its explicit axes in document order; a flat block reports the single implicit
	 * group sentinel.
	 *
	 * @return void
	 */
	public function testItReportsTheGroupsForEachShape(): void {
		$resolver = $this->grouped_resolver();

		$this->assertSame( [ 'color', 'hover' ], $resolver->groups( 'kadence/grouped-btn' ) );
		$this->assertSame( [ Variant_Resolver::IMPLICIT_GROUP ], $resolver->groups( 'kadence/flat-btn' ) );
	}

	/**
	 * is_grouped distinguishes a multi-axis block from a flat one, and never throws for an unknown block.
	 *
	 * @return void
	 */
	public function testItDetectsWhetherABlockIsGrouped(): void {
		$resolver = $this->grouped_resolver();

		$this->assertTrue( $resolver->is_grouped( 'kadence/grouped-btn' ) );
		$this->assertFalse( $resolver->is_grouped( 'kadence/flat-btn' ) );
		$this->assertFalse( $resolver->is_grouped( 'kadence/nope' ) );
	}

	/**
	 * Names, default and resolved values are read per group for a grouped block.
	 *
	 * @return void
	 */
	public function testItReadsEachGroupIndependently(): void {
		$resolver = $this->grouped_resolver();

		$this->assertSame( [ 'primary', 'secondary' ], $resolver->names( 'kadence/grouped-btn', 'color' ) );
		$this->assertSame( [ 'subtle', 'bold' ], $resolver->names( 'kadence/grouped-btn', 'hover' ) );

		$this->assertSame( 'primary', $resolver->default_variant( 'kadence/grouped-btn', 'color' ) );
		$this->assertSame( 'subtle', $resolver->default_variant( 'kadence/grouped-btn', 'hover' ) );

		$this->assertSame( '#111111', $resolver->resolve( 'kadence/grouped-btn', 'secondary', 'default', 'color' )['button-bg'] );
		$this->assertSame( '#000000', $resolver->resolve( 'kadence/grouped-btn', 'bold', 'default', 'hover' )['button-bg-hover'] );
	}

	/**
	 * A flat block resolves through its single implicit group with no group argument, exactly as an
	 * ungrouped block always has.
	 *
	 * @return void
	 */
	public function testAFlatBlockResolvesThroughTheImplicitGroup(): void {
		$resolver = $this->grouped_resolver();

		$this->assertSame( [ 'primary', 'secondary' ], $resolver->names( 'kadence/flat-btn' ) );
		$this->assertSame( 'primary', $resolver->default_variant( 'kadence/flat-btn' ) );
		$this->assertSame( '#111111', $resolver->resolve( 'kadence/flat-btn', 'secondary' )['button-bg'] );
	}

	/**
	 * has_variant and label are scoped to the named group; a variant in one group is not seen in another.
	 *
	 * @return void
	 */
	public function testHasVariantAndLabelAreGroupScoped(): void {
		$resolver = $this->grouped_resolver();

		$this->assertTrue( $resolver->has_variant( 'kadence/grouped-btn', 'primary', 'color' ) );
		$this->assertFalse( $resolver->has_variant( 'kadence/grouped-btn', 'primary', 'hover' ) );

		$this->assertSame( 'Bold', $resolver->label( 'kadence/grouped-btn', 'bold', 'hover' ) );
		$this->assertNull( $resolver->label( 'kadence/grouped-btn', 'bold', 'color' ) );
	}

	/**
	 * value_properties unions every property across all of a grouped block's axes.
	 *
	 * @return void
	 */
	public function testValuePropertiesUnionsAcrossGroups(): void {
		$this->assertSame(
			[ 'button-bg', 'button-text', 'button-bg-hover', 'button-text-hover' ],
			$this->grouped_resolver()->value_properties( 'kadence/grouped-btn' )
		);
	}

	/**
	 * Addressing a grouped block's implicit group (a null/sentinel group) is a group mismatch and throws,
	 * so a caller cannot silently read the wrong axis.
	 *
	 * @return void
	 */
	public function testAGroupMismatchThrows(): void {
		$this->expectException( Unknown_Variant_Exception::class );

		$this->grouped_resolver()->names( 'kadence/grouped-btn' );
	}

	/**
	 * Build a Variant_Resolver over a controllable grouped/flat baseline fixture. The grouped block carries
	 * two ORTHOGONAL axes — "color" sets the base fill (button-bg / button-text), "hover" sets the hover
	 * treatment (button-bg-hover / button-text-hover) — so one selection per axis composes cleanly without
	 * either overwriting the other. The real Token_Resolver is reused for alias lookups, but the fixture's
	 * literal values never reach it.
	 *
	 * @return Variant_Resolver
	 */
	private function grouped_resolver(): Variant_Resolver {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'variants' => [
						'kadence/grouped-btn' => [
							'color'    => [
								'$default'  => 'primary',
								'primary'   => [
									'label'  => 'Primary',
									'tokens' => [
										'button-bg'   => '#3633e1',
										'button-text' => '#ffffff',
									],
								],
								'secondary' => [
									'label'  => 'Secondary',
									'tokens' => [
										'button-bg'   => '#111111',
										'button-text' => '#ffffff',
									],
								],
							],
							'hover'    => [
								'$default' => 'subtle',
								'subtle'   => [
									'label'  => 'Subtle',
									'tokens' => [
										'button-bg-hover'   => '#2f2ffc',
										'button-text-hover' => '#ffffff',
									],
								],
								'bold'     => [
									'label'  => 'Bold',
									'tokens' => [
										'button-bg-hover'   => '#000000',
										'button-text-hover' => '#ffffff',
									],
								],
							],
						],
						'kadence/flat-btn'    => [
							'$default'  => 'primary',
							'primary'   => [
								'label'  => 'Primary',
								'tokens' => [ 'button-bg' => '#3633e1' ],
							],
							'secondary' => [
								'label'  => 'Secondary',
								'tokens' => [ 'button-bg' => '#111111' ],
							],
						],
					],
				],
			],
		];

		return new Variant_Resolver(
			new Fake_Baseline_Document( $document ),
			$this->container->get( Token_Resolver::class )
		);
	}
}
