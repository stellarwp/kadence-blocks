<?php declare( strict_types=1 );

namespace Tests\wpunit;

use Generator;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * The normalizer reduces CSS to its meaning so reorganised CSS compares equal and changed CSS does not.
 */
final class CssNormalizerTest extends TestCase {

	/**
	 * CSS that means the same thing normalizes to the same hash.
	 *
	 * @dataProvider equivalentProvider
	 *
	 * @param string $first  One stylesheet.
	 * @param string $second An equivalent stylesheet.
	 *
	 * @return void
	 */
	public function testEquivalentCssHasTheSameHash( string $first, string $second ): void {
		$normalizer = new Css_Normalizer();

		$this->assertSame( $normalizer->hash( $first ), $normalizer->hash( $second ) );
	}

	/**
	 * CSS that means something different normalizes to a different hash.
	 *
	 * @dataProvider differentProvider
	 *
	 * @param string $first  One stylesheet.
	 * @param string $second A stylesheet that differs in meaning.
	 *
	 * @return void
	 */
	public function testDifferentCssHasADifferentHash( string $first, string $second ): void {
		$normalizer = new Css_Normalizer();

		$this->assertNotSame( $normalizer->hash( $first ), $normalizer->hash( $second ) );
	}

	/**
	 * The normalized form maps media query, selector and property to the final value.
	 *
	 * @return void
	 */
	public function testNormalizeShape(): void {
		$css = '.a{color:red;color:blue;margin:0;}@media all and (max-width: 1024px){.a{color:green;}}';

		$this->assertSame(
			[
				''                                   => [
					'.a' => [
						'color'  => 'blue',
						'margin' => '0',
					],
				],
				'@media all and (max-width: 1024px)' => [ '.a' => [ 'color' => 'green' ] ],
			],
			( new Css_Normalizer() )->normalize( $css )
		);
	}

	/**
	 * Semicolons inside brackets or quotes do not split a declaration.
	 *
	 * @return void
	 */
	public function testSemicolonsInsideBracketsAndQuotesAreKept(): void {
		$css = ".a{background:url(data:image/svg+xml;base64,AAA);content:'a;b';color:red;}";

		$this->assertSame(
			[
				'' => [
					'.a' => [
						'background' => 'url(data:image/svg+xml;base64,AAA)',
						'color'      => 'red',
						'content'    => "'a;b'",
					],
				],
			],
			( new Css_Normalizer() )->normalize( $css )
		);
	}

	/**
	 * Text that is not CSS, such as a recorded exception, is kept so it still compares.
	 *
	 * @return void
	 */
	public function testNonCssIsKept(): void {
		$normalizer = new Css_Normalizer();

		$this->assertNotSame( $normalizer->hash( 'EXCEPTION:TypeError' ), $normalizer->hash( 'EXCEPTION:ValueError' ) );
		$this->assertSame( [], ( new Css_Normalizer() )->normalize( '' ) );
	}

	/**
	 * @return Generator
	 */
	public function equivalentProvider(): Generator {
		yield 'rules in a different order' => [
			'first'  => '.a{color:red;}.b{margin:0;}',
			'second' => '.b{margin:0;}.a{color:red;}',
		];
		yield 'one selector split across blocks' => [
			'first'  => '.a{color:red;margin:0;}.b{top:0;}',
			'second' => '.a{color:red;}.b{top:0;}.a{margin:0;}',
		];
		yield 'properties in a different order' => [
			'first'  => '.a{color:red;margin:0;}',
			'second' => '.a{margin:0;color:red;}',
		];
		yield 'a repeated declaration' => [
			'first'  => '.a{color:red;color:red;}',
			'second' => '.a{color:red;}',
		];
		yield 'an overridden declaration' => [
			'first'  => '.a{color:blue;color:red;}',
			'second' => '.a{color:red;}',
		];
		yield 'whitespace' => [
			'first'  => ".a  {\n color : red ;\n}",
			'second' => '.a{color:red;}',
		];
		yield 'media queries in a different order' => [
			'first'  => '@media all and (max-width: 767px){.a{top:1px;}}@media all and (max-width: 1024px){.a{top:2px;}}',
			'second' => '@media all and (max-width: 1024px){.a{top:2px;}}@media all and (max-width: 767px){.a{top:1px;}}',
		];
	}

	/**
	 * @return Generator
	 */
	public function differentProvider(): Generator {
		yield 'a different value' => [
			'first'  => '.a{color:red;}',
			'second' => '.a{color:blue;}',
		];
		yield 'a missing property' => [
			'first'  => '.a{color:red;margin:0;}',
			'second' => '.a{color:red;}',
		];
		yield 'a different selector' => [
			'first'  => '.a{color:red;}',
			'second' => '.b{color:red;}',
		];
		yield 'a declaration moved to another media query' => [
			'first'  => '.a{color:red;}',
			'second' => '@media all and (max-width: 1024px){.a{color:red;}}',
		];
		yield 'a different media query' => [
			'first'  => '@media all and (max-width: 1024px){.a{color:red;}}',
			'second' => '@media all and (max-width: 767px){.a{color:red;}}',
		];
		yield 'an extra rule' => [
			'first'  => '.a{color:red;}',
			'second' => '.a{color:red;}.b{color:red;}',
		];
		yield 'the last value is what counts' => [
			'first'  => '.a{color:red;color:blue;}',
			'second' => '.a{color:red;}',
		];
	}
}
