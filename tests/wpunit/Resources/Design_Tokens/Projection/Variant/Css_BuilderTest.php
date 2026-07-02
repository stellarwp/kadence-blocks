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
 * the per-set namespaced variant-var indirection, the active-alias layer, the client-side switch selector,
 * and the class-less $default rule.
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
	 * Each variant's value lives as a per-set namespaced token var that preserves the alias indirection
	 * inside the set (var(--kb-token--<set>--<semantic>)), and the canonical variant var is pointed at the
	 * active set's namespaced one by the alias layer — so a token edit flows through the chain live and the
	 * variant follows the active set.
	 *
	 * @return void
	 */
	public function testItDefinesTheVariantVarsNamespacedWithAnAliasLayer(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

		// The namespaced variant var chains to that set's namespaced semantic.
		$this->assertStringContainsString( '--kb-token--default--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--default--semantic--color--button-primary-bg);', $css );
		$this->assertStringContainsString( '--kb-token--default--variant--kadence-singlebtn--secondary--button-bg:var(--kb-token--default--semantic--color--button-secondary-bg);', $css );

		// The canonical variant var is pointed at the active set's namespaced variant var (the alias layer).
		$this->assertStringContainsString( '--kb-token--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--default--variant--kadence-singlebtn--primary--button-bg);', $css );
	}

	/**
	 * Every set is emitted simultaneously: both namespaces carry their variant vars, and each set has a
	 * [data-kb-token-set] switch selector re-pointing the canonical variant var, so a body class swaps the
	 * variant palette client-side.
	 *
	 * @return void
	 */
	public function testItEmitsEverySetNamespacedWithASwitchSelector(): void {
		$css = $this->builder( $this->registry )->css( [ 'default', 'dark' ], 'default' );

		// Both sets' namespaced variant vars are present (dark resolves from baseline here, namespaced).
		$this->assertStringContainsString( '--kb-token--default--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--default--semantic--color--button-primary-bg);', $css );
		$this->assertStringContainsString( '--kb-token--dark--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--dark--semantic--color--button-primary-bg);', $css );

		// The dark switch selector re-points the canonical variant var at the dark namespace.
		$this->assertStringContainsString(
			'[data-kb-token-set="dark"]{',
			$css
		);
		$this->assertStringContainsString(
			'--kb-token--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--dark--variant--kadence-singlebtn--primary--button-bg);',
			$css
		);
	}

	/**
	 * The :root alias layer targets the active set: the active set's canonical re-point appears twice (the
	 * :root alias plus its own switch selector), a non-active set's only once (its switch selector).
	 *
	 * @return void
	 */
	public function testItPointsTheAliasLayerAtTheActiveSet(): void {
		$css = $this->builder( $this->registry )->css( [ 'default', 'dark' ], 'dark' );

		$this->assertSame(
			2,
			substr_count( $css, '--kb-token--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--dark--variant--kadence-singlebtn--primary--button-bg);' )
		);
		$this->assertSame(
			1,
			substr_count( $css, '--kb-token--variant--kadence-singlebtn--primary--button-bg:var(--kb-token--default--variant--kadence-singlebtn--primary--button-bg);' )
		);
	}

	/**
	 * A named variant retargets the button's own --global-palette-btn-* slots (the vars the button render
	 * path consumes), not the numbered palette, at the canonical variant var — so it follows the alias /
	 * switch layers.
	 *
	 * @return void
	 */
	public function testItRetargetsButtonSlotsForANamedVariant(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

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
	 * core/button reuses the same --global-palette-btn-* retarget as the Kadence button; its selector
	 * strips the "core/" namespace to ".wp-block-button" (not ".wp-block-core-button").
	 *
	 * @return void
	 */
	public function testItRetargetsButtonSlotsForANativeBlock(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

		$this->assertStringContainsString(
			'.wp-block-button.kb-variant--secondary{'
				. '--global-palette-btn-bg:var(--kb-token--variant--core-button--secondary--button-bg);',
			$css
		);
		$this->assertStringNotContainsString( '.wp-block-core-button', $css );
	}

	/**
	 * The $default (primary) is re-emitted on the class-less block selector, so a button with no variant
	 * selected still shows its preset look.
	 *
	 * @return void
	 */
	public function testItEmitsTheDefaultPresetOnTheBareSelector(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

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
	 * button-radius is bound css_var only (no slot), so it never reaches a --global-* declaration or a
	 * variant var (a property bound to no slot is dropped before emission).
	 *
	 * @return void
	 */
	public function testItSkipsAPropertyBoundToNoSlot(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

		$this->assertStringNotContainsString( 'button-radius', $css );
	}

	/**
	 * @return void
	 */
	public function testItIsEmptyWhenNoVariantSetsAreRegistered(): void {
		$this->assertSame( '', $this->builder( new Token_Registry() )->css( [ 'default' ], 'default' ) );
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

		$this->assertSame( '', $this->builder( $registry )->css( [ 'default' ], 'default' ) );
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
