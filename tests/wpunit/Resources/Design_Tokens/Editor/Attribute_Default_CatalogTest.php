<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Attribute_Default_Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the editor per-block attribute-default catalog the block-registration filter in
 * early-filters.js reads: a resolved token converts and appears in the catalog, an unresolved
 * token is omitted, and a resolved value this catalog cannot convert is omitted too.
 */
final class Attribute_Default_CatalogTest extends TestCase {

	/**
	 * A resolved `rem` token converts to px and appears under its block/attribute path.
	 *
	 * @return void
	 */
	public function testResolvedRemTokenAppearsConvertedToPx(): void {
		$catalog = $this->catalog_resolving_to( '1.5rem' );

		$this->assertSame( [ 'kadence/single-icon' => [ 'size' => 24.0 ] ], $catalog->all() );
	}

	/**
	 * A resolved `px` token appears as a bare number, unconverted.
	 *
	 * @return void
	 */
	public function testResolvedPxTokenAppearsAsIs(): void {
		$catalog = $this->catalog_resolving_to( '24px' );

		$this->assertSame( [ 'kadence/single-icon' => [ 'size' => 24.0 ] ], $catalog->all() );
	}

	/**
	 * A token with no baseline leaf at all is omitted from the catalog rather than guessed.
	 *
	 * @return void
	 */
	public function testUnresolvedTokenIsOmitted(): void {
		$catalog = $this->catalog_for( [] );

		$this->assertSame( [], $catalog->all() );
	}

	/**
	 * A resolved value in a unit this catalog cannot safely convert is omitted rather than guessed.
	 *
	 * @return void
	 */
	public function testUnconvertibleResolvedValueIsOmitted(): void {
		$catalog = $this->catalog_resolving_to( '2vw' );

		$this->assertSame( [], $catalog->all() );
	}

	/**
	 * `Attribute_Default_Catalog` is registered against the real Token Registry on boot, so the real
	 * container resolves it with the shipped baseline's `semantic.icon-size.default` (1.5rem, i.e.
	 * 24px) — proving the wiring, not just the catalog class in isolation.
	 *
	 * @return void
	 */
	public function testTheRegisteredCatalogResolvesThroughTheRealContainer(): void {
		$catalog = $this->container->get( Attribute_Default_Catalog::class );

		$this->assertSame( [ 'kadence/single-icon' => [ 'size' => 24.0 ] ], $catalog->all() );
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
			new Css_Renderer()
		);

		return new Attribute_Default_Catalog( $resolver );
	}
}
