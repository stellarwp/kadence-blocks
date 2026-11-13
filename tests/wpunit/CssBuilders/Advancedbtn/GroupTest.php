<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedbtn;

use Generator;
use Kadence_Blocks_Advancedbtn_Alignment_Css;
use Kadence_Blocks_Advancedbtn_Button_Css;
use Kadence_Blocks_Advancedbtn_Buttons_Css;
use Kadence_Blocks_Advancedbtn_Flex_Axes;
use Kadence_Blocks_Css_Stops_Gradient;
use Kadence_Blocks_Advancedbtn_Group_Gap_Css;
use Kadence_Blocks_Advancedbtn_Group_Margin_Css;
use Kadence_Blocks_Advancedbtn_Typography_Css;
use Kadence_Blocks_Advancedbtn_Video_Assets_Css;
use Kadence_Blocks_CSS;

/**
 * The sections that write the CSS shared by the whole group of buttons.
 */
final class GroupTest extends Advancedbtn_Test_Case {

	/**
	 * The margin is written for every device in the unit the block saved.
	 *
	 * @dataProvider marginProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testMargin( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_group( new Kadence_Blocks_Advancedbtn_Group_Margin_Css(), $attributes ) );
	}

	/**
	 * The gap is written for every device.
	 *
	 * @return void
	 */
	public function testGap(): void {
		$css = $this->write_group(
			new Kadence_Blocks_Advancedbtn_Group_Gap_Css(),
			[
				'gap'     => [ 10, 20, 30 ],
				'gapUnit' => 'px',
			] 
		);

		$this->assertSameCss( '.grp{gap:10px;}@media all and (max-width: 1024px){.grp{gap:20px;}}@media all and (max-width: 767px){.grp{gap:30px;}}', $css );
	}

	/**
	 * The direction and alignment cascade from desktop to tablet to mobile, and a column swaps the axes.
	 *
	 * @dataProvider alignmentProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testAlignment( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_group( new Kadence_Blocks_Advancedbtn_Alignment_Css(), $attributes ) );
	}

	/**
	 * The typography is written when any font setting was saved.
	 *
	 * @dataProvider typographyProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testTypography( array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_group( new Kadence_Blocks_Advancedbtn_Typography_Css(), $attributes ) );
	}

	/**
	 * Every button that opens a video makes the block load the lightbox assets.
	 *
	 * @return void
	 */
	public function testVideoButtonsLoadTheLightbox(): void {
		$buttons = [ [ 'target' => 'video' ], 'text', [ 'target' => '_blank' ], [ 'target' => 'video' ] ];

		$this->run_recording( new Kadence_Blocks_Advancedbtn_Video_Assets_Css(), [ 'btns' => $buttons ] );

		$this->assertSame(
			[
				[ 'enqueue_style', 'kadence-simplelightbox-css' ],
				[ 'enqueue_script', 'kadence-blocks-videolight-js' ],
				[ 'enqueue_style', 'kadence-simplelightbox-css' ],
				[ 'enqueue_script', 'kadence-blocks-videolight-js' ],
			],
			$this->calls
		);
	}

	/**
	 * Nothing is loaded when no buttons were saved as a list.
	 *
	 * @return void
	 */
	public function testNoButtonsLoadNothing(): void {
		$this->run_recording( new Kadence_Blocks_Advancedbtn_Video_Assets_Css(), [ 'btns' => 'none' ] );

		$this->assertSame( [], $this->calls );
	}

	/**
	 * The buttons section writes every saved button under its own position and skips the ones saved as something else.
	 *
	 * @return void
	 */
	public function testButtonsWriteEachSavedButton(): void {
		$attributes = [
			'widthType' => 'fixed',
			'btns'      => [
				'skip',
				[
					'gap'   => 5,
					'width' => [ 90 ],
				],
				7 => [ 'gap' => 6 ],
			],
		];

		$css = $this->write_group( new Kadence_Blocks_Advancedbtn_Buttons_Css(), $attributes );

		$this->assertStringContainsString( '.kt-btnsabc .kt-btn-wrap-1{margin-right:5px;}', $css );
		$this->assertStringContainsString( '.wp-block-kadence-advancedbtn.kt-btnsabc .kt-btn-wrap-1 .kt-button{width:90px;}', $css );
		$this->assertStringContainsString( '.kt-btnsabc .kt-btn-wrap-7{margin-right:6px;}', $css );
		$this->assertStringNotContainsString( 'wrap-0', $css );
	}

	/**
	 * Nothing is written when the buttons were not saved as a list.
	 *
	 * @return void
	 */
	public function testButtonsWriteNothingWithoutAList(): void {
		$this->assertSame( '', $this->write_group( new Kadence_Blocks_Advancedbtn_Buttons_Css(), [ 'btns' => 'none' ] ) );
	}

	/**
	 * A button asks the block for the deprecated button styles.
	 *
	 * @return void
	 */
	public function testButtonLoadsDeprecatedStyles(): void {
		$this->write_button( new Kadence_Blocks_Advancedbtn_Button_Css(), [] );

		$this->assertSame( [ [ 'enqueue_style', 'kb-button-deprecated-styles' ] ], $this->calls );
	}

	/**
	 * The axes swap for a column, come back for a row and stay for anything else.
	 *
	 * @dataProvider axesProvider
	 *
	 * @param string[] $orientations The flex directions chosen one after another.
	 * @param string   $horizontal   The property that aligns horizontally.
	 * @param string   $vertical     The property that aligns vertically.
	 *
	 * @return void
	 */
	public function testAxes( array $orientations, string $horizontal, string $vertical ): void {
		$axes = new Kadence_Blocks_Advancedbtn_Flex_Axes();

		foreach ( $orientations as $orientation ) {
			$axes = $axes->with_orientation( $orientation );
		}

		$this->assertSame( $horizontal, $axes->horizontal() );
		$this->assertSame( $vertical, $axes->vertical() );
	}

	/**
	 * The alignment values map to flex values, a justified row spreads and a justified column centers.
	 *
	 * @return void
	 */
	public function testAxesAlignmentValues(): void {
		$row    = new Kadence_Blocks_Advancedbtn_Flex_Axes();
		$column = $row->with_orientation( 'column' );

		$this->assertSame( 'flex-end', $row->horizontal_value( 'right' ) );
		$this->assertSame( 'space-between', $row->horizontal_value( 'space-between' ) );
		$this->assertSame( 'center', $column->horizontal_value( 'space-between' ) );
		$this->assertNull( $row->horizontal_value( 5 ) );
		$this->assertNull( $row->horizontal_value( 'bogus' ) );
		$this->assertSame( 'flex-end', $row->vertical_value( 'bottom' ) );
	}

	/**
	 * The gradient is linear unless the stops ask for a radial one, and fills in missing stops.
	 *
	 * @dataProvider gradientProvider
	 *
	 * @param mixed  $stops    The saved stops.
	 * @param string $expected The gradient expected.
	 *
	 * @return void
	 */
	public function testGradient( $stops, string $expected ): void {
		$this->assertSame( $expected, ( new Kadence_Blocks_Css_Stops_Gradient() )->value( new Kadence_Blocks_CSS(), $stops, '#fff' ) );
	}

	/**
	 * @return Generator
	 */
	public function marginProvider(): Generator {
		yield 'every device' => [
			'attributes' => [
				'margin'     => [
					[
						'desk'   => [ 1, 2, 3, 4 ],
						'tablet' => [ 5, 6, 7, 8 ],
						'mobile' => [ 9, 9, 9, 9 ],
					],
				],
				'marginUnit' => 'em',
			],
			'expected'   => '.grp{margin-top:1em;margin-right:2em;margin-bottom:3em;margin-left:4em;}@media all and (max-width: 1024px){.grp{margin-top:5em;margin-right:6em;margin-bottom:7em;margin-left:8em;}}@media all and (max-width: 767px){.grp{margin-top:9em;margin-right:9em;margin-bottom:9em;margin-left:9em;}}',
		];
		yield 'not a list of sides' => [
			'attributes' => [ 'margin' => [ 'x' ] ],
			'expected'   => '',
		];
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function alignmentProvider(): Generator {
		yield 'every device' => [
			'attributes' => [
				'orientation' => [ 'row', 'column', 'row-reverse' ],
				'hAlign'      => 'right',
				'vAlign'      => 'bottom',
				'thAlign'     => 'space-between',
				'tvAlign'     => 'top',
				'mhAlign'     => 'left',
				'mvAlign'     => 'center',
			],
			'expected'   => '.grp{flex-direction:row;justify-content:flex-end;align-items:flex-end;}@media all and (max-width: 1024px){.grp{flex-direction:column;align-items:center;justify-content:flex-start;}}@media all and (max-width: 767px){.grp{flex-direction:row-reverse;justify-content:flex-start;align-items:center;}}',
		];
		yield 'column on desktop' => [
			'attributes' => [
				'orientation' => [ 'column' ],
				'hAlign'      => 'space-between',
				'vAlign'      => 'center',
			],
			'expected'   => '.grp{flex-direction:column;align-items:center;justify-content:center;}',
		];
		yield 'tablet column inherits the desktop alignment' => [
			'attributes' => [
				'hAlign'      => 'center',
				'orientation' => [ '', 'column', '' ],
			],
			'expected'   => '.grp{justify-content:center;}@media all and (max-width: 1024px){.grp{flex-direction:column;align-items:center;justify-content:center;}}',
		];
		yield 'unknown alignments' => [
			'attributes' => [
				'hAlign'  => 'bogus',
				'vAlign'  => 'bogus',
				'thAlign' => 'bogus',
			],
			'expected'   => '',
		];
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function typographyProvider(): Generator {
		yield 'everything' => [
			'attributes' => [
				'typography'    => 'Roboto',
				'fontWeight'    => '700',
				'fontStyle'     => 'italic',
				'textTransform' => 'uppercase',
			],
			'expected'   => '.kt-btnsabc .kt-button{font-family:Roboto;font-weight:700;font-style:italic;text-transform:uppercase;}',
		];
		yield 'weight only' => [
			'attributes' => [ 'fontWeight' => '700' ],
			'expected'   => '.kt-btnsabc .kt-button{font-weight:700;}',
		];
		yield 'empty family' => [
			'attributes' => [
				'typography' => '',
				'fontStyle'  => 'italic',
			],
			'expected'   => '.kt-btnsabc .kt-button{font-style:italic;}',
		];
		yield 'no font setting' => [
			'attributes' => [ 'other' => 1 ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function axesProvider(): Generator {
		yield 'untouched' => [
			'orientations' => [],
			'horizontal'   => 'justify-content',
			'vertical'     => 'align-items',
		];
		yield 'column' => [
			'orientations' => [ 'column' ],
			'horizontal'   => 'align-items',
			'vertical'     => 'justify-content',
		];
		yield 'column reverse' => [
			'orientations' => [ 'column-reverse' ],
			'horizontal'   => 'align-items',
			'vertical'     => 'justify-content',
		];
		yield 'column then row' => [
			'orientations' => [ 'column', 'row' ],
			'horizontal'   => 'justify-content',
			'vertical'     => 'align-items',
		];
		yield 'column then row reverse' => [
			'orientations' => [ 'column', 'row-reverse' ],
			'horizontal'   => 'justify-content',
			'vertical'     => 'align-items',
		];
		yield 'column then something else' => [
			'orientations' => [ 'column', 'inherit' ],
			'horizontal'   => 'align-items',
			'vertical'     => 'justify-content',
		];
	}

	/**
	 * @return Generator
	 */
	public function gradientProvider(): Generator {
		yield 'linear defaults' => [
			'stops'    => [ '#000000', 1 ],
			'expected' => 'linear-gradient(180deg, #fff 0%, #000000 100%)',
		];
		yield 'linear with an angle and stops' => [
			'stops'    => [ '#000000', 0.5, 10, 90, 'linear', 45 ],
			'expected' => 'linear-gradient(45deg, #fff 10%, rgba(0, 0, 0, 0.5) 90%)',
		];
		yield 'radial with a position' => [
			'stops'    => [ '#000000', 1, 0, 100, 'radial', 0, 'top left' ],
			'expected' => 'radial-gradient(at top left, #fff 0%, #000000 100%)',
		];
		yield 'radial centered' => [
			'stops'    => [ '', null, null, null, 'radial' ],
			'expected' => 'radial-gradient(at center center, #fff 0%, #999999 100%)',
		];
		yield 'nothing saved' => [
			'stops'    => null,
			'expected' => 'linear-gradient(180deg, #fff 0%, #999999 100%)',
		];
	}
}
