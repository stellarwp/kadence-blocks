<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the selectable-preset CSS builder against the real shipped Button preset set, so these
 * assertions also guard the Button wiring: the button-specific --global-palette-btn-* slot retargeting,
 * the per-set namespaced preset-var indirection, the active-alias layer, the client-side switch selector,
 * and the class-less $default rule.
 */
final class Css_BuilderTest extends TestCase {

	private Token_Registry $registry;

	private Preset_Resolver $resolver;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
		$this->resolver = $this->container->get( Preset_Resolver::class );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		// The Preset_Resolver leans on the shared Token_Resolver singleton, whose per-slug memo is not
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
	 * Each preset's value lives as a per-set namespaced token var that preserves the alias indirection
	 * inside the set (var(--kb-token--<set>--<semantic>)), and the canonical preset var is pointed at the
	 * active set's namespaced one by the alias layer — so a token edit flows through the chain live and the
	 * preset follows the active set.
	 *
	 * @return void
	 */
	public function testItDefinesThePresetVarsNamespacedWithAnAliasLayer(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

		// The namespaced preset var chains to that set's namespaced semantic.
		$this->assertStringContainsString( '--kb-token--default--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--default--semantic--color--button-primary-bg);', $css );
		$this->assertStringContainsString( '--kb-token--default--preset--kadence-singlebtn--secondary--button-bg:var(--kb-token--default--semantic--color--button-secondary-bg);', $css );

		// The canonical preset var is pointed at the active set's namespaced preset var (the alias layer).
		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--default--preset--kadence-singlebtn--primary--button-bg);', $css );
	}

	/**
	 * Every set is emitted simultaneously: both namespaces carry their preset vars, and each set has a
	 * [data-kb-token-set] switch selector re-pointing the canonical preset var, so a body class swaps the
	 * preset palette client-side.
	 *
	 * @return void
	 */
	public function testItEmitsEverySetNamespacedWithASwitchSelector(): void {
		$css = $this->builder( $this->registry )->css( [ 'default', 'dark' ], 'default' );

		// Both sets' namespaced preset vars are present (dark resolves from baseline here, namespaced).
		$this->assertStringContainsString( '--kb-token--default--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--default--semantic--color--button-primary-bg);', $css );
		$this->assertStringContainsString( '--kb-token--dark--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--dark--semantic--color--button-primary-bg);', $css );

		// The dark switch selector re-points the canonical preset var at the dark namespace.
		$this->assertStringContainsString(
			'[data-kb-token-set="dark"]{',
			$css
		);
		$this->assertStringContainsString(
			'--kb-token--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--dark--preset--kadence-singlebtn--primary--button-bg);',
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
			substr_count( $css, '--kb-token--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--dark--preset--kadence-singlebtn--primary--button-bg);' )
		);
		$this->assertSame(
			1,
			substr_count( $css, '--kb-token--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--default--preset--kadence-singlebtn--primary--button-bg);' )
		);
	}

	/**
	 * A named preset retargets the button's own --global-palette-btn-* slots (the vars the button render
	 * path consumes), not the numbered palette, at the canonical preset var — so it follows the alias /
	 * switch layers.
	 *
	 * @return void
	 */
	public function testItRetargetsButtonSlotsForANamedPreset(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

		$this->assertStringContainsString(
			'.wp-block-kadence-singlebtn.kb-preset--secondary{'
				. '--global-palette-btn-bg:var(--kb-token--preset--kadence-singlebtn--secondary--button-bg);'
				. '--global-palette-btn:var(--kb-token--preset--kadence-singlebtn--secondary--button-text);'
				. '--global-palette-btn-bg-hover:var(--kb-token--preset--kadence-singlebtn--secondary--button-bg-hover);'
				. '--global-palette-btn-hover:var(--kb-token--preset--kadence-singlebtn--secondary--button-text-hover);'
				. '--kb-btn-radius:var(--kb-token--preset--kadence-singlebtn--secondary--button-radius);}',
			$css
		);
	}

	/**
	 * The $default (primary) is re-emitted on the class-less block selector, so a button with no preset
	 * selected still shows its preset look.
	 *
	 * @return void
	 */
	public function testItEmitsTheDefaultPresetOnTheBareSelector(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

		$this->assertStringContainsString(
			'.wp-block-kadence-singlebtn{'
				. '--global-palette-btn-bg:var(--kb-token--preset--kadence-singlebtn--primary--button-bg);'
				. '--global-palette-btn:var(--kb-token--preset--kadence-singlebtn--primary--button-text);'
				. '--global-palette-btn-bg-hover:var(--kb-token--preset--kadence-singlebtn--primary--button-bg-hover);'
				. '--global-palette-btn-hover:var(--kb-token--preset--kadence-singlebtn--primary--button-text-hover);'
				. '--kb-btn-radius:var(--kb-token--preset--kadence-singlebtn--primary--button-radius);}',
			$css
		);
	}

	/**
	 * button-radius is bound with a css_var (no palette slot), so a selected preset sets the --kb-btn-radius
	 * variable the button's border-radius reads — via the scoped rule and a per-preset var in the namespaced
	 * block — so the radius can vary per preset rather than being dropped.
	 *
	 * @return void
	 */
	public function testItProjectsACssVarBindingToItsVariable(): void {
		$css = $this->builder( $this->registry )->css( [ 'default' ], 'default' );

		// The scoped rule points --kb-btn-radius at the per-preset var.
		$this->assertStringContainsString(
			'--kb-btn-radius:var(--kb-token--preset--kadence-singlebtn--secondary--button-radius);',
			$css
		);
		// The namespaced block defines that per-preset var for the set.
		$this->assertStringContainsString(
			'--kb-token--default--preset--kadence-singlebtn--secondary--button-radius:',
			$css
		);
	}

	/**
	 * A preset that exists only in a NON-active set (a user-created preset on the "dark" set, absent from
	 * the active "default" set) still gets its scoped ".kb-preset--<slug>" retarget rule, so a block placed
	 * on that set applies the preset. The rule is emitted from the dark set's fragment — the active set has
	 * no such preset — while the dark switch selector re-points the canonical var at the dark value.
	 *
	 * @return void
	 */
	public function testItEmitsTheScopedRuleForAPresetOnlyInANonActiveSet(): void {
		$this->seedDarkPreset();

		// Building only the default (active) set never sees the dark-only preset, so no rule is emitted.
		$default_only = $this->builder( $this->registry )->css( [ 'default' ], 'default' );
		$this->assertStringNotContainsString( '.kb-preset--midnight{', $default_only );

		// Building both sets with default active: the scoped retarget rule comes from the dark fragment.
		$css = $this->builder( $this->registry )->css( [ 'default', 'dark' ], 'default' );

		$this->assertStringContainsString(
			'.wp-block-kadence-singlebtn.kb-preset--midnight{'
				. '--global-palette-btn-bg:var(--kb-token--preset--kadence-singlebtn--midnight--button-bg);',
			$css
		);
		// The dark switch selector re-points the canonical midnight var at the dark namespace.
		$this->assertStringContainsString(
			'--kb-token--preset--kadence-singlebtn--midnight--button-bg:var(--kb-token--dark--preset--kadence-singlebtn--midnight--button-bg);',
			$css
		);
	}

	/**
	 * @return void
	 */
	public function testItIsEmptyWhenNoPresetSetsAreRegistered(): void {
		$this->assertSame( '', $this->builder( new Token_Registry() )->css( [ 'default' ], 'default' ) );
	}

	/**
	 * A registered binding for a block the baseline has no presets for contributes nothing, rather than
	 * failing the whole build.
	 *
	 * @return void
	 */
	public function testItSkipsABlockWhoseDocumentDefinesNoPresets(): void {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/not-in-baseline',
				'bindings' => [ 'button-bg' => [ 'kadence_slot' => 'palette1' ] ],
			]
		);

		$this->assertSame( '', $this->builder( $registry )->css( [ 'default' ], 'default' ) );
	}

	/**
	 * Build the CSS builder with a given registry and the real (baseline-backed) preset resolver.
	 *
	 * @param Token_Registry $registry The registry to build from.
	 *
	 * @return Css_Builder
	 */
	private function builder( Token_Registry $registry ): Css_Builder {
		return new Css_Builder( $registry, $this->resolver );
	}

	/**
	 * Persist a user-created "midnight" button preset into the "dark" token set only, so it is absent from
	 * the active "default" set.
	 *
	 * @return void
	 */
	private function seedDarkPreset(): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						'kadence/singlebtn' => [
							'midnight' => [
								'label'  => 'Midnight',
								'tokens' => [
									'button-bg'         => '#0b1020',
									'button-text'       => '#ffffff',
									'button-bg-hover'   => '#1a2540',
									'button-text-hover' => '#ffffff',
									'button-radius'     => '0.5rem',
								],
							],
						],
					],
				],
			],
		];

		$store->save_document( (string) wp_json_encode( $document ), 'dark' );
	}
}
