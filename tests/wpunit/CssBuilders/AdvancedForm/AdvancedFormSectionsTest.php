<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\AdvancedForm;

use Generator;
use Kadence_Blocks_Advanced_Form_Active_Border_Css;
use Kadence_Blocks_Advanced_Form_Border_Css;
use Kadence_Blocks_Advanced_Form_Border_Variable_Css;
use Kadence_Blocks_Advanced_Form_Color_Css;
use Kadence_Blocks_Advanced_Form_Dark_Scheme_Css;
use Kadence_Blocks_Advanced_Form_Fill_Css;
use Kadence_Blocks_Advanced_Form_Gap_Css;
use Kadence_Blocks_Advanced_Form_Max_Width_Css;
use Kadence_Blocks_Advanced_Form_Measure_Css;
use Kadence_Blocks_Advanced_Form_Message_Spacing_Css;
use Kadence_Blocks_Advanced_Form_Message_Typography_Css;
use Kadence_Blocks_Advanced_Form_Normal_Style_Css;
use Kadence_Blocks_Advanced_Form_Settings;
use Kadence_Blocks_Advanced_Form_Shadow_Css;
use Kadence_Blocks_Advanced_Form_Typography_Css;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Throwable;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections of the advanced form CSS, one by one, on settings given as plain arrays: no post is needed.
 */
final class AdvancedFormSectionsTest extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advanced-form/loader.php';
	}

	/**
	 * A section writes the CSS expected for the saved settings of the form.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section  The section under test.
	 * @param array<string, mixed>       $settings The saved settings of the form.
	 * @param string                     $expected The CSS expected.
	 *
	 * @return void
	 */
	public function testSectionWritesCss( Kadence_Blocks_Css_Section $section, array $settings, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_form( $section, $settings ) );
	}

	/**
	 * The sections, the settings and the CSS they write.
	 *
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advanced-form/loader.php';

		$shadow = [ true, '#123456', 0.5, '1', '2', '3', '4', false ];

		yield 'measure of the form, with its own keys' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Measure_Css(
				null,
				'padding',
				'padding',
				[
					'desktop_key' => 'pad',
					'tablet_key'  => 'tabPad',
				] 
			),
			'settings' => [
				'pad'    => [ '1', '2', '3', '4' ],
				'tabPad' => [ '5', '6', '7', '8' ],
			],
			'expected' => '.f{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}@media all and (max-width: 1024px){.f{padding-top:5px;padding-right:6px;padding-bottom:7px;padding-left:8px;}}',
		];
		yield 'measure of a group, with a unit' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Measure_Css( 'style', 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
			'settings' => [
				'style' => [
					'padding'     => [ '1', '2', '3', '4' ],
					'paddingUnit' => 'em',
				],
			],
			'expected' => '.f{padding-top:1em;padding-right:2em;padding-bottom:3em;padding-left:4em;}',
		];
		yield 'measure of a group that is not saved' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Measure_Css( 'style', 'padding', 'padding', [] ),
			'settings' => [],
			'expected' => '',
		];
		yield 'gradient background' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Fill_Css( 'background', 'backgroundType', 'gradient', 'background', 'background' ),
			'settings' => [
				'background' => [
					'backgroundType' => 'gradient',
					'gradient'       => 'linear-gradient(#000,#fff)',
					'background'     => '#ff0000',
				],
			],
			'expected' => '.f{background:linear-gradient(#000,#fff);}',
		];
		yield 'color background' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Fill_Css( 'background', 'backgroundType', 'gradient', 'background', 'background' ),
			'settings' => [
				'background' => [
					'backgroundType' => 'normal',
					'gradient'       => 'linear-gradient(#000,#fff)',
					'background'     => '#ff0000',
				],
			],
			'expected' => '.f{background:#ff0000;}',
		];
		yield 'background with no type' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Fill_Css( 'style', 'backgroundType', 'gradient', 'background', '--kb-form-background-color' ),
			'settings' => [ 'style' => [ 'background' => '#00f' ] ],
			'expected' => '.f{--kb-form-background-color:#00f;}',
		];
		yield 'max width' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Max_Width_Css(),
			'settings' => [
				'maxWidth'     => [ '600', '400', '' ],
				'maxWidthUnit' => 'px',
			],
			'expected' => '.f{max-width:600px;}@media all and (max-width: 1024px){.f{max-width:400px;}}',
		];
		yield 'gap of the fields' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Gap_Css(),
			'settings' => [
				'style' => [
					'gap'     => [ '10', '', '' ],
					'gapUnit' => 'rem',
				],
			],
			'expected' => '.f{gap:10rem;}',
		];
		yield 'typography of a group' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Typography_Css( 'labelFont' ),
			'settings' => [
				'labelFont' => [
					'size'   => [ '14', '', '' ],
					'weight' => '700',
					'color'  => '#111',
				],
			],
			'expected' => '.f{font-size:14px;font-weight:700;color:#111;}',
		];
		yield 'typography of a group that is not saved' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Typography_Css( 'labelFont' ),
			'settings' => [],
			'expected' => '',
		];
		yield 'border of the fields on desktop and tablet' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Border_Css( 'fieldBorderStyle' ),
			'settings' => [
				'fieldBorderStyle'       => [
					'top'  => [ '#ff0000', 'solid', '2' ],
					'unit' => 'px',
				],
				'tabletFieldBorderStyle' => [
					'top'  => [ '#00ff00', 'solid', '3' ],
					'unit' => 'px',
				],
			],
			'expected' => '.f{border-top:2px solid #ff0000;}@media all and (max-width: 1024px){.f{border-top:3px solid #00ff00;}}@media all and (max-width: 767px){.f{border-top:3px solid #00ff00;}}',
		];
		yield 'shadow of the fields' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Shadow_Css( 'boxShadow' ),
			'settings' => [ 'style' => [ 'boxShadow' => $shadow ] ],
			'expected' => '.f{box-shadow:1px 2px 3px 4px rgba(18, 52, 86, 0.5);}',
		];
		yield 'shadow of the fields that is switched on with nothing else' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Shadow_Css( 'boxShadowActive' ),
			'settings' => [ 'style' => [ 'boxShadowActive' => [ true ] ] ],
			'expected' => '.f{box-shadow:2px 2px 3px 0px rgba(0, 0, 0, 0.4);}',
		];
		yield 'shadow that is switched off' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Shadow_Css( 'boxShadow' ),
			'settings' => [ 'style' => [ 'boxShadow' => [ false, '#123456' ] ] ],
			'expected' => '',
		];
		yield 'shadow that is switched on loosely' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Shadow_Css( 'boxShadow' ),
			'settings' => [ 'style' => [ 'boxShadow' => [ 1 ] ] ],
			'expected' => '',
		];
		yield 'shadow that is not a list' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Shadow_Css( 'boxShadow' ),
			'settings' => [ 'style' => [ 'boxShadow' => 'on' ] ],
			'expected' => '',
		];
		yield 'shadow that is not saved' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Shadow_Css( 'boxShadow' ),
			'settings' => [],
			'expected' => '',
		];
		yield 'dark fields' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Dark_Scheme_Css(),
			'settings' => [ 'style' => [ 'isDark' => true ] ],
			'expected' => '.f{color-scheme:dark;}',
		];
		yield 'fields that are dark loosely' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Dark_Scheme_Css(),
			'settings' => [ 'style' => [ 'isDark' => 'true' ] ],
			'expected' => '',
		];
		yield 'color of a group' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Color_Css( 'inputFont', 'color', '--kb-form-text-color' ),
			'settings' => [ 'inputFont' => [ 'color' => '#222' ] ],
			'expected' => '.f{--kb-form-text-color:#222;}',
		];
		yield 'color of the form' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Color_Css( null, 'messageColor', 'color' ),
			'settings' => [ 'messageColor' => '#333' ],
			'expected' => '.f{color:#333;}',
		];
		yield 'color of a group that is not an array' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Color_Css( 'inputFont', 'color', 'color' ),
			'settings' => [ 'inputFont' => 'red' ],
			'expected' => '',
		];
		yield 'width of the border as a variable' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Border_Variable_Css( 'width', '--kb-form-border-width' ),
			'settings' => [
				'fieldBorderStyle' => [
					'top'  => [ '#ff0000', 'solid', '2' ],
					'unit' => 'px',
				],
			],
			'expected' => '.f{--kb-form-border-width:2px;}',
		];
		yield 'color of the border as a variable' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Border_Variable_Css( 'color', '--kb-form-border-color' ),
			'settings' => [
				'fieldBorderStyle' => [
					'top'  => [ '#ff0000', 'solid', '2' ],
					'unit' => 'px',
				],
			],
			'expected' => '.f{--kb-form-border-color:#ff0000;}',
		];
		yield 'border variable with no border' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Border_Variable_Css( 'width', '--kb-form-border-width' ),
			'settings' => [],
			'expected' => '',
		];
		yield 'border color on focus' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Active_Border_Css(),
			'settings' => [ 'style' => [ 'borderActive' => '#abcdef' ] ],
			'expected' => '.f{border-color:#abcdef;}',
		];
		yield 'no border color on focus' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Active_Border_Css(),
			'settings' => [ 'style' => [ 'borderActive' => '' ] ],
			'expected' => '',
		];
		yield 'normal help style' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Normal_Style_Css(),
			'settings' => [ 'helpFont' => [ 'style' => 'normal' ] ],
			'expected' => '.f{font-style:normal;}',
		];
		yield 'italic help style' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Normal_Style_Css(),
			'settings' => [ 'helpFont' => [ 'style' => 'italic' ] ],
			'expected' => '',
		];
		yield 'padding of the messages, in the saved unit' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Message_Spacing_Css( 'messagePadding', 'padding' ),
			'settings' => [
				'messagePadding'     => [ '1', '2', '3', '4' ],
				'messagePaddingUnit' => 'em',
			],
			'expected' => '.f{padding-top:1em;padding-right:2em;padding-bottom:3em;padding-left:4em;}',
		];
		yield 'margin of the messages, in pixels by default' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Message_Spacing_Css( 'messageMargin', 'margin' ),
			'settings' => [ 'messageMargin' => [ '1', '2', '3', '4' ] ],
			'expected' => '.f{margin-top:1px;margin-right:2px;margin-bottom:3px;margin-left:4px;}',
		];
		yield 'spacing of the messages that is not saved' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Message_Spacing_Css( 'messageMargin', 'margin' ),
			'settings' => [ 'messageMarginUnit' => 'em' ],
			'expected' => '',
		];
		yield 'font of the messages ignores the size type that is saved' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Message_Typography_Css(),
			'settings' => [
				'messageFont' => [
					[
						'size'     => [ '12', '', '' ],
						'sizeType' => 'em',
					],
				],
			],
			'expected' => '.f{font-size:12px;}',
		];
		yield 'font of the messages with the lowercase size type key' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Message_Typography_Css(),
			'settings' => [
				'messageFont' => [
					[
						'size'     => [ '12', '', '' ],
						'sizetype' => 'rem',
					],
				],
			],
			'expected' => '.f{font-size:12rem;}',
		];
		yield 'font of the messages that is not saved' => [
			'section'  => new Kadence_Blocks_Advanced_Form_Message_Typography_Css(),
			'settings' => [],
			'expected' => '',
		];
	}

	/**
	 * The message font cannot be a plain string: the original builder threw there, and so does the section.
	 *
	 * @return void
	 */
	public function testMessageFontThatIsAStringThrows(): void {
		$this->expectException( Throwable::class );

		$this->write_form( new Kadence_Blocks_Advanced_Form_Message_Typography_Css(), [ 'messageFont' => 'abc' ] );
	}

	/**
	 * A gradient with no gradient saved reads a missing index: the original builder raised a warning, and so does the section.
	 *
	 * @return void
	 */
	public function testGradientWithoutValueRaisesTheOriginalWarning(): void {
		$warnings = [];

		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler -- Matches what the original builder did with warnings.
		set_error_handler(
			static function ( $number, $message ) use ( &$warnings ) {
				$warnings[] = $message;

				return true;
			}
		);

		$section = new Kadence_Blocks_Advanced_Form_Fill_Css( 'background', 'backgroundType', 'gradient', 'background', 'background' );
		$css     = $this->write_form( $section, [ 'background' => [ 'backgroundType' => 'gradient' ] ] );

		restore_error_handler();

		$this->assertSame(
			[ 'Undefined index: gradient' ],
			array_map(
				static function ( $message ) {
					return str_replace( 'Undefined array key "gradient"', 'Undefined index: gradient', $message );
				},
				$warnings 
			) 
		);
		$this->assertSameCss( '', $css );
	}

	/**
	 * The settings read from the post meta may hold objects, which become arrays.
	 *
	 * @return void
	 */
	public function testSettingsTurnObjectsIntoArrays(): void {
		$settings = Kadence_Blocks_Advanced_Form_Settings::from_post_attributes( [ 'style' => (object) [ 'isDark' => true ] ] );

		$this->assertSame( [ 'style' => [ 'isDark' => true ] ], $settings->all() );
	}

	/**
	 * Settings that cannot be encoded are empty settings.
	 *
	 * @dataProvider unusablePostAttributesProvider
	 *
	 * @param mixed $post_attributes What the post meta gave.
	 *
	 * @return void
	 */
	public function testUnusablePostAttributesGiveEmptySettings( $post_attributes ): void {
		$this->assertSame( [], Kadence_Blocks_Advanced_Form_Settings::from_post_attributes( $post_attributes )->all() );
	}

	/**
	 * Post attributes that give no settings.
	 *
	 * @return Generator
	 */
	public function unusablePostAttributesProvider(): Generator {
		yield 'nothing' => [ 'post_attributes' => null ];
		yield 'a string' => [ 'post_attributes' => 'abc' ];
		yield 'text that is not valid' => [ 'post_attributes' => [ 'style' => "\xB1\x31" ] ];
	}

	/**
	 * A group is what is saved, an empty array when it is not, and the whole form when no key is asked for.
	 *
	 * @return void
	 */
	public function testGroupGivesWhatIsSaved(): void {
		$settings = new Kadence_Blocks_Advanced_Form_Settings(
			[
				'style' => [ 'a' => 1 ],
				'gone'  => null,
			] 
		);

		$this->assertSame( [ 'a' => 1 ], $settings->group( 'style' ) );
		$this->assertSame( [], $settings->group( 'gone' ) );
		$this->assertSame( [], $settings->group( 'missing' ) );
		$this->assertSame(
			[
				'style' => [ 'a' => 1 ],
				'gone'  => null,
			],
			$settings->group( null ) 
		);
	}

	/**
	 * A filled setting is given, and an empty one is replaced by the fallback.
	 *
	 * @return void
	 */
	public function testFilledFallsBackWhenEmpty(): void {
		$settings = new Kadence_Blocks_Advanced_Form_Settings(
			[
				'unit' => 'em',
				'zero' => '0',
			] 
		);

		$this->assertSame( 'em', $settings->filled( 'unit', 'px' ) );
		$this->assertSame( 'px', $settings->filled( 'zero', 'px' ) );
		$this->assertSame( 'px', $settings->filled( 'missing', 'px' ) );
	}

	/**
	 * The borders are given as one list per device, empty when a device has none.
	 *
	 * @return void
	 */
	public function testBorderGivesOneListPerDevice(): void {
		$settings = new Kadence_Blocks_Advanced_Form_Settings( [ 'messageBorderError' => [ 'unit' => 'px' ] ] );

		$this->assertSame(
			[
				'messageBorderError'       => [ [ 'unit' => 'px' ] ],
				'tabletMessageBorderError' => [ [] ],
				'mobileMessageBorderError' => [ [] ],
			],
			$settings->border( 'messageBorderError' )
		);
	}

	/**
	 * Run a section on the settings of a form, under the selector `.f`.
	 *
	 * @param Kadence_Blocks_Css_Section $section  The section under test.
	 * @param array<string, mixed>       $settings The saved settings of the form.
	 *
	 * @return string
	 */
	private function write_form( Kadence_Blocks_Css_Section $section, array $settings ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'af-' . spl_object_id( $section ) );
		$css->set_selector( '.f' );

		$section->write( $this->input( [], $css )->with( 'settings', new Kadence_Blocks_Advanced_Form_Settings( $settings ) ) );

		return $css->css_output();
	}
}
