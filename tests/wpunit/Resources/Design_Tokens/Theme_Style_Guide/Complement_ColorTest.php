<?php declare( strict_types=1 );
// cspell:ignore colorjs .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Style_Guide;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Complement_Color;
use Tests\Support\Classes\TestCase;

/**
 * Covers the PHP version of the theme's complement formula.
 */
final class Complement_ColorTest extends TestCase {

	/**
	 * The complement matches what a browser renders for the theme's formula. Expected values come from
	 * colorjs.io, clipped to sRGB the way browsers clip it.
	 *
	 * @dataProvider complementProvider
	 *
	 * @param string $color    The base color.
	 * @param string $expected The complement hex.
	 *
	 * @return void
	 */
	public function testMatchesTheBrowserColor( string $color, string $expected ): void {
		$this->assertSame( $expected, Complement_Color::of( $color ) );
	}

	/**
	 * Base colors and their complements.
	 *
	 * @return Generator
	 */
	public function complementProvider(): Generator {
		yield 'theme default palette1' => [
			'color'    => '#2B6CB0',
			'expected' => '#a46900',
		];
		yield 'blocks default primary' => [
			'color'    => '#3182CE',
			'expected' => '#bf7900',
		];
		yield 'saturated red, clipped' => [
			'color'    => '#ff0000',
			'expected' => '#00b6e7',
		];
		yield 'dark green' => [
			'color'    => '#13612e',
			'expected' => '#83477e',
		];
		yield 'black lightens' => [
			'color'    => '#000000',
			'expected' => '#030303',
		];
		yield 'white stays white' => [
			'color'    => '#ffffff',
			'expected' => '#ffffff',
		];
		yield 'gray' => [
			'color'    => '#808080',
			'expected' => '#8c8c8c',
		];
		yield 'short hex' => [
			'color'    => '#abc',
			'expected' => '#cdbcab',
		];
		yield 'hex with alpha ignores the alpha' => [
			'color'    => '#2B6CB080',
			'expected' => '#a46900',
		];
		yield 'surrounding whitespace' => [
			'color'    => ' #2B6CB0 ',
			'expected' => '#a46900',
		];
	}

	/**
	 * A color that is not a hex has no complement.
	 *
	 * @dataProvider notHexProvider
	 *
	 * @param string $color The color.
	 *
	 * @return void
	 */
	public function testNonHexHasNoComplement( string $color ): void {
		$this->assertNull( Complement_Color::of( $color ) );
	}

	/**
	 * Colors that are not hex.
	 *
	 * @return Generator
	 */
	public function notHexProvider(): Generator {
		yield 'named color' => [ 'color' => 'red' ];
		yield 'rgb' => [ 'color' => 'rgb(43, 108, 176)' ];
		yield 'css variable' => [ 'color' => 'var(--global-palette1)' ];
		yield 'five digits' => [ 'color' => '#12345' ];
		yield 'empty' => [ 'color' => '' ];
	}
}
