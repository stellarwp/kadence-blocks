<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Attribute_Default_Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the editor per-block attribute-default catalog the block-registration filter in
 * early-filters.js reads: a resolved token appears as an empty default, an unresolved token is omitted.
 */
final class Attribute_Default_CatalogTest extends TestCase {

	/**
	 * A resolved icon-size token appears under its block/attribute path as an EMPTY default, whatever unit
	 * the token uses — the editor seeds no size, and the block's preview falls back to the selected preset.
	 *
	 * @dataProvider resolvedLengthProvider
	 *
	 * @param string $length The resolved token value.
	 *
	 * @return void
	 */
	public function testAResolvedTokenAppearsAsAnEmptyDefault( string $length ): void {
		$catalog = $this->catalog_resolving_to( $length );

		$this->assertSame( [ 'kadence/single-icon' => [ 'size' => '' ] ], $catalog->all() );
	}

	/**
	 * @return Generator
	 */
	public function resolvedLengthProvider(): Generator {
		yield 'rem' => [ 'length' => '1.5rem' ];
		yield 'px' => [ 'length' => '24px' ];
		yield 'vw' => [ 'length' => '2vw' ];
	}

	/**
	 * A token with no baseline leaf at all is omitted from the catalog, so block.json's own default stays
	 * in force on a site with no icon-size token.
	 *
	 * @return void
	 */
	public function testUnresolvedTokenIsOmitted(): void {
		$catalog = $this->catalog_for( [] );

		$this->assertSame( [], $catalog->all() );
	}

	/**
	 * `Attribute_Default_Catalog` is registered against the real Token Registry on boot, so the real
	 * container resolves it against the shipped baseline and seeds the empty size — proving the wiring, not
	 * just the catalog class in isolation.
	 *
	 * @return void
	 */
	public function testTheRegisteredCatalogResolvesThroughTheRealContainer(): void {
		$catalog = $this->container->get( Attribute_Default_Catalog::class );

		$this->assertSame( [ 'kadence/single-icon' => [ 'size' => '' ] ], $catalog->all() );
	}

	/**
	 * The gate reads the ACTIVE library, the same one the block-default CSS builds its rule from: a
	 * non-default library that disables the icon-size token gets no `font-size` rule, so the catalog must
	 * omit the entry there and let block.json's own default stand.
	 *
	 * @return void
	 */
	public function testATokenDisabledInTheActiveLibraryOmitsTheEntry(): void {
		$this->activate_library( [ 'semantic' => [ 'icon-size' => [ 'default' => [ '$disabled' => true ] ] ] ] );

		$this->assertSame( [], $this->container->get( Attribute_Default_Catalog::class )->all() );
	}

	/**
	 * A non-default active library that keeps the icon-size token still seeds the empty default, proving
	 * the active-library gate switches on the token's presence there and not on the library being default.
	 *
	 * @return void
	 */
	public function testATokenPresentInTheActiveLibrarySeedsTheEmptyDefault(): void {
		$this->activate_library( [] );

		$this->assertSame(
			[ 'kadence/single-icon' => [ 'size' => '' ] ],
			$this->container->get( Attribute_Default_Catalog::class )->all()
		);
	}

	/**
	 * Build a catalog whose `semantic.icon-size.default` leaf resolves to the given dimension value.
	 *
	 * @param string $value The `$value` the `semantic.icon-size.default` leaf resolves to.
	 *
	 * @return Attribute_Default_Catalog
	 */
	private function catalog_resolving_to( string $value ): Attribute_Default_Catalog {
		return $this->catalog_for(
			[
				'semantic' => [
					'icon-size' => [
						'default' => [
							'$type'  => 'dimension',
							'$value' => $value,
						],
					],
				],
			]
		);
	}

	/**
	 * Build a catalog over a fully-controlled baseline.
	 *
	 * @param array<string, mixed> $baseline The baseline document contents.
	 *
	 * @return Attribute_Default_Catalog
	 */
	private function catalog_for( array $baseline ): Attribute_Default_Catalog {
		$resolver = new Token_Resolver(
			$this->container->get( Token_Store::class ),
			new Effective_Document( new Fake_Baseline_Document( $baseline ) ),
			new Css_Renderer(),
			$this->container->get( Effective_Palettes::class ),
			$this->container->get( Mutator::class )
		);

		return new Attribute_Default_Catalog( $resolver, $this->container->get( Active_Token_Library_Store::class ) );
	}

	/**
	 * Save a non-default library carrying the given overrides and make it the active one. The store only
	 * accepts a slug it knows, so the document is saved before the pointer moves.
	 *
	 * @param array<string, mixed> $overrides The library's overrides-only DTCG document.
	 *
	 * @return void
	 */
	private function activate_library( array $overrides ): void {
		$this->container->get( Token_Store::class )->save_document( (string) wp_json_encode( $overrides ), 'alternate' );
		$this->container->get( Active_Token_Library_Store::class )->set( 'alternate' );
	}
}
