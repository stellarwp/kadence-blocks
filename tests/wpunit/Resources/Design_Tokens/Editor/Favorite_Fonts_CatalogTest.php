<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Favorite_Font_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Editor\Favorite_Fonts_Catalog;
use Tests\Support\Classes\TestCase;

/**
 * Covers the font list the block editor's font-family picker reads: the active library's favorites,
 * and the site's normalized custom family names.
 */
final class Favorite_Fonts_CatalogTest extends TestCase {

	/**
	 * @since TBD
	 *
	 * @var Favorite_Fonts_Catalog
	 */
	private Favorite_Fonts_Catalog $catalog;

	/**
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @since TBD
	 *
	 * @var Favorite_Font_Index
	 */
	private Favorite_Font_Index $index;

	/**
	 * Resolve the catalog and its collaborators from the container.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->catalog = $this->container->get( Favorite_Fonts_Catalog::class );
		$this->store   = $this->container->get( Token_Store::class );
		$this->active  = $this->container->get( Active_Token_Library_Store::class );
		$this->index   = $this->container->get( Favorite_Font_Index::class );
	}

	/**
	 * Reset the active-library pointer and drop the custom-fonts filter each test may have added, so
	 * neither follows the suite into a later case.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		$this->active->set( Token_Store::default_slug() );

		remove_all_filters( 'kadence_blocks_custom_fonts' );

		parent::tearDown();
	}

	/**
	 * A library with no stored favorites reports an empty list rather than omitting the key, so the
	 * client never has to probe for it.
	 *
	 * @return void
	 */
	public function testItReportsAnEmptyFavoritesListForALibraryWithNone(): void {
		$this->assertSame( [], $this->catalog->all()['favorites'] );
	}

	/**
	 * The favorites come back in their stored order — the order every picker renders them in.
	 *
	 * @return void
	 */
	public function testItReportsTheStoredFavoritesInOrder(): void {
		$this->save_favorites( Token_Store::default_slug(), [ 'Inter', 'Abril Fatface' ] );

		$this->assertSame( [ 'Inter', 'Abril Fatface' ], $this->catalog->all()['favorites'] );
	}

	/**
	 * Favorites are read from the ACTIVE library, not the default one: the editor renders the active
	 * library, so pointing it elsewhere must change which favorites the picker lists.
	 *
	 * @return void
	 */
	public function testItReadsFavoritesFromTheActiveLibrary(): void {
		$this->save_favorites( Token_Store::default_slug(), [ 'Inter' ] );
		$this->save_favorites( 'brand-b', [ 'Abril Fatface' ] );

		$this->active->set( 'brand-b' );

		$this->assertSame( [ 'Abril Fatface' ], $this->catalog->all()['favorites'] );
	}

	/**
	 * The custom names arrive normalized to family names. A theme registering a fallback puts the whole
	 * stack in the key, and shipping that verbatim would put `"My Font", sans-serif` in the picker as
	 * one option — this is the reason the catalog ships custom names at all rather than leaving the
	 * editor's raw `c_fonts` to be normalized in JS.
	 *
	 * @return void
	 */
	public function testItReportsCustomFamilyNamesNormalizedFromAStackExpression(): void {
		add_filter(
			'kadence_blocks_custom_fonts',
			static function (): array {
				return [ '"My Font", sans-serif' => [] ];
			}
		);

		$this->assertSame( [ 'My Font' ], $this->catalog->all()['custom'] );
	}

	/**
	 * The Google names are deliberately absent: the editor already carries all ~1,900 of them as
	 * `kadence_blocks_params.g_font_names`, so shipping a second copy would add ~29KB per editor load
	 * to say the same thing twice.
	 *
	 * @return void
	 */
	public function testItDoesNotShipTheGoogleNames(): void {
		$this->assertSame( [ 'favorites', 'custom', 'manageUrl' ], array_keys( $this->catalog->all() ) );
	}

	/**
	 * The manage URL deep-links the Typography screen, not the Style Library's default screen: the
	 * picker's footer exists to get a user to where favorites are edited, and landing them on the
	 * first screen instead would leave them to find it.
	 *
	 * @return void
	 */
	public function testItDeepLinksTheTypographyScreen(): void {
		$url = $this->catalog->all()['manageUrl'];

		$this->assertStringContainsString( 'page=kadence-blocks-style-library', $url );
		$this->assertStringContainsString( 'kb-screen=typography', $url );
	}

	/**
	 * Store a library document carrying only a favorites list.
	 *
	 * @param string       $slug     The token library slug.
	 * @param list<string> $families The favorite families to store.
	 *
	 * @return void
	 */
	private function save_favorites( string $slug, array $families ): void {
		$document = [];

		foreach ( $families as $family ) {
			$document = $this->index->add( $document, $family );
		}

		$this->store->save_document( (string) wp_json_encode( $document ), $slug );
	}
}
