<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Value_Normalizer;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use Tests\Support\Classes\TestCase;

/**
 * Covers the variant value normalizer against the real shipped baseline: matching a captured literal to a
 * semantic alias, leaving unmatched literals and existing aliases alone, and the deterministic role-affinity
 * pick when several semantics share a value.
 */
final class Variant_Value_NormalizerTest extends TestCase {

	private const SET = 'default';

	/**
	 * @var Variant_Value_Normalizer
	 */
	private Variant_Value_Normalizer $normalizer;

	/**
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->normalizer = $this->container->get( Variant_Value_Normalizer::class );
		$this->resolver   = $this->container->get( Token_Resolver::class );
	}

	/**
	 * A literal that equals a semantic's resolved value is rewritten to that semantic's alias, and the alias
	 * resolves back to the original value so the chain is intact.
	 *
	 * @return void
	 */
	public function testItAliasesALiteralThatMatchesASemantic(): void {
		// #3633e1 is the resolved value of the primary button background semantic.
		$result = $this->normalizer->normalize( [ 'button-bg' => '#3633e1' ], self::SET );

		$this->assertTrue( Alias::is_alias( $result['button-bg'] ), 'A matched literal should become an alias.' );
		$this->assertSame(
			'#3633e1',
			$this->resolver->resolve( self::SET )->value( Alias::path_of( $result['button-bg'] ) ),
			'The chosen alias should resolve back to the captured value.'
		);
	}

	/**
	 * A three-digit hex is matched against its expanded six-digit form, so "#FFF" still aliases the semantic
	 * whose resolved value is "#ffffff".
	 *
	 * @return void
	 */
	public function testItMatchesAThreeDigitHexCaseInsensitively(): void {
		$result = $this->normalizer->normalize( [ 'button-text' => '#FFF' ], self::SET );

		$this->assertTrue( Alias::is_alias( $result['button-text'] ) );
		$this->assertSame( '#ffffff', $this->resolver->resolve( self::SET )->value( Alias::path_of( $result['button-text'] ) ) );
	}

	/**
	 * A literal that matches no semantic is left as a literal.
	 *
	 * @return void
	 */
	public function testItLeavesAnUnmatchedLiteralAsIs(): void {
		$result = $this->normalizer->normalize( [ 'button-bg' => 'rgba(1,2,3,0.42)' ], self::SET );

		$this->assertSame( 'rgba(1,2,3,0.42)', $result['button-bg'] );
	}

	/**
	 * A value that is already an alias is passed through untouched.
	 *
	 * @return void
	 */
	public function testItLeavesAnExistingAliasUnchanged(): void {
		$result = $this->normalizer->normalize( [ 'button-bg' => '{semantic.color.button-primary-bg}' ], self::SET );

		$this->assertSame( '{semantic.color.button-primary-bg}', $result['button-bg'] );
	}

	/**
	 * When several semantics share a value, the one whose id best matches the property's role wins: #ffffff is
	 * shared by the plain and hover button-text semantics, and the hover property picks the hover semantic.
	 *
	 * @return void
	 */
	public function testItPrefersASemanticMatchingThePropertyRole(): void {
		$result = $this->normalizer->normalize( [ 'button-text-hover' => '#ffffff' ], self::SET );

		$this->assertTrue( Alias::is_alias( $result['button-text-hover'] ) );
		$this->assertStringContainsString(
			'hover',
			Alias::path_of( $result['button-text-hover'] ),
			'The hover property should prefer a hover-role semantic.'
		);
	}
}
