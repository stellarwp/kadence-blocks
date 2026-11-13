<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Form;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Form_Active_Style_Condition;
use Kadence_Blocks_Form_Background_Css;
use Kadence_Blocks_Form_Border_Width_Css;
use Kadence_Blocks_Form_Checkbox_Style_Css;
use Kadence_Blocks_Form_Field_Style_Condition;
use Kadence_Blocks_Form_Font_Device_Css;
use Kadence_Blocks_Form_Font_Size_Css;
use Kadence_Blocks_Form_Font_Text_Css;
use Kadence_Blocks_Form_Google_Font_Css;
use Kadence_Blocks_Form_Gutter_Css;
use Kadence_Blocks_Form_Honey_Pot_Condition;
use Kadence_Blocks_Form_Hover_Inset_Condition;
use Kadence_Blocks_Form_Padding_Css;
use Kadence_Blocks_Form_Radius_Css;
use Kadence_Blocks_Form_Row_Gap_Css;
use Kadence_Blocks_Form_Scripts_Css;
use Kadence_Blocks_Form_Submit_Gradient_Condition;
use Kadence_Blocks_Form_Submit_Width_Css;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections of the form CSS, one by one.
 */
final class FormSectionsTest extends Free_Section_Test_Case {

	private const FIELD = '.kadence-form-abc .kb-form .kadence-blocks-form-field';

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	private $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/form/loader.php';
	}

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
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes ) );
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
		$this->assertSame( $expected, $condition->is_met( $this->input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The form always asks for its script, and for the script of the version of reCAPTCHA it uses.
	 *
	 * @dataProvider scriptProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string[]             $expected   The scripts expected.
	 *
	 * @return void
	 */
	public function testScripts( array $attributes, array $expected ): void {
		$context = new Kadence_Blocks_Css_Block_Context(
			'form',
			function ( $member, $script ) {
				$this->calls[] = [ $member, $script ];
			}
		);

		( new Kadence_Blocks_Form_Scripts_Css() )->write( new Kadence_Blocks_Css_Build_Input( $attributes, new Kadence_Blocks_CSS(), 'abc', 'abc', $context ) );

		$this->assertSame(
			array_map(
				static function ( $script ) {
					return [ 'enqueue_script', $script ];
				},
				$expected 
			),
			$this->calls 
		);
	}

	/**
	 * A font that is a Google font that has to be loaded is asked for, and nothing else is.
	 *
	 * @dataProvider fontProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<int, string[]> $expected   The fonts asked for.
	 *
	 * @return void
	 */
	public function testGoogleFont( array $attributes, array $expected ): void {
		$fonts = [];
		$css   = new class( $fonts ) extends Kadence_Blocks_CSS {

			/**
			 * The fonts that were asked for.
			 *
			 * @var array
			 */
			private $asked;

			/**
			 * Create the recorder.
			 *
			 * @param array $asked The fonts that were asked for, by reference.
			 */
			public function __construct( array &$asked ) {
				parent::__construct();

				$this->asked = &$asked;
			}

			/**
			 * Record the font.
			 *
			 * @param string      $font_name    The family.
			 * @param string|null $font_variant The variant.
			 * @param string|null $subset       The subset.
			 *
			 * @return void
			 */
			public function maybe_add_google_font( $font_name, $font_variant = null, $subset = null ) {
				$this->asked[] = [ $font_name, $font_variant, $subset ];
			}
		};

		( new Kadence_Blocks_Form_Google_Font_Css( 'labelFont' ) )->write( $this->input( $attributes, $css ) );

		$this->assertSame( $expected, $fonts );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/form/loader.php';

		yield from $this->gapProvider();
		yield from $this->fontProvider2();
		yield from $this->fieldProvider();
	}

	/**
	 * The zero margins the form asks for (below the submit field, above the checkbox) are dropped by the CSS builder, as they
	 * always were, so they are not in the expected CSS.
	 *
	 * @return Generator
	 */
	private function gapProvider(): Generator {
		yield 'space below the fields' => [
			'section'    => new Kadence_Blocks_Form_Row_Gap_Css( 'rowGap', 'desktop' ),
			'attributes' => [
				'rowGap'     => 12,
				'rowGapType' => 'em',
			],
			'expected'   => self::FIELD . '{margin-bottom:12em;}',
		];
		yield 'space below the fields on tablet' => [
			'section'    => new Kadence_Blocks_Form_Row_Gap_Css( 'tabletRowGap', 'tablet' ),
			'attributes' => [ 'tabletRowGap' => 8 ],
			'expected'   => '@media all and (max-width: 1024px){' . self::FIELD . '{margin-bottom:8px;}}',
		];
		yield 'no space below the fields' => [
			'section'    => new Kadence_Blocks_Form_Row_Gap_Css( 'rowGap', 'desktop' ),
			'attributes' => [ 'rowGap' => 'wide' ],
			'expected'   => '',
		];
		yield 'space between the fields' => [
			'section'    => new Kadence_Blocks_Form_Gutter_Css( 'gutter', 'desktop' ),
			'attributes' => [
				'gutter'     => 15,
				'gutterType' => '%',
			],
			'expected'   => self::FIELD . '{padding-right:7%;padding-left:7%;}.kadence-form-abc .kb-form{margin-right:-7%;margin-left:-7%;}',
		];
		yield 'space between the fields on mobile' => [
			'section'    => new Kadence_Blocks_Form_Gutter_Css( 'mobileGutter', 'mobile' ),
			'attributes' => [ 'mobileGutter' => 10 ],
			'expected'   => '@media all and (max-width: 767px){' . self::FIELD . '{padding-right:5px;padding-left:5px;}.kadence-form-abc .kb-form{margin-right:-5px;margin-left:-5px;}}',
		];
		yield 'no space between the fields' => [
			'section'    => new Kadence_Blocks_Form_Gutter_Css( 'gutter', 'desktop' ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function fontProvider2(): Generator {
		yield 'font size and line height of a font on desktop' => [
			'section'    => new Kadence_Blocks_Form_Font_Size_Css( 'size', 'sizeType', 'lineType', false ),
			'attributes' => [
				'size'       => [ 20, 16 ],
				'sizeType'   => 'em',
				'lineHeight' => [ 1.5 ],
				'lineType'   => '',
			],
			'expected'   => '{font-size:20em;line-height:1.5;}',
		];
		yield 'an empty unit counts as pixels when the form says so' => [
			'section'    => new Kadence_Blocks_Form_Font_Size_Css( 'fontSize', 'fontSizeType', 'lineType', true ),
			'attributes' => [
				'fontSize'     => [ 20 ],
				'fontSizeType' => '',
				'lineHeight'   => [ 1.5 ],
				'lineType'     => '',
			],
			'expected'   => '{font-size:20px;line-height:1.5px;}',
		];
		yield 'spacing, transform, family, style and weight of a font' => [
			'section'    => new Kadence_Blocks_Form_Font_Text_Css(),
			'attributes' => [
				'letterSpacing' => 2,
				'textTransform' => 'uppercase',
				'family'        => 'Roboto',
				'style'         => 'italic',
				'weight'        => '700',
			],
			'expected'   => '{letter-spacing:2px;text-transform:uppercase;font-family:Roboto;font-style:italic;font-weight:700;}',
		];
		yield 'the checkbox follows the line height of the label' => [
			'section'    => new Kadence_Blocks_Form_Checkbox_Style_Css( 0, false ),
			'attributes' => [
				'lineHeight' => [ 2 ],
				'lineType'   => 'em',
			],
			'expected'   => self::FIELD . '.kb-accept-form-field .kb-checkbox-style{font-size:2em;height:1em;}',
		];
		yield 'no checkbox size without a line height' => [
			'section'    => new Kadence_Blocks_Form_Checkbox_Style_Css( 0, false ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'font size of a device' => [
			'section'    => new Kadence_Blocks_Form_Font_Device_Css( 'size', 'sizeType', 1, 'tablet', '.kadence-form-{id} .label', true ),
			'attributes' => [
				'size'       => [ 20, 16 ],
				'sizeType'   => '',
				'lineHeight' => [ 1, 1.2 ],
				'lineType'   => 'em',
			],
			'expected'   => '@media all and (max-width: 1024px){.kadence-form-abc .label{font-size:16px;line-height:1.2em;}' . self::FIELD . '.kb-accept-form-field .kb-checkbox-style{font-size:1.2em;height:1em;}}',
		];
		yield 'a device without a size or a line height' => [
			'section'    => new Kadence_Blocks_Form_Font_Device_Css( 'size', 'sizeType', 2, 'mobile', '.kadence-form-{id} .label', false ),
			'attributes' => [ 'size' => [ 1, 2 ] ],
			'expected'   => '',
		];
		yield 'padding of a custom sized field' => [
			'section'    => new Kadence_Blocks_Form_Padding_Css( 'tabletPadding', 'tablet', '.kadence-form-{id} .field' ),
			'attributes' => [
				'size'          => 'custom',
				'tabletPadding' => [ 1, 2, 3, 4 ],
			],
			'expected'   => '@media all and (max-width: 1024px){.kadence-form-abc .field{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}}',
		];
		yield 'no padding without a custom size' => [
			'section'    => new Kadence_Blocks_Form_Padding_Css( 'deskPadding', 'desktop', '.kadence-form-{id} .field' ),
			'attributes' => [
				'size'        => '',
				'deskPadding' => [ 1, 2, 3, 4 ],
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function fieldProvider(): Generator {
		yield 'solid background with its opacity' => [
			'section'    => new Kadence_Blocks_Form_Background_Css( 'backgroundType', 'background', 'backgroundOpacity', 'gradient', true ),
			'attributes' => [
				'background'        => '#ff0000',
				'backgroundOpacity' => 0.5,
			],
			'expected'   => '{background:rgba(255, 0, 0, 0.5);}',
		];
		yield 'gradient that starts on nothing starts on transparent' => [
			'section'    => new Kadence_Blocks_Form_Background_Css( 'backgroundType', 'background', 'backgroundOpacity', 'gradient', true ),
			'attributes' => [
				'backgroundType' => 'gradient',
				'gradient'       => [ '#0000ff', 1, 10, 90, 'linear', 45 ],
			],
			'expected'   => '{background:linear-gradient(45deg, rgba(255,255,255,0) 10%, #0000ff 90%);}',
		];
		yield 'gradient that starts on nothing starts on a dark color for the states' => [
			'section'    => new Kadence_Blocks_Form_Background_Css( 'backgroundActiveType', 'backgroundActive', 'backgroundActiveOpacity', 'gradientActive', false ),
			'attributes' => [
				'backgroundActiveType' => 'gradient',
				'gradientActive'       => [ '#0000ff', 1, 0, 100, 'radial', 0, 'top' ],
			],
			'expected'   => '{background:radial-gradient(at top, #444444 0%, #0000ff 100%);}',
		];
		yield 'gradient that starts on a color' => [
			'section'    => new Kadence_Blocks_Form_Background_Css( 'backgroundType', 'background', 'backgroundOpacity', 'gradient', true ),
			'attributes' => [
				'backgroundType' => 'gradient',
				'background'     => '#ff0000',
			],
			'expected'   => '{background:linear-gradient(180deg, #ff0000 0%, #999999 100%);}',
		];
		yield 'no background' => [
			'section'    => new Kadence_Blocks_Form_Background_Css( 'backgroundType', 'background', 'backgroundOpacity', 'gradient', true ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'border radius of a number' => [
			'section'    => new Kadence_Blocks_Form_Radius_Css( 'borderRadius', true ),
			'attributes' => [ 'borderRadius' => 0 ],
			'expected'   => '{border-radius:0px;}',
		];
		yield 'border radius that only has to be saved' => [
			'section'    => new Kadence_Blocks_Form_Radius_Css( 'borderRadius', false ),
			'attributes' => [ 'borderRadius' => 0 ],
			'expected'   => '',
		];
		yield 'border width of the four sides' => [
			'section'    => new Kadence_Blocks_Form_Border_Width_Css(),
			'attributes' => [ 'borderWidth' => [ 1, 2, 3, 4 ] ],
			'expected'   => '{border-width:1px 2px 3px 4px;}',
		];
		yield 'no border width' => [
			'section'    => new Kadence_Blocks_Form_Border_Width_Css(),
			'attributes' => [ 'borderWidth' => [ '', 2, 3, 4 ] ],
			'expected'   => '',
		];
		yield 'fixed width of the submit button' => [
			'section'    => new Kadence_Blocks_Form_Submit_Width_Css(),
			'attributes' => [
				'widthType'  => 'fixed',
				'fixedWidth' => [ 120 ],
			],
			'expected'   => '{width:120px;}',
		];
		yield 'the width of the submit button is not fixed' => [
			'section'    => new Kadence_Blocks_Form_Submit_Width_Css(),
			'attributes' => [
				'widthType'  => 'auto',
				'fixedWidth' => [ 120 ],
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function scriptProvider(): Generator {
		yield 'no reCAPTCHA' => [
			'attributes' => [],
			'expected'   => [ 'kadence-blocks-form' ],
		];
		yield 'reCAPTCHA version two' => [
			'attributes' => [
				'recaptcha'        => true,
				'recaptchaVersion' => 'v2',
			],
			'expected'   => [ 'kadence-blocks-form', 'kadence-blocks-google-recaptcha-v2' ],
		];
		yield 'reCAPTCHA of another version' => [
			'attributes' => [ 'recaptcha' => true ],
			'expected'   => [ 'kadence-blocks-form', 'kadence-blocks-google-recaptcha-v3' ],
		];
	}

	/**
	 * @return Generator
	 */
	public function fontProvider(): Generator {
		yield 'a Google font' => [
			'attributes' => [
				'labelFont' => [
					[
						'google'  => true,
						'family'  => 'Roboto',
						'variant' => '700',
						'subset'  => 'latin',
					],
				],
			],
			'expected'   => [ [ 'Roboto', '700', 'latin' ] ],
		];
		yield 'a Google font with no variant' => [
			'attributes' => [
				'labelFont' => [
					[
						'google'     => true,
						'family'     => 'Roboto',
						'loadGoogle' => true,
					],
				],
			],
			'expected'   => [ [ 'Roboto', '', '' ] ],
		];
		yield 'a font that is not from Google' => [
			'attributes' => [
				'labelFont' => [
					[
						'google' => false,
						'family' => 'Roboto',
					],
				],
			],
			'expected'   => [],
		];
		yield 'a Google font that must not be loaded' => [
			'attributes' => [
				'labelFont' => [
					[
						'google'     => true,
						'family'     => 'Roboto',
						'loadGoogle' => false,
					],
				],
			],
			'expected'   => [],
		];
		yield 'a Google font without a family' => [
			'attributes' => [ 'labelFont' => [ [ 'google' => true ] ] ],
			'expected'   => [],
		];
		yield 'no font' => [
			'attributes' => [],
			'expected'   => [],
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/form/loader.php';

		yield 'a field with a color' => [
			'condition'  => new Kadence_Blocks_Form_Field_Style_Condition(),
			'attributes' => [ 'color' => '#fff' ],
			'expected'   => true,
		];
		yield 'a field with a gradient' => [
			'condition'  => new Kadence_Blocks_Form_Field_Style_Condition(),
			'attributes' => [ 'backgroundType' => 'gradient' ],
			'expected'   => true,
		];
		yield 'a field with a shadow' => [
			'condition'  => new Kadence_Blocks_Form_Field_Style_Condition(),
			'attributes' => [ 'boxShadow' => [ true ] ],
			'expected'   => true,
		];
		yield 'a field with a radius that is a number' => [
			'condition'  => new Kadence_Blocks_Form_Field_Style_Condition(),
			'attributes' => [ 'borderRadius' => '0' ],
			'expected'   => true,
		];
		yield 'a field with font sizes' => [
			'condition'  => new Kadence_Blocks_Form_Field_Style_Condition(),
			'attributes' => [ 'fontSize' => [] ],
			'expected'   => true,
		];
		yield 'a field with a line height' => [
			'condition'  => new Kadence_Blocks_Form_Field_Style_Condition(),
			'attributes' => [ 'lineHeight' => [ 1.5 ] ],
			'expected'   => true,
		];
		yield 'a field with a border width' => [
			'condition'  => new Kadence_Blocks_Form_Field_Style_Condition(),
			'attributes' => [ 'borderWidth' => [ 1 ] ],
			'expected'   => true,
		];
		yield 'a field with nothing' => [
			'condition'  => new Kadence_Blocks_Form_Field_Style_Condition(),
			'attributes' => [
				'color'       => '',
				'borderWidth' => [ '' ],
				'boxShadow'   => [ false ],
			],
			'expected'   => false,
		];
		yield 'a focused field with a color' => [
			'condition'  => new Kadence_Blocks_Form_Active_Style_Condition(),
			'attributes' => [ 'borderActive' => '#fff' ],
			'expected'   => true,
		];
		yield 'a focused field with a gradient' => [
			'condition'  => new Kadence_Blocks_Form_Active_Style_Condition(),
			'attributes' => [ 'backgroundActiveType' => 'gradient' ],
			'expected'   => true,
		];
		yield 'a focused field with the shadow of the field' => [
			'condition'  => new Kadence_Blocks_Form_Active_Style_Condition(),
			'attributes' => [ 'boxShadow' => [ true ] ],
			'expected'   => true,
		];
		yield 'a focused field with nothing' => [
			'condition'  => new Kadence_Blocks_Form_Active_Style_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'a submit button with a gradient' => [
			'condition'  => new Kadence_Blocks_Form_Submit_Gradient_Condition(),
			'attributes' => [ 'backgroundHoverType' => 'gradient' ],
			'expected'   => true,
		];
		yield 'a submit button with solid backgrounds' => [
			'condition'  => new Kadence_Blocks_Form_Submit_Gradient_Condition(),
			'attributes' => [ 'backgroundType' => 'solid' ],
			'expected'   => false,
		];
		yield 'an inset hover shadow' => [
			'condition'  => new Kadence_Blocks_Form_Hover_Inset_Condition(),
			'attributes' => [ 'boxShadowHover' => [ true, 1, 1, 1, 1, 1, 1, true ] ],
			'expected'   => true,
		];
		yield 'a plain hover shadow' => [
			'condition'  => new Kadence_Blocks_Form_Hover_Inset_Condition(),
			'attributes' => [ 'boxShadowHover' => [ true, 1, 1, 1, 1, 1, 1, false ] ],
			'expected'   => false,
		];
		yield 'a honey pot nobody turned off' => [
			'condition'  => new Kadence_Blocks_Form_Honey_Pot_Condition(),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'a honey pot that was turned off' => [
			'condition'  => new Kadence_Blocks_Form_Honey_Pot_Condition(),
			'attributes' => [ 'honeyPot' => false ],
			'expected'   => false,
		];
	}
}
