<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Variants;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the selectable-variant CSS builder against the real shipped Button variant set, so these
 * assertions also guard the Button wiring: the button-specific --global-palette-btn-* slot retargeting,
 * the per-set namespaced variant-var indirection, the active-alias layer, the client-side switch selector,
 * and the class-less $default rule.
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

	/**
	 * Each (group, variant) value lives as a per-set namespaced token var whose name folds in the group, so
	 * two axes never collide on a shared property.
	 *
	 * @return void
	 */
	public function testItFoldsTheGroupIntoTheVariantVar(): void {
		$css = $this->grouped_builder()->css( [ 'default' ], 'default' );

		$this->assertStringContainsString( '--kb-token--default--variant--kadence-grouped-btn--color--secondary--button-bg:#111111;', $css );
		$this->assertStringContainsString( '--kb-token--default--variant--kadence-grouped-btn--hover--bold--button-bg-hover:#000000;', $css );
	}

	/**
	 * A grouped selection scopes to a "kb-variant--<group>--<variant>" class, so two independently chosen
	 * axes compose as two classes on one block.
	 *
	 * @return void
	 */
	public function testItScopesEachGroupedVariantToItsGroupClass(): void {
		$css = $this->grouped_builder()->css( [ 'default' ], 'default' );

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
		$css = $this->grouped_builder()->css( [ 'default' ], 'default' );

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
		$css = $this->overlapping_builder()->css( [ 'default' ], 'default' );

		$first  = strpos( $css, '--kb-token--variant--kadence-overlap-btn--first--one--button-bg)' );
		$second = strpos( $css, '--kb-token--variant--kadence-overlap-btn--second--two--button-bg)' );

		$this->assertNotFalse( $first );
		$this->assertNotFalse( $second );
		$this->assertGreaterThan( $first, $second, 'The later group must follow the earlier one in source order.' );
	}

	/**
	 * Two variant sets (groups) on one block reuse the SAME variant slug ("primary") and are active
	 * alongside each other — each emitting its own "kb-variant--<set>--primary" class. Each set sets its own
	 * property (Fill's "fill-color", Type's "type-color") on the block's shared bindings, so the shared slug
	 * resolves through each set's own binding to a different --global-<slot>. Every Fill variant maps through
	 * Fill's binding, every Type variant through Type's.
	 *
	 * @return void
	 */
	public function testTwoVariantSetsShareASlugWithTheirOwnBindings(): void {
		$css = $this->dual_set_builder()->css( [ 'default' ], 'default' );

		$this->assertStringContainsString(
			'.wp-block-kadence-dual-btn.kb-variant--fill--primary{'
				. '--global-palette-btn-bg:var(--kb-token--variant--kadence-dual-btn--fill--primary--fill-color);}',
			$css
		);
		$this->assertStringContainsString(
			'.wp-block-kadence-dual-btn.kb-variant--type--primary{'
				. '--global-palette-btn:var(--kb-token--variant--kadence-dual-btn--type--primary--type-color);}',
			$css
		);

		// The two same-slug vars are distinct and carry each set's own value.
		$this->assertStringContainsString( '--kb-token--default--variant--kadence-dual-btn--fill--primary--fill-color:#111111;', $css );
		$this->assertStringContainsString( '--kb-token--default--variant--kadence-dual-btn--type--primary--type-color:#222222;', $css );
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

		return new Css_Builder( $registry, $this->fixture_resolver( $document ) );
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

		return new Css_Builder( $registry, $this->fixture_resolver( $document ) );
	}

	/**
	 * Build the CSS builder over a block with two variant sets (fill, type) that each define a "primary"
	 * variant. The block's one bindings map holds each axis's own property (fill-color, type-color) bound to
	 * a different slot, so the shared "primary" slug resolves through each set's own binding — no per-group
	 * binding table is needed.
	 *
	 * @return Css_Builder
	 */
	private function dual_set_builder(): Css_Builder {
		$block = 'kadence/dual-btn';

		$registry = new Token_Registry();
		$registry->register_variant_set(
			[
				'block'    => $block,
				// One block-level bindings map holds every axis's property; each axis sets only its own.
				'bindings' => [
					'fill-color' => [ 'kadence_slot' => 'palette-btn-bg' ],
					'type-color' => [ 'kadence_slot' => 'palette-btn' ],
				],
				'groups'   => [
					'fill' => [ 'label' => 'Fill' ],
					'type' => [ 'label' => 'Type' ],
				],
			]
		);

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'variants' => [
						$block => [
							'fill' => [
								'$default'  => 'primary',
								'primary'   => [
									'label'  => 'Primary',
									'tokens' => [ 'fill-color' => '#111111' ],
								],
								'secondary' => [
									'label'  => 'Secondary',
									'tokens' => [ 'fill-color' => '#1a1a1a' ],
								],
							],
							'type' => [
								'$default' => 'primary',
								'primary'  => [
									'label'  => 'Primary',
									'tokens' => [ 'type-color' => '#222222' ],
								],
								'bold'     => [
									'label'  => 'Bold',
									'tokens' => [ 'type-color' => '#2a2a2a' ],
								],
							],
						],
					],
				],
			],
		];

		return new Css_Builder( $registry, $this->fixture_resolver( $document ) );
	}

	/**
	 * Build a Variant_Resolver over a controllable baseline fixture document, through a real
	 * Effective_Variants (no stored overrides for the fixture blocks). The fixture's literal values never
	 * reach the Token_Resolver.
	 *
	 * @param array<string, mixed> $document The fake baseline document.
	 *
	 * @return Variant_Resolver
	 */
	private function fixture_resolver( array $document ): Variant_Resolver {
		$variants = new Effective_Variants(
			new Fake_Baseline_Document( $document ),
			$this->container->get( Token_Store::class ),
			$this->container->get( Mutator::class )
		);

		return new Variant_Resolver( $variants, $this->container->get( Token_Resolver::class ) );
	}
}
