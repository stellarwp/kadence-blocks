<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Default_Css;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the block-default CSS builder against the real shipped Image `$default`, proving it emits a
 * low-specificity, block-scoped rule pointing the bound css_prop at the token variable — the mechanism
 * used for dimensions (radius) KB renders as literals with no ownable variable.
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
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitTheImageRadiusRule(): void {
		// Build from the real registry (declarations loaded on init). Image radius is the css_prop-bound case
		// that fits this projector: the attribute is empty by default and rendered as CSS in both editor and
		// front end. Button radius (own 3px default) and icon size (rendered as inline SVG width/height, never
		// empty) do not fit it, so the shipped declarations bind only the image and emit no rule for them.
		$registry = $this->container->get( Token_Registry::class );

		$css = $this->builder( $registry )->css();

		$this->assertStringContainsString( '.wp-block-kadence-image img{border-radius:var(', $css );
		$this->assertStringNotContainsString( '.wp-block-kadence-advancedbtn', $css );
		$this->assertStringNotContainsString( '.wp-block-kadence-icon', $css );
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
		$this->assertStringNotContainsString( '.wp-block-kadence-imageimg', $css );
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
