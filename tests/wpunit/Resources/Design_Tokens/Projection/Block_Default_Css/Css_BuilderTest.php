<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Default_Css;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Monolog\Handler\TestHandler;
use KadenceWP\KadenceBlocks\Monolog\Logger;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\Psr\Log\NullLogger;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the block-default CSS builder against the real shipped declarations, proving it emits
 * low-specificity, block-scoped rules pointing each bound css_prop at its token variable — the mechanism
 * used for the surfaces KB renders as literals with no ownable variable (image background/border/border
 * width/radius/shadow/padding, Row Layout / Column color + radius).
 */
final class Css_BuilderTest extends TestCase {

	/**
	 * @var Preset_Resolver
	 */
	private Preset_Resolver $resolver;

	/**
	 * @var Token_Resolver
	 */
	private Token_Resolver $token_resolver;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->resolver       = $this->container->get( Preset_Resolver::class );
		$this->token_resolver = $this->container->get( Token_Resolver::class );
	}

	/**
	 * @return void
	 */
	public function testItEmitsALowSpecificityRulePointingTheCssPropAtTheTokenVar(): void {
		$var = Css_Var::from_id( 'semantic.radius.media' );

		// Image's $default binds borderRadius to semantic.radius.media (resolves to 0 via radius.none).
		$css = $this->builder( $this->image_registry() )->css();

		// One rule on a single .wp-block-* class plus the " img" descendant, the resolved length as the
		// var() fallback — so the block's own (higher-specificity) radius always wins when set.
		$this->assertStringContainsString(
			'.wp-block-kadence-image img{border-radius:var(' . $var . ',0);}',
			$css
		);
	}

	/**
	 * The shipped Image declarations emit every color/border/shadow/radius surface bound to the rendered
	 * `<img>` as one grouped, low-specificity rule (background, border color, border width, radius, shadow),
	 * plus a separate padding rule on the `.kb-img` wrapper — each pointing the css_prop at its token var with
	 * the resolved default as the fallback, so a fresh image is unchanged and any user value wins by
	 * specificity. Margin is deliberately absent: the image has no clean token delivery for it.
	 *
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitTheImageSurfaceRules(): void {
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		// The <img> surfaces group into one rule, opening with the first bound property (background-color).
		$this->assertStringContainsString(
			'.wp-block-kadence-image img{' . $this->declaration( 'background-color', 'kb-img-bg', 'semantic.color.image-bg', 'transparent' ),
			$css
		);
		$this->assertStringContainsString( $this->declaration( 'border-color', 'kb-img-border-color', 'semantic.color.border', '#E2E8F0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-width', 'kb-img-border-width', 'semantic.border-width.default', '1px' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-radius', 'kb-img-radius', 'semantic.radius.media', '0' ), $css );

		// Padding is rendered on the `.kb-img` descendant, so it gets its own rule.
		$this->assertStringContainsString(
			'.wp-block-kadence-image *.kb-img{' . $this->declaration( 'padding', 'kb-img-padding', 'semantic.spacing.media-padding', '0' ) . '}',
			$css
		);

		// The block-default projector emits no margin rule for the image (no css_prop binding) and no rule
		// for blocks the shipped declarations don't bind (button, the legacy icon container).
		$this->assertStringNotContainsString( '.wp-block-kadence-image img{margin', $css );
		$this->assertStringNotContainsString( 'margin:var(', $css );
		$this->assertStringNotContainsString( '.wp-block-kadence-advancedbtn', $css );
	}

	/**
	 * The icon color binding registered for `kadence/single-icon` emits a low-specificity rule pointing the
	 * `.kb-svg-icon-wrap` descendant's `color` at the brand icon-color token, while the legacy `kadence/icon`
	 * container (which has no top-level color/size attribute to bind) emits nothing.
	 *
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitTheSingleIconColorRule(): void {
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-single-icon *.kb-svg-icon-wrap{' . $this->declaration( 'color', 'kb-icon-color', 'semantic.color.icon', '#3182CE' ),
			$css
		);
		$this->assertStringNotContainsString( '.wp-block-kadence-icon ', $css );
	}

	/**
	 * The icon `size` binding emits its font-size fallback onto the same low-specificity descendant rule the
	 * color binding uses, so an icon whose size has been cleared through the token picker still renders at the
	 * icon-size token rather than inheriting whatever font-size surrounds it. A per-instance size renders at
	 * equal specificity but later source order, so it still wins.
	 *
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitTheSingleIconSizeFallback(): void {
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		// Grouped into the same `.kb-svg-icon-wrap` rule as color, with the resolved length as the fallback.
		$this->assertStringContainsString(
			$this->declaration( 'font-size', 'kb-icon-size', 'semantic.icon-size.default', '1.5rem' ),
			$css
		);
		$this->assertStringContainsString( '.wp-block-kadence-single-icon *.kb-svg-icon-wrap{', $css );
	}

	/**
	 * The legacy `kadence/icon` container (the pre-3.0 `icons[]` array shape) has no top-level
	 * `color`/`size` attribute to bind, so none of the preset-binding wiring — all of which keys off the
	 * `kadence/single-icon` child block — ever registers preset bindings for `kadence/icon` and the builder
	 * emits no rule scoped to it, confirming the legacy shape stays unaffected after this ticket's changes.
	 *
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitNoRuleForTheLegacyIconBlock(): void {
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		$this->assertStringNotContainsString( '.wp-block-kadence-icon.', $css );
		$this->assertStringNotContainsString( '.wp-block-kadence-icon ', $css );
		$this->assertStringNotContainsString( '.wp-block-kadence-icon{', $css );
	}

	/**
	 * The Image shadow binding proves a composite `shadow` token with an aliased color field resolves end
	 * to end through this projector: the shipped `semantic.shadow.media` (color `{primitive.color.transparent}`,
	 * zero offsets/blur/spread) flattens and renders to `0px 0px 0px 0px transparent` as the box-shadow rule's
	 * var() fallback — invisible, matching an image's off-by-default box shadow, and overridable to any shadow.
	 *
	 * @return void
	 */
	public function testTheShippedImageShadowResolvesAComposedShadowWithAnAliasedColor(): void {
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		$this->assertStringContainsString(
			$this->declaration( 'box-shadow', 'kb-img-shadow', 'semantic.shadow.media', '0px 0px 0px 0px transparent' ),
			$css
		);
	}

	/**
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitTheRowLayoutAndColumnColorRules(): void {
		// Row Layout / Column follow the tokens through a low-specificity block-default rule: the row on the
		// block root, the column on its inner `.kt-inside-inner-col` child. Background follows each block's own
		// background token (which aliases the transparent primitive, so an uncustomized block stays transparent
		// — KB's own default).
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-rowlayout{' . $this->declaration( 'background-color', 'kb-row-bg', 'semantic.color.rowlayout-bg', 'transparent' ),
			$css
		);
		$this->assertStringContainsString( $this->declaration( 'border-radius', 'kb-row-radius', 'semantic.radius.rowlayout', '0' ), $css );
		$this->assertStringContainsString(
			'.wp-block-kadence-column> .kt-inside-inner-col{' . $this->declaration( 'background-color', 'kb-col-bg', 'semantic.color.column-bg', 'transparent' ),
			$css
		);
		$this->assertStringContainsString( $this->declaration( 'border-radius', 'kb-col-radius', 'semantic.radius.column', '0' ), $css );
	}

	/**
	 * The shipped Advanced Text (heading) declarations emit all 12 bound core-design and typography
	 * properties as one grouped, low-specificity rule on the block root, each pointing its css_prop at the
	 * matching token var with the resolved default as the fallback. Font FAMILY is deliberately not among
	 * them — a family is a favorite, not a token, so an unset heading inherits the theme's font.
	 *
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitTheAdvancedHeadingSurfaceRule(): void {
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-advancedheading{' . $this->declaration( 'color', 'kb-heading-color', 'semantic.color.text', '#1A202C' ),
			$css
		);
		$this->assertStringContainsString(
			$this->declaration( 'background-color', 'kb-heading-bg', 'semantic.color.heading-bg', 'transparent' ),
			$css
		);
		$this->assertStringContainsString( $this->declaration( 'font-size', 'kb-heading-font-size', 'semantic.font-size.heading', '2rem' ), $css );
		$this->assertStringContainsString( $this->declaration( 'line-height', 'kb-heading-line-height', 'semantic.line-height.heading', '1.125' ), $css );
		$this->assertStringContainsString( $this->declaration( 'font-weight', 'kb-heading-font-weight', 'semantic.font-weight.heading', '400' ), $css );
		$this->assertStringContainsString( $this->declaration( 'letter-spacing', 'kb-heading-letter-spacing', 'semantic.letter-spacing.heading', '0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'text-transform', 'kb-heading-text-transform', 'semantic.text-transform.heading', 'none' ), $css );
		$this->assertStringContainsString( $this->declaration( 'padding', 'kb-heading-padding', 'semantic.spacing.heading-padding', '0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-color', 'kb-heading-border-color', 'semantic.color.border', '#E2E8F0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-width', 'kb-heading-border-width', 'semantic.border-width.default', '1px' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-radius', 'kb-heading-radius', 'semantic.radius.heading', '0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-style', 'kb-heading-border-style', 'semantic.border-style.default', 'none' ) . '}', $css );
		$this->assertStringNotContainsString( 'font-family:', $css, 'A heading inherits the theme font; no font-family default is emitted.' );
	}

	/**
	 * In the editor, useBlockProps() puts `.wp-block-kadence-advancedheading` on a wrapper <div>, not on the
	 * heading element the bindings style — the real heading carries the stable `kadence-advancedheading-text`
	 * class instead. The declared `editor_selector` re-targets the editor build of the rule at that
	 * descendant, scoped under `.editor-styles-wrapper` so it still outranks the theme's own per-tag element
	 * styles there, while still carrying every one of the block's 12 bound declarations.
	 *
	 * @return void
	 */
	public function testTheEditorBuildRetargetsTheAdvancedHeadingRuleAtTheRealHeadingElement(): void {
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->editor_css();

		$this->assertStringContainsString(
			'.editor-styles-wrapper .wp-block-kadence-advancedheading .kadence-advancedheading-text{' . $this->declaration( 'color', 'kb-heading-color', 'semantic.color.text', '#1A202C' ),
			$css
		);
		$this->assertStringContainsString(
			$this->declaration( 'background-color', 'kb-heading-bg', 'semantic.color.heading-bg', 'transparent' ),
			$css
		);
		$this->assertStringContainsString( $this->declaration( 'font-size', 'kb-heading-font-size', 'semantic.font-size.heading', '2rem' ), $css );
		$this->assertStringContainsString( $this->declaration( 'line-height', 'kb-heading-line-height', 'semantic.line-height.heading', '1.125' ), $css );
		$this->assertStringContainsString( $this->declaration( 'font-weight', 'kb-heading-font-weight', 'semantic.font-weight.heading', '400' ), $css );
		$this->assertStringContainsString( $this->declaration( 'letter-spacing', 'kb-heading-letter-spacing', 'semantic.letter-spacing.heading', '0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'text-transform', 'kb-heading-text-transform', 'semantic.text-transform.heading', 'none' ), $css );
		$this->assertStringContainsString( $this->declaration( 'padding', 'kb-heading-padding', 'semantic.spacing.heading-padding', '0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-color', 'kb-heading-border-color', 'semantic.color.border', '#E2E8F0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-width', 'kb-heading-border-width', 'semantic.border-width.default', '1px' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-radius', 'kb-heading-radius', 'semantic.radius.heading', '0' ), $css );
		$this->assertStringContainsString( $this->declaration( 'border-style', 'kb-heading-border-style', 'semantic.border-style.default', 'none' ) . '}', $css );
		$this->assertStringNotContainsString( 'font-family:', $css, 'A heading inherits the theme font; no font-family default is emitted.' );

		// The front-end rule for the SAME block must stay on the block root, with no editor-only prefix.
		$this->assertStringNotContainsString( '.editor-styles-wrapper', $this->builder( $registry )->css() );
	}

	/**
	 * The Section renders its background, border and radius on `.kt-inside-inner-col` when saved but on
	 * `.kadence-inner-column-inner` in the editor canvas, so its bindings declare an `editor_css_selector`
	 * and the two builds target different descendants of the same block root. Without the override the
	 * editor build would carry the saved-markup class, which does not exist in the canvas, and a column's
	 * default look would reach the front end while the editor showed the block's own unstyled markup.
	 *
	 * @return void
	 */
	public function testTheEditorBuildRetargetsTheColumnRuleAtTheEditorsOwnInnerElement(): void {
		$registry = $this->container->get( Token_Registry::class );

		$editor = $this->builder( $registry )->editor_css();
		$front  = $this->builder( $registry )->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-column> .kadence-inner-column-inner{' . $this->declaration( 'background-color', 'kb-col-bg', 'semantic.color.column-bg', 'transparent' ),
			$editor
		);
		$this->assertStringContainsString( $this->declaration( 'border-radius', 'kb-col-radius', 'semantic.radius.column', '0' ), $editor );

		// Each build carries only its own surface's class — neither leaks the other's.
		$this->assertStringNotContainsString( '.wp-block-kadence-column> .kt-inside-inner-col', $editor );
		$this->assertStringNotContainsString( '.wp-block-kadence-column> .kadence-inner-column-inner', $front );
	}

	/**
	 * A binding declaring no `editor_css_selector` reuses its front-end `css_selector` in the editor, which
	 * is the right answer for every block whose two render paths agree — the Row Layout sits on the block
	 * root in both, and the Image's `img` descendant exists in both.
	 *
	 * @return void
	 */
	public function testABindingWithNoEditorCssSelectorReusesItsFrontEndSelector(): void {
		$registry = $this->container->get( Token_Registry::class );

		$editor = $this->builder( $registry )->editor_css();

		$this->assertStringContainsString(
			'.wp-block-kadence-rowlayout{' . $this->declaration( 'background-color', 'kb-row-bg', 'semantic.color.rowlayout-bg', 'transparent' ),
			$editor
		);
		$this->assertStringContainsString( '.wp-block-kadence-image img{', $editor );
	}

	/**
	 * A block whose Preset_Bindings declares no `editor_selector` (e.g. Image) must emit an editor build
	 * byte-for-byte identical to its front-end build — no `.editor-styles-wrapper` prefix and no
	 * re-targeting — so blocks without the wrapper-div problem see zero regression from this mechanism. Uses
	 * an isolated registry (rather than the shipped one) so the assertion is not diluted by the shipped
	 * Advanced Heading declaration, which DOES declare an `editor_selector` and legitimately diverges.
	 *
	 * @return void
	 */
	public function testABlockWithNoEditorSelectorEmitsIdenticalFrontEndAndEditorCss(): void {
		$builder = $this->builder( $this->image_registry() );

		$this->assertSame( $builder->css(), $builder->editor_css() );
		$this->assertStringContainsString( '.wp-block-kadence-image img{border-radius:var(', $builder->editor_css() );
		$this->assertStringNotContainsString( '.editor-styles-wrapper', $builder->editor_css() );
	}

	/**
	 * @return void
	 */
	public function testItContributesNothingForABindingWithoutACssProp(): void {
		// A block_attr-only binding (the block-preset path) declares no css_prop, so it feeds no rule here.
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/advancedbtn',
				'bindings' => [
					'button-bg' => [
						'token'      => 'semantic.color.button-bg',
						'block_attr' => 'background',
					],
				],
			]
		);

		$this->assertSame( '', $this->builder( $registry )->css() );
	}

	/**
	 * @return void
	 */
	public function testItInsertsTheDescendantCombinatorForABareCssSelector(): void {
		$var = Css_Var::from_id( 'semantic.radius.media' );

		// A bare `img` selector must not need a load-bearing leading space: the builder inserts the
		// descendant combinator, so it produces the same rule as the explicit ` img` form.
		$css = $this->builder( $this->image_registry() )->css();

		$this->assertStringContainsString( '.wp-block-kadence-image img{border-radius:var(' . $var . ',0);}', $css );
		$this->assertStringNotContainsString( '.wp-block-kadence-imageimg', $css ); // cspell:disable-line -- Checking for invalid selector.
	}

	/**
	 * A binding whose `token` id is not backed by the resolved library emits no declaration for that control
	 * at all — not even a `var()` with a literal fallback — so the block falls back to its own native
	 * default CSS, and the mismatch is logged via the injected logger.
	 *
	 * @return void
	 */
	public function testItSkipsAndLogsABindingReferencingAnUnresolvedToken(): void {
		$handler = new TestHandler();
		$logger  = new Logger( 'test' );
		$logger->pushHandler( $handler );

		$css = $this->builder( $this->unresolved_token_registry(), $logger )->css();

		// No declaration is emitted for the control: no rule for the block, no dead var() with a fallback.
		$this->assertSame( '', $css );
		$this->assertStringNotContainsString( 'border-radius:var(', $css );

		// The mismatch is logged, naming the offending block and the unresolved token id.
		$this->assertTrue( $handler->hasErrorThatContains( 'unresolved token id' ) );
		$this->assertTrue( $handler->hasErrorThatContains( 'semantic.radius.gone' ) );
		$this->assertTrue( $handler->hasErrorThatContains( 'kadence/image' ) );
	}

	/**
	 * A binding that declares a css_var alongside its css_prop wraps the declaration in that variable, so a
	 * selected preset (which sets `--<css_var>` on the block root) can vary a property delivered as a
	 * block-default rule. The token variable stays the fallback, so nothing changes until a preset sets it.
	 *
	 * @return void
	 */
	public function testACssVarBindingWrapsTheDeclarationInThePresetVariable(): void {
		$var = Css_Var::from_id( 'semantic.radius.media' );

		$css = $this->builder( $this->image_registry( 'kb-img-radius' ) )->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-image img{border-radius:var(--kb-img-radius,var(' . $var . ',0));}',
			$css
		);
	}

	/**
	 * The wrapper is opt-in: a binding that declares no css_var emits the bare token variable exactly as it
	 * did before the wrapper existed. This is what keeps an un-migrated block's output byte-identical.
	 *
	 * @return void
	 */
	public function testABindingWithoutACssVarEmitsTheUnwrappedTokenVariable(): void {
		$var = Css_Var::from_id( 'semantic.radius.media' );

		$css = $this->builder( $this->image_registry() )->css();

		// Asserted whole rather than by substring: the point is that NOTHING wraps the token variable, which a
		// containment check on the inner value could not tell apart from the wrapped form.
		$this->assertSame( '.wp-block-kadence-image img{border-radius:var(' . $var . ',0);}', $css );
	}

	/**
	 * The declaration a shipped binding emits: the token variable with its resolved literal as the
	 * fallback, wrapped in the KB-owned custom property the binding declares so a selected preset can vary
	 * it. Every shipped `css_prop` binding declares a `css_var`, so this is the shape they all take.
	 *
	 * @param string $prop     The CSS property.
	 * @param string $css_var  The binding's KB-owned custom property, without its leading `--`.
	 * @param string $token_id The referenced token id.
	 * @param string $literal  The resolved literal that backs the token variable.
	 *
	 * @return string The declaration, with its trailing semicolon.
	 */
	private function declaration( string $prop, string $css_var, string $token_id, string $literal ): string {
		return $prop . ':var(--' . $css_var . ',var(' . Css_Var::from_id( $token_id ) . ',' . $literal . '));';
	}

	/**
	 * Build the builder with a given registry and the real (baseline-backed) preset resolver.
	 *
	 * @param Token_Registry       $registry The registry whose preset bindings the builder reads.
	 * @param LoggerInterface|null $logger   The logger to inject; defaults to a NullLogger so tests that do
	 *                                       not assert on logging are unaffected.
	 *
	 * @return Css_Builder
	 */
	private function builder( Token_Registry $registry, ?LoggerInterface $logger = null ): Css_Builder {
		return new Css_Builder( $registry, $this->resolver, $this->token_resolver, $logger ?? new NullLogger() );
	}

	/**
	 * A registry holding the media-radius token and the Image preset bindings binding borderRadius to it via a
	 * css_prop target, so the builder emits the block-default radius rule.
	 *
	 * @param string|null $css_var The KB-owned custom property the binding drives (without its leading `--`),
	 *                             or null to declare none.
	 *
	 * @return Token_Registry
	 */
	private function image_registry( ?string $css_var = null ): Token_Registry {
		$binding = [
			'token'        => 'semantic.radius.media',
			'css_prop'     => 'border-radius',
			'css_selector' => 'img',
		];

		if ( $css_var !== null ) {
			$binding['css_var'] = $css_var;
		}

		$registry = new Token_Registry();
		$registry->register(
			[
				'id'    => 'semantic.radius.media',
				'type'  => 'dimension',
				'label' => 'Media Radius',
			]
		);
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/image',
				'bindings' => [
					'borderRadius' => $binding,
				],
			]
		);

		return $registry;
	}

	/**
	 * A registry that binds the Image `borderRadius` css_prop to a token id the resolved library does not
	 * back (`semantic.radius.gone` has no baseline entry), so the builder resolves a default literal for the
	 * control (from the shipped document's `$default` preset) but finds the binding's token unresolved —
	 * exercising the skip-and-log path. Mirrors {@see self::image_registry()} but points the binding at an
	 * unbacked token id.
	 *
	 * @return Token_Registry
	 */
	private function unresolved_token_registry(): Token_Registry {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => 'kadence/image',
				'bindings' => [
					'borderRadius' => [
						'token'        => 'semantic.radius.gone',
						'css_prop'     => 'border-radius',
						'css_selector' => 'img',
					],
				],
			]
		);

		return $registry;
	}
}
