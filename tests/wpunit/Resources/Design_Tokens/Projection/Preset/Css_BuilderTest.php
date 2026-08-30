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
	 * A binding declaring a `css_state` is emitted as a real declaration scoped to the preset class plus the
	 * state suffix, rather than as a custom-property retarget on the block root.
	 *
	 * @return void
	 */
	public function testItEmitsAStateRuleForAStateBinding(): void {
		$this->seedStatePresets();

		$css = $this->builder( $this->stateRegistry() )->css( 'default' );

		$this->assertStringContainsString(
			':where(.wp-block-kadence-state-fixture).kb-preset--flare:hover *.kb-svg-icon-wrap'
				. '{color:var(--kb-token--preset--kadence-state-fixture--flare--color-hover);}',
			$css
		);
	}

	/**
	 * A state binding never reaches the block-root retarget layer: it has no variable of the block's own to
	 * point at, so nothing about it appears inside the `.kb-preset--<preset>` rule itself.
	 *
	 * @return void
	 */
	public function testAStateBindingIsNotEmittedAsAVarRetarget(): void {
		$this->seedStatePresets();

		$css = $this->builder( $this->stateRegistry() )->css( 'default' );

		$this->assertStringContainsString(
			'.wp-block-kadence-state-fixture.kb-preset--flare{'
				. '--kb-icon-color:var(--kb-token--preset--kadence-state-fixture--flare--color);}',
			$css
		);
		$this->assertStringNotContainsString( '--kb-icon-color-hover', $css );
	}

	/**
	 * The `$default` preset's state rule carries no preset class, so a block with no preset selected still
	 * shows its default preset's state — the same treatment the retarget layer gives the `$default`.
	 *
	 * @return void
	 */
	public function testTheDefaultPresetsStateRuleIsClassLess(): void {
		$this->seedStatePresets();

		$css = $this->builder( $this->stateRegistry() )->css( 'default' );

		$this->assertStringContainsString(
			':where(.wp-block-kadence-state-fixture):hover *.kb-svg-icon-wrap'
				. '{color:var(--kb-token--preset--kadence-state-fixture--glow--color-hover);}',
			$css
		);
	}

	/**
	 * The editor build re-scopes a state rule to the binding's `editor_css_state`, so a block whose canvas
	 * markup paints a different element than its saved markup still previews the state.
	 *
	 * @return void
	 */
	public function testTheEditorBuildUsesTheEditorStateSelector(): void {
		$this->seedStatePresets();

		$css = $this->builder( $this->stateRegistry() )->editor_css( 'default' );

		$this->assertStringContainsString(
			':where(.wp-block-kadence-state-fixture).kb-preset--flare:hover *.kt-svg-icon'
				. '{color:var(--kb-token--preset--kadence-state-fixture--flare--color-hover);}',
			$css
		);
		$this->assertStringNotContainsString( ':hover *.kb-svg-icon-wrap', $css );
	}

	/**
	 * A state property's value still lives in the canonical `:root` preset var the state rule references, so
	 * it keeps its alias indirection and follows the active library exactly as every other property does.
	 *
	 * @return void
	 */
	public function testAStateBindingStillDefinesItsCanonicalPresetVar(): void {
		$this->seedStatePresets();

		$css = $this->builder( $this->stateRegistry() )->css( 'default' );

		$this->assertStringContainsString(
			'--kb-token--preset--kadence-state-fixture--flare--color-hover:var(--kb-token--semantic--color--link);',
			$css
		);
	}

	/**
	 * A `css_state` naming several states, comma separated, scopes EACH part by the block and preset. Left
	 * undistributed, a selector list would apply its leading compound to the first part only, so every part
	 * after it would match the whole document.
	 *
	 * @return void
	 */
	public function testItScopesEveryPartOfAMultiStateSelector(): void {
		$this->seedStatePresets();

		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/state-fixture',
				'bindings' => [
					'color-hover' => [
						'token'     => 'semantic.color.icon',
						'css_prop'  => 'color',
						'css_state' => '*.kb-button:hover,*.kb-button:focus',
					],
				],
			]
		);

		$this->assertStringContainsString(
			':where(.wp-block-kadence-state-fixture).kb-preset--flare *.kb-button:hover,'
				. ':where(.wp-block-kadence-state-fixture).kb-preset--flare *.kb-button:focus'
				. '{color:var(--kb-token--preset--kadence-state-fixture--flare--color-hover);}',
			$this->builder( $registry )->css( 'default' )
		);
	}

	/**
	 * A state binding that names no `css_prop` has no declaration to emit — the state rule IS that
	 * declaration — so it contributes nothing rather than an empty rule.
	 *
	 * @return void
	 */
	public function testAStateBindingWithoutACssPropContributesNothing(): void {
		$this->seedStatePresets();

		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/state-fixture',
				'bindings' => [
					'color-hover' => [
						'token'     => 'semantic.color.icon',
						'css_state' => ':hover *.kb-svg-icon-wrap',
					],
				],
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
	 * A per-corner dimension property's base declaration emits four corner-specific vars (top, right,
	 * bottom, left) plus the canonical var, now composed purely from var() references to those four —
	 * the technique the whole projection change hinges on.
	 *
	 * @return void
	 */
	public function testItEmitsFourCornerVarsPlusAComposedVarForAPerCornerDimensionProperty(): void {
		$this->seedPerCornerPreset();

		$css = $this->builder( $this->registry )->css( 'default' );

		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--corners--button-radius--top:var(--kb-token--semantic--radius--control);', $css );
		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--corners--button-radius--right:4px;', $css );
		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--corners--button-radius--bottom:var(--kb-token--semantic--radius--media);', $css );
		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--corners--button-radius--left:2px;', $css );
		$this->assertStringContainsString(
			'--kb-token--preset--kadence-singlebtn--corners--button-radius:'
				. 'var(--kb-token--preset--kadence-singlebtn--corners--button-radius--top) '
				. 'var(--kb-token--preset--kadence-singlebtn--corners--button-radius--right) '
				. 'var(--kb-token--preset--kadence-singlebtn--corners--button-radius--bottom) '
				. 'var(--kb-token--preset--kadence-singlebtn--corners--button-radius--left);',
			$css
		);
	}

	/**
	 * The bridge (--kb-btn-radius) keeps pointing at the composed var by its unchanged name — the public
	 * contract every block's own CSS/SCSS already consumes is untouched by the corner-var plumbing
	 * underneath it.
	 *
	 * @return void
	 */
	public function testTheBridgeStillPointsAtTheComposedVarForAPerCornerProperty(): void {
		$this->seedPerCornerPreset();

		$css = $this->builder( $this->registry )->css( 'default' );

		$this->assertStringContainsString(
			'--kb-btn-radius:var(--kb-token--preset--kadence-singlebtn--corners--button-radius);',
			$css
		);
	}

	/**
	 * A sparse responsive override (only the top corner touched, the other three left as `''` gaps by the
	 * resolver) redeclares ONLY the touched corner var inside its @media block — never the untouched
	 * corners, and never the composed var, so the untouched corners keep inheriting live.
	 *
	 * @return void
	 */
	public function testResponsiveBlocksRedeclareOnlyTheTouchedCornerForASparseOverride(): void {
		$this->seedPerCornerPreset(
			[
				'tablet' => [ '{semantic.radius.media}', '', '', '' ],
			]
		);

		$css = $this->builder( $this->registry )->css( 'default', $this->breakpoints() );

		$this->assertStringContainsString(
			'@media all and (max-width: 1024px){:root,:root:where(.kb-tokens){'
				. '--kb-token--preset--kadence-singlebtn--corners--button-radius--top:var(--kb-token--semantic--radius--media);'
				. '}}',
			$css
		);

		// Extract the tablet media block and confirm the other three corners, and the composed var, are
		// never redeclared inside it.
		$tablet_block = $this->extractMediaBlock( $css, '(max-width: 1024px)' );

		$this->assertStringNotContainsString( '--button-radius--right:', $tablet_block );
		$this->assertStringNotContainsString( '--button-radius--bottom:', $tablet_block );
		$this->assertStringNotContainsString( '--button-radius--left:', $tablet_block );
		$this->assertStringNotContainsString( '--kb-token--preset--kadence-singlebtn--corners--button-radius:', $tablet_block );
	}

	/**
	 * Regression guard: a property that is NOT a per-corner dimension (button-bg, a color-kind property)
	 * emits exactly the single declaration it always has — no corner vars, no composed-var restructuring —
	 * proving the corner-var technique is scoped strictly to per-corner dimension properties.
	 *
	 * @return void
	 */
	public function testNonPerCornerPropertiesAreUnaffectedByTheCornerVarChange(): void {
		$css = $this->builder( $this->registry )->css( 'default' );

		$this->assertStringContainsString( '--kb-token--preset--kadence-singlebtn--primary--button-bg:var(--kb-token--semantic--color--button-primary-bg);', $css );
		$this->assertStringNotContainsString( '--kb-token--preset--kadence-singlebtn--primary--button-bg--top', $css );
		$this->assertStringNotContainsString( '--kb-token--preset--kadence-singlebtn--primary--button-bg--right', $css );
	}

	/**
	 * Regression guard: a fully-set per-corner property with no gaps at any breakpoint resolves to the
	 * SAME four values it always did — the composed var's value is built purely from var() references to
	 * the four corner vars, and those corner vars, read back together in order, reproduce exactly the
	 * original joined shorthand the pre-corner-var projection would have emitted as a single declaration.
	 *
	 * @return void
	 */
	public function testAFullySetPerCornerResponsiveOverrideResolvesToTheSameFourValues(): void {
		$this->seedPerCornerPreset(
			[
				'tablet' => [ '2px', '4px', '6px', '8px' ],
			]
		);

		$css = $this->builder( $this->registry )->css( 'default', $this->breakpoints() );

		$tablet_block = $this->extractMediaBlock( $css, '(max-width: 1024px)' );

		// All four corners are redeclared (a fully-set override touches every corner)...
		$this->assertStringContainsString( '--button-radius--top:2px;', $tablet_block );
		$this->assertStringContainsString( '--button-radius--right:4px;', $tablet_block );
		$this->assertStringContainsString( '--button-radius--bottom:6px;', $tablet_block );
		$this->assertStringContainsString( '--button-radius--left:8px;', $tablet_block );
		// ...but the composed var is never redeclared: it keeps resolving through the same var() chain the
		// base declaration already set up, which now points at these freshly-redeclared corner values.
		$this->assertStringNotContainsString( '--kb-token--preset--kadence-singlebtn--corners--button-radius:', $tablet_block );
	}

	/**
	 * A responsive override whose every slot is a gap declares nothing, so its breakpoint contributes no
	 * `@media` block at all rather than an empty one.
	 *
	 * @return void
	 */
	public function testAnAllGapResponsiveOverrideEmitsNoMediaBlock(): void {
		$this->seedPerCornerPreset(
			[
				'tablet' => [ '', '', '', '' ],
			]
		);

		$css = $this->builder( $this->registry )->css( 'default', $this->breakpoints() );

		$this->assertStringNotContainsString( '@media all and (max-width: 1024px)', $css );
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
	 * An icon preset whose size varies by breakpoint projects the same way a button's radius does: a
	 * scoped rule pointing `--kb-icon-size` at the canonical preset var, and a media block redeclaring
	 * that var per breakpoint. Proves a SCALAR dimension on a block other than the Button reaches the
	 * responsive layer, which is what lets an icon preset say what the block's own per-device size
	 * control says.
	 *
	 * @return void
	 */
	public function testAnIconPresetsSizeVariesByBreakpoint(): void {
		$this->store->save_document(
			(string) wp_json_encode(
				[
					'$extensions' => [
						'com.kadence.designTokens' => [
							'presets' => [
								'kadence/single-icon' => [
									'compact' => [
										'label'  => 'Compact',
										'tokens' => [
											'size' => [
												'$value'      => '2rem',
												'$extensions' => [
													'com.kadence.designTokens' => [
														'responsive' => [ 'mobile' => '1rem' ],
													],
												],
											],
										],
									],
								],
							],
						],
					],
				]
			),
			Token_Store::default_slug()
		);

		$css = $this->builder( $this->registry )->css( 'default', $this->breakpoints() );

		// The base value, and the scoped rule that points the block's own variable at it.
		$this->assertStringContainsString( '--kb-token--preset--kadence-single-icon--compact--size:2rem;', $css );
		$this->assertStringContainsString(
			'.wp-block-kadence-single-icon.kb-preset--compact{--kb-icon-size:var(--kb-token--preset--kadence-single-icon--compact--size);}',
			$css
		);

		// The mobile override redeclares the canonical var INSIDE the breakpoint's media block — asserted
		// with the enclosing braces so a bare declaration sitting outside one could not satisfy it.
		$this->assertStringContainsString(
			'){:root,:root:where(.kb-tokens){--kb-token--preset--kadence-single-icon--compact--size:1rem;}}',
			$css
		);
		$this->assertStringContainsString( '@media', $css );
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

	/**
	 * Persist a "corners" button preset whose radius is a per-corner slot list, optionally with a
	 * responsive override at one or more breakpoints (also slot lists, possibly with `''` gap corners).
	 *
	 * @param array<string, array<int, string>> $responsive Breakpoint => four-slot override.
	 *
	 * @return void
	 */
	private function seedPerCornerPreset( array $responsive = [] ): void {
		$tokens = [
			'$value' => [ '{semantic.radius.control}', '4px', '{semantic.radius.media}', '2px' ],
		];

		if ( $responsive !== [] ) {
			$tokens['$extensions'] = [
				'com.kadence.designTokens' => [
					'responsive' => $responsive,
				],
			];
		}

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						'kadence/singlebtn' => [
							'corners' => [
								'label'  => 'Corners',
								'tokens' => [
									'button-radius' => $tokens,
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
	 * Extract the `@media all and <query>{...}` block for one query from a built CSS string, or an empty
	 * string when no such block is present — a small parsing helper so a test can assert what is, and is
	 * not, redeclared inside ONE specific breakpoint's block without the assertion being confused by a
	 * sibling breakpoint's block.
	 *
	 * @param string $css   The full generated CSS.
	 * @param string $query The media-query string the block was opened with (e.g. "(max-width: 1024px)").
	 *
	 * @return string
	 */
	private function extractMediaBlock( string $css, string $query ): string {
		$needle = '@media all and ' . $query . '{';
		$start  = strpos( $css, $needle );

		if ( $start === false ) {
			return '';
		}

		$start += strlen( $needle );
		$end    = strpos( $css, '}}', $start );

		return $end === false ? '' : substr( $css, $start, $end - $start );
	}

	/**
	 * A registry binding one resting property and one state property on a block the baseline knows nothing
	 * about, so the state assertions read only what {@see self::seedStatePresets()} put there.
	 *
	 * The state binding declares a different `editor_css_state` than its `css_state` on purpose: that is the
	 * only thing separating the front-end build from the editor one, so it is what the editor test needs.
	 *
	 * @return Token_Registry
	 */
	private function stateRegistry(): Token_Registry {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/state-fixture',
				'bindings' => [
					'color'       => [
						'token'        => 'semantic.color.icon',
						'css_prop'     => 'color',
						'css_selector' => '*.kb-svg-icon-wrap',
						'css_var'      => 'kb-icon-color',
					],
					'color-hover' => [
						'token'            => 'semantic.color.icon',
						'css_prop'         => 'color',
						'css_state'        => ':hover *.kb-svg-icon-wrap',
						'editor_css_state' => ':hover *.kt-svg-icon',
					],
				],
			]
		);

		return $registry;
	}

	/**
	 * Store two presets for the state fixture block — a `$default` ("glow") and a named one ("flare") — each
	 * setting both the resting color and the state color, so one build exercises the class-less rule and the
	 * preset-classed one together.
	 *
	 * @return void
	 */
	private function seedStatePresets(): void {
		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						'kadence/state-fixture' => [
							'$default' => 'glow',
							'glow'     => [
								'label'  => 'Glow',
								'tokens' => [
									'color'       => '{semantic.color.icon}',
									'color-hover' => '{semantic.color.text}',
								],
							],
							'flare'    => [
								'label'  => 'Flare',
								'tokens' => [
									'color'       => '{semantic.color.icon}',
									'color-hover' => '{semantic.color.link}',
								],
							],
						],
					],
				],
			],
		];

		$this->store->save_document( (string) wp_json_encode( $document ), Token_Store::default_slug() );
	}
}
