<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Sections;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Border_Styles_Section;
use Kadence_Blocks_Css_Color_Section;
use Kadence_Blocks_Css_Device_Section;
use Kadence_Blocks_Css_Enabled_Section;
use Kadence_Blocks_Css_Gate_Section;
use Kadence_Blocks_Css_Measure_Section;
use Kadence_Blocks_Css_Selector_Section;
use Kadence_Blocks_Css_Spacing_Section;
use Tests\wpunit\CssBuilders\Free_Recording_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The generic sections every block CSS builder shares.
 */
final class SectionsTest extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}

	/**
	 * The selector section sets the selector, replacing the unique id placeholder, for one or several selectors.
	 *
	 * @dataProvider selectorProvider
	 *
	 * @param string|string[] $selectors The selectors given to the section.
	 * @param string          $expected  The selector the section sets.
	 *
	 * @return void
	 */
	public function testSelector( $selectors, string $expected ): void {
		$css = new Kadence_Blocks_CSS();

		( new Kadence_Blocks_Css_Selector_Section( $selectors ) )->write( $this->input( [], $css ) );
		$css->add_property( 'color', 'red' );

		$this->assertSame( $expected . '{color:red;}', $css->css_output() );
	}

	/**
	 * The gate runs its sections when any attribute was saved, even with an empty value, but not when it is null.
	 *
	 * @dataProvider gateProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $ran        Whether the sections ran.
	 *
	 * @return void
	 */
	public function testGate( array $attributes, bool $ran ): void {
		$section = new Kadence_Blocks_Css_Gate_Section( [ 'one', 'two' ], [ new Free_Recording_Section() ] );

		$this->assertSame( $ran ? '.ran{ran:1;}' : '', $this->write_section( $section, $attributes ) );
	}

	/**
	 * The enabled section runs its sections only while the switch is truthy.
	 *
	 * @dataProvider enabledProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $ran        Whether the sections ran.
	 *
	 * @return void
	 */
	public function testEnabled( array $attributes, bool $ran ): void {
		$section = new Kadence_Blocks_Css_Enabled_Section( 'on', [ new Free_Recording_Section() ] );

		$this->assertSame( $ran ? '.ran{ran:1;}' : '', $this->write_section( $section, $attributes ) );
	}

	/**
	 * The device section writes under its media query and returns to desktop afterwards.
	 *
	 * @return void
	 */
	public function testDevice(): void {
		$css = new Kadence_Blocks_CSS();

		( new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Free_Recording_Section() ] ) )->write( $this->input( [], $css ) );
		$css->set_selector( '.later' );
		$css->add_property( 'color', 'red' );

		$this->assertSame( '.later{color:red;}@media all and (max-width: 1024px){.ran{ran:1;}}', $css->css_output() );
	}

	/**
	 * The measure section writes a padding list with the arguments it was given.
	 *
	 * @return void
	 */
	public function testMeasure(): void {
		$section = new Kadence_Blocks_Css_Measure_Section( 'padding', 'pad', [ 'unit_key' => 'padType' ] );

		$this->assertSameCss(
			'.t{padding-top:1em;padding-right:2em;padding-bottom:3em;padding-left:4em;}',
			$this->write_section(
				$section,
				[
					'pad'     => [ 1, 2, 3, 4 ],
					'padType' => 'em',
				],
				'abc',
				'.t' 
			) 
		);
		$this->assertSameCss(
			'.t{border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-right-radius:5px;border-bottom-left-radius:5px;}',
			$this->write_section( new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'rad' ), [ 'rad' => [ 5, 5, 5, 5 ] ], 'abc', '.t' )
		);
	}

	/**
	 * The color section writes a color when it is not empty.
	 *
	 * @return void
	 */
	public function testColor(): void {
		$section = new Kadence_Blocks_Css_Color_Section( 'color', 'ink' );

		$this->assertSameCss( '.t{color:#112233;}', $this->write_section( $section, [ 'ink' => '#112233' ], 'abc', '.t' ) );
		$this->assertSame( '', $this->write_section( $section, [ 'ink' => '' ], 'abc', '.t' ) );
		$this->assertSame( '', $this->write_section( $section, [], 'abc', '.t' ) );
	}

	/**
	 * The spacing section writes a list with its unit, and ignores anything else.
	 *
	 * @dataProvider spacingProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS written.
	 *
	 * @return void
	 */
	public function testSpacing( array $attributes, string $expected ): void {
		$section = new Kadence_Blocks_Css_Spacing_Section( 'padding', 'box', 'boxType' );

		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', '.t' ) );
	}

	/**
	 * The border styles section renders the styles of the attribute it was given.
	 *
	 * @return void
	 */
	public function testBorderStyles(): void {
		$side = [ '#00ff00', '', 2 ];
		$css  = $this->write_section(
			new Kadence_Blocks_Css_Border_Styles_Section( 'border', true ),
			[
				'border' => [
					[
						'top'    => $side,
						'right'  => $side,
						'bottom' => $side,
						'left'   => $side,
						'unit'   => 'px',
					],
				],
			],
			'abc',
			'.t'
		);

		$this->assertStringContainsString( '.t{border-top:2px solid #00ff00;', $css );
		$this->assertSame( '', $this->write_section( new Kadence_Blocks_Css_Border_Styles_Section( 'other' ), [ 'border' => [ [] ] ], 'abc', '.t' ) );
	}

	/**
	 * @return Generator
	 */
	public function selectorProvider(): Generator {
		yield 'one selector' => [
			'selectors' => '.a',
			'expected'  => '.a',
		];
		yield 'the unique id is replaced' => [
			'selectors' => '.kt-btns{id} .kt-button',
			'expected'  => '.kt-btnsabc .kt-button',
		];
		yield 'several selectors share one rule' => [
			'selectors' => [ '.a{id}', '.b{id}:hover' ],
			'expected'  => '.aabc, .babc:hover',
		];
	}

	/**
	 * @return Generator
	 */
	public function gateProvider(): Generator {
		yield 'nothing saved' => [
			'attributes' => [],
			'ran'        => false,
		];
		yield 'one attribute' => [
			'attributes' => [ 'two' => 5 ],
			'ran'        => true,
		];
		yield 'an empty value still counts' => [
			'attributes' => [ 'one' => '' ],
			'ran'        => true,
		];
		yield 'null does not count' => [
			'attributes' => [ 'one' => null ],
			'ran'        => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function enabledProvider(): Generator {
		yield 'on' => [
			'attributes' => [ 'on' => true ],
			'ran'        => true,
		];
		yield 'a text value is on' => [
			'attributes' => [ 'on' => 'yes' ],
			'ran'        => true,
		];
		yield 'off' => [
			'attributes' => [ 'on' => false ],
			'ran'        => false,
		];
		yield 'empty text' => [
			'attributes' => [ 'on' => '' ],
			'ran'        => false,
		];
		yield 'zero' => [
			'attributes' => [ 'on' => 0 ],
			'ran'        => false,
		];
		yield 'never saved' => [
			'attributes' => [],
			'ran'        => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function spacingProvider(): Generator {
		yield 'list in pixels' => [
			'attributes' => [ 'box' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.t{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}',
		];
		yield 'list in the saved unit' => [
			'attributes' => [
				'box'     => [ 1, 2, 3, 4 ],
				'boxType' => 'em',
			],
			'expected'   => '.t{padding-top:1em;padding-right:2em;padding-bottom:3em;padding-left:4em;}',
		];
		yield 'sides that are not numbers are skipped' => [
			'attributes' => [ 'box' => [ 1, 'x', 3 ] ],
			'expected'   => '.t{padding-top:1px;padding-bottom:3px;}',
		];
		yield 'text is not a list' => [
			'attributes' => [ 'box' => '1234' ],
			'expected'   => '',
		];
		yield 'never saved' => [
			'attributes' => [],
			'expected'   => '',
		];
	}
}
