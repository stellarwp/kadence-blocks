<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Set_Catalog;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the editor token-set catalog the per-block set-override picker reads: the default-inclusive
 * listing, its display labels, and the active-set pointer.
 */
final class Set_CatalogTest extends TestCase {

	/**
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->active = $this->container->get( Active_Set_Store::class );
		$this->store  = $this->container->get( Token_Store::class );
	}

	/**
	 * With no stored sets the catalog still offers the always-addressable default, labeled and active.
	 *
	 * @return void
	 */
	public function testItListsOnlyTheDefaultSetWhenNothingIsStored(): void {
		$catalog = $this->catalog();

		$this->assertSame( Token_Store::default_slug(), $catalog['active'] );
		$this->assertSame(
			[
				[
					'slug'  => Token_Store::default_slug(),
					'label' => 'Default',
				],
			],
			$catalog['sets']
		);
	}

	/**
	 * Stored sets appear with their titles as labels, the default is synthesized at the front, and the
	 * listing follows the store's slug order.
	 *
	 * @return void
	 */
	public function testItListsStoredSetsWithTitlesAndSynthesizesTheDefault(): void {
		$this->store->save_document( '{}', 'brand-b', 'Brand B' );
		$this->store->save_document( '{}', 'dark', 'Dark' );

		$catalog = $this->catalog();

		$this->assertSame( Token_Store::default_slug(), $catalog['active'] );
		$this->assertSame(
			[
				[
					'slug'  => Token_Store::default_slug(),
					'label' => 'Default',
				],
				[
					'slug'  => 'brand-b',
					'label' => 'Brand B',
				],
				[
					'slug'  => 'dark',
					'label' => 'Dark',
				],
			],
			$catalog['sets']
		);
	}

	/**
	 * A non-default set with no title falls back to its slug for the label.
	 *
	 * @return void
	 */
	public function testItLabelsASetWithoutATitleUsingItsSlug(): void {
		$this->store->save_document( '{}', 'brand-b' );

		$sets = $this->indexBySlug( $this->catalog()['sets'] );

		$this->assertSame( 'brand-b', $sets['brand-b']['label'] );
	}

	/**
	 * A stored default row's title wins over the synthesized "Default" label.
	 *
	 * @return void
	 */
	public function testItUsesTheStoredTitleForTheDefaultSet(): void {
		$this->store->save_document( '{}', Token_Store::default_slug(), 'House Palette' );

		$sets = $this->indexBySlug( $this->catalog()['sets'] );

		$this->assertSame( 'House Palette', $sets[ Token_Store::default_slug() ]['label'] );
		// The default is not duplicated when it has a real row.
		$this->assertCount( 1, $this->catalog()['sets'] );
	}

	/**
	 * The default set is listed first even when a stored set's slug sorts ahead of it alphabetically.
	 *
	 * @return void
	 */
	public function testItPlacesTheDefaultSetFirstRegardlessOfSlugOrder(): void {
		// 'brand-a' sorts before 'default' in the store's slug-ASC listing.
		$this->store->save_document( '{}', 'brand-a', 'Brand A' );
		$this->store->save_document( '{}', Token_Store::default_slug(), 'House Palette' );

		$slugs = array_column( $this->catalog()['sets'], 'slug' );

		$this->assertSame( [ Token_Store::default_slug(), 'brand-a' ], $slugs );
	}

	/**
	 * The catalog reports the active-set pointer.
	 *
	 * @return void
	 */
	public function testItReflectsTheActivePointer(): void {
		$this->store->save_document( '{}', 'brand-b', 'Brand B' );
		$this->active->set( 'brand-b' );

		$this->assertSame( 'brand-b', $this->catalog()['active'] );
	}

	/**
	 * Build the catalog under test from the container-resolved stores.
	 *
	 * @return array{active: string, sets: array<int, array{slug: string, label: string}>}
	 */
	private function catalog(): array {
		return ( new Set_Catalog( $this->store, $this->active ) )->all();
	}

	/**
	 * Re-key a catalog's set list by slug, for assertions that target a single set.
	 *
	 * @param array<int, array{slug: string, label: string}> $sets The set list.
	 *
	 * @return array<string, array{slug: string, label: string}>
	 */
	private function indexBySlug( array $sets ): array {
		$indexed = [];

		foreach ( $sets as $set ) {
			$indexed[ $set['slug'] ] = $set;
		}

		return $indexed;
	}
}
