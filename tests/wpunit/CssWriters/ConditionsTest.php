<?php declare( strict_types=1 );

namespace Tests\wpunit\CssWriters;

use Generator;
use Kadence_Blocks_Css_Not_Empty_Condition;
use Kadence_Blocks_Css_Numeric_Condition;
use Tests\Support\Classes\TestCase;

/**
 * The conditions decide whether a declaration is written.
 */
final class ConditionsTest extends TestCase {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
	}

	/**
	 * The not-empty condition mirrors the legacy `isset() && ! empty()` guard.
	 *
	 * @dataProvider notEmptyProvider
	 *
	 * @param mixed $value    The raw attribute value.
	 * @param bool  $expected Whether the condition is met.
	 *
	 * @return void
	 */
	public function testNotEmptyCondition( $value, bool $expected ): void {
		$this->assertSame( $expected, ( new Kadence_Blocks_Css_Not_Empty_Condition() )->is_met( $value ) );
	}

	/**
	 * The numeric condition mirrors the legacy `is_numeric()` guard, so zero passes.
	 *
	 * @dataProvider numericProvider
	 *
	 * @param mixed $value    The raw attribute value.
	 * @param bool  $expected Whether the condition is met.
	 *
	 * @return void
	 */
	public function testNumericCondition( $value, bool $expected ): void {
		$this->assertSame( $expected, ( new Kadence_Blocks_Css_Numeric_Condition() )->is_met( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function notEmptyProvider(): Generator {
		yield 'never set' => [
			'value'    => null,
			'expected' => false,
		];
		yield 'empty string' => [
			'value'    => '',
			'expected' => false,
		];
		yield 'string zero is empty' => [
			'value'    => '0',
			'expected' => false,
		];
		yield 'integer zero is empty' => [
			'value'    => 0,
			'expected' => false,
		];
		yield 'false' => [
			'value'    => false,
			'expected' => false,
		];
		yield 'empty array' => [
			'value'    => [],
			'expected' => false,
		];
		yield 'text' => [
			'value'    => 'bold',
			'expected' => true,
		];
		yield 'number' => [
			'value'    => 12,
			'expected' => true,
		];
	}

	/**
	 * @return Generator
	 */
	public function numericProvider(): Generator {
		yield 'never set' => [
			'value'    => null,
			'expected' => false,
		];
		yield 'empty string' => [
			'value'    => '',
			'expected' => false,
		];
		yield 'string zero' => [
			'value'    => '0',
			'expected' => true,
		];
		yield 'integer zero' => [
			'value'    => 0,
			'expected' => true,
		];
		yield 'decimal string' => [
			'value'    => '1.5',
			'expected' => true,
		];
		yield 'negative' => [
			'value'    => -5,
			'expected' => true,
		];
		yield 'text' => [
			'value'    => 'auto',
			'expected' => false,
		];
		yield 'array' => [
			'value'    => [ 1 ],
			'expected' => false,
		];
	}
}
