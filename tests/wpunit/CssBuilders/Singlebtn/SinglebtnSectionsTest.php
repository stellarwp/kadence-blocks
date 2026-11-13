<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Singlebtn;

use Generator;
use Kadence_Blocks_Singlebtn_Dynamic_Css;
use Kadence_Blocks_Singlebtn_Hover_Before_Css;
use Kadence_Blocks_Singlebtn_Hover_Inset_Css;
use Kadence_Blocks_Singlebtn_Hover_Shadow_Css;
use Kadence_Blocks_Singlebtn_Preset_Css;
use Kadence_Blocks_Singlebtn_Shadow_Css;
use Kadence_Blocks_Singlebtn_Text_Color_Css;
use Kadence_Blocks_Singlebtn_Visible_Shadow_Condition;
use Tests\wpunit\CssBuilders\Button_Test_Case;

/**
 * The sections that only the single button has.
 */
final class SinglebtnSectionsTest extends Button_Test_Case {

	private const BASE = '.base{id}';

	private const TEXT = '.base{id} .text';

	private const SHADOW = [
		'color'   => '#000000',
		'opacity' => 0.5,
		'spread'  => 1,
		'blur'    => 5,
		'hOffset' => 2,
		'vOffset' => 3,
	];

	/**
	 * The dynamic section asks the block for the transparent header styles of every device, then goes back to desktop.
	 *
	 * @return void
	 */
	public function testDynamicStylesAskTheBlockForEveryDevice(): void {
		$css = new \Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );

		( new Kadence_Blocks_Singlebtn_Dynamic_Css() )->write( $this->button_input( [ 'a' => 1 ], $css ) );
		$css->set_selector( '.after' );
		$css->add_property( 'color', 'red' );

		$this->assertSame(
			[
				[ 'sized_dynamic_styles', $css, [ 'a' => 1 ], 'abc', 'Desktop' ],
				[ 'sized_dynamic_styles', $css, [ 'a' => 1 ], 'abc', 'Tablet' ],
				[ 'sized_dynamic_styles', $css, [ 'a' => 1 ], 'abc', 'Mobile' ],
			],
			$this->calls
		);
		$this->assertSameCss( '.after{color:red;}', $css->css_output() );
	}

	/**
	 * The preset section hands the CSS builder and the attributes to the block method it was given.
	 *
	 * @return void
	 */
	public function testPresetCallsTheBlock(): void {
		$this->write_button( new Kadence_Blocks_Singlebtn_Preset_Css( 'render_preset_border' ), [ 'a' => 1 ] );

		$this->assertCount( 1, $this->calls );
		$this->assertSame( 'render_preset_border', $this->calls[0][0] );
		$this->assertInstanceOf( \Kadence_Blocks_CSS::class, $this->calls[0][1] );
		$this->assertSame( [ 'a' => 1 ], $this->calls[0][2] );
	}

	/**
	 * The text color is a color, or a gradient on the text, and goes back to the selector of the button.
	 *
	 * @dataProvider textColorProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testTextColor( array $attributes, string $expected ): void {
		$section = new Kadence_Blocks_Singlebtn_Text_Color_Css( 'color', 'type', 'gradient', self::TEXT, self::BASE );
		$css     = new \Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( '.start' );

		$section->write( $this->button_input( $attributes, $css ) );
		$css->add_property( 'order', '1' );

		$this->assertSameCss( $expected, $css->css_output() );
	}

	/**
	 * The visible shadow condition needs the shadow switched on, saved as a list of shadows and visible to the block.
	 *
	 * @dataProvider visibleShadowProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $visible    What the block answers to the visibility question.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testVisibleShadowCondition( array $attributes, bool $visible, bool $expected ): void {
		$css = new \Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );

		$condition = new Kadence_Blocks_Singlebtn_Visible_Shadow_Condition( 'on', 'shadows' );
		$input     = $this->button_input( $attributes, $css, [ 'has_visible_shadow' => $visible ] );

		$this->assertSame( $expected, $condition->is_met( $input ) );
		$this->assertSame( $attributes['shadows'][0] ?? null, $condition->shadow( $input ) );
	}

	/**
	 * The shadow is the editor shadow, or nothing when a preset has its own, or none when the button paints its own shape.
	 *
	 * @dataProvider shadowProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<string, mixed> $answers    What the block answers to a call.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testShadow( array $attributes, array $answers, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Singlebtn_Shadow_Css(), $attributes, '.btn', $answers ) );
	}

	/**
	 * The hover shadow is the editor shadow, or the preset hover variable when the button paints its own shape.
	 *
	 * @dataProvider hoverShadowProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<string, mixed> $answers    What the block answers to a call.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testHoverShadow( array $attributes, array $answers, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Singlebtn_Hover_Shadow_Css(), $attributes, '.btn', $answers ) );
	}

	/**
	 * An inset hover shadow of a gradient button moves to the overlay, and what is written next goes there too.
	 *
	 * @dataProvider hoverInsetProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $visible    What the block answers to the visibility question.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testHoverInset( array $attributes, bool $visible, string $expected ): void {
		$css = new \Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( '.btn' );

		( new Kadence_Blocks_Singlebtn_Hover_Inset_Css() )->write( $this->button_input( $attributes, $css, [ 'has_visible_shadow' => $visible ] ) );
		$css->add_property( 'order', '1' );

		$this->assertSameCss( $expected, $css->css_output() );
	}

	/**
	 * The overlay is the hover color of a gradient button, or the hover gradient.
	 *
	 * @dataProvider hoverBeforeProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testHoverBefore( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Singlebtn_Hover_Before_Css(), $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function textColorProvider(): Generator {
		yield 'color without a type' => [
			'attributes' => [ 'color' => '#ff0000' ],
			'expected'   => '.start{color:#ff0000;order:1;}',
		];
		yield 'color with the normal type' => [
			'attributes' => [
				'color'    => '#ff0000',
				'type'     => 'normal',
				'gradient' => 'g',
			],
			'expected'   => '.start{color:#ff0000;order:1;}',
		];
		yield 'gradient' => [
			'attributes' => [
				'color'    => '#ff0000',
				'type'     => 'gradient',
				'gradient' => 'linear-gradient(red, blue)',
			],
			'expected'   => '.base' . 'abc .text{background:linear-gradient(red, blue);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}'
				. '.baseabc{order:1;}',
		];
		yield 'gradient without a gradient still clips the text' => [
			'attributes' => [ 'type' => 'gradient' ],
			'expected'   => '.baseabc .text{-webkit-background-clip:text;-webkit-text-fill-color:transparent;}.baseabc{order:1;}',
		];
		yield 'another type' => [
			'attributes' => [
				'color' => '#ff0000',
				'type'  => 'other',
			],
			'expected'   => '.start{order:1;}',
		];
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => '.start{order:1;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function visibleShadowProvider(): Generator {
		yield 'visible' => [
			'attributes' => [
				'on'      => true,
				'shadows' => [ self::SHADOW ],
			],
			'visible'    => true,
			'expected'   => true,
		];
		yield 'not visible' => [
			'attributes' => [
				'on'      => true,
				'shadows' => [ self::SHADOW ],
			],
			'visible'    => false,
			'expected'   => false,
		];
		yield 'switched off' => [
			'attributes' => [
				'on'      => false,
				'shadows' => [ self::SHADOW ],
			],
			'visible'    => true,
			'expected'   => false,
		];
		yield 'not a shadow' => [
			'attributes' => [
				'on'      => true,
				'shadows' => [ 'abc' ],
			],
			'visible'    => true,
			'expected'   => false,
		];
		yield 'not saved' => [
			'attributes' => [ 'on' => true ],
			'visible'    => true,
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function shadowProvider(): Generator {
		$on = [
			'displayShadow' => true,
			'shadow'        => [ self::SHADOW ],
		];

		yield 'editor shadow' => [
			'attributes' => $on,
			'answers'    => [
				'has_visible_shadow'   => true,
				'render_button_shadow' => '2px 3px 5px 1px #000',
			],
			'expected'   => '.btn{box-shadow:2px 3px 5px 1px #000;}',
		];
		yield 'editor shadow wins over the preset' => [
			'attributes' => $on,
			'answers'    => [
				'has_visible_shadow'   => true,
				'render_preset_shadow' => true,
				'render_button_shadow' => '2px 3px 5px 1px #000',
			],
			'expected'   => '.btn{box-shadow:2px 3px 5px 1px #000;}',
		];
		yield 'shape painted here without a shadow' => [
			'attributes' => $on,
			'answers'    => [ 'paints_own_shape' => true ],
			'expected'   => '.btn{box-shadow:none;}',
		];
		yield 'preset shadow is kept' => [
			'attributes' => $on,
			'answers'    => [
				'render_preset_shadow' => true,
				'paints_own_shape'     => true,
			],
			'expected'   => '',
		];
		yield 'shape painted by the theme' => [
			'attributes' => [],
			'answers'    => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function hoverShadowProvider(): Generator {
		$on = [
			'displayHoverShadow' => true,
			'shadowHover'        => [ self::SHADOW ],
		];

		yield 'editor shadow' => [
			'attributes' => $on,
			'answers'    => [
				'has_visible_shadow'   => true,
				'render_button_shadow' => '2px 3px 5px 1px #000',
				'paints_own_shape'     => true,
			],
			'expected'   => '.btn{box-shadow:2px 3px 5px 1px #000;}',
		];
		yield 'preset hover variable' => [
			'attributes' => $on,
			'answers'    => [ 'paints_own_shape' => true ],
			'expected'   => '.btn{box-shadow:var(--kb-btn-shadow-hover, none);}',
		];
		yield 'shape painted by the theme' => [
			'attributes' => [],
			'answers'    => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function hoverInsetProvider(): Generator {
		$inset = [
			'displayHoverShadow' => true,
			'shadowHover'        => [ self::SHADOW + [ 'inset' => true ] ],
		];

		yield 'gradient button' => [
			'attributes' => $inset + [ 'backgroundType' => 'gradient' ],
			'visible'    => true,
			'expected'   => '.btn{box-shadow:none;}.kb-btnabc.kb-button:hover::before{order:1;}',
		];
		yield 'gradient hover' => [
			'attributes' => $inset + [ 'backgroundHoverType' => 'gradient' ],
			'visible'    => true,
			'expected'   => '.btn{box-shadow:none;}.kb-btnabc.kb-button:hover::before{order:1;}',
		];
		yield 'solid button' => [
			'attributes' => $inset,
			'visible'    => true,
			'expected'   => '.btn{order:1;}',
		];
		yield 'invisible shadow' => [
			'attributes' => $inset + [ 'backgroundType' => 'gradient' ],
			'visible'    => false,
			'expected'   => '.btn{order:1;}',
		];
		yield 'not an inset shadow' => [
			'attributes' => [
				'displayHoverShadow' => true,
				'shadowHover'        => [ self::SHADOW + [ 'inset' => 1 ] ],
				'backgroundType'     => 'gradient',
			],
			'visible'    => true,
			'expected'   => '.btn{order:1;}',
		];
		yield 'no inset flag' => [
			'attributes' => [
				'displayHoverShadow' => true,
				'shadowHover'        => [ self::SHADOW ],
				'backgroundType'     => 'gradient',
			],
			'visible'    => true,
			'expected'   => '.btn{order:1;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function hoverBeforeProvider(): Generator {
		yield 'hover color of a gradient button' => [
			'attributes' => [
				'backgroundType'  => 'gradient',
				'backgroundHover' => '#ff0000',
			],
			'expected'   => '.kb-btnabc.kb-button::before{background:#ff0000;transition:opacity .3s ease-in-out;-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;}',
		];
		yield 'hover gradient' => [
			'attributes' => [
				'backgroundHoverType' => 'gradient',
				'gradientHover'       => 'linear-gradient(red, blue)',
			],
			'expected'   => '.kb-btnabc.kb-button::before{background:linear-gradient(red, blue);transition:opacity .3s ease-in-out;-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;}',
		];
		yield 'hover gradient wins over the hover color' => [
			'attributes' => [
				'backgroundType'      => 'gradient',
				'backgroundHoverType' => 'gradient',
				'backgroundHover'     => '#ff0000',
				'gradientHover'       => 'g',
			],
			'expected'   => '.kb-btnabc.kb-button::before{background:g;transition:opacity .3s ease-in-out;-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;}',
		];
		yield 'solid button' => [
			'attributes' => [ 'backgroundHover' => '#ff0000' ],
			'expected'   => '',
		];
		yield 'gradient hover without a gradient' => [
			'attributes' => [ 'backgroundHoverType' => 'gradient' ],
			'expected'   => '',
		];
		yield 'gradient button without a hover color' => [
			'attributes' => [ 'backgroundType' => 'gradient' ],
			'expected'   => '',
		];
	}
}
