<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedbtn;

use Generator;
use Kadence_Blocks_Advancedbtn_Button_Device_Css;
use Kadence_Blocks_Advancedbtn_Button_Hover_Css;
use Kadence_Blocks_Advancedbtn_Button_Icon_Css;
use Kadence_Blocks_Advancedbtn_Button_Type;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Build_Input;

/**
 * The sections that write the hover state, the tablet and mobile look and the icon of one button.
 */
final class ButtonStatesTest extends Advancedbtn_Test_Case {

	private const HOVER = '.wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-0 .kt-button:hover, .wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-0 .kt-button:focus';

	private const OVERLAY = '.wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-0 .kt-button::before';

	/**
	 * The hover state writes its colors and shadow, then either the gradient overlay or the solid hover background.
	 *
	 * @dataProvider hoverProvider
	 *
	 * @param array<string, mixed> $attributes The saved button.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testHover( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Advancedbtn_Button_Hover_Css(), $attributes ) );
	}

	/**
	 * A button is a gradient button when either its normal or its hover background is a gradient.
	 *
	 * @dataProvider typeProvider
	 *
	 * @param array<string, mixed> $attributes The saved button.
	 * @param bool                 $expected   Whether the button is a gradient button.
	 *
	 * @return void
	 */
	public function testButtonType( array $attributes, bool $expected ): void {
		$input = new Kadence_Blocks_Css_Build_Input( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc', $this->context() );

		$this->assertSame( $expected, ( new Kadence_Blocks_Advancedbtn_Button_Type() )->is_gradient( $input ) );
	}

	/**
	 * The device section writes the gap, the size, the width and the padding of one device.
	 *
	 * @dataProvider deviceProvider
	 *
	 * @param string               $device     The device.
	 * @param int                  $size_index The position of the device in the stored sizes.
	 * @param int                  $index      The position of the device in the stored widths.
	 * @param array<string, mixed> $attributes The saved button.
	 * @param array<string, mixed> $derived    The values derived for the button.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testDevice( string $device, int $size_index, int $index, array $attributes, array $derived, string $expected ): void {
		$section = new Kadence_Blocks_Advancedbtn_Button_Device_Css( $device, $size_index, $index );

		$this->assertSameCss( $expected, $this->write_button( $section, $attributes, $derived ) );
	}

	/**
	 * The icon section writes the icon color, size, hover color and padding for every device.
	 *
	 * @dataProvider iconProvider
	 *
	 * @param array<string, mixed> $attributes The saved button.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testIcon( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_button( new Kadence_Blocks_Advancedbtn_Button_Icon_Css(), $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function hoverProvider(): Generator {
		$inset = [ true, '#000000', 0.2, 3, 1, 2, 2, true ];
		$plain = [ true, '#000000', 0.2, 3, 1, 2, 2, false ];

		yield 'gradient hover with an inset shadow and a radius' => [
			'attributes' => [
				'backgroundHoverType' => 'gradient',
				'backgroundHover'     => '#222222',
				'gradientHover'       => [ '#333333', 0.5, 5, 95, 'radial', 0, 'top' ],
				'boxShadowHover'      => $inset,
				'borderRadius'        => 8,
			],
			'expected'   => self::OVERLAY . '{-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;transition:opacity .3s ease-in-out;background:radial-gradient(at top, #222222 5%, rgba(51, 51, 51, 0.5) 95%);box-shadow:inset 3px 1px 2px 2px rgba(0, 0, 0, 0.2);border-radius:8px;}',
		];
		yield 'gradient hover radius defaults to three pixels' => [
			'attributes' => [
				'backgroundType' => 'gradient',
				'boxShadowHover' => $inset,
			],
			'expected'   => self::OVERLAY . '{-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;transition:opacity .3s ease-in-out;box-shadow:inset 3px 1px 2px 2px rgba(0, 0, 0, 0.2);border-radius:3px;}',
		];
		yield 'gradient hover default first color' => [
			'attributes' => [
				'backgroundType'      => 'gradient',
				'backgroundHoverType' => 'gradient',
			],
			'expected'   => self::OVERLAY . '{-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;transition:opacity .3s ease-in-out;background:linear-gradient(180deg, #444444 0%, #999999 100%);}',
		];
		yield 'gradient button with a solid hover color' => [
			'attributes' => [
				'backgroundType'         => 'gradient',
				'backgroundHover'        => '#123456',
				'backgroundHoverOpacity' => 0.3,
			],
			'expected'   => self::OVERLAY . '{-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;transition:opacity .3s ease-in-out;background:rgba(18, 52, 86, 0.3);}',
		];
		yield 'gradient button with nothing for hover' => [
			'attributes' => [ 'backgroundType' => 'gradient' ],
			'expected'   => self::OVERLAY . '{-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;transition:opacity .3s ease-in-out;}',
		];
		yield 'solid hover with colors and a plain shadow' => [
			'attributes' => [
				'colorHover'         => '#ffffff',
				'borderHover'        => '#000000',
				'borderHoverOpacity' => 0.5,
				'boxShadowHover'     => $plain,
			],
			'expected'   => self::HOVER . '{color:#ffffff;border-color:rgba(0, 0, 0, 0.5);box-shadow:3px 1px 2px 2px rgba(0, 0, 0, 0.2);}' . self::OVERLAY . '{display:none;}' . self::HOVER . '{background:#444444;}',
		];
		yield 'solid hover default background' => [
			'attributes' => [],
			'expected'   => self::OVERLAY . '{display:none;}' . self::HOVER . '{background:#444444;}',
		];
		yield 'solid hover that inherits its styles' => [
			'attributes' => [ 'inheritStyles' => 'inherit' ],
			'expected'   => self::OVERLAY . '{display:none;}',
		];
		yield 'solid hover color with an inset shadow' => [
			'attributes' => [
				'backgroundHover' => '#123456',
				'boxShadowHover'  => $inset,
			],
			'expected'   => self::OVERLAY . '{display:none;}' . self::HOVER . '{background:#123456;box-shadow:inset 3px 1px 2px 2px rgba(0, 0, 0, 0.2);}',
		];
	}

	/**
	 * @return Generator
	 */
	public function typeProvider(): Generator {
		yield 'normal gradient' => [
			'attributes' => [ 'backgroundType' => 'gradient' ],
			'expected'   => true,
		];
		yield 'hover gradient' => [
			'attributes' => [ 'backgroundHoverType' => 'gradient' ],
			'expected'   => true,
		];
		yield 'solid' => [
			'attributes' => [ 'backgroundType' => 'solid' ],
			'expected'   => false,
		];
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function deviceProvider(): Generator {
		$saved = [
			'tabletGap'           => 4,
			'mobileGap'           => 3,
			'responsiveSize'      => [ 14, 12 ],
			'sizeType'            => 'em',
			'width'               => [ 1, 200, 100 ],
			'btnSize'             => 'custom',
			'responsivePaddingLR' => [ 3, 2 ],
			'responsivePaddingBT' => [ 6, 5 ],
		];
		$fixed = [
			'key'        => 0,
			'width_type' => 'fixed',
		];

		yield 'tablet' => [
			'device'     => 'tablet',
			'size_index' => 0,
			'index'      => 0,
			'attributes' => $saved,
			'derived'    => $fixed,
			'expected'   => '@media all and (max-width: 1024px){.kt-btnsabc .kt-btn-wrap-0{margin-right:4px;}.wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-0 .kt-button{font-size:14em;width:200px;padding-left:3px;padding-right:3px;padding-top:6px;padding-bottom:6px;}}',
		];
		yield 'mobile' => [
			'device'     => 'mobile',
			'size_index' => 1,
			'index'      => 1,
			'attributes' => $saved,
			'derived'    => $fixed,
			'expected'   => '@media all and (max-width: 767px){.kt-btnsabc .kt-btn-wrap-0{margin-right:3px;}.wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-0 .kt-button{font-size:12em;width:100px;padding-left:2px;padding-right:2px;padding-top:5px;padding-bottom:5px;}}',
		];
		yield 'nothing saved' => [
			'device'     => 'mobile',
			'size_index' => 1,
			'index'      => 1,
			'attributes' => [],
			'derived'    => $fixed,
			'expected'   => '',
		];
		yield 'width ignored when the buttons are not a fixed width' => [
			'device'     => 'mobile',
			'size_index' => 1,
			'index'      => 1,
			'attributes' => [ 'width' => [ 1, 200, 100 ] ],
			'derived'    => [ 'key' => 0 ],
			'expected'   => '',
		];
		yield 'width saved as something else than a list' => [
			'device'     => 'tablet',
			'size_index' => 0,
			'index'      => 0,
			'attributes' => [ 'width' => 200 ],
			'derived'    => $fixed,
			'expected'   => '',
		];
		yield 'padding ignored for preset sizes' => [
			'device'     => 'tablet',
			'size_index' => 0,
			'index'      => 0,
			'attributes' => [
				'btnSize'             => 'small',
				'responsivePaddingLR' => [ 3 ],
			],
			'derived'    => $fixed,
			'expected'   => '',
		];
		yield 'horizontal padding only, in pixels' => [
			'device'     => 'tablet',
			'size_index' => 0,
			'index'      => 0,
			'attributes' => [
				'btnSize'             => 'custom',
				'responsivePaddingLR' => [ 3 ],
			],
			'derived'    => $fixed,
			'expected'   => '@media all and (max-width: 1024px){.wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-0 .kt-button{padding-left:3px;padding-right:3px;}}',
		];
	}

	/**
	 * @return Generator
	 */
	public function iconProvider(): Generator {
		$icon = '.wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-0 .kt-button .kt-btn-svg-icon';
		$pad  = '.kt-btnsabc .kt-btn-wrap-0 .kt-btn-svg-icon';

		yield 'everything' => [
			'attributes' => [
				'icon'              => 'fe_aperture',
				'iconColor'         => '#fff',
				'iconSize'          => [ 20, 18, 16 ],
				'iconColorHover'    => '#eee',
				'iconPadding'       => [ 1, 2, 3, 4 ],
				'iconTabletPadding' => [ 5, 6, 7, 8 ],
				'iconMobilePadding' => [ 1, 1, 1, 1 ],
			],
			'expected'   => $icon . '{color:#fff;font-size:20px;-webkit-transition:all .3s ease-in-out;-moz-transition:all .3s ease-in-out;transition:all .3s ease-in-out;}.wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-0 .kt-button:hover .kt-btn-svg-icon{color:#eee;}' . $pad . '{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}@media all and (max-width: 1024px){' . $icon . '{font-size:18px;}' . $pad . '{padding-top:5px;padding-right:6px;padding-bottom:7px;padding-left:8px;}}@media all and (max-width: 767px){' . $icon . '{font-size:16px;}' . $pad . '{padding-top:1px;padding-right:1px;padding-bottom:1px;padding-left:1px;}}',
		];
		yield 'no icon' => [
			'attributes' => [ 'iconColor' => '#fff' ],
			'expected'   => '',
		];
		yield 'icon without settings' => [
			'attributes' => [ 'icon' => 'x' ],
			'expected'   => '',
		];
		yield 'tablet padding without a usable size' => [
			'attributes' => [
				'icon'              => 'x',
				'iconTabletPadding' => [ 1, 2, 3, 4 ],
				'iconSize'          => [ 'a', 'b', 'c' ],
			],
			'expected'   => '@media all and (max-width: 1024px){' . $pad . '{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}}',
		];
		yield 'mobile size only, in ems' => [
			'attributes' => [
				'icon'         => 'x',
				'iconSize'     => [ null, null, 2 ],
				'iconSizeType' => 'em',
			],
			'expected'   => '@media all and (max-width: 767px){' . $icon . '{font-size:2em;}}',
		];
	}
}
