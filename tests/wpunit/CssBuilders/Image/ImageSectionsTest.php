<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Image;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Image_Align_Condition;
use Kadence_Blocks_Image_All_Condition;
use Kadence_Blocks_Image_Border_Color_Section;
use Kadence_Blocks_Image_Border_Width_Section;
use Kadence_Blocks_Image_Box_Shadow_Section;
use Kadence_Blocks_Image_Caption_Condition;
use Kadence_Blocks_Image_Caption_Device_Condition;
use Kadence_Blocks_Image_Caption_Device_Section;
use Kadence_Blocks_Image_Caption_Font_Family_Section;
use Kadence_Blocks_Image_Caption_Font_Size_Section;
use Kadence_Blocks_Image_Caption_Letter_Spacing_Section;
use Kadence_Blocks_Image_Caption_Line_Height_Section;
use Kadence_Blocks_Image_Drop_Shadow_Condition;
use Kadence_Blocks_Image_Drop_Shadow_Section;
use Kadence_Blocks_Image_Filled_Condition;
use Kadence_Blocks_Image_Mask_Custom_Condition;
use Kadence_Blocks_Image_Mask_Custom_Section;
use Kadence_Blocks_Image_Mask_Enabled_Condition;
use Kadence_Blocks_Image_Mask_Preset_Section;
use Kadence_Blocks_Image_Numeric_Condition;
use Kadence_Blocks_Image_Overlay_Opacity_Section;
use Kadence_Blocks_Image_Overlay_Type_Condition;
use Kadence_Blocks_Image_Px_Section;

/**
 * The sections and the conditions of the image CSS, one by one.
 */
final class ImageSectionsTest extends Image_Test_Case {

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_image( $section, $attributes ) );
	}

	/**
	 * A condition is met, or not, for the attributes.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param object               $condition  The condition.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testCondition( $condition, array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $condition->is_met( $this->image_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The shadow is only asked about when the box shadow is switched on, and is asked about the saved or shipped one.
	 *
	 * @return void
	 */
	public function testBoxShadowAsksTheBlockWhetherTheShadowIsVisible(): void {
		$this->write_image( new Kadence_Blocks_Image_Box_Shadow_Section(), [ 'boxShadow' => [ [ 'opacity' => 0.4 ] ] ] );
		$this->assertSame( [], $this->calls );

		$this->write_image( new Kadence_Blocks_Image_Box_Shadow_Section(), [ 'displayBoxShadow' => true ] );
		$this->assertSame( 'has_visible_shadow', $this->calls[0][0] );
		$this->assertSame( 0.2, $this->calls[0][1][0]['opacity'] );
	}

	/**
	 * Settings the editor never saves are read the way the original read them: as nothing, with a warning.
	 *
	 * @dataProvider unsavedProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testUnsavedSettingsAreReadAsNothing( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$warnings = 0;

		set_error_handler(
			static function () use ( &$warnings ) {
				++$warnings;

				return true;
			}
		);
		$css = $this->write_image( $section, $attributes );
		restore_error_handler();

		$this->assertSameCss( $expected, $css );
		$this->assertGreaterThan( 0, $warnings );
	}

	/**
	 * The caption has no first style to read when its styles are not a list.
	 *
	 * @return void
	 */
	public function testCaptionWithoutAFirstStyleIsNotMet(): void {
		set_error_handler(
			static function () {
				return true;
			}
		);
		$met = ( new Kadence_Blocks_Image_Caption_Condition() )->is_met( $this->image_input( [ 'captionStyles' => [] ], new Kadence_Blocks_CSS() ) );
		restore_error_handler();

		$this->assertFalse( $met );
	}

	/**
	 * @return Generator
	 */
	public function unsavedProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/image/loader.php';

		yield 'a border width of a side that does not exist' => [
			'section'    => new Kadence_Blocks_Image_Border_Width_Section( 'borderWidthDesktop' ),
			'attributes' => [ 'borderWidthDesktop' => [ 'a' => 3 ] ],
			'expected'   => '.current{border--width:3px;}',
		];
		yield 'a mask that is a list' => [
			'section'    => new Kadence_Blocks_Image_Mask_Preset_Section(),
			'attributes' => [ 'maskSvg' => [ 'a' ] ],
			'expected'   => '.current{-webkit-mask-image:url(' . KADENCE_BLOCKS_URL . 'includes/assets/images/masks/Array.svg);mask-image:url(' . KADENCE_BLOCKS_URL . 'includes/assets/images/masks/Array.svg);-webkit-mask-size:auto;mask-size:auto;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;}',
		];
		yield 'a google font without a family' => [
			'section'    => new Kadence_Blocks_Image_Caption_Font_Family_Section(),
			'attributes' => [ 'google' => true ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/image/loader.php';

		yield from $this->basicProvider();
		yield from $this->maskProvider();
		yield from $this->shadowProvider();
		yield from $this->captionProvider();
	}

	/**
	 * @return Generator
	 */
	private function basicProvider(): Generator {
		yield 'pixels' => [
			'section'    => new Kadence_Blocks_Image_Px_Section( 'max-width', 'imgMaxWidth' ),
			'attributes' => [ 'imgMaxWidth' => 300 ],
			'expected'   => '.current{max-width:300px;}',
		];
		yield 'overlay opacity saved' => [
			'section'    => new Kadence_Blocks_Image_Overlay_Opacity_Section(),
			'attributes' => [ 'overlayOpacity' => '0.6' ],
			'expected'   => '.current{opacity:0.6;}',
		];
		yield 'overlay opacity not saved' => [
			'section'    => new Kadence_Blocks_Image_Overlay_Opacity_Section(),
			'attributes' => [],
			'expected'   => '.current{opacity:0.3;}',
		];
		yield 'overlay opacity not a number' => [
			'section'    => new Kadence_Blocks_Image_Overlay_Opacity_Section(),
			'attributes' => [ 'overlayOpacity' => 'abc' ],
			'expected'   => '',
		];
		yield 'border color' => [
			'section'    => new Kadence_Blocks_Image_Border_Color_Section(),
			'attributes' => [ 'borderColor' => '#112233' ],
			'expected'   => '.current{border-color:#112233;}',
		];
		yield 'border widths in the unit' => [
			'section'    => new Kadence_Blocks_Image_Border_Width_Section( 'borderWidthDesktop' ),
			'attributes' => [
				'borderWidthDesktop' => [ 1, 'x', 3, 4 ],
				'borderWidthUnit'    => 'em',
			],
			'expected'   => '.current{border-top-width:1em;border-bottom-width:3em;border-left-width:4em;}',
		];
		yield 'border widths in pixels' => [
			'section'    => new Kadence_Blocks_Image_Border_Width_Section( 'borderWidthDesktop' ),
			'attributes' => [ 'borderWidthDesktop' => [ 2 ] ],
			'expected'   => '.current{border-top-width:2px;}',
		];
		yield 'border widths not a list' => [
			'section'    => new Kadence_Blocks_Image_Border_Width_Section( 'borderWidthDesktop' ),
			'attributes' => [ 'borderWidthDesktop' => '4' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function maskProvider(): Generator {
		yield 'custom mask' => [
			'section'    => new Kadence_Blocks_Image_Mask_Custom_Section(),
			'attributes' => [
				'maskUrl'      => 'u.svg',
				'maskSize'     => 'cover',
				'maskPosition' => 'top',
				'maskRepeat'   => 'repeat',
			],
			'expected'   => '.current{-webkit-mask-image:url(u.svg);mask-image:url(u.svg);-webkit-mask-size:cover;mask-size:cover;-webkit-mask-repeat:repeat;mask-repeat:repeat;-webkit-mask-position:top;mask-position:top;}',
		];
		yield 'custom mask defaults' => [
			'section'    => new Kadence_Blocks_Image_Mask_Custom_Section(),
			'attributes' => [ 'maskUrl' => 'u.svg' ],
			'expected'   => '.current{-webkit-mask-image:url(u.svg);mask-image:url(u.svg);-webkit-mask-size:auto;mask-size:auto;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center center;mask-position:center center;}',
		];
		yield 'custom mask without a url' => [
			'section'    => new Kadence_Blocks_Image_Mask_Custom_Section(),
			'attributes' => [ 'maskSize' => 'cover' ],
			'expected'   => '',
		];
		yield 'preset mask' => [
			'section'    => new Kadence_Blocks_Image_Mask_Preset_Section(),
			'attributes' => [ 'maskSvg' => 'blob1' ],
			'expected'   => '.current{-webkit-mask-image:url(' . KADENCE_BLOCKS_URL . 'includes/assets/images/masks/blob1.svg);mask-image:url(' . KADENCE_BLOCKS_URL . 'includes/assets/images/masks/blob1.svg);-webkit-mask-size:auto;mask-size:auto;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function shadowProvider(): Generator {
		yield 'box shadow off' => [
			'section'    => new Kadence_Blocks_Image_Box_Shadow_Section(),
			'attributes' => [ 'boxShadow' => [ [ 'opacity' => 0.4 ] ] ],
			'expected'   => '',
		];
		yield 'box shadow shipped' => [
			'section'    => new Kadence_Blocks_Image_Box_Shadow_Section(),
			'attributes' => [ 'displayBoxShadow' => true ],
			'expected'   => '.current{box-shadow:0px 0px 14px 0px rgba(0, 0, 0, 0.2);}',
		];
		yield 'box shadow not visible' => [
			'section'    => new Kadence_Blocks_Image_Box_Shadow_Section(),
			'attributes' => [
				'displayBoxShadow' => true,
				'boxShadow'        => [
					[
						'color'   => '#ff0000',
						'opacity' => 0,
					],
				],
			],
			'expected'   => '',
		];
		yield 'drop shadow saved' => [
			'section'    => new Kadence_Blocks_Image_Drop_Shadow_Section(),
			'attributes' => [
				'dropShadow' => [
					[
						'hOffset' => 1,
						'vOffset' => '2',
						'blur'    => 3,
						'color'   => '#ff0000',
						'opacity' => 0.5,
					],
				],
			],
			'expected'   => '.current{filter:drop-shadow(1px 2px 3px rgba(255, 0, 0, 0.5));}',
		];
		yield 'drop shadow defaults' => [
			'section'    => new Kadence_Blocks_Image_Drop_Shadow_Section(),
			'attributes' => [
				'dropShadow' => [
					[
						'hOffset' => 'a',
						'color'   => '',
					],
				],
			],
			'expected'   => '.current{filter:drop-shadow(0px 0px 14px rgba(0, 0, 0, 0.2));}',
		];
	}

	/**
	 * @return Generator
	 */
	private function captionProvider(): Generator {
		$size = new Kadence_Blocks_Image_Caption_Font_Size_Section();

		yield 'caption sizes' => [
			'section'    => $size,
			'attributes' => [
				'size'     => [ 10, 12, 14 ],
				'sizeType' => 'em',
			],
			'expected'   => '.current{font-size:10em;} @media all and (max-width: 1024px){.current{font-size:12em;}} @media all and (max-width: 767px){.current{font-size:14em;}}',
		];
		yield 'caption sizes not a list' => [
			'section'    => $size,
			'attributes' => [ 'size' => '12' ],
			'expected'   => '',
		];
		yield 'caption line height' => [
			'section'    => new Kadence_Blocks_Image_Caption_Line_Height_Section(),
			'attributes' => [
				'lineHeight' => [ 2 ],
				'lineType'   => 'em',
			],
			'expected'   => '.current{line-height:2em;}',
		];
		yield 'caption line height in pixels' => [
			'section'    => new Kadence_Blocks_Image_Caption_Line_Height_Section(),
			'attributes' => [ 'lineHeight' => [ 20 ] ],
			'expected'   => '.current{line-height:20px;}',
		];
		yield 'caption line height not a list' => [
			'section'    => new Kadence_Blocks_Image_Caption_Line_Height_Section(),
			'attributes' => [ 'lineHeight' => '20' ],
			'expected'   => '',
		];
		yield 'caption letter spacing' => [
			'section'    => new Kadence_Blocks_Image_Caption_Letter_Spacing_Section(),
			'attributes' => [ 'letterSpacing' => 2 ],
			'expected'   => '.current{letter-spacing:2px;}',
		];
		yield 'caption letter spacing per device' => [
			'section'    => new Kadence_Blocks_Image_Caption_Letter_Spacing_Section(),
			'attributes' => [ 'letterSpacing' => [ 1, 2 ] ],
			'expected'   => '.current{letter-spacing:1px;} @media all and (max-width: 1024px){.current{letter-spacing:2px;}}',
		];
		yield 'caption letter spacing empty' => [
			'section'    => new Kadence_Blocks_Image_Caption_Letter_Spacing_Section(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'caption plain family' => [
			'section'    => new Kadence_Blocks_Image_Caption_Font_Family_Section(),
			'attributes' => [ 'family' => 'Arial' ],
			'expected'   => '.current{font-family:Arial;}',
		];
		yield 'caption no family' => [
			'section'    => new Kadence_Blocks_Image_Caption_Font_Family_Section(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'caption google family' => [
			'section'    => new Kadence_Blocks_Image_Caption_Font_Family_Section(),
			'attributes' => [
				'family'     => 'Roboto',
				'google'     => true,
				'loadGoogle' => false,
				'variant'    => '700',
			],
			'expected'   => '.current{font-family:Roboto;}',
		];
		yield 'caption tablet' => [
			'section'    => new Kadence_Blocks_Image_Caption_Device_Section( 1 ),
			'attributes' => [
				'captionStyles' => [
					[
						'size'       => [ 1, 12 ],
						'sizeType'   => 'em',
						'lineHeight' => [ 1, 3 ],
					],
				],
			],
			'expected'   => '.current{font-size:12em;line-height:3px;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/image/loader.php';

		$aligned = new Kadence_Blocks_Image_Align_Condition( [ 'left', 'right' ], true );
		$plain   = new Kadence_Blocks_Image_Align_Condition( [ 'wide', 'full' ], false );

		yield 'aligned left' => [
			'condition'  => $aligned,
			'attributes' => [ 'align' => 'left' ],
			'expected'   => true,
		];
		yield 'not aligned' => [
			'condition'  => $aligned,
			'attributes' => [],
			'expected'   => false,
		];
		yield 'not wide when not aligned' => [
			'condition'  => $plain,
			'attributes' => [],
			'expected'   => true,
		];
		yield 'not wide when wide' => [
			'condition'  => $plain,
			'attributes' => [ 'align' => 'wide' ],
			'expected'   => false,
		];
		yield 'numeric' => [
			'condition'  => new Kadence_Blocks_Image_Numeric_Condition( 'a' ),
			'attributes' => [ 'a' => '5' ],
			'expected'   => true,
		];
		yield 'not numeric' => [
			'condition'  => new Kadence_Blocks_Image_Numeric_Condition( 'a' ),
			'attributes' => [ 'a' => 'x' ],
			'expected'   => false,
		];
		yield 'filled' => [
			'condition'  => new Kadence_Blocks_Image_Filled_Condition( 'a' ),
			'attributes' => [ 'a' => 'x' ],
			'expected'   => true,
		];
		yield 'not filled' => [
			'condition'  => new Kadence_Blocks_Image_Filled_Condition( 'a' ),
			'attributes' => [ 'a' => '0' ],
			'expected'   => false,
		];
		yield 'all met' => [
			'condition'  => new Kadence_Blocks_Image_All_Condition( [ $plain, $plain ] ),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'not all met' => [
			'condition'  => new Kadence_Blocks_Image_All_Condition( [ $plain, $aligned ] ),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'normal overlay by default' => [
			'condition'  => new Kadence_Blocks_Image_Overlay_Type_Condition( 'normal' ),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'gradient overlay' => [
			'condition'  => new Kadence_Blocks_Image_Overlay_Type_Condition( 'gradient' ),
			'attributes' => [ 'overlayType' => 'gradient' ],
			'expected'   => true,
		];
		yield 'a true type is loosely every type' => [
			'condition'  => new Kadence_Blocks_Image_Overlay_Type_Condition( 'gradient' ),
			'attributes' => [ 'overlayType' => true ],
			'expected'   => true,
		];
		yield 'normal overlay is not gradient' => [
			'condition'  => new Kadence_Blocks_Image_Overlay_Type_Condition( 'gradient' ),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'mask' => [
			'condition'  => new Kadence_Blocks_Image_Mask_Enabled_Condition(),
			'attributes' => [ 'maskSvg' => 'blob1' ],
			'expected'   => true,
		];
		yield 'mask none' => [
			'condition'  => new Kadence_Blocks_Image_Mask_Enabled_Condition(),
			'attributes' => [ 'maskSvg' => 'none' ],
			'expected'   => false,
		];
		yield 'mask not saved' => [
			'condition'  => new Kadence_Blocks_Image_Mask_Enabled_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'custom mask' => [
			'condition'  => new Kadence_Blocks_Image_Mask_Custom_Condition(),
			'attributes' => [ 'maskSvg' => 'custom' ],
			'expected'   => true,
		];
		yield 'preset mask' => [
			'condition'  => new Kadence_Blocks_Image_Mask_Custom_Condition(),
			'attributes' => [ 'maskSvg' => 'blob1' ],
			'expected'   => false,
		];
		yield 'drop shadow list' => [
			'condition'  => new Kadence_Blocks_Image_Drop_Shadow_Condition(),
			'attributes' => [ 'dropShadow' => [ [] ] ],
			'expected'   => true,
		];
		yield 'drop shadow scalar' => [
			'condition'  => new Kadence_Blocks_Image_Drop_Shadow_Condition(),
			'attributes' => [ 'dropShadow' => [ 'x' ] ],
			'expected'   => false,
		];
		yield 'drop shadow not saved' => [
			'condition'  => new Kadence_Blocks_Image_Drop_Shadow_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'caption styles' => [
			'condition'  => new Kadence_Blocks_Image_Caption_Condition(),
			'attributes' => [ 'captionStyles' => [ [] ] ],
			'expected'   => true,
		];
		yield 'caption switched off' => [
			'condition'  => new Kadence_Blocks_Image_Caption_Condition(),
			'attributes' => [
				'showCaption'   => false,
				'captionStyles' => [ [] ],
			],
			'expected'   => false,
		];
		yield 'caption not saved' => [
			'condition'  => new Kadence_Blocks_Image_Caption_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'caption styles scalar' => [
			'condition'  => new Kadence_Blocks_Image_Caption_Condition(),
			'attributes' => [ 'captionStyles' => 'x' ],
			'expected'   => false,
		];
		yield 'caption size on tablet' => [
			'condition'  => new Kadence_Blocks_Image_Caption_Device_Condition( 1 ),
			'attributes' => [ 'captionStyles' => [ [ 'size' => [ 1, 2 ] ] ] ],
			'expected'   => true,
		];
		yield 'caption line height on mobile' => [
			'condition'  => new Kadence_Blocks_Image_Caption_Device_Condition( 2 ),
			'attributes' => [ 'captionStyles' => [ [ 'lineHeight' => [ 1, 2, 3 ] ] ] ],
			'expected'   => true,
		];
		yield 'caption nothing on mobile' => [
			'condition'  => new Kadence_Blocks_Image_Caption_Device_Condition( 2 ),
			'attributes' => [
				'captionStyles' => [
					[
						'size'       => [ 1, 2 ],
						'lineHeight' => 'abc',
					],
				],
			],
			'expected'   => false,
		];
	}
}
