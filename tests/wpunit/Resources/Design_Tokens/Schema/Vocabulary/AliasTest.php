<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use Tests\Support\Classes\TestCase;

final class AliasTest extends TestCase {

	/**
	 * @dataProvider aliasProvider
	 *
	 * @param mixed $value
	 * @param bool  $expected
	 *
	 * @return void
	 */
	public function testItRecognizesAliases( $value, bool $expected ): void {
		$this->assertSame( $expected, Alias::is_alias( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function aliasProvider(): Generator {
		yield 'simple path' => [
			'value'    => '{primitive.color.brand.primary}',
			'expected' => true,
		];
		yield 'single segment' => [
			'value'    => '{brand}',
			'expected' => true,
		];
		yield 'with dashes' => [
			'value'    => '{semantic.color.button-bg}',
			'expected' => true,
		];
		yield 'leading digit' => [
			'value'    => '{primitive.fontSize.2xl}',
			'expected' => true,
		];
		yield 'space inside' => [
			'value'    => '{bad path}',
			'expected' => false,
		];
		yield 'partial interpolation' => [
			'value'    => '1px solid {x}',
			'expected' => false,
		];
		yield 'no braces' => [
			'value'    => 'primitive.color.brand',
			'expected' => false,
		];
		yield 'open only' => [
			'value'    => '{primitive.color',
			'expected' => false,
		];
		yield 'empty braces' => [
			'value'    => '{}',
			'expected' => false,
		];
		yield 'empty string' => [
			'value'    => '',
			'expected' => false,
		];
		yield 'non-string int' => [
			'value'    => 700,
			'expected' => false,
		];
		yield 'non-string array' => [
			'value'    => [ 'a' ],
			'expected' => false,
		];
		yield 'non-string null' => [
			'value'    => null,
			'expected' => false,
		];
	}

	/**
	 * @return void
	 */
	public function testItExtractsTheInnerPath(): void {
		$this->assertSame( 'primitive.color.brand.primary', Alias::path_of( '{primitive.color.brand.primary}' ) );
	}

	/**
	 * @return void
	 */
	public function testItReturnsEmptyForANonAlias(): void {
		$this->assertSame( '', Alias::path_of( 'not-an-alias' ) );
	}

	/**
	 * @dataProvider looksLikeAliasProvider
	 *
	 * @param mixed $value
	 * @param bool  $expected
	 *
	 * @return void
	 */
	public function testItDetectsAFumbledAliasAttempt( $value, bool $expected ): void {
		$this->assertSame( $expected, Alias::looks_like_alias( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function looksLikeAliasProvider(): Generator {
		yield 'malformed space' => [
			'value'    => '{bad path}',
			'expected' => true,
		];
		yield 'unclosed' => [
			'value'    => '{primitive.color',
			'expected' => true,
		];
		yield 'partial interpolation' => [
			'value'    => '1px solid {x}',
			'expected' => true,
		];
		yield 'closing only' => [
			'value'    => 'x}',
			'expected' => true,
		];
		yield 'well-formed too' => [
			'value'    => '{primitive.color.brand.primary}',
			'expected' => true,
		];
		yield 'plain literal' => [
			'value'    => 'not-a-color',
			'expected' => false,
		];
		yield 'empty string' => [
			'value'    => '',
			'expected' => false,
		];
		yield 'non-string' => [
			'value'    => 700,
			'expected' => false,
		];
	}
}
