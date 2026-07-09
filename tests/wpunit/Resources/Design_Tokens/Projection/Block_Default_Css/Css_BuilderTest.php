<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Default_Css;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the block-default CSS builder against the real shipped declarations, proving it emits
 * low-specificity, block-scoped rules pointing each bound css_prop at its token variable — the mechanism
 * used for the surfaces KB renders as literals with no ownable variable (image background/border/border
 * width/radius/shadow/padding, Row Layout / Column color + radius).
 */
final class Css_BuilderTest extends TestCase {

	/**
	 * @var Variant_Resolver
	 */
	private Variant_Resolver $resolver;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
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
			'.wp-block-kadence-image img{background-color:var(' . Css_Var::from_id( 'semantic.color.image-bg' ) . ',transparent);',
			$css
		);
		$this->assertStringContainsString( 'border-color:var(' . Css_Var::from_id( 'semantic.color.border' ) . ',#E2E8F0);', $css );
		$this->assertStringContainsString( 'border-width:var(' . Css_Var::from_id( 'semantic.border-width.default' ) . ',1px);', $css );
		$this->assertStringContainsString( 'border-radius:var(' . Css_Var::from_id( 'semantic.radius.media' ) . ',0);', $css );

		// Padding is rendered on the `.kb-img` descendant, so it gets its own rule.
		$this->assertStringContainsString(
			'.wp-block-kadence-image *.kb-img{padding:var(' . Css_Var::from_id( 'semantic.spacing.media-padding' ) . ',0);}',
			$css
		);

		// The block-default projector emits no margin rule for the image (no css_prop binding) and no rule
		// for blocks the shipped declarations don't bind (button, the legacy icon container).
		$this->assertStringNotContainsString( '.wp-block-kadence-image img{margin', $css );
		$this->assertStringNotContainsString( 'margin:var(', $css );
		$this->assertStringNotContainsString( '.wp-block-kadence-advancedbtn', $css );
		$this->assertStringNotContainsString( '.wp-block-kadence-icon', $css );
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
			'box-shadow:var(' . Css_Var::from_id( 'semantic.shadow.media' ) . ',0px 0px 0px 0px transparent);',
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
		// — KB's own default); border color follows the brand border token.
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		$this->assertStringContainsString(
			'.wp-block-kadence-rowlayout{background-color:var(' . Css_Var::from_id( 'semantic.color.rowlayout-bg' ),
			$css
		);
		$this->assertStringContainsString( 'border-color:var(' . Css_Var::from_id( 'semantic.color.border' ), $css );
		$this->assertStringContainsString( 'border-radius:var(' . Css_Var::from_id( 'semantic.radius.rowlayout' ), $css );
		$this->assertStringContainsString(
			'.wp-block-kadence-column> .kt-inside-inner-col{background-color:var(' . Css_Var::from_id( 'semantic.color.column-bg' ),
			$css
		);
		$this->assertStringContainsString( 'border-radius:var(' . Css_Var::from_id( 'semantic.radius.column' ), $css );
	}

	/**
	 * @return void
	 */
	public function testItContributesNothingForABindingWithoutACssProp(): void {
		// A block_attr-only binding (the block-preset path) declares no css_prop, so it feeds no rule here.
		$registry = new Token_Registry();
		$registry->register_variant_set(
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
	 * Build the builder with a given registry and the real (baseline-backed) variant resolver.
	 *
	 * @param Token_Registry $registry The registry whose variant sets the builder reads.
	 *
	 * @return Css_Builder
	 */
	private function builder( Token_Registry $registry ): Css_Builder {
		return new Css_Builder( $registry, $this->resolver );
	}

	/**
	 * A registry holding the media-radius token and the Image variant set binding borderRadius to it via a
	 * css_prop target, so the builder emits the block-default radius rule.
	 *
	 * @return Token_Registry
	 */
	private function image_registry(): Token_Registry {
		$registry = new Token_Registry();
		$registry->register(
			[
				'id'    => 'semantic.radius.media',
				'type'  => 'dimension',
				'label' => 'Media Radius',
			]
		);
		$registry->register_variant_set(
			[
				'block'    => 'kadence/image',
				'bindings' => [
					'borderRadius' => [
						'token'        => 'semantic.radius.media',
						'css_prop'     => 'border-radius',
						'css_selector' => 'img',
					],
				],
			]
		);

		return $registry;
	}
}
