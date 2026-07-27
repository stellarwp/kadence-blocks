<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Resolves the Button variants against the real shipped baseline, so these assertions also guard the
 * baseline's variant definitions. A block declares one flat variant list, so every accessor is read without
 * a group argument.
 */
final class Variant_ResolverTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	private Variant_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
	}

	public function testItResolvesAliasBindingsForSecondary(): void {
		$values = $this->resolver->resolve_literal( self::BUTTON, 'secondary' );

		// Aliases flatten through the token graph. Secondary is the dark/charcoal identity.
		$this->assertSame( '#1A202C', $values['button-bg'] );           // {semantic.color.button-secondary-bg} -> neutral.900
		$this->assertSame( '#ffffff', $values['button-text'] );         // {semantic.color.button-secondary-text} -> neutral.0
		$this->assertSame( '#2D3748', $values['button-bg-hover'] );     // {semantic.color.button-secondary-bg-hover} -> neutral.700
		$this->assertSame( '#ffffff', $values['button-text-hover'] );   // {semantic.color.button-secondary-text-hover} -> neutral.0
		$this->assertSame( '0.5rem', $values['button-radius'] );        // {semantic.radius.control} -> radius.md
	}

	public function testItFlattensMultiHopAliasesForThePrimaryVariant(): void {
		$values = $this->resolver->resolve_literal( self::BUTTON, 'primary' );

		// button-bg -> {semantic.color.button-primary-bg} -> {primitive.color.brand.button} -> #3633e1
		$this->assertSame( '#3633e1', $values['button-bg'] );
		// button-text -> {semantic.color.button-primary-text} -> {primitive.color.neutral.0} -> #ffffff
		$this->assertSame( '#ffffff', $values['button-text'] );
		// Hover -> {semantic.color.button-primary-bg-hover} -> {primitive.color.brand.button-hover} -> #2f2ffc
		$this->assertSame( '#2f2ffc', $values['button-bg-hover'] );
		$this->assertSame( '#ffffff', $values['button-text-hover'] );
	}

	/**
	 * resolve() (the default form) preserves alias indirection: each aliased binding reads a var()
	 * reference to its IMMEDIATE target (the semantic it points at), not the fully-resolved primitive leaf,
	 * so the variant var chains through the cascade and follows a token edit live. resolve_literal() still
	 * yields the flattened literal for the surfaces that need a concrete value.
	 *
	 * @return void
	 */
	public function testResolvePreservesAliasIndirection(): void {
		$projected = $this->resolver->resolve( self::BUTTON, 'primary' );

		$this->assertSame( 'var(--kb-token--semantic--color--button-primary-bg)', $projected['button-bg'] );
		$this->assertSame( 'var(--kb-token--semantic--color--button-primary-text)', $projected['button-text'] );
		$this->assertSame( 'var(--kb-token--semantic--color--button-primary-bg-hover)', $projected['button-bg-hover'] );
		$this->assertSame( 'var(--kb-token--semantic--radius--control)', $projected['button-radius'] );

		// The literal form is still available for the concrete-value surfaces — both forms are exposed.
		$this->assertSame( '#3633e1', $this->resolver->resolve_literal( self::BUTTON, 'primary' )['button-bg'] );
	}

	/**
	 * resolve() and resolve_literal() cover exactly the same properties — only the value form differs.
	 *
	 * @return void
	 */
	public function testResolveAndResolveLiteralShareTheInclusionSet(): void {
		$this->assertSame(
			array_keys( $this->resolver->resolve_literal( self::BUTTON, 'secondary' ) ),
			array_keys( $this->resolver->resolve( self::BUTTON, 'secondary' ) )
		);
	}

	public function testResolveDefaultUsesTheDeclaredDefault(): void {
		// The baseline's $default for the button is "primary"; resolve_default() returns literals.
		$this->assertSame(
			$this->resolver->resolve_literal( self::BUTTON, 'primary' ),
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

		// Every property the variants value has a binding.
		$report = $set->consistency( $this->resolver->value_properties( self::BUTTON ) );

		$this->assertSame( [], $report['unbound'], 'Valued properties with no binding.' );

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

	/**
	 * The Advanced Text (heading) variant set is registered at boot and its $default resolves the full
	 * 13-property core-design and typography surface to the shipped baseline's literal values.
	 *
	 * @return void
	 */
	public function testTheShippedAdvancedHeadingSetIsRegisteredAndResolvesTheDefault(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		$this->assertNotNull(
			$registry->for_block( 'kadence/advancedheading' ),
			'The Advanced Text variant set should be registered at boot.'
		);

		$this->assertSame(
			[
				'color'         => '#1A202C',
				'background'    => 'transparent',
				'typography'    => 'inherit',
				'fontSize'      => '2rem',
				'fontHeight'    => '1.125',
				'fontWeight'    => '400',
				'letterSpacing' => '0',
				'textTransform' => 'none',
				'padding'       => '0',
				'borderColor'   => '#E2E8F0',
				'borderWidth'   => '1px',
				'borderRadius'  => '0',
				'borderStyle'   => 'none',
			],
			$this->resolver->resolve_default( 'kadence/advancedheading' )
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
	 * A variant authored into the store (not the baseline) is resolved alongside the baseline variants: it
	 * appears in the name list, and its values resolve, because definitions are now read through the
	 * effective (baseline deep-merged with stored overrides) set.
	 *
	 * @return void
	 */
	public function testItResolvesAVariantAuthoredIntoTheStore(): void {
		$this->seedVariant(
			Token_Store::default_slug(),
			'accent',
			'Accent',
			[
				'button-bg'         => '#ff0000',
				'button-text'       => '#ffffff',
				'button-bg-hover'   => '#cc0000',
				'button-text-hover' => '#ffffff',
				'button-radius'     => '1rem',
			]
		);

		$this->assertSame( [ 'primary', 'secondary', 'accent' ], $this->resolver->names( self::BUTTON ) );
		$this->assertTrue( $this->resolver->has_variant( self::BUTTON, 'accent' ) );
		$this->assertSame( 'Accent', $this->resolver->label( self::BUTTON, 'accent' ) );

		$values = $this->resolver->resolve_literal( self::BUTTON, 'accent' );
		$this->assertSame( '#ff0000', $values['button-bg'] );
		$this->assertSame( '1rem', $values['button-radius'] );

		// A stored literal has no alias, so the projected form passes it through unchanged.
		$this->assertSame( '#ff0000', $this->resolver->resolve( self::BUTTON, 'accent' )['button-bg'] );
	}

	/**
	 * A variant may define a SUBSET of the block's bound surface — the properties it omits simply do not
	 * resolve for it, inherited from the block $default through the cascade rather than forced onto the
	 * variant.
	 *
	 * @return void
	 */
	public function testAVariantMayDefineASubsetOfTheSurface(): void {
		// Only two of the five bound properties.
		$this->seedVariant(
			Token_Store::default_slug(),
			'accent',
			'Accent',
			[
				'button-bg'   => '#ff0000',
				'button-text' => '#ffffff',
			]
		);

		$values = $this->resolver->resolve_literal( self::BUTTON, 'accent' );

		$this->assertSame( [ 'button-bg', 'button-text' ], array_keys( $values ) );
		$this->assertSame( '#ff0000', $values['button-bg'] );
	}

	/**
	 * A stored override for an existing baseline variant wins over the baseline value for that property,
	 * while the variant's other properties keep their baseline values.
	 *
	 * @return void
	 */
	public function testAStoredOverrideWinsOverTheBaselineVariantValue(): void {
		$this->seedVariant( Token_Store::default_slug(), 'secondary', 'Secondary', [ 'button-bg' => '#000000' ] );

		$values = $this->resolver->resolve_literal( self::BUTTON, 'secondary' );

		// The overridden property takes the stored value.
		$this->assertSame( '#000000', $values['button-bg'] );
		// A property the override does not touch still resolves from the baseline alias.
		$this->assertSame( '#ffffff', $values['button-text'] );
	}

	/**
	 * Variant definitions are per token set: a variant authored into one set is visible only for that set,
	 * and the default set is left untouched.
	 *
	 * @return void
	 */
	public function testStoredVariantsAreScopedToTheirSet(): void {
		$this->seedVariant(
			'dark',
			'accent',
			'Accent',
			[
				'button-bg'         => '#ff0000',
				'button-text'       => '#ffffff',
				'button-bg-hover'   => '#cc0000',
				'button-text-hover' => '#ffffff',
				'button-radius'     => '1rem',
			]
		);

		$this->assertTrue( $this->resolver->has_variant( self::BUTTON, 'accent', 'dark' ) );
		$this->assertContains( 'accent', $this->resolver->names( self::BUTTON, 'dark' ) );

		// The default set never saw the write.
		$this->assertFalse( $this->resolver->has_variant( self::BUTTON, 'accent', 'default' ) );
		$this->assertSame( [ 'primary', 'secondary' ], $this->resolver->names( self::BUTTON, 'default' ) );
	}

	/**
	 * Persist a single button variant into a token set's overrides document.
	 *
	 * @param string                $slug    The token set slug to write into.
	 * @param string                $variant The variant slug.
	 * @param string                $label   The variant label.
	 * @param array<string, string> $tokens  The property => value map for the variant.
	 *
	 * @return void
	 */
	private function seedVariant( string $slug, string $variant, string $label, array $tokens ): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'variants' => [
						self::BUTTON => [
							$variant => [
								'label'  => $label,
								'tokens' => $tokens,
							],
						],
					],
				],
			],
		];

		$store->save_document( (string) wp_json_encode( $document ), $slug );
	}
}
