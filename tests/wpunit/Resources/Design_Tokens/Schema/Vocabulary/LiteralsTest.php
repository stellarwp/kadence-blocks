<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Literals;
use Tests\Support\Classes\TestCase;

final class LiteralsTest extends TestCase {

	/**
	 * @dataProvider colorProvider
	 *
	 * @param mixed $value
	 * @param bool  $expected
	 *
	 * @return void
	 */
	public function testColors( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_color( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function colorProvider(): Generator {
		yield 'hex 6' => [
			'value'    => '#3182CE',
			'expected' => true,
		];
		yield 'hex 3' => [
			'value'    => '#fff',
			'expected' => true,
		];
		yield 'hex 8 alpha' => [
			'value'    => '#11223344',
			'expected' => true,
		];
		yield 'rgb()' => [
			'value'    => 'rgb(10, 20, 30)',
			'expected' => true,
		];
		yield 'hsl()' => [
			'value'    => 'hsl(200 50% 40%)',
			'expected' => true,
		];
		yield 'var()' => [
			'value'    => 'var(--x)',
			'expected' => true,
		];
		yield 'named' => [
			'value'    => 'rebeccapurple',
			'expected' => true,
		];
		yield 'transparent' => [
			'value'    => 'transparent',
			'expected' => true,
		];
		yield 'currentColor' => [
			'value'    => 'currentColor',
			'expected' => true,
		];
		yield 'not a color' => [
			'value'    => 'not-a-color',
			'expected' => false,
		];
		yield 'bare word' => [
			'value'    => 'banana',
			'expected' => false,
		];
		yield 'empty' => [
			'value'    => '',
			'expected' => false,
		];
		yield 'number' => [
			'value'    => 123,
			'expected' => false,
		];
	}

	/**
	 * @dataProvider dimensionProvider
	 *
	 * @param mixed $value
	 * @param bool  $expected
	 *
	 * @return void
	 */
	public function testDimensions( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_dimension( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function dimensionProvider(): Generator {
		yield 'zero' => [
			'value'    => '0',
			'expected' => true,
		];
		yield 'rem' => [
			'value'    => '0.25rem',
			'expected' => true,
		];
		yield 'px' => [
			'value'    => '9999px',
			'expected' => true,
		];
		yield 'percent' => [
			'value'    => '50%',
			'expected' => true,
		];
		yield 'negative' => [
			'value'    => '-2px',
			'expected' => true,
		];
		yield 'clamp()' => [
			'value'    => 'clamp(1rem, 2vw, 3rem)',
			'expected' => true,
		];
		yield 'calc()' => [
			'value'    => 'calc(100% - 8px)',
			'expected' => true,
		];
		yield 'unitless num' => [
			'value'    => '12',
			'expected' => false,
		];
		yield 'word' => [
			'value'    => 'red',
			'expected' => false,
		];
		yield 'space' => [
			'value'    => '10 px',
			'expected' => false,
		];
		yield 'empty' => [
			'value'    => '',
			'expected' => false,
		];
	}

	/**
	 * @dataProvider fontFamilyProvider
	 *
	 * @param mixed $value
	 * @param bool  $expected
	 *
	 * @return void
	 */
	public function testFontFamilies( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_font_family( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function fontFamilyProvider(): Generator {
		yield 'list' => [
			'value'    => [ 'Inter', 'system-ui', 'sans-serif' ],
			'expected' => true,
		];
		yield 'single' => [
			'value'    => [ 'Georgia' ],
			'expected' => true,
		];
		yield 'empty list' => [
			'value'    => [],
			'expected' => false,
		];
		yield 'empty member' => [
			'value'    => [ 'Inter', '' ],
			'expected' => false,
		];
		yield 'non-string' => [
			'value'    => [ 'Inter', 3 ],
			'expected' => false,
		];
		yield 'assoc' => [
			'value'    => [ 'a' => 'Inter' ],
			'expected' => false,
		];
		yield 'string' => [
			'value'    => 'Inter',
			'expected' => false,
		];
	}

	/**
	 * @dataProvider fontWeightProvider
	 *
	 * @param mixed $value
	 * @param bool  $expected
	 *
	 * @return void
	 */
	public function testFontWeights( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_font_weight( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function fontWeightProvider(): Generator {
		yield 'int 700' => [
			'value'    => 700,
			'expected' => true,
		];
		yield 'int 1' => [
			'value'    => 1,
			'expected' => true,
		];
		yield 'string 400' => [
			'value'    => '400',
			'expected' => true,
		];
		yield 'bold' => [
			'value'    => 'bold',
			'expected' => true,
		];
		yield 'zero' => [
			'value'    => 0,
			'expected' => false,
		];
		yield 'too big' => [
			'value'    => 1001,
			'expected' => false,
		];
		yield 'leading zero string' => [
			'value'    => '0400',
			'expected' => false,
		];
		yield 'word' => [
			'value'    => 'heavy',
			'expected' => false,
		];
	}

	/**
	 * @dataProvider lineHeightProvider
	 *
	 * @param mixed $value
	 * @param bool  $expected
	 *
	 * @return void
	 */
	public function testLineHeights( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_line_height( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function lineHeightProvider(): Generator {
		yield 'float' => [
			'value'    => 1.5,
			'expected' => true,
		];
		yield 'int' => [
			'value'    => 2,
			'expected' => true,
		];
		yield 'unitless str' => [
			'value'    => '1.6',
			'expected' => true,
		];
		yield 'rem' => [
			'value'    => '1.5rem',
			'expected' => true,
		];
		yield 'normal' => [
			'value'    => 'normal',
			'expected' => true,
		];
		yield 'negative' => [
			'value'    => -1.0,
			'expected' => false,
		];
		yield 'word' => [
			'value'    => 'tall',
			'expected' => false,
		];
	}
}
