<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Schema\Vocabulary;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use Tests\Support\Classes\TestCase;

/**
 * Proves the PHP alias->var() transform stays byte-identical to the JS one by asserting against the
 * SAME fixture the jest suite reads (never a forked copy). A drift in `Alias::is_alias()`,
 * `Alias::path_of()`, or `Css_Var::from_id()` on the PHP side, or in `resolveTokenAlias()` on the JS
 * side, fails whichever suite still expects the old string.
 *
 * @since TBD
 */
final class AliasConformanceTest extends TestCase {

	/**
	 * Every alias entry in the shared conformance fixture is recognized by the strict predicate and
	 * resolves, through `Alias::path_of()` + `Css_Var::from_id()`, to the exact `var()` string the JS
	 * suite also asserts for that entry.
	 *
	 * @dataProvider aliasProvider
	 *
	 * @param string $alias   The alias string, e.g. "{semantic.radius.media}".
	 * @param string $css_var The expected "var(--kb-token--<id>)" string.
	 *
	 * @return void
	 */
	public function testAliasesResolveToTheExpectedCssVar( string $alias, string $css_var ): void {
		$this->assertTrue( Alias::is_alias( $alias ) );
		$this->assertSame( $css_var, 'var(' . Css_Var::from_id( Alias::path_of( $alias ) ) . ')' );
	}

	/**
	 * Every nonAlias entry in the shared conformance fixture is rejected by the strict predicate, so no
	 * render path ever mints a `var()` from it.
	 *
	 * @dataProvider nonAliasProvider
	 *
	 * @param mixed $non_alias A value the fixture asserts is not a well-formed alias.
	 *
	 * @return void
	 */
	public function testNonAliasesAreRejected( $non_alias ): void {
		$this->assertFalse( Alias::is_alias( $non_alias ) );
	}

	/**
	 * A braced-but-malformed string (a fumbled alias attempt) is caught by the loose predicate but
	 * still rejected by the strict one — the fail-open seam this ticket pins.
	 *
	 * @dataProvider braceButMalformedProvider
	 *
	 * @param string $value A braced-but-malformed value from the shared conformance fixture.
	 *
	 * @return void
	 */
	public function testBracedButMalformedValuesAreLooseButNotStrict( string $value ): void {
		$this->assertTrue( Alias::looks_like_alias( $value ) );
		$this->assertFalse( Alias::is_alias( $value ) );
	}

	/**
	 * A plain, unbraced literal is rejected by both the strict and the loose predicate. The JS pattern
	 * (`/^\{[\w.-]+\}$/`) has no loose counterpart at all, so a plain literal is simply never a
	 * candidate in either language.
	 *
	 * @dataProvider plainLiteralProvider
	 *
	 * @param string $value A plain, unbraced literal from the shared conformance fixture.
	 *
	 * @return void
	 */
	public function testPlainLiteralsAreRejectedByBothPredicates( string $value ): void {
		$this->assertFalse( Alias::is_alias( $value ) );
		$this->assertFalse( Alias::looks_like_alias( $value ) );
	}

	/**
	 * Guards against a truncated fixture: both sections must actually contain cases, or the parity
	 * assertions above would pass vacuously.
	 *
	 * @return void
	 */
	public function testBothFixtureSectionsAreNonEmpty(): void {
		$fixture = $this->load_fixture();

		$this->assertNotEmpty( $fixture['aliases'] );
		$this->assertNotEmpty( $fixture['nonAliases'] );
	}

	/**
	 * @return Generator
	 */
	public function aliasProvider(): Generator {
		foreach ( $this->load_fixture()['aliases'] as $entry ) {
			yield $entry['alias'] => [
				'alias'   => $entry['alias'],
				'css_var' => $entry['cssVar'],
			];
		}
	}

	/**
	 * @return Generator
	 */
	public function nonAliasProvider(): Generator {
		foreach ( $this->load_fixture()['nonAliases'] as $index => $non_alias ) {
			yield sprintf( 'nonAliases[%d]: %s', $index, wp_json_encode( $non_alias ) ) => [
				'non_alias' => $non_alias,
			];
		}
	}

	/**
	 * @return Generator
	 */
	public function braceButMalformedProvider(): Generator {
		foreach ( $this->load_fixture()['nonAliases'] as $value ) {
			if ( ! is_string( $value ) || ( strpos( $value, '{' ) === false && strpos( $value, '}' ) === false ) ) {
				continue;
			}

			yield $value => [ 'value' => $value ];
		}
	}

	/**
	 * @return Generator
	 */
	public function plainLiteralProvider(): Generator {
		foreach ( $this->load_fixture()['nonAliases'] as $value ) {
			if ( ! is_string( $value ) || $value === '' || strpos( $value, '{' ) !== false || strpos( $value, '}' ) !== false ) {
				continue;
			}

			yield $value => [ 'value' => $value ];
		}
	}

	/**
	 * The shared alias/cssVar conformance fixture, decoded. The SAME file the jest suite reads, so
	 * neither language can drift without both suites' data changing together.
	 *
	 * @return array{aliases: array<int, array{alias: string, cssVar: string}>, nonAliases: array<int, mixed>}
	 */
	private function load_fixture(): array {
		// phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
		return (array) json_decode( (string) file_get_contents( $this->fixture_path() ), true );
	}

	/**
	 * Absolute path to the shared conformance fixture, derived from the plugin root so it resolves the
	 * same way regardless of which working directory slic runs the suite from.
	 *
	 * @return string
	 */
	private function fixture_path(): string {
		return KADENCE_BLOCKS_PATH . 'src/extension/design-tokens/__tests__/fixtures/token-alias-conformance.json';
	}
}
