<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Resolves the Button presets against the real shipped baseline, so these assertions also guard the
 * baseline's preset definitions. A block declares one flat preset list, so every accessor is read without
 * a group argument.
 */
final class Preset_ResolverTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	private Preset_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Preset_Resolver::class );
	}

	public function testItResolvesAliasBindingsForSecondary(): void {
		$values = $this->resolver->resolve_literal( self::BUTTON, 'secondary' );

		// Aliases flatten through the token graph. Secondary is the dark/charcoal identity.
		$this->assertSame( '#1A202C', $values['button-bg'] );           // {semantic.color.button-secondary-bg} -> neutral.900
		$this->assertSame( '#ffffff', $values['button-text'] );         // {semantic.color.button-secondary-text} -> neutral.0
		$this->assertSame( '#2D3748', $values['button-bg-hover'] );     // {semantic.color.button-secondary-bg-hover} -> neutral.700
		$this->assertSame( '#ffffff', $values['button-text-hover'] );   // {semantic.color.button-secondary-text-hover} -> neutral.0
		$this->assertSame( '0.1875rem', $values['button-radius'] );     // {semantic.radius.control} -> radius.sm (the button's long-standing 3px)
	}

	public function testItFlattensMultiHopAliasesForThePrimaryPreset(): void {
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
	 * so the preset var chains through the cascade and follows a token edit live. resolve_literal() still
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

	public function testItListsTheDocumentsPresetNames(): void {
		$this->assertSame( [ 'primary', 'secondary' ], $this->resolver->names( self::BUTTON ) );
	}

	public function testDefaultPresetReadsTheDollarDefault(): void {
		$this->assertSame( 'primary', $this->resolver->default_preset( self::BUTTON ) );
	}

	public function testHasPreset(): void {
		$this->assertTrue( $this->resolver->has_preset( self::BUTTON, 'secondary' ) );
		// "ghost" is not a V1 Button preset (the native Outline style covers it).
		$this->assertFalse( $this->resolver->has_preset( self::BUTTON, 'ghost' ) );
		// Unknown block is false, not an error.
		$this->assertFalse( $this->resolver->has_preset( 'kadence/nope', 'primary' ) );
	}

	public function testItReadsAPresetLabelFromTheDocument(): void {
		$this->assertSame( 'Secondary', $this->resolver->label( self::BUTTON, 'secondary' ) );
		$this->assertSame( 'Primary', $this->resolver->label( self::BUTTON, 'primary' ) );
	}

	public function testLabelIsNullForAnUnknownPresetOrBlock(): void {
		// A non-throwing lookup, mirroring has_preset().
		$this->assertNull( $this->resolver->label( self::BUTTON, 'ghost' ) );
		$this->assertNull( $this->resolver->label( 'kadence/nope', 'primary' ) );
	}

	public function testValuePropertiesAreTheUnionAcrossPresets(): void {
		$properties = $this->resolver->value_properties( self::BUTTON );

		sort( $properties );
		$this->assertSame(
			[
				'button-bg',
				'button-bg-hover',
				'button-border-color',
				'button-border-style',
				'button-border-width',
				'button-margin',
				'button-padding',
				'button-radius',
				'button-text',
				'button-text-hover',
			],
			$properties
		);
	}

	public function testTheShippedButtonPresetBindingsAreConsistent(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$bindings = $registry->for_block( self::BUTTON );

		$this->assertNotNull( $bindings, 'The Button preset bindings should be registered at boot.' );

		// Every property the presets value has a binding.
		$report = $bindings->consistency( $this->resolver->value_properties( self::BUTTON ) );

		$this->assertSame( [], $report['unbound'], 'Valued properties with no binding.' );

		/**
		 * The Kadence button bindings retarget a global slot directly — the per-preset VALUE comes from
		 * the preset token map, so the binding carries a kadence_slot projection rather than a token ref.
		 * Assert the slot actually lands (an empty result would mean the binding silently projected nothing).
		 */
		$binding = $bindings->binding( 'button-bg' );
		$this->assertNotNull( $binding, 'button-bg should be bound.' );
		$this->assertSame(
			'palette-btn-bg',
			$registry->effective_projections( $binding )[ Binding::get_kadence_slot_key() ] ?? null,
			'The button-bg binding should retarget the palette-btn-bg slot.'
		);
	}

	/**
	 * The Advanced Text (heading) preset bindings are registered at boot and their $default resolves the full
	 * 13-property core-design and typography surface to the shipped baseline's literal values.
	 *
	 * @return void
	 */
	public function testTheShippedAdvancedHeadingSetIsRegisteredAndResolvesTheDefault(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		$this->assertNotNull(
			$registry->for_block( 'kadence/advancedheading' ),
			'The Advanced Text preset bindings should be registered at boot.'
		);

		$this->assertSame(
			[
				'color'         => '#1A202C',
				'background'    => 'transparent',
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
		$this->expectException( Unknown_Preset_Exception::class );

		$this->resolver->resolve( 'kadence/not-a-block', 'primary' );
	}

	public function testItThrowsForAnUnknownPreset(): void {
		$this->expectException( Unknown_Preset_Exception::class );

		$this->resolver->resolve( self::BUTTON, 'not-a-preset' );
	}

	/**
	 * A preset authored into the store (not the baseline) is resolved alongside the baseline presets: it
	 * appears in the name list, and its values resolve, because definitions are now read through the
	 * effective (baseline deep-merged with stored overrides) library.
	 *
	 * @return void
	 */
	public function testItResolvesAPresetAuthoredIntoTheStore(): void {
		$this->seedPreset(
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
		$this->assertTrue( $this->resolver->has_preset( self::BUTTON, 'accent' ) );
		$this->assertSame( 'Accent', $this->resolver->label( self::BUTTON, 'accent' ) );

		$values = $this->resolver->resolve_literal( self::BUTTON, 'accent' );
		$this->assertSame( '#ff0000', $values['button-bg'] );
		$this->assertSame( '1rem', $values['button-radius'] );

		// A stored literal has no alias, so the projected form passes it through unchanged.
		$this->assertSame( '#ff0000', $this->resolver->resolve( self::BUTTON, 'accent' )['button-bg'] );
	}

	/**
	 * A preset may define a SUBSET of the block's bound surface — the properties it omits simply do not
	 * resolve for it, inherited from the block $default through the cascade rather than forced onto the
	 * preset.
	 *
	 * @return void
	 */
	public function testAPresetMayDefineASubsetOfTheSurface(): void {
		// Only two of the five bound properties.
		$this->seedPreset(
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
	 * A stored override for an existing baseline preset wins over the baseline value for that property,
	 * while the preset's other properties keep their baseline values.
	 *
	 * @return void
	 */
	public function testAStoredOverrideWinsOverTheBaselinePresetValue(): void {
		$this->seedPreset( Token_Store::default_slug(), 'secondary', 'Secondary', [ 'button-bg' => '#000000' ] );

		$values = $this->resolver->resolve_literal( self::BUTTON, 'secondary' );

		// The overridden property takes the stored value.
		$this->assertSame( '#000000', $values['button-bg'] );
		// A property the override does not touch still resolves from the baseline alias.
		$this->assertSame( '#ffffff', $values['button-text'] );
	}

	/**
	 * Preset definitions are per token library: a preset authored into one library is visible only for that
	 * library, and the default library is left untouched.
	 *
	 * @return void
	 */
	public function testStoredPresetsAreScopedToTheirLibrary(): void {
		$this->seedPreset(
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

		$this->assertTrue( $this->resolver->has_preset( self::BUTTON, 'accent', 'dark' ) );
		$this->assertContains( 'accent', $this->resolver->names( self::BUTTON, 'dark' ) );

		// The default library never saw the write.
		$this->assertFalse( $this->resolver->has_preset( self::BUTTON, 'accent', 'default' ) );
		$this->assertSame( [ 'primary', 'secondary' ], $this->resolver->names( self::BUTTON, 'default' ) );
	}

	/**
	 * A per-corner slot list flattens to literals slot by slot and stays an array, so the editor and admin
	 * surfaces can read each corner rather than a pre-joined string they cannot parse.
	 *
	 * @return void
	 */
	public function testResolveLiteralKeepsASlotListUnjoined(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'corners',
			'Corners',
			[ 'button-radius' => [ '{semantic.radius.control}', '8px', '{semantic.radius.control}', '8px' ] ]
		);

		$values = $this->resolver->resolve_literal( self::BUTTON, 'corners' );

		$this->assertSame( [ '0.1875rem', '8px', '0.1875rem', '8px' ], $values['button-radius'] );
	}

	/**
	 * A per-corner slot list projects to a space-separated CSS shorthand, each aliased corner keeping its
	 * var() indirection so the corner still follows a token edit live.
	 *
	 * @return void
	 */
	public function testResolveJoinsASlotListIntoAVarShorthand(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'corners',
			'Corners',
			[ 'button-radius' => [ '{semantic.radius.control}', '8px', '{semantic.radius.control}', '8px' ] ]
		);

		$projected = $this->resolver->resolve( self::BUTTON, 'corners' );

		$this->assertSame(
			'var(--kb-token--semantic--radius--control) 8px var(--kb-token--semantic--radius--control) 8px',
			$projected['button-radius']
		);
	}

	/**
	 * A slot list holding an unresolvable alias drops the whole property, matching how a scalar binding
	 * whose alias resolves to nothing is dropped rather than emitted half-formed.
	 *
	 * @return void
	 */
	public function testASlotListWithAnUnresolvableAliasDropsTheProperty(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'corners',
			'Corners',
			[ 'button-radius' => [ '{semantic.radius.control}', '{primitive.dimension.radius.nope}', '8px', '8px' ] ]
		);

		$this->assertArrayNotHasKey( 'button-radius', $this->resolver->resolve_literal( self::BUTTON, 'corners' ) );
	}

	/**
	 * A responsive preset entry resolves its base value exactly as a bare entry does, so adding
	 * breakpoints never changes what desktop renders.
	 *
	 * @return void
	 */
	public function testAResponsiveEntryResolvesItsBaseForDesktop(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'hero',
			'Hero',
			[ 'button-radius' => $this->responsiveEntry( '8px', [ 'mobile' => '2px' ] ) ]
		);

		$this->assertSame( '8px', $this->resolver->resolve_literal( self::BUTTON, 'hero' )['button-radius'] );
		$this->assertSame( '8px', $this->resolver->resolve( self::BUTTON, 'hero' )['button-radius'] );
	}

	/**
	 * Per-breakpoint overrides project to the same var()-preserving form as the base, keyed by breakpoint,
	 * so an aliased override still chains through the token cascade.
	 *
	 * @return void
	 */
	public function testResolveResponsiveProjectsEachBreakpoint(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'hero',
			'Hero',
			[
				'button-radius' => $this->responsiveEntry(
					'8px',
					[
						'tablet' => [ '4px', '2px', '4px', '2px' ],
						'mobile' => '{semantic.radius.control}',
					]
				),
			]
		);

		$this->assertSame(
			[
				'tablet' => [ 'button-radius' => '4px 2px 4px 2px' ],
				'mobile' => [ 'button-radius' => 'var(--kb-token--semantic--radius--control)' ],
			],
			$this->resolver->resolve_responsive( self::BUTTON, 'hero' )
		);
	}

	/**
	 * Per-breakpoint overrides also flatten to literals, for the editor surfaces that cannot consume a
	 * var() chain.
	 *
	 * @return void
	 */
	public function testResolveResponsiveLiteralFlattensEachBreakpoint(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'hero',
			'Hero',
			[ 'button-radius' => $this->responsiveEntry( '8px', [ 'mobile' => '{semantic.radius.control}' ] ) ]
		);

		$this->assertSame(
			[ 'mobile' => [ 'button-radius' => '0.1875rem' ] ],
			$this->resolver->resolve_responsive_literal( self::BUTTON, 'hero' )
		);
	}

	/**
	 * An override whose alias resolves to nothing is dropped for that breakpoint only, leaving the base and
	 * the other breakpoints intact — the same fail-closed choice a scalar binding makes.
	 *
	 * @return void
	 */
	public function testAnUnresolvableOverrideDropsOnlyThatBreakpoint(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'hero',
			'Hero',
			[
				'button-radius' => $this->responsiveEntry(
					'8px',
					[
						'tablet' => '{primitive.dimension.radius.nope}',
						'mobile' => '2px',
					]
				),
			]
		);

		$responsive = $this->resolver->resolve_responsive( self::BUTTON, 'hero' );

		$this->assertArrayNotHasKey( 'tablet', $responsive );
		$this->assertSame( [ 'button-radius' => '2px' ], $responsive['mobile'] );
		$this->assertSame( '8px', $this->resolver->resolve_literal( self::BUTTON, 'hero' )['button-radius'] );
	}

	/**
	 * A preset with no responsive entries resolves to an empty breakpoint map, so every existing preset
	 * contributes no media queries.
	 *
	 * @return void
	 */
	public function testAPresetWithNoResponsiveEntriesResolvesEmpty(): void {
		$this->assertSame( [], $this->resolver->resolve_responsive( self::BUTTON, 'primary' ) );
	}

	/**
	 * A responsive override's per-corner slot list may leave some corners as a `''` gap — this
	 * breakpoint does not override that corner, so it keeps inheriting live from the cascade. The
	 * responsive-literal form (which feeds the editor's localized catalog) must keep the gap in the
	 * array rather than resolving or dropping it, so the editor can tell "overridden here" apart
	 * from "not overridden here" per corner.
	 *
	 * @return void
	 */
	public function testResolveResponsiveLiteralPreservesGapsInASparseOverride(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'hero',
			'Hero',
			[
				'button-radius' => $this->responsiveEntry(
					'8px',
					[ 'tablet' => [ '{semantic.radius.control}', '', '', '' ] ]
				),
			]
		);

		$this->assertSame(
			[ 'tablet' => [ 'button-radius' => [ '0.1875rem', '', '', '' ] ] ],
			$this->resolver->resolve_responsive_literal( self::BUTTON, 'hero' )
		);
	}

	/**
	 * The var()-preserving responsive form also keeps a sparse override's property instead of
	 * dropping it — a gap is not an unresolvable slot, so it does not trigger the fail-closed path a
	 * genuinely unresolvable alias does.
	 *
	 * @return void
	 */
	public function testResolveResponsivePreservesGapsInASparseOverride(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'hero',
			'Hero',
			[
				'button-radius' => $this->responsiveEntry(
					'8px',
					[ 'tablet' => [ '{semantic.radius.control}', '', '8px', '' ] ]
				),
			]
		);

		$responsive = $this->resolver->resolve_responsive( self::BUTTON, 'hero' );

		$this->assertArrayHasKey( 'tablet', $responsive );
		$this->assertArrayHasKey( 'button-radius', $responsive['tablet'] );
	}

	/**
	 * The base path (resolve()/resolve_literal(), and resolve_default() which delegates to it) is
	 * untouched by the responsive path's keep-the-gap mode: a fully-set per-corner base value still
	 * resolves exactly as before, projected and literal alike.
	 *
	 * @return void
	 */
	public function testBasePathStillResolvesAFullySetSlotListUnchanged(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'corners',
			'Corners',
			[ 'button-radius' => [ '{semantic.radius.control}', '8px', '{semantic.radius.control}', '8px' ] ]
		);

		$this->assertSame(
			[ '0.1875rem', '8px', '0.1875rem', '8px' ],
			$this->resolver->resolve_literal( self::BUTTON, 'corners' )['button-radius']
		);
		$this->assertSame(
			'var(--kb-token--semantic--radius--control) 8px var(--kb-token--semantic--radius--control) 8px',
			$this->resolver->resolve( self::BUTTON, 'corners' )['button-radius']
		);
	}

	/**
	 * A base value's per-corner slot list is rejected with a `''` gap at write time (Presets_Controller
	 * and Dtcg_Validator), but the resolver does not trust that validation ran — a gap reaching the
	 * base path here still fails the whole property closed, exactly like an unresolvable alias, rather
	 * than silently passing the empty string through as a literal.
	 *
	 * @return void
	 */
	public function testBasePathFailsClosedOnAGapAsADefenseInDepthSafetyNet(): void {
		$this->seedPreset(
			Token_Store::default_slug(),
			'corners',
			'Corners',
			[ 'button-radius' => [ '{semantic.radius.control}', '', '8px', '8px' ] ]
		);

		$this->assertArrayNotHasKey( 'button-radius', $this->resolver->resolve_literal( self::BUTTON, 'corners' ) );
		$this->assertArrayNotHasKey( 'button-radius', $this->resolver->resolve( self::BUTTON, 'corners' ) );
	}

	/**
	 * A preset token entry carrying per-breakpoint overrides, in the same envelope a responsive token leaf
	 * uses.
	 *
	 * @param mixed                $base       The entry's base value.
	 * @param array<string, mixed> $responsive Breakpoint => override value.
	 *
	 * @return array<string, mixed> The entry.
	 */
	private function responsiveEntry( $base, array $responsive ): array {
		return [
			'$value'      => $base,
			'$extensions' => [
				'com.kadence.designTokens' => [
					'responsive' => $responsive,
				],
			],
		];
	}

	/**
	 * Persist a single button preset into a token library's overrides document.
	 *
	 * @param string               $slug   The token library slug to write into.
	 * @param string               $preset The preset slug.
	 * @param string               $label  The preset label.
	 * @param array<string, mixed> $tokens The property => value map for the preset.
	 *
	 * @return void
	 */
	private function seedPreset( string $slug, string $preset, string $label, array $tokens ): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						self::BUTTON => [
							$preset => [
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
