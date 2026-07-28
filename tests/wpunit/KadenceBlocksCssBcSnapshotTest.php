<?php declare( strict_types=1 );

namespace Tests\wpunit;

use Generator;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\TestCase;

/**
 * Backward-compatibility guard for the alias recognizer's render sites.
 *
 * For every relaxed `render_*` method in {@see Kadence_Blocks_CSS}, numeric/literal
 * (non-alias) input must produce output byte-for-byte identical to what the method
 * produced before the alias-recognizer branch was added. The recognizer only ever
 * fires on a strict `{dot.alias}` value; for everything else — plain numbers, `0`,
 * empty values, and strings that merely contain a brace without being a strict alias
 * — its added branch must be provably inert.
 */
final class KadenceBlocksCssBcSnapshotTest extends TestCase {

	protected $css;

	protected function setUp(): void {
		parent::setUp();

		$this->css = new Kadence_Blocks_CSS();
	}

	protected function tearDown(): void {
		parent::tearDown();
	}

	/**
	 * render_number returns byte-identical output for numeric/literal input, and
	 * short-circuits to false for non-numeric, non-alias input.
	 *
	 * @dataProvider renderNumberProvider
	 *
	 * @param mixed         $number   The raw number value.
	 * @param string|null   $unit     The unit to append.
	 * @param string|false  $expected The expected byte-identical output.
	 *
	 * @return void
	 */
	public function testRenderNumberBcCases( $number, ?string $unit, $expected ): void {
		$this->assertSame( $expected, $this->css->render_number( $number, $unit ),
			'render_number must be byte-identical to its pre-recognizer output for numeric/literal input' );
	}

	/**
	 * Provides numeric/literal and boundary inputs for render_number.
	 *
	 * @return Generator
	 */
	public static function renderNumberProvider(): Generator {
		yield 'positive integer with px unit' => [
			'number'   => 16,
			'unit'     => 'px',
			'expected' => '16px',
		];
		yield 'float with em unit' => [
			'number'   => 1.5,
			'unit'     => 'em',
			'expected' => '1.5em',
		];
		yield 'zero renders literally with unit' => [
			'number'   => 0,
			'unit'     => 'px',
			'expected' => '0px',
		];
		yield 'negative number keeps its sign' => [
			'number'   => -10,
			'unit'     => 'px',
			'expected' => '-10px',
		];
		yield 'no unit given returns the bare number' => [
			'number'   => 16,
			'unit'     => null,
			'expected' => '16',
		];
		yield 'brace-containing non-alias is not numeric and fails' => [
			'number'   => '1px solid {semantic.color.brand}',
			'unit'     => 'px',
			'expected' => false,
		];
		yield 'malformed alias fails open and returns false' => [
			'number'   => '{bad path}',
			'unit'     => 'px',
			'expected' => false,
		];
		yield 'empty string returns false' => [
			'number'   => '',
			'unit'     => 'px',
			'expected' => false,
		];
		yield 'null number returns false' => [
			'number'   => null,
			'unit'     => 'px',
			'expected' => false,
		];
	}

	/**
	 * render_range returns byte-identical output for numeric and boundary input: it
	 * adds a `property:value` declaration and returns null on success, or returns
	 * false and adds nothing when the value is not numeric.
	 *
	 * @dataProvider renderRangeProvider
	 *
	 * @param array         $attributes      The attributes array keyed by "width".
	 * @param string        $unit            The unit to append.
	 * @param mixed         $expectedReturn  The expected return value.
	 * @param string|null   $expectedFragment The expected declaration fragment, or null if none.
	 *
	 * @return void
	 */
	public function testRenderRangeBcCases( array $attributes, string $unit, $expectedReturn, ?string $expectedFragment ): void {
		$actual = $this->css->render_range( $attributes, 'width', 'width', $unit );

		$this->assertSame( $expectedReturn, $actual,
			'render_range must return byte-identical values for numeric/literal input' );

		$output = $this->css->css_output();

		if ( null !== $expectedFragment ) {
			$this->assertStringContainsString( $expectedFragment, $output,
				'render_range must emit the byte-identical declaration for numeric input' );
		} else {
			$this->assertStringNotContainsString( 'width:', $output,
				'render_range must add nothing when the value is not numeric' );
		}
	}

	/**
	 * Provides numeric and boundary inputs for render_range.
	 *
	 * @return Generator
	 */
	public static function renderRangeProvider(): Generator {
		yield 'number with px unit' => [
			'attributes'       => [ 'width' => 16 ],
			'unit'             => 'px',
			'expectedReturn'   => null,
			'expectedFragment' => 'width:16px',
		];
		yield 'float with em unit' => [
			'attributes'       => [ 'width' => 1.5 ],
			'unit'             => 'em',
			'expectedReturn'   => null,
			'expectedFragment' => 'width:1.5em',
		];
		yield 'zero renders with unit' => [
			'attributes'       => [ 'width' => 0 ],
			'unit'             => 'px',
			'expectedReturn'   => null,
			'expectedFragment' => 'width:0px',
		];
		yield 'negative number keeps its sign' => [
			'attributes'       => [ 'width' => -10 ],
			'unit'             => 'px',
			'expectedReturn'   => null,
			'expectedFragment' => 'width:-10px',
		];
		yield 'brace-containing non-alias is not numeric and short-circuits' => [
			'attributes'       => [ 'width' => '1px solid {semantic.color.brand}' ],
			'unit'             => 'px',
			'expectedReturn'   => false,
			'expectedFragment' => null,
		];
		yield 'empty string short-circuits' => [
			'attributes'       => [ 'width' => '' ],
			'unit'             => 'px',
			'expectedReturn'   => false,
			'expectedFragment' => null,
		];
	}

	/**
	 * render_color returns byte-identical output for literal colors, palette slugs,
	 * and brace-containing non-alias strings, which must pass through untouched.
	 *
	 * @dataProvider renderColorProvider
	 *
	 * @param mixed        $color    The raw color value.
	 * @param string|false $expected The expected byte-identical output.
	 *
	 * @return void
	 */
	public function testRenderColorBcCases( $color, $expected ): void {
		$this->assertSame( $expected, $this->css->render_color( $color ),
			'render_color must be byte-identical to its pre-recognizer output for literal input' );
	}

	/**
	 * sanitize_color returns byte-identical output for literal colors, palette slugs,
	 * and brace-containing non-alias strings, which must pass through untouched.
	 *
	 * @dataProvider renderColorProvider
	 *
	 * @param mixed        $color    The raw color value.
	 * @param string|false $expected The expected byte-identical output.
	 *
	 * @return void
	 */
	public function testSanitizeColorBcCases( $color, $expected ): void {
		$this->assertSame( $expected, $this->css->sanitize_color( $color ),
			'sanitize_color must be byte-identical to its pre-recognizer output for literal input' );
	}

	/**
	 * Provides literal, palette, and boundary color inputs shared by render_color and
	 * sanitize_color.
	 *
	 * @return Generator
	 */
	public static function renderColorProvider(): Generator {
		yield 'hex color is unchanged' => [
			'color'    => '#3182CE',
			'expected' => '#3182CE',
		];
		yield 'rgba string is unchanged' => [
			'color'    => 'rgba(0, 0, 0, 0.5)',
			'expected' => 'rgba(0, 0, 0, 0.5)',
		];
		yield 'palette slug resolves to the global palette var' => [
			'color'    => 'palette1',
			'expected' => 'var(--global-palette1, #3182CE)',
		];
		yield 'zero is falsy so empty() short-circuits to false' => [
			'color'    => 0,
			'expected' => false,
		];
		yield 'brace-containing non-alias string passes through unchanged' => [
			'color'    => '1px solid {semantic.color.brand}',
			'expected' => '1px solid {semantic.color.brand}',
		];
		yield 'empty string returns false' => [
			'color'    => '',
			'expected' => false,
		];
		yield 'null returns false' => [
			'color'    => null,
			'expected' => false,
		];
	}
}
