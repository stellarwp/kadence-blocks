<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Literals;
use Tests\Support\Classes\TestCase;

final class LiteralsTest extends TestCase {

	/**
	 * @dataProvider colorProvider
	 *
	 * @param mixed $value
	 */
	public function testColors( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_color( $value ) );
	}

	/**
	 * @return array<string, array{0: mixed, 1: bool}>
	 */
	public function colorProvider(): array {
		return [
			'hex 6'        => [ '#3182CE', true ],
			'hex 3'        => [ '#fff', true ],
			'hex 8 alpha'  => [ '#11223344', true ],
			'rgb()'        => [ 'rgb(10, 20, 30)', true ],
			'hsl()'        => [ 'hsl(200 50% 40%)', true ],
			'var()'        => [ 'var(--x)', true ],
			'named'        => [ 'rebeccapurple', true ],
			'transparent'  => [ 'transparent', true ],
			'currentColor' => [ 'currentColor', true ],
			'not a color'  => [ 'not-a-color', false ],
			'bare word'    => [ 'banana', false ],
			'empty'        => [ '', false ],
			'number'       => [ 123, false ],
		];
	}

	/**
	 * @dataProvider dimensionProvider
	 *
	 * @param mixed $value
	 */
	public function testDimensions( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_dimension( $value ) );
	}

	/**
	 * @return array<string, array{0: mixed, 1: bool}>
	 */
	public function dimensionProvider(): array {
		return [
			'zero'         => [ '0', true ],
			'rem'          => [ '0.25rem', true ],
			'px'           => [ '9999px', true ],
			'percent'      => [ '50%', true ],
			'negative'     => [ '-2px', true ],
			'clamp()'      => [ 'clamp(1rem, 2vw, 3rem)', true ],
			'calc()'       => [ 'calc(100% - 8px)', true ],
			'unitless num' => [ '12', false ],
			'word'         => [ 'red', false ],
			'space'        => [ '10 px', false ],
			'empty'        => [ '', false ],
		];
	}

	/**
	 * @dataProvider fontFamilyProvider
	 *
	 * @param mixed $value
	 */
	public function testFontFamilies( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_font_family( $value ) );
	}

	/**
	 * @return array<string, array{0: mixed, 1: bool}>
	 */
	public function fontFamilyProvider(): array {
		return [
			'list'         => [ [ 'Inter', 'system-ui', 'sans-serif' ], true ],
			'single'       => [ [ 'Georgia' ], true ],
			'empty list'   => [ [], false ],
			'empty member' => [ [ 'Inter', '' ], false ],
			'non-string'   => [ [ 'Inter', 3 ], false ],
			'assoc'        => [ [ 'a' => 'Inter' ], false ],
			'string'       => [ 'Inter', false ],
		];
	}

	/**
	 * @dataProvider fontWeightProvider
	 *
	 * @param mixed $value
	 */
	public function testFontWeights( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_font_weight( $value ) );
	}

	/**
	 * @return array<string, array{0: mixed, 1: bool}>
	 */
	public function fontWeightProvider(): array {
		return [
			'int 700'    => [ 700, true ],
			'int 1'      => [ 1, true ],
			'string 400' => [ '400', true ],
			'bold'       => [ 'bold', true ],
			'zero'       => [ 0, false ],
			'too big'    => [ 1001, false ],
			'word'       => [ 'heavy', false ],
		];
	}

	/**
	 * @dataProvider lineHeightProvider
	 *
	 * @param mixed $value
	 */
	public function testLineHeights( $value, bool $expected ): void {
		$this->assertSame( $expected, Literals::is_line_height( $value ) );
	}

	/**
	 * @return array<string, array{0: mixed, 1: bool}>
	 */
	public function lineHeightProvider(): array {
		return [
			'float'        => [ 1.5, true ],
			'int'          => [ 2, true ],
			'unitless str' => [ '1.6', true ],
			'rem'          => [ '1.5rem', true ],
			'normal'       => [ 'normal', true ],
			'negative'     => [ -1.0, false ],
			'word'         => [ 'tall', false ],
		];
	}
}
