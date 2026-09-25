<?php
// cspell:ignore unseed .

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Singlebtn_Block;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;
use Tests\Support\Classes\KadenceBlocksUnit;
use Tests\Support\Classes\Seeds_Theme_Presets;
use Tests\helpers\CSSTestHelper;
use WP_Block_Supports;

/**
 * Covers `render_preset_border()`/`render_preset_shadow()` — the front end's bridge from a button's
 * selected preset to its rendered border and box-shadow CSS, mirroring `render_preset_spacing()`'s
 * own coverage shape.
 */
class SinglebtnTest extends KadenceBlocksUnit {

	use Seeds_Theme_Presets;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'singlebtn';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Singlebtn_Block
	 */
	protected $block;

	/**
	 * CSS instance.
	 *
	 * @var Kadence_Blocks_CSS
	 */
	protected $css;

	/**
	 * The service container, used to persist token-library presets ahead of a render.
	 *
	 * @var Container
	 */
	protected $container;

	protected function setUp(): void {
		parent::setUp();

		$this->block     = new Kadence_Blocks_Singlebtn_Block();
		$this->css       = new Kadence_Blocks_CSS();
		$this->container = App::instance()->container();
	}

	protected function tearDown(): void {
		$this->unseed_theme_presets();

		parent::tearDown();
	}

	/**
	 * A named, non-`$default` preset ("secondary") that resolves `button-border-width` emits the
	 * property pointed at its preset variable.
	 *
	 * @return void
	 */
	public function testNamedPresetBorderWidthEmitsCssVar(): void {
		$this->seedSecondaryPreset();

		$output = $this->render_button( [ 'kbPreset' => 'secondary' ] );

		$this->assertStringContainsString( 'border-width:var(--kb-btn-border-width)', $output );
	}

	/**
	 * The same named preset's `button-border-style` and `button-border-color` are also emitted.
	 *
	 * @return void
	 */
	public function testNamedPresetBorderStyleAndColorEmitCssVars(): void {
		$this->seedSecondaryPreset();

		$output = $this->render_button( [ 'kbPreset' => 'secondary' ] );

		$this->assertStringContainsString( 'border-style:var(--kb-btn-border-style)', $output );
		$this->assertStringContainsString( 'border-color:var(--kb-btn-border-color)', $output );
	}

	/**
	 * A named preset that resolves `button-shadow` emits box-shadow pointed at its preset variable.
	 *
	 * @return void
	 */
	public function testNamedPresetShadowEmitsCssVar(): void {
		$this->seedPreset(
			'accent',
			'Accent',
			[ 'button-shadow' => '0px 2px 8px 0px #1717171f' ]
		);

		$output = $this->render_button( [ 'kbPreset' => 'accent' ] );

		$this->assertStringContainsString( 'box-shadow:var(--kb-btn-shadow)', $output );
	}

	/**
	 * A preset that defines no border property (only an unrelated one) emits none of the border
	 * `var()` declarations — the `isset()` gate stays closed rather than emitting a dead reference.
	 *
	 * @return void
	 */
	public function testPresetWithNoBorderPropertyEmitsNoBorderVars(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button( [ 'kbPreset' => 'bare' ] );

		$this->assertStringNotContainsString( 'border-width:var(--kb-btn-border-width)', $output );
		$this->assertStringNotContainsString( 'border-style:var(--kb-btn-border-style)', $output );
		$this->assertStringNotContainsString( 'border-color:var(--kb-btn-border-color)', $output );
	}

	/**
	 * A preset that defines no `button-shadow` emits no box-shadow `var()` declaration.
	 *
	 * @return void
	 */
	public function testPresetWithNoShadowPropertyEmitsNoShadowVar(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button( [ 'kbPreset' => 'bare' ] );

		$this->assertStringNotContainsString( 'box-shadow:var(--kb-btn-shadow)', $output );
	}

	/**
	 * An explicit per-instance border still wins over the selected preset's border: the preset's
	 * `var()` declaration lands earlier in the generated rule than the explicit per-side output, so
	 * the plain CSS cascade (same selector, same specificity, later declaration wins) resolves to the
	 * explicit value. Declaration order is asserted directly, not just the final computed value,
	 * because order is the actual mechanism that makes the override work.
	 *
	 * @return void
	 */
	public function testExplicitBorderOverridesPresetBorder(): void {
		$this->seedSecondaryPreset();

		$output = $this->render_button(
			[
				'kbPreset'    => 'secondary',
				'borderStyle' => [
					[
						'top'    => [ '#ff0000', 'dashed', 4 ],
						'right'  => [ '#ff0000', 'dashed', 4 ],
						'bottom' => [ '#ff0000', 'dashed', 4 ],
						'left'   => [ '#ff0000', 'dashed', 4 ],
						'unit'   => 'px',
					],
				],
			]
		);

		$this->assertStringContainsString( 'border-top:4px dashed #ff0000', $output );

		$order             = ( new CSSTestHelper( $output ) )->getPropertyOrder( '.wp-block-kadence-advancedbtn .kb-btn123.kb-button' );
		$preset_position   = array_search( 'border-width', $order, true );
		$explicit_position = array_search( 'border-top', $order, true );

		$this->assertNotFalse( $preset_position, 'The preset border-width var() should still be emitted.' );
		$this->assertNotFalse( $explicit_position, 'The explicit per-instance border should be emitted.' );
		$this->assertLessThan(
			$explicit_position,
			$preset_position,
			'The preset border var() must be emitted before the explicit per-instance border, so the explicit value wins the cascade.'
		);
	}

	/**
	 * An explicit per-instance box-shadow still wins over the selected preset's shadow: both declare
	 * the same `box-shadow` property in the same rule, so the final computed value is whichever comes
	 * last. This asserts both the winning value AND that the preset's declaration precedes it.
	 *
	 * @return void
	 */
	public function testExplicitShadowOverridesPresetShadow(): void {
		$this->seedPreset(
			'accent',
			'Accent',
			[ 'button-shadow' => '0px 2px 8px 0px #1717171f' ]
		);

		$output = $this->render_button(
			[
				'kbPreset'      => 'accent',
				'displayShadow' => true,
				'shadow'        => [
					[
						'color'   => '#00ff00',
						'opacity' => 1,
						'hOffset' => 1,
						'vOffset' => 1,
						'blur'    => 2,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$css_helper = new CSSTestHelper( $output );
		$selector   = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		// `box-shadow` is declared twice in the same rule (preset, then explicit) — the associative
		// collapse `assertCSSPropertiesEqual` does elsewhere would hide that, so declaration order is
		// read directly from the parsed property list instead.
		$shadow_positions = array_keys( $css_helper->getPropertyOrder( $selector ), 'box-shadow', true );

		$this->assertCount( 2, $shadow_positions, 'Both the preset and the explicit box-shadow should be emitted.' );
		$this->assertLessThan(
			$shadow_positions[1],
			$shadow_positions[0],
			'The preset box-shadow var() must be emitted before the explicit per-instance shadow, so the explicit value wins the cascade.'
		);

		// The final computed value is whichever declaration came last — proving the explicit value,
		// not the preset's, is what the button actually renders. Sabberworm's CSS parser canonicalizes
		// a 6-digit hex that can shorten to its 3-digit form when re-serializing, so the shorthand is
		// what assertCSSPropertiesEqual sees even though the block itself renders the literal '#00ff00'.
		$css_helper->assertCSSPropertiesEqual( $selector, [ 'box-shadow' => '1px 1px 2px 0px #0f0' ] );
	}

	/**
	 * A button whose shadow is bound to a token emits that token's custom property as its box-shadow,
	 * so editing the token in the Style Library moves every button that follows it.
	 *
	 * @return void
	 */
	public function testBoundShadowEmitsTokenVar(): void {
		$output = $this->render_button(
			[
				'displayShadow' => true,
				'shadow'        => [
					[
						'shadowToken' => '{semantic.shadow.card}',
						'color'       => '#0f0',
						'opacity'     => 1,
						'hOffset'     => 0,
						'vOffset'     => 2,
						'blur'        => 8,
						'spread'      => 0,
						'inset'       => false,
					],
				],
			]
		);

		$this->assertStringContainsString( 'box-shadow:var(--kb-token--semantic--shadow--card)', $output );
	}

	/**
	 * A shadow item's own axes decide whether `box-shadow` is emitted, with no separate toggle or
	 * sibling boolean attribute gating it.
	 *
	 * @dataProvider shadowVisibilityProvider
	 *
	 * @param array<string, mixed> $shadow_item      The `shadow[0]`-shaped item.
	 * @param bool                 $expected_visible Whether the item should be treated as visible.
	 *
	 * @return void
	 */
	public function testHasVisibleShadow( array $shadow_item, bool $expected_visible ): void {
		$method = new \ReflectionMethod( $this->block, 'has_visible_shadow' );
		$method->setAccessible( true );

		$this->assertSame( $expected_visible, $method->invoke( $this->block, $shadow_item ) );
	}

	/**
	 * Shadow items covering every visible/invisible axis shape `has_visible_shadow()` must tell apart.
	 *
	 * @return Generator
	 */
	public function shadowVisibilityProvider(): \Generator {
		yield 'all-zero axes' => [
			'shadow_item'      => [
				'hOffset' => 0,
				'vOffset' => 0,
				'blur'    => 0,
				'spread'  => 0,
				'color'   => 'transparent',
			],
			'expected_visible' => false,
		];
		yield 'missing axis keys' => [
			'shadow_item'      => [ 'color' => '#000000' ],
			'expected_visible' => false,
		];
		yield 'non-zero blur' => [
			'shadow_item'      => [
				'hOffset' => 0,
				'vOffset' => 0,
				'blur'    => 2,
				'spread'  => 0,
				'color'   => '#000000',
			],
			'expected_visible' => true,
		];

		yield 'token alias on a leg' => [
			'shadow_item'      => [
				'hOffset' => 0,
				'vOffset' => 0,
				'blur'    => '{primitive.shadow.md}',
				'spread'  => 0,
			],
			'expected_visible' => true,
		];

		yield 'empty string legs' => [
			'shadow_item'      => [
				'hOffset' => '',
				'vOffset' => '   ',
				'blur'    => '',
				'spread'  => '',
			],
			'expected_visible' => false,
		];
		yield 'non-zero offset' => [
			'shadow_item'      => [
				'hOffset' => 1,
				'vOffset' => 1,
				'blur'    => 0,
				'spread'  => 0,
				'color'   => '#000000',
			],
			'expected_visible' => true,
		];

		yield 'bound token with zero legs' => [
			'shadow_item'      => [
				'shadowToken' => '{semantic.shadow.card}',
				'color'       => 'transparent',
				'opacity'     => 1,
				'hOffset'     => 0,
				'vOffset'     => 0,
				'blur'        => 0,
				'spread'      => 0,
				'inset'       => false,
			],
			'expected_visible' => true,
		];

		yield 'unbacked bound token with zero legs' => [
			'shadow_item'      => [
				'shadowToken' => '{semantic.shadow.does-not-exist}',
				'color'       => 'transparent',
				'opacity'     => 1,
				'hOffset'     => 0,
				'vOffset'     => 0,
				'blur'        => 0,
				'spread'      => 0,
				'inset'       => false,
			],
			'expected_visible' => false,
		];

		// The legs a binding leaves behind are the value it resolved to at pick time, so a stale binding
		// almost always has non-zero ones. Reading them here would report it visible and keep it in the
		// shadow branch, where its empty render is dropped and the `none` reset never runs — the all-zero
		// case above cannot tell that apart, because zero legs report invisible either way.
		yield 'unbacked bound token with non-zero legs' => [
			'shadow_item'      => [
				'shadowToken' => '{semantic.shadow.does-not-exist}',
				'color'       => '#0f0',
				'opacity'     => 1,
				'hOffset'     => 0,
				'vOffset'     => 2,
				'blur'        => 8,
				'spread'      => 0,
				'inset'       => false,
			],
			'expected_visible' => false,
		];
	}

	/**
	 * An all-zero shadow value — the shape the fixed "None" pick writes — emits an explicit
	 * `box-shadow: none` declaration, actively overriding any competing shadow rule from elsewhere
	 * (e.g. a theme selector) rather than silently omitting the property.
	 *
	 * @return void
	 */
	public function testNoneShadowEmitsExplicitBoxShadowNone(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'      => 'bare',
				'displayShadow' => true,
				'shadow'        => [
					[
						'color'   => 'transparent',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$css_helper = new CSSTestHelper( $output );
		$selector   = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		$css_helper->assertCSSPropertiesEqual( $selector, [ 'box-shadow' => 'none' ] );
	}

	/**
	 * A whole-shadow binding whose token the active library no longer backs emits no `box-shadow` from
	 * the binding and reaches the `box-shadow: none` reset, the same as a button with no shadow at all.
	 * A stale binding must not skip the reset the way a backed one legitimately does.
	 *
	 * @return void
	 */
	public function testStaleShadowBindingReachesTheNoneFallback(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'      => 'bare',
				'displayShadow' => true,
				'shadow'        => [
					[
						'shadowToken' => '{semantic.shadow.does-not-exist}',
						'color'       => '#0f0',
						'opacity'     => 1,
						'hOffset'     => 0,
						'vOffset'     => 2,
						'blur'        => 8,
						'spread'      => 0,
						'inset'       => false,
					],
				],
			]
		);

		$css_helper = new CSSTestHelper( $output );
		$selector   = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		$this->assertStringNotContainsString( 'var(--kb-token--semantic--shadow--does-not-exist)', $output );
		$css_helper->assertCSSPropertiesEqual( $selector, [ 'box-shadow' => 'none' ] );
	}

	/**
	 * A button with a visible base shadow and an invisible hover shadow points the hover rule at the
	 * preset's hover shadow variable, with `none` as the fallback: the hover state follows its own
	 * default, and the base shadow must not carry through the cascade into it.
	 *
	 * @return void
	 */
	public function testUnsetHoverShadowPointsAtThePresetHoverShadowOnHover(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'           => 'bare',
				'colorHover'         => '#0000ff',
				'displayShadow'      => true,
				'shadow'             => [
					[
						'color'   => '#00ff00',
						'opacity' => 1,
						'hOffset' => 1,
						'vOffset' => 1,
						'blur'    => 2,
						'spread'  => 0,
						'inset'   => false,
					],
				],
				'displayHoverShadow' => true,
				'shadowHover'        => [
					[
						'color'   => 'transparent',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$css_helper     = new CSSTestHelper( $output );
		$base_selector  = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';
		$hover_selector = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button:hover, .wp-block-kadence-advancedbtn .kb-btn123.kb-button:focus';

		$css_helper->assertCSSPropertiesEqual( $base_selector, [ 'box-shadow' => '1px 1px 2px 0px #0f0' ] );
		$css_helper->assertCSSPropertiesEqual(
			$hover_selector,
			[
				'color'      => '#00f',
				'box-shadow' => 'var(--kb-btn-shadow-hover, none)',
			]
		);
	}

	/**
	 * A gradient-background button with an invisible (all-zero) hover shadow whose `inset` flag is
	 * `true` skips the gradient-specific inset reset and takes the hover default instead — the reset
	 * lost its `displayHoverShadow` toggle gate along with every other hover site, and must not fire
	 * on an invisible shadow just because `inset` happens to be `true`.
	 *
	 * @return void
	 */
	public function testInvisibleInsetHoverShadowSkipsTheInsetResetOnGradientHover(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'            => 'bare',
				'backgroundHoverType' => 'gradient',
				'gradientHover'       => 'linear-gradient(90deg, #ff0000, #0000ff)',
				'colorHover'          => '#0000ff',
				'displayShadow'       => true,
				'shadow'              => [
					[
						'color'   => '#00ff00',
						'opacity' => 1,
						'hOffset' => 1,
						'vOffset' => 1,
						'blur'    => 2,
						'spread'  => 0,
						'inset'   => false,
					],
				],
				'displayHoverShadow'  => true,
				'shadowHover'         => [
					[
						'color'   => 'transparent',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => true,
					],
				],
			]
		);

		$css_helper     = new CSSTestHelper( $output );
		$hover_selector = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button:hover, .wp-block-kadence-advancedbtn .kb-btn123.kb-button:focus';

		$css_helper->assertCSSPropertiesEqual(
			$hover_selector,
			[
				'color'      => '#00f',
				'box-shadow' => 'var(--kb-btn-shadow-hover, none)',
			]
		);
		$this->assertStringNotContainsString(
			'.kb-btn123.kb-button:hover::before',
			$output,
			'An invisible hover shadow must not trigger the inset reset just because inset is true.'
		);
	}

	/**
	 * A gradient-background button with a visible inset hover shadow paints that shadow on the `::before`
	 * pseudo-element that carries the gradient, and resets the button's own hover box-shadow with `none`
	 * rather than a transparent zero shadow: `none` fades against an inset resting shadow, a transparent
	 * outer shadow does not.
	 *
	 * @return void
	 */
	public function testVisibleInsetHoverShadowOnGradientHoverMovesToTheBeforePseudoElement(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'            => 'bare',
				'backgroundHoverType' => 'gradient',
				'gradientHover'       => 'linear-gradient(90deg, #ff0000, #0000ff)',
				'colorHover'          => '#0000ff',
				'displayHoverShadow'  => true,
				'shadowHover'         => [
					[
						'color'   => '#00ff00',
						'opacity' => 1,
						'hOffset' => 1,
						'vOffset' => 1,
						'blur'    => 2,
						'spread'  => 0,
						'inset'   => true,
					],
				],
			]
		);

		$css_helper     = new CSSTestHelper( $output );
		$hover_selector = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button:hover, .wp-block-kadence-advancedbtn .kb-btn123.kb-button:focus';

		$css_helper->assertCSSPropertiesEqual(
			$hover_selector,
			[
				'color'      => '#00f',
				'box-shadow' => 'none',
			]
		);
		$css_helper->assertCSSPropertiesEqual(
			'.kb-btn123.kb-button:hover::before',
			[ 'box-shadow' => 'inset 1px 1px 2px 0px #0f0' ]
		);
	}

	/**
	 * A button with a visible base shadow and an invisible transparent-header shadow writes no
	 * `box-shadow` into the more specific `.header-*-transparent` rule, so the base shadow keeps
	 * painting under a transparent header through the normal cascade instead of being cancelled by a
	 * `none` reset.
	 *
	 * @return void
	 */
	public function testInvisibleTransparentShadowEmitsNoBoxShadow(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'                 => 'bare',
				'colorTransparent'         => '#0000ff',
				'displayShadow'            => true,
				'shadow'                   => [
					[
						'color'   => '#00ff00',
						'opacity' => 1,
						'hOffset' => 1,
						'vOffset' => 1,
						'blur'    => 2,
						'spread'  => 0,
						'inset'   => false,
					],
				],
				'displayShadowTransparent' => true,
				'shadowTransparent'        => [
					[
						'color'   => 'transparent',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$css_helper           = new CSSTestHelper( $output );
		$base_selector        = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';
		$transparent_selector = '.header-desktop-transparent .wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		$css_helper->assertCSSPropertiesEqual( $base_selector, [ 'box-shadow' => '1px 1px 2px 0px #0f0' ] );

		$transparent_properties = $css_helper->getPropertyOrder( $transparent_selector );

		$this->assertContains( 'color', $transparent_properties, 'The transparent-header rule should exist and carry its color.' );
		$this->assertNotContains(
			'box-shadow',
			$transparent_properties,
			'An invisible transparent-header shadow must leave that rule free of box-shadow so the base shadow persists.'
		);
	}

	/**
	 * A button with a visible base shadow and an invisible sticky shadow writes no `box-shadow` into
	 * the more specific `.item-is-stuck` rule, so the base shadow keeps painting while stuck through
	 * the normal cascade instead of being cancelled by a `none` reset.
	 *
	 * @return void
	 */
	public function testInvisibleStickyShadowEmitsNoBoxShadow(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'            => 'bare',
				'colorSticky'         => '#0000ff',
				'displayShadow'       => true,
				'shadow'              => [
					[
						'color'   => '#00ff00',
						'opacity' => 1,
						'hOffset' => 1,
						'vOffset' => 1,
						'blur'    => 2,
						'spread'  => 0,
						'inset'   => false,
					],
				],
				'displayShadowSticky' => true,
				'shadowSticky'        => [
					[
						'color'   => 'transparent',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$css_helper      = new CSSTestHelper( $output );
		$base_selector   = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';
		$sticky_selector = '.item-is-stuck .wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		$css_helper->assertCSSPropertiesEqual( $base_selector, [ 'box-shadow' => '1px 1px 2px 0px #0f0' ] );

		$sticky_properties = $css_helper->getPropertyOrder( $sticky_selector );

		$this->assertContains( 'color', $sticky_properties, 'The sticky rule should exist and carry its color.' );
		$this->assertNotContains(
			'box-shadow',
			$sticky_properties,
			'An invisible sticky shadow must leave that rule free of box-shadow so the base shadow persists.'
		);
	}

	/**
	 * A button whose preset resolves a shadow, and whose own shadow value is the invisible all-zero
	 * "None" shape, keeps the preset's `var(--kb-btn-shadow)` as the rule's only box-shadow — the
	 * `none` reset must not be appended behind it, or the preset shadow would be silenced.
	 *
	 * @return void
	 */
	public function testPresetShadowIsNotErasedByTheNoneFallback(): void {
		$this->seedPreset(
			'accent',
			'Accent',
			[ 'button-shadow' => '0px 2px 8px 0px #1717171f' ]
		);

		$output = $this->render_button(
			[
				'kbPreset'      => 'accent',
				'displayShadow' => true,
				'shadow'        => [
					[
						'color'   => 'transparent',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => 0,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$css_helper = new CSSTestHelper( $output );
		$selector   = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		$shadow_positions = array_keys( $css_helper->getPropertyOrder( $selector ), 'box-shadow', true );

		$this->assertCount( 1, $shadow_positions, 'Only the preset box-shadow should be emitted.' );
		$css_helper->assertCSSPropertiesEqual( $selector, [ 'box-shadow' => 'var(--kb-btn-shadow)' ] );
	}

	/**
	 * A shadow whose leg holds a {dot.alias} token reference is not treated as invisible: the rule
	 * carries the resolved shadow rather than the `none` reset that would erase it.
	 *
	 * @return void
	 */
	public function testAliasLeggedShadowIsNotErasedByTheNoneFallback(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'      => 'bare',
				'displayShadow' => true,
				'shadow'        => [
					[
						'color'   => '#00ff00',
						'opacity' => 1,
						'hOffset' => 0,
						'vOffset' => 0,
						'blur'    => '{semantic.radius.media}',
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$css_helper = new CSSTestHelper( $output );
		$selector   = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		$css_helper->assertCSSPropertiesEqual(
			$selector,
			[ 'box-shadow' => '0px 0px var(--kb-token--semantic--radius--media) 0px #0f0' ]
		);
	}

	/**
	 * A shadow value with a non-zero axis emits an explicit `box-shadow` declaration, with no toggle
	 * needed to opt in.
	 *
	 * @return void
	 */
	public function testVisibleShadowEmitsExplicitBoxShadow(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'      => 'bare',
				'displayShadow' => true,
				'shadow'        => [
					[
						'color'   => '#00ff00',
						'opacity' => 1,
						'hOffset' => 1,
						'vOffset' => 1,
						'blur'    => 2,
						'spread'  => 0,
						'inset'   => false,
					],
				],
			]
		);

		$css_helper = new CSSTestHelper( $output );
		$selector   = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		$css_helper->assertCSSPropertiesEqual( $selector, [ 'box-shadow' => '1px 1px 2px 0px #0f0' ] );
	}

	/**
	 * An untouched button arrives with the shipped schema defaults — a VISIBLE `shadow` value paired
	 * with a lowered `displayShadow` — and must still paint nothing. The visible value exists only so
	 * a legacy button that saved no value key of its own keeps its shadow; the lowered flag is what
	 * keeps a brand-new button clean.
	 *
	 * @return void
	 */
	public function testUntouchedButtonEmitsNoBoxShadowDespiteTheShippedVisibleDefault(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'      => 'bare',
				'displayShadow' => false,
				'shadow'        => [ $this->registered_shadow_default() ],
			]
		);

		$css_helper = new CSSTestHelper( $output );
		$selector   = '.wp-block-kadence-advancedbtn .kb-btn123.kb-button';

		$css_helper->assertCSSPropertiesEqual( $selector, [ 'box-shadow' => 'none' ] );
	}

	/**
	 * A button switched on before its shadow was ever customized saved the flag and NO `shadow` key,
	 * because the value matched the registered default. It arrives with that default filled back in
	 * and must render the shadow it has always rendered.
	 *
	 * @return void
	 */
	public function testLegacyButtonWithNoStoredShadowValueStillRendersItsShippedShadow(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'      => 'bare',
				'displayShadow' => true,
				'shadow'        => [ $this->registered_shadow_default() ],
			]
		);

		$this->assertStringContainsString(
			'box-shadow:1px 1px 2px 0px rgba(0, 0, 0, 0.2)',
			$output,
			'A raised flag with no stored shadow value must render the shipped default shadow.'
		);
	}

	/**
	 * A button the theme or the outline stylesheet paints gets none of the preset bridges and no shadow
	 * reset, so its padding, margin, border and shadow come from the same rules they came from before
	 * presets existed.
	 *
	 * @dataProvider classPaintedModeProvider
	 *
	 * @param string $mode The inheritStyles value.
	 *
	 * @return void
	 */
	public function testClassPaintedButtonsEmitNoPresetBridges( string $mode ): void {
		$output = $this->render_button( [ 'inheritStyles' => $mode ] );

		$this->assertStringNotContainsString( 'var(--kb-btn-padding)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-margin)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-width)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-shadow)', $output );
		$this->assertStringNotContainsString( 'box-shadow:none', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-shadow-hover', $output );
	}

	/**
	 * The inheritStyles modes whose padding, margin, border and shadow the theme or the outline stylesheet paints.
	 *
	 * @return Generator
	 */
	public function classPaintedModeProvider(): \Generator {
		yield 'theme base' => [ 'mode' => 'inherit' ];
		yield 'theme secondary' => [ 'mode' => 'inherit-secondary' ];
		yield 'outline' => [ 'mode' => 'outline' ];
	}

	/**
	 * A Fill button keeps the spacing bridge, since its padding and margin are the plugin's own, but an
	 * untouched library gives it no border bridge: the default preset's border equals the button's own
	 * stylesheet, so the theme's cascade keeps painting the border exactly as before presets existed.
	 *
	 * @return void
	 */
	public function testFillButtonsKeepTheSpacingBridgeButNoUntouchedBorderBridge(): void {
		$output = $this->render_button( [ 'inheritStyles' => 'fill' ] );

		$this->assertStringContainsString( 'padding:var(--kb-btn-padding)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-width)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-style)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-color)', $output );
	}

	/**
	 * Overriding the button border color semantic in the store activates exactly that property's bridge
	 * on a default-preset button, so a Style Library edit reaches every untouched button.
	 *
	 * @return void
	 */
	public function testAnOverriddenButtonBorderSemanticActivatesItsBridge(): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );
		$store->save_document(
			'{"semantic":{"color":{"button-border":{"$type":"color","$value":"#ff0000"}}}}',
			Token_Store::default_slug()
		);

		$output = $this->render_button( [ 'inheritStyles' => 'fill' ] );

		$this->assertStringContainsString( 'border-color:var(--kb-btn-border-color)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-width)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-style)', $output );
	}

	/**
	 * A stored border on the default preset itself activates the bridge the same way, since the Style
	 * Library edits the preset rather than the semantic.
	 *
	 * @return void
	 */
	public function testAStoredDefaultPresetBorderActivatesItsBridge(): void {
		$this->seedPreset( 'default', 'Default', [ 'button-border-width' => '2px' ] );

		$output = $this->render_button( [] );

		$this->assertStringContainsString( 'border-width:var(--kb-btn-border-width)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-color)', $output );
	}

	/**
	 * The `shadow` attribute default as `block.json` actually registers it.
	 *
	 * Read from the schema rather than spelled out here on purpose. These tests stand in for a saved
	 * button that stored no `shadow` key of its own, so the value under test has to be the one the
	 * parser would fill in; hard-coding it would let the schema drift to a lowered default while the
	 * tests kept passing against a literal that no longer exists anywhere. Their expected CSS stays
	 * spelled out, so a drifted schema fails them loudly.
	 *
	 * @return array<string, mixed> The registered default shadow item.
	 */
	private function registered_shadow_default(): array {
		$schema = json_decode( (string) file_get_contents( KADENCE_BLOCKS_PATH . 'src/blocks/singlebtn/block.json' ), true );

		return $schema['attributes']['shadow']['default'][0];
	}

	/**
	 * A selected class-painted preset puts its classes on the button in place of the mode classes, so the
	 * element never carries both a mode class and the preset's class for the same properties.
	 *
	 * @return void
	 */
	public function testAClassPresetReplacesTheModeClasses(): void {
		$this->seedClassPreset( 'theme-base', 'wp-block-button__link button kb-btn-global-inherit' );

		$html = $this->render_html(
			[
				'kbPreset'      => 'theme-base',
				'inheritStyles' => 'fill',
			]
		);

		$this->assertStringContainsString( 'kb-btn-global-inherit', $html );
		$this->assertStringContainsString( 'wp-block-button__link', $html );
		$this->assertStringNotContainsString( 'kb-btn-global-fill', $html );
	}

	/**
	 * A button on a class-painted preset takes its shape from the preset's stylesheet: none of the preset
	 * spacing, border or shadow bridges is emitted for it.
	 *
	 * @return void
	 */
	public function testAClassPresetButtonEmitsNoPresetBridges(): void {
		$this->seedClassPreset( 'theme-base', 'wp-block-button__link button kb-btn-global-inherit' );

		$output = $this->render_button(
			[
				'kbPreset'      => 'theme-base',
				'inheritStyles' => 'fill',
			]
		);

		$this->assertStringNotContainsString( 'var(--kb-btn-padding)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-width)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-shadow', $output );
	}

	/**
	 * The shipped Outline preset renders the outline stylesheet's class next to its preset class, and no
	 * preset spacing bridge, so it looks exactly like the outline mode.
	 *
	 * @return void
	 */
	public function testOutlinePresetRendersTheOutlineClass(): void {
		$html = $this->render_html( [ 'kbPreset' => 'outline' ] );
		$css  = $this->render_button( [ 'kbPreset' => 'outline' ] );

		$this->assertStringContainsString( 'kb-btn-global-outline', $html );
		$this->assertStringContainsString( 'kb-preset--outline', $html );
		$this->assertStringNotContainsString( 'kb-btn-global-fill', $html );
		$this->assertStringNotContainsString( 'var(--kb-btn-padding)', $css );
	}

	/**
	 * A preset painted through variables leaves the mode classes in place.
	 *
	 * @return void
	 */
	public function testAValuePresetKeepsTheModeClasses(): void {
		$this->seedSecondaryPreset();

		$html = $this->render_html(
			[
				'kbPreset'      => 'secondary',
				'inheritStyles' => 'fill',
			]
		);

		$this->assertStringContainsString( 'kb-btn-global-fill', $html );
		$this->assertStringContainsString( 'kb-preset--secondary', $html );
	}

	/**
	 * A saved Theme Base button, which stores only the older inheritStyles value, renders the Theme Base
	 * preset's classes with no re-save: the same classes the theme painted it with before presets existed.
	 *
	 * @return void
	 */
	public function testLegacyInheritRendersTheThemeBasePresetClasses(): void {
		$this->seed_theme_preset_slugs( [ 'base', 'secondary' ] );

		$html = $this->render_html( [ 'inheritStyles' => 'inherit' ] );

		$this->assertStringContainsString( 'kb-preset--theme-base', $html );
		$this->assertStringContainsString( 'wp-block-button__link', $html );
		$this->assertStringContainsString( 'kb-btn-global-inherit', $html );
		$this->assertStringNotContainsString( 'button-style-secondary', $html );
		$this->assertStringNotContainsString( 'kb-btn-global-fill', $html );
	}

	/**
	 * A saved Theme Secondary button renders the Theme Secondary preset's classes when the theme offers it.
	 *
	 * @return void
	 */
	public function testLegacySecondaryRendersTheThemeSecondaryPresetClasses(): void {
		$this->seed_theme_preset_slugs( [ 'base', 'secondary' ] );

		$html = $this->render_html( [ 'inheritStyles' => 'inherit-secondary' ] );

		$this->assertStringContainsString( 'kb-preset--theme-secondary', $html );
		$this->assertStringContainsString( 'button-style-secondary', $html );
		$this->assertStringContainsString( 'wp-block-button__link', $html );
		$this->assertStringContainsString( 'kb-btn-global-inherit', $html );
	}

	/**
	 * A saved Theme Secondary button on a theme with no secondary style falls back to the Theme Base
	 * preset's classes, the look the theme already gave it, instead of the Fill shape.
	 *
	 * @return void
	 */
	public function testLegacySecondaryFallsBackToThemeBaseClassesWhenTheThemeHasNoSecondary(): void {
		$this->seed_theme_preset_slugs( [ 'base' ] );

		$html = $this->render_html( [ 'inheritStyles' => 'inherit-secondary' ] );

		$this->assertStringContainsString( 'kb-preset--theme-base', $html );
		$this->assertStringContainsString( 'wp-block-button__link', $html );
		$this->assertStringContainsString( 'kb-btn-global-inherit', $html );
		$this->assertStringNotContainsString( 'button-style-secondary', $html );
		$this->assertStringNotContainsString( 'kb-preset--theme-secondary', $html );
	}

	/**
	 * A saved Outline button renders the shipped Outline preset, whose class is the outline stylesheet's.
	 *
	 * @return void
	 */
	public function testLegacyOutlineRendersTheOutlinePreset(): void {
		$html = $this->render_html( [ 'inheritStyles' => 'outline' ] );

		$this->assertStringContainsString( 'kb-preset--outline', $html );
		$this->assertStringContainsString( 'kb-btn-global-outline', $html );
		$this->assertStringNotContainsString( 'kb-btn-global-fill', $html );
	}

	/**
	 * A Fill button, or one with no older style value, renders no preset class: it is the default look.
	 *
	 * @dataProvider defaultLookProvider
	 *
	 * @param array<string, mixed> $attributes The attributes under test.
	 *
	 * @return void
	 */
	public function testTheDefaultLookRendersNoPresetClass( array $attributes ): void {
		$html = $this->render_html( $attributes );

		$this->assertStringContainsString( 'kb-btn-global-fill', $html );
		$this->assertStringNotContainsString( 'kb-preset--', $html );
	}

	/**
	 * The attribute shapes that all mean "the default look".
	 *
	 * @return Generator
	 */
	public function defaultLookProvider(): \Generator {
		yield 'fill' => [ 'attributes' => [ 'inheritStyles' => 'fill' ] ];
		yield 'no mode' => [ 'attributes' => [] ];
		yield 'the default preset selected' => [ 'attributes' => [ 'kbPreset' => 'default' ] ];
		yield 'a preset the library lacks' => [ 'attributes' => [ 'kbPreset' => 'gone' ] ];
	}

	/**
	 * A stored preset wins over the older style value: the preset decides the classes, the mode does not.
	 *
	 * @return void
	 */
	public function testAStoredPresetWinsOverTheLegacyMode(): void {
		$html = $this->render_html(
			[
				'kbPreset'      => 'outline',
				'inheritStyles' => 'inherit',
			]
		);

		$this->assertStringContainsString( 'kb-preset--outline', $html );
		$this->assertStringContainsString( 'kb-btn-global-outline', $html );
		$this->assertStringNotContainsString( 'kb-btn-global-inherit', $html );
		$this->assertStringNotContainsString( 'wp-block-button__link', $html );
	}

	/**
	 * A button on a theme preset takes its shape from the theme's rules, so none of the preset spacing,
	 * border or shadow bridges is emitted for it, whether the preset is stored or mapped from the older
	 * style value.
	 *
	 * @dataProvider themePresetButtonProvider
	 *
	 * @param array<string, mixed> $attributes The attributes under test.
	 *
	 * @return void
	 */
	public function testThemePresetButtonsEmitNoPresetBridges( array $attributes ): void {
		$this->seed_theme_preset_slugs( [ 'base', 'secondary' ] );

		$output = $this->render_button( $attributes );

		$this->assertStringNotContainsString( 'var(--kb-btn-padding)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-margin)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-border-width)', $output );
		$this->assertStringNotContainsString( 'var(--kb-btn-shadow', $output );
		$this->assertStringNotContainsString( 'box-shadow:none', $output );
	}

	/**
	 * The attribute shapes that put a button on a theme preset.
	 *
	 * @return Generator
	 */
	public function themePresetButtonProvider(): \Generator {
		yield 'stored theme base' => [ 'attributes' => [ 'kbPreset' => 'theme-base' ] ];
		yield 'stored theme secondary' => [ 'attributes' => [ 'kbPreset' => 'theme-secondary' ] ];
		yield 'legacy inherit' => [ 'attributes' => [ 'inheritStyles' => 'inherit' ] ];
		yield 'legacy secondary' => [ 'attributes' => [ 'inheritStyles' => 'inherit-secondary' ] ];
	}

	/**
	 * With the token registry inactive the static table paints a saved button with the classes it had
	 * before presets existed, and no preset class.
	 *
	 * @return void
	 */
	public function testLegacyClassesRenderWhenTheRegistryIsInactive(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );
		$registry->deactivate();

		try {
			$html = $this->render_html( [ 'inheritStyles' => 'inherit-secondary' ] );
			$css  = $this->render_button( [ 'inheritStyles' => 'inherit-secondary' ] );
		} finally {
			$registry->activate();
		}

		$this->assertStringContainsString( 'kb-btn-global-inherit', $html );
		$this->assertStringContainsString( 'button-style-secondary', $html );
		$this->assertStringContainsString( 'wp-block-button__link', $html );
		$this->assertStringNotContainsString( 'kb-preset--', $html );
		$this->assertStringNotContainsString( 'var(--kb-btn-padding)', $css );
	}

	/**
	 * The legacy tables map every older style value to a preset slug and to the classes it painted.
	 *
	 * @return void
	 */
	public function testTheLegacyTablesCoverEveryOlderStyleValue(): void {
		$this->assertSame(
			[
				'inherit'           => 'theme-base',
				'inherit-secondary' => 'theme-secondary',
				'outline'           => 'outline',
			],
			Kadence_Blocks_Singlebtn_Block::get_legacy_presets()
		);
		$this->assertSame( array_keys( Kadence_Blocks_Singlebtn_Block::get_legacy_presets() ), array_keys( Kadence_Blocks_Singlebtn_Block::get_legacy_classes() ) );
	}

	/**
	 * Build the button's rendered CSS for a fixed unique id, filling in the attributes every render
	 * needs (`uniqueID`) alongside the case-specific ones under test.
	 *
	 * @param array<string, mixed> $attributes Attributes to merge over the minimal defaults.
	 *
	 * @return string The rendered CSS.
	 */
	private function render_button( array $attributes ): string {
		$unique_id = '123';

		return $this->block->build_css(
			array_merge( [ 'uniqueID' => $unique_id ], $attributes ),
			$this->css,
			$unique_id,
			$unique_id
		);
	}

	/**
	 * Render the button's front-end markup through the block's render path, so the preset classes the
	 * abstract block adds are part of the output.
	 *
	 * @param array<string, mixed> $attributes Attributes to merge over the minimal defaults.
	 *
	 * @return string The rendered HTML.
	 */
	private function render_html( array $attributes ): string {
		$attributes = array_merge(
			[
				'uniqueID' => '123',
				'text'     => 'Button',
			],
			$attributes
		);

		// get_block_wrapper_attributes() reads the block core is currently rendering; outside a real render
		// nothing sets it, so the test stands in for the block parser here.
		WP_Block_Supports::$block_to_render = [
			'blockName' => 'kadence/singlebtn',
			'attrs'     => $attributes,
		];

		try {
			return (string) $this->block->render_css( $attributes, '', $this->generate_block_instance( 'kadence/singlebtn', $attributes ) );
		} finally {
			WP_Block_Supports::$block_to_render = null;
		}
	}

	/**
	 * Persist a class-painted button preset into the default token library's overrides document.
	 *
	 * @param string $preset      The preset slug.
	 * @param string $theme_class The classes the preset puts on the button.
	 *
	 * @return void
	 */
	private function seedClassPreset( string $preset, string $theme_class ): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						'kadence/singlebtn' => [
							$preset => [
								'label'      => 'Theme Base',
								'themeClass' => $theme_class,
								'tokens'     => [],
							],
						],
					],
				],
			],
		];

		$store->save_document( (string) wp_json_encode( $document ), Token_Store::default_slug() );
	}

	/**
	 * Persist a named "secondary" button preset that sets all three border properties, so a test that
	 * selects it exercises a named preset's border rather than the default preset's fallback.
	 *
	 * @return void
	 */
	private function seedSecondaryPreset(): void {
		$this->seedPreset(
			'secondary',
			'Secondary',
			[
				'button-border-width' => '2px',
				'button-border-style' => 'solid',
				'button-border-color' => '#000000',
			]
		);
	}

	/**
	 * Persist a single button preset into the default token library's overrides document, mirroring
	 * `Preset_ResolverTest::seedPreset()`.
	 *
	 * @param string               $preset The preset slug.
	 * @param string               $label  The preset label.
	 * @param array<string, mixed> $tokens The property => value map for the preset.
	 *
	 * @return void
	 */
	private function seedPreset( string $preset, string $label, array $tokens ): void {
		/** @var Token_Store $store */
		$store = $this->container->get( Token_Store::class );

		$document = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'presets' => [
						'kadence/singlebtn' => [
							$preset => [
								'label'  => $label,
								'tokens' => $tokens,
							],
						],
					],
				],
			],
		];

		$store->save_document( (string) wp_json_encode( $document ), Token_Store::default_slug() );
	}
}
