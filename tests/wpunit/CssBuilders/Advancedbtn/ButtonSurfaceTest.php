<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedbtn;

use Generator;
use Kadence_Blocks_Advancedbtn_Button_Assets_Css;
use Kadence_Blocks_Advancedbtn_Button_Background_Css;
use Kadence_Blocks_Advancedbtn_Button_Border_Css;
use Kadence_Blocks_Advancedbtn_Button_Gap_Css;
use Kadence_Blocks_Advancedbtn_Button_Selector_Css;
use Kadence_Blocks_Css_Legacy_Shadow_Section;
use Kadence_Blocks_Advancedbtn_Button_Size_Css;

/**
 * The sections that write the normal look of one button.
 */
final class ButtonSurfaceTest extends Advancedbtn_Test_Case {

	/**
	 * The gap section writes the space after the button, and a mirrored rule for right to left languages.
	 *
	 * @dataProvider gapProvider
	 *
	 * @param array<string, mixed> $attributes The saved button.
	 * @param bool                 $rtl        Whether the site reads right to left.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testGap( array $attributes, bool $rtl, string $expected ): void {
		global $wp_locale;

		$direction                 = $wp_locale->text_direction;
		$wp_locale->text_direction = $rtl ? 'rtl' : 'ltr';

		$css = $this->write_button( new Kadence_Blocks_Advancedbtn_Button_Gap_Css(), $attributes );

		$wp_locale->text_direction = $direction;

		$this->assertSameCss( $expected, $css );
	}

	/**
	 * The background is a gradient, transparent, or a color with its opacity.
	 *
	 * @dataProvider backgroundProvider
	 *
	 * @param array<string, mixed> $attributes The saved button.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testBackground( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Advancedbtn_Button_Background_Css(), $attributes ) );
	}

	/**
	 * The border writes its color and a style, or a solid style when only a width was saved.
	 *
	 * @dataProvider borderProvider
	 *
	 * @param array<string, mixed> $attributes The saved button.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testBorder( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Advancedbtn_Button_Border_Css(), $attributes ) );
	}

	/**
	 * The shadow only writes when it is switched on and, for hover states, when its inset flag matches.
	 *
	 * @dataProvider shadowProvider
	 *
	 * @param string            $attribute The attribute that stores the shadow.
	 * @param bool|null         $inset     Whether the section writes inset shadows, or null for any.
	 * @param array<int, mixed> $shadow    The saved shadow.
	 * @param string            $expected  The CSS expected.
	 *
	 * @return void
	 */
	public function testShadow( string $attribute, $inset, array $shadow, string $expected ): void {
		$defaults = [
			'hOffset' => '2',
			'vOffset' => '2',
			'blur'    => '3',
			'spread'  => '0',
			'color'   => '#000000',
			'opacity' => 0.4,
		];

		$section = new Kadence_Blocks_Css_Legacy_Shadow_Section( $attribute, $defaults, $inset );

		$this->assertSameCss( $expected, $this->write_button( $section, [ $attribute => $shadow ] ) );
	}

	/**
	 * The size section writes the fixed width, the custom padding, the text color and the font size.
	 *
	 * @dataProvider sizeProvider
	 *
	 * @param array<string, mixed> $attributes The saved button.
	 * @param array<string, mixed> $derived    The values derived for the button.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSize( array $attributes, array $derived, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Advancedbtn_Button_Size_Css(), $attributes, $derived ) );
	}

	/**
	 * The selector section replaces the unique id and the button position in every selector.
	 *
	 * @return void
	 */
	public function testSelectorReplacesPlaceholders(): void {
		$css = new \Kadence_Blocks_CSS();

		( new Kadence_Blocks_Advancedbtn_Button_Selector_Css( [ '.a-{id}-{key}', '.b-{key}' ] ) )->write( $this->input( [], $css )->with( 'key', 3 ) );
		$css->add_property( 'color', 'red' );

		$this->assertSame( '.a-abc-3, .b-3{color:red;}', $css->css_output() );
	}

	/**
	 * The assets section asks the block for the styles older buttons need.
	 *
	 * @return void
	 */
	public function testAssetsAskForDeprecatedStyles(): void {
		$this->run_recording( new Kadence_Blocks_Advancedbtn_Button_Assets_Css(), [] );

		$this->assertSame( [ [ 'enqueue_style', 'kb-button-deprecated-styles' ] ], $this->calls );
	}

	/**
	 * @return Generator
	 */
	public function gapProvider(): Generator {
		yield 'number' => [
			'attributes' => [ 'gap' => 12 ],
			'rtl'        => false,
			'expected'   => '.kt-btnsabc .kt-btn-wrap-0{margin-right:12px;}',
		];
		yield 'right to left' => [
			'attributes' => [ 'gap' => 12 ],
			'rtl'        => true,
			'expected'   => '.kt-btnsabc .kt-btn-wrap-0{margin-right:12px;}.rtl .kt-btnsabc .kt-btn-wrap-0{margin-left:12px;margin-right:0px;}',
		];
		yield 'not a number' => [
			'attributes' => [ 'gap' => 'wide' ],
			'rtl'        => false,
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function backgroundProvider(): Generator {
		yield 'radial gradient on nothing' => [
			'attributes' => [
				'backgroundType' => 'gradient',
				'gradient'       => [ '#111111', 0.5, 10, 90, 'radial', 45, 'top left' ],
			],
			'expected'   => '{background:radial-gradient(at top left, rgba(255,255,255,0) 10%, rgba(17, 17, 17, 0.5) 90%);}',
		];
		yield 'linear gradient on transparent with defaults' => [
			'attributes' => [
				'backgroundType' => 'gradient',
				'background'     => 'transparent',
				'gradient'       => [ '', null, null, null, null, '' ],
			],
			'expected'   => '{background:linear-gradient(180deg, rgba(255,255,255,0) 0%, #999999 100%);}',
		];
		yield 'solid with opacity' => [
			'attributes' => [
				'background'        => '#ff0000',
				'backgroundOpacity' => 0.5,
			],
			'expected'   => '{background:rgba(255, 0, 0, 0.5);}',
		];
		yield 'transparent' => [
			'attributes' => [ 'background' => 'transparent' ],
			'expected'   => '{background:transparent;}',
		];
		yield 'nothing' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function borderProvider(): Generator {
		yield 'color and style' => [
			'attributes' => [
				'border'        => '#ff0000',
				'borderOpacity' => 0.5,
				'borderStyle'   => 'dashed',
			],
			'expected'   => '{border-color:rgba(255, 0, 0, 0.5);border-style:dashed;}',
		];
		yield 'width only' => [
			'attributes' => [ 'borderWidth' => 2 ],
			'expected'   => '{border-style:solid;}',
		];
		yield 'nothing' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function shadowProvider(): Generator {
		yield 'desktop shadow' => [
			'attribute' => 'boxShadow',
			'inset'     => null,
			'shadow'    => [ true, '#000000', 0.2, 3, 1, 2, 2, false ],
			'expected'  => '{box-shadow:3px 1px 2px 2px rgba(0, 0, 0, 0.2);}',
		];
		yield 'switched off' => [
			'attribute' => 'boxShadow',
			'inset'     => null,
			'shadow'    => [ false ],
			'expected'  => '',
		];
		yield 'inset hover asked for inset' => [
			'attribute' => 'boxShadowHover',
			'inset'     => true,
			'shadow'    => [ true, '#000000', 0.2, 3, 1, 2, 2, true ],
			'expected'  => '{box-shadow:inset 3px 1px 2px 2px rgba(0, 0, 0, 0.2);}',
		];
		yield 'plain hover asked for inset' => [
			'attribute' => 'boxShadowHover',
			'inset'     => true,
			'shadow'    => [ true, '#000000', 0.2, 3, 1, 2, 2, false ],
			'expected'  => '',
		];
		yield 'plain hover asked for plain' => [
			'attribute' => 'boxShadowHover',
			'inset'     => false,
			'shadow'    => [ true, '#000000', 0.2, 3, 1, 2, 2, false ],
			'expected'  => '{box-shadow:3px 1px 2px 2px rgba(0, 0, 0, 0.2);}',
		];
		yield 'inset hover asked for plain' => [
			'attribute' => 'boxShadowHover',
			'inset'     => false,
			'shadow'    => [ true, '#000000', 0.2, 3, 1, 2, 2, true ],
			'expected'  => '',
		];
		yield 'hover without an inset flag asked for plain' => [
			'attribute' => 'boxShadowHover',
			'inset'     => false,
			'shadow'    => [ true ],
			'expected'  => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function sizeProvider(): Generator {
		yield 'custom button' => [
			'attributes' => [
				'btnSize'   => 'custom',
				'paddingLR' => 10,
				'paddingBT' => 5,
				'width'     => [ 100 ],
				'color'     => '#fff',
				'size'      => 18,
				'sizeType'  => 'em',
			],
			'derived'    => [
				'key'        => 0,
				'width_type' => 'fixed',
			],
			'expected'   => '{width:100px;padding-left:10px;padding-right:10px;padding-top:5px;padding-bottom:5px;color:#fff;font-size:18em;}',
		];
		yield 'preset size ignores padding' => [
			'attributes' => [
				'btnSize'   => 'small',
				'paddingLR' => 10,
			],
			'derived'    => [
				'key'        => 0,
				'width_type' => 'fixed',
			],
			'expected'   => '',
		];
		yield 'unsaved size, vertical padding only' => [
			'attributes' => [ 'paddingBT' => 5 ],
			'derived'    => [
				'key'        => 0,
				'width_type' => 'fixed',
			],
			'expected'   => '{padding-top:5px;padding-bottom:5px;}',
		];
		yield 'width ignored when not fixed' => [
			'attributes' => [ 'width' => [ 100 ] ],
			'derived'    => [
				'key'        => 0,
				'width_type' => 'auto',
			],
			'expected'   => '',
		];
		yield 'font size defaults to pixels' => [
			'attributes' => [ 'size' => 18 ],
			'derived'    => [
				'key'        => 0,
				'width_type' => 'auto',
			],
			'expected'   => '{font-size:18px;}',
		];
	}
}
