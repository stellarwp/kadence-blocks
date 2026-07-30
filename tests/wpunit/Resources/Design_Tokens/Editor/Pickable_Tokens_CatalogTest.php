<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Pickable_Tokens_Catalog;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the pickable-token pool against the real shipped baseline, so these assertions also guard
 * the token surface the editor token picker offers.
 */
final class Pickable_Tokens_CatalogTest extends TestCase {

	/**
	 * @var Pickable_Tokens_Catalog
	 */
	private Pickable_Tokens_Catalog $catalog;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Resolves the catalog and the store from the container so each test exercises the real shipped
	 * baseline and registered collaborators.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->catalog = $this->container->get( Pickable_Tokens_Catalog::class );
		$this->store   = $this->container->get( Token_Store::class );
	}

	/**
	 * Every token entry carries the full pickable shape and wraps its own id as the alias.
	 *
	 * @return void
	 */
	public function testEveryTokenEntryWrapsItsIdAsTheAlias(): void {
		$tokens = $this->catalog->all()['tokens'];

		$this->assertNotEmpty( $tokens );

		foreach ( $tokens as $token ) {
			$this->assertSame( [ 'id', 'alias', 'label', 'type', 'layer', 'role' ], array_keys( $token ) );
			$this->assertSame( '{' . $token['id'] . '}', $token['alias'] );
			$this->assertNotSame( '', $token['label'] );
		}
	}

	/**
	 * A semantic token reports the sub-kind segment right after the layer as its role (`semantic.<role>.…`),
	 * so a control can narrow one `$type` to the tokens of its sub-kind. Pool-driven so it asserts against
	 * whatever ids the loaded baseline registers rather than hardcoded ids.
	 *
	 * @return void
	 */
	public function testSemanticRoleIsTheSegmentAfterTheLayer(): void {
		$semantic = array_filter(
			$this->catalog->all()['tokens'],
			static fn( array $token ): bool => strpos( $token['id'], 'semantic.' ) === 0
		);

		$this->assertNotEmpty( $semantic );

		foreach ( $semantic as $token ) {
			$this->assertSame( explode( '.', $token['id'] )[1], $token['role'] );
		}
	}

	/**
	 * A primitive dimension token reports the segment AFTER the `primitive.dimension.` wrapper as its
	 * role, so the wrapper never leaks in as the role and a primitive lines up with the semantic token of
	 * the same sub-kind.
	 *
	 * @return void
	 */
	public function testPrimitiveDimensionRoleStripsTheWrapper(): void {
		$primitive_dimensions = array_filter(
			$this->catalog->all()['tokens'],
			static fn( array $token ): bool => strpos( $token['id'], 'primitive.dimension.' ) === 0
		);

		$this->assertNotEmpty( $primitive_dimensions );

		foreach ( $primitive_dimensions as $token ) {
			$this->assertSame( explode( '.', $token['id'] )[2], $token['role'] );
			$this->assertNotSame( 'dimension', $token['role'] );
		}
	}

	/**
	 * A semantic dimension token and the primitive dimension tokens of the same sub-kind share a role,
	 * so narrowing by role spans both layers rather than splitting on the `primitive.dimension.` wrapper.
	 * Uses `spacing`, which every baseline registers in both layers.
	 *
	 * @return void
	 */
	public function testSemanticAndPrimitiveShareARoleForTheSameSubKind(): void {
		$tokens = $this->catalog->all()['tokens'];

		$semantic  = $this->first_with_prefix( $tokens, 'semantic.spacing.' );
		$primitive = $this->first_with_prefix( $tokens, 'primitive.dimension.spacing.' );

		$this->assertSame( 'spacing', $semantic['role'] );
		$this->assertSame( $semantic['role'], $primitive['role'] );
	}

	/**
	 * A token's layer is derived from its id's first dot-segment, so every token under a layer prefix
	 * reports that layer.
	 *
	 * @dataProvider layerProvider
	 *
	 * @param string $prefix   The id prefix selecting the tokens under one layer.
	 * @param string $expected The layer every matching token must report.
	 *
	 * @return void
	 */
	public function testLayerIsDerivedFromTheIdFirstSegment( string $prefix, string $expected ): void {
		$matching = array_filter(
			$this->catalog->all()['tokens'],
			static fn( array $token ): bool => strpos( $token['id'], $prefix ) === 0
		);

		// The shipped baseline registers tokens in both layers; an empty match means the fixture broke.
		$this->assertNotEmpty( $matching );

		foreach ( $matching as $token ) {
			$this->assertSame( $expected, $token['layer'] );
		}
	}

	/**
	 * The values map is keyed by library slug and resolves each token to a literal: a color token to a
	 * color literal (hex / rgb) and a dimension token to a CSS length, never an alias or a var() chain.
	 *
	 * @return void
	 */
	public function testValuesResolveToLiteralsPerLibrary(): void {
		$pool   = $this->catalog->all();
		$values = $pool['values'];

		$this->assertArrayHasKey( Token_Store::default_slug(), $values );

		$defaults = $values[ Token_Store::default_slug() ];

		// Not just the first color entry — the baseline also registers keyword literals (e.g.
		// "transparent"), so pick the first one that resolves to a hex/rgb/hsl literal to exercise the
		// intended assertion.
		$color = $this->first_matching(
			$pool['tokens'],
			'color',
			static fn( string $value ): bool => (bool) preg_match( '/^(#|rgb|hsl)/i', $value ),
			$defaults
		);

		$dimension = $this->first_of_type( $pool['tokens'], 'dimension' );

		$this->assertMatchesRegularExpression( '/^(#|rgb|hsl)/i', $defaults[ $color['id'] ] );
		$this->assertMatchesRegularExpression( '/^-?[\d.]+[a-z%]*$/i', $defaults[ $dimension['id'] ] );

		// Preview values are literals, never unresolved references.
		$this->assertStringNotContainsString( '{', $defaults[ $color['id'] ] );
		$this->assertStringNotContainsString( 'var(', $defaults[ $color['id'] ] );
	}

	/**
	 * A library whose stored document cannot be resolved is skipped from the values map while its siblings
	 * (the default library) survive, so one corrupt library never empties the pool.
	 *
	 * @return void
	 */
	public function testACorruptLibraryIsSkippedFromValues(): void {
		// Raw store write (bypasses the REST validation gate that would reject a dangling alias),
		// mirroring the raw-DB-write scenario the resolver's fail-soft guards exist for.
		$this->store->save_document(
			wp_json_encode(
				[
					'semantic' => [
						'color' => [
							'border' => [
								'$type'  => 'color',
								'$value' => '{primitive.color.does-not-exist}',
							],
						],
					],
				]
			),
			'broken'
		);

		$values = $this->container->get( Pickable_Tokens_Catalog::class )->all()['values'];

		$this->assertArrayHasKey( Token_Store::default_slug(), $values );
		$this->assertArrayNotHasKey( 'broken', $values );
	}

	/**
	 * @return Generator
	 */
	public function layerProvider(): Generator {
		yield 'semantic tokens' => [
			'prefix'   => 'semantic.',
			'expected' => 'semantic',
		];

		yield 'primitive tokens' => [
			'prefix'   => 'primitive.',
			'expected' => 'primitive',
		];
	}

	/**
	 * The first token entry of a given type, failing the test when the baseline registers none.
	 *
	 * @param array<int, array<string, string>> $tokens The pool's token entries.
	 * @param string                            $type   The DTCG type to find.
	 *
	 * @return array<string, string> The first matching token entry.
	 */
	private function first_of_type( array $tokens, string $type ): array {
		foreach ( $tokens as $token ) {
			if ( $token['type'] === $type ) {
				return $token;
			}
		}

		$this->fail( sprintf( 'No token of type "%s" in the pool.', $type ) );
	}

	/**
	 * The first token entry whose id starts with a prefix, failing the test when the baseline registers
	 * none (a broken fixture) so a renamed baseline prefix surfaces as a clear failure rather than a
	 * silent skip.
	 *
	 * @param array<int, array<string, string>> $tokens The pool's token entries.
	 * @param string                            $prefix The id prefix to find.
	 *
	 * @return array<string, string> The first matching token entry.
	 */
	private function first_with_prefix( array $tokens, string $prefix ): array {
		foreach ( $tokens as $token ) {
			if ( strpos( $token['id'], $prefix ) === 0 ) {
				return $token;
			}
		}

		$this->fail( sprintf( 'No token with id prefix "%s" in the pool.', $prefix ) );
	}

	/**
	 * The first token entry of a given type whose resolved default-library value satisfies a predicate,
	 * failing the test when the baseline has no such token (e.g. every entry of that type resolves to a
	 * keyword literal instead of a hex/rgb/hsl one).
	 *
	 * @param array<int, array<string, string>> $tokens    The pool's token entries.
	 * @param string                            $type      The DTCG type to find.
	 * @param callable                          $predicate Receives the resolved literal, returns whether it matches.
	 * @param array<string, string>             $defaults  The default library's resolved values, keyed by id.
	 *
	 * @return array<string, string> The first matching token entry.
	 */
	private function first_matching( array $tokens, string $type, callable $predicate, array $defaults ): array {
		foreach ( $tokens as $token ) {
			if ( $token['type'] === $type && isset( $defaults[ $token['id'] ] ) && $predicate( $defaults[ $token['id'] ] ) ) {
				return $token;
			}
		}

		$this->fail( sprintf( 'No token of type "%s" with a matching resolved value in the pool.', $type ) );
	}
}
