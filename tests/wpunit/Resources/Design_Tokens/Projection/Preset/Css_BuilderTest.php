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
 * Exercises the selectable-preset CSS builder against the real shipped Button preset bindings, so these
 * assertions also guard the Button wiring: the button-specific --global-palette-btn-* slot retargeting, the
 * canonical preset-var definitions for the active library, and the class-less $default rule. Only the active
 * library is emitted — no per-library namespaced vars, no alias layer, no client-side switch selector.
 */
final class Css_BuilderTest extends TestCase {

	private Token_Registry $registry;

	private Preset_Resolver $resolver;

	private Token_Store $store;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->container->get( Token_Registry::class );
		$this->resolver = $this->container->get( Preset_Resolver::class );
		$this->store    = $this->container->get( Token_Store::class );
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
	 * Each preset's value lives as a canonical token var that preserves the alias indirection
	 * (var(--kb-token--<semantic>)), so a token edit flows through the chain live and the preset follows the
	 * active library.
	 *
	 * @return void
	 */
	public function testItDefinesThePresetVarsCanonically(): void {
		$css = $this->builder( $this->registry )->css( 'default' );

		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--semantic--color--button-primary-bg);', $css );
		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--secondary--button-bg:var(--kb-token--semantic--color--button-secondary-bg);', $css );
	}

	/**
	 * The collapsed builder emits no per-library namespaced `--kb-token--<library>--preset--*` vars and no
	 * `[data-kb-token-set]` switch selectors — only the active library's canonical preset vars and scoped rules.
	 *
	 * @return void
	 */
	public function testItEmitsNoNamespacedVarsOrSwitchSelectors(): void {
		$css = $this->builder( $this->registry )->css( 'default' );

		$this->assertStringNotContainsString( '--kb-token--default--', $css );
		$this->assertStringNotContainsString( '[data-kb-token-set', $css );
	}

	/**
	 * A named preset retargets the button's own --global-palette-btn-* slots (the vars the button render
	 * path consumes), not the numbered palette, at the canonical preset var.
	 *
	 * @return void
	 */
	public function testItRetargetsButtonSlotsForANamedPreset(): void {
		$css = $this->builder( $this->registry )->css( 'default' );

		$this->assertStringContainsString(
			'.wp-block-kadence-singlebtn.kb-preset--secondary{'
				. '--global-palette-btn-bg:var(--kb-token--preset--kadence-singlebtn--secondary--button-bg);'
				. '--global-palette-btn:var(--kb-token--preset--kadence-singlebtn--secondary--button-text);'
				. '--global-palette-btn-bg-hover:var(--kb-token--preset--kadence-singlebtn--secondary--button-bg-hover);'
				. '--global-palette-btn-hover:var(--kb-token--preset--kadence-singlebtn--secondary--button-text-hover);'
				. '--kb-btn-radius:var(--kb-token--preset--kadence-singlebtn--secondary--button-radius);'
				. '--kb-btn-border-width:var(--kb-token--preset--kadence-singlebtn--secondary--button-border-width);'
				. '--kb-btn-border-style:var(--kb-token--preset--kadence-singlebtn--secondary--button-border-style);'
				. '--kb-btn-border-color:var(--kb-token--preset--kadence-singlebtn--secondary--button-border-color);'
				. '--kb-btn-padding:var(--kb-token--preset--kadence-singlebtn--secondary--button-padding);'
				. '--kb-btn-margin:var(--kb-token--preset--kadence-singlebtn--secondary--button-margin);}',
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
		$css = $this->builder( $this->registry )->css( 'default' );

		$this->assertStringContainsString(
			'.wp-block-kadence-singlebtn{'
				. '--global-palette-btn-bg:var(--kb-token--preset--kadence-singlebtn--primary--button-bg);'
				. '--global-palette-btn:var(--kb-token--preset--kadence-singlebtn--primary--button-text);'
				. '--global-palette-btn-bg-hover:var(--kb-token--preset--kadence-singlebtn--primary--button-bg-hover);'
				. '--global-palette-btn-hover:var(--kb-token--preset--kadence-singlebtn--primary--button-text-hover);'
				. '--kb-btn-radius:var(--kb-token--preset--kadence-singlebtn--primary--button-radius);'
				. '--kb-btn-border-width:var(--kb-token--preset--kadence-singlebtn--primary--button-border-width);'
				. '--kb-btn-border-style:var(--kb-token--preset--kadence-singlebtn--primary--button-border-style);'
				. '--kb-btn-border-color:var(--kb-token--preset--kadence-singlebtn--primary--button-border-color);'
				. '--kb-btn-padding:var(--kb-token--preset--kadence-singlebtn--primary--button-padding);'
				. '--kb-btn-margin:var(--kb-token--preset--kadence-singlebtn--primary--button-margin);}',
			$css
		);
	}

	/**
	 * button-radius is bound with a css_var (no palette slot), so a selected preset sets the --kb-btn-radius
	 * variable the button's border-radius reads — via the scoped rule and a per-preset canonical var — so the
	 * radius can vary per preset rather than being dropped.
	 *
	 * @return void
	 */
	public function testItProjectsACssVarBindingToItsVariable(): void {
		$css = $this->builder( $this->registry )->css( 'default' );

		// The scoped rule points --kb-btn-radius at the per-preset var.
		$this->assertStringContainsString(
			'--kb-btn-radius:var(--kb-token--preset--kadence-singlebtn--secondary--button-radius);',
			$css
		);
		// The canonical block defines that per-preset var.
		$this->assertStringContainsString(
			'--kb-token--preset--kadence-singlebtn--secondary--button-radius:',
			$css
		);
	}

	/**
	 * A preset that exists only in a NON-active library (a user-created preset on the "dark" library) is not emitted
	 * while "default" is active: only the active library's presets reach output.
	 *
	 * @return void
	 */
	public function testItEmitsOnlyTheActiveLibraryPresets(): void {
		$this->seedDarkPreset();

		// Default is active, so the dark-only "midnight" preset contributes nothing.
		$css = $this->builder( $this->registry )->css( 'default' );

		$this->assertStringNotContainsString( '.kb-preset--midnight{', $css );
		$this->assertStringNotContainsString( '--kb-token--preset--kadence-singlebtn--midnight--', $css );
	}

	/**
	 * With no preset bindings registered, the builder emits nothing.
	 *
	 * @return void
	 */
	public function testItIsEmptyWhenNoPresetBindingsAreRegistered(): void {
		$this->assertSame( '', $this->builder( new Token_Registry() )->css( 'default' ) );
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

		$this->assertSame( '', $this->builder( $registry )->css( 'default' ) );
	}

	/**
	 * Build the CSS builder with a given registry and the real (baseline-backed) preset resolver.
	 *
	 * @param Token_Registry $registry The registry to build from.
	 *
	 * @return Css_Builder
	 */
	private function builder( Token_Registry $registry ): Css_Builder {
		return new Css_Builder( $registry, $this->resolver, $this->store );
	}

	/**
	 * A preset property that varies by breakpoint redeclares its preset var inside that breakpoint's
	 * @media block. The block-level slot bridge is untouched — it already points at the preset var, so
	 * overriding the var is enough for the breakpoint to take effect.
	 *
	 * @return void
	 */
	public function testItRedeclaresAPresetVarInsideItsBreakpointMediaBlock(): void {
		$this->seedResponsivePreset();

		$css = $this->builder( $this->registry )->css( 'default', $this->breakpoints() );

		$this->assertStringContainsString(
			'@media all and (max-width: 767px){:root,:root:where(.kb-tokens){--kb-token--preset--kadence-singlebtn--hero--button-radius:2px;}}',
			$css
		);
		// The base value still lives in the flat, non-media declaration.
		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--hero--button-radius:8px;', $css );
	}

	/**
	 * An aliased override keeps its var() indirection inside the media block, so a token edit still reaches
	 * that breakpoint live.
	 *
	 * @return void
	 */
	public function testAnAliasedOverrideKeepsItsVarIndirectionInTheMediaBlock(): void {
		$this->seedResponsivePreset( [ 'tablet' => '{semantic.radius.control}' ] );

		$css = $this->builder( $this->registry )->css( 'default', $this->breakpoints() );

		$this->assertStringContainsString(
			'@media all and (max-width: 1024px){:root,:root:where(.kb-tokens){--kb-token--preset--kadence-singlebtn--hero--button-radius:var(--kb-token--semantic--radius--control);}}',
			$css
		);
	}

	/**
	 * A library whose presets declare no breakpoint overrides emits no media blocks at all, so every
	 * existing preset projects byte-identically.
	 *
	 * @return void
	 */
	public function testItEmitsNoMediaBlocksWithoutResponsivePresets(): void {
		$this->assertStringNotContainsString( '@media', $this->builder( $this->registry )->css( 'default', $this->breakpoints() ) );
	}

	/**
	 * The breakpoint => media-query map a projector passes at emit time.
	 *
	 * @return array<string, string>
	 */
	private function breakpoints(): array {
		return [
			'tablet' => '(max-width: 1024px)',
			'mobile' => '(max-width: 767px)',
		];
	}

	/**
	 * Persist a "hero" button preset whose radius varies by breakpoint into the active library.
	 *
	 * @param array<string, mixed> $responsive Breakpoint => override value.
	 *
	 * @return void
	 */
	private function seedResponsivePreset( array $responsive = [ 'mobile' => '2px' ] ): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						'kadence/singlebtn' => [
							'hero' => [
								'label'  => 'Hero',
								'tokens' => [
									'button-radius' => [
										'$value'      => '8px',
										'$extensions' => [
											'com.kadence.designTokens' => [
												'responsive' => $responsive,
											],
										],
									],
								],
							],
						],
					],
				],
			],
		];

		$this->store->save_document( (string) wp_json_encode( $document ), Token_Store::default_slug() );
	}

	/**
	 * Persist a user-created "midnight" button preset into the "dark" token library only, so it is absent from
	 * the active "default" library.
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
