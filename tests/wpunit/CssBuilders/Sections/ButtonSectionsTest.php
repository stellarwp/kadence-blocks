<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_Css_Button_Background_Section;
use Kadence_Blocks_Css_Button_Hover_Background_Section;
use Kadence_Blocks_Css_Button_Icon_Section;
use Kadence_Blocks_Css_Button_Types;
use Kadence_Blocks_Css_Button_Visibility_Section;
use Kadence_Blocks_Css_Button_Width_Section;
use Kadence_Blocks_Css_Responsive_Range_Section;
use Kadence_Blocks_Css_Shadow_Section;
use Kadence_Blocks_Css_Typography_Section;
use Tests\wpunit\CssBuilders\Button_Test_Case;

/**
 * The generic sections the single button and the submit button share.
 */
final class ButtonSectionsTest extends Button_Test_Case {

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	/**
	 * The types of a button are the saved ones, or the defaults for what is empty.
	 *
	 * @dataProvider typesProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<string, mixed> $expected   The types expected.
	 *
	 * @return void
	 */
	public function testTypesAreDerived( array $attributes, array $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Css_Button_Types::derive( $attributes ) );
	}

	/**
	 * The width is the fixed width of every device, or an initial width inside menus.
	 *
	 * @dataProvider widthProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testWidth( array $attributes, string $expected ): void {
		$section = new Kadence_Blocks_Css_Button_Width_Section( '.fixed{id}, .menu .fixed{id}', '.menu .auto{id}' );

		$this->assertSameCss( $expected, $this->write_button( $section, $attributes ) );
	}

	/**
	 * The background is a solid color, which is important under a gradient hover, or a gradient, which is always important.
	 *
	 * @dataProvider backgroundProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testBackground( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Css_Button_Background_Section(), $attributes ) );
	}

	/**
	 * The hover background is a solid color, unless the resting background or the hover is a gradient.
	 *
	 * @dataProvider hoverBackgroundProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testHoverBackground( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Css_Button_Hover_Background_Section(), $attributes ) );
	}

	/**
	 * The visibility hides or shows what a flag of a device says, and leaves empty flags alone.
	 *
	 * @dataProvider visibilityProvider
	 *
	 * @param array<string, mixed> $attributes  The block attributes.
	 * @param string|null          $device      The device of the section.
	 * @param bool                 $shows_again Whether a flag that is off shows the element again.
	 * @param string               $expected    The CSS expected.
	 *
	 * @return void
	 */
	public function testVisibility( array $attributes, ?string $device, bool $shows_again, string $expected ): void {
		$section = new Kadence_Blocks_Css_Button_Visibility_Section( 'flags', 1, $device, '.text{id}', $shows_again );

		$this->assertSameCss( $expected, $this->write_button( $section, $attributes ) );
	}

	/**
	 * The icon writes its color, padding and sizes, and its hover color.
	 *
	 * @dataProvider iconProvider
	 *
	 * @param array<int, string>   $properties The properties that get the icon size.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testIcon( array $properties, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Css_Button_Icon_Section( $properties ), $attributes ) );
	}

	/**
	 * The responsive range writes every device with its unit, and the typography writes the font of its attribute.
	 *
	 * @return void
	 */
	public function testRangeAndTypography(): void {
		$range = new Kadence_Blocks_Css_Responsive_Range_Section( 'size', 'width', 'sizeUnit' );

		$this->assertSameCss(
			'.btn{width:10em;}' . self::TABLET . '{.btn{width:8em;}}' . self::MOBILE . '{.btn{width:6em;}}',
			$this->write_button(
				$range,
				[
					'size'     => [ 10, 8, 6 ],
					'sizeUnit' => 'em',
				] 
			)
		);

		$typography = new Kadence_Blocks_Css_Typography_Section( 'font' );

		$this->assertSameCss(
			'.btn{font-weight:700;}',
			$this->write_button(
				$typography,
				[
					'font'       => [ [ 'weight' => '700' ] ],
					'typography' => [ [ 'weight' => '300' ] ],
				] 
			)
		);
	}

	/**
	 * The shadow section writes the fallback it was given when no shadow was saved, and the usual one otherwise.
	 *
	 * @dataProvider shadowFallbackProvider
	 *
	 * @param string|null $fallback The fallback given to the section.
	 * @param string      $expected The CSS expected.
	 *
	 * @return void
	 */
	public function testShadowFallback( ?string $fallback, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Css_Shadow_Section( 'shadow', $fallback ), [] ) );
	}

	/**
	 * @return Generator
	 */
	public function typesProvider(): Generator {
		yield 'defaults' => [
			'attributes' => [],
			'expected'   => [
				'width_type'    => 'auto',
				'bg_type'       => 'normal',
				'bg_hover_type' => 'normal',
			],
		];
		yield 'empty strings are defaults' => [
			'attributes' => [
				'widthType'           => '',
				'backgroundType'      => '',
				'backgroundHoverType' => '',
			],
			'expected'   => [
				'width_type'    => 'auto',
				'bg_type'       => 'normal',
				'bg_hover_type' => 'normal',
			],
		];
		yield 'saved' => [
			'attributes' => [
				'widthType'           => 'fixed',
				'backgroundType'      => 'gradient',
				'backgroundHoverType' => 'gradient',
			],
			'expected'   => [
				'width_type'    => 'fixed',
				'bg_type'       => 'gradient',
				'bg_hover_type' => 'gradient',
			],
		];
	}

	/**
	 * @return Generator
	 */
	public function widthProvider(): Generator {
		yield 'fixed' => [
			'attributes' => [
				'widthType' => 'fixed',
				'width'     => [ 200, 150, 100 ],
				'widthUnit' => '%',
			],
			'expected'   => '.fixedabc, .menu .fixedabc{width:200%;}'
				. self::TABLET . '{.fixedabc, .menu .fixedabc{width:150%;}}'
				. self::MOBILE . '{.fixedabc, .menu .fixedabc{width:100%;}}',
		];
		yield 'fixed without a width' => [
			'attributes' => [ 'widthType' => 'fixed' ],
			'expected'   => '',
		];
		yield 'auto' => [
			'attributes' => [ 'width' => [ 200 ] ],
			'expected'   => '.menu .autoabc{width:initial;}',
		];
		yield 'other type' => [
			'attributes' => [
				'widthType' => 'full',
				'width'     => [ 200 ],
			],
			'expected'   => '.menu .autoabc{width:initial;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function backgroundProvider(): Generator {
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => '',
		];
		yield 'solid' => [
			'attributes' => [ 'background' => '#112233' ],
			'expected'   => '.btn{background:#112233;}',
		];
		yield 'solid under a gradient hover is important' => [
			'attributes' => [
				'background'          => '#112233',
				'backgroundHoverType' => 'gradient',
			],
			'expected'   => '.btn{background:#112233 !important;}',
		];
		yield 'solid is ignored for a gradient button' => [
			'attributes' => [
				'background'     => '#112233',
				'backgroundType' => 'gradient',
			],
			'expected'   => '',
		];
		yield 'gradient' => [
			'attributes' => [
				'backgroundType' => 'gradient',
				'gradient'       => 'linear-gradient(red, blue)',
				'background'     => '#112233',
			],
			'expected'   => '.btn{background:linear-gradient(red, blue) !important;}',
		];
		yield 'gradient is ignored for a solid button' => [
			'attributes' => [ 'gradient' => 'linear-gradient(red, blue)' ],
			'expected'   => '',
		];
		yield 'gradient button without a gradient' => [
			'attributes' => [ 'backgroundType' => 'gradient' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function hoverBackgroundProvider(): Generator {
		yield 'solid' => [
			'attributes' => [ 'backgroundHover' => '#00ff00' ],
			'expected'   => '.btn{background:#00ff00;}',
		];
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => '',
		];
		yield 'gradient button' => [
			'attributes' => [
				'backgroundType'  => 'gradient',
				'backgroundHover' => '#00ff00',
			],
			'expected'   => '',
		];
		yield 'gradient hover' => [
			'attributes' => [
				'backgroundHoverType' => 'gradient',
				'backgroundHover'     => '#00ff00',
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function visibilityProvider(): Generator {
		yield 'hidden' => [
			'attributes'  => [ 'flags' => [ false, true ] ],
			'device'      => 'tablet',
			'shows_again' => false,
			'expected'    => self::TABLET . '{.textabc{display:none;}}',
		];
		yield 'shown again' => [
			'attributes'  => [ 'flags' => [ true, false ] ],
			'device'      => 'mobile',
			'shows_again' => true,
			'expected'    => self::MOBILE . '{.textabc{display:block;}}',
		];
		yield 'off and not shown again' => [
			'attributes'  => [ 'flags' => [ true, false ] ],
			'device'      => 'tablet',
			'shows_again' => false,
			'expected'    => '',
		];
		yield 'compared loosely' => [
			'attributes'  => [ 'flags' => [ 0, 'yes' ] ],
			'device'      => 'tablet',
			'shows_again' => true,
			'expected'    => self::TABLET . '{.textabc{display:none;}}',
		];
		yield 'any device' => [
			'attributes'  => [ 'flags' => [ 0, true ] ],
			'device'      => null,
			'shows_again' => false,
			'expected'    => '.textabc{display:none;}',
		];
		yield 'empty string flag' => [
			'attributes'  => [ 'flags' => [ true, '' ] ],
			'device'      => 'tablet',
			'shows_again' => true,
			'expected'    => '',
		];
		yield 'no flag' => [
			'attributes'  => [ 'flags' => [ true ] ],
			'device'      => 'tablet',
			'shows_again' => true,
			'expected'    => '',
		];
		yield 'no flags' => [
			'attributes'  => [],
			'device'      => 'tablet',
			'shows_again' => true,
			'expected'    => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function iconProvider(): Generator {
		yield 'one size property' => [
			'properties' => [ 'font-size' ],
			'attributes' => [
				'iconColor'      => '#ff0000',
				'iconColorHover' => '#00ff00',
				'iconPadding'    => [ 1, 2, 3, 4 ],
				'iconSize'       => [ 20, 18 ],
				'iconSizeUnit'   => 'px',
			],
			'expected'   => '.kb-btnabc.kb-button .kb-svg-icon-wrap{color:#ff0000;padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;font-size:20px;}'
				. self::TABLET . '{.kb-btnabc.kb-button .kb-svg-icon-wrap{font-size:18px;}}'
				. '.kb-btnabc.kb-button:hover .kb-svg-icon-wrap, .kb-btnabc.kb-button:focus .kb-svg-icon-wrap{color:#00ff00;}',
		];
		yield 'two size properties' => [
			'properties' => [ 'font-size', '--kb-button-icon-size' ],
			'attributes' => [ 'iconSize' => [ 20 ] ],
			'expected'   => '.kb-btnabc.kb-button .kb-svg-icon-wrap{font-size:20px;--kb-button-icon-size:20px;}',
		];
		yield 'nothing saved' => [
			'properties' => [ 'font-size' ],
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function shadowFallbackProvider(): Generator {
		yield 'the usual fallback' => [
			'fallback' => null,
			'expected' => '.btn{box-shadow:rgba(0, 0, 0, 0.2) 0px 0px 14px 0px;}',
		];
		yield 'the fallback of the block' => [
			'fallback' => '1px 1px 2px 0px rgba(0, 0, 0, 0.2)',
			'expected' => '.btn{box-shadow:1px 1px 2px 0px rgba(0, 0, 0, 0.2);}',
		];
	}
}
