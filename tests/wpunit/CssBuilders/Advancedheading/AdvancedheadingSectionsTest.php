<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedheading;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Advancedheading_Align_Important_Css;
use Kadence_Blocks_Advancedheading_Aspect_Ratio_Css;
use Kadence_Blocks_Advancedheading_Attribute_Property_Css;
use Kadence_Blocks_Advancedheading_Border_Radius_Css;
use Kadence_Blocks_Advancedheading_Color_Output_Css;
use Kadence_Blocks_Advancedheading_Device_Letter_Spacing_Css;
use Kadence_Blocks_Advancedheading_Filled_Alpha_Color_Css;
use Kadence_Blocks_Advancedheading_Font_Family_Css;
use Kadence_Blocks_Advancedheading_Font_Size_Css;
use Kadence_Blocks_Advancedheading_Font_Weight_Css;
use Kadence_Blocks_Advancedheading_Icon_Align_Items_Css;
use Kadence_Blocks_Advancedheading_Icon_Line_Height_Css;
use Kadence_Blocks_Advancedheading_Inline_Width_Condition;
use Kadence_Blocks_Advancedheading_Letter_Spacing_Css;
use Kadence_Blocks_Advancedheading_Line_Height_Css;
use Kadence_Blocks_Advancedheading_Margin_Side_Css;
use Kadence_Blocks_Advancedheading_Mark_Border_Style_Css;
use Kadence_Blocks_Advancedheading_Mark_Color_Css;
use Kadence_Blocks_Advancedheading_Max_Width_Align_Css;
use Kadence_Blocks_Advancedheading_Range_Css;
use Kadence_Blocks_Advancedheading_Render_Color_Css;
use Kadence_Blocks_Advancedheading_Selector_Css;
use Kadence_Blocks_Advancedheading_Text_Gradient_Condition;
use Kadence_Blocks_Advancedheading_Text_Shadow_Condition;
use Kadence_Blocks_Advancedheading_Themed_Color_Css;
use Kadence_Blocks_Advancedheading_Top_Margin_Css;
use Kadence_Blocks_Advancedheading_Unit_Value_Css;

/**
 * The sections of the advanced heading CSS, one by one.
 */
final class AdvancedheadingSectionsTest extends Advancedheading_Test_Case {

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
		$this->assertSameCss( $expected, $this->write_heading( $section, $attributes ) );
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
		$this->assertSame( $expected, $condition->is_met( $this->heading_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The selector section expands the parts of the block selector.
	 *
	 * @return void
	 */
	public function testSelectorExpandsTheBlockSelector(): void {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'selector-test' );

		( new Kadence_Blocks_Advancedheading_Selector_Css( [ '{root}', '.link{id}{data}' ] ) )->write( $this->heading_input( [], $css ) );
		$css->add_property( 'color', 'red' );

		$this->assertSameCss(
			'.wp-block-kadence-advancedheading.kt-adv-headingabc, .linkabc[data-kb-block="kb-adv-headingabc"]{color:red;}',
			$css->css_output()
		);
	}

	/**
	 * The shadow section asks the block to render the shadow of a new block when the block saved none.
	 *
	 * @return void
	 */
	public function testShadowFallsBackToTheShadowOfANewBlock(): void {
		$this->write_heading( new \Kadence_Blocks_Advancedheading_Text_Shadow_Css(), [ 'enableTextShadow' => true ] );
		$this->write_heading( new \Kadence_Blocks_Advancedheading_Text_Shadow_Css(), [ 'textShadow' => [ [ 'enable' => true ] ] ] );

		$this->assertSame( 'render_text_shadow', $this->calls[0][0] );
		$this->assertSame( 1, $this->calls[0][1]['textShadow'][0]['hOffset'] );
		$this->assertSame( [ [ 'enable' => true ] ], $this->calls[1][1]['textShadow'] );
	}

	/**
	 * The orientation section asks the block for the orientation and the height of its device only when it is saved.
	 *
	 * @return void
	 */
	public function testOrientationAsksTheBlockForTheDevice(): void {
		$attributes = [ 'tabletTextOrientation' => 'vertical' ];

		$this->write_heading( new \Kadence_Blocks_Advancedheading_Orientation_Css( 'tabletTextOrientation', 'tablet', 1 ), $attributes );
		$this->write_heading( new \Kadence_Blocks_Advancedheading_Orientation_Css( 'textOrientation', null, 0 ), $attributes );

		$this->assertCount( 2, $this->calls );
		$this->assertSame( 'handle_text_orientation', $this->calls[0][0] );
		$this->assertSame( 'vertical', $this->calls[0][2] );
		$this->assertSame( [ 'handle_max_height', 1, 'tabletTextOrientation' ], [ $this->calls[1][0], $this->calls[1][3], $this->calls[1][4] ] );
	}

	/**
	 * The preset typography section asks the block to render the typography of the preset.
	 *
	 * @return void
	 */
	public function testPresetTypographyAsksTheBlock(): void {
		$this->write_heading( new \Kadence_Blocks_Advancedheading_Preset_Typography_Css(), [ 'level' => 2 ] );

		$this->assertSame( 'render_preset_typography', $this->calls[0][0] );
		$this->assertSame( [ 'level' => 2 ], $this->calls[0][2] );
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedheading/loader.php';

		yield 'gradient needs both' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Text_Gradient_Condition(),
			'attributes' => [
				'textGradient'       => 'x',
				'enableTextGradient' => true,
			],
			'expected'   => true,
		];
		yield 'gradient not enabled' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Text_Gradient_Condition(),
			'attributes' => [ 'textGradient' => 'x' ],
			'expected'   => false,
		];
		yield 'gradient not saved' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Text_Gradient_Condition(),
			'attributes' => [ 'enableTextGradient' => true ],
			'expected'   => false,
		];
		yield 'shadow enabled' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Text_Shadow_Condition(),
			'attributes' => [ 'enableTextShadow' => true ],
			'expected'   => true,
		];
		yield 'shadow enabled in the list' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Text_Shadow_Condition(),
			'attributes' => [ 'textShadow' => [ [ 'enable' => true ] ] ],
			'expected'   => true,
		];
		yield 'shadow not enabled' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Text_Shadow_Condition(),
			'attributes' => [ 'textShadow' => [ [ 'enable' => false ] ] ],
			'expected'   => false,
		];
		yield 'shadow not saved' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Text_Shadow_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'inline width saved' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Inline_Width_Condition(),
			'attributes' => [ 'inlineImageWidth' => [ 40, '', '' ] ],
			'expected'   => false,
		];
		yield 'inline width numeric string' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Inline_Width_Condition(),
			'attributes' => [ 'inlineImageWidth' => [ '40' ] ],
			'expected'   => false,
		];
		yield 'inline width not saved' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Inline_Width_Condition(),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'inline width not a list' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Inline_Width_Condition(),
			'attributes' => [ 'inlineImageWidth' => '40' ],
			'expected'   => true,
		];
		yield 'inline width of the desktop empty' => [
			'condition'  => new Kadence_Blocks_Advancedheading_Inline_Width_Condition(),
			'attributes' => [ 'inlineImageWidth' => [ '', 30 ] ],
			'expected'   => true,
		];
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedheading/loader.php';

		yield 'top margin with the unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Top_Margin_Css(),
			'attributes' => [
				'topMargin'  => 2,
				'marginType' => 'em',
			],
			'expected'   => '.heading{margin-top:2em;}',
		];
		yield 'negative top margin lifts the background' => [
			'section'    => new Kadence_Blocks_Advancedheading_Top_Margin_Css(),
			'attributes' => [
				'topMargin'  => -4,
				'background' => '#fff',
			],
			'expected'   => '.heading{margin-top:-4px;position:relative;}',
		];
		yield 'negative top margin without background' => [
			'section'    => new Kadence_Blocks_Advancedheading_Top_Margin_Css(),
			'attributes' => [ 'topMargin' => -4 ],
			'expected'   => '.heading{margin-top:-4px;}',
		];
		yield 'top margin that is not a number' => [
			'section'    => new Kadence_Blocks_Advancedheading_Top_Margin_Css(),
			'attributes' => [ 'topMargin' => 'auto' ],
			'expected'   => '',
		];
		yield 'side margin' => [
			'section'    => new Kadence_Blocks_Advancedheading_Margin_Side_Css( 'margin-right', 'rightMargin' ),
			'attributes' => [
				'rightMargin' => 3,
				'marginType'  => '%',
			],
			'expected'   => '.heading{margin-right:3%;}',
		];
		yield 'side margin not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Margin_Side_Css( 'margin-right', 'rightMargin' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'max width of every device' => [
			'section'    => new Kadence_Blocks_Advancedheading_Range_Css( 'maxWidth', 'max-width' ),
			'attributes' => [ 'maxWidth' => [ 100, '', '' ] ],
			'expected'   => '.heading{max-width:100px;}',
		];
		yield 'icon size with its unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Range_Css( 'iconSize', 'font-size', 'iconSizeUnit' ),
			'attributes' => [
				'iconSize'     => [ 2, '', '' ],
				'iconSizeUnit' => 'em',
			],
			'expected'   => '.heading{font-size:2em;}',
		];
		yield 'centered max width' => [
			'section'    => new Kadence_Blocks_Advancedheading_Max_Width_Align_Css(),
			'attributes' => [
				'maxWidth' => [ 100 ],
				'align'    => 'center',
			],
			'expected'   => '.heading{margin-right:auto;margin-left:auto;}',
		];
		yield 'right max width' => [
			'section'    => new Kadence_Blocks_Advancedheading_Max_Width_Align_Css(),
			'attributes' => [
				'maxWidth' => [ 100 ],
				'align'    => 'right',
			],
			'expected'   => '.heading{margin-right:0px;margin-left:auto;}',
		];
		yield 'left max width' => [
			'section'    => new Kadence_Blocks_Advancedheading_Max_Width_Align_Css(),
			'attributes' => [
				'maxWidth' => [ 100 ],
				'align'    => 'left',
			],
			'expected'   => '',
		];
		yield 'aligned without max width' => [
			'section'    => new Kadence_Blocks_Advancedheading_Max_Width_Align_Css(),
			'attributes' => [ 'align' => 'center' ],
			'expected'   => '',
		];
		yield 'max width without alignment' => [
			'section'    => new Kadence_Blocks_Advancedheading_Max_Width_Align_Css(),
			'attributes' => [ 'maxWidth' => [ 100 ] ],
			'expected'   => '',
		];
		yield 'old font size with its unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Size_Css( 'size', 'fontSize', 0, 'sizeType' ),
			'attributes' => [
				'size'     => 20,
				'sizeType' => 'em',
				'fontSize' => [ 30 ],
			],
			'expected'   => '.heading{font-size:20em;}',
		];
		yield 'font size of the list' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Size_Css( 'size', 'fontSize', 0, 'sizeType' ),
			'attributes' => [ 'fontSize' => [ 30 ] ],
			'expected'   => '.heading{font-size:30px;}',
		];
		yield 'font size of the list without an old attribute' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Size_Css( null, 'markSize', 1, 'markSizeType' ),
			'attributes' => [
				'markSize' => [ '', 12 ],
				'size'     => 9,
			],
			'expected'   => '.heading{font-size:12px;}',
		];
		yield 'font size not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Size_Css( 'size', 'fontSize', 0, 'sizeType' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'old line height with its unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Line_Height_Css( 'lineHeight', 0 ),
			'attributes' => [
				'lineHeight' => 2,
				'lineType'   => 'em',
				'fontHeight' => [ 5 ],
			],
			'expected'   => '.heading{line-height:2em;}',
		];
		yield 'old line height in pixels' => [
			'section'    => new Kadence_Blocks_Advancedheading_Line_Height_Css( 'lineHeight', 0 ),
			'attributes' => [ 'lineHeight' => 20 ],
			'expected'   => '.heading{line-height:20px;}',
		];
		yield 'line height of the list' => [
			'section'    => new Kadence_Blocks_Advancedheading_Line_Height_Css( 'tabLineHeight', 1 ),
			'attributes' => [
				'fontHeight'     => [ 1, 1.5 ],
				'fontHeightType' => 'em',
			],
			'expected'   => '.heading{line-height:1.5em;}',
		];
		yield 'line height of the list without a unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Line_Height_Css( 'tabLineHeight', 1 ),
			'attributes' => [ 'fontHeight' => [ 1, 1.5 ] ],
			'expected'   => '.heading{line-height:1.5;}',
		];
		yield 'line height not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Line_Height_Css( 'lineHeight', 0 ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'important alignment' => [
			'section'    => new Kadence_Blocks_Advancedheading_Align_Important_Css( 'tabletAlign' ),
			'attributes' => [ 'tabletAlign' => 'left' ],
			'expected'   => '.heading{text-align:left!important;}',
		];
		yield 'important alignment not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Align_Important_Css( 'tabletAlign' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'font weight' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Weight_Css( 'fontWeight' ),
			'attributes' => [ 'fontWeight' => '700' ],
			'expected'   => '.heading{font-weight:700;}',
		];
		yield 'font weight regular' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Weight_Css( 'fontWeight' ),
			'attributes' => [ 'fontWeight' => 'regular' ],
			'expected'   => '.heading{font-weight:normal;}',
		];
		yield 'font family' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Family_Css( 'typography', 'googleFont', 'loadGoogleFont', 'fontVariant' ),
			'attributes' => [ 'typography' => 'Georgia' ],
			'expected'   => '.heading{font-family:Georgia;}',
		];
		yield 'font family of a google font' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Family_Css( 'typography', 'googleFont', 'loadGoogleFont', 'fontVariant' ),
			'attributes' => [
				'typography'  => 'Lato',
				'googleFont'  => true,
				'fontVariant' => '700',
			],
			'expected'   => '.heading{font-family:Lato;}',
		];
		yield 'font family not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Font_Family_Css( 'typography', 'googleFont', 'loadGoogleFont', 'fontVariant' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'letter spacing' => [
			'section'    => new Kadence_Blocks_Advancedheading_Letter_Spacing_Css(),
			'attributes' => [
				'letterSpacing'     => 2,
				'letterSpacingType' => 'em',
			],
			'expected'   => '.heading{letter-spacing:2em;}',
		];
		yield 'letter spacing of a device' => [
			'section'    => new Kadence_Blocks_Advancedheading_Device_Letter_Spacing_Css( 'tabletLetterSpacing' ),
			'attributes' => [ 'tabletLetterSpacing' => '1.5' ],
			'expected'   => '.heading{letter-spacing:1.5px;}',
		];
		yield 'letter spacing of a device that is not a number' => [
			'section'    => new Kadence_Blocks_Advancedheading_Device_Letter_Spacing_Css( 'tabletLetterSpacing' ),
			'attributes' => [ 'tabletLetterSpacing' => 'wide' ],
			'expected'   => '',
		];
		yield 'color of the block' => [
			'section'    => new Kadence_Blocks_Advancedheading_Themed_Color_Css( 'color', 'color', 'colorClass', 'enableTextGradient' ),
			'attributes' => [ 'color' => '#111111' ],
			'expected'   => '.heading{color:#111111;}',
		];
		yield 'color of a palette wins over a class' => [
			'section'    => new Kadence_Blocks_Advancedheading_Themed_Color_Css( 'color', 'color', 'colorClass', 'enableTextGradient' ),
			'attributes' => [
				'color'      => 'palette3',
				'colorClass' => 'has-x',
			],
			'expected'   => '.heading{color:var(--global-palette3, #1A202C);}',
		];
		yield 'color of a class' => [
			'section'    => new Kadence_Blocks_Advancedheading_Themed_Color_Css( 'color', 'color', 'colorClass', 'enableTextGradient' ),
			'attributes' => [
				'color'      => '#111111',
				'colorClass' => 'has-x',
			],
			'expected'   => '',
		];
		yield 'color that is an empty class' => [
			'section'    => new Kadence_Blocks_Advancedheading_Themed_Color_Css( 'color', 'color', 'colorClass', 'enableTextGradient' ),
			'attributes' => [
				'color'      => '#111111',
				'colorClass' => '',
			],
			'expected'   => '.heading{color:#111111;}',
		];
		yield 'color under a gradient' => [
			'section'    => new Kadence_Blocks_Advancedheading_Themed_Color_Css( 'color', 'color', 'colorClass', 'enableTextGradient' ),
			'attributes' => [
				'color'              => '#111111',
				'enableTextGradient' => true,
			],
			'expected'   => '',
		];
		yield 'color not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Themed_Color_Css( 'color', 'color', 'colorClass', 'enableTextGradient' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'attribute as it is' => [
			'section'    => new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'justify-content', 'align', false ),
			'attributes' => [ 'align' => 'center' ],
			'expected'   => '.heading{justify-content:center;}',
		];
		yield 'attribute as it is not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'justify-content', 'align', false ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'filled attribute as it is' => [
			'section'    => new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'justify-content', 'align', true ),
			'attributes' => [ 'align' => 'center' ],
			'expected'   => '.heading{justify-content:center;}',
		];
		yield 'filled attribute that is empty' => [
			'section'    => new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'justify-content', 'align', true ),
			'attributes' => [ 'align' => '' ],
			'expected'   => '',
		];
		yield 'border radius in pixels' => [
			'section'    => new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'borderRadius', 'borderRadiusUnit' ),
			'attributes' => [ 'borderRadius' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.heading{border-top-left-radius:1px;border-top-right-radius:2px;border-bottom-right-radius:3px;border-bottom-left-radius:4px;}',
		];
		yield 'border radius with its unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'borderRadius', 'borderRadiusUnit' ),
			'attributes' => [
				'borderRadius'     => [ 1, 2, 3, 4 ],
				'borderRadiusUnit' => 'em',
			],
			'expected'   => '.heading{border-top-left-radius:1em;border-top-right-radius:2em;border-bottom-right-radius:3em;border-bottom-left-radius:4em;}',
		];
		yield 'icon alignment' => [
			'section'    => new Kadence_Blocks_Advancedheading_Icon_Align_Items_Css(),
			'attributes' => [ 'iconVerticalAlign' => 'flex-start' ],
			'expected'   => '.heading{align-items:flex-start;}',
		];
		yield 'icon alignment centered by default' => [
			'section'    => new Kadence_Blocks_Advancedheading_Icon_Align_Items_Css(),
			'attributes' => [],
			'expected'   => '.heading{align-items:center;}',
		];
		yield 'icon color' => [
			'section'    => new Kadence_Blocks_Advancedheading_Color_Output_Css( 'iconColor', 'color' ),
			'attributes' => [ 'iconColor' => '#222222' ],
			'expected'   => '.heading{color:#222222;}',
		];
		yield 'icon line height' => [
			'section'    => new Kadence_Blocks_Advancedheading_Icon_Line_Height_Css(),
			'attributes' => [
				'lineHeight' => 2,
				'lineType'   => 'em',
			],
			'expected'   => '.heading{line-height:2em;}',
		];
		yield 'icon line height in pixels' => [
			'section'    => new Kadence_Blocks_Advancedheading_Icon_Line_Height_Css(),
			'attributes' => [ 'lineHeight' => 20 ],
			'expected'   => '.heading{line-height:20px;}',
		];
		yield 'icon line height not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Icon_Line_Height_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'value of a list with its unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Unit_Value_Css( 'line-height', 'markLineHeight', 1, 'markLineType', 'px' ),
			'attributes' => [
				'markLineHeight' => [ '', 2 ],
				'markLineType'   => 'em',
			],
			'expected'   => '.heading{line-height:2em;}',
		];
		yield 'value of a list in pixels' => [
			'section'    => new Kadence_Blocks_Advancedheading_Unit_Value_Css( 'line-height', 'markLineHeight', 1, 'markLineType', 'px' ),
			'attributes' => [ 'markLineHeight' => [ '', 2 ] ],
			'expected'   => '.heading{line-height:2px;}',
		];
		yield 'value with a fixed unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Unit_Value_Css( 'border-width', 'markBorderWidth', null, null, 'px' ),
			'attributes' => [ 'markBorderWidth' => 3 ],
			'expected'   => '.heading{border-width:3px;}',
		];
		yield 'value with its unit' => [
			'section'    => new Kadence_Blocks_Advancedheading_Unit_Value_Css( 'letter-spacing', 'markLetterSpacing', null, 'markLetterSpacingType', 'px' ),
			'attributes' => [
				'markLetterSpacing'     => 1,
				'markLetterSpacingType' => 'em',
			],
			'expected'   => '.heading{letter-spacing:1em;}',
		];
		yield 'highlight color' => [
			'section'    => new Kadence_Blocks_Advancedheading_Mark_Color_Css(),
			'attributes' => [
				'markColor'    => '#333333',
				'markGradient' => 'linear-gradient(red, blue)',
			],
			'expected'   => '.heading{color:#333333;}',
		];
		yield 'highlight gradient replaces the color' => [
			'section'    => new Kadence_Blocks_Advancedheading_Mark_Color_Css(),
			'attributes' => [
				'markColor'          => '#333333',
				'markGradient'       => 'linear-gradient(red, blue)',
				'enableMarkGradient' => true,
			],
			'expected'   => '.heading{background-image:linear-gradient(red, blue);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}',
		];
		yield 'highlight gradient not enabled' => [
			'section'    => new Kadence_Blocks_Advancedheading_Mark_Color_Css(),
			'attributes' => [ 'markGradient' => 'linear-gradient(red, blue)' ],
			'expected'   => '',
		];
		yield 'highlight gradient not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Mark_Color_Css(),
			'attributes' => [ 'enableMarkGradient' => true ],
			'expected'   => '',
		];
		yield 'highlight background with its opacity' => [
			'section'    => new Kadence_Blocks_Advancedheading_Filled_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity', [ 'enableMarkGradient' ] ),
			'attributes' => [
				'markBG'        => '#ff0000',
				'markBGOpacity' => 0.5,
			],
			'expected'   => '.heading{background:rgba(255, 0, 0, 0.5);}',
		];
		yield 'highlight background opaque by default' => [
			'section'    => new Kadence_Blocks_Advancedheading_Filled_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity', [ 'enableMarkGradient' ] ),
			'attributes' => [ 'markBG' => '#ff0000' ],
			'expected'   => '.heading{background:#ff0000;}',
		];
		yield 'highlight background replaced by a gradient' => [
			'section'    => new Kadence_Blocks_Advancedheading_Filled_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity', [ 'enableMarkGradient' ] ),
			'attributes' => [
				'markBG'             => '#ff0000',
				'enableMarkGradient' => true,
			],
			'expected'   => '',
		];
		yield 'highlight background not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Filled_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity', [] ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'highlight border style' => [
			'section'    => new Kadence_Blocks_Advancedheading_Mark_Border_Style_Css(),
			'attributes' => [ 'markBorderStyle' => 'dashed' ],
			'expected'   => '.heading{border-style:dashed;}',
		];
		yield 'highlight solid border style' => [
			'section'    => new Kadence_Blocks_Advancedheading_Mark_Border_Style_Css(),
			'attributes' => [ 'markBorderStyle' => 'solid' ],
			'expected'   => '',
		];
		yield 'highlight border style not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Mark_Border_Style_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'aspect ratio' => [
			'section'    => new Kadence_Blocks_Advancedheading_Aspect_Ratio_Css(),
			'attributes' => [
				'useRatio' => true,
				'ratio'    => 'land169',
			],
			'expected'   => '.heading{aspect-ratio:16 / 9;object-fit:cover;}',
		];
		yield 'aspect ratio of a square' => [
			'section'    => new Kadence_Blocks_Advancedheading_Aspect_Ratio_Css(),
			'attributes' => [
				'useRatio' => true,
				'ratio'    => 'square',
			],
			'expected'   => '.heading{aspect-ratio:1 / 1;object-fit:cover;}',
		];
		yield 'aspect ratio loosely equal to the first name' => [
			'section'    => new Kadence_Blocks_Advancedheading_Aspect_Ratio_Css(),
			'attributes' => [
				'useRatio' => true,
				'ratio'    => true,
			],
			'expected'   => '.heading{aspect-ratio:4 / 3;object-fit:cover;}',
		];
		yield 'aspect ratio of an unknown name' => [
			'section'    => new Kadence_Blocks_Advancedheading_Aspect_Ratio_Css(),
			'attributes' => [
				'useRatio' => true,
				'ratio'    => 'wide',
			],
			'expected'   => '',
		];
		yield 'aspect ratio not used' => [
			'section'    => new Kadence_Blocks_Advancedheading_Aspect_Ratio_Css(),
			'attributes' => [ 'ratio' => 'land169' ],
			'expected'   => '',
		];
		yield 'aspect ratio not saved' => [
			'section'    => new Kadence_Blocks_Advancedheading_Aspect_Ratio_Css(),
			'attributes' => [ 'useRatio' => true ],
			'expected'   => '',
		];
		yield 'rendered color' => [
			'section'    => new Kadence_Blocks_Advancedheading_Render_Color_Css( 'color', 'linkHoverColor' ),
			'attributes' => [ 'linkHoverColor' => 'palette1' ],
			'expected'   => '.heading{color:var(--global-palette1, #3182CE);}',
		];
	}
}
