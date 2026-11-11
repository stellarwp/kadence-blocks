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
		yield 'rgb with commas' => [
			'color'    => 'rgb(43, 108, 176)',
			'expected' => '#a46900',
		];
		yield 'rgba ignores the alpha' => [
			'color'    => 'rgba(43,108,176,0.5)',
			'expected' => '#a46900',
		];
		yield 'rgb with spaces and alpha' => [
			'color'    => 'rgb(43 108 176 / 50%)',
			'expected' => '#a46900',
		];
		yield 'rgb percentages' => [
			'color'    => 'rgb(17% 42% 69%)',
			'expected' => '#a46900',
		];
		yield 'hsl' => [
			'color'    => 'hsl(211, 61%, 43%)',
			'expected' => '#a46900',
		];
		yield 'hsl with deg and alpha' => [
			'color'    => 'hsl(211deg 61% 43% / 0.5)',
			'expected' => '#a46900',
		];
		yield 'hsla with a negative hue' => [
			'color'    => 'hsla(-149, 61%, 43%, 1)',
			'expected' => '#a46900',
		];
	}

	/**
	 * A value that is not a hex, rgb() or hsl() color has no complement.
	 *
	 * @dataProvider unreadableProvider
	 *
	 * @param string $color The color.
	 *
	 * @return void
	 */
	public function testUnreadableColorHasNoComplement( string $color ): void {
		$this->assertNull( Complement_Color::of( $color ) );
	}

	/**
	 * Values Complement_Color can't read.
	 *
	 * @return Generator
	 */
	public function unreadableProvider(): Generator {
		yield 'named color' => [ 'color' => 'red' ];
		yield 'rgb with words' => [ 'color' => 'rgb(a, b, c)' ];
		yield 'hsl missing a value' => [ 'color' => 'hsl(1, 2)' ];
		yield 'css variable' => [ 'color' => 'var(--global-palette1)' ];
		yield 'five digits' => [ 'color' => '#12345' ];
		yield 'empty' => [ 'color' => '' ];
	}
}
