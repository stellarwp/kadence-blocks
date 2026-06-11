<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the selectable-variant CSS builder against the shipped Button variants, with a synthetic
 * variant set supplying the `kadence_slot` bindings the shipped declarations do not carry yet (those land
 * with the Button wiring, SOFT-3406). Values come from the baseline; this proves the per-(block, variant)
 * scoped --global-paletteN retargeting and the variant-var indirection.
 */
final class Css_BuilderTest extends TestCase {

	private const BUTTON = 'kadence/advancedbtn';

	private Variant_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
	}

	protected function tearDown(): void {
		// The Variant_Resolver leans on the shared Token_Resolver singleton, whose per-slug memo is not
		// rolled back between tests; clear it so a sibling test's stored overrides cannot leak in.
		$memo = new ReflectionProperty( $this->resolver, 'resolver' );
		$memo->setAccessible( true );
		$token_resolver = $memo->getValue( $this->resolver );

		$resolver_memo = new ReflectionProperty( $token_resolver, 'memo' );
		$resolver_memo->setAccessible( true );
		$resolver_memo->setValue( $token_resolver, [] );

		parent::tearDown();
	}

	public function testItEmitsAScopedPaletteOverrideAndVariantVarForAVariant(): void {
		$css = $this->builder( $this->button_set() )->css();

		// The variant's value lives as a global token var...
		$this->assertStringContainsString(
			'--kb-token--variant--kadence-advancedbtn--primary--button-bg:#3182CE;',
			$css
		);
		// ...and the scoped rule retargets the palette slot at that co-emitted var.
		$this->assertStringContainsString( '.wp-block-kadence-advancedbtn.kb-variant--primary{', $css );
		$this->assertStringContainsString(
			'--global-palette1:var(--kb-token--variant--kadence-advancedbtn--primary--button-bg);',
			$css
		);
		$this->assertStringContainsString(
			'--global-palette9:var(--kb-token--variant--kadence-advancedbtn--primary--button-text);',
			$css
		);
	}

	public function testItSkipsAPropertyBoundToNoPaletteSlot(): void {
		// button-radius is bound css_var only (no kadence_slot), so it never reaches a --global-paletteN.
		$css = $this->builder( $this->button_set() )->css();

		$this->assertStringNotContainsString( 'button-radius', $css );
	}

	public function testItScopesEachVariantToTheBlockClassAndPassesLiteralsThrough(): void {
		$css = $this->builder( $this->button_set() )->css();

		// Every named variant gets its own block-qualified rule, so a shared name never collides.
		$this->assertStringContainsString( '.wp-block-kadence-advancedbtn.kb-variant--secondary{', $css );
		$this->assertStringContainsString( '.wp-block-kadence-advancedbtn.kb-variant--ghost{', $css );
		// ghost's button-bg is the literal "transparent" in the baseline; it passes straight through into the
		// co-emitted variant var.
		$this->assertStringContainsString(
			'--kb-token--variant--kadence-advancedbtn--ghost--button-bg:transparent;',
			$css
		);
	}

	public function testItIsEmptyWhenNoVariantSetsAreRegistered(): void {
		$this->assertSame( '', $this->builder( new Token_Registry() )->css() );
	}

	public function testItSkipsABlockWhoseDocumentDefinesNoVariants(): void {
		// A registered binding for a block the baseline has no variants for contributes nothing, rather than
		// failing the whole build.
		$registry = new Token_Registry();
		$registry->register_variant_set(
			[
				'block'    => 'kadence/not-in-baseline',
				'bindings' => [ 'button-bg' => [ 'kadence_slot' => 'palette1' ] ],
			]
		);

		$this->assertSame( '', $this->builder( $registry )->css() );
	}

	/**
	 * Build the CSS builder with a given registry and the real (baseline-backed) variant resolver.
	 */
	private function builder( Token_Registry $registry ): Css_Builder {
		return new Css_Builder( $registry, $this->resolver );
	}

	/**
	 * A registry holding a Button variant set whose bindings target Kadence palette slots — the targets the
	 * shipped declarations omit until SOFT-3406.
	 */
	private function button_set(): Token_Registry {
		$registry = new Token_Registry();
		$registry->register_variant_set(
			[
				'block'    => self::BUTTON,
				'bindings' => [
					'button-bg'     => [ 'kadence_slot' => 'palette1' ],
					'button-text'   => [ 'kadence_slot' => 'palette9' ],
					'button-radius' => [ 'css_var' => true ], // no palette slot -> skipped.
				],
			]
		);

		return $registry;
	}
}
