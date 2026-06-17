<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the selectable-variant CSS builder against the real shipped Button variant set, so these
 * assertions also guard the Button wiring: the button-specific --global-palette-btn-* slot retargeting,
 * the variant-var indirection, and the class-less $default rule.
 */
final class Css_BuilderTest extends TestCase {

	private Token_Registry $registry;

	private Variant_Resolver $resolver;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
		$this->resolver = $this->container->get( Variant_Resolver::class );
	}

	/**
	 * @return void
	 */
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

	/**
	 * Each variant's resolved value lives as a co-emitted global token var, aliases flattened to literals.
	 *
	 * @return void
	 */
	public function testItDefinesTheVariantVars(): void {
		$css = $this->builder( $this->registry )->css();

		$this->assertStringContainsString( '--kb-token--variant--kadence-singlebtn--primary--button-bg:#3182CE;', $css );
		$this->assertStringContainsString( '--kb-token--variant--kadence-singlebtn--primary--button-bg-hover:#2B6CB0;', $css );
		$this->assertStringContainsString( '--kb-token--variant--kadence-singlebtn--secondary--button-bg:#1A202C;', $css );
		$this->assertStringContainsString( '--kb-token--variant--kadence-singlebtn--secondary--button-bg-hover:#2D3748;', $css );
	}

	/**
	 * A named variant retargets the button's own --global-palette-btn-* slots (the vars the button render
	 * path consumes), not the numbered palette, at the co-emitted variant var.
	 *
	 * @return void
	 */
	public function testItRetargetsButtonSlotsForANamedVariant(): void {
		$css = $this->builder( $this->registry )->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-singlebtn.kb-variant--secondary{'
				. '--global-palette-btn-bg:var(--kb-token--variant--kadence-singlebtn--secondary--button-bg);'
				. '--global-palette-btn:var(--kb-token--variant--kadence-singlebtn--secondary--button-text);'
				. '--global-palette-btn-bg-hover:var(--kb-token--variant--kadence-singlebtn--secondary--button-bg-hover);'
				. '--global-palette-btn-hover:var(--kb-token--variant--kadence-singlebtn--secondary--button-text-hover);}',
			$css
		);
	}

	/**
	 * The $default (primary) is re-emitted on the class-less block selector, so a button with no variant
	 * selected still shows its preset look.
	 *
	 * @return void
	 */
	public function testItEmitsTheDefaultPresetOnTheBareSelector(): void {
		$css = $this->builder( $this->registry )->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-singlebtn{'
				. '--global-palette-btn-bg:var(--kb-token--variant--kadence-singlebtn--primary--button-bg);'
				. '--global-palette-btn:var(--kb-token--variant--kadence-singlebtn--primary--button-text);'
				. '--global-palette-btn-bg-hover:var(--kb-token--variant--kadence-singlebtn--primary--button-bg-hover);'
				. '--global-palette-btn-hover:var(--kb-token--variant--kadence-singlebtn--primary--button-text-hover);}',
			$css
		);
	}

	/**
	 * button-radius is bound css_var only (no slot), so it never reaches a --global-* declaration.
	 *
	 * @return void
	 */
	public function testItSkipsAPropertyBoundToNoSlot(): void {
		$css = $this->builder( $this->registry )->css();

		$this->assertStringNotContainsString( 'button-radius', $css );
	}

	/**
	 * @return void
	 */
	public function testItIsEmptyWhenNoVariantSetsAreRegistered(): void {
		$this->assertSame( '', $this->builder( new Token_Registry() )->css() );
	}

	/**
	 * A registered binding for a block the baseline has no variants for contributes nothing, rather than
	 * failing the whole build.
	 *
	 * @return void
	 */
	public function testItSkipsABlockWhoseDocumentDefinesNoVariants(): void {
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
	 *
	 * @param Token_Registry $registry The registry to build from.
	 *
	 * @return Css_Builder
	 */
	private function builder( Token_Registry $registry ): Css_Builder {
		return new Css_Builder( $registry, $this->resolver );
	}
}
