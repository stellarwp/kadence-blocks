<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Singlebtn_Block;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Container;
use Tests\Support\Classes\KadenceBlocksUnit;
use Tests\helpers\CSSTestHelper;

/**
 * Covers `render_preset_border()`/`render_preset_shadow()` — the front end's bridge from a button's
 * selected preset to its rendered border and box-shadow CSS, mirroring `render_preset_spacing()`'s
 * own coverage shape.
 */
class SinglebtnTest extends KadenceBlocksUnit {
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

	/**
	 * A named, non-`$default` preset ("secondary") that resolves `button-border-width` emits the
	 * property pointed at its preset variable.
	 *
	 * @return void
	 */
	public function testNamedPresetBorderWidthEmitsCssVar(): void {
		$output = $this->render_button( [ 'kbPreset' => 'secondary' ] );

		$this->assertStringContainsString( 'border-width:var(--kb-btn-border-width)', $output );
	}

	/**
	 * The same named preset's `button-border-style` and `button-border-color` are also emitted.
	 *
	 * @return void
	 */
	public function testNamedPresetBorderStyleAndColorEmitCssVars(): void {
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
				'kbPreset' => 'accent',
				'displayShadow' => true,
				'shadow'   => [
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
				'shadow' => [
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
				'kbPreset' => 'bare',
				'displayShadow' => true,
				'shadow'   => [
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
	 * A button with a visible base shadow and an invisible hover shadow writes no `box-shadow` into
	 * the hover rule, so the base shadow keeps painting on hover through the normal cascade instead
	 * of being cancelled by a `none` reset.
	 *
	 * @return void
	 */
	public function testInvisibleHoverShadowEmitsNoBoxShadowOnHover(): void {
		$this->seedPreset( 'bare', 'Bare', [ 'button-bg' => '#ff0000' ] );

		$output = $this->render_button(
			[
				'kbPreset'    => 'bare',
				'colorHover'  => '#0000ff',
				'displayShadow' => true,
				'shadow'      => [
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
				'shadowHover' => [
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

		$hover_properties = $css_helper->getPropertyOrder( $hover_selector );

		$this->assertContains( 'color', $hover_properties, 'The hover rule should exist and carry the hover color.' );
		$this->assertNotContains(
			'box-shadow',
			$hover_properties,
			'An invisible hover shadow must leave the hover rule free of box-shadow so the base shadow persists.'
		);
	}

	/**
	 * A gradient-background button with an invisible (all-zero) hover shadow whose `inset` flag is
	 * `true` writes no `box-shadow` at all into the hover rule — the gradient-specific inset reset
	 * lost its `displayHoverShadow` toggle gate along with every other hover site, and must not fire
	 * on an invisible shadow just because `inset` happens to be `true`.
	 *
	 * @return void
	 */
	public function testInvisibleInsetHoverShadowEmitsNoBoxShadowOnGradientHover(): void {
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

		$hover_properties = $css_helper->getPropertyOrder( $hover_selector );

		$this->assertContains( 'color', $hover_properties, 'The hover rule should exist and carry the hover color.' );
		$this->assertNotContains(
			'box-shadow',
			$hover_properties,
			'An invisible hover shadow must not trigger the inset reset just because inset is true.'
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
				'kbPreset'          => 'bare',
				'colorTransparent'  => '#0000ff',
				'displayShadow'     => true,
				'shadow'            => [
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
				'shadowTransparent' => [
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
				'kbPreset'     => 'bare',
				'colorSticky'  => '#0000ff',
				'displayShadow' => true,
				'shadow'       => [
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
				'shadowSticky' => [
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
				'kbPreset' => 'accent',
				'displayShadow' => true,
				'shadow'   => [
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
				'kbPreset' => 'bare',
				'displayShadow' => true,
				'shadow'   => [
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
				'kbPreset' => 'bare',
				'displayShadow' => true,
				'shadow'   => [
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
