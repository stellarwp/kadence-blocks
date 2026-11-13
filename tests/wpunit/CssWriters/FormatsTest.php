<?php declare( strict_types=1 );

namespace Tests\wpunit\CssWriters;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Color_Format;
use Kadence_Blocks_Css_Font_Weight_Format;
use Kadence_Blocks_Css_Raw_Format;
use Kadence_Blocks_Css_Sanitized_Color_Format;
use Kadence_Blocks_Css_String_Format;
use Kadence_Blocks_Css_Unit_Format;
use Tests\Support\Classes\TestCase;

/**
 * The value formats turn attribute values into CSS values.
 */
final class FormatsTest extends TestCase {

	/**
	 * The CSS builder the formats render through.
	 *
	 * @var Kadence_Blocks_CSS
	 */
	private $css;

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
		$this->css = new Kadence_Blocks_CSS();
	}

	/**
	 * The raw format returns the value untouched.
	 *
	 * @return void
	 */
	public function testRawFormatReturnsTheValueUnchanged(): void {
		$this->assertSame( 'uppercase', ( new Kadence_Blocks_Css_Raw_Format() )->format( 'uppercase' ) );
	}

	/**
	 * The unit format appends its unit to any value.
	 *
	 * @dataProvider unitProvider
	 *
	 * @param mixed  $value    The raw attribute value.
	 * @param string $unit     The unit to append.
	 * @param string $expected The formatted value.
	 *
	 * @return void
	 */
	public function testUnitFormatAppendsTheUnit( $value, string $unit, string $expected ): void {
		$this->assertSame( $expected, ( new Kadence_Blocks_Css_Unit_Format( $unit ) )->format( $value ) );
	}

	/**
	 * The color format returns what the CSS builder renders for the same color.
	 *
	 * @return void
	 */
	public function testColorFormatMatchesTheBuilder(): void {
		$this->assertSame( $this->css->render_color( '#ff0000' ), ( new Kadence_Blocks_Css_Color_Format( $this->css ) )->format( '#ff0000' ) );
		$this->assertSame( '#ff0000', ( new Kadence_Blocks_Css_Color_Format( $this->css ) )->format( '#ff0000' ) );
	}

	/**
	 * The sanitized color format returns what the CSS builder sanitizes for the same color.
	 *
	 * @return void
	 */
	public function testSanitizedColorFormatMatchesTheBuilder(): void {
		$this->assertSame( $this->css->sanitize_color( '#00ff00' ), ( new Kadence_Blocks_Css_Sanitized_Color_Format( $this->css ) )->format( '#00ff00' ) );
	}

	/**
	 * The unit format concatenates whatever unit it was given, as the legacy code did, without type errors.
	 *
	 * @return void
	 */
	public function testUnitFormatAcceptsNonStringUnits(): void {
		$this->assertSame( '5', ( new Kadence_Blocks_Css_Unit_Format( null ) )->format( 5 ) );
		$this->assertSame( '51', ( new Kadence_Blocks_Css_Unit_Format( 1 ) )->format( 5 ) );
	}

	/**
	 * The string format returns what the CSS builder renders for the same string.
	 *
	 * @return void
	 */
	public function testStringFormatMatchesTheBuilder(): void {
		$this->assertSame( $this->css->render_string( 'bold' ), ( new Kadence_Blocks_Css_String_Format( $this->css ) )->format( 'bold' ) );
	}

	/**
	 * The font weight format returns what the CSS builder renders for the same weight.
	 *
	 * @return void
	 */
	public function testFontWeightFormatMatchesTheBuilder(): void {
		$this->assertSame( $this->css->render_font_weight( '700' ), ( new Kadence_Blocks_Css_Font_Weight_Format( $this->css ) )->format( '700' ) );
	}

	/**
	 * @return Generator
	 */
	public function unitProvider(): Generator {
		yield 'integer with px' => [
			'value'    => 12,
			'unit'     => 'px',
			'expected' => '12px',
		];
		yield 'string with em' => [
			'value'    => '1.5',
			'unit'     => 'em',
			'expected' => '1.5em',
		];
		yield 'zero keeps its unit' => [
			'value'    => 0,
			'unit'     => 'px',
			'expected' => '0px',
		];
		yield 'empty unit' => [
			'value'    => 5,
			'unit'     => '',
			'expected' => '5',
		];
	}
}
