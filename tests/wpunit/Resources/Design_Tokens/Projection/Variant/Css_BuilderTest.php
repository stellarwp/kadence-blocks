<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the selectable-variant CSS builder against the real shipped Button variant set, so these
 * assertions also guard the Button wiring: the button-specific --global-palette-btn-* slot retargeting,
 * the variant-var indirection, and the class-less $default rule.
 *
 * The grouped (multi-axis) cases run against a controllable baseline fixture — a button with two orthogonal
 * axes, "color" (base fill slots) and "hover" (hover slots) — so they guard the grouped class/var shape and
 * the per-group $default for axes that compose cleanly. A separate, deliberately misconfigured fixture (two
 * axes on one slot) guards the source-order tie-break. Literal token values keep that CSS deterministic.
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

		$this->assertStringContainsString( '--kb-token--variant--kadence-singlebtn--primary--button-bg:#3633e1;', $css );
		$this->assertStringContainsString( '--kb-token--variant--kadence-singlebtn--primary--button-bg-hover:#2f2ffc;', $css );
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
	 * core/button reuses the same --global-palette-btn-* retarget as the Kadence button; its selector
	 * strips the "core/" namespace to ".wp-block-button" (not ".wp-block-core-button").
	 *
	 * @return void
	 */
	public function testItRetargetsButtonSlotsForANativeBlock(): void {
		$css = $this->builder( $this->registry )->css();

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
	 * Each (group, variant) value lives as a co-emitted global token var whose name folds in the group, so
	 * two axes never collide on a shared property.
	 *
	 * @return void
	 */
	public function testItFoldsTheGroupIntoTheVariantVar(): void {
		$css = $this->grouped_builder()->css();

		$this->assertStringContainsString( '--kb-token--variant--kadence-grouped-btn--color--secondary--button-bg:#111111;', $css );
		$this->assertStringContainsString( '--kb-token--variant--kadence-grouped-btn--hover--bold--button-bg-hover:#000000;', $css );
	}

	/**
	 * A grouped selection scopes to a "kb-variant--<group>--<variant>" class, so two independently chosen
	 * axes compose as two classes on one block.
	 *
	 * @return void
	 */
	public function testItScopesEachGroupedVariantToItsGroupClass(): void {
		$css = $this->grouped_builder()->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-grouped-btn.kb-variant--color--secondary{'
				. '--global-palette-btn-bg:var(--kb-token--variant--kadence-grouped-btn--color--secondary--button-bg);'
				. '--global-palette-btn:var(--kb-token--variant--kadence-grouped-btn--color--secondary--button-text);}',
			$css
		);

		$this->assertStringContainsString(
			'.wp-block-kadence-grouped-btn.kb-variant--hover--bold{'
				. '--global-palette-btn-bg-hover:var(--kb-token--variant--kadence-grouped-btn--hover--bold--button-bg-hover);'
				. '--global-palette-btn-hover:var(--kb-token--variant--kadence-grouped-btn--hover--bold--button-text-hover);}',
			$css
		);
	}

	/**
	 * Each group re-emits its own $default on the class-less block selector, so a block with no selection
	 * still shows every axis's preset.
	 *
	 * @return void
	 */
	public function testItEmitsAClassLessDefaultPerGroup(): void {
		$css = $this->grouped_builder()->css();

		// color $default is "primary".
		$this->assertStringContainsString(
			'.wp-block-kadence-grouped-btn{--global-palette-btn-bg:var(--kb-token--variant--kadence-grouped-btn--color--primary--button-bg);',
			$css
		);
		// hover $default is "subtle".
		$this->assertStringContainsString(
			'.wp-block-kadence-grouped-btn{--global-palette-btn-bg-hover:var(--kb-token--variant--kadence-grouped-btn--hover--subtle--button-bg-hover);',
			$css
		);
	}

	/**
	 * Orthogonal axes never share a slot, but should two groups be configured to retarget the same
	 * --global-<slot>, their selected-variant rules carry equal specificity, so source order breaks the
	 * tie: groups are emitted in document order, so the later group wins deterministically.
	 *
	 * @return void
	 */
	public function testTheLaterGroupWinsForASharedSlot(): void {
		$css = $this->overlapping_builder()->css();

		$first  = strpos( $css, '--kb-token--variant--kadence-overlap-btn--first--one--button-bg)' );
		$second = strpos( $css, '--kb-token--variant--kadence-overlap-btn--second--two--button-bg)' );

		$this->assertNotFalse( $first );
		$this->assertNotFalse( $second );
		$this->assertGreaterThan( $first, $second, 'The later group must follow the earlier one in source order.' );
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

	/**
	 * Build the CSS builder over a controllable grouped baseline fixture and a registry that binds each
	 * axis's slots. The two axes are ORTHOGONAL — "color" retargets the base fill slots (palette-btn-bg /
	 * palette-btn), "hover" retargets the hover slots (palette-btn-bg-hover / palette-btn-hover) — so one
	 * selection per axis composes cleanly without either overwriting the other.
	 *
	 * @return Css_Builder
	 */
	private function grouped_builder(): Css_Builder {
		$block = 'kadence/grouped-btn';

		$registry = new Token_Registry();
		$registry->register_variant_set(
			[
				'block'    => $block,
				'bindings' => [
					'button-bg'         => [ 'kadence_slot' => 'palette-btn-bg' ],
					'button-text'       => [ 'kadence_slot' => 'palette-btn' ],
					'button-bg-hover'   => [ 'kadence_slot' => 'palette-btn-bg-hover' ],
					'button-text-hover' => [ 'kadence_slot' => 'palette-btn-hover' ],
				],
				'groups'   => [
					'color' => [ 'label' => 'Color' ],
					'hover' => [ 'label' => 'Hover' ],
				],
			]
		);

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'variants' => [
						$block => [
							'color' => [
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
							'hover' => [
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
					],
				],
			],
		];

		$resolver = new Variant_Resolver(
			new Fake_Baseline_Document( $document ),
			$this->container->get( Token_Resolver::class )
		);

		return new Css_Builder( $registry, $resolver );
	}

	/**
	 * Build the CSS builder over a deliberately MISCONFIGURED fixture: two axes that both retarget the same
	 * slot (palette-btn-bg). Orthogonal axes never share a slot, but the projector must still resolve a
	 * conflict deterministically, which is the source-order tie-break this exercises.
	 *
	 * @return Css_Builder
	 */
	private function overlapping_builder(): Css_Builder {
		$block = 'kadence/overlap-btn';

		$registry = new Token_Registry();
		$registry->register_variant_set(
			[
				'block'    => $block,
				'bindings' => [ 'button-bg' => [ 'kadence_slot' => 'palette-btn-bg' ] ],
				'groups'   => [
					'first'  => [ 'label' => 'First' ],
					'second' => [ 'label' => 'Second' ],
				],
			]
		);

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'variants' => [
						$block => [
							'first'  => [
								'$default' => 'one',
								'one'      => [
									'label'  => 'One',
									'tokens' => [ 'button-bg' => '#111111' ],
								],
							],
							'second' => [
								'$default' => 'two',
								'two'      => [
									'label'  => 'Two',
									'tokens' => [ 'button-bg' => '#222222' ],
								],
							],
						],
					],
				],
			],
		];

		$resolver = new Variant_Resolver(
			new Fake_Baseline_Document( $document ),
			$this->container->get( Token_Resolver::class )
		);

		return new Css_Builder( $registry, $resolver );
	}
}
