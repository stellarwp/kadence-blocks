<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use Tests\Support\Classes\TestCase;

final class AliasTest extends TestCase {

	/**
	 * @dataProvider aliasProvider
	 *
	 * @param mixed $value
	 */
	public function testItRecognisesAliases( $value, bool $expected ): void {
		$this->assertSame( $expected, Alias::is_alias( $value ) );
	}

	/**
	 * @return array<string, array{0: mixed, 1: bool}>
	 */
	public function aliasProvider(): array {
		return [
			'simple path'      => [ '{primitive.color.brand.primary}', true ],
			'single segment'   => [ '{brand}', true ],
			'with dashes'      => [ '{semantic.color.button-bg}', true ],
			'leading digit'    => [ '{primitive.fontSize.2xl}', true ],
			'space inside'     => [ '{bad path}', false ],
			'partial interp'   => [ '1px solid {x}', false ],
			'no braces'        => [ 'primitive.color.brand', false ],
			'open only'        => [ '{primitive.color', false ],
			'empty braces'     => [ '{}', false ],
			'empty string'     => [ '', false ],
			'non-string int'   => [ 700, false ],
			'non-string array' => [ [ 'a' ], false ],
			'non-string null'  => [ null, false ],
		];
	}

	public function testItExtractsTheInnerPath(): void {
		$this->assertSame( 'primitive.color.brand.primary', Alias::path_of( '{primitive.color.brand.primary}' ) );
	}

	public function testItReturnsEmptyForANonAlias(): void {
		$this->assertSame( '', Alias::path_of( 'not-an-alias' ) );
	}

	/**
	 * @dataProvider looksLikeAliasProvider
	 *
	 * @param mixed $value
	 */
	public function testItDetectsAFumbledAliasAttempt( $value, bool $expected ): void {
		$this->assertSame( $expected, Alias::looks_like_alias( $value ) );
	}

	/**
	 * @return array<string, array{0: mixed, 1: bool}>
	 */
	public function looksLikeAliasProvider(): array {
		return [
			'malformed space' => [ '{bad path}', true ],
			'unclosed'        => [ '{primitive.color', true ],
			'partial interp'  => [ '1px solid {x}', true ],
			'closing only'    => [ 'x}', true ],
			'well-formed too' => [ '{primitive.color.brand.primary}', true ],
			'plain literal'   => [ 'not-a-color', false ],
			'empty string'    => [ '', false ],
			'non-string'      => [ 700, false ],
		];
	}
}
