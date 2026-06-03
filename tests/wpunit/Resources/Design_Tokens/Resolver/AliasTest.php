<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Alias;
use Tests\Support\Classes\TestCase;

final class AliasTest extends TestCase {

	/**
	 * @dataProvider aliasProvider
	 *
	 * @param mixed $value
	 */
	public function testItRecognizesAliases( $value, bool $expected ): void {
		$this->assertSame( $expected, Alias::is_alias( $value ) );
	}

	/**
	 * @return array<string, array{0: mixed, 1: bool}>
	 */
	public function aliasProvider(): array {
		return [
			'simple reference'   => [ '{primitive.color.brand.primary}', true ],
			'single segment'     => [ '{brand}', true ],
			'hyphenated segment' => [ '{semantic.color.button-bg}', true ],
			'plain color'        => [ '#3182CE', false ],
			'dimension'          => [ '1rem', false ],
			'embedded reference' => [ 'calc({primitive.dimension.space.md} * 2)', false ],
			'unclosed brace'     => [ '{primitive.color', false ],
			'illegal char'       => [ '{primitive.color/brand}', false ],
			'empty braces'       => [ '{}', false ],
			'non-string int'     => [ 700, false ],
			'non-string array'   => [ [ 'color' => '#fff' ], false ],
			'null'               => [ null, false ],
		];
	}

	public function testPathOfExtractsTheReferencedDotPath(): void {
		$this->assertSame( 'primitive.color.brand.primary', Alias::path_of( '{primitive.color.brand.primary}' ) );
	}

	public function testPathOfReturnsNullForNonAliases(): void {
		$this->assertNull( Alias::path_of( '#3182CE' ) );
		$this->assertNull( Alias::path_of( 700 ) );
		$this->assertNull( Alias::path_of( [ 'a' => 1 ] ) );
	}
}
